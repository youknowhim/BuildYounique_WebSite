import { ArrowUpRight, Clock } from 'lucide-react';
import { INSIGHTS } from '../data.js';
import { useReveal } from '../hooks.js';
import PageShell from '../components/PageShell.jsx';

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return <div ref={ref} className={`rise ${visible ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export default function Blog() {
  return (
    <>
      <PageShell
        chip="Insights"
        title="Notes from the <em>studio</em>."
        lead="Engineering, design, AI, infra — short essays on the work we do. No SEO listicles, no AI summaries."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {INSIGHTS.map((post, i) => (
              <Reveal key={post.id} delay={i * 40}>
                <article style={{
                  padding: '28px 0',
                  borderTop: i === 0 ? '1px solid var(--c-border)' : 'none',
                  borderBottom: '1px solid var(--c-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 24,
                  cursor: 'pointer',
                  transition: 'transform 240ms var(--ease-out)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(6px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-3 mb-2" style={{ marginBottom: 10 }}>
                      <span className="pill" style={{ fontSize: 11 }}>{post.tag}</span>
                      <span className="mono faint" style={{ fontSize: 12 }}>{post.date}</span>
                      <span className="mono faint" style={{ fontSize: 12 }}>
                        <Clock size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                        {post.read}
                      </span>
                    </div>
                    <h3 className="display" style={{ fontSize: 'clamp(20px, 2.6vw, 28px)', lineHeight: 1.25 }}>{post.title}</h3>
                  </div>
                  <ArrowUpRight size={24} className="muted" style={{ flexShrink: 0 }} />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
