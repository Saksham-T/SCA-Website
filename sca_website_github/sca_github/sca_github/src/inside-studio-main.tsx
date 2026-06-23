import React from 'react';
import ReactDOM from 'react-dom/client';
import InsideStudio from './InsideStudio';
import './inside-studio.css';

const rootEl = document.getElementById('inside-the-studio-root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <InsideStudio />
    </React.StrictMode>
  );
}
