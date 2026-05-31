import { useState } from 'react';
import { CheckCircle2, AlertCircle, Tag, Users, Trophy, Clock } from 'lucide-react';
import Modal from '../components/Modal.jsx';
import { API_ENDPOINTS, apiCall, validateCoupon } from '../config.js';
import { V, runValidation } from '../validators.js';
import { HACKATHON_FEE } from '../data.js';

export default function HackathonModal({ hack, open, onClose }) {
  const [data, setData] = useState({
    leaderName: '', leaderEmail: '', leaderPhone: '',
    member2Email: '', organisation: '', category: '',
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponInfo, setCouponInfo] = useState(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  function update(k, v) { setData((d) => ({ ...d, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); }
  function reset() {
    setData({ leaderName: '', leaderEmail: '', leaderPhone: '', member2Email: '', organisation: '', category: '' });
    setErrors({}); setDone(false); setCoupon(''); setCouponInfo(null); setCouponMsg('');
  }

  async function applyCoupon() {
    if (!coupon.trim()) return;
    setCheckingCoupon(true); setCouponMsg('');
    const r = await validateCoupon(coupon);
    setCheckingCoupon(false);
    if (r.ok) { setCouponInfo(r); setCouponMsg(`Applied — ${r.label}`); }
    else { setCouponInfo(null); setCouponMsg(r.message || 'Invalid'); }
  }

  // Fee calculation
  const baseFee = HACKATHON_FEE;
  let discount = 0;
  if (couponInfo) discount = couponInfo.type === 'percent' ? Math.round(baseFee * couponInfo.value / 100) : couponInfo.value;
  const finalFee = Math.max(0, baseFee - discount);

  async function submit(e) {
    e.preventDefault();
    const errs = runValidation(data, {
      leaderName:   [V.required('Leader name required'), V.minLen(2)],
      leaderEmail:  [V.required('Leader email required'), V.email()],
      leaderPhone:  [V.required('Phone required'), V.phone()],
      member2Email: [V.required('Member 2 email required'), V.email(), V.differentFrom('leaderEmail', 'Must be different from leader email')],
      organisation: [V.required('Organisation required'), V.minLen(2)],
      category:     [V.required('Pick a category')],
    });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setBusy(true);
    await apiCall(API_ENDPOINTS.hackathon, {
      hackathonId: hack.id, hackathonName: hack.name,
      baseFee, discount, finalFee, coupon: couponInfo ? coupon : null,
      ...data,
    });
    setBusy(false); setDone(true);
  }

  if (!hack) return null;

  return (
    <Modal open={open} onClose={() => { onClose(); setTimeout(reset, 240); }} wide>
      {!done ? (
        <div>
          {/* Header */}
          <div style={{ padding: '36px 32px 28px', background: hack.grad, color: '#fff', borderTopLeftRadius: 'var(--r-xl)', borderTopRightRadius: 'var(--r-xl)' }}>
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>Register · Team of 2</p>
            <h2 className="display display-md" style={{ color: '#fff', marginBottom: 12 }}>{hack.name}</h2>
            <p style={{ opacity: 0.92, fontSize: 16, marginBottom: 18 }}>{hack.tagline}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13, fontFamily: 'var(--f-mono)' }}>
              <span className="flex items-center gap-1"><Clock size={13} /> {hack.duration}</span>
              <span className="flex items-center gap-1"><Trophy size={13} /> {hack.prize}</span>
              <span className="flex items-center gap-1"><Users size={13} /> Teams of 2</span>
              <span>· {hack.mode}</span>
            </div>
          </div>

          <form onSubmit={submit} style={{ padding: '28px 32px 32px' }}>
            <div style={{ display: 'grid', gap: 14, gridTemplateColumns: '1fr 1fr' }} className="hm-grid">
              <div className={`field ${errors.leaderName ? 'field-error' : ''}`}>
                <label className="field-label">Team leader · Name *</label>
                <input className="field-input" value={data.leaderName} onChange={(e) => update('leaderName', e.target.value)} placeholder="Leader's full name" />
                {errors.leaderName && <p className="field-error-msg"><AlertCircle size={12} /> {errors.leaderName}</p>}
              </div>
              <div className={`field ${errors.leaderEmail ? 'field-error' : ''}`}>
                <label className="field-label">Leader · Email *</label>
                <input className="field-input" type="email" value={data.leaderEmail} onChange={(e) => update('leaderEmail', e.target.value)} placeholder="leader@email.com" />
                {errors.leaderEmail && <p className="field-error-msg"><AlertCircle size={12} /> {errors.leaderEmail}</p>}
              </div>
              <div className={`field ${errors.leaderPhone ? 'field-error' : ''}`}>
                <label className="field-label">Leader · Phone *</label>
                <input className="field-input" value={data.leaderPhone} onChange={(e) => update('leaderPhone', e.target.value)} placeholder="+91 …" />
                {errors.leaderPhone && <p className="field-error-msg"><AlertCircle size={12} /> {errors.leaderPhone}</p>}
              </div>
              <div className={`field ${errors.member2Email ? 'field-error' : ''}`}>
                <label className="field-label">Member 2 · Email *</label>
                <input className="field-input" type="email" value={data.member2Email} onChange={(e) => update('member2Email', e.target.value)} placeholder="teammate@email.com" />
                {errors.member2Email && <p className="field-error-msg"><AlertCircle size={12} /> {errors.member2Email}</p>}
              </div>
              <div className={`field ${errors.organisation ? 'field-error' : ''}`}>
                <label className="field-label">College / Organisation *</label>
                <input className="field-input" value={data.organisation} onChange={(e) => update('organisation', e.target.value)} placeholder="Your institution" />
                {errors.organisation && <p className="field-error-msg"><AlertCircle size={12} /> {errors.organisation}</p>}
              </div>
              <div className={`field ${errors.category ? 'field-error' : ''}`}>
                <label className="field-label">Track / Category *</label>
                <select className="field-select" value={data.category} onChange={(e) => update('category', e.target.value)}>
                  <option value="">Select a track…</option>
                  {hack.categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="field-error-msg"><AlertCircle size={12} /> {errors.category}</p>}
              </div>
            </div>

            {/* Coupon */}
            <div style={{ marginTop: 24, padding: 18, background: 'var(--c-ink-0)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-md)' }}>
              <label className="field-label" style={{ marginBottom: 8, display: 'block' }}>Coupon code</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="field-input"
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponInfo(null); setCouponMsg(''); }}
                  placeholder="e.g. STUDENT50, EARLYBIRD"
                  style={{ flex: 1, textTransform: 'uppercase' }}
                />
                <button type="button" className="btn btn-sm" onClick={applyCoupon} disabled={checkingCoupon || !coupon.trim()}>
                  {checkingCoupon ? <span className="spinner" /> : 'Apply'}
                </button>
              </div>
              {couponMsg && (
                <p style={{
                  marginTop: 8, fontSize: 12, fontFamily: 'var(--f-mono)',
                  color: couponInfo ? 'var(--c-success)' : 'var(--c-danger)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {couponInfo ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}{couponMsg}
                </p>
              )}
            </div>

            {/* Fee breakdown */}
            <div style={{ marginTop: 18, padding: 18, background: 'var(--c-ink-2)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--c-muted)', fontFamily: 'var(--f-mono)' }}>
                <span>Base entry fee</span>
                <span>₹{baseFee.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--c-success)', fontFamily: 'var(--f-mono)', marginTop: 6 }}>
                  <span>Coupon discount</span>
                  <span>− ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--c-border)' }}>
                <span style={{ fontWeight: 600 }}>Total payable</span>
                <span className="display" style={{ fontSize: 28, fontWeight: 600, background: 'var(--grad-signature)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ₹{finalFee.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button className="btn btn-primary btn-lg w-full" disabled={busy} style={{ marginTop: 20 }}>
              {busy ? <span className="spinner" /> : `Register team · pay ₹${finalFee.toLocaleString('en-IN')}`}
            </button>

            <style>{`@media (max-width: 640px) { .hm-grid { grid-template-columns: 1fr !important; } }`}</style>
          </form>
        </div>
      ) : (
        <div className="success-panel">
          <div className="success-panel-icon"><CheckCircle2 size={32} /></div>
          <h3 className="display display-sm" style={{ marginBottom: 10 }}>Team registered ✓</h3>
          <p className="muted" style={{ maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
            Your team is in for <strong style={{ color: 'var(--c-text)' }}>{hack.name}</strong>. Payment instructions and the welcome pack are on their way to <strong style={{ color: 'var(--c-text)' }}>{data.leaderEmail}</strong>.
          </p>
          <button className="btn mt-6" onClick={() => { onClose(); setTimeout(reset, 240); }} style={{ marginTop: 28 }}>Close</button>
        </div>
      )}
    </Modal>
  );
}
