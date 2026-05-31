import { Sparkles, ArrowRight } from 'lucide-react';
import Countdown from './Countdown.jsx';
import { COURSE_PRICING } from '../data.js';

export default function DiscountRibbon({ onCTA }) {
  return (
    <div className="discount-ribbon">
      <div className="container">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 18, flexWrap: 'wrap',
          fontFamily: 'var(--f-mono)', fontSize: 13,
        }}>
          <span className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: 'var(--c-warning)' }} />
            <span style={{ color: 'var(--c-text)' }}>Limited time</span>
          </span>
          <span className="faint">·</span>
          <span style={{ color: 'var(--c-text)' }}>
            {COURSE_PRICING.currency}{COURSE_PRICING.savings.toLocaleString('en-IN')} off all training courses
          </span>
          <span className="faint">·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            ends in <Countdown variant="compact" />
          </span>
          {onCTA && (
            <button onClick={onCTA} className="flex items-center gap-1" style={{
              color: 'var(--c-blue)', fontWeight: 600, fontSize: 13,
            }}>
              See courses <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
