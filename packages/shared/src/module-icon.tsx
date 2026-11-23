import type { ModuleIcon as ModuleIconName } from "@varzino/demo-data";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  ChartLine,
  FileText,
  Gauge,
  Gavel,
  GraduationCap,
  IdCard,
  type LucideIcon,
  Medal,
  MessageSquare,
  Network,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
  Tent,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";

const map: Record<ModuleIconName, LucideIcon> = {
  trophy: Trophy,
  chart: ChartLine,
  graduation: GraduationCap,
  id: IdCard,
  network: Network,
  shield: ShieldCheck,
  file: FileText,
  message: MessageSquare,
  wallet: Wallet,
  gauge: Gauge,
  building: Building2,
  tent: Tent,
  calendar: CalendarDays,
  badge: BadgeCheck,
  search: SearchCheck,
  sparkle: Sparkles,
  league: Medal,
  target: Target,
  users: Users,
  gavel: Gavel,
};

export function ModuleIcon({ name, className }: { name: ModuleIconName; className?: string }) {
  const Icon = map[name];
  return <Icon aria-hidden className={className} strokeWidth={1.6} />;
}
