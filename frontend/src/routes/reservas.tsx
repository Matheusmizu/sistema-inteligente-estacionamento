import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CalendarX, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { api, brl, dataHora, type Reserva } from "@/lib/api";

export const Route = createFileRoute("/reservas")({
  head: () => ({
    meta: [
      { title: "Minhas reservas — Vaga Certa" },
      { name: "description", content: "Acompanhe e cancele suas reservas de estacionamento." },
      { property: "og:title", content: "Minhas reservas — Vaga Certa" },
      { property: "og:description", content: "Acompanhe e cancele suas reservas de estacionamento." },
    ],
  }),
  component: Reservas,
});

function Reservas() {
  const [lista, setLista] = useState<Reserva[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [cancelando, setCancelando] = useState<number | null>(null);

  const carregar = useCallback(async () => {
    setErro(null); setLista(null);
    try {
      const r = await api.reservas();
      setLista(r.sort((a, b) => +new Date(b.inicio) - +new Date(a.inicio)));
    } catch (e) { setErro((e as Error).message); setLista([]); }
  }, []);
  useEffect(() => { void carregar(); }, [carregar]);

  async function cancelar(id: number) {
    setCancelando(id);
    try {
      await api.cancelarReserva(id);
      toast.success("Reserva cancelada.");
      setLista((l) => l?.map((r) => (r.id === id ? { ...r, status: "Cancelada" } : r)) ?? null);
    } catch (e) { toast.error((e as Error).message); }
    finally { setCancelando(null); }
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Minhas reservas</h1>
        <Button variant="outline" size="sm" onClick={carregar}><RefreshCw /> Atualizar</Button>
      </div>

      {erro && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Erro ao carregar</AlertTitle><AlertDescription>{erro}</AlertDescription></Alert>}
      {lista === null && <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24" />)}</div>}
      {lista?.length === 0 && !erro && (
        <Card><CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <CalendarX className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Você ainda não possui reservas.</p>
          <Button asChild><Link to="/">Reservar uma vaga</Link></Button>
        </CardContent></Card>
      )}

      <ul className="space-y-3">
        {lista?.map((r) => {
          const futura = r.status.toLowerCase().startsWith("agend") && new Date(r.inicio) > new Date();
          return (
            <li key={r.id}>
              <Card><CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-primary font-display text-lg font-bold text-primary-foreground">
                    {r.vagaCodigo ?? r.vagaId}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-bold tracking-widest">{r.placa}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {r.setorNome && `${r.setorNome} · `}{dataHora(r.inicio)} → {dataHora(r.fim)}
                    </p>
                    {r.valor !== undefined && <p className="text-sm font-medium">{brl(r.valor)}</p>}
                  </div>
                </div>
                {futura && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" disabled={cancelando === r.id}>
                        {cancelando === r.id && <Loader2 className="animate-spin" />} Cancelar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancelar reserva?</AlertDialogTitle>
                        <AlertDialogDescription>A vaga {r.vagaCodigo ?? r.vagaId} ficará livre para outros motoristas.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Voltar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => cancelar(r.id)}>Cancelar reserva</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardContent></Card>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
