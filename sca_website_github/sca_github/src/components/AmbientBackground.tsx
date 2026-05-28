import React from 'react';

export default function AmbientBackground() {
  return (
    <div className="global-ambient-bg" aria-hidden="true">
      <div className="ambient-blob ab1"></div>
      <div className="ambient-blob ab2"></div>
      <div className="ambient-blob ab3"></div>
      <div className="ambient-blob ab4"></div>
      <div className="grid-overlay"></div>
      <div className="grain-overlay"></div>
    </div>
  );
}
