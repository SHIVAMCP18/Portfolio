import React, { useState } from 'react';
import { api, currentUser, setToken } from '../api.js';

export default function Login({ onLogin, notify }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const set = key => e => setForm({ ...form, [key]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === 'register') {
        await api('POST', '/auth/register', { name: form.name, email: form.email, password: form.password, phone: form.phone || null });
        notify('Account created - a welcome e-mail is on its way');
      }
      const { token } = await api('POST', '/auth/login', { email: form.email, password: form.password });
      setToken(token);
      onLogin(currentUser());
    } catch (error) {
      notify(error.message, 'error');
    } finally { setBusy(false); }
  }

  const fill = (email, password) => setForm({ ...form, email, password });

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="brand big"><span className="logo">R</span> RetailFlow</div>
        <h1>Order management on five microservices.</h1>
        <p>Every click on this site goes through the Kong API gateway to services written in
          Python, Node.js, Java, Go and C# - each with its own database.</p>
        <ul className="stack">
          <li><b>Customer</b> Python · MongoDB</li>
          <li><b>Product</b> Node.js · PostgreSQL</li>
          <li><b>Order</b> Java · MySQL</li>
          <li><b>Billing</b> Go · SQLite</li>
          <li><b>Notification</b> C# · Redis</li>
        </ul>
      </div>
      <form className="card login-card" onSubmit={submit}>
        <div className="tabs">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Sign in</button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Create account</button>
        </div>
        {mode === 'register' && (<>
          <label>Full name<input required minLength={2} value={form.name} onChange={set('name')} placeholder="Asha Shah" /></label>
          <label>Phone (optional, for SMS)<input value={form.phone} onChange={set('phone')} placeholder="+91 99999 99999" /></label>
        </>)}
        <label>E-mail<input required type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" /></label>
        <label>Password<input required type="password" minLength={mode === 'register' ? 8 : 1} value={form.password} onChange={set('password')} placeholder={mode === 'register' ? 'At least 8 characters' : ''} /></label>
        <button className="primary" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
        <div className="hint">
          Demo admin: <a href="#" onClick={e => { e.preventDefault(); setMode('login'); fill('admin@example.com', 'Admin@12345'); }}>admin@example.com / Admin@12345</a>
          <br />Or create a customer account.
        </div>
        <small className="muted">Signed in with an RS256 JWT issued by the Customer Service.</small>
      </form>
    </div>
  );
}
