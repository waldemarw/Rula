/**
 * Guards byte-for-byte parity between the TypeScript scoring tables and the
 * original site's tables (legacy/js/rula-tables.js). The legacy file is the
 * authoritative fixture — it must never be edited.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import vm from 'node:vm'
import { describe, expect, it } from 'vitest'
import { TABLE_A, TABLE_B, TABLE_C } from '@/assessments/rula/tables'

const here = dirname(fileURLToPath(import.meta.url))

type LegacyTables = [Record<string, number>, Record<string, number>, Record<string, number>]

function loadLegacyTables(): LegacyTables {
  const source = readFileSync(resolve(here, '../legacy/js/rula-tables.js'), 'utf8')
  const context = vm.createContext({})
  vm.runInContext(`${source}\nthis.RULA_TABLES = RULA_TABLES;`, context)
  return (context as { RULA_TABLES: LegacyTables }).RULA_TABLES
}

describe('RULA tables parity with the legacy site', () => {
  const [legacyA, legacyB, legacyC] = loadLegacyTables()

  it('Table A matches legacy exactly', () => {
    expect({ ...TABLE_A }).toEqual(legacyA)
  })

  it('Table B matches legacy exactly', () => {
    expect({ ...TABLE_B }).toEqual(legacyB)
  })

  it('Table C matches legacy exactly', () => {
    expect({ ...TABLE_C }).toEqual(legacyC)
  })
})
