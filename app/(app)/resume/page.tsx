import { ComingSoon } from "../components/coming-soon";

export const instant = false;

export default function ResumePage() {
  return (
    <ComingSoon
      title="ATS Resume Builder"
      icon="description"
      category="Career Tools • Coming Soon"
      description="Craft recruiter-approved tech resumes with AI bullet point enhancers, automated ATS keyword matching, and single-click PDF exports."
      highlights={[
        "Single-page tech resume templates",
        "Job description ATS keyword analyzer",
        "Action verb & metric bullet point generator",
        "Export to ATS-friendly PDF & JSON format",
      ]}
    />
  );
}
