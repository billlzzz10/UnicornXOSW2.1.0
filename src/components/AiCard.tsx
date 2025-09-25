import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useApp, AICard as TCard } from "../state/store";
import { MockRealtime } from "../state/realtime";
import mermaid from "mermaid";
import DOMPurify from "dompurify";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip } from "chart.js";
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

interface ConfidenceBarProps {
  value: number;
}

function ConfidenceBar({ value }: ConfidenceBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className="w-28" role="progressbar" aria-valuenow={clampedValue} aria-valuemin={0} aria-valuemax={100}>
      <div className="flex justify-between text-[11px] text-gray-500">
        <span>Confidence</span>
        <span>{clampedValue}%</span>
      </div>
      <div className="h-1.5 rounded bg-gray-200 dark:bg-gray-700 mt-1">
        <div className="h-1.5 rounded bg-green-500 transition-all duration-300" style={{ width: `${clampedValue}%` }} />
      </div>
    </div>
  );
}

interface DataPoint {
  t: string;
  v: number;
}

interface ChartLineProps {
  points: DataPoint[];
}

function ChartLine({ points }: ChartLineProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!ref.current || points.length === 0) return;

    try {
      // Destroy existing chart
      chartRef.current?.destroy();

      // Create new chart
      chartRef.current = new Chart(ref.current, {
        type: "line",
        data: {
          labels: points.map(p => p.t),
          datasets: [{
            data: points.map(p => p.v),
            pointRadius: 0,
            borderWidth: 2,
            tension: 0.25,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
          },
          scales: {
            x: { display: true },
            y: { display: true }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      });
    } catch (error) {
      console.error('Failed to create chart:', error);
    }

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [points]);

  return <canvas ref={ref} className="w-full h-44" role="img" aria-label="Time series chart" />;
}

interface MermaidBlockProps {
  code: string;
}

function MermaidBlock({ code }: MermaidBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!ref.current || !code.trim()) return;

    const renderMermaid = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const theme = document.documentElement.classList.contains("dark") ? "dark" : "default";
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme,
          fontSize: 12
        });

        const uniqueId = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(uniqueId, code);

        if (ref.current) {
          ref.current.innerHTML = DOMPurify.sanitize(svg, {
            USE_PROFILES: { svg: true },
            ALLOWED_TAGS: ['svg', 'g', 'path', 'circle', 'rect', 'line', 'text', 'tspan', 'polygon', 'polyline', 'ellipse']
          });
        }
      } catch (e) {
        console.error('Mermaid rendering error:', e);
        setError(String(e));
        if (ref.current) {
          ref.current.innerHTML = `<pre class="text-xs text-red-600 p-2 overflow-auto">Error: ${String(e)}</pre>`;
        }
      } finally {
        setIsLoading(false);
      }
    };

    renderMermaid();
  }, [code]);

  return (
    <div
      ref={ref}
      className="p-2 bg-gray-50 dark:bg-gray-900/40 rounded border border-gray-200 dark:border-gray-700 min-h-[140px] relative"
      role="img"
      aria-label="Mermaid diagram"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <span className="text-xs">Rendering diagram...</span>
        </div>
      )}
      {error && !isLoading && (
        <div className="text-xs text-red-600 p-2">Failed to render diagram</div>
      )}
    </div>
  );
}

interface AiCardProps {
  id: string;
}

type MermaidViewMode = "preview" | "code" | "split";

