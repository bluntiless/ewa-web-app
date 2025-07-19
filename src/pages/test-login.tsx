import { useEffect, useState } from 'react';
import { msalInstance } from '../lib/msalInstance';
import { AccountInfo } from '@azure/msal-browser';

export default function TestLogin() {
  const [account, setAccount] = useState<AccountInfo | null>(null);

  useEffect(() => {
    const login = async () => {
      try {
        // Explicitly initialize MSAL if it has an initialize method
        if (typeof msalInstance.initialize === 'function') {
          await msalInstance.initialize();
        }

        await msalInstance.handleRedirectPromise();

        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          // Use redirect instead of popup to avoid popup blocking
          await msalInstance.loginRedirect({
            scopes: ['User.Read'],
            prompt: 'select_account',
          });
          // Don't set account here as we're redirecting
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