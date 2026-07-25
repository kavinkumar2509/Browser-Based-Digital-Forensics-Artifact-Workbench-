import type { FC } from "react";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Info,
  ShieldAlert,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type EventType =
  | "alert"
  | "critical"
  | "warning"
  | "info"
  | "sensor"
  | "prediction"
  | "maintenance"
  | "resolved";

interface EventIconProps {
  type: EventType;
  size?: number;
  className?: string;
}

const eventIcons: Record<EventType, LucideIcon> = {
  alert: BellRing,
  critical: AlertOctagon,
  warning: AlertTriangle,
  info: Info,
  sensor: Activity,
  prediction: ShieldAlert,
  maintenance: Wrench,
  resolved: CheckCircle2,
};

const eventIconConfig: Record<EventType, { colorClass: string; label: string }> = {
  alert: { colorClass: "text-orange-400", label: "Alert event" },
  critical: { colorClass: "text-red-400", label: "Critical event" },
  warning: { colorClass: "text-yellow-400", label: "Warning event" },
  info: { colorClass: "text-blue-400", label: "Information event" },
  sensor: { colorClass: "text-cyan-400", label: "Sensor event" },
  prediction: { colorClass: "text-purple-400", label: "Prediction event" },
  maintenance: { colorClass: "text-slate-400", label: "Maintenance event" },
  resolved: { colorClass: "text-emerald-400", label: "Resolved event" },
};

const EventIcon: FC<EventIconProps> = ({ type, size = 18, className }) => {
  const Icon = eventIcons[type];
  const { colorClass, label } = eventIconConfig[type];

  return (
    <Icon
      size={size}
      role="img"
      aria-label={label}
      className={[colorClass, className].filter(Boolean).join(" ")}
    />
  );
};

export default EventIcon;
