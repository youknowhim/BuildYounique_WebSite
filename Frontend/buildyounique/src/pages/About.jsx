import { useState } from 'react';
import { Plus, Linkedin, MapPin } from 'lucide-react';
import { TEAM, FAQ, COMPANY, STATS } from '../data.js';
import { useReveal } from '../hooks.js';
import PageShell from '../components/PageShell.jsx';

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return <div ref={ref} className={`rise ${visible ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export default function About() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <PageShell
        chip="About the studio"
        title="A studio built for the <em>long game</em>."
        lead={`Buildyounique was founded in ${COMPANY.estYear} in Howrah, West Bengal. We started as two engineers and a designer doing freelance work for founders. Six years later, we operate as a studio — running engagements for founders, operators and enterprise teams across India, the Gulf, the UK and Australia.`}
      />

      {/* Studio story */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px, 5vw, 60px)' }} className="ab-story">
            <Reveal>
              <div className="surface-2" style={{ padding: 'clamp(28px, 4vw, 40px)' }}>
                <p className="eyebrow no-line" style={{ marginBottom: 16 }}>Where we are</p>
                <h3 className="display display-md" style={{ marginBottom: 18 }}>Howrah, West Bengal.</h3>
                <p className="lead" style={{ marginBottom: 22 }}>
                  Studio is at <strong style={{ color: 'var(--c-text)' }}>{COMPANY.address}</strong>. Team is hybrid — engineers across India, with leads here and in Bengaluru.
                </p>
                <p className="muted" style={{ fontSize: 14, fontFamily: 'var(--f-mono)' }}>
                  <MapPin size={12} style={{ verticalAlign: 'middle' }} /> India · serving clients globally
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28, justifyContent: 'center' }}>
                {STATS.map((s) => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 18, borderBottom: '1px solid var(--c-border)' }}>
                    <p className="muted" style={{ fontSize: 15 }}>{s.label}</p>
                    <p className="display" style={{ fontSize: 36, fontWeight: 600, background: 'var(--grad-signature)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {s.value}{s.suffix}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
        <style>{`@media (max-width: 880px) { .ab-story { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Full team */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="eyebrow no-line" style={{ marginBottom: 18 }}>The team</p>
            <h2 className="display display-lg" style={{ marginBottom: 60 }}>People who'll <em>do the work</em>.</h2>
          </Reveal>

          <div className="grid-auto" style={{ gap: 32 }}>
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 70}>
                <div className="team-card">
                  <div className="team-photo">
                    <img src={m.img} alt={m.name} onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                  <div style={{ marginTop: 18 }}>
                    <h4 className="display display-sm" style={{ marginBottom: 4 }}>{m.name}</h4>
                    <p className="mono" style={{ fontSize: 11.5, color: 'var(--c-blue)', marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{m.role}</p>
                    <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.55, marginBottom: 12 }}>{m.bio}</p>
                    <a href={m.linkedin} target="_blank" rel="noreferrer noopener" className="flex items-center gap-1 muted" style={{ fontSize: 12, fontFamily: 'var(--f-mono)' }}>
                      <Linkedin size={12} /> LinkedIn
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'clamp(28px, 5vw, 80px)' }} className="ab-faq">
            <Reveal>
              <div>
                <p className="eyebrow no-line" style={{ marginBottom: 18 }}>FAQ</p>
                <h2 className="display display-lg">Questions, <em>answered</em>.</h2>
                <p className="muted" style={{ marginTop: 22, fontSize: 14 }}>Anything else? Email {COMPANY.email}.</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div>
                {FAQ.map((f, i) => (
                  <div
                    key={i}
                    className={`faq-item ${openFaq === i ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  >
                    <div className="faq-question">
                      <span>{f.q}</span>
                      <span className="faq-toggle"><Plus size={16} /></span>
                    </div>
                    <div className="faq-answer">{f.a}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
        <style>{`@media (max-width: 880px) { .ab-faq { grid-template-columns: 1fr !important; } }`}</style>
      </section>
    </>
  );
}
