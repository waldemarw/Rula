/**
 * RULA question definitions: posture options, images and adjustment values.
 *
 * The option/adjustment values are part of the scoring contract and mirror
 * the legacy assessment pages exactly (radio values & checkbox values from
 * legacy/assessment*.html). tests/rula-questions.spec.ts locks them down —
 * do not change values without updating that fixture deliberately.
 */
import type { FlowStep, QuestionStep, ChoiceOption } from '../types'

export type RulaMode = 'right' | 'left' | 'both'
export type RulaSide = 'right' | 'left'

const M = '/media'

function forceLoadOptions(idPrefix: string): ChoiceOption[] {
  return [
    {
      id: `${idPrefix}.0`,
      value: 0,
      label: 'Score 0',
      detail: ['No resistance', 'Less than 2 kg intermittent load or force'],
    },
    {
      id: `${idPrefix}.1`,
      value: 1,
      label: 'Score 1',
      detail: ['2–10 kg intermittent load or force'],
    },
    {
      id: `${idPrefix}.2`,
      value: 2,
      label: 'Score 2',
      detail: [
        '2–10 kg static load',
        '2–10 kg repeated loads or forces',
        '10 kg or more intermittent load or force',
      ],
    },
    {
      id: `${idPrefix}.3`,
      value: 3,
      label: 'Score 3',
      detail: [
        'More than 10 kg static load',
        '10 kg or more repeated loads or forces',
        'Shock or forces with rapid buildup',
      ],
    },
  ]
}

const MUSCLE_USE_LABEL =
  'Posture is mainly static (held longer than 1 minute) or repeated more than 4 times per minute (+1)'