export function AiCard({ id }: AiCardProps) {
  const { cards, expanded, toggleExpand, setCardField, setError, errors, log } = useApp();
  const c = cards[id];
  const [cli, setCli] = useState("");
  const [mermView, setMermView] = useState<MermaidViewMode>("preview");
  const [isCopying, setIsCopying] = useState(false);

  // Guard clause for missing card
  if (!c) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl shadow border border-red-200 dark:border-red-700 p-4">
        <p className="text-sm">Card not found: {id}</p>
      </div>
    );
  }

  useEffect(() => {
    setCli(c.cliSnippet);
  }, [c.cliSnippet]);

  const series = useMemo(() => {
    const out: DataPoint[] = [];
    const now = new Date();
    for (let i = 14; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const baseValue = 73000;
      const trend = Math.round(Math.sin(i / 3) * 1500 + (Math.random() - 0.5) * 800);
      const boost = i < 3 ? 2500 * (3 - i) : 0;
      out.push({
        t: date.toISOString().slice(0, 10),
        v: baseValue + trend + boost
      });
    }
    return out;
  }, []);

  const handleToggleExpand = useCallback(() => {
    toggleExpand(c.id);
  }, [toggleExpand, c.id]);

  const handleCliChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCli(e.target.value);
  }, []);

  const handleRunCLI = useCallback(async (dry = false) => {
    try {
      const ok = Math.random() > 0.1;
      await log({
        userId: "demo",
        action: dry ? "DRY_RUN" : "RUN_CLI",
        cardId: c.id,
        details: cli
      });

      if (!ok) {
        setError(c.id, "CLI error: invalid range");
        return;
      }
      setError(c.id, undefined);
    } catch (error) {
      console.error('Failed to log CLI action:', error);
      setError(c.id, "Failed to execute CLI action");
    }
  }, [log, c.id, cli, setError]);

  const handleApply = useCallback(async () => {
    try {
      await log({
        userId: "demo",
        action: "APPLY",
        cardId: c.id,
        details: `adds=${c.changeDelta.adds} mod=${c.changeDelta.modifies} del=${c.changeDelta.deletes}`
      });
    } catch (error) {
      console.error('Failed to log apply action:', error);
    }
  }, [log, c.id, c.changeDelta]);

  const handleReject = useCallback(async () => {
    try {
      await log({
        userId: "demo",
        action: "REJECT",
        cardId: c.id
      });
    } catch (error) {
      console.error('Failed to log reject action:', error);
    }
  }, [log, c.id]);

  const handleCopyCli = useCallback(async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(cli);
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    } finally {
      setIsCopying(false);
    }
  }, [cli]);

  const handleCopyCard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(c, null, 2));
    } catch (error) {
      console.error('Failed to copy card data:', error);
    }
  }, [c]);

  const handleMermaidViewChange = useCallback((mode: MermaidViewMode) => {
    setMermView(mode);
  }, []);

  return (
    <article className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{c.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">{c.intentSummary}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] px-2 py-1 rounded-full bg-blue-500/20 text-blue-600"
            role="status"
            aria-label={`Signal: ${c.signal.text}`}
          >
            {c.signal.text}
          </span>
          <time className="text-[11px] text-gray-500" dateTime={new Date().toISOString()}>
            {new Date().toLocaleTimeString("th-TH")}
          </time>
        </div>
      </header>

      {/* TL;DR + confidence */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm pr-4 flex-1">{c.tldr}</p>
        <ConfidenceBar value={c.confidence} />
      </div>

      {/* Toggle */}
      <div className="mt-2">
        <button
          className="text-xs text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
          onClick={handleToggleExpand}
          aria-expanded={expanded[c.id]}
          aria-controls={`card-content-${c.id}`}
        >
          {expanded[c.id] ? "แสดงน้อยลง" : "แสดงรายละเอียดเพิ่มเติม"}
        </button>
      </div>

      {/* Error */}
      {errors[c.id] && (
        <div
          className="mt-2 text-xs p-2 rounded bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
          role="alert"
        >
          {errors[c.id]}
        </div>
      )}

      {/* Body */}
      {expanded[c.id] && (
        <div id={`card-content-${c.id}`} className="mt-3 space-y-4">
          {/* Chart */}
          <section className="rounded p-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700">
            <ChartLine points={series} />
            <div className="text-[11px] text-gray-500 mt-1">Timeseries 15 วัน</div>
          </section>

          {/* CLI */}
          <section>
            <label htmlFor={`cli-input-${c.id}`} className="text-xs font-semibold block mb-1">
              CLI Snippet
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                id={`cli-input-${c.id}`}
                className="font-mono text-xs bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 w-full"
                value={cli}
                onChange={handleCliChange}
                aria-label="CLI command input"
              />
              <button
                className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => handleRunCLI(false)}
                aria-label="Run CLI command"
              >
                Run
              </button>
              <button
                className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={handleCopyCli}
                disabled={isCopying}
                aria-label={isCopying ? "Copying..." : "Copy CLI command"}
              >
                {isCopying ? "..." : "Copy"}
              </button>
              <button
                className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={() => handleRunCLI(true)}
                aria-label="Dry run CLI command"
              >
                Dry-run
              </button>
            </div>
          </section>

          {/* Mermaid */}
          <section>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold">Mindmap / Mermaid</label>
              <div className="flex gap-1" role="tablist" aria-label="Mermaid view options">
                {(["preview", "code", "split"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleMermaidViewChange(mode)}
                    className={`text-[11px] px-2 py-0.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      mermView === mode
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    role="tab"
                    aria-selected={mermView === mode}
                    aria-controls={`mermaid-${mode}-${c.id}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            <div className={`grid gap-2 ${mermView === "split" ? "grid-cols-2" : "grid-cols-1"} mt-1`}>
              {mermView !== "code" && (
                <div id={`mermaid-preview-${c.id}`} role="tabpanel">
                  <MermaidBlock code={c.mermaidCode} />
                </div>
              )}
              {mermView !== "preview" && (
                <div id={`mermaid-code-${c.id}`} role="tabpanel">
                  <pre className="text-xs bg-gray-100 dark:bg-gray-700 rounded p-2 overflow-auto">
                    <code>{c.mermaidCode.trim()}</code>
                  </pre>
                </div>
              )}
            </div>
          </section>

          {/* Meta badges */}
          <section className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-xs font-semibold mb-2">Metadata</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <span className="text-[11px] px-2 py-1 rounded bg-yellow-500/20 text-yellow-700">
                Risk: {c.riskRating}
              </span>
              <span className="text-[11px] px-2 py-1 rounded bg-blue-500/20 text-blue-700">
                Impact: {c.impact.base}
              </span>
              <span className="text-[11px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">
                Cost: {c.cost.latency}
              </span>
              <span className="text-[11px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">
                Policy: {c.policyCheck.status}
              </span>
              <span className="text-[11px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">
                Explain: 3-sigma
              </span>
              <span className="text-[11px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">
                Undo: 30s
              </span>
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <footer className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleApply}
            aria-label="Apply changes"
          >
            Apply
          </button>
          <button
            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Drill down for more details"
          >
            Drilldown ▾
          </button>
          <button
            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            onClick={handleReject}
            aria-label="Reject changes"
          >
            Reject
          </button>
          <button
            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            onClick={handleCopyCard}
            aria-label="Export card data"
          >
            Export
          </button>
        </div>
        <div className="text-right">
          <p
            className="text-[11px] text-gray-500 font-mono"
            title={`Source: ${c.provenance.source}`}
          >
            {c.provenance.model}
          </p>
          <p
            className="text-[11px] text-gray-400 font-mono"
            title={`Causal ID: ${c.audit.causalId}`}
          >
            {c.audit.eventId}
          </p>
        </div>
      </footer>
    </div>
  );
}

export function CardsBoard() {
  const { cards, upsertCard } = useApp();

  // Subscribe to real-time updates
  useEffect(() => {
    let unsub: (() => void) | null = null;

    const initializeBoard = async () => {
      try {
        // Subscribe to real-time updates
        unsub = MockRealtime.subscribeCards(
          (c: TCard) => {
            try {
              upsertCard(c);
            } catch (error) {
              console.error('Failed to upsert card:', error);
            }
          },
          (id: string) => {
            // Optional: handle card deletion
            console.log('Card deleted:', id);
          }
        );

        // Seed mock card
        const seedCard: TCard = {
          id: "card-1",
          title: "BTC Breakout",
          intentSummary: "show_timeseries: BTC/USD price, 15d",
          tldr: "ทะลุ $75k พร้อมวอลุ่มสูง ฐานยังขาขึ้น",
          signal: { type: "breakout", text: "Breakout" },
          confidence: 92,
          provenance: {
            source: "data: ExchangeX @2025-09-25T12:00Z",
            model: "intent-v1.3",
            ttlMinutes: 15,
            generatedAtISO: new Date().toISOString()
          },
          audit: { eventId: "evt_a1", causalId: "cau_x1" },
          cliSnippet: "aictl request-render --intent=show_timeseries --entity=BTC --metric=price --range=15d",
          mermaidCode: "graph TD; A[Start]-->B{Price > 75k?}; B--Yes-->C[Volume High]; C--Yes-->D[Breakout]; B--No-->E[Monitor];",
          riskRating: "Medium",
          impact: { bear: "-5%", base: "+12%", bull: "+25%" },
          cost: { latency: "150ms", tokens: 250, calls: 1 },
          policyCheck: { status: "Passed", details: "ok" },
          explainability: "3-sigma vs 30D avg",
          confidenceBreakdown: { intent: 98, dataFreshness: 95, model: 89 },
          changeDelta: { adds: 5, modifies: 2, deletes: 0 },
          undoPlan: "undo 30s",
          tags: ["btc", "price"]
        };

        try {
          await MockRealtime.upsertCard(seedCard);
        } catch (error) {
          console.error('Failed to seed mock card:', error);
        }
      } catch (error) {
        console.error('Failed to initialize cards board:', error);
      }
    };

    initializeBoard();

    return () => {
      if (unsub) {
        try {
          unsub();
        } catch (error) {
          console.error('Error unsubscribing from real-time updates:', error);
        }
      }
    };
  }, [upsertCard]);

  const cardList = Object.values(cards);

  if (cardList.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">No AI Cards available</p>
        <p className="text-sm">Cards will appear here when real-time updates are received.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4" role="feed" aria-label="AI Cards feed">
      {cardList.map((card) => (
        <AiCard key={card.id} id={card.id} />
      ))}
    </div>
  );
}