import { ComingSoon } from "../components/coming-soon";

export const instant = false;

export default function InterviewPage() {
  return (
    <ComingSoon
      title="AI Mock Interviews"
      icon="mic"
      category="AI Interview Module • Coming Soon"
      description="Practice real-time technical and behavioral interview rounds with a Gemini-powered interviewer providing speech clarity and conceptual feedback."
      highlights={[
        "Speech-to-speech audio conversational AI",
        "OS, DBMS, OOPs technical deep dives",
        "STAR methodology behavioral questions",
        "Clarity & confidence diagnostic scores",
      ]}
    />
  );
}
