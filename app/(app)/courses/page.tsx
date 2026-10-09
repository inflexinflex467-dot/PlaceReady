import { ComingSoon } from "../components/coming-soon";

export const instant = false;

export default function CoursesPage() {
  return (
    <ComingSoon
      title="Placement Courses & Notes"
      icon="school"
      category="Learning Library • Coming Soon"
      description="Access bite-sized topic breakdowns, DSA theory cheat sheets, and company-targeted crash course modules curated by campus placement alumni."
      highlights={[
        "DSA & System Design visual concept notes",
        "Top 200 Quantitative Aptitude formula books",
        "Core CS fundamentals (OS, CN, DBMS, SQL)",
        "Company-specific fast-track crash modules",
      ]}
    />
  );
}
