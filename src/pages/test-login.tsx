import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { msalInstance } from '../lib/msalInstance';
import { AccountInfo } from '@azure/msal-browser';

// Client-side only component
function TestLoginClient() {
  const [account, setAccount] = useState<AccountInfo | null>(null);

  useEffect(() => {
    const login = async () => {
      try {
        await msalInstance.handleRedirectPromise();

        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          const response = await msalInstance.loginPopup({
            scopes: ['User.Read'],
            prompt: 'select_account',
          });
          setAccount(response.account);
        }
      } catch (e) {
        console.error('MSAL login error:', e);
      }
    };

    login();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Test Login</h1>
      {account ? (
        <p>✅ Logged in as: <strong>{account.username}</strong></p>
      ) : (
        <p>Attempting login...</p>
      )}
    </div>
  );
}

// Export as dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(TestLoginClient), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 40 }}>
      <h1>Test Login</h1>
      <p>Loading...</p>
    </div>
  )
});