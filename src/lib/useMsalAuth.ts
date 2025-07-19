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
        const response = await msalInstance.handleRedirectPromise();
        if (!isMounted) return;

        // If we have a response from redirect, set the account
        if (response && response.account) {
          setAccount(response.account);
          setLoading(false);
          return;
        }

        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setLoading(false);
        } else {
          // Use redirect instead of popup to avoid popup blocking
          await msalInstance.loginRedirect({ scopes, prompt: 'select_account' });
          // Don't set loading to false here as we're redirecting
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