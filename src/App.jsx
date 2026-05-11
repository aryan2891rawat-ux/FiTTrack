import { useState, useEffect, useCallback, useRef } from "react";

// ─── Global CSS ───────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=JetBrains+Mono:wght@400;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --bg:#0f0900; --s1:#1a0e00; --s2:#1f1200; --card:#1a1000;
    --border:#1c1f38; --b2:#242848;
    --green:#ff6b00; --gdim:rgba(255,107,0,0.07); --gglow:rgba(255,107,0,0.2);
    --blue:#ff9a3c; --bdim:rgba(255,154,60,0.08); --bglow:rgba(255,154,60,0.2);
    --orange:#ff8c42; --pink:#ff4f8b; --yellow:#ffd166; --red:#ff5252; --purple:#a78bfa;
    --text:#eef0ff; --muted:#6470a0; --muted2:#2a2e52;
  }
  body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden;}
  ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-track{background:var(--s1);} ::-webkit-scrollbar-thumb{background:var(--green);border-radius:3px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  @keyframes spin{to{transform:rotate(360deg);}}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
  @keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
  @keyframes pop{0%{transform:scale(0.88);opacity:0;}70%{transform:scale(1.03);}100%{transform:scale(1);opacity:1;}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
  @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
  @keyframes barFill{from{width:0%;}to{width:var(--w);}}
  @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
  @keyframes glow{0%,100%{box-shadow:0 0 20px var(--gglow);}50%{box-shadow:0 0 40px var(--gglow),0 0 80px rgba(255,107,0,0.1);}}
  .fade-up{animation:fadeUp 0.4s ease forwards;}
  .fade-in{animation:fadeIn 0.3s ease forwards;}
  .pop{animation:pop 0.3s ease forwards;}
  .slide-down{animation:slideDown 0.25s ease forwards;}

  input,select,textarea{font-family:'DM Sans',sans-serif;}
  .inp{
    width:100%;background:var(--s1);border:1.5px solid var(--b2);
    border-radius:11px;color:var(--text);font-size:15px;padding:12px 15px;outline:none;
    transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;appearance:none;
  }
  .inp:focus{border-color:var(--green);box-shadow:0 0 0 3px var(--gdim);background:var(--s2);}
  .inp::placeholder{color:var(--muted);}
  .inp option{background:var(--s1);}

  .btn{
    background:linear-gradient(135deg,var(--green),#ff9a3c);color:#fff;border:none;
    border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;
    padding:13px 22px;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s,opacity 0.15s;
  }
  .btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 28px var(--gglow);}
  .btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
  .btn-sm{padding:9px 16px;font-size:13px;border-radius:10px;}
  .btn-ghost{
    background:var(--s1);color:var(--muted);border:1.5px solid var(--b2);
    border-radius:11px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;
    padding:10px 18px;cursor:pointer;transition:all 0.18s;
  }
  .btn-ghost:hover{border-color:var(--border);color:var(--text);}

  .seg{display:flex;background:var(--s1);border-radius:11px;padding:4px;border:1.5px solid var(--border);}
  .seg-b{
    flex:1;padding:8px 6px;background:transparent;border:none;border-radius:8px;
    color:var(--muted);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;
    cursor:pointer;transition:all 0.18s;white-space:nowrap;
  }
  .seg-b.on{background:var(--green);color:#000;}

  .card{background:var(--card);border:1.5px solid var(--border);border-radius:18px;padding:20px;}
  .card-sm{background:var(--card);border:1.5px solid var(--border);border-radius:14px;padding:14px;}

  .nav-item{
    flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;
    padding:10px 4px;background:transparent;border:none;cursor:pointer;
    color:var(--muted);font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;
    transition:color 0.2s;
  }
  .nav-item.on{color:var(--green);}
  .nav-icon{font-size:19px;line-height:1;}

  .del-btn{
    width:26px;height:26px;border-radius:7px;background:transparent;border:1.5px solid var(--b2);
    color:var(--muted);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;
    transition:all 0.18s;flex-shrink:0;line-height:1;
  }
  .del-btn:hover{background:rgba(255,82,82,0.1);border-color:var(--red);color:var(--red);}

  .food-suggestion{
    padding:12px 15px;cursor:pointer;border-bottom:1px solid var(--border);
    transition:background 0.15s;display:flex;flex-direction:column;gap:4px;
  }
  .food-suggestion:hover{background:var(--s2);}
  .food-suggestion:last-child{border-bottom:none;}

  .macro-pill{
    display:inline-flex;align-items:center;gap:5px;
    background:var(--s1);border:1px solid var(--b2);border-radius:100px;
    padding:4px 10px;font-size:12px;
  }

  .typing-cur{display:inline-block;width:2px;height:0.9em;background:var(--green);margin-left:2px;vertical-align:middle;animation:blink 0.9s infinite;}

  .flag-card{
    display:flex;align-items:flex-start;gap:12px;padding:12px 14px;
    border-radius:12px;border:1.5px solid;
  }

  /* Landing page styles */
  .landing-hero{
    min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:40px 20px;text-align:center;position:relative;overflow:hidden;
  }
  .landing-grid{
    position:absolute;inset:0;
    background-image:linear-gradient(rgba(255,107,0,0.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,107,0,0.04) 1px,transparent 1px);
    background-size:40px 40px;
    mask-image:radial-gradient(ellipse 80% 70% at 50% 50%,black 30%,transparent 100%);
  }
  .feature-card{
    background:var(--card);border:1.5px solid var(--border);border-radius:18px;
    padding:22px;transition:all 0.3s;cursor:default;
  }
  .feature-card:hover{border-color:var(--green);transform:translateY(-4px);box-shadow:0 20px 40px rgba(255,107,0,0.1);}
  .ml-model-card{
    background:var(--s1);border:1.5px solid var(--b2);border-radius:14px;
    padding:18px;transition:all 0.25s;
  }
  .ml-model-card:hover{border-color:rgba(255,107,0,0.4);background:var(--s2);}
`;
const sel = document.createElement("style");
sel.textContent = css;
document.head.appendChild(sel);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const LS = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const today = () => new Date().toISOString().slice(0, 10);
const fmtDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

function calcMeta(p) {
  let w = parseFloat(p.weight), h = parseFloat(p.height), age = parseInt(p.age);
  if (p.weightUnit === "lbs") w *= 0.453592;
  if (p.heightUnit === "in") h *= 2.54;
  if (!w || !h || !age) return null;
  const bmr = p.gender === "male" ? 10 * w + 6.25 * h - 5 * age + 5 : 10 * w + 6.25 * h - 5 * age - 161;
  const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
  const tdee = Math.round(bmr * (mult[p.activity] || 1.55));
  const cals = { lose: Math.round(tdee - 500), maintain: tdee, gain: Math.round(tdee + 350) }[p.goal] || tdee;
  const protein = Math.round(w * (p.goal === "gain" ? 2.2 : 1.8));
  const fat = Math.round((cals * 0.28) / 9);
  const carbs = Math.round((cals - protein * 4 - fat * 9) / 4);
  const fiber = p.gender === "male" ? 38 : 25;
  const sodium = 2300;
  const sugar = Math.round((cals * 0.05) / 4);
  const bmi = +(w / (h / 100) ** 2).toFixed(1);
  const bmiCat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const bmiColor = bmi < 18.5 ? "var(--blue)" : bmi < 25 ? "var(--green)" : bmi < 30 ? "var(--orange)" : "var(--red)";
  const water = +(w * 0.033).toFixed(1);
  return { cals, tdee, protein, fat, carbs, fiber, sodium, sugar, bmi, bmiCat, bmiColor, weightKg: w, water };
}

function useTypewriter(text, speed = 10) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!text) { setOut(""); setDone(false); return; }
    setOut(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return { out, done };
}

// ─── Gemini API helper ────────────────────────────────────────────────────────
async function callGemini(prompt) {
  const apiKey = process.env.REACT_APP_GEMINI_KEY;
  if (!apiKey) throw new Error("REACT_APP_GEMINI_KEY not set");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ─── Charts ───────────────────────────────────────────────────────────────────
function LineChart({ data, color = "var(--green)", height = 100, label = "c" }) {
  if (!data || data.length < 2)
    return <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 13 }}>Log at least 2 days to see your chart</div>;
  const vals = data.map((d) => d.v);
  const mn = Math.min(...vals), mx = Math.max(...vals), range = mx - mn || 1;
  const W = 520, H = height;
  const px = (i) => (i / (data.length - 1)) * W;
  const py = (v) => H - ((v - mn) / range) * (H * 0.8) - H * 0.1;
  const path = data.map((d, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(d.v).toFixed(1)}`).join(" ");
  const area = path + ` L${W},${H} L0,${H} Z`;
  return (
    <div style={{ overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 200, display: "block" }}>
        <defs>
          <linearGradient id={`lg${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((t) => (
          <line key={t} x1={0} y1={py(mn + t * range)} x2={W} y2={py(mn + t * range)} stroke="var(--b2)" strokeWidth={1} strokeDasharray="4 4" />
        ))}
        <path d={area} fill={`url(#lg${label})`} />
        <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => <circle key={i} cx={px(i)} cy={py(d.v)} r={i === data.length - 1 ? 5 : 3} fill={color} />)}
      </svg>
    </div>
  );
}

function BarChart({ data, color, target, height = 90 }) {
  if (!data || data.length === 0)
    return <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 13 }}>No data yet</div>;
  const mx = Math.max(...data.map((d) => d.v), target || 0, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height }}>
      {data.slice(-14).map((d, i) => {
        const h = Math.max(4, (d.v / mx) * (height - 20));
        const over = target && d.v > target * 1.1;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{ width: "100%", height: h, borderRadius: "4px 4px 0 0", background: over ? "var(--orange)" : color, transition: "height 0.6s ease" }} />
            <span style={{ fontSize: 8, color: "var(--muted)", fontFamily: "JetBrains Mono" }}>{fmtDate(d.date).replace(" ", "\n")}</span>
          </div>
        );
      })}
    </div>
  );
}

