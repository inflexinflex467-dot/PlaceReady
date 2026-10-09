import { ComingSoon } from "../components/coming-soon";

export const instant = false;

export default function LeaderboardPage() {
  return (
    <ComingSoon
      title="Campus Placement Leaderboard"
      icon="leaderboard"
      category="Rankings & Analytics • Coming Soon"
      description="Track peer consistency benchmarks, weekly test percentiles, and batch standings to stay motivated throughout the placement drive season."
      highlights={[
        "College batch & departmental leaderboards",
        "Weekly consistency & problem-solving streaks",
        "Mock test percentile distribution curves",
        "Badges & placement readiness certificates",
      ]}
    />
  );
}
