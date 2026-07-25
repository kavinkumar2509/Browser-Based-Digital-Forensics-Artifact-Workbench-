import type { FC } from "react";
import EventIcon, { type EventType } from "./EventIcon";
import RiskBadge, { type RiskLevel } from "./RiskBadge";

export interface TimelineEntry {
  id?: string | number;
  timestamp: string | Date;
  type: EventType;
  description: string;
  riskLevel: RiskLevel;
  location?: string;
  source?: string;
  score?: number;
}

interface TimelineRowProps {
  entry: TimelineEntry;
}

const formatTimestamp = (timestamp: TimelineEntry["timestamp"]): string => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  return Number.isNaN(date.getTime())
    ? String(timestamp)
    : new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date);
};

const TimelineRow: FC<TimelineRowProps> = ({ entry }) => {
  const sourceDetails = [entry.location, entry.source].filter(Boolean).join(" / ");

  return (
    <article className="group flex flex-col gap-3 border-b border-slate-800 px-4 py-4 transition-colors hover:bg-slate-800/50 focus-within:bg-slate-800/50 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-800 bg-slate-900">
        <EventIcon type={entry.type} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="break-words font-mono text-sm text-slate-100">{entry.description}</p>
        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs text-slate-500">
          <time dateTime={entry.timestamp instanceof Date ? entry.timestamp.toISOString() : entry.timestamp}>
            {formatTimestamp(entry.timestamp)}
          </time>
          {sourceDetails && <span>{sourceDetails}</span>}
        </div>
      </div>

      <div className="self-start sm:self-center">
        <RiskBadge level={entry.riskLevel} score={entry.score} />
      </div>
    </article>
  );
};

export default TimelineRow;
