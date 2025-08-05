import { Unit, UnitType } from '../models/Unit';
import { allNVQ1605Units } from './ealUnits';
import { units2357 } from './cityAndGuildsUnits';

// Converted from Swift EALUnits.swift to TypeScript
export const ewaUnits: Unit[] = [
  {
    id: "NETP3-01",
    code: "NETP3-01",
    displayCode: "NETP3-01",
    reference: "NETP3-01",
    title: "Apply Health and Safety Legislation and Working Practices",
    type: UnitType.EWA,
    progress: 0
  },
  {
    id: "NETP3-03",
    code: "NETP3-03",
    displayCode: "NETP3-03",
    reference: "NETP3-03",
    title: "Apply Environmental Legislation and Working Practices",
    type: UnitType.EWA,
    progress: 0
  },
  {
    id: "NETP3-04",
    code: "NETP3-04",
    displayCode: "NETP3-04",
    reference: "NETP3-04",
    title: "Install Electrical Equipment and Systems",
    type: UnitType.EWA,
    progress: 0
  },
  {
    id: "NETP3-05",
    code: "NETP3-05",
    displayCode: "NETP3-05",
    reference: "NETP3-05",
    title: "Terminate and Connect Conductors",
    type: UnitType.EWA,
    progress: 0
  },
  {
    id: "NETP3-06",
    code: "NETP3-06",
    displayCode: "NETP3-06",
    reference: "NETP3-06",
    title: "Inspect and Test Electrical Installations",
    type: UnitType.EWA,
    progress: 0
  },
  {
    id: "NETP3-07",
    code: "NETP3-07",
    displayCode: "NETP3-07",
    reference: "NETP3-07",
    title: "Diagnose and Correct Electrical Faults",
    type: UnitType.EWA,
    progress: 0
  }
];

// Use the full unit data from ealUnits.ts
export const nvqUnits: Unit[] = allNVQ1605Units;

export const rplUnits: Unit[] = [
  {
    id: "18ED3-02",
    code: "18ED3-02",
    displayCode: "18ED3-02",
    reference: "18ED3-02",
    title: "RPL Unit 1",
    type: UnitType.RPL,
    progress: 0
  },
  {
    id: "QIT3-001",
    code: "QIT3-001",
    displayCode: "QIT3-001",
    reference: "QIT3-001",
    title: "RPL Unit 2",
    type: UnitType.RPL,
    progress: 0
  }
];

// Also add City & Guilds units to allUnits
export const allUnits: Unit[] = [
  ...ewaUnits,
  ...nvqUnits,
  ...rplUnits,
  // Add adapted City & Guilds units
  ...units2357.map(unit => ({
    id: unit.id,
    code: unit.code,
    displayCode: unit.displayCode,
    reference: unit.code,
    title: unit.title,
    type: unit.isPerformanceUnit ? UnitType.EWA : UnitType.NVQ,
    creditValue: unit.creditValue,
    glh: unit.glh,
    description: unit.description,
    progress: unit.progress || 0,
    learningOutcomes: unit.learningOutcomes || []
  }))
];

// Helper function to find units by code
export function getUnitByCode(code: string): Unit | undefined {
  return allUnits.find(unit => 
    unit.code === code || 
    unit.displayCode === code || 
    unit.reference === code
  );
}
