// ============================================================
// Custom hooks — Buildyounique
// ============================================================
import { useEffect, useRef, useState, useCallback } from 'react';

// --- IntersectionObserver-based reveal -------------------------------
export function useReveal(options = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      options
    );
    io.observe(node);
    return () => io.disconnect();
  }, []); // eslint-disable-line
  return [ref, visible];
}

// --- requestAnimationFrame number counter ----------------------------
export function useCounter(target, { duration = 1600, start = 0, trigger = true } = {}) {
  const [value, setValue] = useState(start);
  useEffect(() => {
    if (!trigger) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // cubic ease-out
      setValue(Math.round(start + (target - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start, trigger]);
  return value;
}

// --- Live countdown to a target date ---------------------------------
export function useCountdown(targetDate) {
  const compute = useCallback(() => {
    const ms = Math.max(0, targetDate.getTime() - Date.now());
    const d = Math.floor(ms / (24 * 3600 * 1000));
    const h = Math.floor((ms % (24 * 3600 * 1000)) / (3600 * 1000));
    const m = Math.floor((ms % (3600 * 1000)) / (60 * 1000));
    const s = Math.floor((ms % (60 * 1000)) / 1000);
    return { days: d, hours: h, minutes: m, seconds: s, expired: ms === 0, totalMs: ms };
  }, [targetDate]);

  const [state, setState] = useState(compute);
  useEffect(() => {
    setState(compute());
    const id = setInterval(() => setState(compute()), 1000);
    return () => clearInterval(id);
  }, [compute]);
  return state;
}

// --- Carousel with auto-rotate ---------------------------------------
export function useCarousel(length, { interval = 2500, autoPlay = true } = {}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = useCallback(() => setIndex((i) => (i + 1) % length), [length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + length) % length), [length]);
  const go = useCallback((i) => setIndex(((i % length) + length) % length), [length]);

  useEffect(() => {
    if (!autoPlay || paused || length < 2) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoPlay, paused, interval, length, next]);

  return { index, next, prev, go, pause: () => setPaused(true), resume: () => setPaused(false) };
}

// --- Escape key listener --------------------------------------------
export function useEscape(handler) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handler(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handler]);
}

// --- Lock body scroll while a modal is open --------------------------
export function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return;
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-w', sw + 'px');
    document.body.classList.add('lock');
    return () => {
      document.body.classList.remove('lock');
      document.documentElement.style.removeProperty('--scrollbar-w');
    };
  }, [locked]);
}

// --- Mouse parallax (relative to viewport center) --------------------
export function useMouseParallax(strength = 20) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let raf;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = ((e.clientX / window.innerWidth) - 0.5) * strength;
        const y = ((e.clientY / window.innerHeight) - 0.5) * strength;
        setOffset({ x, y });
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, [strength]);
  return offset;
}

// --- Scroll position tracker (for navbar condense) -------------------
export function useScrollY(threshold = 30) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return past;
}

// --- Live clock (HH:MM IST) ------------------------------------------
export function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}
