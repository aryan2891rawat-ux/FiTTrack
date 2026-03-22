import { useState, useEffect, useCallback, useRef } from "react";

// ─── Global CSS ───────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=JetBrains+Mono:wght@400;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --bg:#07080f; --s1:#0c0e1b; --s2:#11142a; --card:#121525;
    --border:#1c1f38; --b2:#242848;
    --green:#00f0a0; --gdim:rgba(0,240,160,0.07); --gglow:rgba(0,240,160,0.2);
    --blue:#5b8fff; --bdim:rgba(91,143,255,0.08); --bglow:rgba(91,143,255,0.2);
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
    background:linear-gradient(135deg,var(--green),#00c4a0);color:#000;border:none;
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
`;
const sel = document.createElement("style");
sel.textContent = css;
document.head.appendChild(sel);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const LS = {
  get: (k, d) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch {
      return d;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};
const today = () => new Date().toISOString().slice(0, 10);
const fmtDate = (d) =>
  new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

function calcMeta(p) {
  let w = parseFloat(p.weight),
    h = parseFloat(p.height),
    age = parseInt(p.age);
  if (p.weightUnit === "lbs") w *= 0.453592;
  if (p.heightUnit === "in") h *= 2.54;
  if (!w || !h || !age) return null;
  const bmr =
    p.gender === "male"
      ? 10 * w + 6.25 * h - 5 * age + 5
      : 10 * w + 6.25 * h - 5 * age - 161;
  const mult = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  const tdee = Math.round(bmr * (mult[p.activity] || 1.55));
  const cals =
    {
      lose: Math.round(tdee - 500),
      maintain: tdee,
      gain: Math.round(tdee + 350),
    }[p.goal] || tdee;
  const protein = Math.round(w * (p.goal === "gain" ? 2.2 : 1.8));
  const fat = Math.round((cals * 0.28) / 9);
  const carbs = Math.round((cals - protein * 4 - fat * 9) / 4);
  const fiber = p.gender === "male" ? 38 : 25;
  const sodium = 2300;
  const sugar = Math.round((cals * 0.05) / 4);
  const bmi = +(w / (h / 100) ** 2).toFixed(1);
  const bmiCat =
    bmi < 18.5
      ? "Underweight"
      : bmi < 25
      ? "Normal"
      : bmi < 30
      ? "Overweight"
      : "Obese";
  const bmiColor =
    bmi < 18.5
      ? "var(--blue)"
      : bmi < 25
      ? "var(--green)"
      : bmi < 30
      ? "var(--orange)"
      : "var(--red)";
  const water = +(w * 0.033).toFixed(1);
  return {
    cals,
    tdee,
    protein,
    fat,
    carbs,
    fiber,
    sodium,
    sugar,
    bmi,
    bmiCat,
    bmiColor,
    weightKg: w,
    water,
  };
}

function useTypewriter(text, speed = 10) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!text) {
      setOut("");
      setDone(false);
      return;
    }
    setOut("");
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return { out, done };
}

// ─── Charts ───────────────────────────────────────────────────────────────────
function LineChart({
  data,
  color = "var(--green)",
  height = 100,
  label = "c",
}) {
  if (!data || data.length < 2)
    return (
      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--muted)",
          fontSize: 13,
        }}
      >
        Log at least 2 days to see your chart
      </div>
    );
  const vals = data.map((d) => d.v);
  const mn = Math.min(...vals),
    mx = Math.max(...vals),
    range = mx - mn || 1;
  const W = 520,
    H = height;
  const px = (i) => (i / (data.length - 1)) * W;
  const py = (v) => H - ((v - mn) / range) * (H * 0.8) - H * 0.1;
  const path = data
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(d.v).toFixed(1)}`
    )
    .join(" ");
  const area = path + ` L${W},${H} L0,${H} Z`;
  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", minWidth: 200, display: "block" }}
      >
        <defs>
          <linearGradient id={`lg${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={0}
            y1={py(mn + t * range)}
            x2={W}
            y2={py(mn + t * range)}
            stroke="var(--b2)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}
        <path d={area} fill={`url(#lg${label})`} />
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => (
          <circle
            key={i}
            cx={px(i)}
            cy={py(d.v)}
            r={i === data.length - 1 ? 5 : 3}
            fill={color}
          />
        ))}
      </svg>
    </div>
  );
}

