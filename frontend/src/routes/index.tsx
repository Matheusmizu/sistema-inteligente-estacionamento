import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { api, brl, dataHora, PLACA_RE, toApiDate, validarPeriodo, type Reserva, type Setor, type Vaga } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reservar vaga — Vaga Certa" },
      { name: "description", content: "Consulte vagas disponíveis por data e horário e reserve a sua." },
      { property: "og:title", content: "Reservar vaga — Vaga Certa" },
      { property: "og:description", content: "Consulte vagas disponíveis por data e horário e reserve a sua." },
    ],
  }),
  component: Index,
});

const pad = (n: number) => String(n).padStart(2, "0");
const toLocalInput = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

type Busca = { vagas: (Vaga & { disponivel: boolean })[]; setores: Setor[] };

function Index() {
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState<Busca | null>(null);
  const [periodo, setPeriodo] = useState<{ inicio: string; fim: string } | null>(null);
  const [sel, setSel] = useState<Vaga | null>(null);
  const [placa, setPlaca] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroReserva, setErroReserva] = useState<string | null>(null);
  const [confirmada, setConfirmada] = useState<Reserva | null>(null);
  const caminhoAtual = useRouterState({
  select: (state) => state.location.pathname,
});
  const [setoresPainel, setSetoresPainel] = useState<Setor[]>([]);
  const [vagasPainel, setVagasPainel] = useState<Vaga[]>([]);
  const [carregandoPainel, setCarregandoPainel] = useState(true);
  const [erroPainel, setErroPainel] = useState<string | null>(null);
  const minNow = typeof window === "undefined" ? undefined : toLocalInput(new Date());
  async function carregarPainel() {
  setCarregandoPainel(true);
  setErroPainel(null);

  try {
    const [setores, vagas] = await Promise.all([
      api.setores(),
      api.vagas(),
    ]);

    setSetoresPainel(setores);
    setVagasPainel(vagas);
  } catch (e) {
    setErroPainel((e as Error).message);
  } finally {
    setCarregandoPainel(false);
  }
}

