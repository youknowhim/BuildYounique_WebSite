import { ArrowRight, ArrowUpRight, Sparkles, Globe, Smartphone, Link, Cloud, Glasses, Workflow, Linkedin, MapPin } from 'lucide-react';
import { STATS, SERVICES, INDUSTRIES, PORTFOLIO, TEAM, TESTIMONIALS, PROCESS, COMPANY, TECH_TICKER, PARTNERS, COURSE_PRICING } from '../data.js';
import { useReveal, useCounter, useMouseParallax } from '../hooks.js';
import ClientsCarousel from '../components/ClientsCarousel.jsx';
import Countdown from '../components/Countdown.jsx';

const ICON_MAP = { Globe, Smartphone, Sparkles, Link, Cloud, Glasses, Workflow };

// Reveal-on-scroll wrapper
function Reveal({ children, delay = 0, as: As = 'div', ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <As ref={ref} className={`rise ${visible ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </As>
  );
}

// Stat counter
function StatBlock({ value, suffix, label }) {
  const [ref, visible] = useReveal();
  const n = useCounter(value, { duration: 1800, trigger: visible });
  return (
    <div ref={ref}>
      <div className="stat-value">{n}{suffix}</div>
      <p className="muted" style={{ fontSize: 14, marginTop: 12, fontFamily: 'var(--f-mono)', letterSpacing: '0.04em' }}>{label}</p>
    </div>
  );
}

export default function Home({ onNavigate, onOpenCourse }) {
  const parallax = useMouseParallax(18);
  const featureCourse = { id: 'fullstack', name: 'Full-Stack Engineering' };

  return (
    <>
      {/* ============ HERO ============ */}
      <section style={{ paddingTop: 'clamp(120px, 18vw, 200px)', paddingBottom: 'clamp(60px, 8vw, 100px)', position: 'relative', overflow: 'hidden' }}>
        <div
          className="hero-orb float-orb"
          style={{
            top: '-10%', left: '-5%', width: 520, height: 520,
            background: 'radial-gradient(circle, rgba(79,184,254,0.55), transparent 70%)',
            transform: `translate(${parallax.x}px, ${parallax.y}px)`,
          }}
        />
        <div
          className="hero-orb float-orb-2"
          style={{
            top: '15%', right: '-10%', width: 580, height: 580,
            background: 'radial-gradient(circle, rgba(168,85,247,0.45), transparent 70%)',
            transform: `translate(${-parallax.x}px, ${-parallax.y}px)`,
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <Reveal>
            <p className="eyebrow no-line" style={{ marginBottom: 24 }}>
              <span className="pulse-dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--c-success)' }} />
              {' '}{COMPANY.type} · Est. {COMPANY.estYear} · {COMPANY.city}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="display display-xl" style={{ maxWidth: '14ch' }}>
              We build <em>software</em><br />
              that ships.
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="lead" style={{ marginTop: 28, maxWidth: '56ch' }}>
              Buildyounique is a software development studio in Howrah. We work with founders, operators and enterprise teams on web, mobile, AI, blockchain, cloud, AR/VR and RPA — from first prototype to operating at scale.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate('contact')}>
                Start a project <ArrowRight size={16} />
              </button>
              <button className="btn btn-lg" onClick={() => onNavigate('portfolio')}>
                See selected work
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ TECH TICKER ============ */}
      <Reveal>
        <div style={{ borderBlock: '1px solid var(--c-border)', padding: '22px 0', background: 'rgba(255,255,255,0.01)' }}>
          <div className="marquee">
            <div className="marquee-track">
              {[...TECH_TICKER, ...TECH_TICKER].map((t, i) => (
                <span key={i} className="mono" style={{ color: 'var(--c-muted)', fontSize: 13, letterSpacing: '0.02em' }}>
                  ◆ {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ============ STATS ============ */}
      <section className="section-tight">
        <div className="container">
          <div style={{ display: 'grid', gap: 32, gridTemplateColumns: 'repeat(3, 1fr)' }} className="stats-grid">
            {STATS.map((s) => (
              <StatBlock key={s.label} {...s} />
            ))}
          </div>
        </div>
        <style>{`@media (max-width: 720px) { .stats-grid { grid-template-columns: 1fr !important; gap: 36px !important; } }`}</style>
      </section>

      {/* ============ TRUSTED BY (clients carousel) ============ */}
      <section className="section-tight">
        <div className="container">
          <Reveal>
            <p className="eyebrow" style={{ textAlign: 'center', marginBottom: 36 }}>Trusted by teams worldwide</p>
          </Reveal>
          <Reveal delay={100}>
            <ClientsCarousel />
          </Reveal>
        </div>
      </section>

      {/* ============ SERVICES PREVIEW ============ */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 60 }}>
            <Reveal>
              <div style={{ maxWidth: 720 }}>
                <p className="eyebrow no-line" style={{ marginBottom: 18 }}>Services</p>
                <h2 className="display display-lg">Seven practices.<br /><em>One studio.</em></h2>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <button className="btn" onClick={() => onNavigate('services')}>All services <ArrowRight size={15} /></button>
            </Reveal>
          </div>

          <div className="grid-3">
            {SERVICES.map((s, i) => {
              const Icon = ICON_MAP[s.icon] || Sparkles;
              return (
                <Reveal key={s.id} delay={i * 60}>
                  <div className="surface card-hover" style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div className="gradient-canvas" style={{ '--bg': s.grad, aspectRatio: '16 / 10', display: 'flex', alignItems: 'flex-end', padding: 18 }}>
                      <div className="gradient-icon-disk"><Icon size={22} /></div>
                    </div>
                    <h3 className="display display-sm" style={{ marginTop: 22, marginBottom: 10 }}>{s.title}</h3>
                    <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.6, marginBottom: 18, flex: 1 }}>{s.blurb}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {s.stack.slice(0, 4).map((t) => (
                        <span key={t} className="pill" style={{ fontSize: 11, padding: '4px 10px' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ HOW WE WORK ============ */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="eyebrow no-line" style={{ marginBottom: 18 }}>Process</p>
            <h2 className="display display-lg" style={{ marginBottom: 60 }}>How we <em>work</em>.</h2>
          </Reveal>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(5, 1fr)' }} className="process-grid">
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} delay={i * 80}>
                <div className="process-step" style={{ height: '100%' }}>
                  <span className="process-num">{p.n}</span>
                  <h4 className="display" style={{ fontSize: 19, marginTop: 16, marginBottom: 10 }}>{p.title}</h4>
                  <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.6 }}>{p.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 1024px) { .process-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 560px) { .process-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ============ TEAM TEASER ============ */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 60 }}>
            <Reveal>
              <div>
                <p className="eyebrow no-line" style={{ marginBottom: 18 }}>People</p>
                <h2 className="display display-lg">A team you can <em>actually meet</em>.</h2>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <button className="btn" onClick={() => onNavigate('about')}>Meet everyone <ArrowRight size={15} /></button>
            </Reveal>
          </div>

          <div className="grid-3">
            {TEAM.slice(0, 3).map((m, i) => (
              <Reveal key={m.name} delay={i * 80}>
                <div className="team-card">
                  <div className="team-photo">
                    <img src={m.img} alt={m.name} onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <h4 className="display display-sm" style={{ marginBottom: 4 }}>{m.name}</h4>
                    <p className="mono" style={{ fontSize: 12, color: 'var(--c-blue)', marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{m.role}</p>
                    <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.55 }}>{m.bio}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INDUSTRIES ============ */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 880 }}>
            <Reveal>
              <p className="eyebrow no-line" style={{ marginBottom: 18 }}>Industries</p>
              <h2 className="display display-lg" style={{ marginBottom: 28 }}>
                Thirty-three <em>verticals.</em> One shared standard.
              </h2>
              <p className="lead">From E-Commerce to FinTech, EdTech to Cybersecurity — we've shipped real products across the verticals that matter most to founders and enterprises.</p>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="chips-grid" style={{ marginTop: 50 }}>
              {INDUSTRIES.map((ind) => (
                <span key={ind} className="chip">{ind}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ SELECTED WORK ============ */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 60 }}>
            <Reveal>
              <div>
                <p className="eyebrow no-line" style={{ marginBottom: 18 }}>Selected work</p>
                <h2 className="display display-lg">Things we've <em>shipped</em>.</h2>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <button className="btn" onClick={() => onNavigate('portfolio')}>Full portfolio <ArrowRight size={15} /></button>
            </Reveal>
          </div>

          <div className="grid-2">
            {PORTFOLIO.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <article className="card-hover" style={{ background: 'transparent' }}>
                  <div className="img-frame ar-4-3">
                    <img src={p.img} alt={p.title} onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                  <div style={{ paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div>
                      <p className="mono" style={{ fontSize: 11.5, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
                        {p.category} · {p.year}
                      </p>
                      <h3 className="display display-sm">{p.title}</h3>
                      <p className="muted" style={{ fontSize: 13.5, marginTop: 6 }}>{p.stack}</p>
                    </div>
                    <ArrowUpRight size={22} className="muted" />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PARTNERS ============ */}
      <section className="section-tight">
        <div className="container">
          <Reveal>
            <p className="eyebrow" style={{ textAlign: 'center', marginBottom: 36 }}>Partners we build with</p>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ display: 'flex', gap: 22, justifyContent: 'center', flexWrap: 'wrap' }}>
              {PARTNERS.map((p) => (
                <div key={p.name} className="client-card" style={{ width: 220 }}>
                  {p.src ? (
                    <img src={p.src} alt={p.name} onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="client-card-fallback">
                      {p.name}
                      <small>{p.tag}</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ TESTIMONIAL ============ */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 920, margin: '0 auto', textAlign: 'center' }}>
              <p className="eyebrow no-line" style={{ marginBottom: 28, justifyContent: 'center', display: 'inline-flex' }}>What clients say</p>
              <blockquote className="display display-md" style={{ fontStyle: 'italic', fontWeight: 400, lineHeight: 1.2 }}>
                <em style={{ background: 'none', WebkitTextFillColor: 'var(--c-text)', color: 'var(--c-text)', fontStyle: 'italic' }}>"</em>
                {TESTIMONIALS[0].quote}
                <em style={{ background: 'none', WebkitTextFillColor: 'var(--c-text)', color: 'var(--c-text)', fontStyle: 'italic' }}>"</em>
              </blockquote>
              <p className="mono" style={{ marginTop: 32, color: 'var(--c-muted)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                — {TESTIMONIALS[0].author}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ TEASERS: Hackathons / Training / Careers ============ */}
      <section className="section">
        <div className="container">
          <div className="grid-3">
            {/* Hackathons */}
            <Reveal>
              <button onClick={() => onNavigate('hackathons')} className="surface-2 card-hover" style={{ padding: 28, textAlign: 'left', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="gradient-canvas" style={{ '--bg': 'linear-gradient(135deg, #4F8AFE, #06D6A0)', aspectRatio: '16 / 10', marginBottom: 22 }} />
                <p className="eyebrow no-line" style={{ marginBottom: 12 }}>Hackathons · 5 formats</p>
                <h3 className="display display-sm" style={{ marginBottom: 10 }}>Compete. Build. Ship.</h3>
                <p className="muted" style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 18, flex: 1 }}>
                  Businessathon, Codeathon, Gameathon, Cyberthon, AIthon — teams of 2, ₹1,000 entry, real prizes.
                </p>
                <span className="flex items-center gap-2 mono" style={{ color: 'var(--c-blue)', fontSize: 13, fontWeight: 600 }}>
                  Browse hackathons <ArrowRight size={14} />
                </span>
              </button>
            </Reveal>

            {/* Training */}
            <Reveal delay={80}>
              <button onClick={() => onNavigate('training')} className="surface-2 card-hover" style={{ padding: 28, textAlign: 'left', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="gradient-canvas" style={{ '--bg': 'linear-gradient(135deg, #A855F7, #EC4899)', aspectRatio: '16 / 10', marginBottom: 22, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 14, right: 14 }}>
                    <Countdown variant="pill" />
                  </div>
                </div>
                <p className="eyebrow no-line" style={{ marginBottom: 12 }}>Training · 6 cohorts</p>
                <h3 className="display display-sm" style={{ marginBottom: 10 }}>Cohorts that ship.</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
                  <span className="mono" style={{ textDecoration: 'line-through', color: 'var(--c-faint)', fontSize: 14 }}>
                    ₹{COURSE_PRICING.original.toLocaleString('en-IN')}
                  </span>
                  <span className="display" style={{ fontSize: 26, fontWeight: 600, background: 'var(--grad-signature)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ₹{COURSE_PRICING.discounted.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="muted" style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 18, flex: 1 }}>
                  Full-Stack, Mobile, AI, Blockchain, Cloud, Cyber Sec. Live cohorts. Project-graded. Limited offer.
                </p>
                <span className="flex items-center gap-2 mono" style={{ color: 'var(--c-pink)', fontSize: 13, fontWeight: 600 }}>
                  See cohorts <ArrowRight size={14} />
                </span>
              </button>
            </Reveal>

            {/* Careers */}
            <Reveal delay={160}>
              <button onClick={() => onNavigate('careers')} className="surface-2 card-hover" style={{ padding: 28, textAlign: 'left', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="gradient-canvas" style={{ '--bg': 'linear-gradient(135deg, #06D6A0, #4F8AFE)', aspectRatio: '16 / 10', marginBottom: 22 }} />
                <p className="eyebrow no-line" style={{ marginBottom: 12 }}>Careers · 11 open roles</p>
                <h3 className="display display-sm" style={{ marginBottom: 10 }}>Join the studio.</h3>
                <p className="muted" style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 18, flex: 1 }}>
                  Engineering, Design, AI, Mobile, Infra. All fully remote. Honest about salary bands.
                </p>
                <span className="flex items-center gap-2 mono" style={{ color: 'var(--c-success)', fontSize: 13, fontWeight: 600 }}>
                  See openings <ArrowRight size={14} />
                </span>
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="surface-2" style={{
              padding: 'clamp(40px, 6vw, 80px)',
              borderRadius: 'var(--r-xl)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(168,85,247,0.18), transparent 60%)', pointerEvents: 'none' }} />
              <p className="eyebrow no-line" style={{ marginBottom: 22, justifyContent: 'center', display: 'inline-flex' }}>Let's build</p>
              <h2 className="display display-lg" style={{ marginBottom: 24, position: 'relative' }}>
                Tell us what you're <em>building</em>.
              </h2>
              <p className="lead" style={{ margin: '0 auto 32px', position: 'relative' }}>
                Two-minute brief. Written response within a working day. No sales call until you ask for one.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
                <button className="btn btn-primary btn-lg" onClick={() => onNavigate('contact')}>
                  Start a brief <ArrowRight size={16} />
                </button>
                <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer noopener" className="btn btn-lg">
                  WhatsApp us
                </a>
              </div>
              <p className="mono faint" style={{ marginTop: 28, fontSize: 12.5, position: 'relative' }}>
                <MapPin size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                {COMPANY.address}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
