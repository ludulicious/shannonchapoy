
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Privacy from './components/pages/Privacy';
import Terms from './components/pages/Terms';
import MarkdownPage from './components/pages/MarkdownPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/markdown/:filename?" element={<MarkdownPage />} />
    </Routes>
  );
};

export default App;
