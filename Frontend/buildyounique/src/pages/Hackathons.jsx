import { Trophy, Clock, Users, ArrowRight, LogIn } from 'lucide-react';
import { HACKATHONS } from '../data.js';
import { FEE_PER_MEMBER, TEAM_SIZE } from '../config.js';
import { useReveal } from '../hooks.js';
import PageShell from '../components/PageShell.jsx';

const TEAM_FEE = FEE_PER_MEMBER * TEAM_SIZE;

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return <div ref={ref} className={`rise ${visible ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function HackathonCard({ h, i, onOpenHackathon }) {
  
  return (
    <Reveal delay={i * 60}>
      <article className="surface card-hover hk-row" style={{ overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1.5fr', minHeight: 240 }}>
        <div style={{ background: h.grad, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
          <div>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 14 }}>0{i + 1} · {h.mode}</p>
            <h3 className="display display-md" style={{ color: '#fff', marginBottom: 8 }}>{h.name}</h3>
            <p style={{ fontSize: 15, opacity: 0.92, fontStyle: 'italic' }}>{h.tagline}</p>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 13, fontFamily: 'var(--f-mono)', marginTop: 22 }}>
            <span className="flex items-center gap-1"><Clock size={13} /> {h.duration}</span>
            <span className="flex items-center gap-1"><Trophy size={13} /> {h.prize}</span>
          </div>
        </div>

        <div style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
          <p className="muted" style={{ lineHeight: 1.65, marginBottom: 20, flex: 1 }}>{h.description}</p>

          <div style={{ marginBottom: 22 }}>
            <p className="eyebrow no-line" style={{ marginBottom: 10 }}>Tracks</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {h.categories.map((c) => (
                <span key={c} className="pill" style={{ fontSize: 11.5, padding: '4px 11px' }}>{c}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, paddingTop: 20, borderTop: '1px solid var(--c-border)' }}>
            <p style={{ fontSize: 14, color: 'var(--c-muted)' }}>
              <Users size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Team of {TEAM_SIZE} · <strong style={{ color: 'var(--c-text)' }}>₹{TEAM_FEE.toLocaleString('en-IN')}</strong> (₹{FEE_PER_MEMBER.toLocaleString('en-IN')}/member)
            </p>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => {
                if (h.id === 'businessathon' || h.id === 'codeathon') {
                  onOpenHackathon(h);
                } else {
                  alert('Coming soon');
                }
              }}
            >
              Register team <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Hackathons({ onOpenHackathon, onTeamLogin }) {
  return (
    <>
      <PageShell
        chip="Hackathons"
        title="Compete. Build. <em>Ship.</em>"
        lead={`Five hackathon formats run throughout the year — Businessathon, Codeathon, Gameathon, Cyberthon, AIthon. Teams of ${TEAM_SIZE}, ₹${FEE_PER_MEMBER.toLocaleString('en-IN')} / member (₹${TEAM_FEE.toLocaleString('en-IN')} per team), real prizes.`}
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
            <button className="btn btn-ghost btn-sm" onClick={onTeamLogin}>
              <LogIn size={15} /> Already registered? Log in
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {HACKATHONS.map((h, i) => (
              <HackathonCard key={h.id} h={h} i={i} onOpenHackathon={onOpenHackathon} />
            ))}
          </div>
        </div>
        <style>{`@media (max-width: 760px) { .hk-row { grid-template-columns: 1fr !important; } }`}</style>
      </section>
    </>
  );
}
