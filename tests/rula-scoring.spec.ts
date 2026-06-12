import { describe, expect, it } from 'vitest'
import {
  actionLevelForScore,
  lookupTableA,
  lookupTableB,
  lookupTableC,
  scoreRula,
} from '@/assessments/rula/scoring'
import type { RulaNeckTrunkLegInput, RulaUpperLimbInput } from '@/assessments/rula/scoring'

function upper(partial: Partial<RulaUpperLimbInput> = {}): RulaUpperLimbInput {
  return {
    upperArm: 1,
    upperArmAdjust: 0,
    lowerArm: 1,
    lowerArmAdjust: 0,
    wrist: 1,
    wristAdjust: 0,
    wristTwist: 1,
    forceLoad: 0,
    muscleUse: 0,
    ...partial,
  }
}

function body(partial: Partial<RulaNeckTrunkLegInput> = {}): RulaNeckTrunkLegInput {
  return {
    neck: 1,
    neckAdjust: 0,
    trunk: 1,
    trunkAdjust: 0,
    legs: 1,
    forceLoad: 0,
    muscleUse: 0,
    ...partial,
  }
}

describe('scoreRula golden cases', () => {
  it('best possible posture scores 1, action level 1', () => {
    const result = scoreRula(upper(), body())
    expect(result).toEqual({
      tableA: 1,
      armWristScore: 1,
      tableB: 1,
      neckTrunkLegScore: 1,
      grandScore: 1,
      actionLevel: { level: 1, advice: expect.stringContaining('acceptable') },
    })
  })

  it('worst possible posture scores 7, action level 4', () => {
    const result = scoreRula(
      upper({
        upperArm: 4,
        upperArmAdjust: 2, // shoulder raised + abducted
        lowerArm: 2,
        lowerArmAdjust: 1,
        wrist: 3,
        wristAdjust: 1,
        wristTwist: 2,
        forceLoad: 3,
        muscleUse: 1,
      }),
      body({
        neck: 4,
        neckAdjust: 2,
        trunk: 4,
        trunkAdjust: 2,
        legs: 2,
        forceLoad: 3,
        muscleUse: 1,
      }),
    )
    expect(result.tableA).toBe(9) // key "6342"
    expect(result.armWristScore).toBe(13)
    expect(result.tableB).toBe(9) // key "662"
    expect(result.neckTrunkLegScore).toBe(13)
    expect(result.grandScore).toBe(7)
    expect(result.actionLevel.level).toBe(4)
  })

  it('typical desk-work example matches hand-computed legacy scores', () => {
    // Upper arm 45-90° (3) abducted (+1), lower arm <60° (2), wrist 15° (2)
    // bent from midline (+1), wrist at end of twist range (2)
    // → Table A key "4232" = 5; +1 force +1 static = 7
    // Neck 10-20° (2) twisted (+1), trunk 0-20° (2), legs unbalanced (2)
    // → Table B key "322" = 4; +0 force +1 static = 5
    // → Table C "7x5" = 7, action level 4
    const result = scoreRula(
      upper({
        upperArm: 3,
        upperArmAdjust: 1,
        lowerArm: 2,
        wrist: 2,
        wristAdjust: 1,
        wristTwist: 2,
        forceLoad: 1,
        muscleUse: 1,
      }),
      body({ neck: 2, neckAdjust: 1, trunk: 2, legs: 2, muscleUse: 1 }),
    )
    expect(result.tableA).toBe(5)
    expect(result.armWristScore).toBe(7)
    expect(result.tableB).toBe(4)
    expect(result.neckTrunkLegScore).toBe(5)
    expect(result.grandScore).toBe(7)
    expect(result.actionLevel.level).toBe(4)
  })

  it('arm supported (−1 adjustment) reaches the 0-row of Table A', () => {
    // upperArm 1 with "leaning/supported" −1 → row 0; legacy supports this.
    const result = scoreRula(upper({ upperArm: 1, upperArmAdjust: -1 }), body())
    expect(result.tableA).toBe(1) // key "0111"
    expect(result.grandScore).toBe(1)
  })

  it('muscle use and force/load are added after the table lookup', () => {
    const result = scoreRula(upper({ forceLoad: 2, muscleUse: 1 }), body({ forceLoad: 1, muscleUse: 1 }))
    expect(result.tableA).toBe(1)
    expect(result.armWristScore).toBe(4) // 1 + 2 + 1
    expect(result.tableB).toBe(1)
    expect(result.neckTrunkLegScore).toBe(3) // 1 + 1 + 1
    expect(result.grandScore).toBe(lookupTableC(4, 3))
    expect(result.grandScore).toBe(3) // Table C "4x3"
  })
})

describe('action levels (legacy getActionLevel boundaries)', () => {
  it.each([
    [1, 1],
    [2, 1],
    [3, 2],
    [4, 2],
    [5, 3],
    [6, 3],
    [7, 4],
  ] as const)('grand score %i → action level %i', (score, level) => {
    expect(actionLevelForScore(score).level).toBe(level)
  })
})

describe('table lookups are total over every reachable input', () => {
  it('Table A covers all reachable arm/wrist combinations', () => {
    // Adjustments: shoulder raised +1, abducted +1, supported −1 → sums −1..2
    for (const upperArm of [1, 2, 3, 4])
      for (const upperArmAdjust of [-1, 0, 1, 2])
        for (const lowerArm of [1, 2])
          for (const lowerArmAdjust of [0, 1])
            for (const wrist of [1, 2, 3])
              for (const wristAdjust of [0, 1])
                for (const wristTwist of [1, 2]) {
                  const score = lookupTableA({
                    upperArm,
                    upperArmAdjust,
                    lowerArm,
                    lowerArmAdjust,
                    wrist,
                    wristAdjust,
                    wristTwist,
                  })
                  expect(Number.isInteger(score)).toBe(true)
                  expect(score).toBeGreaterThanOrEqual(1)
                  expect(score).toBeLessThanOrEqual(9)
                }
  })

  it('Table B covers all reachable neck/trunk/leg combinations', () => {
    for (const neck of [1, 2, 3, 4])
      for (const neckAdjust of [0, 1, 2])
        for (const trunk of [1, 2, 3, 4])
          for (const trunkAdjust of [0, 1, 2])
            for (const legs of [1, 2]) {
              const score = lookupTableB({ neck, neckAdjust, trunk, trunkAdjust, legs })
              expect(score).toBeGreaterThanOrEqual(1)
              expect(score).toBeLessThanOrEqual(9)
            }
  })

  it('Table C covers every reachable score pair and stays within 1–7', () => {
    // Score C and D each range 1–13 (max table 9 + force 3 + muscle 1).
    for (let c = 1; c <= 13; c++)
      for (let d = 1; d <= 13; d++) {
        const score = lookupTableC(c, d)
        expect(score).toBeGreaterThanOrEqual(1)
        expect(score).toBeLessThanOrEqual(7)
      }
  })

  it('rejects impossible combinations loudly instead of returning NaN', () => {
    expect(() => lookupTableA({ upperArm: 9, upperArmAdjust: 0, lowerArm: 1, lowerArmAdjust: 0, wrist: 1, wristAdjust: 0, wristTwist: 1 })).toThrow(RangeError)
    expect(() => lookupTableB({ neck: 7, neckAdjust: 0, trunk: 1, trunkAdjust: 0, legs: 1 })).toThrow(RangeError)
    expect(() => lookupTableC(0, 1)).toThrow(RangeError)
  })
})
