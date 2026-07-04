import React from 'react';
import { createRoot } from 'react-dom/client';
import { PurposeSection } from '../components/PurposeSection';
import { ValuesSection } from '../components/ValuesSection';

const purposeRoot = document.getElementById('purpose-react-root');
if (purposeRoot) {
  createRoot(purposeRoot).render(
    <React.StrictMode>
      <PurposeSection />
    </React.StrictMode>
  );
}

const valuesRoot = document.getElementById('values-react-root');
if (valuesRoot) {
  createRoot(valuesRoot).render(
    <React.StrictMode>
      <ValuesSection />
    </React.StrictMode>
  );
}
