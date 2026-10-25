// Serviço HTTP centralizado. Futuras integrações (ex.: sensores ESP32) devem adicionar funções aqui.
export const API_URL = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:5254";

export type Setor = { id: number; nome: string; valorHora?: number | undefined };
export type Vaga = {
  id: number;
  codigo: string;
  status?: string | undefined;
  setorId?: number | undefined;
  setorNome?: string | undefined;
  valorHora?: number | undefined;
};
export type StatusReserva = "Agendada" | "Cancelada" | "Concluida" | string;
export type Reserva = {
  id: number;
  vagaId: number;
  vagaCodigo?: string | undefined;
  setorNome?: string | undefined;
  placa: string;
  inicio: string;
  fim: string;
  status: StatusReserva;
  valor?: number | undefined;
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
  } catch {
    throw new ApiError(0, `Não foi possível conectar à API em ${API_URL}. Verifique se o servidor está em execução.`);
  }
  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!res.ok) {
    const detail =
      (typeof body === "string" && body) || body?.mensagem || body?.message || body?.detail || body?.title;
    const msg =
      res.status === 400
        ? `Dados inválidos: ${detail ?? "verifique as informações enviadas."}`
        : res.status === 409
          ? `Conflito: ${detail ?? "esta vaga já foi reservada nesse horário. Escolha outra vaga ou horário."}`
          : res.status === 404
            ? "Registro não encontrado."
            : `Erro ${res.status}: ${detail ?? "falha na comunicação com o servidor."}`;
    throw new ApiError(res.status, msg);
  }
  return body as T;
}

const pick = (o: any, ...keys: string[]) => {
  for (const k of keys) if (o?.[k] !== undefined && o?.[k] !== null) return o[k];
  return undefined;
};
const num = (v: any) => (v === undefined || v === null || v === "" ? undefined : Number(v));

export const mapSetor = (s: any): Setor => ({
  id: Number(pick(s, "id", "setorId")),
  nome: String(pick(s, "nome", "descricao", "name") ?? `Setor ${pick(s, "id")}`),
  valorHora: num(pick(s, "valorHora", "precoHora", "valor", "preco")),
});

export const mapVaga = (v: any): Vaga => ({
  id: Number(pick(v, "id", "vagaId")),
  codigo: String(pick(v, "codigo", "numero", "identificacao", "nome") ?? pick(v, "id", "vagaId")),
  status: String(pick(v, "status", "situacao") ?? ""),
  setorId: num(pick(v, "setorId") ?? v?.setor?.id),
  setorNome: pick(v, "setorNome") ?? v?.setor?.nome,
  valorHora: num(pick(v, "valorHora", "precoHora") ?? v?.setor?.valorHora),
});

export const mapReserva = (r: any): Reserva => ({
  id: Number(pick(r, "id", "reservaId")),
  vagaId: Number(pick(r, "vagaId") ?? r?.vaga?.id),
  vagaCodigo: pick(r, "vagaCodigo", "codigoVaga") ?? r?.vaga?.codigo,
  setorNome: pick(r, "setorNome") ?? r?.vaga?.setor?.nome ?? r?.setor?.nome,
  placa: String(pick(r, "placa", "placaVeiculo") ?? ""),
  inicio: String(pick(r, "inicio", "dataInicio", "dataHoraInicio")),
  fim: String(pick(r, "fim", "dataFim", "dataHoraFim")),
  status: String(pick(r, "status", "situacao") ?? "Agendada"),
  valor: num(pick(r, "valor", "valorTotal", "valorReserva", "preco")),
});

const arr = (b: any): any[] => (Array.isArray(b) ? b : (b?.items ?? b?.data ?? b?.vagas ?? []));

export const api = {
  vagasDisponiveis: async (inicio: string, fim: string) =>
    arr(await request(`/api/Reservas/disponiveis?inicio=${encodeURIComponent(inicio)}&fim=${encodeURIComponent(fim)}`)).map(mapVaga),
  vagas: async () => arr(await request("/api/Vagas")).map(mapVaga),
  setores: async () => arr(await request("/api/Setores")).map(mapSetor),
  reservas: async () => arr(await request("/api/Reservas")).map(mapReserva),
  reserva: async (id: number) => mapReserva(await request(`/api/Reservas/${id}`)),
  criarReserva: async (d: { vagaId: number; placa: string; inicio: string; fim: string }) =>
    mapReserva(
      await request("/api/Reservas", {
        method: "POST",
        body: JSON.stringify({ ...d, dataInicio: d.inicio, dataFim: d.fim }),
      }),
    ),
  cancelarReserva: (id: number) => request<unknown>(`/api/Reservas/${id}/cancelar`, { method: "PUT" }),
};

// Utilidades
export const brl = (v?: number) =>
  v === undefined || Number.isNaN(v) ? "—" : v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const dataHora = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
/** Converte valor de <input type="datetime-local"> para string local sem fuso (yyyy-MM-ddTHH:mm:ss). */
export const toApiDate = (local: string) => (local.length === 16 ? `${local}:00` : local);

export function validarPeriodo(inicio: string, fim: string, agora = new Date()): string | null {
  if (!inicio || !fim) return "Informe a data e o horário de início e de fim.";
  const i = new Date(inicio), f = new Date(fim);
  if (i.getTime() < agora.getTime()) return "O início não pode estar no passado.";
  if (i.getTime() >= f.getTime()) return "O horário de início deve ser anterior ao horário de fim.";
  return null;
}
export const PLACA_RE = /^[A-Z]{3}-?\d[A-Z0-9]\d{2}$/;
