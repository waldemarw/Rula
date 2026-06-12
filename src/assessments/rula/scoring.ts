/**
 * RULA scoring engine — pure functions, no framework dependencies.
 *
 * Faithful port of legacy/js/rula-assessment.js (setTableScores/setOutput/
 * getActionLevel). The scores produced here must always match the original
 * site exactly; tests/rula-scoring.spec.ts guards this.
 */
import { TABLE_A, TABLE_B, TABLE_C } from './tables'

export interface RulaUpperLimbInput {
  /** Upper arm posture score, 1–4. */
  upperArm: number
  /** Shoulder raised +1, arm abducted +1, leaning/arm supported −1 (summed). */
  upperArmAdjust: number
  /** Lower arm posture score, 1–2. */
  lowerArm: number
  /** Arm working across midline or out to side +1. */
  lowerArmAdjust: number
  /** Wrist posture score, 1–3. */
  wrist: number
  /** Wrist bent away from midline +1. */
  wristAdjust: number
  /** Wrist twist score, 1–2. */
  wristTwist: number
  /** Force/load score, 0–3. */
  forceLoad: number
  /** Mainly static posture or highly repeated +1. */
  muscleUse: number
}

export interface RulaNeckTrunkLegInput {
  /** Neck posture score, 1–4. */
  neck: number
  /** Neck twisted +1, side-bending +1 (summed). */
  neckAdjust: number
  /** Trunk posture score, 1–4. */
  trunk: number
  /** Trunk twisted +1, side-bending +1 (summed). */
  trunkAdjust: number
  /** Legs score: supported/balanced 1, not 2. */
  legs: number
  /** Force/load score, 0–3. */
  forceLoad: number
  /** Mainly static posture or highly repeated +1. */
  muscleUse: number
}

export interface RulaActionLevel {
  level: 1 | 2 | 3 | 4
  advice: string
}

export interface RulaResult {
  /** Posture score from Table A (arm & wrist), before muscle/force additions. */
  tableA: number
  /** Score C — Table A + muscle use + force/load. Row axis of Table C. */
  armWristScore: number
  /** Posture score from Table B (neck, trunk & legs), before muscle/force additions. */
  tableB: number
  /** Score D — Table B + muscle use + force/load. Column axis of Table C. */
  neckTrunkLegScore: number
  /** Grand RULA score, 1–7. */
  grandScore: number
  actionLevel: RulaActionLevel
}

export function lookupTableA(
  input: Pick<
    RulaUpperLimbInput,
    'upperArm' | 'upperArmAdjust' | 'lowerArm' | 'lowerArmAdjust' | 'wrist' | 'wristAdjust' | 'wristTwist'
  >,
): number {
  const key =
    `${input.upperArm + input.upperArmAdjust}` +
    `${input.lowerArm + input.lowerArmAdjust}` +
    `${input.wrist + input.wristAdjust}` +
    `${input.wristTwist}`
  const score = TABLE_A[key]
  if (score === undefined) throw new RangeError(`No Table A entry for posture combination "${key}"`)
  return score
}

export function lookupTableB(
  input: Pick<RulaNeckTrunkLegInput, 'neck' | 'neckAdjust' | 'trunk' | 'trunkAdjust' | 'legs'>,
): number {
  const key = `${input.neck + input.neckAdjust}${input.trunk + input.trunkAdjust}${input.legs}`
  const score = TABLE_B[key]
  if (score === undefined) throw new RangeError(`No Table B entry for posture combination "${key}"`)
  return score
}

export function lookupTableC(armWristScore: number, neckTrunkLegScore: number): number {
  const key = `${armWristScore}x${neckTrunkLegScore}`
  const score = TABLE_C[key]
  if (score === undefined) throw new RangeError(`No Table C entry for "${key}"`)
  return score
}

export function actionLevelForScore(grandScore: number): RulaActionLevel {
  if (grandScore < 3)
    return { level: 1, advice: 'The posture is acceptable if it is not maintained or repeated for long periods.' }
  if (grandScore < 5)
    return { level: 2, advice: 'Further investigation is needed and changes may be required.' }
  if (grandScore < 7)
    return { level: 3, advice: 'Further investigation and changes are required soon.' }
  return { level: 4, advice: 'Further investigation and changes are required immediately.' }
}

export function scoreRula(upperLimb: RulaUpperLimbInput, neckTrunkLeg: RulaNeckTrunkLegInput): RulaResult {
  const tableA = lookupTableA(upperLimb)
  const armWristScore = tableA + upperLimb.forceLoad + upperLimb.muscleUse

  const tableB = lookupTableB(neckTrunkLeg)
  const neckTrunkLegScore = tableB + neckTrunkLeg.forceLoad + neckTrunkLeg.muscleUse

  const grandScore = lookupTableC(armWristScore, neckTrunkLegScore)

  return {
    tableA,
    armWristScore,
    tableB,
    neckTrunkLegScore,
    grandScore,
    actionLevel: actionLevelForScore(grandScore),
  }
}
