# Frontend Monitoring Dashboard 📊

A framework-agnostic session recording and analytics platform — similar to Hotjar or Microsoft Clarity, but built from scratch. One script tag monitors any web application.

**Live:** [shivamsingh.website/monitoring](https://shivamsingh.website/monitoring)

---

## Features

### Session Recorder (recorder.js)
- **Framework-agnostic** — works in Angular, React, Vue, plain HTML
- **Single script tag** injection — like Google Analytics
- Captures: clicks (x/y + element), scroll depth, navigation, DOM mutations, JS errors
- **Batch flush** every 5 seconds — minimal performance impact
- `keepalive: true` on page unload — no events lost

### Dashboard (Angular)
- SaaS-style light theme (Datadog/Mixpanel-inspired)
- Stats: total sessions, clicks, errors, avg duration
- App distribution bars (Portfolio vs FreeFlix vs RAG vs Monitoring)
- Session table with filters by app + errors only
- Auto-refresh every 30 seconds

### Session Detail
- **Event timeline** — all events as colored dots on a scrubber
- **Navigation path** — visual flow of pages visited with app badges
- **Click map** — x/y dot plot with hover tooltips showing element name
- **Click list** — scrollable table of all clicks with timestamps
- **Event list** — filterable by type (click/nav/scroll/dom/error)

---

## How It Works

```
Any website
    ↓
<script src="https://api.shivamsingh.website/recorder.js"></script>
    ↓
recorder.js starts automatically
    ↓
Captures events → buffers locally → flushes every 5s
    ↓
POST /api/monitoring/events
    ↓
PostgreSQL (mon_sessions + mon_events)
    ↓
Angular Dashboard
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Recorder | Vanilla JavaScript (no dependencies) |
| Frontend | Angular 19, TypeScript, SCSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL with JSONB (Neon DB) |
| Deployment | Vercel + Render |

---

## recorder.js — Key Concepts

### Click Capture
```javascript
document.addEventListener('click', e => {
  push({
    type: 'click',
    x: Math.round(e.clientX),
    y: Math.round(e.clientY),
    target: sanitizeTarget(e.target) // "button.nav-link[Contact]"
  });
}, { passive: true }); // passive = doesn't block scroll
```

### SPA Navigation (Angular/React)
```javascript
// Monkey-patch History API to capture route changes
const origPush = history.pushState.bind(history);
history.pushState = function(...args) {
  origPush(...args);
  currentApp = getApp(); // update app based on new URL
  recordNav();
};
```

### Event Batching
```javascript
// Buffer events, flush every 5 seconds
let eventBuffer = [];

setInterval(async () => {
  if (!eventBuffer.length) return;
  const events = [...eventBuffer];
  eventBuffer = [];
  await fetch('/api/monitoring/events', {
    body: JSON.stringify({ sessionId, events }),
    keepalive: true  // survives page unload
  });
}, 5000);
```

### App Detection
```javascript
function getApp() {
  const path = window.location.pathname;
  if (path.startsWith('/freeflix'))   return 'FreeFlix';
  if (path.startsWith('/rag'))        return 'RAG';
  if (path.startsWith('/monitoring')) return 'Monitoring';
  return 'Portfolio';
}
```

---

## Database Schema

```sql
-- One row per user visit
CREATE TABLE mon_sessions (
  id           TEXT PRIMARY KEY,       -- UUID
  app          TEXT NOT NULL,          -- FreeFlix / RAG / Portfolio / Monitoring
  user_agent   TEXT,
  screen_w     INTEGER,
  screen_h     INTEGER,
  started_at   TIMESTAMP DEFAULT NOW(),
  duration_ms  INTEGER DEFAULT 0,
  click_count  INTEGER DEFAULT 0,
  page_count   INTEGER DEFAULT 0,
  error_count  INTEGER DEFAULT 0
);

-- Every interaction
CREATE TABLE mon_events (
  id         SERIAL PRIMARY KEY,
  session_id TEXT REFERENCES mon_sessions(id) ON DELETE CASCADE,
  type       TEXT,         -- click / scroll / nav / dom / error
  ts         BIGINT,       -- Unix timestamp (ms)
  x          INTEGER,      -- click x coordinate
  y          INTEGER,      -- click y coordinate
  target     TEXT,         -- element description
  value      JSONB         -- flexible extra data
);
```

---

## API Routes

```
POST /api/monitoring/session       — Create session
POST /api/monitoring/events        — Batch insert events
GET  /api/monitoring/sessions      — List sessions (with filters)
GET  /api/monitoring/sessions/:id  — Session + all events (for replay)
GET  /api/monitoring/stats         — Aggregate stats
PATCH /api/monitoring/session/:id/app — Update app on navigation
```

---

## Built On Real Experience

This project draws directly from work at **Cavisson Systems** (Jan 2023 – Nov 2024) where I built similar features for the NetVision APM platform:
- Session replay with nested iframe fix (recursive DOM traversal)
- Element inspection with computed styles visibility filtering
- Performance dashboards (LCP, FID, CLS)

---

## Inject Into Any App

```html
<!-- Add to any HTML file -->
<script src="https://api.shivamsingh.website/recorder.js"></script>
```

That's it. Sessions start appearing in the dashboard immediately.

---

*Built by [Shivam Singh](https://shivamsingh.website) — Jun 2026*
