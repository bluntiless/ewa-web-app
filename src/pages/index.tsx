import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">EWA NVQ Portfolio Web App</h1>
        
        <div className="space-y-6">
          <div className="bg-neutral-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Status</h2>
            <div className="space-y-2 text-sm">
              <p><strong>✅ App is working!</strong></p>
              <p><strong>Build Status:</strong> Success</p>
              <p><strong>Deployment:</strong> Live</p>
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