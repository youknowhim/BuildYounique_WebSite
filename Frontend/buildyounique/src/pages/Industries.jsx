import { Sparkles, ArrowRight } from 'lucide-react';
import { INDUSTRIES } from '../data.js';
import { useReveal } from '../hooks.js';
import PageShell from '../components/PageShell.jsx';

export default function Industries({ onNavigate }) {
  const [ref, visible] = useReveal();

  return (
    <>
      <PageShell
        chip="Industries"
        title="Thirty-three verticals.<br />One shared <em>standard</em>."
        lead="We've shipped real products across the categories below — from regulated FinTech to fast-moving D2C. The standard doesn't move."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div ref={ref} className={`rise ${visible ? 'is-visible' : ''}`}>
            <div className="chips-grid" style={{ gap: 12 }}>
              {INDUSTRIES.map((ind) => (
                <span key={ind} className="chip" style={{ padding: '12px 18px', fontSize: 14 }}>
                  <Sparkles size={13} className="chip-icon" /> {ind}
                </span>
              ))}
            </div>
          </div>

          <div className="surface-2" style={{ marginTop: 60, padding: 'clamp(28px, 4vw, 48px)', textAlign: 'center' }}>
            <h3 className="display display-md" style={{ marginBottom: 14 }}>Don't see your <em>vertical?</em></h3>
            <p className="lead" style={{ margin: '0 auto 24px' }}>
              We work in regulated and unregulated industries — including ones we haven't shipped in publicly. Send us a brief and we'll be honest about whether we're the right team.
            </p>
            <button className="btn btn-primary" onClick={() => onNavigate('contact')}>
              Start a brief <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