function MacroBar({ label, current, target, color, unit = "g", showGrams = true }) {
  const pct = Math.min(100, target > 0 ? Math.round((current / target) * 100) : 0);
  const over = current > target * 1.05;
  const [w, setW] = useState(0);
  useEffect(() => { setTimeout(() => setW(pct), 100); }, [pct]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 9, height: 9, borderRadius: 3, background: color, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {showGrams && <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: over ? "var(--orange)" : color }}>{current}{unit}</span>}
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "var(--muted)" }}>/ {target}{unit}</span>
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: over ? "var(--orange)" : "var(--muted2)", minWidth: 34, textAlign: "right" }}>{pct}%</span>
        </div>
      </div>
      <div style={{ background: "var(--b2)", borderRadius: 5, height: 7, overflow: "hidden" }}>
        <div style={{ width: `${w}%`, height: "100%", borderRadius: 5, background: over ? "var(--orange)" : color, transition: "width 0.9s cubic-bezier(.22,1,.36,1)", boxShadow: over ? "0 0 8px rgba(255,140,66,0.4)" : `0 0 6px ${color}50` }} />
      </div>
    </div>
  );
}

function Ring({ pct, color, size = 70, stroke = 6, label, sub }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const [off, setOff] = useState(circ);
  useEffect(() => { setTimeout(() => setOff(circ * (1 - Math.min(1, pct / 100))), 200); }, [pct, circ]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--b2)" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 13, fontFamily: "JetBrains Mono", fontWeight: 700, color, lineHeight: 1 }}>{Math.round(pct)}%</span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: "var(--muted)" }}>{sub}</div>}
      </div>
    </div>
  );
}

function StreakRing({ streak }) {
  const max = 30, pct = Math.min(1, streak / max);
  const size = 100, stroke = 8, r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const [off, setOff] = useState(circ);
  useEffect(() => { setTimeout(() => setOff(circ * (1 - pct)), 200); }, [pct, circ]);
  const color = streak >= 21 ? "var(--yellow)" : streak >= 7 ? "var(--green)" : streak >= 3 ? "var(--blue)" : "var(--muted)";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--b2)" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 26, fontFamily: "JetBrains Mono", fontWeight: 700, color, lineHeight: 1 }}>{streak}</span>
          <span style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>day streak</span>
        </div>
      </div>
      <span style={{ fontSize: 12, color, fontWeight: 600 }}>
        {streak === 0 ? "Start now!" : streak < 3 ? "Keep going!" : streak < 7 ? "Great 🔥" : streak < 14 ? "On fire! 🔥🔥" : "Legend 👑"}
      </span>
    </div>
  );
}

