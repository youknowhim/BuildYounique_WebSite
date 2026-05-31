import { useState } from 'react';
import { CheckCircle2, AlertCircle, Mail, Phone, MapPin, Linkedin, Instagram, ArrowRight } from 'lucide-react';
import { COMPANY, SERVICES } from '../data.js';
import { API_ENDPOINTS, apiCall } from '../config.js';
import { V, runValidation } from '../validators.js';
import PageShell from '../components/PageShell.jsx';

export default function Contact() {
  const [data, setData] = useState({ service: '', name: '', email: '', phone: '', description: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function update(k, v) { setData((d) => ({ ...d, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); }

  async function submit(e) {
    e.preventDefault();
    const errs = runValidation(data, {
      name:        [V.required('Your name'), V.minLen(2)],
      email:       [V.required('Email is required'), V.email()],
      phone:       [V.required('Phone is required'), V.phone()],
      description: [V.required('Tell us a little'), V.minLen(20, 'At least 20 characters — what are you building?')],
    });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setBusy(true);
    await apiCall(API_ENDPOINTS.contact, data);
    setBusy(false); setDone(true);
  }

  return (
    <>
      <PageShell
        chip="Contact"
        title="Let's <em>build</em> something."
        lead="Tell us what you're working on. We respond within a working day with a written reply — not a generic auto-responder."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'grid', gap: 'clamp(28px, 5vw, 56px)', gridTemplateColumns: '1.4fr 1fr' }} className="ct-grid">
            {/* Form */}
            <div className="surface" style={{ padding: 'clamp(28px, 4vw, 44px)' }}>
              {!done ? (
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="field">
                    <label className="field-label">What can we help with?</label>
                    <select className="field-select" value={data.service} onChange={(e) => update('service', e.target.value)}>
                      <option value="">Not sure / general enquiry</option>
                      {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                      <option value="training">Training enrolment</option>
                      <option value="hackathon">Hackathon registration</option>
                      <option value="press">Press / partnership</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gap: 14, gridTemplateColumns: '1fr 1fr' }} className="ct-row">
                    <div className={`field ${errors.name ? 'field-error' : ''}`}>
                      <label className="field-label">Your name *</label>
                      <input className="field-input" value={data.name} onChange={(e) => update('name', e.target.value)} />
                      {errors.name && <p className="field-error-msg"><AlertCircle size={12} /> {errors.name}</p>}
                    </div>
                    <div className={`field ${errors.email ? 'field-error' : ''}`}>
                      <label className="field-label">Email *</label>
                      <input className="field-input" type="email" value={data.email} onChange={(e) => update('email', e.target.value)} />
                      {errors.email && <p className="field-error-msg"><AlertCircle size={12} /> {errors.email}</p>}
                    </div>
                  </div>

                  <div className={`field ${errors.phone ? 'field-error' : ''}`}>
                    <label className="field-label">Phone *</label>
                    <input className="field-input" value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 …" />
                    {errors.phone && <p className="field-error-msg"><AlertCircle size={12} /> {errors.phone}</p>}
                  </div>

                  <div className={`field ${errors.description ? 'field-error' : ''}`}>
                    <label className="field-label">What are you building? *</label>
                    <textarea
                      className="field-textarea"
                      value={data.description}
                      onChange={(e) => update('description', e.target.value)}
                      placeholder="A few honest sentences — what you're working on, where you are with it, what you need help with."
                      rows={5}
                    />
                    {errors.description && <p className="field-error-msg"><AlertCircle size={12} /> {errors.description}</p>}
                  </div>

                  <button className="btn btn-primary btn-lg" disabled={busy} style={{ marginTop: 6 }}>
                    {busy ? <span className="spinner" /> : <>Send brief <ArrowRight size={16} /></>}
                  </button>

                  <p className="mono faint" style={{ fontSize: 11.5, marginTop: 4 }}>
                    No newsletter signup. No follow-up calls unless you ask.
                  </p>
                </form>
              ) : (
                <div className="success-panel">
                  <div className="success-panel-icon"><CheckCircle2 size={32} /></div>
                  <h3 className="display display-sm" style={{ marginBottom: 10 }}>Brief received ✓</h3>
                  <p className="muted" style={{ maxWidth: 460, margin: '0 auto', lineHeight: 1.6 }}>
                    Thanks {data.name.split(' ')[0]}. We'll respond to <strong style={{ color: 'var(--c-text)' }}>{data.email}</strong> within a working day.
                  </p>
                  <button className="btn mt-6" onClick={() => { setDone(false); setData({ service: '', name: '', email: '', phone: '', description: '' }); }} style={{ marginTop: 28 }}>
                    Send another
                  </button>
                </div>
              )}
            </div>

            {/* Studio info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="surface-2" style={{ padding: 28 }}>
                <p className="eyebrow no-line" style={{ marginBottom: 14 }}>The Studio</p>
                <p className="display display-sm" style={{ marginBottom: 18 }}>{COMPANY.name}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14 }}>
                  <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 muted">
                    <Mail size={16} className="muted" /> {COMPANY.email}
                  </a>
                  <a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 muted">
                    <Phone size={16} className="muted" /> {COMPANY.phone}
                  </a>
                  <div className="flex items-start gap-3 muted">
                    <MapPin size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{COMPANY.address}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <a href={COMPANY.socials.linkedin} target="_blank" rel="noreferrer noopener" className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--c-ink-2)', border: '1px solid var(--c-border)', color: 'var(--c-muted)' }} aria-label="LinkedIn">
                    <Linkedin size={16} />
                  </a>
                  <a href={COMPANY.socials.instagram} target="_blank" rel="noreferrer noopener" className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--c-ink-2)', border: '1px solid var(--c-border)', color: 'var(--c-muted)' }} aria-label="Instagram">
                    <Instagram size={16} />
                  </a>
                </div>
              </div>

              <div className="surface" style={{ padding: 28 }}>
                <p className="eyebrow no-line" style={{ marginBottom: 12 }}>Working hours</p>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--c-muted)' }}>
                  Mon–Fri · 10am–7pm IST<br />
                  Saturdays for active engagements<br />
                  Email response within a working day
                </p>
              </div>

              <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer noopener" className="surface card-hover" style={{ padding: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                <div>
                  <p className="display" style={{ fontSize: 18 }}>WhatsApp us</p>
                  <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>Faster for quick questions</p>
                </div>
                <ArrowRight size={20} className="muted" />
              </a>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 880px) { .ct-grid { grid-template-columns: 1fr !important; } }
          @media (max-width: 640px) { .ct-row { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>
    </>
  );
}
