import { ewaUnits } from "./ewaUnits"
import { ealUnits } from "./ealUnits"
import { Unit } from "@/models/Unit"

export const allUnits: Unit[] = [...ewaUnits, ...ealUnits]

export function getUnitsByQualification(qualification: "EWA" | "NVQ"): Unit[] {
  return allUnits.filter((unit) => unit.qualification === qualification)
}

export function searchUnits(query: string): Unit[] {
  const lowerCaseQuery = query.toLowerCase()
  return allUnits.filter(
    (unit) =>
      unit.code.toLowerCase().includes(lowerCaseQuery) ||
      unit.title.toLowerCase().includes(lowerCaseQuery) ||
      unit.description.toLowerCase().includes(lowerCaseQuery) ||
      unit.learningOutcomes.some((lo) =>
        lo.description.toLowerCase().includes(lowerCaseQuery) ||
        lo.performanceCriteria.some((pc) => pc.description.toLowerCase().includes(lowerCaseQuery))
      )
  )
}

export function getQualificationStats() {
  const ewaCount = ewaUnits.length
  const nvqCount = ealUnits.length
  const totalCount = allUnits.length

  return {
    ewaCount,
    nvqCount,
    totalCount,
  }
}