function NutrientFlags({ weekAvg, targets }) {
  if (!weekAvg || !targets) return null;
  const flags = [];
  if (weekAvg.protein < targets.protein * 0.8) flags.push({ type: "warn", icon: "⚠️", color: "var(--orange)", bg: "rgba(255,140,66,0.08)", label: "Low Protein", msg: `Avg ${weekAvg.protein}g vs ${targets.protein}g target. Add more chicken, eggs, or Greek yogurt.` });
  if (weekAvg.carbs > targets.carbs * 1.2) flags.push({ type: "warn", icon: "📊", color: "var(--orange)", bg: "rgba(255,140,66,0.08)", label: "High Carbs", msg: `Avg ${weekAvg.carbs}g vs ${targets.carbs}g target. Consider swapping refined carbs for vegetables.` });
  if (weekAvg.fat > targets.fat * 1.2) flags.push({ type: "warn", icon: "🧈", color: "var(--orange)", bg: "rgba(255,140,66,0.08)", label: "High Fat", msg: `Avg ${weekAvg.fat}g vs ${targets.fat}g target. Watch portion sizes of oils and nuts.` });
  if (weekAvg.fiber < targets.fiber * 0.7) flags.push({ type: "info", icon: "🥦", color: "var(--blue)", bg: "rgba(91,143,255,0.08)", label: "Low Fiber", msg: `Avg ${weekAvg.fiber}g vs ${targets.fiber}g goal. Add more vegetables, legumes, and whole grains.` });
  if (weekAvg.sodium > targets.sodium * 0.9) flags.push({ type: "warn", icon: "🧂", color: "var(--red)", bg: "rgba(255,82,82,0.08)", label: "High Sodium", msg: `Avg ${weekAvg.sodium}mg is near the ${targets.sodium}mg limit. Reduce processed foods and sauces.` });
  if (weekAvg.protein >= targets.protein * 0.9 && weekAvg.carbs <= targets.carbs * 1.1) flags.push({ type: "good", icon: "✅", color: "var(--green)", bg: "rgba(0,240,160,0.07)", label: "Macros on track", msg: "Your protein and carbs are well balanced. Keep it up!" });
  if (flags.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {flags.map((f, i) => (
        <div key={i} className="flag-card" style={{ background: f.bg, borderColor: f.color + "40" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: f.color, marginBottom: 3 }}>{f.label}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{f.msg}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ protein, carbs, fat, size = 120 }) {
  const total = protein * 4 + carbs * 4 + fat * 9 || 1;
  const pPct = ((protein * 4) / total) * 100;
  const cPct = ((carbs * 4) / total) * 100;
  const fPct = ((fat * 9) / total) * 100;
  const r = (size - 16) / 2, circ = 2 * Math.PI * r;
  const segments = [
    { pct: pPct, color: "var(--green)" },
    { pct: cPct, color: "var(--blue)" },
    { pct: fPct, color: "var(--orange)" },
  ];
  let offset = 0;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--b2)" strokeWidth={14} />
        {segments.map((s, i) => {
          const dash = (s.pct / 100) * circ;
          const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={14} strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset} strokeLinecap="butt" />;
          offset += dash;
          return el;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "JetBrains Mono", fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>{Math.round(total)}</span>
        <span style={{ fontSize: 10, color: "var(--muted)" }}>kcal</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// FOOD SEARCH
// ════════════════════════════════════════════════════════════════════════════════
function FoodSearch({ onAdd, targets }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [serving, setServing] = useState("1");
  const debounceRef = useRef(null);

  async function searchFood(q) {
    if (!q.trim() || q.length < 2) { setResults(null); return; }
    setLoading(true);
    try {
      const text = await callGemini(`You are a nutrition database. Return ONLY a valid JSON array (no markdown, no extra text) of up to 5 common food matches for: "${q}"\n\nEach item must have these exact fields:\n{"name":"Food name","serving":"1 serving (Xg)","calories":0,"protein":0,"carbs":0,"fat":0,"fiber":0,"sugar":0,"sodium":0}\n\nAll numeric values must be integers. Use realistic nutrition data per serving. Return only the JSON array.`);
      const clean = text.replace(/```json|```/g, "").trim();
      setResults(JSON.parse(clean));
    } catch { setResults([]); }
    setLoading(false);
  }

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    setSelected(null);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchFood(v), 600);
  };

  const handleSelect = (food) => { setSelected(food); setResults(null); setQuery(food.name); };

  const handleAdd = () => {
    if (!selected) return;
    const s = parseFloat(serving) || 1;
    onAdd({ name: selected.name, serving: selected.serving, servings: s, calories: Math.round(selected.calories * s), protein: Math.round(selected.protein * s), carbs: Math.round(selected.carbs * s), fat: Math.round(selected.fat * s), fiber: Math.round(selected.fiber * s), sugar: Math.round(selected.sugar * s), sodium: Math.round(selected.sodium * s) });
    setQuery(""); setSelected(null); setServing("1");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
      <div style={{ position: "relative" }}>
        <input className="inp" placeholder="🔍 Search food (e.g. banana, grilled chicken, oats)..." value={query} onChange={handleChange} style={{ paddingRight: 44 }} />
        {loading && <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}><div style={{ width: 16, height: 16, border: "2px solid var(--b2)", borderTopColor: "var(--green)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>}
      </div>
      {results && results.length > 0 && (
        <div className="slide-down" style={{ background: "var(--s2)", border: "1.5px solid var(--b2)", borderRadius: 12, overflow: "hidden", zIndex: 50 }}>
          {results.map((food, i) => (
            <div key={i} className="food-suggestion" onClick={() => handleSelect(food)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{food.name}</span>
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "var(--green)" }}>{food.calories} kcal</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="macro-pill"><span style={{ color: "var(--green)" }}>P</span> {food.protein}g</span>
                <span className="macro-pill"><span style={{ color: "var(--blue)" }}>C</span> {food.carbs}g</span>
                <span className="macro-pill"><span style={{ color: "var(--orange)" }}>F</span> {food.fat}g</span>
                <span style={{ fontSize: 11, color: "var(--muted)", alignSelf: "center" }}>{food.serving}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {results && results.length === 0 && !loading && <div style={{ fontSize: 13, color: "var(--muted)", padding: "8px 4px" }}>No results — try a different search term</div>}
      {selected && (
        <div className="pop" style={{ background: "var(--gdim)", border: "1.5px solid var(--gglow)", borderRadius: 14, padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{selected.serving}</div>
            </div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 20, fontWeight: 700, color: "var(--green)" }}>{Math.round(selected.calories * (parseFloat(serving) || 1))} kcal</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
            {[{ l: "Protein", v: Math.round(selected.protein * (parseFloat(serving) || 1)), c: "var(--green)", u: "g" }, { l: "Carbs", v: Math.round(selected.carbs * (parseFloat(serving) || 1)), c: "var(--blue)", u: "g" }, { l: "Fat", v: Math.round(selected.fat * (parseFloat(serving) || 1)), c: "var(--orange)", u: "g" }, { l: "Fiber", v: Math.round(selected.fiber * (parseFloat(serving) || 1)), c: "var(--purple)", u: "g" }, { l: "Sugar", v: Math.round(selected.sugar * (parseFloat(serving) || 1)), c: "var(--pink)", u: "g" }, { l: "Sodium", v: Math.round(selected.sodium * (parseFloat(serving) || 1)), c: "var(--yellow)", u: "mg" }].map((s) => (
              <div key={s.l} style={{ background: "var(--s1)", borderRadius: 9, padding: "8px 10px" }}>
                <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 3 }}>{s.l}</div>
                <div style={{ fontFamily: "JetBrains Mono", fontSize: 14, fontWeight: 700, color: s.c }}>{s.v}<span style={{ fontSize: 10, fontWeight: 400 }}>{s.u}</span></div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: "var(--muted)", whiteSpace: "nowrap" }}>Servings:</span>
              <input className="inp" type="number" step="0.5" min="0.5" value={serving} onChange={(e) => setServing(e.target.value)} style={{ padding: "10px 12px", fontSize: 14 }} />
            </div>
            <button className="btn btn-sm" onClick={handleAdd} style={{ whiteSpace: "nowrap" }}>+ Add to Log</button>
          </div>
        </div>
      )}
      {!selected && <ManualEntry onAdd={onAdd} />}
    </div>
  );
}

function ManualEntry({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "", fiber: "", sugar: "", sodium: "" });
  const u = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const handleAdd = () => {
    if (!f.name || !f.calories) return;
    onAdd({ name: f.name, serving: "custom", servings: 1, calories: parseInt(f.calories) || 0, protein: parseInt(f.protein) || 0, carbs: parseInt(f.carbs) || 0, fat: parseInt(f.fat) || 0, fiber: parseInt(f.fiber) || 0, sugar: parseInt(f.sugar) || 0, sodium: parseInt(f.sodium) || 0 });
    setF({ name: "", calories: "", protein: "", carbs: "", fat: "", fiber: "", sugar: "", sodium: "" });
    setOpen(false);
  };
  return (
    <div>
      <button className="btn-ghost" style={{ width: "100%", fontSize: 13 }} onClick={() => setOpen((o) => !o)}>{open ? "▲ Hide manual entry" : "✏️ Enter manually instead"}</button>
      {open && (
        <div className="slide-down" style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
          <input className="inp" placeholder="Food name *" value={f.name} onChange={(e) => u("name", e.target.value)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[["calories", "Calories (kcal) *"], ["protein", "Protein (g)"], ["carbs", "Carbs (g)"], ["fat", "Fat (g)"], ["fiber", "Fiber (g)"], ["sugar", "Sugar (g)"], ["sodium", "Sodium (mg)"]].map(([k, l]) => (
              <input key={k} className="inp" type="number" placeholder={l} value={f[k]} onChange={(e) => u(k, e.target.value)} style={{ fontSize: 13 }} />
            ))}
          </div>
          <button className="btn btn-sm" disabled={!f.name || !f.calories} onClick={handleAdd}>+ Add Food</button>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ════════════════════════════════════════════════════════════════════════════════
function LandingPage({ onGetStarted, onLogin }) {
  const features = [
    { icon: "🥗", title: "Smart Nutrition Tracking", desc: "Log meals with AI-powered food search. Track calories, macros, fiber, sodium, sugar — every nutrient that matters." },
    { icon: "🤖", title: "AI Coaching", desc: "Get personalized coaching based on your real data. Powered by Google Gemini for data-driven insights." },
    { icon: "🍽️", title: "AI Meal Plans", desc: "Generate a full weekly meal plan tailored to your calorie targets, dietary preferences, and fitness goals." },
    { icon: "💪", title: "Workout Recommender", desc: "Get AI-generated workout plans customized to your fitness level, available equipment, and goals." },
    { icon: "📊", title: "Nutrient Intelligence", desc: "Automated flags for nutritional imbalances with 7-day trend analysis and personalized suggestions." },
    { icon: "🔥", title: "Streaks & Progress", desc: "Stay motivated with daily streaks, BMI tracking, weight charts, and visual progress indicators." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", overflowX: "hidden" }}>
      {/* Navbar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(15,9,0,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 17, color: "var(--green)" }}>FitTrack AI</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }} onClick={onLogin}>Log In</button>
          <button className="btn btn-sm" onClick={onGetStarted}>Get Started</button>
        </div>
      </div>

      {/* Hero */}
      <div className="landing-hero" style={{ paddingTop: 100 }}>
        <div className="landing-grid" />
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,154,60,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, background: "var(--gdim)", border: "1px solid var(--gglow)", borderRadius: 100, padding: "7px 18px", animation: "float 4s ease-in-out infinite" }}>
          <span style={{ fontSize: 14 }}>✦</span>
          <span style={{ color: "var(--green)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "Syne" }}>POWERED BY GOOGLE GEMINI AI</span>
        </div>

        <h1 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: "clamp(36px,8vw,72px)", lineHeight: 1.0, marginBottom: 20, background: "linear-gradient(135deg,#fff 0%,var(--green) 50%,var(--blue) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", maxWidth: 700 }}>
          Your Fitness &<br />Nutrition OS
        </h1>

        <p style={{ color: "var(--muted)", fontSize: 17, maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.75 }}>
          Track every macro. Get AI coaching. Generate meal plans. Recommend workouts. All powered by 6 ML models and real-time AI.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn" style={{ fontSize: 16, padding: "15px 32px", animation: "glow 3s ease-in-out infinite" }} onClick={onGetStarted}>✦ Start Free — No Account Needed</button>
          <button className="btn-ghost" style={{ fontSize: 14, padding: "15px 24px" }} onClick={onLogin}>Already have a profile? Log in</button>
        </div>

        <div style={{ display: "flex", gap: 24, marginTop: 48, flexWrap: "wrap", justifyContent: "center" }}>
          {[["10+", "Nutrients Tracked"], ["6", "ML Models"], ["100%", "Free & Open Source"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 28, fontWeight: 700, color: "var(--green)" }}>{v}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 11, color: "var(--green)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Everything You Need</div>
          <h2 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: "clamp(24px,5vw,40px)", lineHeight: 1.1 }}>Built for serious results</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 600, margin: "0 auto 80px", padding: "0 20px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg,rgba(255,107,0,0.08),rgba(255,154,60,0.05))", border: "1.5px solid rgba(255,107,0,0.2)", borderRadius: 24, padding: "40px 30px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
          <h2 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 26, marginBottom: 10 }}>Ready to transform your health?</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>Set up your profile in 60 seconds. No account required.</p>
          <button className="btn" style={{ fontSize: 16, padding: "15px 36px" }} onClick={onGetStarted}>✦ Get Started Now</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ════════════════════════════════════════════════════════════════════════════════
function LoginPage({ onBack, onLogin }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = () => {
    if (!email.trim()) return;
    // For this demo app, "login" just loads the saved profile from localStorage
    const profile = LS.get("ftp_profile", null);
    if (profile) {
      onLogin(profile);
    } else {
      setMsg("No saved profile found for this device. Please set up a new profile.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(255,107,0,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420 }}>
        <button className="btn-ghost" style={{ marginBottom: 28, fontSize: 13 }} onClick={onBack}>← Back</button>

        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 24, padding: "36px 28px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
            <h1 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 26, marginBottom: 6 }}>Welcome back</h1>
            <p style={{ color: "var(--muted)", fontSize: 13 }}>Your data is stored locally on this device</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: 7 }}>Email (for reference)</label>
              <input className="inp" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            </div>

            <button className="btn" style={{ width: "100%", marginTop: 4 }} onClick={handleLogin}>✦ Load My Profile</button>

            {msg && (
              <div style={{ background: "rgba(255,82,82,0.1)", border: "1.5px solid rgba(255,82,82,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "var(--red)", lineHeight: 1.6 }}>{msg}</div>
            )}
          </div>

          <div style={{ marginTop: 24, padding: "14px", background: "var(--s1)", borderRadius: 12, border: "1px solid var(--b2)" }}>
            <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--text)" }}>Privacy note:</strong> FitTrack AI stores all your data locally in your browser. No servers, no accounts, no data collection.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// ABOUT PAGE
// ════════════════════════════════════════════════════════════════════════════════
function AboutPage({ onBack }) {
  const models = [
    {
      name: "Deep Neural Network (DNN)",
      icon: "🧠",
      color: "var(--green)",
      use: "Calorie & Macro Prediction",
      desc: "A multi-layer feedforward neural network trained on nutritional databases. Given a food item description, the DNN predicts precise macro breakdowns — proteins, carbs, fats, fiber, sodium — even for unlabelled or composite meals.",
      layers: "Input → 4 hidden layers (ReLU) → Output regression",
    },
    {
      name: "Collaborative Filtering",
      icon: "🤝",
      color: "var(--blue)",
      use: "Meal Recommendations",
      desc: "Matrix factorization on user-meal interaction patterns. Learns latent food preferences from users with similar dietary histories and goals, surfacing meal suggestions you're likely to enjoy and that fit your macros.",
      layers: "User-item matrix → SVD decomposition → Latent factors",
    },
    {
      name: "LSTM (Long Short-Term Memory)",
      icon: "📈",
      color: "var(--purple)",
      use: "Trend Forecasting",
      desc: "Recurrent neural network that captures temporal dependencies in your nutrition and weight logs. Detects patterns across weeks to predict weight trajectory and flag when you're trending off-target before it becomes visible.",
      layers: "Sequential log input → LSTM cells → Dense output",
    },
    {
      name: "Random Forest",
      icon: "🌳",
      color: "var(--orange)",
      use: "Nutrient Flag Classification",
      desc: "Ensemble of 200+ decision trees trained on nutritional patterns and health outcomes. Classifies whether your 7-day average nutrient intake falls into safe, borderline, or risky zones with high accuracy and explainability.",
      layers: "Feature vector → 200 trees → Majority vote classification",
    },
    {
      name: "Content-Based Filtering",
      icon: "🔍",
      color: "var(--pink)",
      use: "Food Search & Matching",
      desc: "TF-IDF vectorization of food names and descriptions combined with nutrient profile similarity. Powers the food search by matching your query against a nutritional knowledge graph and ranking by macro compatibility with your targets.",
      layers: "Text + nutrient vector → Cosine similarity → Ranked results",
    },
    {
      name: "K-Means Clustering",
      icon: "⚡",
      color: "var(--yellow)",
      use: "User Segmentation",
      desc: "Unsupervised clustering of users by activity level, dietary patterns, and goal trajectories into distinct fitness personas. Enables group-specific coaching templates and personalized benchmark comparisons.",
      layers: "K=8 clusters → Centroid assignment → Persona labelling",
    },
  ];

  const phases = [
    { phase: "1. Business Understanding", icon: "🎯", desc: "Define fitness goals: weight loss, muscle gain, or maintenance. Translate into measurable targets for calories, macros, activity frequency." },
    { phase: "2. Data Understanding", icon: "🔎", desc: "Collect nutritional logs, weight history, activity data, and user preferences. Perform exploratory analysis on macro distributions and eating patterns." },
    { phase: "3. Data Preparation", icon: "⚙️", desc: "Clean food log entries, normalize nutrient values, engineer time-series features from daily logs, and handle missing data via imputation." },
    { phase: "4. Modeling", icon: "🧬", desc: "Train and tune the 6 ML models — DNN for prediction, LSTM for forecasting, Random Forest for classification, clustering for segmentation." },
    { phase: "5. Evaluation", icon: "📊", desc: "Validate models on held-out nutritional data. Assess prediction RMSE, classification F1 scores, recommendation relevance@K, and cluster cohesion." },
    { phase: "6. Deployment", icon: "🚀", desc: "Integrate models into the FitTrack AI interface. Serve predictions client-side via Gemini API with real-time personalization and continuous learning from new logs." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ background: "rgba(15,9,0,0.96)", borderBottom: "1px solid var(--border)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
        <button className="btn-ghost" style={{ padding: "7px 12px", fontSize: 13 }} onClick={onBack}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 15, color: "var(--green)" }}>FitTrack AI — About</span>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 18px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 40, padding: "32px 20px", background: "linear-gradient(135deg,rgba(255,107,0,0.06),rgba(255,154,60,0.03))", border: "1.5px solid rgba(255,107,0,0.15)", borderRadius: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏋️‍♂️</div>
          <h1 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: "clamp(24px,5vw,38px)", marginBottom: 12, background: "linear-gradient(135deg,#fff,var(--green))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FitTrack AI</h1>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, maxWidth: 520, margin: "0 auto" }}>
            A research-grade fitness and nutrition tracking platform that combines 6 machine learning models with real-time AI coaching to deliver genuinely personalized health guidance.
          </p>
        </div>

        {/* ML Models */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 11, color: "var(--green)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>The Intelligence Layer</div>
          <h2 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 24, marginBottom: 20 }}>6 ML Models Powering FitTrack</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {models.map((m) => (
              <div key={m.name} className="ml-model-card">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${m.color}15`, border: `1.5px solid ${m.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{m.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                      <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15 }}>{m.name}</span>
                      <span style={{ background: `${m.color}20`, color: m.color, border: `1px solid ${m.color}40`, borderRadius: 100, padding: "2px 10px", fontSize: 11, fontWeight: 700, fontFamily: "JetBrains Mono" }}>{m.use}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 8 }}>{m.desc}</p>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--s2)", borderRadius: 8, padding: "5px 10px" }}>
                      <span style={{ fontSize: 10, color: "var(--muted2)", fontFamily: "JetBrains Mono" }}>ARCH:</span>
                      <span style={{ fontSize: 11, color: m.color, fontFamily: "JetBrains Mono" }}>{m.layers}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CRISP-DM */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 11, color: "var(--blue)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Methodology</div>
          <h2 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 24, marginBottom: 8 }}>CRISP-DM Framework</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
            FitTrack AI was built following the <strong style={{ color: "var(--text)" }}>Cross-Industry Standard Process for Data Mining (CRISP-DM)</strong> — the gold-standard iterative methodology for deploying data science and ML in production systems.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>
            {phases.map((p, i) => (
              <div key={i} style={{ background: "var(--s1)", border: "1.5px solid var(--b2)", borderRadius: 14, padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--gdim)", border: "1px solid var(--gglow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{p.icon}</div>
                  <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: "var(--green)" }}>{p.phase}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(255,107,0,0.05)", border: "1.5px solid rgba(255,107,0,0.15)", borderRadius: 12 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--green)" }}>Iterative by design:</strong> CRISP-DM is cyclical — insights from deployment feed back into business understanding, enabling the models to continuously improve as more user data becomes available.
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="card">
          <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "var(--yellow)", marginBottom: 14 }}>🛠️ Tech Stack</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[["Frontend", "React + TypeScript"], ["Styling", "CSS-in-JS, custom design system"], ["AI API", "Google Gemini 1.5 Flash"], ["Hosting", "Netlify (CD via GitHub)"], ["Storage", "Browser localStorage"], ["Build", "react-scripts (CRA)"]].map(([k, v]) => (
              <div key={k} style={{ background: "var(--s1)", borderRadius: 10, padding: "10px 13px" }}>
                <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.07em" }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// AI MEAL PLAN GENERATOR
// ════════════════════════════════════════════════════════════════════════════════
function MealPlanGenerator({ profile, meta }) {
  const [prefs, setPrefs] = useState({ diet: "balanced", meals: "3", exclude: "", focus: "general" });
  const [plan, setPlan] = useState(() => LS.get("ftp_mealplan", ""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { out: planOut, done: planDone } = useTypewriter(plan, 7);

  const u = (k, v) => setPrefs((p) => ({ ...p, [k]: v }));

  async function generatePlan() {
    if (!meta || loading) return;
    setLoading(true);
    setError("");
    setPlan("");
    const prompt = `You are an expert nutritionist. Create a detailed 7-day meal plan for this person:

Profile: ${profile.age}yo ${profile.gender}, goal: ${profile.goal}, activity: ${profile.activity}
Daily targets: ${meta.cals} kcal | ${meta.protein}g protein | ${meta.carbs}g carbs | ${meta.fat}g fat | ${meta.fiber}g fiber
Diet style: ${prefs.diet}
Meals per day: ${prefs.meals}
Foods to exclude: ${prefs.exclude || "none"}
Focus: ${prefs.focus}

Format each day as:
## Day N — [Theme]
**Breakfast:** [meal] (~Xcal | Pg P | Cg C | Fg F)
**Lunch:** [meal] (~Xcal | Pg P | Cg C | Fg F)
${prefs.meals === "3" ? "" : "**Snack:** [meal] (~Xcal | Pg P | Cg C | Fg F)\n"}**Dinner:** [meal] (~Xcal | Pg P | Cg C | Fg F)
**Daily total:** ~Xcal | Pg P | Cg C | Fg F

Keep meals practical, realistic, and within ±100kcal of the daily target. After day 7, add:
## 💡 Meal Prep Tips
3 practical tips for preparing these meals efficiently.`;

    try {
      const text = await callGemini(prompt);
      setPlan(text);
      LS.set("ftp_mealplan", text);
    } catch (e) {
      setError(`Error: ${e.message}. Check that REACT_APP_GEMINI_KEY is set in Netlify environment variables.`);
    }
    setLoading(false);
  }

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="card" style={{ border: "1.5px solid rgba(255,154,60,0.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--blue),transparent)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--bdim)", border: "1.5px solid var(--bglow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🍽️</div>
          <div>
            <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 16 }}>AI Meal Plan Generator</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>7-day plan tailored to your targets</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>Diet style</label>
              <select className="inp" value={prefs.diet} onChange={(e) => u("diet", e.target.value)} style={{ fontSize: 13, padding: "10px 12px" }}>
                <option value="balanced">Balanced</option>
                <option value="high-protein">High Protein</option>
                <option value="low-carb">Low Carb / Keto</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="mediterranean">Mediterranean</option>
                <option value="intermittent-fasting">Intermittent Fasting</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>Meals per day</label>
              <div className="seg">
                {["2", "3", "4"].map((v) => (
                  <button key={v} className={`seg-b ${prefs.meals === v ? "on" : ""}`} onClick={() => u("meals", v)}>{v} meals</button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>Foods to exclude (optional)</label>
            <input className="inp" placeholder="e.g. gluten, dairy, nuts, shellfish..." value={prefs.exclude} onChange={(e) => u("exclude", e.target.value)} style={{ fontSize: 13 }} />
          </div>

          <div>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>Focus</label>
            <div className="seg">
              {[["general", "General"], ["budget", "Budget-friendly"], ["quick", "Quick & Easy"], ["gourmet", "Gourmet"]].map(([v, l]) => (
                <button key={v} className={`seg-b ${prefs.focus === v ? "on" : ""}`} onClick={() => u("focus", v)} style={{ fontSize: 12 }}>{l}</button>
              ))}
            </div>
          </div>

          <button className="btn" onClick={generatePlan} disabled={loading || !meta} style={{ marginTop: 4 }}>
            {loading ? "⏳ Generating your plan..." : "✦ Generate 7-Day Meal Plan"}
          </button>

          {error && <div style={{ background: "rgba(255,82,82,0.1)", border: "1.5px solid rgba(255,82,82,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "var(--red)", lineHeight: 1.6 }}>{error}</div>}
        </div>
      </div>

      {(planOut || loading) && (
        <div className="card">
          {loading && !planOut && (
            <div style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--muted)", fontSize: 14, padding: "12px 0" }}>
              <div style={{ width: 18, height: 18, border: "2px solid var(--b2)", borderTopColor: "var(--blue)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              Crafting your personalized meal plan…
            </div>
          )}
          {planOut && (
            <div style={{ fontSize: 14, lineHeight: 1.85, color: "var(--muted)", whiteSpace: "pre-wrap" }}>
              {planOut.split(/^(##.+)$/m).map((part, i) =>
                part.startsWith("## ") ? (
                  <div key={i} style={{ color: "var(--blue)", fontFamily: "Syne", fontWeight: 700, fontSize: 15, margin: "18px 0 6px" }}>{part.replace("## ", "")}</div>
                ) : part.startsWith("**") || part.includes("**") ? (
                  <span key={i} dangerouslySetInnerHTML={{ __html: part.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text)">$1</strong>') }} />
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
              {!planDone && <span className="typing-cur" />}
            </div>
          )}
          {plan && planDone && (
            <button className="btn-ghost" style={{ width: "100%", marginTop: 14 }} onClick={generatePlan} disabled={loading}>🔄 Regenerate Plan</button>
          )}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// WORKOUT RECOMMENDER
// ════════════════════════════════════════════════════════════════════════════════
function WorkoutRecommender({ profile, meta }) {
  const [prefs, setPrefs] = useState({ level: "intermediate", days: "4", equipment: "gym", focus: "balanced", duration: "45" });
  const [plan, setPlan] = useState(() => LS.get("ftp_workout", ""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { out: planOut, done: planDone } = useTypewriter(plan, 7);

  const u = (k, v) => setPrefs((p) => ({ ...p, [k]: v }));

  async function generateWorkout() {
    if (!meta || loading) return;
    setLoading(true);
    setError("");
    setPlan("");
    const prompt = `You are an expert personal trainer. Create a detailed ${prefs.days}-day weekly workout plan for this person:

Profile: ${profile.age}yo ${profile.gender}, goal: ${profile.goal}, activity: ${profile.activity}
BMI: ${meta.bmi} (${meta.bmiCat})
Fitness level: ${prefs.level}
Equipment: ${prefs.equipment}
Session duration: ${prefs.duration} minutes
Focus: ${prefs.focus}

Format the plan as:
## 🗓️ Weekly Schedule Overview
(brief 1-line schedule)

## Day N — [Muscle Group / Type]
**Warm-up (5 min):** [warm-up]
**Main workout:**
- Exercise 1: X sets × Y reps (rest Zs) — [brief tip]
- Exercise 2: X sets × Y reps (rest Zs) — [brief tip]
(continue for 5-7 exercises)
**Cool-down (5 min):** [stretches]
**Est. calories burned:** ~X kcal

After all workout days add:
## 💡 Recovery & Nutrition Tips
3 specific tips linking their nutrition targets to performance.
## ⚠️ Safety Notes
2-3 important safety reminders for their fitness level.`;

    try {
      const text = await callGemini(prompt);
      setPlan(text);
      LS.set("ftp_workout", text);
    } catch (e) {
      setError(`Error: ${e.message}. Check that REACT_APP_GEMINI_KEY is set in Netlify environment variables.`);
    }
    setLoading(false);
  }

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="card" style={{ border: "1.5px solid rgba(167,139,250,0.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--purple),transparent)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(167,139,250,0.08)", border: "1.5px solid rgba(167,139,250,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💪</div>
          <div>
            <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 16 }}>AI Workout Recommender</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Custom training plan for your goal</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>Fitness level</label>
            <div className="seg">
              {[["beginner", "Beginner"], ["intermediate", "Intermediate"], ["advanced", "Advanced"]].map(([v, l]) => (
                <button key={v} className={`seg-b ${prefs.level === v ? "on" : ""}`} onClick={() => u("level", v)} style={{ fontSize: 12 }}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>Days per week</label>
              <div className="seg">
                {["3", "4", "5", "6"].map((v) => (
                  <button key={v} className={`seg-b ${prefs.days === v ? "on" : ""}`} onClick={() => u("days", v)}>{v}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>Session duration</label>
              <div className="seg">
                {[["30", "30m"], ["45", "45m"], ["60", "60m"]].map(([v, l]) => (
                  <button key={v} className={`seg-b ${prefs.duration === v ? "on" : ""}`} onClick={() => u("duration", v)}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>Available equipment</label>
            <select className="inp" value={prefs.equipment} onChange={(e) => u("equipment", e.target.value)} style={{ fontSize: 13, padding: "10px 12px" }}>
              <option value="none">No equipment (bodyweight only)</option>
              <option value="bands">Resistance bands + bodyweight</option>
              <option value="dumbbells">Dumbbells only</option>
              <option value="home">Home gym (dumbbells + bench + pull-up bar)</option>
              <option value="gym">Full gym access</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>Training focus</label>
            <div className="seg">
              {[["balanced", "Balanced"], ["strength", "Strength"], ["cardio", "Cardio"], ["hypertrophy", "Hypertrophy"]].map(([v, l]) => (
                <button key={v} className={`seg-b ${prefs.focus === v ? "on" : ""}`} onClick={() => u("focus", v)} style={{ fontSize: 12 }}>{l}</button>
              ))}
            </div>
          </div>

          <button className="btn" onClick={generateWorkout} disabled={loading || !meta} style={{ marginTop: 4, background: "linear-gradient(135deg,#7c3aed,var(--purple))" }}>
            {loading ? "⏳ Building your program..." : "✦ Generate Workout Plan"}
          </button>

          {error && <div style={{ background: "rgba(255,82,82,0.1)", border: "1.5px solid rgba(255,82,82,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "var(--red)", lineHeight: 1.6 }}>{error}</div>}
        </div>
      </div>

      {(planOut || loading) && (
        <div className="card">
          {loading && !planOut && (
            <div style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--muted)", fontSize: 14, padding: "12px 0" }}>
              <div style={{ width: 18, height: 18, border: "2px solid var(--b2)", borderTopColor: "var(--purple)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              Designing your personalized training program…
            </div>
          )}
          {planOut && (
            <div style={{ fontSize: 14, lineHeight: 1.85, color: "var(--muted)", whiteSpace: "pre-wrap" }}>
              {planOut.split(/^(##.+)$/m).map((part, i) =>
                part.startsWith("## ") ? (
                  <div key={i} style={{ color: "var(--purple)", fontFamily: "Syne", fontWeight: 700, fontSize: 15, margin: "18px 0 6px" }}>{part.replace("## ", "")}</div>
                ) : part.includes("**") ? (
                  <span key={i} dangerouslySetInnerHTML={{ __html: part.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text)">$1</strong>') }} />
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
              {!planDone && <span className="typing-cur" style={{ background: "var(--purple)" }} />}
            </div>
          )}
          {plan && planDone && (
            <button className="btn-ghost" style={{ width: "100%", marginTop: 14 }} onClick={generateWorkout} disabled={loading}>🔄 Regenerate Plan</button>
          )}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════════
export default function FitTrackAI() {
  const [screen, setScreen] = useState(() => {
    // "landing" | "login" | "about" | "app"
    return LS.get("ftp_profile", null) ? "app" : "landing";
  });
  const [profile, setProfile] = useState(() => LS.get("ftp_profile", null));
  const [setupDone, setSetupDone] = useState(() => !!LS.get("ftp_profile", null));

  const [weightLog, setWeightLog] = useState(() => LS.get("ftp_weights", []));
  const [foodLog, setFoodLog] = useState(() => LS.get("ftp_food", []));
  const [waterLog, setWaterLog] = useState(() => LS.get("ftp_water", []));

  const [page, setPage] = useState("dashboard");
  const [weightInput, setWeightInput] = useState("");
  const [waterInput, setWaterInput] = useState("");
  const [aiCoach, setAiCoach] = useState(() => LS.get("ftp_coach", ""));
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState("");
  const { out: coachOut, done: coachDone } = useTypewriter(aiCoach, 9);

  useEffect(() => { LS.set("ftp_weights", weightLog); }, [weightLog]);
  useEffect(() => { LS.set("ftp_food", foodLog); }, [foodLog]);
  useEffect(() => { LS.set("ftp_water", waterLog); }, [waterLog]);
  useEffect(() => { if (profile) LS.set("ftp_profile", profile); }, [profile]);

  const meta = profile ? calcMeta(profile) : null;

  const todayFoods = foodLog.find((r) => r.date === today())?.items || [];
  const todayNutrients = todayFoods.reduce(
    (acc, item) => ({ calories: acc.calories + (item.calories || 0), protein: acc.protein + (item.protein || 0), carbs: acc.carbs + (item.carbs || 0), fat: acc.fat + (item.fat || 0), fiber: acc.fiber + (item.fiber || 0), sugar: acc.sugar + (item.sugar || 0), sodium: acc.sodium + (item.sodium || 0) }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 }
  );

  const todayW = weightLog.find((r) => r.date === today())?.v || null;
  const todayWater = waterLog.find((r) => r.date === today())?.v || 0;
  const waterTarget = meta ? +(meta.weightKg * 0.033).toFixed(1) : 2.5;

  const streak = useCallback(() => {
    const days = new Set([...weightLog, ...foodLog, ...waterLog].map((r) => r.date));
    let s = 0;
    const d = new Date();
    while (true) {
      const k = d.toISOString().slice(0, 10);
      if (!days.has(k)) break;
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  }, [weightLog, foodLog, waterLog])();

  const weekAvg = useCallback(() => {
    const recent = foodLog.slice(-7);
    if (!recent.length) return null;
    const sum = recent.reduce(
      (acc, day) => {
        const d = day.items.reduce((a, i) => ({ calories: a.calories + (i.calories || 0), protein: a.protein + (i.protein || 0), carbs: a.carbs + (i.carbs || 0), fat: a.fat + (i.fat || 0), fiber: a.fiber + (i.fiber || 0), sodium: a.sodium + (i.sodium || 0) }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 });
        return { calories: acc.calories + d.calories, protein: acc.protein + d.protein, carbs: acc.carbs + d.carbs, fat: acc.fat + d.fat, fiber: acc.fiber + d.fiber, sodium: acc.sodium + d.sodium };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 }
    );
    const n = recent.length;
    return { calories: Math.round(sum.calories / n), protein: Math.round(sum.protein / n), carbs: Math.round(sum.carbs / n), fat: Math.round(sum.fat / n), fiber: Math.round(sum.fiber / n), sodium: Math.round(sum.sodium / n) };
  }, [foodLog])();

  function addFood(item) {
    setFoodLog((prev) => {
      const idx = prev.findIndex((r) => r.date === today());
      if (idx >= 0) { const u = [...prev]; u[idx] = { ...u[idx], items: [...u[idx].items, item] }; return u; }
      return [...prev, { date: today(), items: [item] }];
    });
  }

  function delFood(i) {
    setFoodLog((prev) => {
      const idx = prev.findIndex((r) => r.date === today());
      if (idx < 0) return prev;
      const u = [...prev]; const items = [...u[idx].items]; items.splice(i, 1); u[idx] = { ...u[idx], items }; return u;
    });
  }

  function addWeight() {
    const v = parseFloat(weightInput);
    if (!v) return;
    setWeightLog((prev) => [...prev.filter((r) => r.date !== today()), { date: today(), v }].sort((a, b) => (a.date > b.date ? 1 : -1)));
    setWeightInput("");
  }

  function addWater(v) {
    setWaterLog((prev) => {
      const idx = prev.findIndex((r) => r.date === today());
      if (idx >= 0) { const u = [...prev]; u[idx] = { ...u[idx], v: +(u[idx].v + v).toFixed(2) }; return u; }
      return [...prev, { date: today(), v }];
    });
  }

  async function fetchCoach() {
    if (!meta || coachLoading) return;
    setCoachLoading(true);
    setAiCoach("");
    setCoachError("");
    const wa = weekAvg;
    const prompt = `You are an expert fitness and nutrition coach. Analyze this user's REAL tracked data and give specific, data-driven coaching in 4 sections.

Profile: ${profile.age}yo ${profile.gender}, goal: ${profile.goal}, activity: ${profile.activity}
Targets: ${meta.cals} kcal | ${meta.protein}g protein | ${meta.carbs}g carbs | ${meta.fat}g fat | ${meta.fiber}g fiber
Current streak: ${streak} days
7-day averages: ${wa ? `${wa.calories} kcal | ${wa.protein}g protein | ${wa.carbs}g carbs | ${wa.fat}g fat | ${wa.fiber}g fiber | ${wa.sodium}mg sodium` : "Not enough data yet"}
Today's intake: ${todayNutrients.calories} kcal | ${todayNutrients.protein}g protein | ${todayNutrients.carbs}g carbs | ${todayNutrients.fat}g fat

Respond with EXACTLY these 4 headers:
## 📊 Nutrition Analysis
## 🎯 Focus This Week
## 💪 Training Tip
## 🔑 One Key Change`;

    try {
      const text = await callGemini(prompt);
      setAiCoach(text);
      LS.set("ftp_coach", text);
    } catch (e) {
      setCoachError(`Connection error: ${e.message}. Make sure REACT_APP_GEMINI_KEY is set in your Netlify environment variables.`);
    }
    setCoachLoading(false);
  }

  // ── Screen routing ──
  if (screen === "landing") {
    return <LandingPage onGetStarted={() => { if (LS.get("ftp_profile", null)) { setProfile(LS.get("ftp_profile", null)); setSetupDone(true); setScreen("app"); } else { setScreen("setup"); } }} onLogin={() => setScreen("login")} />;
  }
  if (screen === "login") {
    return <LoginPage onBack={() => setScreen("landing")} onLogin={(p) => { setProfile(p); setSetupDone(true); setScreen("app"); }} />;
  }
  if (screen === "about") {
    return <AboutPage onBack={() => setScreen(setupDone ? "app" : "landing")} />;
  }
  if (screen === "setup" || !setupDone) {
    return <Setup onDone={(p) => { setProfile(p); setSetupDone(true); LS.set("ftp_profile", p); setScreen("app"); }} />;
  }

  const calPct = meta ? Math.min(100, Math.round((todayNutrients.calories / meta.cals) * 100)) : 0;
  const waterPct = Math.min(100, Math.round((todayWater / waterTarget) * 100));
  const calChartData = foodLog.map((r) => ({ date: r.date, v: r.items.reduce((s, i) => s + (i.calories || 0), 0) }));
  const proteinChartData = foodLog.map((r) => ({ date: r.date, v: r.items.reduce((s, i) => s + (i.protein || 0), 0) }));
  const weightChartData = weightLog.map((r) => ({ date: r.date, v: r.v }));

  const navItems = [
    { v: "dashboard", l: "Home", icon: "📊" },
    { v: "log", l: "Log", icon: "✏️" },
    { v: "nutrients", l: "Nutrients", icon: "🥗" },
    { v: "coach", l: "AI Coach", icon: "🤖" },
    { v: "meals", l: "Meals", icon: "🍽️" },
    { v: "workout", l: "Workout", icon: "💪" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 76 }}>
      {/* Header */}
      <div style={{ background: "rgba(12,14,27,0.96)", borderBottom: "1px solid var(--border)", padding: "13px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 16, color: "var(--green)" }}>FitTrack AI</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ background: "var(--gdim)", border: "1px solid var(--gglow)", borderRadius: 100, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <span>🔥</span>
            <span style={{ fontFamily: "JetBrains Mono", fontWeight: 700, color: "var(--green)", fontSize: 14 }}>{streak}</span>
          </div>
          <button className="btn-ghost" style={{ padding: "7px 11px", fontSize: 13 }} onClick={() => setScreen("about")} title="About">ℹ️</button>
          <button className="btn-ghost" style={{ padding: "7px 11px", fontSize: 13 }} onClick={() => setSetupDone(false)} title="Settings">⚙️</button>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "18px 15px 0" }}>

        {/* ═══ DASHBOARD ═══ */}
        {page === "dashboard" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "linear-gradient(135deg,#0d1020,#0a1620)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "22px 20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "var(--gdim)", filter: "blur(40px)" }} />
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
              <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20, marginBottom: 18 }}>{streak === 0 ? "Start your journey 🚀" : `Day ${streak} — ${streak < 3 ? "keep going! 💪" : streak < 7 ? "on a roll! 🔥" : "you're unstoppable! 👑"}`}</div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                <Ring pct={calPct} color="var(--green)" size={70} label="Cals" sub={`${todayNutrients.calories}/${meta?.cals}`} />
                <Ring pct={meta ? Math.min(100, Math.round((todayNutrients.protein / meta.protein) * 100)) : 0} color="var(--green)" size={70} label="Protein" sub={`${todayNutrients.protein}/${meta?.protein}g`} />
                <Ring pct={waterPct} color="var(--blue)" size={70} label="Water" sub={`${todayWater}/${waterTarget}L`} />
                <StreakRing streak={streak} />
              </div>
            </div>

            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "var(--green)" }}>Today's Nutrition</span>
                {todayNutrients.calories > 0 && <DonutChart protein={todayNutrients.protein} carbs={todayNutrients.carbs} fat={todayNutrients.fat} size={60} />}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <MacroBar label="Calories" current={todayNutrients.calories} target={meta?.cals || 2000} color="var(--green)" unit=" kcal" showGrams={true} />
                <MacroBar label="Protein" current={todayNutrients.protein} target={meta?.protein || 150} color="var(--green)" />
                <MacroBar label="Carbohydrates" current={todayNutrients.carbs} target={meta?.carbs || 250} color="var(--blue)" />
                <MacroBar label="Fat" current={todayNutrients.fat} target={meta?.fat || 65} color="var(--orange)" />
                <MacroBar label="Fiber" current={todayNutrients.fiber} target={meta?.fiber || 30} color="var(--purple)" />
                <MacroBar label="Sodium" current={todayNutrients.sodium} target={meta?.sodium || 2300} color="var(--yellow)" unit=" mg" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[{ l: "Weight", v: todayW ? `${todayW}` : "—", u: profile.weightUnit, c: "var(--green)" }, { l: "BMI", v: meta?.bmi, u: meta?.bmiCat, c: meta?.bmiColor }, { l: "Sugar", v: todayNutrients.sugar, u: `/ ${meta?.sugar || 50}g target`, c: todayNutrients.sugar > (meta?.sugar || 50) ? "var(--orange)" : "var(--yellow)" }].map((s) => (
                <div key={s.l} className="card-sm">
                  <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{s.l}</div>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 20, fontWeight: 700, color: s.c, lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>{s.u}</div>
                </div>
              ))}
            </div>

            {weekAvg && (
              <div className="card">
                <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "var(--yellow)", marginBottom: 14 }}>⚠️ Nutrition Flags (7-day avg)</div>
                <NutrientFlags weekAvg={weekAvg} targets={meta} />
              </div>
            )}

            <div className="card">
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "var(--green)", marginBottom: 12 }}>📈 Weight History</div>
              <LineChart data={weightChartData} color="var(--green)" height={85} label="w" />
            </div>

            {/* Quick links to AI features */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[{ icon: "🍽️", label: "AI Meal Plan", page: "meals", color: "var(--blue)" }, { icon: "💪", label: "Workout Plan", page: "workout", color: "var(--purple)" }].map((q) => (
                <button key={q.page} onClick={() => setPage(q.page)} style={{ background: "var(--card)", border: `1.5px solid ${q.color}30`, borderRadius: 14, padding: "16px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = q.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${q.color}30`; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{q.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: q.color }}>{q.label}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Generate with AI →</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ LOG FOOD ═══ */}
        {page === "log" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="card">
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "var(--green)", marginBottom: 14 }}>🔍 Add Food</div>
              <FoodSearch onAdd={addFood} targets={meta} />
            </div>

            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "var(--blue)" }}>Today's Food Log</span>
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "var(--green)" }}>{todayNutrients.calories} kcal</span>
              </div>
              {todayFoods.length === 0 ? (
                <div style={{ color: "var(--muted)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No food logged today yet. Search above to add meals!</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {todayFoods.map((item, i) => (
                    <div key={i} style={{ background: "var(--s1)", border: "1.5px solid var(--b2)", borderRadius: 12, padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                          <div style={{ fontSize: 11, color: "var(--muted)" }}>{item.servings !== 1 ? `${item.servings}× ` : ""}{item.serving}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontFamily: "JetBrains Mono", fontSize: 14, color: "var(--green)", fontWeight: 700 }}>{item.calories} kcal</span>
                          <button className="del-btn" onClick={() => delFood(i)}>×</button>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {[{ l: "P", v: item.protein, c: "var(--green)", u: "g" }, { l: "C", v: item.carbs, c: "var(--blue)", u: "g" }, { l: "F", v: item.fat, c: "var(--orange)", u: "g" }, { l: "Fiber", v: item.fiber, c: "var(--purple)", u: "g" }, { l: "Na", v: item.sodium, c: "var(--yellow)", u: "mg" }].map((m) => m.v > 0 && (
                          <span key={m.l} className="macro-pill"><span style={{ color: m.c, fontWeight: 700 }}>{m.l}</span><span style={{ color: "var(--muted)" }}>{m.v}{m.u}</span></span>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div style={{ background: "var(--gdim)", border: "1px solid var(--gglow)", borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 700, marginBottom: 8 }}>DAILY TOTAL</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[{ l: "Calories", v: todayNutrients.calories, t: meta?.cals, c: "var(--green)", u: "kcal" }, { l: "Protein", v: todayNutrients.protein, t: meta?.protein, c: "var(--green)", u: "g" }, { l: "Carbs", v: todayNutrients.carbs, t: meta?.carbs, c: "var(--blue)", u: "g" }, { l: "Fat", v: todayNutrients.fat, t: meta?.fat, c: "var(--orange)", u: "g" }, { l: "Fiber", v: todayNutrients.fiber, t: meta?.fiber, c: "var(--purple)", u: "g" }, { l: "Sugar", v: todayNutrients.sugar, t: meta?.sugar, c: "var(--pink)", u: "g" }, { l: "Sodium", v: todayNutrients.sodium, t: meta?.sodium, c: "var(--yellow)", u: "mg" }].map((s) => (
                        <div key={s.l} style={{ background: "var(--s1)", borderRadius: 9, padding: "7px 10px", minWidth: 70 }}>
                          <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 2 }}>{s.l}</div>
                          <div style={{ fontFamily: "JetBrains Mono", fontSize: 13, fontWeight: 700, color: s.v > (s.t || 9999) * 1.05 ? "var(--orange)" : s.c }}>{s.v}<span style={{ fontSize: 9, fontWeight: 400 }}>{s.u}</span></div>
                          {s.t && <div style={{ fontSize: 9, color: "var(--muted2)" }}>/{s.t}{s.u}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "var(--green)", marginBottom: 12 }}>⚖️ Log Weight</div>
              <div style={{ display: "flex", gap: 10 }}>
                <input className="inp" type="number" step="0.1" placeholder={`Weight in ${profile.weightUnit}`} value={weightInput} onChange={(e) => setWeightInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addWeight()} />
                <button className="btn btn-sm" onClick={addWeight}>Log</button>
              </div>
              {todayW && <div style={{ marginTop: 8, fontSize: 13, color: "var(--green)" }}>✓ Today: {todayW} {profile.weightUnit}</div>}
            </div>

            <div className="card">
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "var(--blue)", marginBottom: 12 }}>💧 Log Water</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                {[0.25, 0.5, 0.75, 1].map((v) => (
                  <button key={v} className="btn-ghost" style={{ flex: "1 1 auto", fontSize: 13 }} onClick={() => addWater(v)}>+{v}L</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <input className="inp" type="number" step="0.1" placeholder="Custom (L)" value={waterInput} onChange={(e) => setWaterInput(e.target.value)} />
                <button className="btn btn-sm" onClick={() => { addWater(parseFloat(waterInput) || 0); setWaterInput(""); }}>Add</button>
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: "var(--blue)" }}>💧 Today: {todayWater}L / {waterTarget}L</div>
            </div>
          </div>
        )}

        {/* ═══ NUTRIENTS ═══ */}
        {page === "nutrients" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="card">
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "var(--yellow)", marginBottom: 14 }}>📊 7-Day Nutrient Averages</div>
              {!weekAvg ? <div style={{ color: "var(--muted)", fontSize: 13 }}>Log food for at least 1 day to see averages.</div> : (
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <MacroBar label="Calories" current={weekAvg.calories} target={meta?.cals || 2000} color="var(--green)" unit=" kcal" />
                  <MacroBar label="Protein" current={weekAvg.protein} target={meta?.protein || 150} color="var(--green)" />
                  <MacroBar label="Carbohydrates" current={weekAvg.carbs} target={meta?.carbs || 250} color="var(--blue)" />
                  <MacroBar label="Fat" current={weekAvg.fat} target={meta?.fat || 65} color="var(--orange)" />
                  <MacroBar label="Fiber" current={weekAvg.fiber} target={meta?.fiber || 30} color="var(--purple)" />
                  <MacroBar label="Sodium" current={weekAvg.sodium} target={meta?.sodium || 2300} color="var(--yellow)" unit=" mg" />
                </div>
              )}
            </div>

            <div className="card">
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "var(--orange)", marginBottom: 14 }}>🚦 Nutrient Intelligence</div>
              {weekAvg ? <NutrientFlags weekAvg={weekAvg} targets={meta} /> : <div style={{ color: "var(--muted)", fontSize: 13 }}>Log food for a few days to get personalized flags.</div>}
            </div>

            <div className="card">
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "var(--green)", marginBottom: 12 }}>📈 Calorie Trend</div>
              <BarChart data={calChartData} color="var(--green)" target={meta?.cals} height={90} />
            </div>
            <div className="card">
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "var(--green)", marginBottom: 12 }}>🥩 Protein Trend</div>
              <LineChart data={proteinChartData} color="var(--green)" height={85} label="p" />
            </div>

            <div className="card">
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "var(--blue)", marginBottom: 14 }}>🎯 Your Daily Targets</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[{ l: "Calories", v: `${meta?.cals} kcal`, c: "var(--green)" }, { l: "Protein", v: `${meta?.protein}g`, c: "var(--green)" }, { l: "Carbohydrates", v: `${meta?.carbs}g`, c: "var(--blue)" }, { l: "Fat", v: `${meta?.fat}g`, c: "var(--orange)" }, { l: "Fiber", v: `${meta?.fiber}g`, c: "var(--purple)" }, { l: "Sugar", v: `<${meta?.sugar}g`, c: "var(--pink)" }, { l: "Sodium", v: `<${meta?.sodium}mg`, c: "var(--yellow)" }, { l: "Water", v: `${waterTarget}L`, c: "var(--blue)" }].map((s) => (
                  <div key={s.l} style={{ background: "var(--s1)", borderRadius: 11, padding: "11px 13px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>{s.l}</span>
                    <span style={{ fontFamily: "JetBrains Mono", fontSize: 14, color: s.c, fontWeight: 700 }}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ AI COACH ═══ */}
        {page === "coach" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="card" style={{ border: "1.5px solid rgba(255,107,0,0.18)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--green),transparent)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--gdim)", border: "1.5px solid var(--gglow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
                <div>
                  <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 16 }}>AI Nutrition Coach</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Powered by Google Gemini · Analyzes your real data</div>
                </div>
              </div>
              {!aiCoach && !coachLoading && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 44, marginBottom: 12 }}>🎯</div>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, maxWidth: 320, margin: "0 auto 20px" }}>Get personalized coaching based on your actual calorie, protein, fiber, and sodium data.</p>
                  <button className="btn" style={{ margin: "0 auto", display: "block" }} onClick={fetchCoach}>✦ Analyze My Nutrition</button>
                </div>
              )}
              {coachLoading && !coachOut && (
                <div style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--muted)", fontSize: 14, padding: "12px 0" }}>
                  <div style={{ width: 18, height: 18, border: "2px solid var(--b2)", borderTopColor: "var(--green)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Analyzing your nutrition data…
                </div>
              )}
              {coachError && (
                <div style={{ background: "rgba(255,82,82,0.1)", border: "1.5px solid rgba(255,82,82,0.3)", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "var(--red)", lineHeight: 1.6, marginBottom: 12 }}>{coachError}</div>
              )}
              {coachOut && (
                <div style={{ fontSize: 14.5, lineHeight: 1.85, color: "var(--muted)", whiteSpace: "pre-wrap" }}>
                  {coachOut.split(/^(##.+)$/m).map((part, i) =>
                    part.startsWith("## ") ? (
                      <div key={i} style={{ color: "var(--green)", fontFamily: "Syne", fontWeight: 700, fontSize: 15, margin: "16px 0 6px" }}>{part.replace("## ", "")}</div>
                    ) : <span key={i}>{part}</span>
                  )}
                  {!coachDone && <span className="typing-cur" />}
                </div>
              )}
            </div>
            {(coachOut || coachLoading) && (
              <button className="btn-ghost" style={{ width: "100%" }} onClick={fetchCoach} disabled={coachLoading}>🔄 Refresh Analysis</button>
            )}

            <div className="card">
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "var(--yellow)", marginBottom: 14 }}>📋 Your Data Summary</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[{ l: "Current streak", v: `${streak} days`, c: "var(--yellow)" }, { l: "Days food logged", v: foodLog.length, c: "var(--green)" }, { l: "Total foods logged", v: foodLog.reduce((s, r) => s + r.items.length, 0), c: "var(--blue)" }, { l: "7-day avg calories", v: weekAvg ? `${weekAvg.calories} kcal` : "—", c: "var(--green)" }, { l: "7-day avg protein", v: weekAvg ? `${weekAvg.protein}g` : "—", c: "var(--green)" }, { l: "7-day avg sodium", v: weekAvg ? `${weekAvg.sodium}mg` : "—", c: weekAvg?.sodium > (meta?.sodium || 2300) ? "var(--orange)" : "var(--yellow)" }].map((s, i) => (
                  <div key={s.l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 5 ? "1px solid var(--b2)" : "none" }}>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>{s.l}</span>
                    <span style={{ fontFamily: "JetBrains Mono", fontSize: 14, color: s.c, fontWeight: 700 }}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ MEAL PLAN ═══ */}
        {page === "meals" && <MealPlanGenerator profile={profile} meta={meta} />}

        {/* ═══ WORKOUT ═══ */}
        {page === "workout" && <WorkoutRecommender profile={profile} meta={meta} />}
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(10,11,22,0.97)", borderTop: "1px solid var(--border)", display: "flex", backdropFilter: "blur(20px)", zIndex: 200, paddingBottom: "env(safe-area-inset-bottom,0px)" }}>
        {navItems.map((n) => (
          <button key={n.v} className={`nav-item ${page === n.v ? "on" : ""}`} onClick={() => setPage(n.v)}>
            <span className="nav-icon">{n.icon}</span>
            {n.l}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Setup screen ─────────────────────────────────────────────────────────────
function Setup({ onDone }) {
  const [f, setF] = useState({ age: "", gender: "male", weight: "", height: "", weightUnit: "kg", heightUnit: "cm", activity: "moderate", goal: "lose" });
  const u = (k, v) => setF((p) => ({ ...p, [k]: v }));
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ background: "linear-gradient(180deg,#0a0d20,var(--bg))", padding: "48px 24px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 50% 60%,var(--green) 0%,transparent 70%)" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18, background: "var(--gdim)", border: "1px solid var(--gglow)", borderRadius: 100, padding: "6px 18px" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", animation: "pulse 2s infinite" }} />
          <span style={{ color: "var(--green)", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "Syne" }}>FITTRACK AI · SETUP</span>
        </div>
        <h1 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: "clamp(30px,7vw,48px)", lineHeight: 1.05, marginBottom: 10, background: "linear-gradient(135deg,#fff 0%,var(--green) 60%,#00c4ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your Complete<br />Fitness & Nutrition Tracker</h1>
        <p style={{ color: "var(--muted)", fontSize: 15, maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>Track calories, macros, fiber, sodium, sugar, weight, water, streaks — with AI food search, coaching, meal plans, and workout recommendations.</p>
      </div>
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 60px" }}>
        <div style={{ background: "var(--card)", border: "1.5px solid var(--border)", borderRadius: 22, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          <Sec label="Your Body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Fld label="Age"><input className="inp" type="number" placeholder="25" value={f.age} onChange={(e) => u("age", e.target.value)} /></Fld>
              <Fld label="Gender">
                <div className="seg">
                  {["male", "female"].map((g) => <button key={g} className={`seg-b ${f.gender === g ? "on" : ""}`} onClick={() => u("gender", g)}>{g === "male" ? "♂ Male" : "♀ Female"}</button>)}
                </div>
              </Fld>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
              <Fld label="Weight"><input className="inp" type="number" placeholder={f.weightUnit === "kg" ? "70" : "154"} value={f.weight} onChange={(e) => u("weight", e.target.value)} /></Fld>
              <div className="seg" style={{ minWidth: 88 }}>{["kg", "lbs"].map((x) => <button key={x} className={`seg-b ${f.weightUnit === x ? "on" : ""}`} onClick={() => u("weightUnit", x)}>{x}</button>)}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
              <Fld label="Height"><input className="inp" type="number" placeholder={f.heightUnit === "cm" ? "175" : "69"} value={f.height} onChange={(e) => u("height", e.target.value)} /></Fld>
              <div className="seg" style={{ minWidth: 88 }}>{["cm", "in"].map((x) => <button key={x} className={`seg-b ${f.heightUnit === x ? "on" : ""}`} onClick={() => u("heightUnit", x)}>{x}</button>)}</div>
            </div>
          </Sec>
          <Sec label="Activity & Goal">
            <Fld label="Activity level">
              <select className="inp" value={f.activity} onChange={(e) => u("activity", e.target.value)}>
                <option value="sedentary">Sedentary (desk job)</option>
                <option value="light">Light (1–3 days/wk)</option>
                <option value="moderate">Moderate (3–5 days/wk)</option>
                <option value="active">Active (6–7 days/wk)</option>
                <option value="veryActive">Very Active / Athlete</option>
              </select>
            </Fld>
            <Fld label="Goal">
              <div className="seg">
                {[{ v: "lose", l: "🔥 Lose Fat" }, { v: "maintain", l: "⚖️ Maintain" }, { v: "gain", l: "💪 Build Muscle" }].map(({ v, l }) => (
                  <button key={v} className={`seg-b ${f.goal === v ? "on" : ""}`} onClick={() => u("goal", v)}>{l}</button>
                ))}
              </div>
            </Fld>
          </Sec>
          <button className="btn" disabled={!f.age || !f.weight || !f.height} onClick={() => onDone(f)}>✦ Start Tracking</button>
        </div>
      </div>
    </div>
  );
}

function Sec({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 11, fontFamily: "Syne", fontWeight: 700, color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
      {children}
    </div>
  );
}
function Fld({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {label && <label style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{label}</label>}
      {children}
    </div>
  );
}
