import {
  User,
  Activity,
  Timer,
  TrendingUp,
  FileText,
  ClipboardList,
  Crosshair,
  Zap,
} from "lucide-react";
import { GoniometerIcon } from "@/components/icons/GoniometerIcon";
import type { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    label: "Assessments",
    href: "/dashboard/assessments",
    icon: "clipboard",
    description: "Run & switch assessment types",
    moduleId: "assessments",
  },
  {
    label: "Athlete Profile",
    href: "/dashboard/athlete-profile",
    icon: "user",
    description: "Overview & bio metrics",
    moduleId: "profile",
  },
  {
    label: "Movement Screen",
    href: "/dashboard/movement-screen",
    icon: "activity",
    description: "FMS & movement patterns",
    moduleId: "movement-screen",
  },
  {
    label: "Screening Mobility",
    href: "/dashboard/screening-mobility",
    icon: "goniometer",
    description: "Joint ROM & symmetry",
    moduleId: "screening-mobility",
  },
  {
    label: "Performance Testing",
    href: "/dashboard/performance-testing",
    icon: "timer",
    description: "Combine & power metrics",
    moduleId: "performance-testing",
  },
  {
    label: "Hittrax Testing",
    href: "/dashboard/hittrax-testing",
    icon: "crosshair",
    description: "Exit velocity & batted ball data",
    moduleId: "hittrax-testing",
  },
  {
    label: "Blast Testing",
    href: "/dashboard/blast-testing",
    icon: "zap",
    description: "Bat speed & swing metrics",
    moduleId: "blast-testing",
  },
  {
    label: "Progress Tracking",
    href: "/dashboard/progress-tracking",
    icon: "trending-up",
    description: "Goals & milestones",
    moduleId: "progress-tracking",
  },
  {
    label: "Coach Report",
    href: "/dashboard/coach-report",
    icon: "file-text",
    description: "Assessment summary",
    moduleId: "coach-report",
  },
];

const iconMap = {
  clipboard: ClipboardList,
  user: User,
  activity: Activity,
  goniometer: GoniometerIcon,
  timer: Timer,
  crosshair: Crosshair,
  zap: Zap,
  "trending-up": TrendingUp,
  "file-text": FileText,
};

export function getNavIcon(iconName: string) {
  return iconMap[iconName as keyof typeof iconMap] || User;
}

export function getNavItemsForClassification(includedModules: string[]) {
  return navItems.filter(
    (item) => item.moduleId === "assessments" || includedModules.includes(item.moduleId)
  );
}
