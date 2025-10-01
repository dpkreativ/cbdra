import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { IncidentData } from "@/schemas/incidents";

const TYPE_ICONS: Record<string, string> = {
  water: "carbon:flood",
  biological: "solar:virus-outline",
  fire: "carbon:fire",
  geological: "carbon:earthquake",
  crime: "carbon:police",
  "man-made": "hugeicons:accident",
  industrial: "carbon:industry",
  other: "carbon:warning",
};

function TypeIcon({ type }: { type: string }) {
  const key = type?.toLowerCase?.() ?? "";
  const icon = TYPE_ICONS[key] ?? TYPE_ICONS.other;
  return <Icon icon={icon} width="24" height="24" />;
}

const URGENCY_LABELS: Record<string, string> = {
  low: "Minor",
  medium: "Moderate",
  high: "Critical",
};

const URGENCY_CLASSES: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

function UrgencyBadge({ level }: { level: string }) {
  const key = level?.toLowerCase?.() ?? "";
  const label = URGENCY_LABELS[key] ?? URGENCY_LABELS.medium;
  const cls = URGENCY_CLASSES[key] ?? URGENCY_CLASSES.medium;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

export default function IncidentCard({ incident }: { incident: IncidentData }) {
  return (
    <Card className="cursor-pointer">
      <CardHeader>
        <CardTitle className="flex gap-2 justify-between">
          <TypeIcon type={incident.type} />
          <UrgencyBadge level={incident.urgency} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2">{incident.description}</p>
      </CardContent>
    </Card>
  );
}
