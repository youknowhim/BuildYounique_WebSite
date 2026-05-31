// ============================================================
// Form validation — reusable rules
// Usage:
//   const errors = runValidation(data, {
//     name:  [V.required('Name is required'), V.minLen(2)],
//     email: [V.required(), V.email()],
//   });
//   if (Object.keys(errors).length) { setErrors(errors); return; }
// ============================================================

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE   = /^https?:\/\/[^\s]+\.[^\s]{2,}$/i;
const PHONE_RE = /^[+\d][\d\s\-()]{7,}\d$/;

export const V = {
  required: (msg = 'This field is required') => (val) =>
    val === undefined || val === null || (typeof val === 'string' && val.trim() === '') || (Array.isArray(val) && val.length === 0)
      ? msg
      : null,

  email: (msg = 'Enter a valid email') => (val) =>
    val && !EMAIL_RE.test(String(val).trim()) ? msg : null,

  phone: (msg = 'Enter a valid phone number') => (val) =>
    val && !PHONE_RE.test(String(val).trim()) ? msg : null,

  minLen: (n, msg) => (val) =>
    val && String(val).trim().length < n
      ? (msg || `Must be at least ${n} characters`)
      : null,

  url: (msg = 'Enter a valid URL (http:// or https://)') => (val) =>
    val && !URL_RE.test(String(val).trim()) ? msg : null,

  fileRequired: (msg = 'Please attach a file') => (val) =>
    !val || !val.name ? msg : null,

  fileType: (extensions, msg) => (val) => {
    if (!val || !val.name) return null;
    const ext = val.name.split('.').pop().toLowerCase();
    return extensions.includes(ext) ? null : (msg || `Only ${extensions.join(', ')} allowed`);
  },

  fileMaxSize: (maxMB, msg) => (val) => {
    if (!val || !val.size) return null;
    return val.size > maxMB * 1024 * 1024
      ? (msg || `File must be under ${maxMB}MB`)
      : null;
  },

  differentFrom: (otherFieldName, msg = 'Must be different') => (val, data) =>
    val && data && data[otherFieldName] && val.trim().toLowerCase() === String(data[otherFieldName]).trim().toLowerCase()
      ? msg
      : null,
};

// Run a validation map against a data object — returns { fieldName: errorMsg }
export function runValidation(data, rules) {
  const errors = {};
  for (const [field, validators] of Object.entries(rules)) {
    for (const v of validators) {
      const err = v(data[field], data);
      if (err) { errors[field] = err; break; }
    }
  }
  return errors;
}
