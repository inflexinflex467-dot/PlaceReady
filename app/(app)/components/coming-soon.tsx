import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ComingSoonProps {
  title: string;
  icon: string;
  category?: string;
  description: string;
  highlights?: string[];
}

export function ComingSoon({
  title,
  icon,
  category = "Coming Soon • In Active Development",
  description,
  highlights = [],
}: ComingSoonProps) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full my-auto">
      <div className="w-full rounded-2xl bg-surface-container-lowest border border-surface-container p-6 sm:p-10 shadow-sm flex flex-col items-center text-center">
        {/* Brandmark Icon with Ambient Glow */}
        <div className="relative mb-6">
          <div className="absolute -inset-2 bg-primary/10 rounded-full blur-xl pointer-events-none" />
          <div className="relative w-20 h-20 rounded-3xl bg-surface-container flex items-center justify-center text-primary shadow-xs">
            <span
              className="material-symbols-outlined text-[42px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {icon}
            </span>
          </div>
        </div>

        {/* Category Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold mb-3 shadow-xs">
          <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
          <span>{category}</span>
        </div>

        {/* Title */}
        <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight mb-2">
          {title}
        </h1>

        {/* Description */}
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md leading-relaxed mb-6">
          {description}
        </p>

        {/* Planned Features Highlight Pills */}
        {highlights.length > 0 && (
          <div className="w-full max-w-lg mb-8 pt-4 border-t border-surface-container">
            <span className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
              Planned Capabilities
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface font-medium border border-surface-container/60"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary shrink-0">
                    check_circle
                  </span>
                  <span className="truncate">{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to Dashboard CTA */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="default"
              className="w-full sm:w-auto gap-2 bg-primary text-on-primary hover:bg-primary-container cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              <span>Back to Dashboard</span>
            </Button>
          </Link>
          <Link href="/tests" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto gap-2 border-outline-variant/60 cursor-pointer font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">
                notifications_active
              </span>
              <span>Notify Me on Launch</span>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