function BarChart({ data, color, target, height = 90 }) {
  if (!data || data.length === 0)
    return (
      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--muted)",
          fontSize: 13,
        }}
      >
        No data yet
      </div>
    );
  const mx = Math.max(...data.map((d) => d.v), target || 0, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height }}>
      {data.slice(-14).map((d, i) => {
        const h = Math.max(4, (d.v / mx) * (height - 20));
        const over = target && d.v > target * 1.1;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                width: "100%",
                height: h,
                borderRadius: "4px 4px 0 0",
                background: over ? "var(--orange)" : color,
                transition: "height 0.6s ease",
              }}
            />
            <span
              style={{
                fontSize: 8,
                color: "var(--muted)",
                fontFamily: "JetBrains Mono",
              }}
            >
              {fmtDate(d.date).replace(" ", "\n")}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Macro progress bar ───────────────────────────────────────────────────────
function MacroBar({
  label,
  current,
  target,
  color,
  unit = "g",
  showGrams = true,
}) {
  const pct = Math.min(
    100,
    target > 0 ? Math.round((current / target) * 100) : 0
  );
  const over = current > target * 1.05;
  const [w, setW] = useState(0);
  useEffect(() => {
    setTimeout(() => setW(pct), 100);
  }, [pct]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: 3,
              background: color,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {showGrams && (
            <span
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 12,
                color: over ? "var(--orange)" : color,
              }}
            >
              {current}
              {unit}
            </span>
          )}
          <span
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 11,
              color: "var(--muted)",
            }}
          >
            / {target}
            {unit}
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 11,
              color: over ? "var(--orange)" : "var(--muted2)",
              minWidth: 34,
              textAlign: "right",
            }}
          >
            {pct}%
          </span>
        </div>
      </div>
      <div
        style={{
          background: "var(--b2)",
          borderRadius: 5,
          height: 7,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${w}%`,
            height: "100%",
            borderRadius: 5,
            background: over ? "var(--orange)" : color,
            transition: "width 0.9s cubic-bezier(.22,1,.36,1)",
            boxShadow: over
              ? "0 0 8px rgba(255,140,66,0.4)"
              : `0 0 6px ${color}50`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Ring gauge ───────────────────────────────────────────────────────────────
function Ring({ pct, color, size = 70, stroke = 6, label, sub }) {
  const r = (size - stroke) / 2,
    circ = 2 * Math.PI * r;
  const [off, setOff] = useState(circ);
  useEffect(() => {
    setTimeout(() => setOff(circ * (1 - Math.min(1, pct / 100))), 200);
  }, [pct, circ]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--b2)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={off}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)",
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontFamily: "JetBrains Mono",
              fontWeight: 700,
              color,
              lineHeight: 1,
            }}
          >
            {Math.round(pct)}%
          </span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color }}>{label}</div>
        {sub && (
          <div style={{ fontSize: 10, color: "var(--muted)" }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

// ─── Streak ring ──────────────────────────────────────────────────────────────
function StreakRing({ streak }) {
  const max = 30,
    pct = Math.min(1, streak / max);
  const size = 100,
    stroke = 8,
    r = (size - stroke) / 2,
    circ = 2 * Math.PI * r;
  const [off, setOff] = useState(circ);
  useEffect(() => {
    setTimeout(() => setOff(circ * (1 - pct)), 200);
  }, [pct, circ]);
  const color =
    streak >= 21
      ? "var(--yellow)"
      : streak >= 7
      ? "var(--green)"
      : streak >= 3
      ? "var(--blue)"
      : "var(--muted)";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--b2)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={off}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)",
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontFamily: "JetBrains Mono",
              fontWeight: 700,
              color,
              lineHeight: 1,
            }}
          >
            {streak}
          </span>
          <span style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>
            day streak
          </span>
        </div>
      </div>
      <span style={{ fontSize: 12, color, fontWeight: 600 }}>
        {streak === 0
          ? "Start now!"
          : streak < 3
          ? "Keep going!"
          : streak < 7
          ? "Great 🔥"
          : streak < 14
          ? "On fire! 🔥🔥"
          : "Legend 👑"}
      </span>
    </div>
  );
}

// ─── Nutrient flags ───────────────────────────────────────────────────────────
function NutrientFlags({ weekAvg, targets }) {
  if (!weekAvg || !targets) return null;
  const flags = [];
  if (weekAvg.protein < targets.protein * 0.8)
    flags.push({
      type: "warn",
      icon: "⚠️",
      color: "var(--orange)",
      bg: "rgba(255,140,66,0.08)",
      label: "Low Protein",
      msg: `Avg ${weekAvg.protein}g vs ${targets.protein}g target. Add more chicken, eggs, or Greek yogurt.`,
    });
  if (weekAvg.carbs > targets.carbs * 1.2)
    flags.push({
      type: "warn",
      icon: "📊",
      color: "var(--orange)",
      bg: "rgba(255,140,66,0.08)",
      label: "High Carbs",
      msg: `Avg ${weekAvg.carbs}g vs ${targets.carbs}g target. Consider swapping refined carbs for vegetables.`,
    });
  if (weekAvg.fat > targets.fat * 1.2)
    flags.push({
      type: "warn",
      icon: "🧈",
      color: "var(--orange)",
      bg: "rgba(255,140,66,0.08)",
      label: "High Fat",
      msg: `Avg ${weekAvg.fat}g vs ${targets.fat}g target. Watch portion sizes of oils and nuts.`,
    });
  if (weekAvg.fiber < targets.fiber * 0.7)
    flags.push({
      type: "info",
      icon: "🥦",
      color: "var(--blue)",
      bg: "rgba(91,143,255,0.08)",
      label: "Low Fiber",
      msg: `Avg ${weekAvg.fiber}g vs ${targets.fiber}g goal. Add more vegetables, legumes, and whole grains.`,
    });
  if (weekAvg.sodium > targets.sodium * 0.9)
    flags.push({
      type: "warn",
      icon: "🧂",
      color: "var(--red)",
      bg: "rgba(255,82,82,0.08)",
      label: "High Sodium",
      msg: `Avg ${weekAvg.sodium}mg is near the ${targets.sodium}mg limit. Reduce processed foods and sauces.`,
    });
  if (
    weekAvg.protein >= targets.protein * 0.9 &&
    weekAvg.carbs <= targets.carbs * 1.1
  )
    flags.push({
      type: "good",
      icon: "✅",
      color: "var(--green)",
      bg: "rgba(0,240,160,0.07)",
      label: "Macros on track",
      msg: "Your protein and carbs are well balanced. Keep it up!",
    });
  if (flags.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {flags.map((f, i) => (
        <div
          key={i}
          className="flag-card"
          style={{ background: f.bg, borderColor: f.color + "40" }}
        >
          <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: f.color,
                marginBottom: 3,
              }}
            >
              {f.label}
            </div>
            <div
              style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}
            >
              {f.msg}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
function DonutChart({ protein, carbs, fat, size = 120 }) {
  const total = protein * 4 + carbs * 4 + fat * 9 || 1;
  const pPct = ((protein * 4) / total) * 100;
  const cPct = ((carbs * 4) / total) * 100;
  const fPct = ((fat * 9) / total) * 100;
  const r = (size - 16) / 2,
    circ = 2 * Math.PI * r;
  const segments = [
    { pct: pPct, color: "var(--green)", label: "P" },
    { pct: cPct, color: "var(--blue)", label: "C" },
    { pct: fPct, color: "var(--orange)", label: "F" },
  ];
  let offset = 0;
  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--b2)"
          strokeWidth={14}
        />
        {segments.map((s, i) => {
          const dash = (s.pct / 100) * circ;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={14}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--text)",
            lineHeight: 1,
          }}
        >
          {Math.round(total)}
        </span>
        <span style={{ fontSize: 10, color: "var(--muted)" }}>kcal</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// FOOD SEARCH COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
function FoodSearch({ onAdd, targets }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [serving, setServing] = useState("1");
  const debounceRef = useRef(null);

  async function searchFood(q) {
    if (!q.trim() || q.length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [
            {
              role: "user",
              content: `You are a nutrition database. Return ONLY a valid JSON array (no markdown, no extra text) of up to 5 common food matches for: "${q}"

Each item must have these exact fields:
{"name":"Food name","serving":"1 serving (Xg)","calories":0,"protein":0,"carbs":0,"fat":0,"fiber":0,"sugar":0,"sodium":0}

All numeric values must be integers. Use realistic nutrition data per serving. Return only the JSON array.`,
            },
          ],
        }),
      });
      const data = await res.json();
      const raw = data.content?.map((b) => b.text || "").join("") || "[]";
      const clean = raw.replace(/```json|```/g, "").trim();
      setResults(JSON.parse(clean));
    } catch {
      setResults([]);
    }
    setLoading(false);
  }

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    setSelected(null);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchFood(v), 600);
  };

  const handleSelect = (food) => {
    setSelected(food);
    setResults(null);
    setQuery(food.name);
  };

  const handleAdd = () => {
    if (!selected) return;
    const s = parseFloat(serving) || 1;
    onAdd({
      name: selected.name,
      serving: selected.serving,
      servings: s,
      calories: Math.round(selected.calories * s),
      protein: Math.round(selected.protein * s),
      carbs: Math.round(selected.carbs * s),
      fat: Math.round(selected.fat * s),
      fiber: Math.round(selected.fiber * s),
      sugar: Math.round(selected.sugar * s),
      sodium: Math.round(selected.sodium * s),
    });
    setQuery("");
    setSelected(null);
    setServing("1");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
      }}
    >
      <div style={{ position: "relative" }}>
        <input
          className="inp"
          placeholder="🔍 Search food (e.g. banana, grilled chicken, oats)..."
          value={query}
          onChange={handleChange}
          style={{ paddingRight: 44 }}
        />
        {loading && (
          <div
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                border: "2px solid var(--b2)",
                borderTopColor: "var(--green)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          </div>
        )}
      </div>

      {/* Dropdown results */}
      {results && results.length > 0 && (
        <div
          className="slide-down"
          style={{
            background: "var(--s2)",
            border: "1.5px solid var(--b2)",
            borderRadius: 12,
            overflow: "hidden",
            zIndex: 50,
          }}
        >
          {results.map((food, i) => (
            <div
              key={i}
              className="food-suggestion"
              onClick={() => handleSelect(food)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  {food.name}
                </span>
                <span
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 13,
                    color: "var(--green)",
                  }}
                >
                  {food.calories} kcal
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="macro-pill">
                  <span style={{ color: "var(--green)" }}>P</span>{" "}
                  {food.protein}g
                </span>
                <span className="macro-pill">
                  <span style={{ color: "var(--blue)" }}>C</span> {food.carbs}g
                </span>
                <span className="macro-pill">
                  <span style={{ color: "var(--orange)" }}>F</span> {food.fat}g
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    alignSelf: "center",
                  }}
                >
                  {food.serving}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {results && results.length === 0 && !loading && (
        <div
          style={{ fontSize: 13, color: "var(--muted)", padding: "8px 4px" }}
        >
          No results — try a different search term
        </div>
      )}

      {/* Selected food */}
      {selected && (
        <div
          className="pop"
          style={{
            background: "var(--gdim)",
            border: "1.5px solid var(--gglow)",
            borderRadius: 14,
            padding: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                {selected.name}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                {selected.serving}
              </div>
            </div>
            <div
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--green)",
              }}
            >
              {Math.round(selected.calories * (parseFloat(serving) || 1))} kcal
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 8,
              marginBottom: 14,
            }}
          >
            {[
              {
                l: "Protein",
                v: Math.round(selected.protein * (parseFloat(serving) || 1)),
                c: "var(--green)",
                u: "g",
              },
              {
                l: "Carbs",
                v: Math.round(selected.carbs * (parseFloat(serving) || 1)),
                c: "var(--blue)",
                u: "g",
              },
              {
                l: "Fat",
                v: Math.round(selected.fat * (parseFloat(serving) || 1)),
                c: "var(--orange)",
                u: "g",
              },
              {
                l: "Fiber",
                v: Math.round(selected.fiber * (parseFloat(serving) || 1)),
                c: "var(--purple)",
                u: "g",
              },
              {
                l: "Sugar",
                v: Math.round(selected.sugar * (parseFloat(serving) || 1)),
                c: "var(--pink)",
                u: "g",
              },
              {
                l: "Sodium",
                v: Math.round(selected.sodium * (parseFloat(serving) || 1)),
                c: "var(--yellow)",
                u: "mg",
              },
            ].map((s) => (
              <div
                key={s.l}
                style={{
                  background: "var(--s1)",
                  borderRadius: 9,
                  padding: "8px 10px",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--muted)",
                    marginBottom: 3,
                  }}
                >
                  {s.l}
                </div>
                <div
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 14,
                    fontWeight: 700,
                    color: s.c,
                  }}
                >
                  {s.v}
                  <span style={{ fontSize: 10, fontWeight: 400 }}>{s.u}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div
              style={{ display: "flex", flex: 1, alignItems: "center", gap: 8 }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  whiteSpace: "nowrap",
                }}
              >
                Servings:
              </span>
              <input
                className="inp"
                type="number"
                step="0.5"
                min="0.5"
                value={serving}
                onChange={(e) => setServing(e.target.value)}
                style={{ padding: "10px 12px", fontSize: 14 }}
              />
            </div>
            <button
              className="btn btn-sm"
              onClick={handleAdd}
              style={{ whiteSpace: "nowrap" }}
            >
              + Add to Log
            </button>
          </div>
        </div>
      )}

      {/* Manual entry fallback */}
      {!selected && <ManualEntry onAdd={onAdd} />}
    </div>
  );
}

function ManualEntry({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    sugar: "",
    sodium: "",
  });
  const u = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const handleAdd = () => {
    if (!f.name || !f.calories) return;
    onAdd({
      name: f.name,
      serving: "custom",
      servings: 1,
      calories: parseInt(f.calories) || 0,
      protein: parseInt(f.protein) || 0,
      carbs: parseInt(f.carbs) || 0,
      fat: parseInt(f.fat) || 0,
      fiber: parseInt(f.fiber) || 0,
      sugar: parseInt(f.sugar) || 0,
      sodium: parseInt(f.sodium) || 0,
    });
    setF({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      fiber: "",
      sugar: "",
      sodium: "",
    });
    setOpen(false);
  };
  return (
    <div>
      <button
        className="btn-ghost"
        style={{ width: "100%", fontSize: 13 }}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "▲ Hide manual entry" : "✏️ Enter manually instead"}
      </button>
      {open && (
        <div
          className="slide-down"
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <input
            className="inp"
            placeholder="Food name *"
            value={f.name}
            onChange={(e) => u("name", e.target.value)}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            {[
              ["calories", "Calories (kcal) *"],
              ["protein", "Protein (g)"],
              ["carbs", "Carbs (g)"],
              ["fat", "Fat (g)"],
              ["fiber", "Fiber (g)"],
              ["sugar", "Sugar (g)"],
              ["sodium", "Sodium (mg)"],
            ].map(([k, l]) => (
              <input
                key={k}
                className="inp"
                type="number"
                placeholder={l}
                value={f[k]}
                onChange={(e) => u(k, e.target.value)}
                style={{ fontSize: 13 }}
              />
            ))}
          </div>
          <button
            className="btn btn-sm"
            disabled={!f.name || !f.calories}
            onClick={handleAdd}
          >
            + Add Food
          </button>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════════
export default function FitTrackAI() {
  const [profile, setProfile] = useState(() => LS.get("ftp_profile", null));
  const [setupDone, setSetupDone] = useState(
    () => !!LS.get("ftp_profile", null)
  );

  // Logs — each calorie entry now has full nutrients
  const [weightLog, setWeightLog] = useState(() => LS.get("ftp_weights", []));
  const [foodLog, setFoodLog] = useState(() => LS.get("ftp_food", [])); // [{date, items:[{name,calories,protein,carbs,fat,fiber,sugar,sodium,serving,servings}]}]
  const [waterLog, setWaterLog] = useState(() => LS.get("ftp_water", []));

  const [page, setPage] = useState("dashboard");
  const [weightInput, setWeightInput] = useState("");
  const [waterInput, setWaterInput] = useState("");
  const [aiCoach, setAiCoach] = useState(() => LS.get("ftp_coach", ""));
  const [coachLoading, setCoachLoading] = useState(false);
  const { out: coachOut, done: coachDone } = useTypewriter(aiCoach, 9);

  useEffect(() => {
    LS.set("ftp_weights", weightLog);
  }, [weightLog]);
  useEffect(() => {
    LS.set("ftp_food", foodLog);
  }, [foodLog]);
  useEffect(() => {
    LS.set("ftp_water", waterLog);
  }, [waterLog]);
  useEffect(() => {
    if (profile) LS.set("ftp_profile", profile);
  }, [profile]);

  const meta = profile ? calcMeta(profile) : null;

  // ── Derived today ──
  const todayFoods = foodLog.find((r) => r.date === today())?.items || [];
  const todayNutrients = todayFoods.reduce(
    (acc, item) => ({
      calories: acc.calories + (item.calories || 0),
      protein: acc.protein + (item.protein || 0),
      carbs: acc.carbs + (item.carbs || 0),
      fat: acc.fat + (item.fat || 0),
      fiber: acc.fiber + (item.fiber || 0),
      sugar: acc.sugar + (item.sugar || 0),
      sodium: acc.sodium + (item.sodium || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 }
  );

  const todayW = weightLog.find((r) => r.date === today())?.v || null;
  const todayWater = waterLog.find((r) => r.date === today())?.v || 0;
  const waterTarget = meta ? +(meta.weightKg * 0.033).toFixed(1) : 2.5;

  // ── Streak ──
  const streak = useCallback(() => {
    const days = new Set(
      [...weightLog, ...foodLog, ...waterLog].map((r) => r.date)
    );
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

  // ── 7-day average nutrients ──
  const weekAvg = useCallback(() => {
    const recent = foodLog.slice(-7);
    if (!recent.length) return null;
    const sum = recent.reduce(
      (acc, day) => {
        const d = day.items.reduce(
          (a, i) => ({
            calories: a.calories + (i.calories || 0),
            protein: a.protein + (i.protein || 0),
            carbs: a.carbs + (i.carbs || 0),
            fat: a.fat + (i.fat || 0),
            fiber: a.fiber + (i.fiber || 0),
            sodium: a.sodium + (i.sodium || 0),
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 }
        );
        return {
          calories: acc.calories + d.calories,
          protein: acc.protein + d.protein,
          carbs: acc.carbs + d.carbs,
          fat: acc.fat + d.fat,
          fiber: acc.fiber + d.fiber,
          sodium: acc.sodium + d.sodium,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 }
    );
    const n = recent.length;
    return {
      calories: Math.round(sum.calories / n),
      protein: Math.round(sum.protein / n),
      carbs: Math.round(sum.carbs / n),
      fat: Math.round(sum.fat / n),
      fiber: Math.round(sum.fiber / n),
      sodium: Math.round(sum.sodium / n),
    };
  }, [foodLog])();

  // ── Add food ──
  function addFood(item) {
    setFoodLog((prev) => {
      const idx = prev.findIndex((r) => r.date === today());
      if (idx >= 0) {
        const u = [...prev];
        u[idx] = { ...u[idx], items: [...u[idx].items, item] };
        return u;
      }
      return [...prev, { date: today(), items: [item] }];
    });
  }

  function delFood(i) {
    setFoodLog((prev) => {
      const idx = prev.findIndex((r) => r.date === today());
      if (idx < 0) return prev;
      const u = [...prev];
      const items = [...u[idx].items];
      items.splice(i, 1);
      u[idx] = { ...u[idx], items };
      return u;
    });
  }

  function addWeight() {
    const v = parseFloat(weightInput);
    if (!v) return;
    setWeightLog((prev) =>
      [...prev.filter((r) => r.date !== today()), { date: today(), v }].sort(
        (a, b) => (a.date > b.date ? 1 : -1)
      )
    );
    setWeightInput("");
  }

  function addWater(v) {
    setWaterLog((prev) => {
      const idx = prev.findIndex((r) => r.date === today());
      if (idx >= 0) {
        const u = [...prev];
        u[idx] = { ...u[idx], v: +(u[idx].v + v).toFixed(2) };
        return u;
      }
      return [...prev, { date: today(), v }];
    });
  }

  async function fetchCoach() {
    if (!meta || coachLoading) return;
    setCoachLoading(true);
    setAiCoach("");
    const wa = weekAvg;
    const prompt = `You are an expert fitness and nutrition coach. Analyze this user's REAL tracked data and give specific, data-driven coaching in 4 sections.

Profile: ${profile.age}yo ${profile.gender}, goal: ${profile.goal}, activity: ${
      profile.activity
    }
Targets: ${meta.cals} kcal | ${meta.protein}g protein | ${
      meta.carbs
    }g carbs | ${meta.fat}g fat | ${meta.fiber}g fiber
Current streak: ${streak} days
7-day averages: ${
      wa
        ? `${wa.calories} kcal | ${wa.protein}g protein | ${wa.carbs}g carbs | ${wa.fat}g fat | ${wa.fiber}g fiber | ${wa.sodium}mg sodium`
        : "Not enough data yet"
    }
Today's intake: ${todayNutrients.calories} kcal | ${
      todayNutrients.protein
    }g protein | ${todayNutrients.carbs}g carbs | ${todayNutrients.fat}g fat

Respond with EXACTLY these 4 headers:
## 📊 Nutrition Analysis
## 🎯 Focus This Week
## 💪 Training Tip
## 🔑 One Key Change`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 900,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const t =
        data.content?.map((b) => b.text || "").join("") ||
        "Could not generate advice.";
      setAiCoach(t);
      LS.set("ftp_coach", t);
    } catch {
      setAiCoach("Connection error. Try again.");
    }
    setCoachLoading(false);
  }

  if (!setupDone)
    return (
      <Setup
        onDone={(p) => {
          setProfile(p);
          setSetupDone(true);
          LS.set("ftp_profile", p);
        }}
      />
    );

  const calPct = meta
    ? Math.min(100, Math.round((todayNutrients.calories / meta.cals) * 100))
    : 0;
  const waterPct = Math.min(100, Math.round((todayWater / waterTarget) * 100));

  // Chart data
  const calChartData = foodLog.map((r) => ({
    date: r.date,
    v: r.items.reduce((s, i) => s + (i.calories || 0), 0),
  }));
  const proteinChartData = foodLog.map((r) => ({
    date: r.date,
    v: r.items.reduce((s, i) => s + (i.protein || 0), 0),
  }));
  const weightChartData = weightLog.map((r) => ({ date: r.date, v: r.v }));

  return (
    <div
      style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 76 }}
    >
      {/* Header */}
      <div
        style={{
          background: "rgba(12,14,27,0.96)",
          borderBottom: "1px solid var(--border)",
          padding: "13px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(20px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--green)",
              animation: "pulse 2s infinite",
            }}
          />
          <span
            style={{
              fontFamily: "Syne",
              fontWeight: 900,
              fontSize: 16,
              color: "var(--green)",
            }}
          >
            FitTrack AI
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              background: "var(--gdim)",
              border: "1px solid var(--gglow)",
              borderRadius: 100,
              padding: "5px 12px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>🔥</span>
            <span
              style={{
                fontFamily: "JetBrains Mono",
                fontWeight: 700,
                color: "var(--green)",
                fontSize: 14,
              }}
            >
              {streak}
            </span>
          </div>
          <button
            className="btn-ghost"
            style={{ padding: "7px 11px", fontSize: 13 }}
            onClick={() => setSetupDone(false)}
          >
            ⚙️
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "18px 15px 0" }}>
        {/* ═══ DASHBOARD ═══ */}
        {page === "dashboard" && (
          <div
            className="fade-in"
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {/* Hero card */}
            <div
              style={{
                background: "linear-gradient(135deg,#0d1020,#0a1620)",
                border: "1.5px solid var(--border)",
                borderRadius: 22,
                padding: "22px 20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: "var(--gdim)",
                  filter: "blur(40px)",
                }}
              />
              <div
                style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}
              >
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div
                style={{
                  fontFamily: "Syne",
                  fontWeight: 800,
                  fontSize: 20,
                  marginBottom: 18,
                }}
              >
                {streak === 0
                  ? "Start your journey 🚀"
                  : `Day ${streak} — ${
                      streak < 3
                        ? "keep going! 💪"
                        : streak < 7
                        ? "on a roll! 🔥"
                        : "you're unstoppable! 👑"
                    }`}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Ring
                  pct={calPct}
                  color="var(--green)"
                  size={70}
                  label="Cals"
                  sub={`${todayNutrients.calories}/${meta?.cals}`}
                />
                <Ring
                  pct={
                    meta
                      ? Math.min(
                          100,
                          Math.round(
                            (todayNutrients.protein / meta.protein) * 100
                          )
                        )
                      : 0
                  }
                  color="var(--green)"
                  size={70}
                  label="Protein"
                  sub={`${todayNutrients.protein}/${meta?.protein}g`}
                />
                <Ring
                  pct={waterPct}
                  color="var(--blue)"
                  size={70}
                  label="Water"
                  sub={`${todayWater}/${waterTarget}L`}
                />
                <StreakRing streak={streak} />
              </div>
            </div>

            {/* Today macros */}
            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--green)",
                  }}
                >
                  Today's Nutrition
                </span>
                {todayNutrients.calories > 0 && (
                  <DonutChart
                    protein={todayNutrients.protein}
                    carbs={todayNutrients.carbs}
                    fat={todayNutrients.fat}
                    size={60}
                  />
                )}
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <MacroBar
                  label="Calories"
                  current={todayNutrients.calories}
                  target={meta?.cals || 2000}
                  color="var(--green)"
                  unit=" kcal"
                  showGrams={true}
                />
                <MacroBar
                  label="Protein"
                  current={todayNutrients.protein}
                  target={meta?.protein || 150}
                  color="var(--green)"
                />
                <MacroBar
                  label="Carbohydrates"
                  current={todayNutrients.carbs}
                  target={meta?.carbs || 250}
                  color="var(--blue)"
                />
                <MacroBar
                  label="Fat"
                  current={todayNutrients.fat}
                  target={meta?.fat || 65}
                  color="var(--orange)"
                />
                <MacroBar
                  label="Fiber"
                  current={todayNutrients.fiber}
                  target={meta?.fiber || 30}
                  color="var(--purple)"
                />
                <MacroBar
                  label="Sodium"
                  current={todayNutrients.sodium}
                  target={meta?.sodium || 2300}
                  color="var(--yellow)"
                  unit=" mg"
                />
              </div>
            </div>

            {/* Quick stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {[
                {
                  l: "Weight",
                  v: todayW ? `${todayW}` : "—",
                  u: profile.weightUnit,
                  c: "var(--green)",
                },
                { l: "BMI", v: meta?.bmi, u: meta?.bmiCat, c: meta?.bmiColor },
                {
                  l: "Sugar",
                  v: todayNutrients.sugar,
                  u: `/ ${meta?.sugar || 50}g target`,
                  c:
                    todayNutrients.sugar > (meta?.sugar || 50)
                      ? "var(--orange)"
                      : "var(--yellow)",
                },
              ].map((s) => (
                <div key={s.l} className="card-sm">
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: 5,
                    }}
                  >
                    {s.l}
                  </div>
                  <div
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 20,
                      fontWeight: 700,
                      color: s.c,
                      lineHeight: 1,
                    }}
                  >
                    {s.v}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      marginTop: 4,
                    }}
                  >
                    {s.u}
                  </div>
                </div>
              ))}
            </div>

            {/* 7-day flags */}
            {weekAvg && (
              <div className="card">
                <div
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--yellow)",
                    marginBottom: 14,
                  }}
                >
                  ⚠️ Nutrition Flags (7-day avg)
                </div>
                <NutrientFlags weekAvg={weekAvg} targets={meta} />
              </div>
            )}

            {/* Weight chart */}
            <div className="card">
              <div
                style={{
                  fontFamily: "Syne",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--green)",
                  marginBottom: 12,
                }}
              >
                📈 Weight History
              </div>
              <LineChart
                data={weightChartData}
                color="var(--green)"
                height={85}
                label="w"
              />
            </div>
          </div>
        )}

        {/* ═══ LOG FOOD ═══ */}
        {page === "log" && (
          <div
            className="fade-in"
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {/* Food search */}
            <div className="card">
              <div
                style={{
                  fontFamily: "Syne",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--green)",
                  marginBottom: 14,
                }}
              >
                🔍 Add Food
              </div>
              <FoodSearch onAdd={addFood} targets={meta} />
            </div>

            {/* Today's food log */}
            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--blue)",
                  }}
                >
                  Today's Food Log
                </span>
                <span
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 13,
                    color: "var(--green)",
                  }}
                >
                  {todayNutrients.calories} kcal
                </span>
              </div>
              {todayFoods.length === 0 ? (
                <div
                  style={{
                    color: "var(--muted)",
                    fontSize: 13,
                    textAlign: "center",
                    padding: "20px 0",
                  }}
                >
                  No food logged today yet. Search above to add meals!
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {todayFoods.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        background: "var(--s1)",
                        border: "1.5px solid var(--b2)",
                        borderRadius: 12,
                        padding: "12px 14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 8,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--muted)" }}>
                            {item.servings !== 1 ? `${item.servings}× ` : ""}
                            {item.serving}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "JetBrains Mono",
                              fontSize: 14,
                              color: "var(--green)",
                              fontWeight: 700,
                            }}
                          >
                            {item.calories} kcal
                          </span>
                          <button
                            className="del-btn"
                            onClick={() => delFood(i)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div
                        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                      >
                        {[
                          {
                            l: "P",
                            v: item.protein,
                            c: "var(--green)",
                            u: "g",
                          },
                          { l: "C", v: item.carbs, c: "var(--blue)", u: "g" },
                          { l: "F", v: item.fat, c: "var(--orange)", u: "g" },
                          {
                            l: "Fiber",
                            v: item.fiber,
                            c: "var(--purple)",
                            u: "g",
                          },
                          {
                            l: "Na",
                            v: item.sodium,
                            c: "var(--yellow)",
                            u: "mg",
                          },
                        ].map(
                          (m) =>
                            m.v > 0 && (
                              <span key={m.l} className="macro-pill">
                                <span style={{ color: m.c, fontWeight: 700 }}>
                                  {m.l}
                                </span>
                                <span style={{ color: "var(--muted)" }}>
                                  {m.v}
                                  {m.u}
                                </span>
                              </span>
                            )
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Daily total */}
                  <div
                    style={{
                      background: "var(--gdim)",
                      border: "1px solid var(--gglow)",
                      borderRadius: 12,
                      padding: "12px 14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--green)",
                        fontWeight: 700,
                        marginBottom: 8,
                      }}
                    >
                      DAILY TOTAL
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[
                        {
                          l: "Calories",
                          v: todayNutrients.calories,
                          t: meta?.cals,
                          c: "var(--green)",
                          u: "kcal",
                        },
                        {
                          l: "Protein",
                          v: todayNutrients.protein,
                          t: meta?.protein,
                          c: "var(--green)",
                          u: "g",
                        },
                        {
                          l: "Carbs",
                          v: todayNutrients.carbs,
                          t: meta?.carbs,
                          c: "var(--blue)",
                          u: "g",
                        },
                        {
                          l: "Fat",
                          v: todayNutrients.fat,
                          t: meta?.fat,
                          c: "var(--orange)",
                          u: "g",
                        },
                        {
                          l: "Fiber",
                          v: todayNutrients.fiber,
                          t: meta?.fiber,
                          c: "var(--purple)",
                          u: "g",
                        },
                        {
                          l: "Sugar",
                          v: todayNutrients.sugar,
                          t: meta?.sugar,
                          c: "var(--pink)",
                          u: "g",
                        },
                        {
                          l: "Sodium",
                          v: todayNutrients.sodium,
                          t: meta?.sodium,
                          c: "var(--yellow)",
                          u: "mg",
                        },
                      ].map((s) => (
                        <div
                          key={s.l}
                          style={{
                            background: "var(--s1)",
                            borderRadius: 9,
                            padding: "7px 10px",
                            minWidth: 70,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              color: "var(--muted)",
                              marginBottom: 2,
                            }}
                          >
                            {s.l}
                          </div>
                          <div
                            style={{
                              fontFamily: "JetBrains Mono",
                              fontSize: 13,
                              fontWeight: 700,
                              color:
                                s.v > (s.t || 9999) * 1.05
                                  ? "var(--orange)"
                                  : s.c,
                            }}
                          >
                            {s.v}
                            <span style={{ fontSize: 9, fontWeight: 400 }}>
                              {s.u}
                            </span>
                          </div>
                          {s.t && (
                            <div
                              style={{ fontSize: 9, color: "var(--muted2)" }}
                            >
                              /{s.t}
                              {s.u}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Weight & water */}
            <div className="card">
              <div
                style={{
                  fontFamily: "Syne",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--green)",
                  marginBottom: 12,
                }}
              >
                ⚖️ Log Weight
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  className="inp"
                  type="number"
                  step="0.1"
                  placeholder={`Weight in ${profile.weightUnit}`}
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addWeight()}
                />
                <button className="btn btn-sm" onClick={addWeight}>
                  Log
                </button>
              </div>
              {todayW && (
                <div
                  style={{ marginTop: 8, fontSize: 13, color: "var(--green)" }}
                >
                  ✓ Today: {todayW} {profile.weightUnit}
                </div>
              )}
            </div>

            <div className="card">
              <div
                style={{
                  fontFamily: "Syne",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--blue)",
                  marginBottom: 12,
                }}
              >
                💧 Log Water
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                {[0.25, 0.5, 0.75, 1].map((v) => (
                  <button
                    key={v}
                    className="btn-ghost"
                    style={{ flex: "1 1 auto", fontSize: 13 }}
                    onClick={() => addWater(v)}
                  >
                    +{v}L
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  className="inp"
                  type="number"
                  step="0.1"
                  placeholder="Custom (L)"
                  value={waterInput}
                  onChange={(e) => setWaterInput(e.target.value)}
                />
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    addWater(parseFloat(waterInput) || 0);
                    setWaterInput("");
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: "var(--blue)" }}>
                💧 Today: {todayWater}L / {waterTarget}L
              </div>
            </div>
          </div>
        )}

        {/* ═══ NUTRIENTS ═══ */}
        {page === "nutrients" && (
          <div
            className="fade-in"
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {/* 7-day averages */}
            <div className="card">
              <div
                style={{
                  fontFamily: "Syne",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--yellow)",
                  marginBottom: 14,
                }}
              >
                📊 7-Day Nutrient Averages
              </div>
              {!weekAvg ? (
                <div style={{ color: "var(--muted)", fontSize: 13 }}>
                  Log food for at least 1 day to see averages.
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 11 }}
                >
                  <MacroBar
                    label="Calories"
                    current={weekAvg.calories}
                    target={meta?.cals || 2000}
                    color="var(--green)"
                    unit=" kcal"
                  />
                  <MacroBar
                    label="Protein"
                    current={weekAvg.protein}
                    target={meta?.protein || 150}
                    color="var(--green)"
                  />
                  <MacroBar
                    label="Carbohydrates"
                    current={weekAvg.carbs}
                    target={meta?.carbs || 250}
                    color="var(--blue)"
                  />
                  <MacroBar
                    label="Fat"
                    current={weekAvg.fat}
                    target={meta?.fat || 65}
                    color="var(--orange)"
                  />
                  <MacroBar
                    label="Fiber"
                    current={weekAvg.fiber}
                    target={meta?.fiber || 30}
                    color="var(--purple)"
                  />
                  <MacroBar
                    label="Sodium"
                    current={weekAvg.sodium}
                    target={meta?.sodium || 2300}
                    color="var(--yellow)"
                    unit=" mg"
                  />
                </div>
              )}
            </div>

            {/* Nutrient flags */}
            <div className="card">
              <div
                style={{
                  fontFamily: "Syne",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--orange)",
                  marginBottom: 14,
                }}
              >
                🚦 Nutrient Intelligence
              </div>
              {weekAvg ? (
                <NutrientFlags weekAvg={weekAvg} targets={meta} />
              ) : (
                <div style={{ color: "var(--muted)", fontSize: 13 }}>
                  Log food for a few days to get personalized flags.
                </div>
              )}
            </div>

            {/* Charts */}
            <div className="card">
              <div
                style={{
                  fontFamily: "Syne",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--green)",
                  marginBottom: 12,
                }}
              >
                📈 Calorie Trend
              </div>
              <BarChart
                data={calChartData}
                color="var(--green)"
                target={meta?.cals}
                height={90}
              />
            </div>
            <div className="card">
              <div
                style={{
                  fontFamily: "Syne",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--green)",
                  marginBottom: 12,
                }}
              >
                🥩 Protein Trend
              </div>
              <LineChart
                data={proteinChartData}
                color="var(--green)"
                height={85}
                label="p"
              />
            </div>

            {/* Targets reference */}
            <div className="card">
              <div
                style={{
                  fontFamily: "Syne",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--blue)",
                  marginBottom: 14,
                }}
              >
                🎯 Your Daily Targets
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  { l: "Calories", v: `${meta?.cals} kcal`, c: "var(--green)" },
                  { l: "Protein", v: `${meta?.protein}g`, c: "var(--green)" },
                  {
                    l: "Carbohydrates",
                    v: `${meta?.carbs}g`,
                    c: "var(--blue)",
                  },
                  { l: "Fat", v: `${meta?.fat}g`, c: "var(--orange)" },
                  { l: "Fiber", v: `${meta?.fiber}g`, c: "var(--purple)" },
                  { l: "Sugar", v: `<${meta?.sugar}g`, c: "var(--pink)" },
                  { l: "Sodium", v: `<${meta?.sodium}mg`, c: "var(--yellow)" },
                  { l: "Water", v: `${waterTarget}L`, c: "var(--blue)" },
                ].map((s) => (
                  <div
                    key={s.l}
                    style={{
                      background: "var(--s1)",
                      borderRadius: 11,
                      padding: "11px 13px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>
                      {s.l}
                    </span>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: 14,
                        color: s.c,
                        fontWeight: 700,
                      }}
                    >
                      {s.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ AI COACH ═══ */}
        {page === "coach" && (
          <div
            className="fade-in"
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div
              className="card"
              style={{
                border: "1.5px solid rgba(0,240,160,0.18)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background:
                    "linear-gradient(90deg,transparent,var(--green),transparent)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: "var(--gdim)",
                    border: "1.5px solid var(--gglow)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  🤖
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Syne",
                      fontWeight: 800,
                      fontSize: 16,
                    }}
                  >
                    AI Nutrition Coach
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    Analyzes your real tracked data
                  </div>
                </div>
              </div>
              {!aiCoach && !coachLoading && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 44, marginBottom: 12 }}>🎯</div>
                  <p
                    style={{
                      color: "var(--muted)",
                      fontSize: 14,
                      lineHeight: 1.7,
                      maxWidth: 320,
                      margin: "0 auto 20px",
                    }}
                  >
                    Get personalized coaching based on your actual calorie,
                    protein, fiber, and sodium data.
                  </p>
                  <button
                    className="btn"
                    style={{ margin: "0 auto", display: "block" }}
                    onClick={fetchCoach}
                  >
                    ✦ Analyze My Nutrition
                  </button>
                </div>
              )}
              {coachLoading && !coachOut && (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    color: "var(--muted)",
                    fontSize: 14,
                    padding: "12px 0",
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      border: "2px solid var(--b2)",
                      borderTopColor: "var(--green)",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Analyzing your nutrition data…
                </div>
              )}
              {coachOut && (
                <div
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.85,
                    color: "var(--muted)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {coachOut.split(/^(##.+)$/m).map((part, i) =>
                    part.startsWith("## ") ? (
                      <div
                        key={i}
                        style={{
                          color: "var(--green)",
                          fontFamily: "Syne",
                          fontWeight: 700,
                          fontSize: 15,
                          margin: "16px 0 6px",
                        }}
                      >
                        {part.replace("## ", "")}
                      </div>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                  {!coachDone && <span className="typing-cur" />}
                </div>
              )}
            </div>
            {(coachOut || coachLoading) && (
              <button
                className="btn-ghost"
                style={{ width: "100%" }}
                onClick={fetchCoach}
                disabled={coachLoading}
              >
                🔄 Refresh Analysis
              </button>
            )}

            {/* Summary stats */}
            <div className="card">
              <div
                style={{
                  fontFamily: "Syne",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--yellow)",
                  marginBottom: 14,
                }}
              >
                📋 Your Data Summary
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  {
                    l: "Current streak",
                    v: `${streak} days`,
                    c: "var(--yellow)",
                  },
                  {
                    l: "Days food logged",
                    v: foodLog.length,
                    c: "var(--green)",
                  },
                  {
                    l: "Total foods logged",
                    v: foodLog.reduce((s, r) => s + r.items.length, 0),
                    c: "var(--blue)",
                  },
                  {
                    l: "7-day avg calories",
                    v: weekAvg ? `${weekAvg.calories} kcal` : "—",
                    c: "var(--green)",
                  },
                  {
                    l: "7-day avg protein",
                    v: weekAvg ? `${weekAvg.protein}g` : "—",
                    c: "var(--green)",
                  },
                  {
                    l: "7-day avg sodium",
                    v: weekAvg ? `${weekAvg.sodium}mg` : "—",
                    c:
                      weekAvg?.sodium > (meta?.sodium || 2300)
                        ? "var(--orange)"
                        : "var(--yellow)",
                  },
                ].map((s, i) => (
                  <div
                    key={s.l}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: i < 5 ? "1px solid var(--b2)" : "none",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>
                      {s.l}
                    </span>
                    <span
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: 14,
                        color: s.c,
                        fontWeight: 700,
                      }}
                    >
                      {s.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(10,11,22,0.97)",
          borderTop: "1px solid var(--border)",
          display: "flex",
          backdropFilter: "blur(20px)",
          zIndex: 200,
          paddingBottom: "env(safe-area-inset-bottom,0px)",
        }}
      >
        {[
          { v: "dashboard", l: "Home", icon: "📊" },
          { v: "log", l: "Log", icon: "✏️" },
          { v: "nutrients", l: "Nutrients", icon: "🥗" },
          { v: "coach", l: "AI Coach", icon: "🤖" },
        ].map((n) => (
          <button
            key={n.v}
            className={`nav-item ${page === n.v ? "on" : ""}`}
            onClick={() => setPage(n.v)}
          >
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
  const [f, setF] = useState({
    age: "",
    gender: "male",
    weight: "",
    height: "",
    weightUnit: "kg",
    heightUnit: "cm",
    activity: "moderate",
    goal: "lose",
  });
  const u = (k, v) => setF((p) => ({ ...p, [k]: v }));
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div
        style={{
          background: "linear-gradient(180deg,#0a0d20,var(--bg))",
          padding: "48px 24px 32px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "radial-gradient(circle at 50% 60%,var(--green) 0%,transparent 70%)",
          }}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 18,
            background: "var(--gdim)",
            border: "1px solid var(--gglow)",
            borderRadius: 100,
            padding: "6px 18px",
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--green)",
              animation: "pulse 2s infinite",
            }}
          />
          <span
            style={{
              color: "var(--green)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              fontFamily: "Syne",
            }}
          >
            FITTRACK AI · NUTRIENT EDITION
          </span>
        </div>
        <h1
          style={{
            fontFamily: "Syne",
            fontWeight: 900,
            fontSize: "clamp(30px,7vw,48px)",
            lineHeight: 1.05,
            marginBottom: 10,
            background:
              "linear-gradient(135deg,#fff 0%,var(--green) 60%,#00c4ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Your Complete
          <br />
          Fitness & Nutrition Tracker
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: 15,
            maxWidth: 400,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Track calories, macros, fiber, sodium, sugar, weight, water, streaks —
          with AI food search and personalized coaching.
        </p>
      </div>
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 60px" }}>
        <div
          style={{
            background: "var(--card)",
            border: "1.5px solid var(--border)",
            borderRadius: 22,
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <Sec label="Your Body">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <Fld label="Age">
                <input
                  className="inp"
                  type="number"
                  placeholder="25"
                  value={f.age}
                  onChange={(e) => u("age", e.target.value)}
                />
              </Fld>
              <Fld label="Gender">
                <div className="seg">
                  {["male", "female"].map((g) => (
                    <button
                      key={g}
                      className={`seg-b ${f.gender === g ? "on" : ""}`}
                      onClick={() => u("gender", g)}
                    >
                      {g === "male" ? "♂ Male" : "♀ Female"}
                    </button>
                  ))}
                </div>
              </Fld>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 10,
                alignItems: "end",
              }}
            >
              <Fld label="Weight">
                <input
                  className="inp"
                  type="number"
                  placeholder={f.weightUnit === "kg" ? "70" : "154"}
                  value={f.weight}
                  onChange={(e) => u("weight", e.target.value)}
                />
              </Fld>
              <div className="seg" style={{ minWidth: 88 }}>
                {["kg", "lbs"].map((x) => (
                  <button
                    key={x}
                    className={`seg-b ${f.weightUnit === x ? "on" : ""}`}
                    onClick={() => u("weightUnit", x)}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 10,
                alignItems: "end",
              }}
            >
              <Fld label="Height">
                <input
                  className="inp"
                  type="number"
                  placeholder={f.heightUnit === "cm" ? "175" : "69"}
                  value={f.height}
                  onChange={(e) => u("height", e.target.value)}
                />
              </Fld>
              <div className="seg" style={{ minWidth: 88 }}>
                {["cm", "in"].map((x) => (
                  <button
                    key={x}
                    className={`seg-b ${f.heightUnit === x ? "on" : ""}`}
                    onClick={() => u("heightUnit", x)}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>
          </Sec>
          <Sec label="Activity & Goal">
            <Fld label="Activity level">
              <select
                className="inp"
                value={f.activity}
                onChange={(e) => u("activity", e.target.value)}
              >
                <option value="sedentary">Sedentary (desk job)</option>
                <option value="light">Light (1–3 days/wk)</option>
                <option value="moderate">Moderate (3–5 days/wk)</option>
                <option value="active">Active (6–7 days/wk)</option>
                <option value="veryActive">Very Active / Athlete</option>
              </select>
            </Fld>
            <Fld label="Goal">
              <div className="seg">
                {[
                  { v: "lose", l: "🔥 Lose Fat" },
                  { v: "maintain", l: "⚖️ Maintain" },
                  { v: "gain", l: "💪 Build Muscle" },
                ].map(({ v, l }) => (
                  <button
                    key={v}
                    className={`seg-b ${f.goal === v ? "on" : ""}`}
                    onClick={() => u("goal", v)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Fld>
          </Sec>
          <button
            className="btn"
            disabled={!f.age || !f.weight || !f.height}
            onClick={() => onDone(f)}
          >
            ✦ Start Tracking
          </button>
        </div>
      </div>
    </div>
  );
}

function Sec({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          fontSize: 11,
          fontFamily: "Syne",
          fontWeight: 700,
          color: "var(--green)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
function Fld({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {label && (
        <label style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
