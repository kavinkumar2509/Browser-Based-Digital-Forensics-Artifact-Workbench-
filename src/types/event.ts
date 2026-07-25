/**
 * Canonical event severity classification for the PWNDORA forensic data layer.
 *
 * Mirrors the visual taxonomy consumed by {@link EventIcon} and {@link RiskBadge}.
 * Every forensic event in the system MUST carry exactly one of these values,
 * enabling deterministic icon resolution and colour-coded risk rendering
 * across the timeline, dashboard, and report views.
 */
export type EventType =
  | 'alert'
  | 'critical'
  | 'warning'
  | 'info'
  | 'sensor'
  | 'prediction'
  | 'maintenance'
  | 'resolved';
