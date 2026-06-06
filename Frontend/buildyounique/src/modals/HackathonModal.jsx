import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2, AlertCircle, Users, Trophy, Clock, ShieldCheck,
  Mail, CreditCard, LogOut, ArrowRight,
} from 'lucide-react';
import Modal from '../components/Modal.jsx';
import {
  HACKATHON_API, apiRequest, teamSession, FEE_PER_MEMBER, TEAM_SIZE,
} from '../config.js';
import { V, runValidation } from '../validators.js';

const BLANK = {
  hackathon_event_id: '', college_id: '', team_name: '',
  team_leader_name: '', team_leader_email: '', phone: '',
};

// step: 'form' | 'otpLeader' | 'loginEmail' | 'otpLogin' | 'otpMember' | 'dashboard'
export default function HackathonModal({ hack, open, onClose, mode = 'register' }) {
  const [step, setStep] = useState('form');
  const [data, setData] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const [colleges, setColleges] = useState([]);
  const [events, setEvents] = useState([]);

  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponMsg, setCouponMsg] = useState('');

  const COUPONS = { HACK20: { type: 'percent', value: 20 }, FLAT100: { type: 'flat', value: 100 }, BYU2026: { type: 'percent', value: 25 } };
  function applyCoupon() {
    const c = COUPONS[coupon.trim().toUpperCase()];
    if (!c) { setCouponApplied(null); setCouponMsg('Invalid coupon code'); return; }
    setCouponApplied(c); setCouponMsg(`Applied — ${c.type === 'percent' ? c.value + '% off' : '₹' + c.value + ' off'}`);
  }

  const [teamId, setTeamId] = useState(null);
  const [token, setToken] = useState(null);
  const [leaderEmail, setLeaderEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberId, setMemberId] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');

  const reset = useCallback(() => {
    setStep('form'); setData(BLANK); setErrors({}); setBusy(false); setNotice('');
    setTeamId(null); setToken(null); setLeaderEmail(''); setOtp('');
    setTeam(null); setMembers([]); setMemberEmail(''); setMemberId(null); setLoginEmail('');
  }, []);

  // --- load colleges + hackathon events for the register form -------
  const loadLists = useCallback(async () => {
    const [c, e] = await Promise.all([
      apiRequest(HACKATHON_API.colleges),
      apiRequest(HACKATHON_API.hackathonEvents),
    ]);
    const cs = c.ok ? c.data?.colleges || [] : [];
    const es = e.ok ? e.data?.hackathon_events || [] : [];
    setColleges(cs); setEvents(es);
    if (hack && es.length) {
      const match = es.find((ev) => ev.event_name?.toLowerCase() === hack.name?.toLowerCase());
      if (match) setData((d) => ({ ...d, hackathon_event_id: String(match.id) }));
    }
  }, [hack]);

  // --- load team + members into the dashboard -----------------------
  const enterDashboard = useCallback(async (id, tk, preTeam) => {
    setStep('dashboard'); setBusy(true); setNotice('');
    const [t, m] = await Promise.all([
      preTeam ? Promise.resolve({ ok: true, data: { team: preTeam } })
              : apiRequest(`${HACKATHON_API.teams}/${id}`),
      apiRequest(`${HACKATHON_API.teamMembers}?team_id=${id}`, { token: tk }),
    ]);
    setBusy(false);
    if (t.ok) setTeam(t.data?.team);
    if (m.ok) setMembers(m.data?.team_members || []);
    else setNotice(m.message || 'Could not load team members.');
  }, []);

  // --- open: pick the right starting step ---------------------------
  useEffect(() => {
    if (!open) return;
    reset();
    if (mode === 'login') {
      const s = teamSession.get();
      if (s?.token && s?.team_id) {
        setToken(s.token); setTeamId(s.team_id); setLeaderEmail(s.team_leader_email || '');
        enterDashboard(s.team_id, s.token);
      } else {
        setStep('loginEmail');
      }
    } else {
      setStep('form');
      loadLists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode]);

  function update(k, v) { setData((d) => ({ ...d, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); }
  function close() { onClose(); setTimeout(reset, 240); }

  // ================= actions =================

  async function submitRegister(e) {
    e.preventDefault();
    const errs = runValidation(data, {
      college_id:         [V.required('Select your college')],
      team_name:          [V.required('Team name required'), V.minLen(2)],
      team_leader_name:   [V.required('Leader name required'), V.minLen(2)],
      team_leader_email:  [V.required('Leader email required'), V.email()],
      phone:              [V.required('Phone required'), V.phone()],
    });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setBusy(true); setNotice('');
    const r = await apiRequest(HACKATHON_API.teams, {
      method: 'POST',
      body: {
        hackathon_event_id: Number(data.hackathon_event_id),
        college_id: Number(data.college_id),
        team_name: data.team_name,
        team_leader_name: data.team_leader_name,
        team_leader_email: data.team_leader_email,
        phone: data.phone,
        registration_fee_per_member: FEE_PER_MEMBER,
      },
    });
    setBusy(false);
    if (!r.ok) { setNotice(r.message); return; }
    setTeamId(r.data?.team?.id);
    setLeaderEmail(data.team_leader_email);
    setOtp(''); setStep('otpLeader');
  }

  // verify leader registration OTP, then trigger login (2nd OTP -> token)
  async function verifyLeader(e) {
    e.preventDefault();
    if (!otp.trim()) { setNotice('Enter the 6-digit code'); return; }
    setBusy(true); setNotice('');
    const r = await apiRequest(HACKATHON_API.teamVerifyEmail, {
      method: 'POST', body: { team_id: teamId, otp: otp.trim() },
    });
    if (!r.ok) { setBusy(false); setNotice(r.message); return; }
    const lr = await apiRequest(HACKATHON_API.teamLogin, {
      method: 'POST', body: { team_leader_email: leaderEmail },
    });
    setBusy(false);
    if (!lr.ok) { setNotice(lr.message); return; }
    setOtp(''); setStep('otpLogin');
  }

  async function sendLoginOtp(e) {
    e.preventDefault();
    const err = runValidation({ email: loginEmail }, { email: [V.required('Email required'), V.email()] });
    if (err.email) { setErrors({ loginEmail: err.email }); return; }
    setBusy(true); setNotice('');
    const r = await apiRequest(HACKATHON_API.teamLogin, {
      method: 'POST', body: { team_leader_email: loginEmail },
    });
    setBusy(false);
    if (!r.ok) { setNotice(r.message); return; }
    setTeamId(r.data?.team_id); setLeaderEmail(loginEmail);
    setOtp(''); setStep('otpLogin');
  }

  // verify login OTP -> JWT -> dashboard
  async function verifyLogin(e) {
    e.preventDefault();
    if (!otp.trim()) { setNotice('Enter the 6-digit code'); return; }
    setBusy(true); setNotice('');
    const r = await apiRequest(HACKATHON_API.teamLoginVerify, {
      method: 'POST', body: { team_id: teamId, otp: otp.trim() },
    });
    setBusy(false);
    if (!r.ok) { setNotice(r.message); return; }
    const tk = r.data?.token;
    setToken(tk); setTeam(r.data?.team);
    teamSession.set({ token: tk, team_id: teamId, team_leader_email: leaderEmail });
    await enterDashboard(teamId, tk, r.data?.team);
  }

  async function addMember(e) {
    e.preventDefault();
    const err = runValidation({ email: memberEmail, leader: leaderEmail }, {
      email: [V.required('Member email required'), V.email(),
        V.differentFrom('leader', 'Must differ from the leader email')],
    });
    if (err.email) { setErrors({ memberEmail: err.email }); return; }
    setBusy(true); setNotice('');
    const r = await apiRequest(HACKATHON_API.teamMembers, {
      method: 'POST', token, body: { team_id: teamId, email: memberEmail },
    });
    setBusy(false);
    if (!r.ok) { setNotice(r.message); return; }
    setMemberId(r.data?.team_member?.id);
    setOtp(''); setStep('otpMember');
  }

  async function verifyMember(e) {
    e.preventDefault();
    if (!otp.trim()) { setNotice('Enter the 6-digit code'); return; }
    setBusy(true); setNotice('');
    const r = await apiRequest(HACKATHON_API.memberVerify, {
      method: 'POST', token, body: { member_id: memberId, otp: otp.trim() },
    });
    setBusy(false);
    if (!r.ok) { setNotice(r.message); return; }
    await enterDashboard(teamId, token);
  }

  function logout() { teamSession.clear(); close(); }

  // ================= derived =================
  const grad = hack?.grad || 'var(--grad-signature)';
  const baseTitle = hack?.name || team?.team_name || 'Hackathon';
  const feePer = Number(team?.registration_fee_per_member) || FEE_PER_MEMBER;
  const baseTotal = feePer * TEAM_SIZE;
  const discount = couponApplied ? (couponApplied.type === 'percent' ? Math.round(baseTotal * couponApplied.value / 100) : couponApplied.value) : 0;
  const total = Math.max(0, baseTotal - discount);

  const leaderVerified = !!team?.leader_email_verified;
  const member = members[0] || null;
  const memberVerified = !!member?.member_email_verified;
  const bothVerified = leaderVerified && memberVerified;
  const paid = team?.payment_status === 'paid';

  // ================= render helpers (plain functions — inlined) ======
  const header = ({ eyebrow, sub, title }) => (
    <div style={{ padding: '32px 32px 26px', background: grad, color: '#fff', borderTopLeftRadius: 'var(--r-xl)', borderTopRightRadius: 'var(--r-xl)' }}>
      <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.82)', marginBottom: 10 }}>{eyebrow}</p>
      <h2 className="display display-md" style={{ color: '#fff', marginBottom: sub ? 10 : 0 }}>{title || baseTitle}</h2>
      {sub && <p style={{ opacity: 0.92, fontSize: 15 }}>{sub}</p>}
      {hack && step === 'form' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13, fontFamily: 'var(--f-mono)', marginTop: 14 }}>
          <span className="flex items-center gap-1"><Clock size={13} /> {hack.duration}</span>
          <span className="flex items-center gap-1"><Trophy size={13} /> {hack.prize}</span>
          <span className="flex items-center gap-1"><Users size={13} /> Team of {TEAM_SIZE}</span>
        </div>
      )}
    </div>
  );

  const noticeBlock = notice ? (
    <p style={{ margin: '0 0 16px', padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'rgba(255,92,124,0.12)', border: '1px solid var(--c-danger)', color: 'var(--c-danger)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
      <AlertCircle size={14} /> {notice}
    </p>
  ) : null;

  const otpScreen = ({ heading, sentTo, onSubmit }) => (
    <form onSubmit={onSubmit} style={{ padding: '28px 32px 32px' }}>
      <div style={{ textAlign: 'center', marginBottom: 22 }}>
        <div className="success-panel-icon" style={{ background: 'rgba(79,138,254,0.15)', color: 'var(--c-blue)' }}><Mail size={26} /></div>
        <h3 className="display display-sm" style={{ margin: '14px 0 8px' }}>{heading}</h3>
        <p className="muted" style={{ fontSize: 14 }}>We sent a 6-digit code to <strong style={{ color: 'var(--c-text)' }}>{sentTo}</strong>. Enter it below.</p>
      </div>
      {noticeBlock}
      <div className="field">
        <label className="field-label">Verification code</label>
        <input
          className="field-input" inputMode="numeric" maxLength={6} autoFocus
          value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setNotice(''); }}
          placeholder="••••••" style={{ textAlign: 'center', letterSpacing: '0.4em', fontSize: 22, fontFamily: 'var(--f-mono)' }}
        />
      </div>
      <button className="btn btn-primary btn-lg w-full" disabled={busy} style={{ marginTop: 20 }}>
        {busy ? <span className="spinner" /> : <>Verify <ArrowRight size={16} /></>}
      </button>
      <p className="faint" style={{ textAlign: 'center', fontSize: 12, marginTop: 14 }}>Code expires in 10 minutes · check your spam folder.</p>
    </form>
  );

  const statusRow = ({ label, value, ok }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--c-ink-0)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-md)' }}>
      <div>
        <p className="field-label" style={{ marginBottom: 3 }}>{label}</p>
        <p style={{ fontSize: 14, color: 'var(--c-text)' }}>{value || '—'}</p>
      </div>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'var(--f-mono)', color: ok ? 'var(--c-success)' : 'var(--c-muted)' }}>
        {ok ? <><CheckCircle2 size={14} /> Verified</> : <><Clock size={14} /> Pending</>}
      </span>
    </div>
  );

  if (mode === 'register' && !hack) return null;

  return (
    <Modal open={open} onClose={close} wide>
      {/* ---------- REGISTER FORM ---------- */}
      {step === 'form' && (
        <div>
          {header({ eyebrow: `Register · Team of ${TEAM_SIZE}`, sub: hack?.tagline })}
          {hack?.stages && (
            <div style={{ padding: '18px 32px 0' }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {hack.stages.map((s) => (
                  <div key={s.n} style={{ flex: 1, minWidth: 100, padding: '12px 14px', background: 'var(--c-ink-0)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-md)' }}>
                    <p className="mono" style={{ fontSize: 10, color: 'var(--c-faint)', marginBottom: 4 }}>{s.n} · {s.time}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text)' }}>{s.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <form onSubmit={submitRegister} style={{ padding: '28px 32px 32px' }}>
            {noticeBlock}
            <div style={{ display: 'grid', gap: 14, gridTemplateColumns: '1fr 1fr' }} className="hm-grid">
              <div className={`field ${errors.college_id ? 'field-error' : ''}`}>
                <label className="field-label">College *</label>
                <select className="field-select" value={data.college_id} onChange={(e) => update('college_id', e.target.value)}>
                  <option value="">Select your college…</option>
                  {colleges.map((c) => <option key={c.id} value={c.id}>{c.college_name}</option>)}
                </select>
                {errors.college_id && <p className="field-error-msg"><AlertCircle size={12} /> {errors.college_id}</p>}
              </div>
              <div className={`field ${errors.team_name ? 'field-error' : ''}`}>
                <label className="field-label">Team name *</label>
                <input className="field-input" value={data.team_name} onChange={(e) => update('team_name', e.target.value)} placeholder="Your team name" />
                {errors.team_name && <p className="field-error-msg"><AlertCircle size={12} /> {errors.team_name}</p>}
              </div>
              <div className={`field ${errors.team_leader_name ? 'field-error' : ''}`}>
                <label className="field-label">Team leader · Name *</label>
                <input className="field-input" value={data.team_leader_name} onChange={(e) => update('team_leader_name', e.target.value)} placeholder="Leader's full name" />
                {errors.team_leader_name && <p className="field-error-msg"><AlertCircle size={12} /> {errors.team_leader_name}</p>}
              </div>
              <div className={`field ${errors.team_leader_email ? 'field-error' : ''}`}>
                <label className="field-label">Leader · Email *</label>
                <input className="field-input" type="email" value={data.team_leader_email} onChange={(e) => update('team_leader_email', e.target.value)} placeholder="leader@email.com" />
                {errors.team_leader_email && <p className="field-error-msg"><AlertCircle size={12} /> {errors.team_leader_email}</p>}
              </div>
              <div className={`field ${errors.phone ? 'field-error' : ''}`}>
                <label className="field-label">Leader · Phone *</label>
                <input className="field-input" value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 …" />
                {errors.phone && <p className="field-error-msg"><AlertCircle size={12} /> {errors.phone}</p>}
              </div>
            </div>

            {/* Fee */}
            <div style={{ marginTop: 18, padding: 18, background: 'var(--c-ink-2)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--c-muted)', fontFamily: 'var(--f-mono)' }}>
                <span>₹{feePer.toLocaleString('en-IN')} / member × {TEAM_SIZE} members</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--c-border)' }}>
                <span style={{ fontWeight: 600 }}>Total (pay after both verified)</span>
                <span className="display" style={{ fontSize: 26, fontWeight: 600, background: 'var(--grad-signature)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button className="btn btn-primary btn-lg w-full" disabled={busy} style={{ marginTop: 20 }}>
              {busy ? <span className="spinner" /> : <>Register &amp; send OTP <ArrowRight size={16} /></>}
            </button>
            <style>{`@media (max-width: 640px){ .hm-grid{ grid-template-columns:1fr !important; } }`}</style>
          </form>
        </div>
      )}

      {/* ---------- OTP: leader registration ---------- */}
      {step === 'otpLeader' && (<div>{header({ eyebrow: 'Step 2 · Verify leader email' })}{otpScreen({ heading: 'Verify your email', sentTo: leaderEmail, onSubmit: verifyLeader })}</div>)}

      {/* ---------- LOGIN: email ---------- */}
      {step === 'loginEmail' && (
        <div>
          {header({ eyebrow: 'Team login', title: 'Welcome back', sub: 'Log in to manage your team & registration.' })}
          <form onSubmit={sendLoginOtp} style={{ padding: '28px 32px 32px' }}>
            {noticeBlock}
            <div className={`field ${errors.loginEmail ? 'field-error' : ''}`}>
              <label className="field-label">Team leader · Email</label>
              <input className="field-input" type="email" autoFocus value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value); setErrors({}); setNotice(''); }} placeholder="leader@email.com" />
              {errors.loginEmail && <p className="field-error-msg"><AlertCircle size={12} /> {errors.loginEmail}</p>}
            </div>
            <button className="btn btn-primary btn-lg w-full" disabled={busy} style={{ marginTop: 20 }}>
              {busy ? <span className="spinner" /> : <>Send login code <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      )}

      {/* ---------- OTP: login ---------- */}
      {step === 'otpLogin' && (<div>{header({ eyebrow: 'Verify · Login code' })}{otpScreen({ heading: 'Enter login code', sentTo: leaderEmail, onSubmit: verifyLogin })}</div>)}

      {/* ---------- OTP: member ---------- */}
      {step === 'otpMember' && (<div>{header({ eyebrow: 'Verify · Team member' })}{otpScreen({ heading: 'Verify member email', sentTo: member?.email || memberEmail, onSubmit: verifyMember })}</div>)}

      {/* ---------- DASHBOARD ---------- */}
      {step === 'dashboard' && (
        <div>
          {header({ eyebrow: 'Team dashboard', sub: team ? `${members.length + 1}/${TEAM_SIZE} members · ${bothVerified ? 'Team verified' : 'Verification in progress'}` : '' })}
          <div style={{ padding: '26px 32px 32px' }}>
            {noticeBlock}
            {busy && !team ? (
              <div style={{ textAlign: 'center', padding: 30, color: 'var(--c-muted)' }}><span className="spinner" /><p style={{ marginTop: 8 }}>Loading…</p></div>
            ) : (
              <>
                <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
                  {statusRow({ label: 'Team leader', value: team?.team_leader_email || leaderEmail, ok: leaderVerified })}
                  {member
                    ? statusRow({ label: 'Member 2', value: member.email, ok: memberVerified })
                    : <div style={{ padding: '14px 16px', background: 'var(--c-ink-0)', border: '1px dashed var(--c-border-strong)', borderRadius: 'var(--r-md)', color: 'var(--c-muted)', fontSize: 13 }}>Member 2 not added yet.</div>}
                </div>

                {/* Add member 2 */}
                {!member && (
                  <form onSubmit={addMember} style={{ marginBottom: 20 }}>
                    <div className={`field ${errors.memberEmail ? 'field-error' : ''}`}>
                      <label className="field-label">Add member 2 · Email</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input className="field-input" type="email" value={memberEmail} onChange={(e) => { setMemberEmail(e.target.value); setErrors({}); setNotice(''); }} placeholder="teammate@email.com" style={{ flex: 1 }} />
                        <button className="btn btn-primary" disabled={busy}>{busy ? <span className="spinner" /> : 'Verify'}</button>
                      </div>
                      {errors.memberEmail && <p className="field-error-msg"><AlertCircle size={12} /> {errors.memberEmail}</p>}
                    </div>
                  </form>
                )}

                {/* Member added but not verified */}
                {member && !memberVerified && (
                  <button className="btn btn-primary w-full" style={{ marginBottom: 20 }} onClick={() => { setMemberId(member.id); setOtp(''); setNotice(''); setStep('otpMember'); }}>
                    Enter member verification code <ArrowRight size={15} />
                  </button>
                )}

                {/* Both verified → pay */}
                {bothVerified && (
                  <div style={{ padding: 20, background: 'rgba(6,214,160,0.08)', border: '1px solid var(--c-success)', borderRadius: 'var(--r-md)', marginBottom: 18 }}>
                    <p style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--c-success)', fontFamily: 'var(--f-mono)', fontSize: 13, marginBottom: 14 }}>
                      <ShieldCheck size={16} /> Team verified — both members confirmed
                    </p>
                    {paid ? (
                      <p style={{ color: 'var(--c-success)', fontWeight: 600 }}><CheckCircle2 size={16} style={{ verticalAlign: 'middle' }} /> Payment complete</p>
                    ) : (
                      <>
                        {/* Coupon */}
                        <div style={{ marginBottom: 14 }}>
                          <label className="field-label" style={{ marginBottom: 6, display: 'block' }}>Coupon code <span className="faint">(optional)</span></label>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <input
                              className="field-input" value={coupon}
                              onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponApplied(null); setCouponMsg(''); }}
                              placeholder="e.g. HACK20" style={{ flex: 1, textTransform: 'uppercase' }}
                            />
                            <button type="button" className="btn btn-sm" onClick={applyCoupon} disabled={!coupon.trim()}>Verify</button>
                          </div>
                          {couponMsg && <p style={{ marginTop: 6, fontSize: 12, fontFamily: 'var(--f-mono)', color: couponApplied ? 'var(--c-success)' : 'var(--c-danger)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {couponApplied ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}{couponMsg}
                          </p>}
                        </div>
                        {/* Price breakdown */}
                        <div style={{ marginBottom: 14, fontSize: 13, fontFamily: 'var(--f-mono)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--c-muted)' }}><span>Base</span><span>₹{baseTotal.toLocaleString('en-IN')}</span></div>
                          {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--c-success)' }}><span>Discount</span><span>− ₹{discount.toLocaleString('en-IN')}</span></div>}
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--c-text)', paddingTop: 6, borderTop: '1px solid var(--c-border)' }}><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
                        </div>
                        <button className="btn btn-primary btn-lg w-full" disabled={busy} onClick={async () => {
                          setBusy(true);
                          await apiRequest(HACKATHON_API.payHackathon, {
                            method: 'POST',
                            token,
                            body: { team_id: teamId, amount: total, email: leaderEmail },
                          });
                          setBusy(false);
                          setNotice('Payment recorded. Replace HACKATHON_API.payHackathon with your real gateway endpoint.');
                        }}>
                          {busy ? <span className="spinner" /> : <><CreditCard size={17} /> Pay ₹{total.toLocaleString('en-IN')}</>}
                        </button>
                      </>
                    )}
                  </div>
                )}

                <button className="btn btn-ghost btn-sm" onClick={logout} style={{ color: 'var(--c-muted)' }}><LogOut size={14} /> Log out</button>
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
