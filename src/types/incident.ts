
export type Severity = "Low" | "Medium" | "High";

export type SortOrder = "newest" | "oldest";

export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: Severity;
  reportedAt: string;
}

export const mockIncidents: Incident[] = [
  {
    id: 1,
    title: "Biased Recommendation Algorithm",
    description: "Algorithm consistently favored certain demographics in job recommendations, leading to unfair advantage for specific groups. Initial investigation suggests training data imbalance.",
    severity: "Medium",
    reportedAt: "2025-03-15T10:00:00Z",
  },
  {
    id: 2,
    title: "LLM Hallucination in Critical Info",
    description: "LLM provided incorrect safety procedure information during emergency response simulation. This poses significant risks in real-world applications.",
    severity: "High",
    reportedAt: "2025-04-01T14:30:00Z",
  },
  {
    id: 3,
    title: "Minor Data Leak via Chatbot",
    description: "Chatbot inadvertently exposed non-sensitive user metadata during conversation. No critical information was compromised.",
    severity: "Low",
    reportedAt: "2025-03-20T09:15:00Z",
  },
];
