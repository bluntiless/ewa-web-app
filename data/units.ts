import { Unit } from "@/models/Unit"
import { allEWAUnits } from "./ewaUnits"
import { allEALUnits } from "./ealUnits"

export const allUnits: Unit[] = [...allEWAUnits, ...allEALUnits]

export function getUnitsByQualification(qualification: "EWA" | "NVQ"): Unit[] {
  return allUnits.filter((unit) => unit.qualification === qualification)
}

export function searchUnits(searchTerm: string): Unit[] {
  if (!searchTerm) {
    return allUnits
  }
  const lowerCaseSearchTerm = searchTerm.toLowerCase()
  return allUnits.filter(
    (unit) =>
      unit.id.toLowerCase().includes(lowerCaseSearchTerm) ||
      unit.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      unit.qualification.toLowerCase().includes(lowerCaseSearchTerm),
  )
}

export function getQualificationStats(qualification: "EWA" | "NVQ") {
  const units = getUnitsByQualification(qualification)
  const totalUnits = units.length
  // For demonstration, let's mock some completed units.
  // In a real app, this would come from user progress data.
  let completedUnits = 0
  if (qualification === "EWA") {
    completedUnits = 3 // Mock: EWA-U1, EWA-U2, EWA-U3 are completed
  } else if (qualification === "NVQ") {
    completedUnits = 7 // Mock: NETP3-01 to NETP3-07 are completed
  }

  const progressPercentage = totalUnits > 0 ? (completedUnits / totalUnits) * 100 : 0

  return {
    totalUnits,
    completedUnits,
    progressPercentage,
  }
}
