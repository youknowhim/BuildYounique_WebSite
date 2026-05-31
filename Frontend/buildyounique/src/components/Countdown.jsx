import { useCountdown } from '../hooks.js';
import { DISCOUNT_END } from '../config.js';

function pad(n) { return String(n).padStart(2, '0'); }

export default function Countdown({ variant = 'full', target = DISCOUNT_END, label = 'Discount ends in' }) {
  const { days, hours, minutes, seconds, expired } = useCountdown(target);
  if (expired) return null;

  if (variant === 'compact') {
    return (
      <span className="mono" style={{ fontSize: 13, color: 'var(--c-text)' }}>
        {days}d {pad(hours)}h {pad(minutes)}m
      </span>
    );
  }

  if (variant === 'pill') {
    return (
      <span className="pill pill-success mono" style={{ fontFeatureSettings: '"tnum" 1' }}>
        {days}d {pad(hours)}h left
      </span>
    );
  }

  return (
    <div>
      <p className="eyebrow no-line" style={{ marginBottom: 12, color: 'var(--c-faint)' }}>{label}</p>
      <div className="countdown">
        <div className="countdown-unit">
          <span className="countdown-value">{pad(days)}</span>
          <span className="countdown-label">Days</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-unit">
          <span className="countdown-value">{pad(hours)}</span>
          <span className="countdown-label">Hours</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-unit">
          <span className="countdown-value">{pad(minutes)}</span>
          <span className="countdown-label">Mins</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-unit">
          <span className="countdown-value">{pad(seconds)}</span>
          <span className="countdown-label">Secs</span>
        </div>
      </div>
    </div>
  );
}
