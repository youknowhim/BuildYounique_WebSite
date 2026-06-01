import { useState, useEffect } from 'react';
import { CLIENTS } from '../data.js';
import { useCarousel } from '../hooks.js';

export default function ClientsCarousel() {
  const { index, go, pause, resume } = useCarousel(CLIENTS.length, { interval: 2500 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 720);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Build the displayed window. Desktop: prev, current, next (3 cards). Mobile: just current.
const positions = isMobile
  ? [{ client: CLIENTS[index], pos: 'center', key: 'center' }]
  : [
      { client: CLIENTS[(index - 1 + CLIENTS.length) % CLIENTS.length], pos: 'side',   key: 'left' },
      { client: CLIENTS[index],                                          pos: 'center', key: 'center' },
      { client: CLIENTS[(index + 1) % CLIENTS.length],                    pos: 'side',   key: 'right' },
    ];

  return (
    <div onMouseEnter={pause} onMouseLeave={resume}>
      <div className="clients-track" style={{ justifyContent: 'center' }}>
        {positions.map(({ client, pos, key }) => (
          <div
            key={key}
            className={`client-card ${pos === 'center' ? 'is-center' : 'is-side'}`}
            
          >
            {client.src ? (
              <img src={client.src} alt={client.name} onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <div className="client-card-fallback">
                {client.name}
                <small>{client.tag}</small>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="carousel-dots" role="tablist" aria-label="Clients carousel">
        {CLIENTS.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === index ? 'active' : ''}`}
            onClick={() => go(i)}
            aria-label={`Go to client ${i + 1}`}
            aria-selected={i === index}
          />
        ))}
      </div>
    </div>
  );
}
