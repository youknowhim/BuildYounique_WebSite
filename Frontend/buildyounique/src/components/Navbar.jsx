import { useState } from 'react';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { NAV } from '../data.js';
import { useScrollY, useLockBody } from '../hooks.js';

export default function Navbar({ page, onNavigate }) {
  const scrolled = useScrollY(30);
  const [drawer, setDrawer] = useState(false);
  const [expanded, setExpanded] = useState(null);
  useLockBody(drawer);

  const go = (id, extra = null) => {
    onNavigate(id, extra);
    setDrawer(false);
    setExpanded(null);
  };

  // Map child item kind from parent id (training → course, hackathons → hackathon, industries → none)
  const childKind = (parentId) => (parentId === 'training' ? 'course' : parentId === 'hackathons' ? 'hackathon' : null);

  const primary = NAV.slice(0, 8);

  return (
    <header className={`nav-root ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-inner">
          <button className="logo" onClick={() => go('home')} aria-label="Buildyounique home">
            <img src="/logos/brand.png" alt="" className="logo-img" onError={(e) => { e.target.style.display = 'none'; }} />
            <span>Buildyounique</span>
          </button>

          <nav className="nav-links" aria-label="Primary">
            {primary.map((n) =>
              n.children ? (
                <div key={n.id} className="nav-link-wrap">
                  <button
                    className={`nav-link ${page === n.id ? 'active' : ''}`}
                    onClick={() => go(n.id)}
                    aria-haspopup="true"
                  >
                    {n.label}
                  </button>
                  <div className={`nav-dropdown ${n.wide ? 'wide' : ''}`} role="menu">
                    {n.wide ? (
                      <>
                        <div className="nav-dropdown-grid">
                          {n.children.map((c) => (
                            <button
                              key={c.id}
                              className="nav-dropdown-item"
                              onClick={() => go(n.id)}
                              role="menuitem"
                            >
                              {c.label}
                            </button>
                          ))}
                        </div>
                        <button
                          className="nav-dropdown-item"
                          onClick={() => go(n.id)}
                          style={{ color: 'var(--c-blue)', borderTop: '1px solid var(--c-border)', marginTop: 10, paddingTop: 12 }}
                        >
                          See all {n.children.length} industries →
                        </button>
                      </>
                    ) : (
                      <>
                        {n.children.map((c) => {
                          const kind = childKind(n.id);
                          return (
                            <button
                              key={c.id}
                              className="nav-dropdown-item"
                              onClick={() => go(n.id, kind ? { kind, id: c.id } : null)}
                              role="menuitem"
                            >
                              {c.label}
                              {c.sub && <small>{c.sub}</small>}
                            </button>
                          );
                        })}
                        <button
                          className="nav-dropdown-item"
                          onClick={() => go(n.id)}
                          style={{ color: 'var(--c-blue)', borderTop: '1px solid var(--c-border)', marginTop: 6, paddingTop: 14 }}
                        >
                          See all {n.label.toLowerCase()} →
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  key={n.id}
                  className={`nav-link ${page === n.id ? 'active' : ''}`}
                  onClick={() => go(n.id)}
                >
                  {n.label}
                </button>
              )
            )}
          </nav>

          <div className="flex items-center gap-3 nav-cta-wrap">
            <button className="nav-link" onClick={() => go('about')}>About</button>
            <button className="btn btn-primary btn-sm" onClick={() => go('contact')}>
              Start a project <ArrowRight size={15} />
            </button>
          </div>

          <button className="nav-toggle" onClick={() => setDrawer(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </div>

      {drawer && (
        <div className="nav-drawer" role="dialog" aria-modal="true">
          <button
            className="nav-toggle"
            onClick={() => setDrawer(false)}
            aria-label="Close menu"
            style={{ position: 'fixed', top: 16, right: 16, zIndex: 5 }}
          >
            <X size={22} />
          </button>
          {NAV.map((n) =>
            n.children ? (
              <div key={n.id}>
                <button
                  className={`nav-drawer-link ${page === n.id ? 'active' : ''}`}
                  onClick={() => setExpanded(expanded === n.id ? null : n.id)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
                >
                  <span>{n.label}</span>
                  <ChevronDown
                    size={18}
                    style={{ transition: 'transform 200ms', transform: expanded === n.id ? 'rotate(180deg)' : 'rotate(0)' }}
                  />
                </button>
                {expanded === n.id && (
                  <div className="nav-drawer-sub">
                    <button
                      className="nav-drawer-sub-link"
                      onClick={() => go(n.id)}
                      style={{ color: 'var(--c-blue)', fontWeight: 600 }}
                    >
                      See all {n.label.toLowerCase()} →
                    </button>
                    {n.children.map((c) => {
                      const kind = childKind(n.id);
                      return (
                        <button
                          key={c.id}
                          className="nav-drawer-sub-link"
                          onClick={() => go(n.id, kind ? { kind, id: c.id } : null)}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={n.id}
                className={`nav-drawer-link ${page === n.id ? 'active' : ''}`}
                onClick={() => go(n.id)}
              >
                {n.label}
              </button>
            )
          )}
          <div style={{ marginTop: 32 }}>
            <button className="btn btn-primary" onClick={() => go('contact')}>
              Start a project <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
