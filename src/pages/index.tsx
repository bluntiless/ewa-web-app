import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { instance } = useMsal();
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    if (instance) {
      setConfig(instance.getConfiguration());
    }
  }, [instance]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">EWA NVQ Portfolio Web App</h1>
        
        <div className="space-y-6">
          <div className="bg-neutral-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">MSAL Configuration</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Client ID:</strong> {config?.auth?.clientId || 'Loading...'}</p>
              <p><strong>Authority:</strong> {config?.auth?.authority || 'Loading...'}</p>
              <p><strong>Redirect URI:</strong> {config?.auth?.redirectUri || 'Loading...'}</p>
              <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
              <p><strong>Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}</p>
            </div>
          </div>

          <div className="bg-neutral-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <div className="space-y-2">
              <a href="/auth-debug" className="text-blue-400 hover:text-blue-300 block">Authentication Debug Page</a>
              <a href="/test-login" className="text-blue-400 hover:text-blue-300 block">Test Login Page</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 