import { useEffect, useState } from 'react';
import { getMsalInstance } from '../lib/msalInstance';
import { AccountInfo } from '@azure/msal-browser';

export default function TestLogin() {
  const [account, setAccount] = useState<AccountInfo | null>(null);

  useEffect(() => {
    const login = async () => {
      try {
        const msalInstance = getMsalInstance();
        
        // Explicitly initialize MSAL if it has an initialize method
        if (typeof msalInstance.initialize === 'function') {
          await msalInstance.initialize();
        }

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