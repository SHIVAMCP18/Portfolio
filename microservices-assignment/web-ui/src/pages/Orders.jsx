import React, { useEffect, useState } from 'react';
import { api, money } from '../api.js';

// The saga steps as they arrive from RabbitMQ into the CQRS read model.
const STEPS = [
  { event: 'order.created', title: 'Order placed', detail: 'Order Service saved the order, its items and an outbox event in one MySQL transaction.' },
  { event: 'invoice.created', title: 'Invoice created', detail: 'Debezium published order.created; Billing Service (Go) created the invoice.' },
  { event: 'payment.completed', title: 'Payment received', detail: 'Billing Service recorded the payment and published payment.completed.' },
  { event: 'order.paid', title: 'Order confirmed', detail: 'Order Service consumed payment.completed and marked the order PAID.' }
];

export default function Orders({ user, selected, go, notify }) {
  const [orders, setOrders] = useState(null);
  useEffect(() => { api('GET', '/orders').then(setOrders).catch(e => { notify(e.message, 'error'); setOrders([]); }); }, [selected]);

  if (selected) return <OrderDetail id={selected} go={go} notify={notify} user={user} />;

  return (
    <div>
      <header className="page-head">
        <div><h1>{user.role === 'ADMIN' ? 'All orders' : 'My orders'}</h1>
          <p className="muted">Read from the CQRS read model <code>order_view</code> (Order Service, Java + MySQL)</p></div>
      </header>
      {orders && orders.length === 0 && <div className="card empty">No orders yet. <a href="#/shop">Go shopping →</a></div>}
      <div className="list">
        {(orders || []).map(o => (
          <button key={o.orderId} className="card list-row" onClick={() => go('orders', o.orderId)}>
            <div><strong>#{o.orderId.slice(0, 8)}</strong><small className="muted">{new Date(o.createdAt).toLocaleString()}</small></div>
            <div className="muted">{o.items.length} item{o.items.length === 1 ? '' : 's'}{user.role === 'ADMIN' ? ` · ${o.customerName}` : ''}</div>
            <strong>{money(o.total, o.currency)}</strong>
            <StatusPill status={o.status} />
          </button>
        ))}
      </div>
    </div>
  );
}

function OrderDetail({ id, go, notify }) {
  const placed = JSON.parse(sessionStorage.getItem(`rf_order_${id}`) || 'null');
  const [order, setOrder] = useState(null);
  const [waiting, setWaiting] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let stop = false;
    const poll = async () => {
      try {
        const view = await api('GET', `/orders/${id}`, null, { quiet: true });
        if (!stop) { setOrder(view); setWaiting(false); }
        if (view.status === 'PAID') return;
      } catch (error) {
        if (error.status !== 404) { notify(error.message, 'error'); return; }
      }
      if (!stop) setTimeout(poll, 1200);
    };
    poll();
    return () => { stop = true; };
  }, [id]);

  async function pay(method) {
    setPaying(true);
    try {
      await api('POST', `/billing/invoices/${order.invoiceId}/pay`, { method });
      notify('Payment recorded by the Billing Service');
      setOrder({ ...order });
    } catch (error) { notify(error.message, 'error'); }
    finally { setPaying(false); }
  }

  const view = order || (placed && { ...placed, history: [], invoiceId: null, paymentStatus: null });
  const done = new Set((order?.history || []).map(h => h.event));
  const at = event => order?.history?.find(h => h.event === event)?.at;

  return (
    <div>
      <header className="page-head">
        <div><button className="link" onClick={() => go('orders')}>← All orders</button>
          <h1>Order #{id.slice(0, 8)}</h1></div>
        {view && <StatusPill status={view.status} />}
      </header>

      {waiting && (
        <div className="card notice">
          ⏳ <b>Eventual consistency in action:</b> the order is saved, but the read model is built
          asynchronously from events, so it can take a moment to appear here.
        </div>
      )}

      <div className="detail">
        <div className="card">
          <h2>Progress</h2>
          <ol className="timeline">
            {STEPS.map(step => (
              <li key={step.event} className={done.has(step.event) ? 'done' : ''}>
                <span className="dot">{done.has(step.event) ? '✓' : ''}</span>
                <div>
                  <strong>{step.title}</strong>
                  {at(step.event) && <small className="muted"> · {new Date(at(step.event)).toLocaleTimeString()}</small>}
                  <p className="muted small">{step.detail}</p>
                  <code className="event">{step.event}</code>
                </div>
              </li>
            ))}
          </ol>
          {order?.invoiceId && order.paymentStatus !== 'PAID' && (
            <div className="pay-box">
              <div><strong>Invoice {order.invoiceId}</strong><small className="muted">waiting for payment</small></div>
              <div className="row">
                {['UPI', 'CARD', 'NETBANKING'].map(m => <button key={m} className="primary" disabled={paying} onClick={() => pay(m)}>Pay with {m}</button>)}
              </div>
            </div>
          )}
        </div>

        {view && (
          <div className="card">
            <h2>Items</h2>
            {view.items.map(item => (
              <div key={item.productId} className="row between item-line">
                <span>{item.quantity} × {item.name}</span><span>{money(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
            <div className="row between total"><span>Total</span><strong>{money(view.total, view.currency)}</strong></div>
            <dl className="meta">
              <dt>Customer</dt><dd>{view.customerName}</dd>
              <dt>Invoice</dt><dd>{view.invoiceId || '—'}</dd>
              <dt>Payment</dt><dd>{view.paymentStatus || '—'}</dd>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}

export function StatusPill({ status }) {
  const labels = { PENDING_PAYMENT: 'Awaiting payment', PAID: 'Paid', UNPAID: 'Unpaid', CANCELLED: 'Cancelled' };
  return <span className={`pill ${String(status).toLowerCase()}`}>{labels[status] || status}</span>;
}
