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
  candidateName: "Marimuthu",
  candidateRole: "AI Engineer Intern Assessment · Travel Weather Planner",
  orgName: "Product Manager Accelerator",
  orgSubtitle: "Product Manager Accelerator",
  orgDescription: "",
  techStack: [
    { name: "React · Vite", color: "var(--sky)" },
    { name: "FastAPI", color: "var(--indigo)" },
    { name: "Open-Meteo", color: "var(--sky)" },
    { name: "SQLite", color: "var(--indigo)" },
  ],
};
