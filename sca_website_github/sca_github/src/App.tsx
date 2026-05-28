import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import Content from './pages/Content';
import Influencer from './pages/Influencer';
import Web from './pages/Web';
import About from './pages/About';
import Contact from './pages/Contact';
import AboutConcept from './pages/AboutConcept';

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/content" element={<Content />} />
          <Route path="/influencer" element={<Influencer />} />
          <Route path="/web" element={<Web />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about-concept" element={<AboutConcept />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
