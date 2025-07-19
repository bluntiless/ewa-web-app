import { useEffect, useState } from 'react';
import { msalInstance } from './msalInstance';
import { AccountInfo } from '@azure/msal-browser';

export function useMsalAuth(scopes = ['User.Read']) {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    let isMounted = true;
    const initializeAuth = async () => {
      try {
        // Initialize MSAL first
        await msalInstance.initialize();
        if (!isMounted) return;

        // Handle any redirect promise first
        await msalInstance.handleRedirectPromise();
        if (!isMounted) return;

        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setLoading(false);
        } else {
          // Only trigger login if we don't have an account
          const response = await msalInstance.loginPopup({ scopes, prompt: 'select_account' });
          if (isMounted) {
            setAccount(response.account);
            setLoading(false);
          }
        }
      } catch (e) {
        if (isMounted) {
          setError(e);
          setLoading(false);
        }
      }
    };

    initializeAuth();
    return () => { isMounted = false; };
  }, []); // Remove scopes from dependency array to prevent re-runs

  useEffect(() => {
    console.log('useMsalAuth state:', { account, loading, error });
  }, [account, loading, error]);

  return { account, loading, error };
} 