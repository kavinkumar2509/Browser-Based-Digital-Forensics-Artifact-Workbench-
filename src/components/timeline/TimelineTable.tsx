import { useMemo, useState, type FC } from "react";
import type { RiskLevel } from "./RiskBadge";
import TimelineRow, { type TimelineEntry } from "./TimelineRow";

interface TimelineTableProps {
  entries: TimelineEntry[];
  loading?: boolean;
  emptyMessage?: string;
}

const riskFilters: Array<{ value: "all" | RiskLevel; label: string }> = [
  { value: "all", label: "All risks" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "moderate", label: "Moderate" },
  { value: "low", label: "Low" },
];

const getTimestamp = (timestamp: TimelineEntry["timestamp"]): number => {
  const value = timestamp instanceof Date ? timestamp.getTime() : new Date(timestamp).getTime();
  return Number.isNaN(value) ? 0 : value;
};

const TimelineTable: FC<TimelineTableProps> = ({
  entries,
  loading = false,
  emptyMessage = "No events yet",
}) => {
  const [riskFilter, setRiskFilter] = useState<"all" | RiskLevel>("all");

  const visibleEntries = useMemo(
    () =>
      entries
        .filter((entry) => riskFilter === "all" || entry.riskLevel === riskFilter)
        .slice()
        .sort((first, second) => getTimestamp(second.timestamp) - getTimestamp(first.timestamp)),
    [entries, riskFilter],
  );

  return (
    <section className="overflow-hidden rounded-md border border-slate-800 bg-slate-900/50">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <h2 className="font-mono text-sm font-semibold text-slate-100">Event Timeline</h2>
        <label className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="sr-only">Filter by risk level</span>
          <select
            value={riskFilter}
            onChange={(event) => setRiskFilter(event.target.value as "all" | RiskLevel)}
            className="rounded-md border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-300 outline-none transition-colors focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          >
            {riskFilters.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="space-y-px" aria-label="Loading timeline events" aria-busy="true">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex items-center gap-4 border-b border-slate-800 px-4 py-4 last:border-b-0">
              <div className="h-9 w-9 animate-pulse rounded-md bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/5 animate-pulse rounded bg-slate-800" />
                <div className="h-2.5 w-2/5 animate-pulse rounded bg-slate-800" />
              </div>
              <div className="h-6 w-16 animate-pulse rounded-md bg-slate-800" />
            </div>
          ))}
        </div>
      ) : visibleEntries.length > 0 ? (
        <div>
          {visibleEntries.map((entry, index) => (
            <TimelineRow key={entry.id ?? `${String(entry.timestamp)}-${entry.description}-${index}`} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="px-4 py-12 text-center">
          <p className="font-mono text-sm text-slate-400">{emptyMessage}</p>
          {riskFilter !== "all" && <p className="mt-1 font-mono text-xs text-slate-600">Try a different risk filter.</p>}
        </div>
      )}
    </section>
  );
};

export default TimelineTable;
