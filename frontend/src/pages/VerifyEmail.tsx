import { useEffect, useState } from 'react';
import './VerifyMail.css';

export default function VerifyEmail() {
  const [status, setStatus] = useState<
    'idle' | 'verifying' | 'success' | 'fail'
  >('idle');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(window.location.search).get(
      'token'
    );
    if (!tokenFromUrl) {
      setStatus('fail');
      setMessage('Missing token');
    } else {
      setToken(tokenFromUrl);
    }
  }, []);

  const handleVerify = async () => {
    if (!token) return;

    setStatus('verifying');
    try {
      const res = await fetch('/api/v1/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus('success');
        setMessage('Your email has been confirmed! You can now log in.');
      } else {
        throw new Error(data.error || 'Verification failed');
      }
    } catch (err: any) {
      setStatus('fail');
      setMessage(err.message);
    }
  };

  return (
    <div className="verify-container">
      {status === 'idle' && token && (
        <>
          <h2>Confirm your email</h2>
          <p>Click the button below to confirm your email address.</p>
          <button className="confirm-btn" onClick={handleVerify}>
            Confirm Email
          </button>
        </>
      )}

      {status === 'verifying' && <p>Verifying…</p>}
      {status === 'success' && <h2 className="success">{message}</h2>}
      {status === 'fail' && <h2 className="error">{message}</h2>}
    </div>
  );
}
