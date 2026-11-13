import React from 'react';
import { User, Award, Edit2 } from 'lucide-react';
import { attributionConfig } from '../config/attribution';

function isPlaceholderText(val) {
  if (!val || typeof val !== 'string' || !val.trim()) return true;
  const lower = val.trim().toLowerCase();
  return (
    lower.includes('[your name]') ||
    lower.includes('[paste official') ||
    (val.includes('[') && val.includes(']'))
  );
}

export default function PmaInfoSection() {
  const hasName = !isPlaceholderText(attributionConfig.candidateName);
  const hasDesc = !isPlaceholderText(attributionConfig.orgDescription);

  return (
    <footer className="widget about-attribution-widget" role="contentinfo" aria-label="About and Attribution">
      <div className="about-bento-columns">
        {/* Left Column: Candidate */}
        <div className="about-column candidate-column">
          <div className="widget-header">
            <User size={15} strokeWidth={1.5} color="var(--blue)" />
            <span className="widget-label">Candidate</span>
          </div>

          <div className="candidate-body">
            {hasName ? (
              <h4 className="candidate-heading">{attributionConfig.candidateName}</h4>
            ) : (
              <div className="dashed-placeholder-box" title="Configure candidate name in src/config/attribution.ts">
                <Edit2 size={13} strokeWidth={1.5} />
                <span>Add your name</span>
              </div>
            )}
            <p className="candidate-sub-role">{attributionConfig.candidateRole}</p>
          </div>
        </div>

        {/* Right Column: PM Accelerator */}
        <div className="about-column org-column">
          <div className="widget-header">
            <Award size={15} strokeWidth={1.5} color="var(--orange)" />
            <span className="widget-label">{attributionConfig.orgSubtitle || 'Organization'}</span>
          </div>

          {hasDesc ? (
            <div className="org-inset-panel">
              <p className="org-description-body">{attributionConfig.orgDescription}</p>
            </div>
          ) : (
            <div className="candidate-body">
              <h4 className="candidate-heading">{attributionConfig.orgName}</h4>
              <p className="candidate-sub-role">AI &amp; Product Leadership Assessment</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Row: Separated by 1px Hairline */}
      <div className="about-hairline-footer">
        <div className="stack-chips-group" aria-label="Technology Stack">
          {attributionConfig.techStack.map((tech) => (
            <div key={tech.name} className="tech-pill-chip">
              <span className="tech-chip-dot" style={{ backgroundColor: tech.color }} />
              <span className="tech-chip-label">{tech.name}</span>
            </div>
          ))}
        </div>

        <div className="about-copyright-note">
          Travel Weather Planner • Continuous Apple HIG Design System
        </div>
      </div>
    </footer>
  );
}
