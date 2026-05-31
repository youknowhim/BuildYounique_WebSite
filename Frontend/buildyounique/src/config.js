// ============================================================
// Buildyounique — central config
// Edit URLs / dates here only.
// ============================================================

// --- API endpoints --------------------------------------------------
// Fill in real URLs when backend is live, then uncomment the real fetch
// block inside apiCall() below.
export const API_ENDPOINTS = {
  contact:    'https://api.buildyounique.com/contact',
  careers:    'https://api.buildyounique.com/careers',
  hackathon:  'https://api.buildyounique.com/hackathon',
  training:   'https://api.buildyounique.com/training',
  newsletter: 'https://api.buildyounique.com/newsletter',
  chat:       'https://api.buildyounique.com/chat',
  brochure:   'https://api.buildyounique.com/brochure',
  coupon:     'https://api.buildyounique.com/coupon',
};

// --- Single API helper ----------------------------------------------
export async function apiCall(endpoint, payload) {
  console.log('[apiCall]', endpoint, payload);

  // --- MOCK MODE (current) -----------------------------------------
  await new Promise((r) => setTimeout(r, 900));
  return { ok: true, message: 'Mock success — wire the real backend in src/config.js.' };

  // --- REAL MODE — uncomment when ready ---------------------------
  /*
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
  */
}

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
// 20 days from now. For production, hardcode an ISO date so countdown
// stays consistent across all users:
//   export const DISCOUNT_END = new Date('2026-06-19T23:59:59+05:30');
const _now = Date.now();
export const DISCOUNT_END = new Date(_now + 20 * 24 * 60 * 60 * 1000);

// --- ASSETS — central image registry --------------------------------
// Swap any URL here once you have real photos.
// Every <img> uses these paths and has an onError fallback so a
// missing image never breaks the layout.
//
// While placeholders are in use, we point at high-quality Unsplash
// images that look like a real working studio.
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
