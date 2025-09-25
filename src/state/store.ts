import { create } from "zustand";
import { nanoid } from "nanoid";
import { produce } from "immer";

export type Risk = "Low"|"Medium"|"High";
export type AICard = {
  id: string;
  title: string;
  intentSummary: string;
  tldr: string;
  signal: { type: string; text: string };
  confidence: number;
  provenance: { source: string; model: string; ttlMinutes?: number; generatedAtISO?: string };
  audit: { eventId: string; causalId: string };
  cliSnippet: string;
  mermaidCode: string;
  riskRating: Risk;
  impact: { bear: string; base: string; bull: string };
  cost: { latency: string; tokens: number; calls: number };
  policyCheck: { status: "Passed"|"Failed"; details: string };
  explainability: string;
  confidenceBreakdown: { intent: number; dataFreshness: number; model: number };
  changeDelta: { adds: number; modifies: number; deletes: number };
  undoPlan: string;
  tags?: string[];
};

export type AuditEntry = { id: string; time: string; userId: string; action: string; cardId: string; details?: string };

export interface CardsSlice {
  cards: Record<string, AICard>;
  upsertCard: (c: Partial<AICard> & { id?: string }) => string;
  removeCard: (id: string) => void;
  setCardField: <K extends keyof AICard>(id: string, k: K, v: AICard[K]) => void;
}
export interface UISlice {
  expanded: Record<string, boolean>;
  toggleExpand: (id: string) => void;
  errors: Record<string, string|undefined>;
  setError: (id: string, msg?: string) => void;
}
export interface AuditSlice {
  audit: AuditEntry[];
  log: (e: Omit<AuditEntry,"id"|"time">) => void;
  clearAudit: () => void;
}

type AppState = CardsSlice & UISlice & AuditSlice;

export const useApp = create<AppState>((set) => ({
  // Cards
  cards: {},
  upsertCard: (c) => {
    const id = c.id || nanoid();
    set(produce<AppState>(s => {
      const nowISO = new Date().toISOString();
      s.cards[id] = {
        id,
        title: "Untitled",
        intentSummary: "",
        tldr: "",
        signal: { type: "info", text: "Info" },
        confidence: 0,
        provenance: { source: "local", model: "mock", generatedAtISO: nowISO, ttlMinutes: 15 },
        audit: { eventId: "evt_"+id, causalId: "cau_"+id },
        cliSnippet: "echo hello",
        mermaidCode: "graph TD; A-->B;",
        riskRating: "Low",
        impact: { bear:"0%", base:"0%", bull:"0%" },
        cost: { latency:"0ms", tokens:0, calls:0 },
        policyCheck: { status:"Passed", details:"mock" },
        explainability: "mock",
        confidenceBreakdown: { intent: 100, dataFreshness: 100, model: 100 },
        changeDelta: { adds:0, modifies:0, deletes:0 },
        undoPlan: "undo — 30s",
        ...s.cards[id],
        ...c,
        id
      };
    }));
    return id;
  },
  removeCard: (id) => set(produce<AppState>(s => { delete s.cards[id]; })),
  setCardField: (id, k, v) => set(produce<AppState>(s => { if (s.cards[id]) (s.cards[id] as any)[k] = v; })),

  // UI
  expanded: {},
  toggleExpand: (id) => set(produce<AppState>(s => { s.expanded[id] = !s.expanded[id]; })),
  errors: {},
  setError: (id, msg) => set(produce<AppState>(s => { s.errors[id] = msg; })),

  // Audit
  audit: [],
  log: (e) => set(produce<AppState>(s => { s.audit.push({ id: nanoid(), time: new Date().toISOString(), ...e }); })),
  clearAudit: () => set({ audit: [] }),
}));