import React from 'react';
import { Award, User, Sparkles } from 'lucide-react';

export default function PmaInfoSection() {
  return (
    <footer className="card pma-info-section">
      <div className="pma-grid">
        <div className="pma-author-box">
          <div className="pma-icon-tag">
            <User size={18} color="#38bdf8" />
            <span className="pma-tag-title">Candidate Attribution</span>
          </div>
          <h4 className="candidate-name">[YOUR NAME]</h4>
          <p className="candidate-role">
            AI Engineer Intern Assessment • Travel Weather Planner
          </p>
        </div>

        <div className="pma-org-box">
          <div className="pma-icon-tag">
            <Award size={18} color="#f59e0b" />
            <span className="pma-tag-title">Product Manager Accelerator (PM Accelerator)</span>
          </div>
          <div className="pma-description-container">
            {/* OFFICIAL PM ACCELERATOR DESCRIPTION PLACEHOLDER */}
            <p className="pma-official-placeholder">
              [PASTE OFFICIAL PM ACCELERATOR DESCRIPTION HERE]
            </p>
          </div>
        </div>
      </div>

      <div className="pma-footer-bottom">
        <div className="stack-badge">
          <Sparkles size={14} color="#38bdf8" />
          <span>Full-Stack Architecture: React (Vite) + FastAPI + Open-Meteo + SQLite</span>
        </div>
        <div className="copy-notice">
          © {new Date().getFullYear()} Travel Weather Planner • All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
