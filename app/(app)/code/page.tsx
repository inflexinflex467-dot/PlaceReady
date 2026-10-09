import { ComingSoon } from "../components/coming-soon";

export const instant = false;

export default function CodePage() {
  return (
    <ComingSoon
      title="Coding Arena & Drills"
      icon="code"
      category="Coding Module • Coming Soon"
      description="Practice curated Data Structures and Algorithms problems in an online IDE powered by Judge0 with instant multi-language test evaluation."
      highlights={[
        "Multi-language support (C++, Java, Python)",
        "Curated Blind-75 & Placement 100 sets",
        "Judge0 sandboxed test case execution",
        "Time & space complexity benchmarks",
      ]}
    />
  );
}
