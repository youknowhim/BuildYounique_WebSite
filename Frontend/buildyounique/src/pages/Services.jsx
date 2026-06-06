import { Globe, Smartphone, Sparkles, Link, Cloud, Glasses, Workflow, ArrowRight } from 'lucide-react';
import { SERVICES } from '../data.js';
import { useReveal } from '../hooks.js';
import PageShell from '../components/PageShell.jsx';

const ICON_MAP = { Globe, Smartphone, Sparkles, Link, Cloud, Glasses, Workflow };

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return <div ref={ref} className={`rise ${visible ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export default function Services({ onNavigate }) {
  return (
    <>
      <PageShell
        chip="Our services"
        title="Seven practices.<br /><em>One studio.</em>"
        lead="Web, mobile, AI, blockchain, cloud, AR/VR and RPA — each practice led by senior engineers with shipping experience at scale. Here's what we work on, the stack we use, and how engagements typically run."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {SERVICES.map((s, i) => {
              const Icon = ICON_MAP[s.icon] || Sparkles;
              const flip = i % 2 === 1;
              return (
                <Reveal key={s.id} delay={i * 40}>
                  <article className="surface svc-row" style={{
                    padding: 'clamp(28px, 4vw, 48px)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'clamp(28px, 4vw, 56px)',
                    alignItems: 'center',
                  }}>
                    <div style={{ order: flip ? 2 : 1 }}>
                      <div className="flex items-center gap-3 mb-4" style={{ marginBottom: 18 }}>
                        <div className="gradient-icon-disk" style={{ background: s.grad, border: 'none' }}><Icon size={22} /></div>
                        <p className="mono" style={{ fontSize: 11, color: 'var(--c-muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>0{i + 1} / 0{SERVICES.length}</p>
                      </div>
                      <h2 className="display display-md" style={{ marginBottom: 18 }}>{s.title}</h2>
                      <p className="lead" style={{ marginBottom: 24 }}>{s.blurb}</p>
                      <div>
                        <p className="eyebrow no-line" style={{ marginBottom: 12 }}>Stack</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {s.stack.map((t) => (
                            <span key={t} className="pill">{t}</span>
                          ))}
                        </div>
                      </div>
                      <button className="btn mt-6" onClick={() => onNavigate('contact')} style={{ marginTop: 28 }}>
                        Talk to the {s.title.split(' ')[0]} team <ArrowRight size={15} />
                      </button>
                    </div>
                    <div style={{ order: flip ? 1 : 2 }}>
                      <div className="gradient-canvas" style={{ '--bg': s.grad, aspectRatio: '4 / 3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={80} style={{ color: 'rgba(255,255,255,0.95)' }} />
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
        <style>{`@media (max-width: 880px) { .svc-row { grid-template-columns: 1fr !important; } .svc-row > div { order: unset !important; } }`}</style>
      </section>
    </>
  );
}
