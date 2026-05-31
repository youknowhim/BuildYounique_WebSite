import { ShieldCheck, Zap, Globe2, Users, Cpu, Trophy, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { COMPANY, STATS } from '../data.js';
import { useReveal } from '../hooks.js';
import PageShell from '../components/PageShell.jsx';

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return <div ref={ref} className={`rise ${visible ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const REASONS = [
  {
    icon: Zap,
    title: 'Senior-only delivery',
    blurb: 'Every engagement is led by engineers with 5+ years of shipping production software. We don\'t bench-warm juniors on client work.',
    grad: 'linear-gradient(135deg, #4FB8FE, #06D6A0)',
  },
  {
    icon: ShieldCheck,
    title: 'Honest delivery promise',
    blurb: 'A working build every single week. No status decks instead of demos. No "almost-done" excuses. Watch it, click it, ship it.',
    grad: 'linear-gradient(135deg, #A855F7, #EC4899)',
  },
  {
    icon: Cpu,
    title: 'Seven practices, one studio',
    blurb: 'Web, mobile, AI, blockchain, cloud, AR/VR, RPA — all under one roof. No vendor juggling, no integration hell, no diluted accountability.',
    grad: 'linear-gradient(135deg, #06D6A0, #4FB8FE)',
  },
  {
    icon: Globe2,
    title: 'India-priced, world-standard',
    blurb: 'We build for clients across India, the Gulf, the UK and Australia. Studio rates that respect Indian economics; output that matches London agencies.',
    grad: 'linear-gradient(135deg, #FFB547, #EC4899)',
  },
  {
    icon: Users,
    title: 'A team you can meet',
    blurb: 'Real engineers with real names. Same people on day one and day three hundred. No "delivery manager" wall between you and the build team.',
    grad: 'linear-gradient(135deg, #4FB8FE, #A855F7)',
  },
  {
    icon: Trophy,
    title: 'Built for the long game',
    blurb: 'We stay on after launch — SRE, optimisation, feature evolution. The studio was founded in 2020 and still operates products from year one.',
    grad: 'linear-gradient(135deg, #EC4899, #FFB547)',
  },
];

const OFFICES = [
  { city: 'Howrah, West Bengal', country: 'India', kind: 'Studio · HQ',  address: COMPANY.address, phone: COMPANY.phone },
  { city: 'Bengaluru, Karnataka', country: 'India', kind: 'Engineering hub', address: 'Remote leads · WeWork on demand', phone: '' },
  { city: 'Distributed', country: 'India · Gulf · UK', kind: 'Team', address: 'Engineers across 8 cities globally', phone: '' },
];

export default function WhyUs({ onNavigate }) {
  return (
    <>
      <PageShell
        chip="Why Buildyounique"
        title="<em>Innovation</em> beyond boundaries."
        lead={`Founded in ${COMPANY.estYear} in Howrah, we operate as a studio across India and beyond — powering founders, operators and enterprise teams worldwide with scalable, future-ready software. Wherever you are, we're here to help.`}
      >
        <Reveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 8 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ flex: '1 1 200px', minWidth: 200 }}>
                <p className="display" style={{
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  fontWeight: 600,
                  lineHeight: 1.05,
                  background: 'var(--grad-signature)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>{s.value}{s.suffix}</p>
                <p className="muted" style={{ fontSize: 13, fontFamily: 'var(--f-mono)', marginTop: 8, letterSpacing: '0.04em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </PageShell>

      {/* Reasons */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow no-line" style={{ marginBottom: 18 }}>Reasons people pick us</p>
            <h2 className="display display-lg" style={{ marginBottom: 56 }}>Six honest <em>differentiators</em>.</h2>
          </Reveal>

          <div className="grid-3" style={{ gap: 22 }}>
            {REASONS.map((r, i) => (
              <Reveal key={r.title} delay={i * 60}>
                <div className="surface card-hover" style={{ padding: 28, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: r.grad,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', marginBottom: 20,
                  }}>
                    <r.icon size={22} />
                  </div>
                  <h3 className="display display-sm" style={{ marginBottom: 12 }}>{r.title}</h3>
                  <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.6 }}>{r.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Offices / presence */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="eyebrow no-line" style={{ marginBottom: 18 }}>Our presence</p>
            <h2 className="display display-lg" style={{ marginBottom: 18 }}>One studio. <em>Many locations.</em></h2>
            <p className="lead" style={{ marginBottom: 48 }}>
              Headquartered in Howrah, with engineers distributed across India and beyond. We work in your timezone, not just ours.
            </p>
          </Reveal>

          <div className="grid-3" style={{ gap: 22 }}>
            {OFFICES.map((o, i) => (
              <Reveal key={o.city} delay={i * 70}>
                <div className="surface-2" style={{ padding: 28, height: '100%' }}>
                  <p className="mono" style={{ fontSize: 11, color: 'var(--c-blue)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>
                    {o.kind}
                  </p>
                  <h3 className="display display-sm" style={{ marginBottom: 6 }}>{o.city}</h3>
                  <p className="muted" style={{ fontSize: 13, fontFamily: 'var(--f-mono)', marginBottom: 18 }}>{o.country}</p>
                  <p className="muted" style={{ fontSize: 14, lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <MapPin size={14} style={{ marginTop: 3, flexShrink: 0, color: 'var(--c-faint)' }} />
                    <span>{o.address}</span>
                  </p>
                  {o.phone && (
                    <a href={`tel:${o.phone.replace(/\s/g, '')}`} className="mono" style={{ display: 'block', fontSize: 13, color: 'var(--c-muted)', marginTop: 12 }}>
                      {o.phone}
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="surface-2" style={{
              padding: 'clamp(36px, 6vw, 72px)',
              borderRadius: 'var(--r-xl)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(168,85,247,0.2), transparent 60%)', pointerEvents: 'none' }} />
              <p className="eyebrow no-line" style={{ marginBottom: 22, justifyContent: 'center', display: 'inline-flex' }}>
                <Sparkles size={12} /> Ready when you are
              </p>
              <h2 className="display display-lg" style={{ marginBottom: 18, position: 'relative' }}>
                Wherever you are, <em>we're here to help</em>.
              </h2>
              <p className="lead" style={{ margin: '0 auto 32px', position: 'relative' }}>
                A two-minute brief, a written reply within a working day. That's how every engagement starts.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
                <button className="btn btn-primary btn-lg" onClick={() => onNavigate('contact')}>
                  Start a brief <ArrowRight size={16} />
                </button>
                <button className="btn btn-lg" onClick={() => onNavigate('portfolio')}>See our work</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
