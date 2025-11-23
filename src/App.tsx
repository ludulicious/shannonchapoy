
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Privacy from './components/pages/Privacy';
import Terms from './components/pages/Terms';
import MarkdownPage from './components/pages/MarkdownPage';
import OneOnOneLoveCoaching from './components/pages/OneOnOneLoveCoaching';
import ArtOfDatingYourself from './components/pages/ArtOfDatingYourself';
import PjCircle from './components/pages/PjCircle';
import NotFound from './components/pages/NotFound';
import ScrollToTop from './components/ScrollToTop';

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Home />} />
        <Route path="/services" element={<Home />} />
        <Route path="/philosophy" element={<Home />} />
        <Route path="/contact" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/one-on-one-love-coaching" element={<OneOnOneLoveCoaching />} />
        <Route path="/art-of-dating-yourself" element={<ArtOfDatingYourself />} />
        <Route path="/start-your-journey" element={<PjCircle />} />
        <Route path="/markdown/:filename?" element={<MarkdownPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
