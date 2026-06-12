/**
 * Locks down the question/option values that feed the scoring engine.
 * These mirror the radio/checkbox values of the legacy assessment pages —
 * changing any of them changes scores, so changes here must be deliberate.
 */
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildRulaFlow } from '@/assessments/rula/questions'
import type { QuestionStep } from '@/assessments/types'

const here = dirname(fileURLToPath(import.meta.url))

const ARM_OPTION_VALUES = {
  upperArm: [1, 2, 2, 3, 4],
  lowerArm: [1, 2, 2],
  wrist: [1, 2, 3, 3],
  wristTwist: [1, 2],
  forceLoad: [0, 1, 2, 3],
}

const ARM_ADJUSTMENT_VALUES = {
  upperArm: [1, 1, -1],
  lowerArm: [1],
  wrist: [1],
  wristTwist: undefined,
  forceLoad: [1],
}

const BODY_OPTION_VALUES = {
  neck: [1, 2, 3, 4],
  trunk: [1, 2, 3, 4],
  legs: [1, 2],
  forceLoad: [0, 1, 2, 3],
}

const BODY_ADJUSTMENT_VALUES = {
  neck: [1, 1],
  trunk: [1, 1],
  legs: undefined,
  forceLoad: [1],
}

function questionSteps(mode: 'right' | 'left' | 'both'): QuestionStep[] {
  return buildRulaFlow(mode).filter((s): s is QuestionStep => s.kind === 'question')
}

function expectStepValues(step: QuestionStep, options: number[], adjustments: number[] | undefined) {
  expect(step.options.map((o) => o.value), `${step.id} option values`).toEqual(options)
  expect(step.adjustments?.options.map((o) => o.value), `${step.id} adjustment values`).toEqual(
    adjustments,
  )
}

describe.each(['right', 'left'] as const)('%s-side flow', (side) => {
  const steps = questionSteps(side)

  it('asks the legacy question sequence', () => {
    expect(steps.map((s) => s.id)).toEqual([
      `${side}.upperArm`,
      `${side}.lowerArm`,
      `${side}.wrist`,
      `${side}.wristTwist`,
      `${side}.forceLoad`,
      'body.neck',
      'body.trunk',
      'body.legs',
      'body.forceLoad',
    ])
  })

  it('carries the legacy option and adjustment values', () => {
    for (const [key, values] of Object.entries(ARM_OPTION_VALUES)) {
      const step = steps.find((s) => s.id === `${side}.${key}`)!
      expectStepValues(step, values, ARM_ADJUSTMENT_VALUES[key as keyof typeof ARM_ADJUSTMENT_VALUES])
    }
    for (const [key, values] of Object.entries(BODY_OPTION_VALUES)) {
      const step = steps.find((s) => s.id === `body.${key}`)!
      expectStepValues(step, values, BODY_ADJUSTMENT_VALUES[key as keyof typeof BODY_ADJUSTMENT_VALUES])
    }
  })
})

describe('both-sides flow', () => {
  const steps = questionSteps('both')

  it('asks right arm, then left arm, then body — like the legacy 14-step page', () => {
    expect(steps.map((s) => s.id)).toEqual([
      'right.upperArm',
      'right.lowerArm',
      'right.wrist',
      'right.wristTwist',
      'right.forceLoad',
      'left.upperArm',
      'left.lowerArm',
      'left.wrist',
      'left.wristTwist',
      'left.forceLoad',
      'body.neck',
      'body.trunk',
      'body.legs',
      'body.forceLoad',
    ])
  })

  it('uses the same option values as the single-side flows', () => {
    for (const side of ['right', 'left'] as const) {
      for (const [key, values] of Object.entries(ARM_OPTION_VALUES)) {
        const step = steps.find((s) => s.id === `${side}.${key}`)!
        expectStepValues(step, values, ARM_ADJUSTMENT_VALUES[key as keyof typeof ARM_ADJUSTMENT_VALUES])
      }
    }
  })
})

describe('flow structure', () => {
  it.each(['right', 'left', 'both'] as const)('%s flow ends with details then results', (mode) => {
    const flow = buildRulaFlow(mode)
    expect(flow.at(-2)?.kind).toBe('details')
    expect(flow.at(-1)?.kind).toBe('results')
  })

  it('every referenced image exists in public/', () => {
    const publicDir = resolve(here, '../public')
    for (const step of questionSteps('both')) {
      for (const option of step.options) {
        if (option.image) {
          expect(existsSync(resolve(publicDir, option.image.slice(1))), option.image).toBe(true)
        }
      }
      for (const option of step.adjustments?.options ?? []) {
        if (option.image) {
          expect(existsSync(resolve(publicDir, option.image.slice(1))), option.image).toBe(true)
        }
      }
    }
  })
})
