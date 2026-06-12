import type { AssessmentDef } from './types'
import { rulaAssessment } from './rula'

/**
 * All assessments offered by the site. Add future tools (REBA, ROSA, …) here
 * and give them their own routes; the home page lists this registry.
 */
export const assessments: AssessmentDef[] = [rulaAssessment]
