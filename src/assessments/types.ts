/**
 * Generic assessment framework types.
 *
 * RULA is the first assessment; future tools (REBA, ROSA, …) should plug in
 * by providing their own AssessmentDef + question steps + scoring module and
 * registering in registry.ts.
 */

export interface ChoiceOption {
  /** Globally unique within the assessment, e.g. "right.upperArm.1". */
  id: string
  /** Score value fed into the engine. Several options may share a value. */
  value: number
  label: string
  /** Extra bullet lines (used by force/load cards). */
  detail?: string[]
  image?: string
  imageAlt?: string
}

export interface AdjustmentOption {
  id: string
  /** Added to the step's adjustment sum when ticked (can be negative). */
  value: number
  label: string
  image?: string
  imageAlt?: string
}

export interface QuestionStep {
  kind: 'question'
  /** e.g. "right.upperArm" — also the answer key in the session store. */
  id: string
  /** Section heading, e.g. "Part A · Arm & Wrist". */
  section: string
  title: string
  options: ChoiceOption[]
  adjustments?: {
    title: string
    options: AdjustmentOption[]
  }
}

export interface DetailsStep {
  kind: 'details'
  id: 'details'
  section: string
  title: string
}

export interface ResultsStep {
  kind: 'results'
  id: 'results'
  section: string
  title: string
}

export type FlowStep = QuestionStep | DetailsStep | ResultsStep

export interface AssessmentVariantDef {
  slug: string
  path: string
  name: string
  /** Short label for buttons/navigation. */
  label: string
  description: string
}

export interface AssessmentDef {
  id: string
  name: string
  tagline: string
  variants: AssessmentVariantDef[]
}
