import { useRouter } from 'next/router';
import { useState } from 'react';
import { Evidence, AssessmentStatus } from '../models/Evidence';
import { UnitType } from '../models/Unit'; 
import { PortfolioCompilationService } from '../services/PortfolioCompilationService';
import BottomNavigation from '../components/BottomNavigation';
import { useMsalAuth } from '../lib/useMsalAuth';

// Qualifications data using UnitType for consistency
const qualifications = [
  {
    id: UnitType.EWA,
    title: 'Experienced Worker Assessment',
    subtitle: 'EAL Level 3 Electrotechnical Experienced Worker Assessment',
    progress: 0,
    units: 6,
  },
  {
    id: UnitType.NVQ,
    title: 'Level 3 NVQ Diploma in Installing Electrotechnical Systems and Equipment',
    subtitle: 'EAL Level 3 NVQ Diploma in Installing Electrotechnical Systems and Equipment (1605)',
    progress: 0,
    units: 7,
  },
  {
    id: UnitType.RPL,
    title: 'Recognition of Prior Learning',
    subtitle: 'EAL RPL Units',
    progress: 0,
    units: 2,
  },
];

// City & Guilds qualifications
const cityAndGuildsQualifications = [
  {
    id: 'cg-performance',
    title: 'City & Guilds 2357 - Performance Units',
    subtitle: '8 Performance Units for City & Guilds 2357',
    progress: 0,
    units: 8,
  },
  {
    id: 'cg-knowledge',
    title: 'City & Guilds 2357 - Knowledge Units',
    subtitle: '9 Knowledge Units for City & Guilds 2357',
    progress: 0,
    units: 9,
  },
  {
    id: 'cg-all',
    title: 'City & Guilds 2357 - All Units',
    subtitle: 'Complete City & Guilds 2357 Level 3 Qualification',
    progress: 0,
    units: 17,
  },
];

export default function Home() {
  const router = useRouter();
  const { account, loading, error: msalError } = useMsalAuth();
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return <div>Loading authentication...</div>;
  if (msalError) return <div>Error: {String(msalError)}</div>;
  if (!account) return <div>Signing in...</div>;

  const handleQualificationClick = (qualificationType: string) => {
    router.push({
      pathname: '/units',
      query: { type: qualificationType }
    });
  };

  const handleAddEvidence = () => {
    const newEvidence: Evidence = {
      id: crypto.randomUUID(),
      criteriaCode: '',
      unitCode: '',
      title: '',
      description: '',
      dateUploaded: new Date(),
      assessmentStatus: AssessmentStatus.Pending
    };
    setEvidence([...evidence, newEvidence]);
  };

  const handleUpdateEvidence = (id: string, updates: Partial<Evidence>) => {
    setEvidence(evidence.map(e => 
      e.id === id ? { ...e, ...updates } : e
    ));
  };

  const handleCompilePortfolio = async () => {
    try {
      setIsCompiling(true);
      setError(null);
      // Use new PortfolioCompilationService constructor instead of singleton
      const portfolioService = new PortfolioCompilationService();
      await portfolioService.downloadPortfolio(evidence);
    } catch (err: any) {
      setError(err.message || 'Failed to compile portfolio');
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="max-w-lg mx-auto pt-8 pb-24 px-4">
        <h1 className="text-4xl font-extrabold mb-8">Qualifications</h1>
        {/* EAL Qualifications */}
        <h2 className="text-2xl font-bold mb-4 text-blue-400">EAL Qualifications</h2>
        <div className="space-y-6 mb-8">
          {qualifications.map((q) => (
            <button
              key={q.id}
              className="w-full text-left bg-neutral-900 rounded-2xl shadow-lg px-6 py-5 flex flex-col gap-2 hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={() => handleQualificationClick(q.id)}
            >
              <div className="text-xl font-bold leading-tight">{q.title}</div>
              <div className="text-neutral-400 text-base mb-1">{q.subtitle}</div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>{q.progress}% Complete</span>
                <span>{`0/${q.units} Units`}</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${q.progress}%` }}
                ></div>
              </div>
            </button>
          ))}
        </div>
        {/* City & Guilds Qualifications */}
        <h2 className="text-2xl font-bold mb-4 text-blue-400">City & Guilds Qualifications</h2>
        <div className="space-y-6">
          {cityAndGuildsQualifications.map((q) => (
            <button
              key={q.id}
              className="w-full text-left bg-neutral-900 rounded-2xl shadow-lg px-6 py-5 flex flex-col gap-2 hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={() => handleQualificationClick(q.id)}
            >
              <div className="text-xl font-bold leading-tight">{q.title}</div>
              <div className="text-neutral-400 text-base mb-1">{q.subtitle}</div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>{q.progress}% Complete</span>
                <span>{`0/${q.units} Units`}</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${q.progress}%` }}
                ></div>
              </div>
            </button>
          ))}
        </div>
        <BottomNavigation />
        {error && (
          <div className="fixed bottom-32 left-4 right-4 bg-red-900 bg-opacity-80 border border-red-500 rounded-xl py-3 px-4 text-red-100 shadow-lg">
            {error}
            <button 
              className="absolute top-2 right-2 text-red-300 hover:text-red-100"
              onClick={() => setError(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            </button>
          </div>
        )}
        {isCompiling && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-neutral-900 rounded-xl p-5 flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mb-4"></div>
              <div className="text-white">
                Compiling portfolio...
          </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
} 