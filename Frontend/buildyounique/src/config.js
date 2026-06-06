// ============================================================
// Buildyounique — central config
// Edit URLs / dates here only.
// ============================================================

// --- Backend base URL ----------------------------------------------
// Set VITE_API_BASE in your .env to override per environment.
//   .env.development → VITE_API_BASE=http://localhost:3000
//   .env.production  → VITE_API_BASE=https://api.buildyounique.com
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API_V1 = `${API_BASE}/api/v1`;

// --- API endpoints --------------------------------------------------
export const API_ENDPOINTS = {
  contact:    `${API_BASE}/api/v1/contact-enquiries`,
  careers:    `${API_BASE}/api/careers`,
  hackathon:  `${API_BASE}/api/hackathon`,
  training:   `${API_BASE}/api/training`,
  newsletter: `${API_BASE}/api/newsletter`,
  chat:       `${API_BASE}/api/chat`,
  brochure:   `${API_BASE}/api/brochure`,
  coupon:     `${API_BASE}/api/coupon`,
};

// --- Hackathon / team registration API (real backend: /api/v1) ------
export const HACKATHON_API = {
  colleges:        `${API_V1}/colleges`,                 // GET   list colleges (dropdown)
  hackathonEvents: `${API_V1}/hackathon-events`,         // GET   list hackathons (dropdown)
  teams:           `${API_V1}/teams`,                    // POST  create team  (+ GET /:id)
  teamVerifyEmail: `${API_V1}/teams/verify-email`,       // POST  { team_id, otp }  verify leader
  teamLogin:       `${API_V1}/teams/login`,              // POST  { team_leader_email }  send login OTP
  teamLoginVerify: `${API_V1}/teams/login/verify`,       // POST  { team_id, otp } -> { token }
  teamMembers:     `${API_V1}/teams/members`,            // POST  { team_id, email } (auth)  + GET ?team_id=
  memberVerify:    `${API_V1}/teams/members/verify-email`, // POST { member_id, otp } (auth)
  payHackathon:    `${API_V1}/payments/hackathon`,         // POST { team_id, amount, email } — swap for real gateway
  payTraining:     `${API_V1}/payments/training`,          // POST { training_id, amount, email } — swap for real gateway
};

// --- Single API helper (legacy POST forms) --------------------------
// Real fetch. Returns { ok, ...payload } from the server, or
// { ok: false, message } on network / non-2xx errors.
export async function apiCall(endpoint, payload) {
  console.log('[apiCall]', endpoint, payload);
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[apiCall] failed', err);
    return { ok: false, message: err.message || 'Request failed' };
  }
}

// --- Flexible API request (GET/POST/PUT, optional Bearer token) -----
// Returns { ok, status, message, data } — backend wraps payloads in `data`.
export async function apiRequest(url, { method = 'GET', body, token } = {}) {
  console.log('[apiRequest]', method, url, body || '');
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, message: json.message || `Request failed (${res.status})`, ...json };
    }
    return { ok: true, ...json };
  } catch (err) {
    console.error('[apiRequest] failed', err);
    return { ok: false, message: err.message || 'Network error — is the server running?' };
  }
}

// --- Team session (localStorage) ------------------------------------
// Persists the JWT + team id so a leader can reopen the dashboard.
const SESSION_KEY = 'byq_team_session';
export const teamSession = {
  get() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
    catch { return null; }
  },
  set(s) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); },
  clear() { localStorage.removeItem(SESSION_KEY); },
};

// --- Hackathon pricing ----------------------------------------------
export const FEE_PER_MEMBER = 600;   // ₹ per member (backend default)
export const TEAM_SIZE = 2;          // hackathons are 2-member teams

// --- Coupon validator -----------------------------------------------
// Mock coupon table — replace with real backend call when ready.
const COUPONS = {
  STUDENT50: { type: 'percent', value: 50, label: '50% off' },
  EARLYBIRD: { type: 'percent', value: 30, label: '30% off' },
  TEAM10:    { type: 'flat',    value: 100, label: '₹100 off' },
  BYU2026:   { type: 'percent', value: 25, label: '25% off' },
};
export async function validateCoupon(code) {
  console.log('[validateCoupon]', code);
  await new Promise((r) => setTimeout(r, 500));
  const c = COUPONS[code?.trim().toUpperCase()];
  if (!c) return { ok: false, message: 'Invalid coupon code' };
  return { ok: true, ...c };
}

// --- Discount end date ----------------------------------------------
// 20 days from now. Hardcoded to avoid reset on refresh.
export const DISCOUNT_END = new Date('2026-06-26T16:45:01+05:30');

// --- ASSETS — central image registry --------------------------------
// Swap any URL here once you have real photos.
// Every <img> uses these paths and has an onError fallback so a
// missing image never breaks the layout.
export const ASSETS = {
  // Team photos (5)
  team: {
    engineeringLead:   'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=480&h=480&fit=crop&q=80',
    designLead:        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=480&h=480&fit=crop&q=80',
    juniorDeveloper:   'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=480&h=480&fit=crop&q=80',
    projectManager:    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=480&h=480&fit=crop&q=80',
    aiEngineer:        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=480&h=480&fit=crop&q=80',
  },

  // Training course covers (6 + workplace)
  training: {
    fullstack:  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=960&h=600&fit=crop&q=80',
    mobile:     'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=960&h=600&fit=crop&q=80',
    ai:         'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=960&h=600&fit=crop&q=80',
    blockchain: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=960&h=600&fit=crop&q=80',
    cloud:      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=960&h=600&fit=crop&q=80',
    cybersec:   'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=960&h=600&fit=crop&q=80',
    workplace:  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1440&h=810&fit=crop&q=85',
  },

  // Portfolio covers (6)
  portfolio: {
    ecommerce:    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1040&h=780&fit=crop&q=80',
    fintech:      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1040&h=780&fit=crop&q=80',
    graphicLogos: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1040&h=780&fit=crop&q=80',
    eventBanners: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1040&h=780&fit=crop&q=80',
    mobileApp:    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1040&h=780&fit=crop&q=80',
    aiProduct:    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1040&h=780&fit=crop&q=80',
  },

  // Client logos (5) — wired to /public/logos/*.png
  clients: {
    fluencyHubb:   '/logos/fluencyhubb.png',
    ardb:          '/logos/ardb.png',
    sparkChat:     '/logos/sparkchat.png',
    pofInfraa:     '/logos/pofinfraa.png',
    haryanaNews:   '/logos/haryananews.png',
  },

  // Partner logos (2)
  partners: {
    circuitS:      '/logos/circuits.png',
    snaapii:       '/logos/snaapii.png',
  },
};