import React from 'react';
import { Award, User, Sparkles } from 'lucide-react';

export default function PmaInfoSection() {
  return (
    <footer className="widget pma-attribution-widget" role="contentinfo">
      <div className="pma-bento-split">
        {/* Candidate Box */}
        <div className="pma-candidate-card">
          <div className="widget-header">
            <User size={14} strokeWidth={1.5} color="var(--blue)" />
            <span className="widget-label">Candidate Attribution</span>
          </div>
          <div className="candidate-name-plate">
            <h4 className="candidate-full-name">[YOUR NAME]</h4>
            <p className="candidate-assessment-role">
              AI Engineer Intern Assessment • Travel Weather Planner
            </p>
          </div>
        </div>

        {/* PM Accelerator Info */}
        <div className="pma-org-card">
          <div className="widget-header">
            <Award size={14} strokeWidth={1.5} color="var(--orange)" />
            <span className="widget-label">Product Manager Accelerator (PM Accelerator)</span>
          </div>
          <div className="pma-description-well">
            {/* OFFICIAL PM ACCELERATOR DESCRIPTION PLACEHOLDER */}
            <p className="pma-description-text">
              [PASTE OFFICIAL PM ACCELERATOR DESCRIPTION HERE]
            </p>
          </div>
        </div>
      </div>

      <div className="pma-meta-footer">
        <div className="pma-stack-pill">
          <Sparkles size={12} strokeWidth={1.5} color="var(--blue-2)" />
          <span>React (Vite) + FastAPI + Open-Meteo + SQLite</span>
        </div>
        <div className="pma-copyright-text">
          Travel Weather Planner • Crafted with Apple HIG Design Principles
        </div>
      </div>
    </footer>
  );
}
