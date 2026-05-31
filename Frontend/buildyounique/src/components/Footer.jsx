import { useState } from 'react';
import { Linkedin, Instagram, Mail, Phone, MapPin, ArrowUpRight, Download } from 'lucide-react';
import { COMPANY, NAV } from '../data.js';
import { API_ENDPOINTS, apiCall } from '../config.js';
import { V, runValidation } from '../validators.js';

export default function Footer({ onNavigate, onOpenBrochure }) {
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    const errors = runValidation({ email }, { email: [V.required('Email required'), V.email()] });
    if (errors.email) { setErr(errors.email); return; }
    setBusy(true);
    await apiCall(API_ENDPOINTS.newsletter, { email });
    setBusy(false); setSent(true); setEmail('');
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'grid', gap: 48, gridTemplateColumns: 'minmax(280px, 1.6fr) repeat(3, minmax(160px, 1fr))' }} className="footer-grid">
          <div>
            <button className="logo mb-6" onClick={() => onNavigate('home')} style={{ marginBottom: 20 }}>
              <img src="/logos/brand.png" alt="" className="logo-img" onError={(e) => { e.target.style.display = 'none'; }} />
              <span>Buildyounique</span>
            </button>
            <p className="muted" style={{ maxWidth: 420, marginBottom: 24, lineHeight: 1.6 }}>
              {COMPANY.type} · Est. {COMPANY.estYear}. We build software products and platforms for ambitious teams across the world.
            </p>

            <form onSubmit={submit} className="surface" style={{ padding: 8, display: 'flex', gap: 6, maxWidth: 420 }}>
              <input
                type="email"
                placeholder="Get studio notes — your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '8px 12px',
                  color: 'var(--c-text)',
                  fontSize: 14,
                }}
              />
              <button className="btn btn-primary btn-sm" disabled={busy}>
                {busy ? <span className="spinner" /> : sent ? 'Sent ✓' : 'Subscribe'}
              </button>
            </form>
            {err && <p style={{ color: 'var(--c-danger)', fontFamily: 'var(--f-mono)', fontSize: 12, marginTop: 8 }}>{err}</p>}

            <button
              onClick={onOpenBrochure}
              className="flex items-center gap-2 muted"
              style={{ marginTop: 24, fontSize: 14, fontFamily: 'var(--f-mono)' }}
            >
              <Download size={14} /> Download company profile
            </button>
          </div>

          <div>
            <p className="eyebrow mb-4" style={{ marginBottom: 16 }}>Studio</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NAV.slice(1, 7).map((n) => (
                <li key={n.id}>
                  <button className="muted" onClick={() => onNavigate(n.id)} style={{ fontSize: 14 }}>{n.label}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4" style={{ marginBottom: 16 }}>Company</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NAV.slice(7).map((n) => (
                <li key={n.id}>
                  <button className="muted" onClick={() => onNavigate(n.id)} style={{ fontSize: 14 }}>{n.label}</button>
                </li>
              ))}
              <li><button onClick={onOpenBrochure} className="muted" style={{ fontSize: 14 }}>Brochure</button></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4" style={{ marginBottom: 16 }}>Contact</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li className="flex items-start gap-2 muted" style={{ fontSize: 14 }}>
                <MapPin size={15} style={{ marginTop: 3, flexShrink: 0 }} />
                <span>{COMPANY.address}</span>
              </li>
              <li><a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 muted" style={{ fontSize: 14 }}>
                <Mail size={15} /> {COMPANY.email}
              </a></li>
              <li><a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 muted" style={{ fontSize: 14 }}>
                <Phone size={15} /> {COMPANY.phone}
              </a></li>
            </ul>

            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <a href={COMPANY.socials.linkedin} target="_blank" rel="noreferrer noopener" className="flex items-center justify-center" style={{
                width: 40, height: 40, borderRadius: 12, background: 'var(--c-ink-1)', border: '1px solid var(--c-border)', color: 'var(--c-muted)'
              }} aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href={COMPANY.socials.instagram} target="_blank" rel="noreferrer noopener" className="flex items-center justify-center" style={{
                width: 40, height: 40, borderRadius: 12, background: 'var(--c-ink-1)', border: '1px solid var(--c-border)', color: 'var(--c-muted)'
              }} aria-label="Instagram">
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--c-border)', marginTop: 60, paddingTop: 28, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p className="faint" style={{ fontSize: 13, fontFamily: 'var(--f-mono)' }}>
            © {new Date().getFullYear()} Buildyounique. Made in Howrah.
          </p>
          <p className="faint" style={{ fontSize: 13, fontFamily: 'var(--f-mono)' }}>
            v1.0 · last updated {new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
