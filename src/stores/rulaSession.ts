import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ChoiceOption, FlowStep, QuestionStep } from '@/assessments/types'
import {
  buildRulaFlow,
  sidesForMode,
  scoreRula,
  lookupTableA,
  lookupTableB,
} from '@/assessments/rula'
import type {
  RulaMode,
  RulaSide,
  RulaUpperLimbInput,
  RulaNeckTrunkLegInput,
  RulaResult,
} from '@/assessments/rula'

export interface PersonalDetails {
  email: string
  assessee: string
  assessor: string
  department: string
  company: string
  date: string
}

export interface SideLiveScores {
  side: RulaSide
  upperArm: number
  lowerArm: number
  wrist: number
  wristTwist: number
  muscleForce: number
  /** Table A posture score, once all Part A answers are in. */
  tableA: number | null
  /** Score C (arm & wrist total), once all Part A answers are in. */
  total: number | null
}

export interface BodyLiveScores {
  neck: number
  trunk: number
  legs: number
  muscleForce: number
  tableB: number | null
  total: number | null
}

function emptyDetails(): PersonalDetails {
  return { email: '', assessee: '', assessor: '', department: '', company: '', date: '' }
}

/** Snapshot of an in-progress session in localStorage (key naming follows `rula-theme`). */
interface PersistedSession {
  version: number
  savedAt: number
  mode: RulaMode
  stepIndex: number
  selections: Record<string, string>
  flags: Record<string, boolean>
  details: PersonalDetails
}

const STORAGE_KEY = 'rula-session'
const STORAGE_VERSION = 1
/** Saves older than this are dropped on load rather than restored. */
const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000
const RULA_MODES: readonly RulaMode[] = ['right', 'left', 'both']

/** localStorage when usable; null during SSG prerender or if storage is blocked. */
function browserStorage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Keep only the known string fields of a parsed details object. */
function sanitizeDetails(value: unknown): PersonalDetails {
  const details = emptyDetails()
  if (!isRecord(value)) return details
  for (const key of Object.keys(details) as (keyof PersonalDetails)[]) {
    const field = value[key]
    if (typeof field === 'string') details[key] = field
  }
  return details
}

/** Read and validate the saved session, discarding anything stale or malformed. */
function readSavedSession(): PersistedSession | null {
  const storage = browserStorage()
  if (!storage) return null
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      isRecord(parsed) &&
      parsed.version === STORAGE_VERSION &&
      typeof parsed.savedAt === 'number' &&
      Date.now() - parsed.savedAt <= MAX_SESSION_AGE_MS &&
      RULA_MODES.includes(parsed.mode as RulaMode) &&
      typeof parsed.stepIndex === 'number' &&
      Number.isInteger(parsed.stepIndex) &&
      parsed.stepIndex >= 0 &&
      isRecord(parsed.selections) &&
      isRecord(parsed.flags)
    ) {
      return {
        version: STORAGE_VERSION,
        savedAt: parsed.savedAt,
        mode: parsed.mode as RulaMode,
        stepIndex: parsed.stepIndex,
        selections: parsed.selections as Record<string, string>,
        flags: parsed.flags as Record<string, boolean>,
        details: sanitizeDetails(parsed.details),
      }
    }
  } catch {
    /* corrupt JSON — treated the same as a failed validation */
  }
  try {
    storage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
  return null
}

