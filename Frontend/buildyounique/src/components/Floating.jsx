import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Sparkles, Mail } from 'lucide-react';
import { COMPANY } from '../data.js';
import { API_ENDPOINTS, apiCall } from '../config.js';
import { V, runValidation } from '../validators.js';

// WhatsApp icon (simple inline SVG so we don't need an extra dep)
function WhatsAppIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

// --- WhatsApp FAB ---------------------------------------------------
export function WhatsAppFAB() {
  return (
    <a
      href={COMPANY.whatsapp}
      target="_blank"
      rel="noreferrer noopener"
      className="fab fab-wa"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon size={26} />
    </a>
  );
}

// --- Chatbot widget -------------------------------------------------
const STARTER_MSG = "Hi! I'm Buildyounique's assistant — I can help with our services, training (₹3,000 limited offer), hackathons, careers and contact. What are you working on?";

const RULES = [
  { match: ['service', 'develop', 'build', 'web', 'mobile', 'ai', 'blockchain', 'cloud', 'rpa'],
    reply: "We work across web, mobile, AI, blockchain, cloud, AR/VR and RPA. Tell me which one you need and I can be specific — or head to /services for the full breakdown." },
  { match: ['train', 'course', 'cohort', 'learn'],
    reply: "We run 6 live cohorts — Full-Stack, Mobile, AI, Blockchain, Cloud, Cyber Security. All ₹5,000 → ₹3,000 right now (limited window). Head to /training to enrol." },
  { match: ['price', 'cost', 'how much', 'fee', 'budget'],
    reply: "Project pricing depends on scope — typical engagements run ₹3L–₹40L for a first launch. Training is ₹3,000 per course (down from ₹5,000) for the next few weeks. Send a brief at /contact and we'll come back with a number." },
  { match: ['hackathon', 'hack', 'competition'],
    reply: "We run 5 hackathon formats — Businessathon, Codeathon, Gameathon, Cyberthon, AIthon. Teams of 2, ₹1,000 entry. Coupons available. Head to /hackathons." },
  { match: ['career', 'job', 'hire', 'work', 'apply', 'opening'],
    reply: "11 openings right now, all fully remote — head to /careers, pick a role, attach your resume." },
  { match: ['contact', 'reach', 'call', 'email', 'phone', 'whatsapp'],
    reply: `Easiest is email ${COMPANY.email}, or WhatsApp ${COMPANY.phone}. We reply within a working day.` },
  { match: ['where', 'location', 'office', 'address'],
    reply: `Studio is in Howrah, West Bengal — ${COMPANY.address}. Team is hybrid across India.` },
];

function ruleFallback(text) {
  const lower = text.toLowerCase();
  for (const r of RULES) if (r.match.some((k) => lower.includes(k))) return r.reply;
  return "I can help with services, training, hackathons, careers or contact. What would you like to know? (Or just email " + COMPANY.email + ")";
}

export function Chatbot({ open, onClose }) {
  const [msgs, setMsgs] = useState([{ from: 'bot', text: STARTER_MSG }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setMsgs((m) => [...m, { from: 'user', text }]);
    setInput('');
    setBusy(true);

    // Try backend first
    let reply;
    try {
      const res = await apiCall(API_ENDPOINTS.chat, { message: text });
      reply = res?.reply || null;
    } catch { reply = null; }
    if (!reply) reply = ruleFallback(text);

    setMsgs((m) => [...m, { from: 'bot', text: reply }]);
    setBusy(false);
  }

  if (!open) return null;

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={20} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 15 }}>Buildyounique Assistant</p>
              <p style={{ fontSize: 11.5, opacity: 0.85, fontFamily: 'var(--f-mono)' }}>Typically replies instantly</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close chat" style={{ color: '#fff' }}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="chatbot-msgs" ref={scrollRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`chat-msg ${m.from}`}>{m.text}</div>
        ))}
        {busy && <div className="chat-msg bot"><span className="spinner" style={{ display: 'inline-block', verticalAlign: 'middle' }} /></div>}
      </div>

      <div className="chatbot-input">
        <input
          placeholder="Ask anything…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button onClick={send} aria-label="Send"><Send size={16} /></button>
      </div>
    </div>
  );
}

export function ChatbotFAB({ onClick }) {
  return (
    <button className="fab fab-chat" onClick={onClick} aria-label="Open chat assistant">
      <MessageCircle size={24} />
    </button>
  );
}

// --- Lead capture popup ---------------------------------------------
// Shows after 5.5s, auto-hides once user scrolls past the hero so it
// stops overlapping content further down the page.
export function LeadCapture({ onNavigate }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { if (!dismissed) setShow(true); }, 5500);
    return () => clearTimeout(t);
  }, [dismissed]);

  useEffect(() => {
    if (!show) return;
    const onScroll = () => {
      // Auto-hide once we've scrolled meaningfully past the hero
      if (window.scrollY > window.innerHeight * 0.9) setShow(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [show]);

  if (!show || dismissed) return null;

  return (
    <div className="lead-popup">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: 'var(--c-warning)' }} />
          <p className="eyebrow no-line" style={{ color: 'var(--c-text)' }}>Tell us what you're building</p>
        </div>
        <button onClick={() => setDismissed(true)} aria-label="Close" className="muted"><X size={16} /></button>
      </div>
      <p className="muted" style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 14 }}>
        2 minutes, no sales call. Get a written response within a working day.
      </p>
      <button
        className="btn btn-primary btn-sm w-full"
        onClick={() => { setDismissed(true); onNavigate('contact'); }}
      >
        Start a brief
      </button>
    </div>
  );
}

// --- Cookie consent banner ------------------------------------------
export function CookieBanner() {
  const [shown, setShown] = useState(true);
  if (!shown) return null;
  return (
    <div className="cookie-banner">
      <span style={{ fontSize: 13.5 }} className="muted">
        We use minimal cookies to improve this site — never to track you.
      </span>
      <div className="flex gap-2 items-center">
        <button className="btn btn-ghost btn-sm" onClick={() => setShown(false)}>Decline</button>
        <button className="btn btn-primary btn-sm" onClick={() => setShown(false)}>Accept</button>
        <button onClick={() => setShown(false)} aria-label="Close" className="muted" style={{ padding: 6, display: 'flex' }}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
