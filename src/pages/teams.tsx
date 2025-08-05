import { useMsalAuth } from '../lib/useMsalAuth';

export default function TeamsPage() {
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