export const useRulaSession = defineStore('rulaSession', () => {
  const mode = ref<RulaMode>('right')
  const stepIndex = ref(0)
  /** Selected option id per question step id, e.g. { "right.upperArm": "right.upperArm.3" }. */
  const selections = ref<Record<string, string>>({})
  /** Ticked adjustment checkboxes by option id. */
  const flags = ref<Record<string, boolean>>({})
  const details = ref<PersonalDetails>(emptyDetails())

  const flow = computed<FlowStep[]>(() => buildRulaFlow(mode.value))

  const questionSteps = computed<QuestionStep[]>(() =>
    flow.value.filter((s): s is QuestionStep => s.kind === 'question'),
  )

  const stepsById = computed<Map<string, QuestionStep>>(
    () => new Map(questionSteps.value.map((s) => [s.id, s])),
  )

  const currentStep = computed<FlowStep>(
    () => flow.value[Math.min(stepIndex.value, flow.value.length - 1)],
  )

  const sides = computed<RulaSide[]>(() => sidesForMode(mode.value))

  /** The chosen option for a step, resolved against the step definition. */
  function selectedOption(stepId: string): ChoiceOption | undefined {
    const optionId = selections.value[stepId]
    if (optionId === undefined) return undefined
    return stepsById.value.get(stepId)?.options.find((o) => o.id === optionId)
  }

  /** Score value of the chosen option, or undefined while unanswered. */
  function choiceValue(stepId: string): number | undefined {
    return selectedOption(stepId)?.value
  }

  function isAnswered(stepId: string): boolean {
    return choiceValue(stepId) !== undefined
  }

  /** Index of the furthest flow step the user is allowed to reach. */
  const maxReachableIndex = computed<number>(() => {
    for (let i = 0; i < flow.value.length; i++) {
      const step = flow.value[i]
      if (step.kind === 'question' && !isAnswered(step.id)) return i
    }
    return flow.value.length - 1
  })

  const allQuestionsAnswered = computed<boolean>(() =>
    questionSteps.value.every((s) => isAnswered(s.id)),
  )

  /** Sum of ticked adjustment values for a question step (0 if none). */
  function adjustmentSum(stepId: string): number {
    const step = questionSteps.value.find((s) => s.id === stepId)
    if (!step?.adjustments) return 0
    return step.adjustments.options.reduce(
      (sum, opt) => sum + (flags.value[opt.id] ? opt.value : 0),
      0,
    )
  }

  /** Engine input for one arm, or null while Part A is incomplete. */
  function upperLimbInput(side: RulaSide): RulaUpperLimbInput | null {
    const upperArm = choiceValue(`${side}.upperArm`)
    const lowerArm = choiceValue(`${side}.lowerArm`)
    const wrist = choiceValue(`${side}.wrist`)
    const wristTwist = choiceValue(`${side}.wristTwist`)
    const forceLoad = choiceValue(`${side}.forceLoad`)
    if (
      upperArm === undefined ||
      lowerArm === undefined ||
      wrist === undefined ||
      wristTwist === undefined ||
      forceLoad === undefined
    ) {
      return null
    }
    return {
      upperArm,
      upperArmAdjust: adjustmentSum(`${side}.upperArm`),
      lowerArm,
      lowerArmAdjust: adjustmentSum(`${side}.lowerArm`),
      wrist,
      wristAdjust: adjustmentSum(`${side}.wrist`),
      wristTwist,
      forceLoad,
      // The force/load step's only adjustment is the static-muscle-use tick.
      muscleUse: adjustmentSum(`${side}.forceLoad`),
    }
  }

  /** Engine input for Part B, or null while incomplete. */
  const neckTrunkLegInput = computed<RulaNeckTrunkLegInput | null>(() => {
    const neck = choiceValue('body.neck')
    const trunk = choiceValue('body.trunk')
    const legs = choiceValue('body.legs')
    const forceLoad = choiceValue('body.forceLoad')
    if (neck === undefined || trunk === undefined || legs === undefined || forceLoad === undefined) {
      return null
    }
    return {
      neck,
      neckAdjust: adjustmentSum('body.neck'),
      trunk,
      trunkAdjust: adjustmentSum('body.trunk'),
      legs,
      forceLoad,
      muscleUse: adjustmentSum('body.forceLoad'),
    }
  })

  /** Final results per assessed side; empty until enough answers exist. */
  const results = computed<Partial<Record<RulaSide, RulaResult>>>(() => {
    const body = neckTrunkLegInput.value
    if (!body) return {}
    const out: Partial<Record<RulaSide, RulaResult>> = {}
    for (const side of sides.value) {
      const upper = upperLimbInput(side)
      if (upper) out[side] = scoreRula(upper, body)
    }
    return out
  })

  /** Running Part A scores for the live panel (legacy "Progress so far"). */
  function sideLiveScores(side: RulaSide): SideLiveScores {
    const sum = (stepId: string) => {
      const value = choiceValue(stepId)
      return value === undefined ? 0 : value + adjustmentSum(stepId)
    }
    const upper = upperLimbInput(side)
    const tableA = upper ? lookupTableA(upper) : null
    return {
      side,
      upperArm: sum(`${side}.upperArm`),
      lowerArm: sum(`${side}.lowerArm`),
      wrist: sum(`${side}.wrist`),
      wristTwist: choiceValue(`${side}.wristTwist`) ?? 0,
      muscleForce: (choiceValue(`${side}.forceLoad`) ?? 0) + adjustmentSum(`${side}.forceLoad`),
      tableA,
      total: upper && tableA !== null ? tableA + upper.forceLoad + upper.muscleUse : null,
    }
  }

  /** Running Part B scores for the live panel. */
  const bodyLiveScores = computed<BodyLiveScores>(() => {
    const sum = (stepId: string) => {
      const value = choiceValue(stepId)
      return value === undefined ? 0 : value + adjustmentSum(stepId)
    }
    const body = neckTrunkLegInput.value
    const tableB = body ? lookupTableB(body) : null
    return {
      neck: sum('body.neck'),
      trunk: sum('body.trunk'),
      legs: choiceValue('body.legs') ?? 0,
      muscleForce: (choiceValue('body.forceLoad') ?? 0) + adjustmentSum('body.forceLoad'),
      tableB,
      total: body && tableB !== null ? tableB + body.forceLoad + body.muscleUse : null,
    }
  })

  /** Enter the flow for a mode. Progress is kept unless the mode changes. */
  function start(newMode: RulaMode) {
    if (newMode !== mode.value) {
      mode.value = newMode
      reset()
    }
  }

  function reset() {
    stepIndex.value = 0
    selections.value = {}
    flags.value = {}
    details.value = emptyDetails()
  }

  function choose(stepId: string, optionId: string) {
    selections.value[stepId] = optionId
  }

  function setFlag(optionId: string, on: boolean) {
    flags.value[optionId] = on
  }

  function next() {
    if (stepIndex.value < maxReachableIndex.value) stepIndex.value++
  }

  function back() {
    if (stepIndex.value > 0) stepIndex.value--
  }

  function goTo(index: number) {
    if (index >= 0 && index <= maxReachableIndex.value) stepIndex.value = index
  }

  // Persistence: an accidental refresh must not lose an in-progress session.

  /** Read once at store creation, before any state change can overwrite the save. */
  let savedSession = readSavedSession()

  /** True while nothing has been answered, ticked or typed. */
  function isPristine(): boolean {
    return (
      stepIndex.value === 0 &&
      Object.keys(selections.value).length === 0 &&
      Object.values(flags.value).every((on) => !on) &&
      Object.values(details.value).every((field) => field === '')
    )
  }

  function persist() {
    const storage = browserStorage()
    if (!storage) return
    try {
      if (isPristine()) {
        storage.removeItem(STORAGE_KEY)
        return
      }
      const snapshot: PersistedSession = {
        version: STORAGE_VERSION,
        savedAt: Date.now(),
        mode: mode.value,
        stepIndex: stepIndex.value,
        selections: selections.value,
        flags: flags.value,
        details: details.value,
      }
      storage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    } catch {
      /* quota exceeded / private browsing — persistence is best-effort */
    }
  }

  watch([mode, stepIndex, selections, flags, details], persist, { deep: true })

  /**
   * Apply the saved session to a pristine store of the same mode. The
   * assessment page calls this after hydration, so prerendered HTML never
   * mismatches. Answers whose step/option ids no longer exist are dropped and
   * the step index is clamped, so a deploy between visits cannot break the flow.
   */
  function restore(): boolean {
    if (!savedSession || savedSession.mode !== mode.value || !isPristine()) return false

    const restoredSelections: Record<string, string> = {}
    for (const [stepId, optionId] of Object.entries(savedSession.selections)) {
      const step = stepsById.value.get(stepId)
      if (step?.options.some((option) => option.id === optionId)) {
        restoredSelections[stepId] = optionId
      }
    }
    const knownFlagIds = new Set(
      questionSteps.value.flatMap((step) => step.adjustments?.options.map((o) => o.id) ?? []),
    )
    const restoredFlags: Record<string, boolean> = {}
    for (const [flagId, on] of Object.entries(savedSession.flags)) {
      if (on === true && knownFlagIds.has(flagId)) restoredFlags[flagId] = true
    }

    const hasAnswers = Object.keys(restoredSelections).length > 0
    const hasDetails = Object.values(savedSession.details).some((field) => field !== '')
    if (!hasAnswers && !hasDetails) {
      savedSession = null
      return false
    }

    selections.value = restoredSelections
    flags.value = restoredFlags
    details.value = savedSession.details
    stepIndex.value = Math.min(savedSession.stepIndex, maxReachableIndex.value)
    savedSession = null
    return true
  }

  return {
    mode,
    stepIndex,
    selections,
    flags,
    details,
    flow,
    questionSteps,
    currentStep,
    sides,
    selectedOption,
    choiceValue,
    isAnswered,
    maxReachableIndex,
    allQuestionsAnswered,
    adjustmentSum,
    upperLimbInput,
    neckTrunkLegInput,
    results,
    sideLiveScores,
    bodyLiveScores,
    start,
    reset,
    choose,
    setFlag,
    next,
    back,
    goTo,
    restore,
  }
})