/** Part A steps for one arm. Left side uses mirrored images. */
export function armWristSteps(side: RulaSide, suffix = ''): QuestionStep[] {
  const dir = side === 'left' ? `${M}/left-side` : M
  const section = `Part A · Arm & Wrist Analysis${suffix}`
  return [
    {
      kind: 'question',
      id: `${side}.upperArm`,
      section,
      title: `Locate upper arm position${suffix}`,
      options: [
        {
          id: `${side}.upperArm.1`,
          value: 1,
          label: '20° extension to 20° flexion',
          image: `${dir}/Q1/upperarm1.webp`,
          imageAlt: `${side} upper arm between 20 degrees extension and 20 degrees flexion`,
        },
        {
          id: `${side}.upperArm.2`,
          value: 2,
          label: 'More than 20° extension',
          image: `${dir}/Q1/upperarm2.webp`,
          imageAlt: `${side} upper arm extended more than 20 degrees behind the body`,
        },
        {
          id: `${side}.upperArm.3`,
          value: 2,
          label: '20–45° flexion',
          image: `${dir}/Q1/upperarm3.webp`,
          imageAlt: `${side} upper arm raised forward 20 to 45 degrees`,
        },
        {
          id: `${side}.upperArm.4`,
          value: 3,
          label: '45–90° flexion',
          image: `${dir}/Q1/upperarm4.webp`,
          imageAlt: `${side} upper arm raised forward 45 to 90 degrees`,
        },
        {
          id: `${side}.upperArm.5`,
          value: 4,
          label: 'More than 90° flexion',
          image: `${dir}/Q1/upperarm5.webp`,
          imageAlt: `${side} upper arm raised above shoulder height`,
        },
      ],
      adjustments: {
        title: 'Also tick any boxes that apply',
        options: [
          { id: `${side}.upperArm.shoulderRaised`, value: 1, label: 'Shoulder is raised (+1)' },
          {
            id: `${side}.upperArm.abducted`,
            value: 1,
            label: 'Upper arm is abducted, away from the side of the body (+1)',
          },
          {
            id: `${side}.upperArm.supported`,
            value: -1,
            label: 'Leaning or supporting the weight of the arm (−1)',
          },
        ],
      },
    },
    {
      kind: 'question',
      id: `${side}.lowerArm`,
      section,
      title: `Locate lower arm position${suffix}`,
      options: [
        {
          id: `${side}.lowerArm.1`,
          value: 1,
          label: '60–100° flexion',
          image: `${dir}/Q2/lowerarm1.webp`,
          imageAlt: `${side} lower arm bent between 60 and 100 degrees`,
        },
        {
          id: `${side}.lowerArm.2`,
          value: 2,
          label: 'Less than 60° flexion',
          image: `${dir}/Q2/lowerarm2.webp`,
          imageAlt: `${side} lower arm extended below 60 degrees`,
        },
        {
          id: `${side}.lowerArm.3`,
          value: 2,
          label: 'More than 100° flexion',
          image: `${dir}/Q2/lowerarm3.webp`,
          imageAlt: `${side} lower arm bent beyond 100 degrees`,
        },
      ],
      adjustments: {
        title: 'Also tick the box if appropriate',
        options: [
          {
            id: `${side}.lowerArm.acrossMidline`,
            value: 1,
            label: 'Arm is working across the midline or out to the side of the body (+1)',
            image: `${dir}/Q2/lowerarm4.webp`,
            imageAlt: 'arm working across the midline of the body or out to the side',
          },
        ],
      },
    },
    {
      kind: 'question',
      id: `${side}.wrist`,
      section,
      title: `Locate wrist position${suffix}`,
      options: [
        {
          id: `${side}.wrist.1`,
          value: 1,
          label: '0° — neutral position',
          image: `${dir}/Q3/wrist1.webp`,
          imageAlt: `${side} wrist in neutral position`,
        },
        {
          id: `${side}.wrist.2`,
          value: 2,
          label: '15° down to 15° up',
          image: `${dir}/Q3/wrist2.webp`,
          imageAlt: `${side} wrist bent up to 15 degrees up or down`,
        },
        {
          id: `${side}.wrist.3`,
          value: 3,
          label: 'More than 15° down',
          image: `${dir}/Q3/wrist3.webp`,
          imageAlt: `${side} wrist flexed more than 15 degrees down`,
        },
        {
          id: `${side}.wrist.4`,
          value: 3,
          label: 'More than 15° up',
          image: `${dir}/Q3/wrist4.webp`,
          imageAlt: `${side} wrist extended more than 15 degrees up`,
        },
      ],
      adjustments: {
        title: 'Also tick the box if appropriate',
        options: [
          {
            id: `${side}.wrist.bentFromMidline`,
            value: 1,
            label: 'Wrist is bent away from the midline (+1)',
            image: `${dir}/Q3/wrist5.webp`,
            imageAlt: 'wrist bent away from the midline',
          },
        ],
      },
    },
    {
      kind: 'question',
      id: `${side}.wristTwist`,
      section,
      title: `Wrist twist${suffix}`,
      options: [
        {
          id: `${side}.wristTwist.1`,
          value: 1,
          label: 'Wrist is twisted mainly in mid-range',
          image: `${dir}/Q4/wrist_twist1.webp`,
          imageAlt: `${side} wrist twisted within mid-range`,
        },
        {
          id: `${side}.wristTwist.2`,
          value: 2,
          label: 'Wrist is at or near the end of twisting range',
          image: `${dir}/Q4/wrist_twist2.webp`,
          imageAlt: `${side} wrist twisted at or near the end of range`,
        },
      ],
    },
    {
      kind: 'question',
      id: `${side}.forceLoad`,
      section,
      title: `Arm & wrist: select the force or load that most reflects the working situation${suffix}`,
      options: forceLoadOptions(`${side}.forceLoad`),
      adjustments: {
        title: 'Tick the box if it reflects the muscle use',
        options: [{ id: `${side}.muscleUse`, value: 1, label: MUSCLE_USE_LABEL }],
      },
    },
  ]
}

