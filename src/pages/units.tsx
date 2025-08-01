import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ewaUnits } from '../data/ewaUnits';
import { nvqUnits, rplUnits } from '../data/units';
import { units2357, performanceUnits, knowledgeUnits } from '../data/cityAndGuildsUnits';
import { Unit, UnitType, UnitModel } from '../models/Unit';
import type { CityAndGuildsUnit } from '../data/cityAndGuildsUnits';
import BottomNavigation from '../components/BottomNavigation';

export default function Units() {
  const router = useRouter();
  type ProcessedUnit = Unit & {
    progress: number;
    pendingPercent: number;
    approvedCriteria: number;
    pendingCriteria: number;
    totalCriteria: number;
  };
  const [units, setUnits] = useState<ProcessedUnit[]>([]);
  const [cgUnits, setCgUnits] = useState<CityAndGuildsUnit[]>([]);
  const [qualificationTitle, setQualificationTitle] = useState('');
  const [isShowingCG, setIsShowingCG] = useState(false);
  
  useEffect(() => {
    // Get qualification type from query string or default to EWA
    const qualificationType = router.query.type as string || UnitType.EWA;
    
    // Set units and title based on qualification type
    let unitsToShow: Unit[] = [];
    let cgUnitsToShow: CityAndGuildsUnit[] = [];
    let title = '';
    let showingCG = false;
    
    switch(qualificationType) {
      case UnitType.EWA:
        unitsToShow = [...ewaUnits];
        title = 'Experienced Worker Assessment';
        break;
      case UnitType.NVQ:
        unitsToShow = [...nvqUnits];
        title = 'NVQ Diploma in Installing Electrotechnical Systems';
        break;
      case UnitType.RPL:
        unitsToShow = [...rplUnits];
        title = 'Recognition of Prior Learning';
        break;
      case 'cg':
      case 'cg-performance':
        cgUnitsToShow = [...performanceUnits];
        title = 'City & Guilds 2357 - Performance Units';
        showingCG = true;
        break;
      case 'cg-knowledge':
        cgUnitsToShow = [...knowledgeUnits];
        title = 'City & Guilds 2357 - Knowledge Units';
        showingCG = true;
        break;
      case 'cg-all':
        cgUnitsToShow = [...units2357];
        title = 'City & Guilds 2357 Units';
        showingCG = true;
        break;
      default:
        unitsToShow = [...ewaUnits];
        title = 'Experienced Worker Assessment';
    }
    
    setIsShowingCG(showingCG);
    
    if (showingCG) {
      // City & Guilds units
      setCgUnits(cgUnitsToShow);
    } else {
      // Use a local type for processed units
      const processedUnits: ProcessedUnit[] = unitsToShow.map(unit => {
        const progress = UnitModel.calculateProgress(unit);
      return {
        ...unit,
          progress: progress.approvedPercent,
          pendingPercent: progress.pendingPercent,
          approvedCriteria: progress.approved,
          pendingCriteria: progress.pending,
          totalCriteria: progress.total
      };
    });
      setUnits(processedUnits);
    }
    
    setQualificationTitle(title);
  }, [router.query]);

  const handleUnitClick = (unitCode: string) => {
    router.push({
      pathname: '/criteria',
      query: { 
        unit: unitCode,
        type: isShowingCG ? 'cg' : router.query.type || UnitType.EWA
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="max-w-lg mx-auto pt-8 pb-24 px-4">
        <button className="text-blue-400 mb-4" onClick={() => router.back()}>&larr; Back</button>
        <h1 className="text-3xl font-extrabold mb-8">{qualificationTitle}</h1>
        
        {isShowingCG ? (
          // City & Guilds units
          cgUnits.length === 0 ? (
            <div className="text-center text-neutral-400 py-8">
              Loading City & Guilds units...
            </div>
          ) : (
            <div className="space-y-6">
              {cgUnits.map((unit) => (
                <button
                  key={unit.id}
                  className="w-full text-left bg-neutral-900 rounded-2xl shadow-lg px-6 py-5 flex flex-col gap-2 hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                  onClick={() => handleUnitClick(unit.code)}
                >
                  <div className="text-lg font-bold leading-tight">{unit.displayCode} {unit.title}</div>
                  <div className="text-xs text-neutral-400 mb-1">
                    <span>{unit.isPerformanceUnit ? 'Performance Unit' : 'Knowledge Unit'}</span>
                  </div>
                </button>
              ))}
            </div>
          )
        ) : (
          // Standard units (EWA, NVQ, RPL)
          units.length === 0 ? (
          <div className="text-center text-neutral-400 py-8">
            Loading units...
          </div>
        ) : (
          <div className="space-y-6">
              {units.map((unit: ProcessedUnit) => (
              <button
                key={unit.id}
                className="w-full text-left bg-neutral-900 rounded-2xl shadow-lg px-6 py-5 flex flex-col gap-2 hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                onClick={() => handleUnitClick(unit.code)}
              >
                <div className="text-lg font-bold leading-tight">{unit.code} {unit.title}</div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <span>
                      <span className="text-green-400">{unit.progress}% Approved</span>
                      {unit.pendingPercent > 0 && (
                        <span className="text-yellow-400 ml-2">{unit.pendingPercent}% Pending</span>
                      )}
                    </span>
                    <span>{`${unit.approvedCriteria || 0}${unit.pendingCriteria ? `+${unit.pendingCriteria}` : ''}/${unit.totalCriteria || 0} Criteria`}</span>
                </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden flex">
                  <div
                    className="h-2 bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${unit.progress || 0}%` }}
                  ></div>
                    {unit.pendingPercent > 0 && (
                      <div
                        className="h-2 bg-yellow-400 rounded-full transition-all duration-300"
                        style={{ width: `${unit.pendingPercent}%` }}
                      ></div>
                    )}
                </div>
              </button>
            ))}
          </div>
          )
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
} 