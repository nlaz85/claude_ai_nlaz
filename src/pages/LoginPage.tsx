import { useState, type FormEvent } from 'react';
import { Anchor } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function LoginPage() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const success = login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <Anchor size={48} />
          <h1>ShipYard CMS</h1>
          <p>Content Management for Dealers</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="alert alert--error">{error}</div>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your.email@shipyard.it"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input"
            />
          </div>
          <button type="submit" className="btn btn--primary btn--full">
            Sign In
          </button>
          <p className="login-hint">Demo: use any email and password</p>
        </form>
      </div>
    </div>
  );
}
