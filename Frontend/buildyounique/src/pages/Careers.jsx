
import { useState, useMemo } from 'react';
import { Search, MapPin, Briefcase, Clock, ArrowRight, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';
import { JOBS } from '../data.js';
import { API_ENDPOINTS, apiCall } from '../config.js';
import { V, runValidation } from '../validators.js';
import PageShell from '../components/PageShell.jsx';
import Modal from '../components/Modal.jsx';

export default function Careers() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState({ name: '', email: '', phone: '', expectedCTC: '', experience: '', portfolio: '', coverNote: '', resume: null });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const filteredJobs = useMemo(() => {
    if (!query.trim()) return JOBS;
    const q = query.toLowerCase();
    return JOBS.filter((j) =>
      j.title.toLowerCase().includes(q) ||
      j.team.toLowerCase().includes(q) ||
      j.type.toLowerCase().includes(q)
    );
  }, [query]);

  function update(k, v) { setData((d) => ({ ...d, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); }
  function reset() {
    setData({ name: '', email: '', phone: '', expectedCTC: '', experience: '', portfolio: '', coverNote: '', resume: null });
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
      experience:  [V.required('Tell us about your experience'), V.minLen(20, 'At least 20 characters')],
      portfolio:   [V.url('Enter a valid URL (or leave blank)')],
      coverNote:   [V.required('A short cover note helps'), V.minLen(30, 'At least 30 characters')],
      resume:      [V.fileRequired('Please attach your resume'), V.fileType(['pdf', 'doc', 'docx'], 'PDF, DOC, or DOCX only'), V.fileMaxSize(5, 'Max 5MB')],
    });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setBusy(true);
    await apiCall(API_ENDPOINTS.careers, {
      jobId: selected.id, jobTitle: selected.title,
      ...data, resume: data.resume?.name,
    });
    setBusy(false); setDone(true);
  }

  return (
    <>
      <PageShell
        chip={`Careers · ${JOBS.length} open roles`}
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
          {filteredJobs.length === 0 && (
            <p className="muted" style={{ padding: 24, fontStyle: 'italic', textAlign: 'center' }}>
              No roles match "{query}". Try a broader search, or just send us your CV anyway.
            </p>
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
                <label className="field-label">Years / kind of experience *</label>
                <textarea className="field-textarea" value={data.experience} onChange={(e) => update('experience', e.target.value)} placeholder="e.g. 4 yrs · React/TS · 2 production launches at scale" rows={3} />
                {errors.experience && <p className="field-error-msg"><AlertCircle size={12} /> {errors.experience}</p>}
              </div>
              <div className={`field ${errors.portfolio ? 'field-error' : ''}`} style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">Portfolio / GitHub URL</label>
                <input className="field-input" value={data.portfolio} onChange={(e) => update('portfolio', e.target.value)} placeholder="https://… (optional)" />
                {errors.portfolio && <p className="field-error-msg"><AlertCircle size={12} /> {errors.portfolio}</p>}
              </div>
              <div className={`field ${errors.coverNote ? 'field-error' : ''}`} style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">Cover note *</label>
                <textarea className="field-textarea" value={data.coverNote} onChange={(e) => update('coverNote', e.target.value)} placeholder="A few honest sentences about why this role." rows={4} />
                {errors.coverNote && <p className="field-error-msg"><AlertCircle size={12} /> {errors.coverNote}</p>}
              </div>
              <div className={`field ${errors.resume ? 'field-error' : ''}`} style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">Resume * <span style={{ color: 'var(--c-faint)' }}>PDF / DOC / DOCX · max 5MB</span></label>
                <label className="field-file-wrap">
                  <Upload size={18} className="muted" />
                  <div style={{ flex: 1 }}>
                    <p className="field-file-name">{data.resume ? data.resume.name : 'Choose a file or drop it here'}</p>
                    {data.resume && <p className="field-file-hint">{(data.resume.size / 1024 / 1024).toFixed(2)} MB</p>}
                  </div>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => update('resume', e.target.files?.[0] || null)} />
                </label>
                {errors.resume && <p className="field-error-msg"><AlertCircle size={12} /> {errors.resume}</p>}
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
              Thank you. We've received your application for <strong style={{ color: 'var(--c-text)' }}>{selected?.title}</strong>. The hiring team will respond to <strong style={{ color: 'var(--c-text)' }}>{data.email}</strong> within 5 working days.
            </p>
            <button className="btn mt-6" style={{ marginTop: 28 }} onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </>
  );
}
