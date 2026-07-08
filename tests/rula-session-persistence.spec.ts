import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useRulaSession } from '@/stores/rulaSession'

const STORAGE_KEY = 'rula-session'
const DAY_MS = 24 * 60 * 60 * 1000

/** Minimal in-memory Storage so the node test environment can exercise persistence. */
class MemoryStorage {
  private data = new Map<string, string>()
  get length() {
    return this.data.size
  }
  clear() {
    this.data.clear()
  }
  getItem(key: string) {
    return this.data.get(key) ?? null
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null
  }
  removeItem(key: string) {
    this.data.delete(key)
  }
  setItem(key: string, value: string) {
    this.data.set(key, value)
  }
}

const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')

/** Write a saved session directly, as a previous visit would have left it. */
function seed(overrides: Record<string, unknown> = {}) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      savedAt: Date.now(),
      mode: 'right',
      stepIndex: 2,
      selections: { 'right.upperArm': 'right.upperArm.2', 'right.lowerArm': 'right.lowerArm.1' },
      flags: { 'right.upperArm.shoulderRaised': true },
      details: { email: '', assessee: 'Jo', assessor: '', department: '', company: '', date: '' },
      ...overrides,
    }),
  )
}

/** A brand-new store instance, as after a page refresh (same storage, new pinia). */
function freshSession() {
  setActivePinia(createPinia())
  return useRulaSession()
}

function savedRaw(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

describe('rula session persistence', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: new MemoryStorage() as unknown as Storage,
      configurable: true,
      writable: true,
    })
    setActivePinia(createPinia())
  })

  afterEach(() => {
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage)
    else delete (globalThis as { localStorage?: Storage }).localStorage
  })

  it('persists answers, flags, details and position as they change', async () => {
    const session = useRulaSession()
    session.start('right')
    session.choose('right.upperArm', 'right.upperArm.2')
    session.setFlag('right.upperArm.shoulderRaised', true)
    session.details.assessee = 'Jo'
    session.next()
    await nextTick()

    const saved = JSON.parse(savedRaw()!)
    expect(saved.version).toBe(1)
    expect(saved.mode).toBe('right')
    expect(saved.stepIndex).toBe(1)
    expect(saved.selections['right.upperArm']).toBe('right.upperArm.2')
    expect(saved.flags['right.upperArm.shoulderRaised']).toBe(true)
    expect(saved.details.assessee).toBe('Jo')
    expect(typeof saved.savedAt).toBe('number')
  })

  it('round-trips a session across a refresh', async () => {
    const first = useRulaSession()
    first.start('left')
    first.choose('left.upperArm', 'left.upperArm.3')
    first.choose('left.lowerArm', 'left.lowerArm.2')
    first.setFlag('left.upperArm.abducted', true)
    first.details.assessee = 'Jo'
    first.next()
    first.next()
    await nextTick()

    const second = freshSession()
    second.start('left')
    expect(second.restore()).toBe(true)

    expect(second.mode).toBe('left')
    expect(second.stepIndex).toBe(2)
    expect(second.selections).toEqual({
      'left.upperArm': 'left.upperArm.3',
      'left.lowerArm': 'left.lowerArm.2',
    })
    expect(second.flags).toEqual({ 'left.upperArm.abducted': true })
    expect(second.details.assessee).toBe('Jo')
    expect(second.choiceValue('left.upperArm')).toBe(2)
  })

  it('does not restore a save from a different mode', () => {
    seed({ mode: 'right' })
    const session = freshSession()
    session.start('left')
    expect(session.restore()).toBe(false)
    expect(session.selections).toEqual({})
  })

  it('drops saves older than 24 hours', () => {
    seed({ savedAt: Date.now() - DAY_MS - 1 })
    const session = freshSession()
    session.start('right')
    expect(session.restore()).toBe(false)
    expect(savedRaw()).toBeNull()
  })

  it('drops corrupt JSON without throwing', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    const session = freshSession()
    session.start('right')
    expect(session.restore()).toBe(false)
    expect(savedRaw()).toBeNull()
  })

  it('drops saves with an unknown version or malformed fields', () => {
    seed({ version: 99 })
    let session = freshSession()
    session.start('right')
    expect(session.restore()).toBe(false)
    expect(savedRaw()).toBeNull()

    seed({ stepIndex: -3 })
    session = freshSession()
    session.start('right')
    expect(session.restore()).toBe(false)

    seed({ selections: 'oops' })
    session = freshSession()
    session.start('right')
    expect(session.restore()).toBe(false)
  })

  it('drops answer ids that no longer exist and clamps the step index', () => {
    seed({
      stepIndex: 42,
      selections: {
        'right.upperArm': 'right.upperArm.2',
        'right.gone': 'right.gone.1',
        'right.lowerArm': 'right.lowerArm.99',
      },
      flags: { 'right.upperArm.shoulderRaised': true, 'bogus.flag': true },
    })
    const session = freshSession()
    session.start('right')

    expect(session.restore()).toBe(true)
    expect(session.selections).toEqual({ 'right.upperArm': 'right.upperArm.2' })
    expect(session.flags).toEqual({ 'right.upperArm.shoulderRaised': true })
    // Clamped to the first unanswered question, not the saved index.
    expect(session.stepIndex).toBe(session.maxReachableIndex)
    expect(session.stepIndex).toBe(1)
  })

  it('never overwrites answers already made this visit', () => {
    seed()
    const session = freshSession()
    session.start('right')
    session.choose('right.upperArm', 'right.upperArm.4')

    expect(session.restore()).toBe(false)
    expect(session.selections['right.upperArm']).toBe('right.upperArm.4')
  })

  it('restores only once per visit', () => {
    seed()
    const session = freshSession()
    session.start('right')
    expect(session.restore()).toBe(true)
    session.reset()
    expect(session.restore()).toBe(false)
  })

  it('treats a save with no answers or details as nothing to restore', () => {
    seed({
      stepIndex: 0,
      selections: {},
      flags: {},
      details: { email: '', assessee: '', assessor: '', department: '', company: '', date: '' },
    })
    const session = freshSession()
    session.start('right')
    expect(session.restore()).toBe(false)
  })

  it('reset clears the saved session', async () => {
    const session = useRulaSession()
    session.start('right')
    session.choose('right.upperArm', 'right.upperArm.2')
    await nextTick()
    expect(savedRaw()).not.toBeNull()

    session.reset()
    await nextTick()
    expect(savedRaw()).toBeNull()
  })

  it('switching modes discards the previous save', async () => {
    const session = useRulaSession()
    session.start('right')
    session.choose('right.upperArm', 'right.upperArm.2')
    await nextTick()
    expect(savedRaw()).not.toBeNull()

    session.start('both')
    await nextTick()
    expect(savedRaw()).toBeNull()
  })

  it('sanitizes non-string details fields on restore', () => {
    seed({
      details: { email: 42, assessee: 'Jo', assessor: null, department: {}, company: '', date: '' },
    })
    const session = freshSession()
    session.start('right')

    expect(session.restore()).toBe(true)
    expect(session.details.email).toBe('')
    expect(session.details.assessee).toBe('Jo')
    expect(session.details.assessor).toBe('')
  })

  it('stays inert when localStorage is unavailable (SSG prerender)', () => {
    delete (globalThis as { localStorage?: Storage }).localStorage
    const session = freshSession()
    session.start('right')
    session.choose('right.upperArm', 'right.upperArm.2')
    expect(session.restore()).toBe(false)
    expect(session.selections['right.upperArm']).toBe('right.upperArm.2')
  })
})
