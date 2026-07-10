import React from 'react';
import { createRoot } from 'react-dom/client';
import { PurposeSection } from '../components/PurposeSection';

const rootEl = document.getElementById('purpose-react-root');
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <PurposeSection />
    </React.StrictMode>
  );
}
