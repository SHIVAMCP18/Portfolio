import React from 'react';

const SERVICES = [
  { name: 'Customer', lang: 'Python · FastAPI', db: 'MongoDB', role: 'Accounts, profiles, issues JWTs' },
  { name: 'Product', lang: 'Node.js · Express', db: 'PostgreSQL', role: 'Catalogue, stock, gRPC ReserveStock' },
  { name: 'Order', lang: 'Java · Spring Boot', db: 'MySQL', role: 'Orders, outbox, CQRS read model' },
  { name: 'Billing', lang: 'Go', db: 'SQLite', role: 'Invoices, payments, outbox relay' },
  { name: 'Notification', lang: 'C# · ASP.NET Core', db: 'Redis', role: 'In-app, e-mail, SMS' }
];

const TOOLS = [
  { name: 'Consul', url: 'http://localhost:8500', what: 'Service discovery and health checks' },
  { name: 'RabbitMQ', url: 'http://localhost:15672', what: 'Topic exchange, queues, dead-letter queues' },
  { name: 'Grafana', url: 'http://localhost:3000', what: 'Dashboard, metrics and all service logs' },
  { name: 'Prometheus', url: 'http://localhost:9090/targets', what: 'Scrape targets (found via Consul) and alerts' },
  { name: 'Mailpit', url: 'http://localhost:8025', what: 'E-mails sent by the Notification Service' }
];

const PATTERNS = [
  ['API gateway', 'Kong terminates HTTPS, validates the JWT, rate-limits and adds an X-Request-ID.'],
  ['Discovery', 'Services register in Consul; Kong and Order Service look them up there.'],
  ['Sync calls', 'REST (Order → Customer) and gRPC (Order → Product, ReserveStock).'],
  ['Async events', 'RabbitMQ topic exchange retailflow.events with retries and dead-letter queues.'],
  ['Outbox + CDC', 'Order saves the order and its event in one MySQL transaction; Debezium streams the binlog to RabbitMQ.'],
  ['CQRS', 'Writes go to orders/order_items; the order pages read order_view, built from events.'],
  ['ACID / BASE', 'Each service commits locally (ACID); services agree eventually through events (BASE).'],
  ['Circuit breakers', 'Resilience4j on Order’s calls, Polly on e-mail sending: fail fast instead of hanging.'],
  ['Security', 'HTTPS, RS256 JWT, role checks in every service, least-privilege DB users, NetworkPolicies.'],
  ['Kubernetes', 'k8s/ manifests: StatefulSets, sidecar pod, probes, HPA, Secrets, NetworkPolicies.']
];

export default function Architecture() {
  return (
    <div>
      <header className="page-head">
        <div><h1>Architecture</h1><p className="muted">What happens behind each click on this website</p></div>
      </header>

      <div className="card arch">
        <div className="arch-row"><div className="node client">🌐 Browser (this website)</div></div>
        <div className="arrow">HTTPS + JWT ↓</div>
        <div className="arch-row"><div className="node gateway">Kong API Gateway</div><div className="node side">Consul ⇄ discovery</div></div>
        <div className="arrow">REST ↓</div>
        <div className="arch-row services">
          {SERVICES.map(s => (
            <div key={s.name} className="node service">
              <strong>{s.name}</strong><small>{s.lang}</small>
              <span className="db">🗄 {s.db}</span><p className="muted small">{s.role}</p>
            </div>
          ))}
        </div>
        <div className="arrow">Order → Customer (REST) · Order → Product (gRPC) · Debezium CDC → events ↓</div>
        <div className="arch-row"><div className="node broker">RabbitMQ · order.* · invoice.* · payment.* · customer.*</div></div>
        <div className="arrow">↓</div>
        <div className="arch-row"><div className="node side">Prometheus → Grafana ← Loki ← Promtail</div></div>
      </div>

      <h2 className="section">Patterns used</h2>
      <div className="patterns">
        {PATTERNS.map(([title, text]) => <div key={title} className="card pattern"><strong>{title}</strong><p className="muted small">{text}</p></div>)}
      </div>

      <h2 className="section">Infrastructure dashboards</h2>
      <div className="patterns">
        {TOOLS.map(t => (
          <a key={t.name} className="card pattern tool" href={t.url} target="_blank" rel="noreferrer">
            <strong>{t.name} ↗</strong><p className="muted small">{t.what}</p><code>{t.url}</code>
          </a>
        ))}
      </div>

      <div className="card notice">
        <b>Try the circuit breaker:</b> run <code>docker compose stop product-service</code> and place an order -
        the Order Service answers immediately with a "circuit breaker fallback" error. Start it again with
        <code> docker compose start product-service</code>.
      </div>
    </div>
  );
}
