import React from 'react';
import ReactDOM from 'react-dom/client';
import Stats3D from './Stats3D';
import './inside-studio.css'; // shares tailwind styles

const rootEl = document.getElementById('3d-stats-root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <Stats3D />
    </React.StrictMode>
  );
}
