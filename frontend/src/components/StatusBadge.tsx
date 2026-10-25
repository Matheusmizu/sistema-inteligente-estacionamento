import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s.startsWith("cancel")) return <Badge variant="destructive">Cancelada</Badge>;
  if (s.startsWith("conclu")) return <Badge variant="secondary">Concluida</Badge>;
  return <Badge className="bg-success text-success-foreground hover:bg-success">Agendada</Badge>;
}