useEffect(() => {
  if (caminhoAtual === "/") {
    void carregarPainel();
  }
}, [caminhoAtual]);

  async function consultar(e: React.FormEvent) {
    e.preventDefault();
    const v = validarPeriodo(inicio, fim);
    setErro(v);
    if (v) return;
    setLoading(true); setBusca(null); setSel(null); setConfirmada(null);
    try {
      const i = toApiDate(inicio), f = toApiDate(fim);
      const [disp, todas, setores] = await Promise.all([
        api.vagasDisponiveis(i, f),
        api.vagas().catch(() => [] as Vaga[]),
        api.setores().catch(() => [] as Setor[]),
      ]);
      const ids = new Set(disp.map((d) => d.id));
      const base = todas.length ? todas : disp;
      const merged = base.map((v) => ({ ...v, ...(disp.find((d) => d.id === v.id) ?? {}), disponivel: ids.has(v.id) }));
      setBusca({ vagas: merged, setores });
      setPeriodo({ inicio: i, fim: f });
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const grupos = useMemo(() => {
    if (!busca) return [];
    const m = new Map<string, { setor?: Setor | undefined; nome: string; vagas: Busca["vagas"] }>();
    for (const v of busca.vagas) {
      const setor = busca.setores.find((s) => s.id === v.setorId);
      const nome = setor?.nome ?? v.setorNome ?? (v.setorId ? `Setor ${v.setorId}` : "Sem setor");
      if (!m.has(nome)) m.set(nome, { setor, nome, vagas: [] });
      m.get(nome)!.vagas.push(v);
    }
    return [...m.values()];
  }, [busca]);

  const setorSel = busca?.setores.find((s) => s.id === sel?.setorId);
  const horas = periodo ? (new Date(periodo.fim).getTime() - new Date(periodo.inicio).getTime()) / 3.6e6 : 0;
  const valorHora = sel?.valorHora ?? setorSel?.valorHora ?? 5;
const valorEstimado = horas > 0
  ? Math.round(valorHora * horas * 100) / 100
  : undefined;
  const placaNorm = placa.toUpperCase().replace(/\s/g, "");
  const placaOk = PLACA_RE.test(placaNorm);

  async function reservar() {
    if (!sel || !periodo || !placaOk) return;
    const v = validarPeriodo(periodo.inicio, periodo.fim);
    if (v) { setErroReserva(v); return; }
    setEnviando(true); setErroReserva(null);
    try {
      const r = await api.criarReserva({ vagaId: sel.id, placa: placaNorm.replace("-", ""), ...periodo });
      setConfirmada(r);
      void carregarPainel();
    } catch (err) {
      setErroReserva((err as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  if (confirmada) {
    return (
      <main className="mx-auto max-w-lg px-4 py-12">
        <Card className="text-center">
          <CardContent className="space-y-4 pt-8">
            <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
            <h1 className="text-2xl font-bold">Reserva confirmada</h1>
            <StatusBadge status={confirmada.status || "Agendada"} />
            <Resumo vaga={confirmada.vagaCodigo ?? sel?.codigo} setor={setorSel?.nome ?? sel?.setorNome} placa={confirmada.placa || placaNorm}
              inicio={confirmada.inicio || periodo!.inicio} fim={confirmada.fim || periodo!.fim} valor={confirmada.valor ?? valorEstimado} />
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button asChild><Link to="/reservas">Ver minhas reservas</Link></Button>
              <Button variant="outline" onClick={() => { setConfirmada(null); setBusca(null); setSel(null); setPlaca(""); }}>Nova reserva</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <section>
        <h1 className="text-3xl font-bold sm:text-4xl">Encontre sua vaga</h1>
        <p className="mt-1 text-muted-foreground">Escolha o período e veja as vagas disponíveis em tempo real.</p>
      </section>
<section className="space-y-4">
  <div className="flex flex-wrap items-center justify-between gap-3">
  <div>
    <h2 className="text-2xl font-bold">
      Disponibilidade do estacionamento
    </h2>
    <p className="text-sm text-muted-foreground">
      Confira a situação atual das vagas por setor.
    </p>
  </div>

  <Button
    type="button"
    variant="outline"
    onClick={() => void carregarPainel()}
    disabled={carregandoPainel}
  >
    <Loader2
      className={`mr-2 h-4 w-4 ${carregandoPainel ? "animate-spin" : ""}`}
    />
    {carregandoPainel ? "Atualizando..." : "Atualizar painel"}
  </Button>
</div>

  {erroPainel && (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Não foi possível carregar o painel</AlertTitle>
      <AlertDescription>{erroPainel}</AlertDescription>
    </Alert>
  )}

  {carregandoPainel ? (
    <div className="grid gap-3 sm:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
  ) : (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">
              Total de vagas
            </p>
            <p className="text-3xl font-bold">
              {vagasPainel.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">
              Livres
            </p>
            <p className="text-3xl font-bold text-green-600">
              {vagasPainel.filter(
  (v) =>
    v.status?.toLowerCase() === "livre" &&
    !v.ocupadaPorSensor
).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">
              Ocupadas ou indisponíveis
            </p>
            <p className="text-3xl font-bold text-destructive">
              {vagasPainel.filter(
                (v) => v.status?.toLowerCase() === "ocupada" ||
                v.status?.toLowerCase() === "indisponível" ||
                v.ocupadaPorSensor == true
              ).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {setoresPainel.map((setor) => {
          const vagasSetor = vagasPainel.filter(
            (v) => v.setorId === setor.id
          );

          const livres = vagasSetor.filter(
            (v) =>
              v.status?.toLowerCase() === "livre" &&
              !v.ocupadaPorSensor
          ).length;

          return (
            <Card key={setor.id}>
              <CardContent className="space-y-3 pt-5">
                <h3 className="font-bold">{setor.nome}</h3>

                <div className="flex items-end justify-between gap-2">
                  <span className="text-sm text-muted-foreground">
                    Vagas livres
                  </span>
                  <span className="text-xl font-bold">
                    {livres} / {vagasSetor.length}
                  </span>
                </div>

                <div
                  className="h-2 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={vagasSetor.length}
                  aria-valuenow={livres}
                  aria-label={`Vagas livres no ${setor.nome}`}
                >
                  <div
                    className="h-full rounded-full bg-green-600 transition-all"
                    style={{
                      width: `${
                        vagasSetor.length > 0
                          ? (livres / vagasSetor.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  {vagasSetor.length - livres} ocupadas ou indisponíveis
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {setoresPainel.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum setor cadastrado.
        </p>
      )}
    </>
  )}
</section>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={consultar} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="inicio">Início</Label>
              <Input id="inicio" type="datetime-local" min={minNow} value={inicio} onChange={(e) => setInicio(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fim">Fim</Label>
              <Input id="fim" type="datetime-local" min={inicio || minNow} value={fim} onChange={(e) => setFim(e.target.value)} required />
            </div>
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Search />} Consultar vagas
            </Button>
          </form>
          {erro && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" /><AlertTitle>Não foi possível consultar</AlertTitle>
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {loading && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">{Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      )}

      {busca && !loading && (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <section className="space-y-6">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Legenda className="border-success bg-success-soft" label="Disponível" />
              <Legenda className="border-accent bg-accent" label="Selecionada" />
              <Legenda className="border-border bg-muted" label="Indisponível" />
            </div>
            {busca.vagas.filter((v) => v.disponivel).length === 0 && (
              <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>Nenhuma vaga disponível</AlertTitle>
                <AlertDescription>Tente outro período.</AlertDescription></Alert>
            )}
            {grupos.map((g) => (
              <div key={g.nome}>
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 className="text-lg font-bold">{g.nome}</h2>
                  <span className="text-sm text-muted-foreground">
                    {g.vagas.filter((v) => v.disponivel).length} disponíveis{g.setor?.valorHora !== undefined && ` · ${brl(g.setor.valorHora)}/h`}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
                  {g.vagas.map((v) => {
                    const ativo = sel?.id === v.id;
                    return (
                      <button key={v.id} type="button" disabled={!v.disponivel} onClick={() => { setSel(v); setErroReserva(null); }}
                        aria-pressed={ativo} aria-label={`Vaga ${v.codigo} ${v.disponivel ? "disponível" : "indisponível"}`}
                        className={cn("flex h-20 flex-col items-center justify-center rounded-lg border-2 font-display font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          !v.disponivel && "cursor-not-allowed border-border bg-muted text-muted-foreground line-through",
                          v.disponivel && !ativo && "border-success bg-success-soft text-foreground hover:-translate-y-0.5",
                          ativo && "border-accent bg-accent text-accent-foreground shadow-md")}>
                        <span className="text-lg">{v.codigo}</span>
                        <span className="text-[10px] font-normal uppercase tracking-wide">{ativo ? "Selecionada" : v.disponivel ? "Livre" : "Ocupada"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <Card>
              <CardHeader><CardTitle>Resumo da reserva</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {!sel ? <p className="text-sm text-muted-foreground">Selecione uma vaga disponível.</p> : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="placa">Placa do veículo</Label>
                      <Input id="placa" placeholder="ABC1D23" maxLength={8} value={placa} onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                        className="font-display text-lg tracking-widest" aria-invalid={!!placa && !placaOk} />
                      {placa && !placaOk && <p className="text-xs text-destructive">Use o formato ABC1234 ou ABC1D23.</p>}
                    </div>
                    <Resumo vaga={sel.codigo} setor={setorSel?.nome ?? sel.setorNome} placa={placaOk ? placaNorm : "—"}
                      inicio={periodo!.inicio} fim={periodo!.fim} valor={valorEstimado} />
                    {erroReserva && (
                      <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{erroReserva}</AlertDescription></Alert>
                    )}
                    <Button className="w-full" size="lg" disabled={!placaOk || enviando} onClick={reservar}>
                      {enviando && <Loader2 className="animate-spin" />} Confirmar reserva
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      )}
    </main>
  );
}

function Legenda({ className, label }: { className: string; label: string }) {
  return <span className="flex items-center gap-2"><span className={cn("h-4 w-4 rounded border-2", className)} />{label}</span>;
}

function Resumo(p: { vaga?: string | undefined; setor?: string | undefined; placa: string; inicio: string; fim: string; valor?: number | undefined }) {
  const rows: [string, string][] = [
    ["Vaga", p.vaga ?? "—"], ["Setor", p.setor ?? "—"], ["Placa", p.placa],
    ["Início", dataHora(p.inicio)], ["Fim", dataHora(p.fim)],
  ];
  return (
    <dl className="divide-y rounded-lg border text-left text-sm">
      {rows.map(([k, v]) => <div key={k} className="flex justify-between px-3 py-2"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>)}
      <div className="flex justify-between bg-muted px-3 py-2"><dt className="font-medium">Valor</dt><dd className="font-display text-base font-bold">{p.valor !== undefined ? brl(p.valor) : "Calculado pelo sistema"}</dd></div>
    </dl>
  );
}
