// Models converted from Swift to TypeScript
export enum UnitType {
  EWA = 'ewa',   // NETP3 units
  NVQ = 'nvq',   // ELTP3 units
  RPL = 'rpl'    // RPL units
}

export interface PerformanceCriteria {
  id?: string;
  code: string;
  description: string;
  isCompleted?: boolean;
  status?: 'not-started' | 'pending' | 'approved';
}

export interface LearningOutcome {
  number: string;
  title: string;
  performanceCriteria: PerformanceCriteria[];
}

export interface Unit {
  id: string;
  code: string;          // For internal use (e.g., "ELTP3-001")
  displayCode: string;   // For UI display (e.g., "ELTP3/001")
  reference: string;     // Full reference
  title: string;
  description?: string;
  type: UnitType;
  creditValue?: number;
  glh?: number;          // Guided learning hours
  progress?: number;     // 0-100 percentage
  learningOutcomes?: LearningOutcome[];
  
  // Computed properties
  completedCriteria?: number;
  totalCriteria?: number;
}

// Helper class for Unit operations
export class UnitModel {
  static getUnitByCode(code: string, units: Unit[]): Unit | undefined {
    return units.find(unit => 
      unit.code === code || 
      unit.displayCode === code || 
      unit.reference === code
    );
  }
  
  static calculateProgress(unit: Unit): {
    approved: number;
    pending: number;
    notStarted: number;
    total: number;
    approvedPercent: number;
    pendingPercent: number;
  } {
    if (!unit.learningOutcomes || unit.learningOutcomes.length === 0) {
      return { approved: 0, pending: 0, notStarted: 0, total: 0, approvedPercent: 0, pendingPercent: 0 };
    }
    const allCriteria = unit.learningOutcomes.flatMap(lo => lo.performanceCriteria);
    const approved = allCriteria.filter(pc => pc.status === 'approved').length;
    const pending = allCriteria.filter(pc => pc.status === 'pending').length;
    const notStarted = allCriteria.filter(pc => !pc.status || pc.status === 'not-started').length;
    const total = allCriteria.length;
    const approvedPercent = total > 0 ? Math.round((approved / total) * 100) : 0;
    const pendingPercent = total > 0 ? Math.round((pending / total) * 100) : 0;
    return { approved, pending, notStarted, total, approvedPercent, pendingPercent };
  }
  
  static getSortedPerformanceCriteria(performanceCriteria: PerformanceCriteria[]): PerformanceCriteria[] {
    return [...performanceCriteria].sort((pc1, pc2) => {
      // Compare numeric parts of codes (e.g., "1.1" < "1.2")
      const pc1Parts = pc1.code.split('.');
      const pc2Parts = pc2.code.split('.');
      
      // Compare first number (e.g., 1 vs 2)
      const firstNum1 = parseInt(pc1Parts[0]);
      const firstNum2 = parseInt(pc2Parts[0]);
      
      if (firstNum1 !== firstNum2) {
        return firstNum1 - firstNum2;
      }
      
      // If first numbers are equal, compare second number (e.g., 1.1 vs 1.2)
      if (pc1Parts.length > 1 && pc2Parts.length > 1) {
        return parseInt(pc1Parts[1]) - parseInt(pc2Parts[1]);
      }
      
      // If no second number, shorter code comes first
      return pc1Parts.length - pc2Parts.length;
    });
  }
}
