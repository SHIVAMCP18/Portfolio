import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

const ICONS = { 'customer.registered': '👋', 'order.created': '📦', 'invoice.created': '🧾', 'payment.completed': '💳', 'order.paid': '✅' };

export default function Notifications({ user }) {
  const [items, setItems] = useState(null);
  useEffect(() => {
    const load = () => api('GET', '/notifications').then(setItems).catch(() => setItems([]));
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <header className="page-head">
        <div><h1>Notifications</h1>
          <p className="muted">Notification Service (C# + Redis) listens to every event. E-mails land in <a href="http://localhost:8025" target="_blank" rel="noreferrer">Mailpit</a>.</p></div>
      </header>
      {items && items.length === 0 && <div className="card empty">Nothing yet.</div>}
      <div className="list">
        {(items || []).map(n => (
          <div key={n.id} className="card notification">
            <div className="n-icon">{ICONS[n.eventType] || '🔔'}</div>
            <div className="grow">
              <div className="row between"><strong>{n.subject}</strong><small className="muted">{new Date(n.createdAt).toLocaleString()}</small></div>
              <p>{n.message}</p>
              <div className="row">
                {n.channels.map(c => <span key={c} className="tag">{c.replace('_', '-')}</span>)}
                <code className="event">{n.eventType}</code>
                {user.role === 'ADMIN' && <small className="muted">customer {n.customerId.slice(0, 8)}</small>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
