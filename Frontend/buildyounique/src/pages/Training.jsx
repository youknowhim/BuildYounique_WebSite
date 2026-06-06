import { Tag, Clock, Award, ArrowRight } from 'lucide-react';
import { COURSES, COURSE_PRICING } from '../data.js';
import { useReveal } from '../hooks.js';
import PageShell from '../components/PageShell.jsx';
import Countdown from '../components/Countdown.jsx';
import DiscountRibbon from '../components/DiscountRibbon.jsx';

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return <div ref={ref} className={`rise ${visible ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export default function Training({ onOpenCourse }) {
  return (
    <>
      {/* <DiscountRibbon /> */}

      <PageShell
        chip="Training · live cohorts"
        title="Cohorts that <em>actually ship</em>."
        lead="Live online programmes led by working engineers. You build, you ship, you get a project graded by senior reviewers — and you walk away with portfolio work, not a certificate of attendance."
      >
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <span className="mono" style={{ textDecoration: 'line-through', textDecorationThickness: 2, color: 'var(--c-faint)', fontSize: 22 }}>
                ₹{COURSE_PRICING.original.toLocaleString('en-IN')}
              </span>
              <span className="display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 600, background: 'var(--grad-signature)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
                ₹{COURSE_PRICING.discounted.toLocaleString('en-IN')}
              </span>
              <span className="pill pill-success">
                <Tag size={12} /> Save ₹{COURSE_PRICING.savings.toLocaleString('en-IN')}
              </span>
            </div>
            <Countdown />
          </div>
        </Reveal>
      </PageShell>

      {/* Courses grid */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid-3">
            {COURSES.map((c, i) => (
              <Reveal key={c.id} delay={i * 60}>
                <article className="surface card-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="img-frame" style={{ aspectRatio: '16 / 10', borderRadius: 0 }}>
                    <img src={c.cover} alt={c.name} onError={(e) => { e.target.style.display = 'none'; }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(180deg, transparent 40%, rgba(7,8,15,0.85) 100%), ${c.grad}`,
                      mixBlendMode: 'multiply',
                      opacity: 0.65,
                    }} />
                    <div style={{ position: 'absolute', top: 14, right: 14 }}>
                      <Countdown variant="pill" />
                    </div>
                    <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
                      <p className="mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        {c.weeks} weeks · {c.mode}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 className="display display-sm" style={{ marginBottom: 8 }}>{c.name}</h3>

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
                      <span className="mono" style={{ textDecoration: 'line-through', color: 'var(--c-faint)', fontSize: 14 }}>
                        ₹{COURSE_PRICING.original.toLocaleString('en-IN')}
                      </span>
                      <span className="display" style={{ fontSize: 26, fontWeight: 600, background: 'var(--grad-signature)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ₹{COURSE_PRICING.discounted.toLocaleString('en-IN')}
                      </span>
                      <span className="pill pill-success" style={{ fontSize: 10.5 }}>
                        − ₹{COURSE_PRICING.savings.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                      <p style={{ fontSize: 13.5, color: 'var(--c-muted)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <Award size={13} style={{ marginTop: 3, color: 'var(--c-success)', flexShrink: 0 }} />
                        <span>{c.outcome}</span>
                      </p>
                      <p style={{ fontSize: 13.5, color: 'var(--c-muted)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <Clock size={13} style={{ marginTop: 3, color: 'var(--c-warning)', flexShrink: 0 }} />
                        <span>{c.batch}</span>
                      </p>
                    </div>

                    <button className="btn btn-primary" onClick={() => onOpenCourse(c)} style={{ width: '100%' }}>
                      Enrol now <ArrowRight size={15} />
                    </button>
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
