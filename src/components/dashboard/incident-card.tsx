import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IncidentCard({
  type,
  description,
  urgency,
}: {
  type: string;
  description: string;
  urgency: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 justify-between">
          <p>{type}</p>
          <p>Urgency: {urgency}</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}
