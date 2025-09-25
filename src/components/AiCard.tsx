import React, {useEffect, useMemo, useRef, useState} from "react";
import { useApp, AICard as TCard } from "../state/store";
import { MockRealtime } from "../state/realtime";
import mermaid from "mermaid";
import DOMPurify from "dompurify";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip } from "chart.js";
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

function ConfidenceBar({v}:{v:number}) {
  return (
    <div className="w-28">
      <div className="flex justify-between text-[11px] text-gray-500"><span>Confidence</span><span>{v}%</span></div>
      <div className="h-1.5 rounded bg-gray-200 dark:bg-gray-700 mt-1">
        <div className="h-1.5 rounded bg-green-500" style={{width:`${v}%`}}/>
      </div>
    </div>
  );
}

function ChartLine({points}:{points:{t:string;v:number}[]}) {
  const ref = useRef<HTMLCanvasElement|null>(null);
  const chartRef = useRef<Chart|null>(null);
  useEffect(()=>{
    if(!ref.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(ref.current, {
      type: "line",
      data: { labels: points.map(p=>p.t), datasets: [{ data: points.map(p=>p.v), pointRadius:0, borderWidth:2, tension:0.25 }] },
      options: { plugins:{ legend:{display:false}, tooltip:{enabled:true} }, scales:{ x:{display:true}, y:{display:true} }, responsive:true }
    });
    return ()=>chartRef.current?.destroy();
  },[points]);
  return <canvas ref={ref} className="w-full h-44"/>;
}

function MermaidBlock({code}:{code:string}) {
  const ref = useRef<HTMLDivElement|null>(null);
  useEffect(()=>{
    mermaid.initialize({ startOnLoad:false, securityLevel:"strict", theme: document.documentElement.classList.contains("dark")?"dark":"default" });
    if(!ref.current) return;
    try {
      mermaid.render("m-"+Math.random().toString(36).slice(2), code, (svg)=>{
        ref.current!.innerHTML = DOMPurify.sanitize(svg, { USE_PROFILES:{ svg:true } });
      });
    } catch(e){ ref.current!.innerHTML = `<pre class="text-xs text-red-600">${String(e)}</pre>`; }
  },[code]);
  return <div ref={ref} className="p-2 bg-gray-50 dark:bg-gray-900/40 rounded border border-gray-200 dark:border-gray-700 min-h-[140px]" />;
}

export function AiCard({id}:{id:string}) {
  const { cards, expanded, toggleExpand, setCardField, setError, errors, log } = useApp();
  const c = cards[id];
  const [cli, setCli] = useState(c.cliSnippet);
  const [mermView, setMerm] = useState<"preview"|"code"|"split">("preview");

  useEffect(()=>setCli(c.cliSnippet),[c.cliSnippet]);

  const series = useMemo(()=>{
    const out:{t:string;v:number}[]=[];
    for(let i=14;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); out.push({ t:d.toISOString().slice(0,10), v:73000+Math.round(Math.sin(i/3)*1500 + (Math.random()-0.5)*800) + (i<3? 2500*(3-i):0) }); }
    return out;
  },[]);

  function runCLI(dry=false){
    const ok = Math.random()>0.1;
    log({ userId:"demo", action: dry?"DRY_RUN":"RUN_CLI", cardId:c.id, details: cli });
    if(!ok){ setError(c.id, "CLI error: invalid range"); return; }
    setError(c.id, undefined);
  }
  function apply(){
    log({ userId:"demo", action:"APPLY", cardId:c.id, details:`adds=${c.changeDelta.adds} mod=${c.changeDelta.modifies} del=${c.changeDelta.deletes}` });
  }
  function reject(){
    log({ userId:"demo", action:"REJECT", cardId:c.id });
  }

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{c.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{c.intentSummary}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2 py-1 rounded-full bg-blue-500/20 text-blue-600">{c.signal.text}</span>
          <span className="text-[11px] text-gray-500">{new Date().toLocaleTimeString("th-TH")}</span>
        </div>
      </div>

      {/* TL;DR + confidence */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm pr-4">{c.tldr}</p>
        <ConfidenceBar v={c.confidence}/>
      </div>

      {/* Toggle */}
      <div className="mt-2">
        <button className="text-xs text-blue-600 hover:underline" onClick={()=>toggleExpand(c.id)}>
          {expanded[c.id] ? "แสดงน้อยลง" : "แสดงรายละเอียดเพิ่มเติม"}
        </button>
      </div>

      {/* Error */}
      {errors[c.id] && <div className="mt-2 text-xs p-2 rounded bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300">{errors[c.id]}</div>}

      {/* Body */}
      {expanded[c.id] && (
        <div className="mt-3 space-y-4">
          {/* Chart */}
          <div className="rounded p-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700">
            <ChartLine points={series}/>
            <div className="text-[11px] text-gray-500 mt-1">Timeseries 15 วัน</div>
          </div>

          {/* CLI */}
          <div>
            <label className="text-xs font-semibold">CLI Snippet</label>
            <div className="flex items-center gap-2 mt-1">
              <input className="font-mono text-xs bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 w-full"
                     value={cli} onChange={e=>setCli(e.target.value)}/>
              <button className="px-2 py-1 text-xs rounded bg-blue-600 text-white" onClick={()=>runCLI(false)}>Run</button>
              <button className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700" onClick={()=>navigator.clipboard.writeText(cli)}>Copy</button>
              <button className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700" onClick={()=>runCLI(true)}>Dry-run</button>
            </div>
          </div>

          {/* Mermaid */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold">Mindmap / Mermaid</label>
              <div className="flex gap-1">
                {["preview","code","split"].map(v=>(
                  <button key={v} onClick={()=>setMerm(v as any)}
                          className={`text-[11px] px-2 py-0.5 rounded ${mermView===v?"bg-blue-600 text-white":"bg-gray-200 dark:bg-gray-700"}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className={`grid gap-2 ${mermView==="split"?"grid-cols-2":"grid-cols-1"} mt-1`}>
              {mermView!=="code" && <MermaidBlock code={c.mermaidCode}/>}
              {mermView!=="preview" && (
                <pre className="text-xs bg-gray-100 dark:bg-gray-700 rounded p-2 overflow-auto">
                  <code>{c.mermaidCode.trim()}</code>
                </pre>
              )}
            </div>
          </div>

          {/* Meta badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-[11px] px-2 py-1 rounded bg-yellow-500/20 text-yellow-700">Risk: {c.riskRating}</span>
            <span className="text-[11px] px-2 py-1 rounded bg-blue-500/20 text-blue-700">Impact: {c.impact.base}</span>
            <span className="text-[11px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">Cost: {c.cost.latency}</span>
            <span className="text-[11px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">Policy: {c.policyCheck.status}</span>
            <span className="text-[11px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">Explain: 3-sigma</span>
            <span className="text-[11px] px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">Undo: 30s</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded" onClick={apply}>Apply</button>
          <button className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-sm rounded">Drilldown ▾</button>
          <button className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-sm rounded" onClick={reject}>Reject</button>
          <button className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-sm rounded" onClick={()=>navigator.clipboard.writeText(JSON.stringify(c,null,2))}>Export</button>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-gray-500 font-mono" title={c.provenance.source}>{c.provenance.model}</p>
          <p className="text-[11px] text-gray-400 font-mono" title={c.audit.causalId}>{c.audit.eventId}</p>
        </div>
      </div>
    </div>
  );
}

export function CardsBoard() {
  const { cards, upsertCard } = useApp();

  // subscribe realtime
  useEffect(()=>{
    const unsub = MockRealtime.subscribeCards(
      (c)=>{ upsertCard(c); },
      (id)=>{ /* optional delete push */ }
    );
    // seed one mock card
    const seed: TCard = {
      id: "card-1",
      title: "BTC Breakout",
      intentSummary: "show_timeseries: BTC/USD price, 15d",
      tldr: "ทะลุ $75k พร้อมวอลุ่มสูง ฐานยังขาขึ้น",
      signal: { type:"breakout", text:"Breakout" },
      confidence: 92,
      provenance: { source:"data: ExchangeX @2025-09-25T12:00Z", model:"intent-v1.3", ttlMinutes:15, generatedAtISO:new Date().toISOString() },
      audit: { eventId:"evt_a1", causalId:"cau_x1" },
      cliSnippet: "aictl request-render --intent=show_timeseries --entity=BTC --metric=price --range=15d",
      mermaidCode: "graph TD; A[Start]-->B{Price > 75k?}; B--Yes-->C[Volume High]; C--Yes-->D[Breakout]; B--No-->E[Monitor];",
      riskRating: "Medium",
      impact: { bear:"-5%", base:"+12%", bull:"+25%" },
      cost: { latency:"150ms", tokens:250, calls:1 },
      policyCheck: { status:"Passed", details:"ok" },
      explainability: "3-sigma vs 30D avg",
      confidenceBreakdown: { intent:98, dataFreshness:95, model:89 },
      changeDelta: { adds:5, modifies:2, deletes:0 },
      undoPlan: "undo 30s",
      tags:["btc","price"]
    };
    MockRealtime.upsertCard(seed);
    return ()=>unsub();
  },[upsertCard]);

  const list = Object.values(cards);
  return (
    <div className="grid gap-4">
      {list.map(c => <AiCard key={c.id} id={c.id}/>)}
    </div>
  );
}