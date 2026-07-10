import React from 'react';
import { createRoot } from 'react-dom/client';
import { ValuesSection } from '../components/ValuesSection';

const rootEl = document.getElementById('values-react-root');
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <ValuesSection />
    </React.StrictMode>
  );
}
