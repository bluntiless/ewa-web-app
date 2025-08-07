import dynamic from 'next/dynamic';
import { useMsalAuth } from '../lib/useMsalAuth';

// Client-side only component
function TeamsPageClient() {
  const { account, loading, error } = useMsalAuth();

  if (loading) {
    return <div>Loading authentication system...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <div>
      <h1>Teams Page</h1>
      {account ? (
        <p>You are signed in as <strong>{account.username}</strong>.</p>
      ) : (
        <p>Signing in...</p>
      )}
    </div>
  );
}

// Export as dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(TeamsPageClient), {
  ssr: false,
  loading: () => (
    <div>
      <h1>Teams Page</h1>
      <p>Loading...</p>
    </div>
  )
});