import { useState } from 'react';
import { CheckCircle2, AlertCircle, Download } from 'lucide-react';
import Modal from '../components/Modal.jsx';
import { API_ENDPOINTS, apiCall } from '../config.js';
import { V, runValidation } from '../validators.js';

export default function BrochureModal({ open, onClose }) {
  const [data, setData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function update(k, v) { setData((d) => ({ ...d, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); }
  function reset() { setData({ name: '', email: '' }); setErrors({}); setDone(false); }

  async function submit(e) {
    e.preventDefault();
    const errs = runValidation(data, {
      name:  [V.required('Your name is required'), V.minLen(2)],
      email: [V.required('Email is required'), V.email()],
    });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setBusy(true);
    await apiCall(API_ENDPOINTS.brochure, data);
    setBusy(false); setDone(true);
  }

  return (
    <Modal open={open} onClose={() => { onClose(); setTimeout(reset, 240); }}>
      {!done ? (
        <div style={{ padding: 36 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'var(--grad-signature)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', marginBottom: 18,
          }}>
            <Download size={22} />
          </div>
          <h2 className="display display-sm" style={{ marginBottom: 10 }}>
            Company <em>profile</em>
          </h2>
          <p className="muted" style={{ marginBottom: 28, lineHeight: 1.6 }}>
            We'll email you the studio PDF — projects, capabilities, team, references. No follow-up unless you ask.
          </p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className={`field ${errors.name ? 'field-error' : ''}`}>
              <label className="field-label">Your name</label>
              <input className="field-input" value={data.name} onChange={(e) => update('name', e.target.value)} placeholder="Jane Doe" />
              {errors.name && <p className="field-error-msg"><AlertCircle size={12} /> {errors.name}</p>}
            </div>
            <div className={`field ${errors.email ? 'field-error' : ''}`}>
              <label className="field-label">Work email</label>
              <input className="field-input" type="email" value={data.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" />
              {errors.email && <p className="field-error-msg"><AlertCircle size={12} /> {errors.email}</p>}
            </div>
            <button className="btn btn-primary mt-2" disabled={busy} style={{ marginTop: 8 }}>
              {busy ? <span className="spinner" /> : <>Email me the brochure</>}
            </button>
          </form>
        </div>
      ) : (
        <div className="success-panel">
          <div className="success-panel-icon"><CheckCircle2 size={32} /></div>
          <h3 className="display display-sm" style={{ marginBottom: 10 }}>Sent ✓</h3>
          <p className="muted">The brochure is on its way to <strong style={{ color: 'var(--c-text)' }}>{data.email}</strong>.</p>
          <button className="btn mt-6" onClick={() => { onClose(); setTimeout(reset, 240); }} style={{ marginTop: 24 }}>Close</button>
        </div>
      )}
    </Modal>
  );
}
