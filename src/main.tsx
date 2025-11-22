
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Disable browser's automatic scroll restoration BEFORE rendering
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// Also prevent any initial scroll restoration
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;

const root = createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <App />
  </BrowserRouter>
);
