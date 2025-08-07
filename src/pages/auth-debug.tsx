import dynamic from 'next/dynamic';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../lib/msalInstance';

// Client-side only component
function AuthDebugClient() {
  const { instance, accounts } = useMsal();

  const handleLogin = async () => {
    try {
      console.log('Current redirect URI:', instance.getConfiguration().auth.redirectUri);
      
      const response = await instance.loginPopup(loginRequest);
      console.log('Login response:', response);
    } catch (err: any) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = () => {
    instance.logout();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">MSAL Authentication Debug</h1>
        
        <div className="space-y-6">
          <div className="bg-neutral-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Current Configuration</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Client ID:</strong> {instance.getConfiguration().auth.clientId}</p>
              <p><strong>Authority:</strong> {instance.getConfiguration().auth.authority}</p>
              <p><strong>Redirect URI:</strong> {instance.getConfiguration().auth.redirectUri}</p>
              <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
              <p><strong>Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}</p>
            </div>
          </div>

          <div className="bg-neutral-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            <div className="space-y-2">
              <p><strong>Accounts:</strong> {accounts.length > 0 ? `${accounts.length} account(s) logged in` : 'No accounts'}</p>
              {accounts.length > 0 && (
                <div className="text-sm">
                  <p><strong>Account Name:</strong> {accounts[0].name}</p>
                  <p><strong>Account Username:</strong> {accounts[0].username}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-neutral-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-x-4">
              <button
                onClick={handleLogin}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                Login
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export as dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(AuthDebugClient), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">MSAL Authentication Debug</h1>
        <p>Loading...</p>
      </div>
    </div>
  )
}); 