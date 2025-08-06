import { Unit } from '../models/Unit'
import { allEWAUnits, ewaUnits } from './ewaUnits'
import { allNVQ1605Units, nvqUnits } from './ealUnits'

// Export all units combined
export const allUnits: Unit[] = [
  ...allEWAUnits,
  ...allNVQ1605Units
]

// Export units by qualification
export { ewaUnits, nvqUnits }

// Helper functions for the units page
export const getUnitsByQualification = (qualification: string): Unit[] => {
  return allUnits.filter(unit => unit.qualification === qualification)
}

// Search units by title, code, or description
export function searchUnits(query: string): Unit[] {
  const searchTerm = query.toLowerCase()
  return allUnits.filter(unit => 
    unit.title.toLowerCase().includes(searchTerm) ||
    unit.code.toLowerCase().includes(searchTerm) ||
    unit.description.toLowerCase().includes(searchTerm)
  )
}

// Get qualification statistics
export function getQualificationStats() {
  const ewaUnits = getUnitsByQualification('EWA')
  const nvqUnits = getUnitsByQualification('NVQ')
  
  return {
    EWA: {
      totalUnits: ewaUnits.length,
      knowledgeUnits: ewaUnits.filter(u => u.type === 'knowledge').length,
      rplUnits: ewaUnits.filter(u => u.type === 'rpl').length,
      totalCredits: ewaUnits.reduce((sum, unit) => sum + unit.creditValue, 0)
    },
    NVQ: {
      totalUnits: nvqUnits.length,
      performanceUnits: nvqUnits.filter(u => u.type === 'performance').length,
      totalCredits: nvqUnits.reduce((sum, unit) => sum + unit.creditValue, 0)
    }
  }
}

export const getUnitStats = () => {
  const ewaCount = ewaUnits.length
  const nvqCount = nvqUnits.length
  const knowledgeCount = allUnits.filter(unit => unit.type === 'knowledge').length
  const performanceCount = allUnits.filter(unit => unit.type === 'performance').length
  const rplCount = allUnits.filter(unit => unit.type === 'rpl').length

  return {
    total: allUnits.length,
    ewa: ewaCount,
    nvq: nvqCount,
    knowledge: knowledgeCount,
    performance: performanceCount,
    rpl: rplCount
  }
}

export default allUnits
