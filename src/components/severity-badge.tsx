
import { cn } from "@/lib/utils";
import { Severity } from "@/types/incident";

interface SeverityBadgeProps {
  severity: Severity;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-severity-high/10 text-severity-high": severity === "High",
          "bg-severity-medium/10 text-severity-medium": severity === "Medium",
          "bg-severity-low/10 text-severity-low": severity === "Low",
        }
      )}
    >
      {severity}
    </span>
  );
}
