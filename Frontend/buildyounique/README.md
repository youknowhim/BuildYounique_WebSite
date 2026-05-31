# Buildyounique — Studio Website

Software Development Studio · Est. 2020 · Howrah, West Bengal

## Stack

- **React 18** + **Vite**
- **lucide-react** for icons
- Custom CSS design system (no Tailwind, no shadcn) — distinctive, hand-crafted feel
- State-based routing (no react-router)

## Setup

```bash
npm install
npm run dev      # development server at http://localhost:5173
npm run build    # production build
npm run preview  # preview production build
```

## Project structure

```
src/
├── App.jsx                # Root component + page router
├── main.jsx               # React entry
├── index.css              # Design tokens, base styles, animations, utilities
│
├── config.js              # API_ENDPOINTS + apiCall + ASSETS (swap image URLs here)
├── data.js                # All static data (services, courses, jobs, team, etc.)
├── hooks.js               # Custom hooks (useReveal, useCountdown, useCarousel, etc.)
├── validators.js          # Validation rules + V helper
│
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── PageShell.jsx
│   ├── Modal.jsx
│   ├── ClientsCarousel.jsx
│   ├── Countdown.jsx
│   ├── DiscountRibbon.jsx
│   └── Floating.jsx       # WhatsApp + chatbot + lead-capture + cookie banner
│
├── modals/
│   ├── CourseModal.jsx
│   ├── HackathonModal.jsx
│   └── BrochureModal.jsx
│
└── pages/
    ├── Home.jsx
    ├── Services.jsx
    ├── Industries.jsx
    ├── Portfolio.jsx
    ├── Proof.jsx
    ├── Training.jsx
    ├── Hackathons.jsx
    ├── Careers.jsx
    ├── Blog.jsx
    ├── About.jsx
    └── Contact.jsx
```

## Where to edit common things

| You want to...                            | Edit                                |
| ----------------------------------------- | ----------------------------------- |
| Change a backend URL                      | `src/config.js` → `API_ENDPOINTS`   |
| Swap a placeholder image for a real one   | `src/config.js` → `ASSETS`          |
| Update job openings                       | `src/data.js` → `JOBS`              |
| Update course details / curriculum        | `src/data.js` → `COURSES`           |
| Update hackathon details                  | `src/data.js` → `HACKATHONS`        |
| Update team members                       | `src/data.js` → `TEAM`              |
| Update client / partner logos             | `src/data.js` → `CLIENTS`, `PARTNERS` |
| Change discount end date                  | `src/config.js` → `DISCOUNT_END`    |
| Change course prices                      | `src/data.js` → `COURSES[i].price`  |

## Replacing placeholder images with real ones

All image URLs are centralised in `src/config.js` under `ASSETS`. When you have real photos:

1. Drop files into `public/assets/clients/`, `public/assets/team/`, etc.
2. Update the matching paths in `ASSETS`. That's it.

Until then, the site uses high-quality Unsplash placeholders that look professional. Every `<img>` has an `onError` fallback so a broken URL never breaks the layout.

## Backend wiring

`src/config.js` exports `apiCall(endpoint, payload)` which currently mocks a 900ms latency. To go live:

1. Fill in real URLs in `API_ENDPOINTS`.
2. Inside `apiCall`, uncomment the real `fetch` block and remove the mock block.

That's the only change needed — every form already calls through this helper.
