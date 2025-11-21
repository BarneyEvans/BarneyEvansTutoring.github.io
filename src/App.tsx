import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import PrivateTutoring from './pages/PrivateTutoring';
import PythonCourse from './pages/PythonCourse';
import About from './pages/About';
import ChatWidget from './components/ChatWidget';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
  }, [pathname, hash]);

  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/private-tutoring" element={<PrivateTutoring />} />
            <Route path="/python-course" element={<PythonCourse />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </AnimatePresence>
      </Layout>
      {/* Add ChatWidget here to float above all content */}
      <ChatWidget />
    </HashRouter>
  );
};

export default App;