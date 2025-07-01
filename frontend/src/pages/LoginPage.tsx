import { useEffect, useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@frontend/context/AuthContext';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, loading, login } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate('/me');
  }, [loading, user, navigate]);

  if (loading || user) return <p>Loading…</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/me');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error-msg">{error}</p>}

        <button className="submit-btn" type="submit">
          Login
        </button>

        <div className="divider">or</div>

        <button
          type="button"
          className="google-btn"
          onClick={() => (window.location.href = '/api/v1/auth/google')}
        >
          <img
            src="/google-icon.png"
            alt="Google Icon"
            className="google-icon"
          />
          Continue with Google
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