/** Part B steps — neck, trunk and legs are scored once, whichever arms are assessed. */
export function neckTrunkLegSteps(): QuestionStep[] {
  const section = 'Part B · Neck, Trunk & Leg Analysis'
  return [
    {
      kind: 'question',
      id: 'body.neck',
      section,
      title: 'Locate neck position',
      options: [
        {
          id: 'body.neck.1',
          value: 1,
          label: '0–10° flexion',
          image: `${M}/Q6/neck1.webp`,
          imageAlt: 'neck bent forward up to 10 degrees',
        },
        {
          id: 'body.neck.2',
          value: 2,
          label: '10–20° flexion',
          image: `${M}/Q6/neck2.webp`,
          imageAlt: 'neck bent forward 10 to 20 degrees',
        },
        {
          id: 'body.neck.3',
          value: 3,
          label: 'More than 20° flexion',
          image: `${M}/Q6/neck3.webp`,
          imageAlt: 'neck bent forward more than 20 degrees',
        },
        {
          id: 'body.neck.4',
          value: 4,
          label: 'In extension',
          image: `${M}/Q6/neck4.webp`,
          imageAlt: 'neck tilted backwards in extension',
        },
      ],
      adjustments: {
        title: 'Also tick any boxes that apply',
        options: [
          {
            id: 'body.neck.twisted',
            value: 1,
            label: 'Neck is twisted (+1)',
            image: `${M}/Q6/neck5.webp`,
            imageAlt: 'neck twisted to one side',
          },
          {
            id: 'body.neck.sideBending',
            value: 1,
            label: 'Neck is side-bending (+1)',
            image: `${M}/Q6/neck6.webp`,
            imageAlt: 'neck bending towards one shoulder',
          },
        ],
      },
    },
    {
      kind: 'question',
      id: 'body.trunk',
      section,
      title: 'Locate trunk position',
      options: [
        {
          id: 'body.trunk.1',
          value: 1,
          label: 'Sitting well supported, hip-trunk angle 90°+',
          image: `${M}/Q7/trunk1.webp`,
          imageAlt: 'trunk upright and well supported while seated',
        },
        {
          id: 'body.trunk.2',
          value: 2,
          label: '0–20° flexion',
          image: `${M}/Q7/trunk2.webp`,
          imageAlt: 'trunk bent forward up to 20 degrees',
        },
        {
          id: 'body.trunk.3',
          value: 3,
          label: '20–60° flexion',
          image: `${M}/Q7/trunk3.webp`,
          imageAlt: 'trunk bent forward 20 to 60 degrees',
        },
        {
          id: 'body.trunk.4',
          value: 4,
          label: 'More than 60° flexion',
          image: `${M}/Q7/trunk4.webp`,
          imageAlt: 'trunk bent forward more than 60 degrees',
        },
      ],
      adjustments: {
        title: 'Also tick any boxes that apply',
        options: [
          {
            id: 'body.trunk.twisted',
            value: 1,
            label: 'Trunk is twisted (+1)',
            image: `${M}/Q7/trunk5.webp`,
            imageAlt: 'trunk twisted to one side',
          },
          {
            id: 'body.trunk.sideBending',
            value: 1,
            label: 'Trunk is side-bending (+1)',
            image: `${M}/Q7/trunk6.webp`,
            imageAlt: 'trunk bending towards one side',
          },
        ],
      },
    },
    {
      kind: 'question',
      id: 'body.legs',
      section,
      title: 'Legs',
      options: [
        {
          id: 'body.legs.1',
          value: 1,
          label: 'Legs and feet are well supported and in an evenly balanced posture',
          image: `${M}/Q8/legs1.webp`,
          imageAlt: 'legs and feet supported and evenly balanced',
        },
        {
          id: 'body.legs.2',
          value: 2,
          label: 'Legs and feet are NOT evenly balanced and supported',
          image: `${M}/Q8/legs2.webp`,
          imageAlt: 'legs and feet not evenly balanced or supported',
        },
      ],
    },
    {
      kind: 'question',
      id: 'body.forceLoad',
      section,
      title: 'Neck, trunk & leg: select the force or load that most reflects the working situation',
      options: forceLoadOptions('body.forceLoad'),
      adjustments: {
        title: 'Tick the box if it reflects the muscle use',
        options: [{ id: 'body.muscleUse', value: 1, label: MUSCLE_USE_LABEL }],
      },
    },
  ]
}

/** Sides assessed in each mode, in question order. */
export function sidesForMode(mode: RulaMode): RulaSide[] {
  if (mode === 'both') return ['right', 'left']
  return [mode]
}

/** Full step flow for a mode: questions, then personal details, then results. */
export function buildRulaFlow(mode: RulaMode): FlowStep[] {
  const questionSteps: QuestionStep[] =
    mode === 'both'
      ? [...armWristSteps('right', ' (right)'), ...armWristSteps('left', ' (left)'), ...neckTrunkLegSteps()]
      : [...armWristSteps(mode), ...neckTrunkLegSteps()]

  return [
    ...questionSteps,
    { kind: 'details', id: 'details', section: 'Almost done', title: 'Personal details (optional)' },
    { kind: 'results', id: 'results', section: 'Results', title: 'Your RULA score' },
  ]
}
