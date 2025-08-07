// FORCE VERCEL DEPLOYMENT - Latest commit: 38a31b2 - Fixed PortfolioCompilationService and added evidence status refresh
import type { AppProps } from 'next/app';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from '../lib/msalInstance';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MsalProvider instance={msalInstance}>
      <Component {...pageProps} />
    </MsalProvider>
  );
} 