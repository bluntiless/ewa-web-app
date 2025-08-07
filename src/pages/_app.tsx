// FORCE VERCEL DEPLOYMENT - Latest commit: 38a31b2 - Fixed PortfolioCompilationService and added evidence status refresh
import type { AppProps } from 'next/app';
import { MsalProvider } from '@azure/msal-react';
import { getMsalInstance } from '../lib/msalInstance';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  // Only render MSAL provider on client side
  if (typeof window === 'undefined') {
    return <Component {...pageProps} />;
  }

  return (
    <MsalProvider instance={getMsalInstance()}>
      <Component {...pageProps} />
    </MsalProvider>
  );
} 