import { ArrowUpRight } from 'lucide-react';
import { PORTFOLIO } from '../data.js';
import { useReveal } from '../hooks.js';
import PageShell from '../components/PageShell.jsx';

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return <div ref={ref} className={`rise ${visible ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export default function Portfolio() {
  return (
    <>
      <PageShell
        chip="Selected work"
        title="Things we've <em>shipped</em>."
        lead="A few representative projects from the last 18 months — across e-commerce, fintech, mobile, AI products and design systems. Case studies available under NDA."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 32 }}>
            {PORTFOLIO.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <article className="card-hover" style={{ background: 'transparent' }}>
                  <div className="img-frame ar-4-3">
                    <img src={p.img} alt={p.title} onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                  <div style={{ paddingTop: 22, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                      <p className="mono" style={{ fontSize: 11.5, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
                        {p.category} · {p.year}
                      </p>
                      <h3 className="display display-sm" style={{ marginBottom: 8 }}>{p.title}</h3>
                      <p className="muted" style={{ fontSize: 14 }}>{p.stack}</p>
                    </div>
                    <ArrowUpRight size={24} className="muted" style={{ flexShrink: 0 }} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
