export interface TechStackItem {
  name: string;
  color: string;
}

export interface AttributionConfig {
  candidateName: string;
  candidateRole: string;
  orgName: string;
  orgSubtitle: string;
  orgDescription: string;
  techStack: TechStackItem[];
}

export const attributionConfig: AttributionConfig = {
  // If empty or placeholder '[YOUR NAME]', UI will display a subtle dashed 'Add your name' state
  candidateName: "",
  candidateRole: "AI Engineer Intern Assessment · Travel Weather Planner",
  orgName: "Product Manager Accelerator",
  orgSubtitle: "PM Accelerator",
  // If empty or placeholder, UI will display a subtle dashed 'Add description' state
  orgDescription: "",
  techStack: [
    { name: "React · Vite", color: "var(--sky)" },
    { name: "FastAPI", color: "var(--indigo)" },
    { name: "Open-Meteo", color: "var(--sky)" },
    { name: "SQLite", color: "var(--indigo)" },
  ],
};
