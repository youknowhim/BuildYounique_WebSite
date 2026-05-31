import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useEscape, useLockBody } from '../hooks.js';

export default function Modal({ open, onClose, children, wide = false, ariaLabel = 'Modal' }) {
  useEscape(() => { if (open) onClose(); });
  useLockBody(open);

  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={ariaLabel}>
      <div className={`modal-shell ${wide ? 'wide' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}