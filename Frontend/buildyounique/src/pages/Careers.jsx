
import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Briefcase, Clock, ArrowRight, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';
import { HACKATHON_API, apiRequest, API_ENDPOINTS } from '../config.js';

const API_V1_CAREERS = HACKATHON_API.colleges.replace('/colleges', '/career-applications');
import { V, runValidation } from '../validators.js';
import PageShell from '../components/PageShell.jsx';
import Modal from '../components/Modal.jsx';

export default function Careers() {
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState({ name: '', email: '', phone: '', expectedCTC: '', experience: '', portfolio: '', coverNote: '', resumeUrl: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    apiRequest(API_ENDPOINTS.jobDescriptions).then((res) => {
      if (res.ok && res.data?.job_descriptions) {
        const mapped = res.data.job_descriptions
          .filter(j => j.status === 'Active')
          .map(j => ({
            id: j.id,
            title: j.job_title,
            type: j.employment_type,
            experience: j.experience_required ? `${j.experience_required}+ yrs` : 'Any',
            location: j.location || 'Remote',
            team: j.employment_type === 'Internship' ? 'Early Talent' : 'Engineering'
          }));
        setJobs(mapped);
      }
      setLoading(false);
    });
  }, []);

  const filteredJobs = useMemo(() => {
    if (!query.trim()) return jobs;
    const q = query.toLowerCase();
    return jobs.filter((j) =>
      j.title.toLowerCase().includes(q) ||
      j.team.toLowerCase().includes(q) ||
      j.type.toLowerCase().includes(q)
    );
  }, [query, jobs]);

  function update(k, v) { setData((d) => ({ ...d, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); }
  function reset() {
    setData({ name: '', email: '', phone: '', expectedCTC: '', experience: '', portfolio: '', coverNote: '', resumeUrl: '' });
    setErrors({}); setDone(false);
  }
  function closeModal() {
    setSelected(null);
    setTimeout(reset, 240);
  }

  async function submit(e) {
    e.preventDefault();
    const errs = runValidation(data, {
      name:        [V.required('Name required'), V.minLen(2)],
      email:       [V.required('Email required'), V.email()],
      phone:       [V.required('Phone required'), V.phone()],
      expectedCTC: [V.required('Expected CTC required')],
      experience:  [V.required('Experience is required'), (val) => val && isNaN(Number(String(val).replace(',', '.'))) ? 'Enter a valid number (e.g. 2, 3.5)' : null],
      portfolio:   [V.url('Enter a valid URL (or leave blank)')],
      coverNote:   [V.minLen(30, 'At least 30 characters')],
      resumeUrl:   [V.required('Please provide your resume URL'), V.url('Enter a valid URL')],
    });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setBusy(true);
    await apiRequest(API_V1_CAREERS, {
      method: 'POST',
      body: {
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        applying_role: selected.title,
        years_of_experience: Number(String(data.experience).replace(',', '.')),
        skills: JSON.stringify([selected.team]),
        resume_url: data.resumeUrl,
        resume_file_name: null,
        resume_file_size: null,
        portfolio_url: data.portfolio || null,
        expected_ctc: data.expectedCTC,
        cover_letter: data.coverNote,
      },
    });
    setBusy(false); setDone(true);
  }

  return (
    <>
      <PageShell
        chip={`Careers`}
        title="Join the <em>studio</em>."
        lead="All roles fully remote. Honest salary bands published. Real engineering work — not staffing-agency boilerplate."
      >
        <div className="surface" style={{ padding: 8, display: 'flex', alignItems: 'center', gap: 12, maxWidth: 540 }}>
          <Search size={18} className="muted" style={{ marginLeft: 12 }} />
          <input
            placeholder="Search roles, teams or types…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '10px 0', color: 'var(--c-text)', fontSize: 14.5 }}
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear" className="muted" style={{ padding: 4 }}>
              <X size={16} />
            </button>
          )}
        </div>
      </PageShell>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <span className="spinner" style={{ width: 24, height: 24 }} />
            </div>
          ) : (
            <>
              <p className="eyebrow no-line" style={{ marginBottom: 22 }}>
                {filteredJobs.length} role{filteredJobs.length !== 1 ? 's' : ''} {query && `matching "${query}"`}
              </p>
              <div className="grid-2" style={{ gap: 14 }}>
                {filteredJobs.map((j) => (
              <div
                key={j.id}
                className="job-card"
                onClick={() => setSelected(j)}
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="display" style={{ fontSize: 19, lineHeight: 1.3 }}>{j.title}</h4>
                  <ArrowRight size={18} className="muted" />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12, color: 'var(--c-muted)', fontFamily: 'var(--f-mono)' }}>
                  <span className="flex items-center gap-1"><Briefcase size={11} /> {j.team}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {j.type}</span>
                  <span>·</span>
                  <span>{j.experience}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {j.location}</span>
                </div>
                
              </div>
            ))}
            </div>
              {filteredJobs.length === 0 && !query && (
                <p className="muted" style={{ padding: 24, fontStyle: 'italic', textAlign: 'center' }}>
                  No job postings now. Check back later!
                </p>
              )}
              {filteredJobs.length === 0 && query && (
                <p className="muted" style={{ padding: 24, fontStyle: 'italic', textAlign: 'center' }}>
                  No roles match "{query}". Try a broader search, or just send us your CV anyway.
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* Application modal */}
      <Modal open={!!selected} onClose={closeModal} wide>
        {!done ? (
          <div>
            <div style={{
              padding: '36px 32px 28px',
              background: 'linear-gradient(135deg, #4FB8FE 0%, #06D6A0 100%)',
              color: '#fff',
              borderTopLeftRadius: 'var(--r-xl)',
              borderTopRightRadius: 'var(--r-xl)',
            }}>
              <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>Apply for</p>
              <h2 className="display display-md" style={{ color: '#fff', marginBottom: 10 }}>{selected?.title}</h2>
              <p className="mono" style={{ fontSize: 13, opacity: 0.92 }}>
                {selected?.team} · {selected?.type} · {selected?.experience} · Remote
              </p>
            </div>

            <form onSubmit={submit} style={{ padding: '28px 32px 32px', display: 'grid', gap: 14, gridTemplateColumns: '1fr 1fr' }} className="cr-form">
              <div className={`field ${errors.name ? 'field-error' : ''}`}>
                <label className="field-label">Full name *</label>
                <input className="field-input" value={data.name} onChange={(e) => update('name', e.target.value)} />
                {errors.name && <p className="field-error-msg"><AlertCircle size={12} /> {errors.name}</p>}
              </div>
              <div className={`field ${errors.email ? 'field-error' : ''}`}>
                <label className="field-label">Email *</label>
                <input className="field-input" type="email" value={data.email} onChange={(e) => update('email', e.target.value)} />
                {errors.email && <p className="field-error-msg"><AlertCircle size={12} /> {errors.email}</p>}
              </div>
              <div className={`field ${errors.phone ? 'field-error' : ''}`}>
                <label className="field-label">Phone *</label>
                <input className="field-input" value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 …" />
                {errors.phone && <p className="field-error-msg"><AlertCircle size={12} /> {errors.phone}</p>}
              </div>
              <div className={`field ${errors.expectedCTC ? 'field-error' : ''}`}>
                <label className="field-label">Expected CTC Per Month *</label>
                <input className="field-input" value={data.expectedCTC} onChange={(e) => update('expectedCTC', e.target.value)} placeholder="e.g. ₹50000" />
                {errors.expectedCTC && <p className="field-error-msg"><AlertCircle size={12} /> {errors.expectedCTC}</p>}
              </div>
              <div className={`field ${errors.experience ? 'field-error' : ''}`} style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">Years of experience *</label>
                <input className="field-input" value={data.experience} onChange={(e) => update('experience', e.target.value)} placeholder="e.g. 2, 3.5, 4" />
                {errors.experience && <p className="field-error-msg"><AlertCircle size={12} /> {errors.experience}</p>}
              </div>
              <div className={`field ${errors.portfolio ? 'field-error' : ''}`} style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">Portfolio / GitHub URL</label>
                <input className="field-input" value={data.portfolio} onChange={(e) => update('portfolio', e.target.value)} placeholder="https://… (optional)" />
                {errors.portfolio && <p className="field-error-msg"><AlertCircle size={12} /> {errors.portfolio}</p>}
              </div>
              <div className={`field ${errors.coverNote ? 'field-error' : ''}`} style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">Cover note (optional)</label>
                <textarea className="field-textarea" value={data.coverNote} onChange={(e) => update('coverNote', e.target.value)} placeholder="A few honest sentences about why this role." rows={4} />
                {errors.coverNote && <p className="field-error-msg"><AlertCircle size={12} /> {errors.coverNote}</p>}
              </div>
              <div className={`field ${errors.resumeUrl ? 'field-error' : ''}`} style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">Resume URL * <span style={{ color: 'var(--c-faint)' }}>Drive / Dropbox / Notion</span></label>
                <input className="field-input" value={data.resumeUrl} onChange={(e) => update('resumeUrl', e.target.value)} placeholder="https://…" />
                {errors.resumeUrl && <p className="field-error-msg"><AlertCircle size={12} /> {errors.resumeUrl}</p>}
              </div>
              <button className="btn btn-primary btn-lg" disabled={busy} style={{ gridColumn: '1 / -1', marginTop: 6 }}>
                {busy ? <span className="spinner" /> : 'Submit application'}
              </button>

              <style>{`@media (max-width: 640px) { .cr-form { grid-template-columns: 1fr !important; } }`}</style>
            </form>
          </div>
        ) : (
          <div className="success-panel">
            <div className="success-panel-icon"><CheckCircle2 size={32} /></div>
            <h3 className="display display-sm" style={{ marginBottom: 12 }}>Application received ✓</h3>
            <p className="muted" style={{ maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
              Thank you. We've received your application for <strong style={{ color: 'var(--c-text)' }}>{selected?.title}</strong>. A confirmation has been sent to <strong style={{ color: 'var(--c-text)' }}>{data.email}</strong> — the hiring team will respond within 5 working days.
            </p>
            <button className="btn mt-6" style={{ marginTop: 28 }} onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </>
  );
}
