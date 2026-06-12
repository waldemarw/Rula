import type { AssessmentDef } from '../types'

export const rulaAssessment: AssessmentDef = {
  id: 'rula',
  name: 'RULA — Rapid Upper Limb Assessment',
  tagline:
    'A free ergonomic screening tool that scores biomechanical and postural load on the neck, trunk and upper limbs.',
  variants: [
    {
      slug: 'both',
      path: '/assessment/both',
      name: 'RULA assessment — both sides',
      label: 'Both right & left sides',
      description: 'Assess the right and left arm in one pass, sharing the neck, trunk and leg scores.',
    },
    {
      slug: 'right',
      path: '/assessment/right',
      name: 'RULA assessment — right side',
      label: 'Right side only',
      description: 'Assess the right arm and wrist together with the neck, trunk and legs.',
    },
    {
      slug: 'left',
      path: '/assessment/left',
      name: 'RULA assessment — left side',
      label: 'Left side only',
      description: 'Assess the left arm and wrist together with the neck, trunk and legs.',
    },
  ],
}

export * from './scoring'
export * from './questions'
