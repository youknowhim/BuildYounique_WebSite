import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { WhatsAppFAB, ChatbotFAB, Chatbot, LeadCapture, CookieBanner } from './components/Floating.jsx';

import BrochureModal from './modals/BrochureModal.jsx';
import CourseModal from './modals/CourseModal.jsx';
import HackathonModal from './modals/HackathonModal.jsx';

import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Industries from './pages/Industries.jsx';
import Portfolio from './pages/Portfolio.jsx';
import WhyUs from './pages/WhyUs.jsx';
import Training from './pages/Training.jsx';
import Hackathons from './pages/Hackathons.jsx';
import Careers from './pages/Careers.jsx';
import Blog from './pages/Blog.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

import { COURSES, HACKATHONS } from './data.js';

export default function App() {
  const [page, setPage] = useState('home');
  const [chatOpen, setChatOpen] = useState(false);
  const [brochureOpen, setBrochureOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeHack, setActiveHack] = useState(null);
  const [teamLoginOpen, setTeamLoginOpen] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [page]);

  // Routing handler. `extra` lets nav dropdowns also open a specific modal.
  function navigate(id, extra = null) {
    setPage(id);
    if (extra?.kind === 'course') {
      const c = COURSES.find((x) => x.id === extra.id);
      if (c) setActiveCourse(c);
    } else if (extra?.kind === 'hackathon') {
      const h = HACKATHONS.find((x) => x.id === extra.id);
      if (h) setActiveHack(h);
    }
  }

  function renderPage() {
    switch (page) {
      case 'services':   return <Services    onNavigate={navigate} />;
      case 'industries': return <Industries  onNavigate={navigate} />;
      case 'portfolio':  return <Portfolio   onNavigate={navigate} />;
      case 'whyus':      return <WhyUs       onNavigate={navigate} />;
      case 'training':   return <Training    onOpenCourse={setActiveCourse} />;
      case 'hackathons': return <Hackathons  onOpenHackathon={setActiveHack} onTeamLogin={() => setTeamLoginOpen(true)} />;
      case 'careers':    return <Careers     onNavigate={navigate} />;
      case 'blog':       return <Blog        onNavigate={navigate} />;
      case 'about':      return <About       onNavigate={navigate} />;
      case 'contact':    return <Contact     onNavigate={navigate} />;
      case 'home':
      default:           return <Home        onNavigate={navigate} onOpenCourse={setActiveCourse} />;
    }
  }

  return (
    <>
      <div className="bg-atmosphere" />
      <div className="bg-hex" />
      <div className="bg-grain" />

      <Navbar page={page} onNavigate={navigate} onTeamLogin={() => setTeamLoginOpen(true)} />

      <main>
        {renderPage()}
      </main>

      <Footer
        onNavigate={navigate}
        onOpenBrochure={() => setBrochureOpen(true)}
      />

      <div className="fab-stack">
        <ChatbotFAB onClick={() => setChatOpen((v) => !v)} />
        <WhatsAppFAB />
      </div>
      <Chatbot open={chatOpen} onClose={() => setChatOpen(false)} />
      <LeadCapture onNavigate={navigate} />
      <CookieBanner />

      <BrochureModal open={brochureOpen} onClose={() => setBrochureOpen(false)} />
      <CourseModal
        course={activeCourse}
        open={!!activeCourse}
        onClose={() => setActiveCourse(null)}
      />
      <HackathonModal
        mode="register"
        hack={activeHack}
        open={!!activeHack}
        onClose={() => setActiveHack(null)}
      />
      <HackathonModal
        mode="login"
        hack={null}
        open={teamLoginOpen}
        onClose={() => setTeamLoginOpen(false)}
      />
    </>
  );
}
