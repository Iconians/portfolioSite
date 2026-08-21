import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Boxes,
  Clock3,
  Code2,
  Database,
  Gauge,
  Layers,
  Rocket,
  ShieldCheck,
  TestTube2,
  Users,
} from "lucide-react";

const METRIC_ICON_RULES: Array<{ pattern: RegExp; icon: LucideIcon }> = [
  { pattern: /test|coverage|spec/i, icon: TestTube2 },
  { pattern: /user|client|customer/i, icon: Users },
  { pattern: /uptime|latency|performance|speed|ms/i, icon: Gauge },
  { pattern: /security|auth|rls|compliance/i, icon: ShieldCheck },
  { pattern: /api|endpoint|route/i, icon: Code2 },
  { pattern: /database|query|prisma|sql/i, icon: Database },
  { pattern: /component|module|feature|screen/i, icon: Boxes },
  { pattern: /phase|release|version|milestone/i, icon: Rocket },
  { pattern: /time|hour|day|week|month|duration/i, icon: Clock3 },
  { pattern: /layer|stack|architecture|service/i, icon: Layers },
];

export function getMetricIcon(label: string): LucideIcon {
  const match = METRIC_ICON_RULES.find(({ pattern }) => pattern.test(label));
  return match?.icon ?? BarChart3;
}
