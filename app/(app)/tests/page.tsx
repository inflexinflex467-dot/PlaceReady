import { ComingSoon } from "../components/coming-soon";

export const instant = false;

export default function TestsPage() {
  return (
    <ComingSoon
      title="Mock Tests & Proctored Drives"
      icon="assignment"
      category="Assessment Module • Coming Soon"
      description="Full-length campus recruitment drives modeled after TCS NQT, Infosys, and Amazon with live proctoring and automated scorecards are arriving soon."
      highlights={[
        "TCS NQT & Wipro mock assessments",
        "Adaptive sectional timers & scoring",
        "Automated AI proctoring & integrity",
        "Comprehensive diagnosis & solutions",
      ]}
    />
  );
}
