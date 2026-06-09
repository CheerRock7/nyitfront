"use client";

import {
  Box,
  Cpu,
  Fan,
  Gauge,
  HardDrive,
  Keyboard,
  Monitor,
  Package,
  PcCase,
  Settings,
  Zap,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  builder: Settings,
  set: Monitor,
  gpu: Gauge,
  cpu: Cpu,
  mb: Box,
  ram: Package,
  ssd: HardDrive,
  psu: Zap,
  case: PcCase,
  cool: Fan,
  gear: Keyboard,
  monitor: Monitor,
  peripheral: Keyboard,
};

export function CategoryIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? Box;
  return <Icon className={className} strokeWidth={1.8} />;
}
