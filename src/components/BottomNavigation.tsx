import { useRouter } from 'next/router';
import { useState } from 'react';
import { SharePointService } from '../services/SharePointService';

export default function BottomNavigation() {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle authenticated navigation
  const navigateWithAuth = async (path: string) => {
    try {
      setIsAuthenticating(true);
      setError(null);
      
      const spService = SharePointService.getInstance();
      
      // First check if already authenticated to avoid unnecessary auth flows
      const isAlreadyAuth = await spService.isAuthenticated();
      if (isAlreadyAuth) {
        // Already authenticated, proceed with navigation
        console.log('Already authenticated, navigating to:', path);
        router.push(path);
        return;
      }
      
      console.log('Not authenticated, starting authentication flow for:', path);
      await spService.authenticate();
      
      // If we get here, authentication was successful
      console.log('Authentication successful, navigating to:', path);
      router.push(path);
    } catch (err: any) {
      console.error('Authentication failed:', err);
      // Show more detailed error to help diagnose the issue
      const errorMessage = err.message || 'Unknown error';
      setError(`Authentication failed: ${errorMessage}. Please try again or refresh the page.`);
      
      // Log detailed error for debugging
      console.error('Authentication error details:', err);
      
      // Keep error visible longer (8 seconds)
      setTimeout(() => setError(null), 8000);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Get current route to highlight active tab
  const currentPath = router.pathname;
  
  return (
    <>
      {/* Authentication Error message */}
      {error && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-xl shadow-lg z-50">
          {error}
        </div>
      )}
      
      {/* Loading indicator during authentication */}
      {isAuthenticating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-neutral-900 rounded-xl p-5 flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mb-4"></div>
            <div className="text-white">Authenticating with SharePoint...</div>
          </div>
        </div>
      )}
      
      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-black border-t border-neutral-800 flex justify-around items-center py-3 z-40 shadow-lg">
        <div 
          className={`flex flex-col items-center ${currentPath === '/' ? 'text-blue-500' : 'text-neutral-400'} cursor-pointer`}
          onClick={() => router.push('/')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0A9 9 0 11 3 12a9 9 0 0118 0z" />
          </svg>
          <span className="text-xs">Qualifications</span>
        </div>
        
        <div 
          className={`flex flex-col items-center ${currentPath === '/portfolio' ? 'text-blue-500' : 'text-neutral-400'} cursor-pointer`}
          onClick={() => navigateWithAuth('/portfolio')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v1.5M3 7.5v9A2.25 2.25 0 005.25 18.75h13.5A2.25 2.25 0 0021 16.5v-9M3 7.5h18" />
          </svg>
          <span className="text-xs">Portfolio</span>
        </div>
        
        <div 
          className={`flex flex-col items-center ${currentPath === '/profile' ? 'text-blue-500' : 'text-neutral-400'} cursor-pointer`}
          onClick={() => navigateWithAuth('/profile')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75A2.25 2.25 0 0117.25 23.25h-10.5A2.25 2.25 0 014.5 21v-.75z" />
          </svg>
          <span className="text-xs">Profile</span>
        </div>
        
        <div 
          className={`flex flex-col items-center ${currentPath === '/teams' ? 'text-blue-500' : 'text-neutral-400'} cursor-pointer`}
          onClick={() => router.push('/teams')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
          <span className="text-xs">Teams</span>
        </div>
        
        <div 
          className={`flex flex-col items-center ${currentPath === '/assessor-review' ? 'text-blue-500' : 'text-neutral-400'} cursor-pointer`}
          onClick={() => navigateWithAuth('/assessor-review')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m6.306 0H9.694a1.5 1.5 0 01-1.5-1.5V9a1.5 1.5 0 011.5-1.5h5.612a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5z" />
          </svg>
          <span className="text-xs">Assessor Review</span>
        </div>
      </nav>
    </>
  );
}
