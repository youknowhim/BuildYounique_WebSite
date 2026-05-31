import { useState } from 'react';
import { CheckCircle2, AlertCircle, Check, User, BookOpen, Award, Calendar, Tag } from 'lucide-react';
import Modal from '../components/Modal.jsx';
import Countdown from '../components/Countdown.jsx';
import { API_ENDPOINTS, apiCall } from '../config.js';
import { V, runValidation } from '../validators.js';
import { COURSE_PRICING } from '../data.js';

export default function CourseModal({ course, open, onClose }) {
  const [data, setData] = useState({ name: '', email: '', phone: '', institution: '', year: '', address: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function update(k, v) { setData((d) => ({ ...d, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); }
  function reset() {
    setData({ name: '', email: '', phone: '', institution: '', year: '', address: '' });
    setErrors({}); setDone(false);
  }

  async function submit(e) {
    e.preventDefault();
    const errs = runValidation(data, {
      name:        [V.required('Name required'), V.minLen(2)],
      email:       [V.required('Email required'), V.email()],
      phone:       [V.required('Phone required'), V.phone()],
      institution: [V.required('Institution required'), V.minLen(2)],
      address:     [V.required('Address required'), V.minLen(10, 'Please enter a full address (10+ chars)')],
    });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setBusy(true);
    await apiCall(API_ENDPOINTS.training, {
      courseId: course.id, courseName: course.name,
      originalPrice: COURSE_PRICING.original, discountedPrice: COURSE_PRICING.discounted,
      ...data,
    });
    setBusy(false); setDone(true);
  }

  if (!course) return null;

  return (
    <Modal open={open} onClose={() => { onClose(); setTimeout(reset, 240); }} wide>
      {!done ? (
        <div>
          {/* Header with cover image */}
          <div style={{ position: 'relative', height: 220, overflow: 'hidden', borderTopLeftRadius: 'var(--r-xl)', borderTopRightRadius: 'var(--r-xl)' }}>
            <img
              src={course.cover}
              alt={course.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(180deg, rgba(7,8,15,0.2) 0%, rgba(7,8,15,0.85) 100%), ${course.grad}`,
              mixBlendMode: 'normal',
              opacity: 0.92,
            }} />
            <div style={{ position: 'absolute', bottom: 22, left: 28, right: 28 }}>
              <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>
                {course.weeks} weeks · {course.mode}
              </p>
              <h2 className="display display-md" style={{ color: '#fff' }}>{course.name}</h2>
            </div>
          </div>

          {/* Price block */}
          <div style={{ padding: 28, borderBottom: '1px solid var(--c-border)', background: 'linear-gradient(180deg, var(--c-ink-1), var(--c-ink-2))' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
              <span style={{ textDecoration: 'line-through', textDecorationColor: 'var(--c-faint)', textDecorationThickness: 2, color: 'var(--c-faint)', fontSize: 22, fontFamily: 'var(--f-mono)' }}>
                ₹{COURSE_PRICING.original.toLocaleString('en-IN')}
              </span>
              <span className="display" style={{ fontSize: 48, lineHeight: 1, fontWeight: 600, background: 'var(--grad-signature)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ₹{COURSE_PRICING.discounted.toLocaleString('en-IN')}
              </span>
              <span className="pill pill-success" style={{ marginBottom: 6 }}>
                <Tag size={11} /> Save ₹{COURSE_PRICING.savings.toLocaleString('en-IN')}
              </span>
            </div>
            <Countdown />
          </div>

          {/* Details */}
          <div style={{ padding: 28, display: 'grid', gap: 28, gridTemplateColumns: '1.2fr 1fr' }} className="cm-grid">
            <div>
              <p className="eyebrow no-line" style={{ marginBottom: 14 }}>
                <BookOpen size={12} style={{ marginRight: 6 }} /> Curriculum
              </p>
              <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {course.modules.map((m, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, fontSize: 14.5, color: 'var(--c-muted)', lineHeight: 1.5 }}>
                    <span className="mono" style={{ flexShrink: 0, width: 24, color: 'var(--c-faint)', fontSize: 12, fontWeight: 600 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {m}
                  </li>
                ))}
              </ol>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div>
                <p className="eyebrow no-line" style={{ marginBottom: 8 }}><User size={12} style={{ marginRight: 6 }} /> Mentor</p>
                <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55 }}>{course.mentor}</p>
              </div>
              <div>
                <p className="eyebrow no-line" style={{ marginBottom: 8 }}><Check size={12} style={{ marginRight: 6 }} /> Assessment</p>
                <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55 }}>{course.assessment}</p>
              </div>
              <div>
                <p className="eyebrow no-line" style={{ marginBottom: 8 }}><Award size={12} style={{ marginRight: 6 }} /> Outcome</p>
                <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55 }}>{course.outcome}</p>
              </div>
              <div>
                <p className="eyebrow no-line" style={{ marginBottom: 8 }}><Calendar size={12} style={{ marginRight: 6 }} /> Schedule</p>
                <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55 }}>{course.schedule}</p>
                <p className="mono" style={{ fontSize: 12, color: 'var(--c-warning)', marginTop: 6 }}>● {course.batch}</p>
              </div>
            </div>
          </div>

          {/* Enrolment form */}
          <div style={{ padding: 28, borderTop: '1px solid var(--c-border)' }}>
            <h3 className="display display-sm" style={{ marginBottom: 6 }}>Enrol now</h3>
            <p className="muted" style={{ marginBottom: 22, fontSize: 14 }}>
              Reserve your seat at <strong style={{ color: 'var(--c-text)' }}>₹3,000</strong> — discount ends with the countdown above.
            </p>

            <form onSubmit={submit} style={{ display: 'grid', gap: 14, gridTemplateColumns: '1fr 1fr' }} className="form-grid">
              <div className={`field ${errors.name ? 'field-error' : ''}`}>
                <label className="field-label">Full name *</label>
                <input className="field-input" value={data.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" />
                {errors.name && <p className="field-error-msg"><AlertCircle size={12} /> {errors.name}</p>}
              </div>
              <div className={`field ${errors.email ? 'field-error' : ''}`}>
                <label className="field-label">Email *</label>
                <input className="field-input" type="email" value={data.email} onChange={(e) => update('email', e.target.value)} placeholder="you@email.com" />
                {errors.email && <p className="field-error-msg"><AlertCircle size={12} /> {errors.email}</p>}
              </div>
              <div className={`field ${errors.phone ? 'field-error' : ''}`}>
                <label className="field-label">Phone *</label>
                <input className="field-input" value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 …" />
                {errors.phone && <p className="field-error-msg"><AlertCircle size={12} /> {errors.phone}</p>}
              </div>
              <div className={`field ${errors.institution ? 'field-error' : ''}`}>
                <label className="field-label">College / Institution *</label>
                <input className="field-input" value={data.institution} onChange={(e) => update('institution', e.target.value)} placeholder="e.g. Jadavpur University" />
                {errors.institution && <p className="field-error-msg"><AlertCircle size={12} /> {errors.institution}</p>}
              </div>
              <div className="field">
                <label className="field-label">Year of study</label>
                <input className="field-input" value={data.year} onChange={(e) => update('year', e.target.value)} placeholder="Optional · e.g. 3rd year" />
              </div>
              <div className={`field ${errors.address ? 'field-error' : ''}`} style={{ gridColumn: '1 / -1' }}>
                <label className="field-label">Full address *</label>
                <textarea className="field-textarea" value={data.address} onChange={(e) => update('address', e.target.value)} placeholder="House, street, city, state, pincode" />
                {errors.address && <p className="field-error-msg"><AlertCircle size={12} /> {errors.address}</p>}
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
                <p className="faint mono" style={{ fontSize: 12 }}>
                  Payable today: <span style={{ color: 'var(--c-text)', fontWeight: 600, fontSize: 16 }}>₹3,000</span>
                  {' · '}<span style={{ textDecoration: 'line-through' }}>₹5,000</span>
                </p>
                <button className="btn btn-primary btn-lg" disabled={busy}>
                  {busy ? <span className="spinner" /> : 'Reserve seat →'}
                </button>
              </div>
            </form>
          </div>

          <style>{`
            @media (max-width: 760px) {
              .cm-grid { grid-template-columns: 1fr !important; }
              .form-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      ) : (
        <div className="success-panel">
          <div className="success-panel-icon"><CheckCircle2 size={32} /></div>
          <h3 className="display display-sm" style={{ marginBottom: 10 }}>Seat reserved ✓</h3>
          <p className="muted" style={{ maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
            We've reserved your seat for <strong style={{ color: 'var(--c-text)' }}>{course.name}</strong>. We'll email <strong style={{ color: 'var(--c-text)' }}>{data.email}</strong> within a few hours with payment instructions and the welcome pack.
          </p>
          <button className="btn mt-6" onClick={() => { onClose(); setTimeout(reset, 240); }} style={{ marginTop: 28 }}>Close</button>
        </div>
      )}
    </Modal>
  );
}
