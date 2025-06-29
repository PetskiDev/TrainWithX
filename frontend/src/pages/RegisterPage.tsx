import { useEffect, useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@frontend/context/AuthContext';

function RegisterPage() {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, loading, register } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/me');
    }
  }, [loading, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register(form.email, form.username, form.password);
      navigate('/me');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
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

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
