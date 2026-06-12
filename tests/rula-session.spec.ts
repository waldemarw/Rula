import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRulaSession } from '@/stores/rulaSession'
import { scoreRula } from '@/assessments/rula'

/** Answer every question step with its first option (all best-case postures). */
function answerEverything(session: ReturnType<typeof useRulaSession>) {
  for (const step of session.questionSteps) {
    session.choose(step.id, step.options[0].id)
  }
}

describe('rula session store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('produces the engine result for a completed right-side session', () => {
    const session = useRulaSession()
    session.start('right')
    answerEverything(session)

    expect(session.results.right).toEqual(
      scoreRula(
        {
          upperArm: 1, upperArmAdjust: 0,
          lowerArm: 1, lowerArmAdjust: 0,
          wrist: 1, wristAdjust: 0,
          wristTwist: 1,
          forceLoad: 0, muscleUse: 0,
        },
        { neck: 1, neckAdjust: 0, trunk: 1, trunkAdjust: 0, legs: 1, forceLoad: 0, muscleUse: 0 },
      ),
    )
    expect(session.results.right?.grandScore).toBe(1)
    expect(session.results.left).toBeUndefined()
  })

  it('resolves option ids to score values, including duplicate-value options', () => {
    const session = useRulaSession()
    session.start('right')

    // Options 2 and 3 of the upper arm question both score 2.
    session.choose('right.upperArm', 'right.upperArm.3')
    expect(session.selectedOption('right.upperArm')?.id).toBe('right.upperArm.3')
    expect(session.choiceValue('right.upperArm')).toBe(2)

    session.choose('right.upperArm', 'right.upperArm.2')
    expect(session.selectedOption('right.upperArm')?.id).toBe('right.upperArm.2')
    expect(session.choiceValue('right.upperArm')).toBe(2)
  })

  it('sums ticked adjustments into the engine input', () => {
    const session = useRulaSession()
    session.start('right')
    answerEverything(session)
    session.choose('right.upperArm', 'right.upperArm.4') // 45–90° flexion, value 3
    session.setFlag('right.upperArm.shoulderRaised', true)
    session.setFlag('right.upperArm.abducted', true)
    session.setFlag('right.upperArm.supported', true) // −1

    const input = session.upperLimbInput('right')!
    expect(input.upperArm).toBe(3)
    expect(input.upperArmAdjust).toBe(1) // +1 +1 −1

    session.setFlag('right.upperArm.supported', false)
    expect(session.upperLimbInput('right')!.upperArmAdjust).toBe(2)
  })

  it('keeps per-arm force/load separate in both-sides mode (legacy parity)', () => {
    const session = useRulaSession()
    session.start('both')
    answerEverything(session)

    // Right arm: heavy load + static muscle use. Left arm: nothing.
    session.choose('right.forceLoad', 'right.forceLoad.3')
    session.setFlag('right.muscleUse', true)

    const right = session.results.right!
    const left = session.results.left!

    // Identical postures → identical table scores...
    expect(right.tableA).toBe(left.tableA)
    // ...but force/muscle only affect the right arm's score C.
    expect(right.armWristScore).toBe(right.tableA + 3 + 1)
    expect(left.armWristScore).toBe(left.tableA)
    // Part B is shared between both sides.
    expect(right.neckTrunkLegScore).toBe(left.neckTrunkLegScore)
  })

  it('static muscle-use tick adds +1 through the force/load step adjustments', () => {
    const session = useRulaSession()
    session.start('left')
    answerEverything(session)
    session.setFlag('left.muscleUse', true)
    session.setFlag('body.muscleUse', true)

    expect(session.upperLimbInput('left')!.muscleUse).toBe(1)
    expect(session.neckTrunkLegInput!.muscleUse).toBe(1)
  })

  it('blocks skipping ahead of the first unanswered question', () => {
    const session = useRulaSession()
    session.start('right')

    expect(session.maxReachableIndex).toBe(0)
    session.next()
    expect(session.stepIndex).toBe(0) // can't advance: nothing answered

    session.choose('right.upperArm', 'right.upperArm.1')
    expect(session.maxReachableIndex).toBe(1)
    session.next()
    expect(session.stepIndex).toBe(1)

    session.goTo(5)
    expect(session.stepIndex).toBe(1) // jump refused

    answerEverything(session)
    expect(session.maxReachableIndex).toBe(session.flow.length - 1)
    session.goTo(session.flow.length - 1)
    expect(session.currentStep.kind).toBe('results')
  })

  it('resets when the mode changes but keeps progress otherwise', () => {
    const session = useRulaSession()
    session.start('right')
    session.choose('right.upperArm', 'right.upperArm.2')
    session.next()

    session.start('right') // re-entering the same mode keeps answers
    expect(session.selections['right.upperArm']).toBe('right.upperArm.2')
    expect(session.stepIndex).toBe(1)

    session.start('both') // switching modes starts fresh
    expect(session.selections).toEqual({})
    expect(session.stepIndex).toBe(0)
    expect(session.results).toEqual({})
  })

  it('live score panel mirrors the legacy zero-until-answered behaviour', () => {
    const session = useRulaSession()
    session.start('right')

    let live = session.sideLiveScores('right')
    expect(live.upperArm).toBe(0)
    expect(live.tableA).toBeNull()
    expect(live.total).toBeNull()

    session.choose('right.upperArm', 'right.upperArm.2') // value 2
    session.setFlag('right.upperArm.shoulderRaised', true)
    live = session.sideLiveScores('right')
    expect(live.upperArm).toBe(3)
    expect(live.tableA).toBeNull() // Part A incomplete

    answerEverything(session)
    session.choose('right.forceLoad', 'right.forceLoad.2')
    live = session.sideLiveScores('right')
    expect(live.tableA).not.toBeNull()
    expect(live.total).toBe(live.tableA! + 2)

    expect(session.bodyLiveScores.total).not.toBeNull()
  })
})
