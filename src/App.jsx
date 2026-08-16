import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import {
  Check, ChevronDown, ChevronRight, Dumbbell, BookOpen, Code2, Bus,
  Moon, Flame, TrendingUp, UtensilsCrossed, Building2, Sunrise, Zap
} from "lucide-react";

/* ============================== DATA ============================== */

const SHIFTS = {
  shift1: {
    label: "Shift 1",
    time: "9:00 AM – 6:00 PM",
    blocks: [
      { id: "b1", time: "5:30 - 6:00", activity: "Wake up, freshen up", icon: "sunrise" },
      { id: "b2", time: "6:00 - 7:30", activity: "SI/CGL study — deep focus block", icon: "study" },
      { id: "b3", time: "7:30 - 8:00", activity: "Get ready, breakfast", icon: "meal" },
      { id: "b4", time: "8:00 - 9:00", activity: "Commute to office", icon: "commute" },
      { id: "b5", time: "9:00 - 18:00", activity: "Office", icon: "office" },
      { id: "b6", time: "18:00 - 19:00", activity: "Commute back home", icon: "commute" },
      { id: "b7", time: "19:00 - 20:30", activity: "Rest, freshen up, light snack", icon: "meal" },
      { id: "b8", time: "20:30 - 21:30", activity: "Gym", icon: "gym" },
      { id: "b9", time: "21:30 - 22:15", activity: "Dinner", icon: "meal" },
      { id: "b10", time: "22:15 - 23:30", activity: "Web dev / Sigma 5 course", icon: "dev" },
      { id: "b11", time: "23:30", activity: "Sleep", icon: "sleep" }
    ]
  },
  shift2: {
    label: "Shift 2",
    time: "9:30 AM – 6:30 PM",
    blocks: [
      { id: "b1", time: "6:00 - 6:30", activity: "Wake up, freshen up", icon: "sunrise" },
      { id: "b2", time: "6:30 - 8:00", activity: "SI/CGL study — deep focus block", icon: "study" },
      { id: "b3", time: "8:00 - 8:30", activity: "Get ready, breakfast", icon: "meal" },
      { id: "b4", time: "8:30 - 9:30", activity: "Commute to office", icon: "commute" },
      { id: "b5", time: "9:30 - 18:30", activity: "Office", icon: "office" },
      { id: "b6", time: "18:30 - 19:30", activity: "Commute back home", icon: "commute" },
      { id: "b7", time: "19:30 - 20:30", activity: "Rest, freshen up, light snack", icon: "meal" },
      { id: "b8", time: "20:30 - 21:30", activity: "Gym", icon: "gym" },
      { id: "b9", time: "21:30 - 22:15", activity: "Dinner", icon: "meal" },
      { id: "b10", time: "22:15 - 23:15", activity: "Web dev (shorter block)", icon: "dev" },
      { id: "b11", time: "23:15", activity: "Sleep", icon: "sleep" }
    ]
  },
  shift3: {
    label: "Shift 3 (Hybrid)",
    time: "11:00 AM – 9:00 PM",
    blocks: [
      { id: "b1", time: "6:30 - 7:00", activity: "Wake up, freshen up", icon: "sunrise" },
      { id: "b2", time: "7:00 - 9:00", activity: "SI/CGL study — longest deep focus block", icon: "study" },
      { id: "b3", time: "9:00 - 9:30", activity: "Breakfast", icon: "meal" },
      { id: "b4", time: "9:30 - 10:30", activity: "Web dev / SSC CGL practice", icon: "dev" },
      { id: "b5", time: "10:30 - 11:00", activity: "Get ready, commute / WFH setup", icon: "commute" },
      { id: "b6", time: "11:00 - 21:00", activity: "Office / WFH", icon: "office" },
      { id: "b7", time: "21:00 - 22:00", activity: "Gym — straight after work", icon: "gym" },
      { id: "b8", time: "22:00 - 22:45", activity: "Dinner (post-workout)", icon: "meal" },
      { id: "b9", time: "22:45 - 23:15", activity: "Light wind-down / dev review", icon: "dev" },
      { id: "b10", time: "23:15", activity: "Sleep", icon: "sleep" }
    ]
  }
};

const WEEKLY_SPLIT = {
  Monday: {
    focus: "Push", subtitle: "Dips / Chest / Shoulders", duration: "60-70 min", rest: false,
    exercises: [
      { id: "mon1", name: "Weighted Dips", target: "4 x 5-6", note: "Heavy — add weight when possible" },
      { id: "mon2", name: "Incline Chest Press", target: "3 x 8-10", note: "Upper chest" },
      { id: "mon3", name: "Overhead DB Press", target: "3 x 8-10", note: "Shoulders" },
      { id: "mon4", name: "Lateral Raises", target: "3 x 12-15", note: "Strict form" },
      { id: "mon5", name: "Rope Triceps Pushdown", target: "3 x 12-15", note: "Squeeze at bottom" }
    ]
  },
  Tuesday: {
    focus: "Pull", subtitle: "Pull-ups / Back", duration: "60-70 min", rest: false,
    exercises: [
      { id: "tue1", name: "Weighted Pull-ups", target: "4 x 5-6", note: "Controlled, full range" },
      { id: "tue2", name: "Barbell/DB Rows", target: "4 x 8-10", note: "Back thickness" },
      { id: "tue3", name: "Face Pulls", target: "3 x 15", note: "Rear delts/posture" },
      { id: "tue4", name: "Barbell Curls", target: "3 x 10-12", note: "Full range" },
      { id: "tue5", name: "Single-Arm Preacher Curl", target: "3 x 12/arm", note: "Fixes L/R imbalance" }
    ]
  },
  Wednesday: { focus: "Rest", subtitle: "Recovery / shift buffer", duration: "—", rest: true, exercises: [] },
  Thursday: {
    focus: "Legs 1", subtitle: "Heavy — squats, RDL", duration: "55-65 min", rest: false,
    exercises: [
      { id: "thu1", name: "Squats", target: "4 x 6-8", note: "Progress weight weekly" },
      { id: "thu2", name: "Romanian Deadlift", target: "3 x 8-10", note: "Slow eccentric" },
      { id: "thu3", name: "Walking Lunges", target: "3 x 12/leg", note: "Bodyweight or light DB" },
      { id: "thu4", name: "Calf Raises", target: "3 x 15-20", note: "Full stretch each rep" },
      { id: "thu5", name: "Hanging Leg Raises", target: "3 x 12-15", note: "Controlled, no swing" }
    ]
  },
  Friday: {
    focus: "Upper 1", subtitle: "Combined maintenance", duration: "50-60 min", rest: false,
    exercises: [
      { id: "fri1", name: "Dips", target: "3 x 12-15", note: "Controlled tempo" },
      { id: "fri2", name: "Pull-ups", target: "3 x 12-15", note: "Max reps if 12+ not there" },
      { id: "fri3", name: "Incline Chest Press", target: "3 x 10-12", note: "Upper chest" },
      { id: "fri4", name: "DB Rows", target: "3 x 10-12", note: "Back" },
      { id: "fri5", name: "Lateral Raises", target: "3 x 12-15", note: "Shoulders" }
    ]
  },
  Saturday: {
    focus: "Lower 2", subtitle: "Light / volume legs", duration: "45-55 min", rest: false,
    exercises: [
      { id: "sat1", name: "Squats", target: "3 x 10-12", note: "Lighter, higher rep" },
      { id: "sat2", name: "Bulgarian Split Squats", target: "3 x 10/leg", note: "Balance + unilateral" },
      { id: "sat3", name: "Light Deadlift", target: "3 x 6", note: "Technique focus" },
      { id: "sat4", name: "Cable Crunch / Plank", target: "3 x failure", note: "Superset, rest gaps" }
    ]
  },
  Sunday: { focus: "Rest", subtitle: "Full recovery, meal prep", duration: "—", rest: true, exercises: [] }
};

const ICONS = {
  sunrise: Sunrise, study: BookOpen, meal: UtensilsCrossed, commute: Bus,
  office: Building2, gym: Dumbbell, dev: Code2, sleep: Moon
};

/* ============================== HELPERS ============================== */

function pad(n) { return n < 10 ? "0" + n : "" + n; }
function toKey(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function fromKey(key) { const [y, m, d] = key.split("-").map(Number); return new Date(y, m - 1, d); }
function dayNameOf(d) { return d.toLocaleDateString("en-US", { weekday: "long" }); }
function prettyDate(d) {
  return d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
function emptyDay(dateStr) {
  const d = fromKey(dateStr);
  const dn = dayNameOf(d);
  const split = WEEKLY_SPLIT[dn];
  return {
    date: dateStr,
    shift: "shift1",
    routine: {},
    dayName: dn,
    workoutDone: {},
    sets: {}
  };
}
function routinePercent(dayObj) {
  const shift = SHIFTS[dayObj.shift] || SHIFTS.shift1;
  const total = shift.blocks.length;
  const done = shift.blocks.filter(b => dayObj.routine[b.id]).length;
  return total ? Math.round((done / total) * 100) : 0;
}
function workoutPercent(dayObj) {
  const split = WEEKLY_SPLIT[dayObj.dayName] || { exercises: [] };
  if (split.rest || split.exercises.length === 0) return null;
  const total = split.exercises.length;
  const done = split.exercises.filter(e => dayObj.workoutDone[e.id]).length;
  return Math.round((done / total) * 100);
}

/* ============================== WEB METER ============================== */

function WebMeter({ percent, size = 148 }) {
  const r = size / 2 - 14;
  const cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - percent / 100);
  const spokes = 8;
  const rings = [0.35, 0.6, 0.85, 1];

  const spokePoints = [];
  for (let i = 0; i < spokes; i++) {
    const angle = (Math.PI * 2 * i) / spokes - Math.PI / 2;
    spokePoints.push({
      x2: cx + r * Math.cos(angle),
      y2: cy + r * Math.sin(angle)
    });
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {rings.map((ringR, i) => (
        <circle key={i} cx={cx} cy={cy} r={r * ringR} fill="none" stroke="#111111" strokeWidth="1" opacity="0.25" />
      ))}
      {spokePoints.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x2} y2={p.y2} stroke="#111111" strokeWidth="1" opacity="0.25" />
      ))}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="#111111"
        strokeWidth="10"
        opacity="0.12"
      />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="#E62429"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 0.4s ease" }}
      />
      <text x={cx} y={cy - 4} textAnchor="middle" fontFamily="'Bangers', cursive" fontSize="30" fill="#111111">
        {percent}%
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" letterSpacing="1.5" fill="#5F5E5A">
        TODAY
      </text>
    </svg>
  );
}

/* ============================== APP ============================== */

export default function SpideyTracker() {
  const todayStr = toKey(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [dayData, setDayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today");
  const [allDays, setAllDays] = useState({});
  const [allLoaded, setAllLoaded] = useState(false);
  const [monthCursor, setMonthCursor] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [expandedLog, setExpandedLog] = useState(null);
  const [saveError, setSaveError] = useState(false);
  const [flash, setFlash] = useState(null);

  const loadDay = useCallback(async (dateStr) => {
    setLoading(true);
    try {
      const res = await window.storage.get(`day:${dateStr}`, false);
      if (res && res.value) {
        setDayData(JSON.parse(res.value));
      } else {
        setDayData(emptyDay(dateStr));
      }
    } catch (e) {
      setDayData(emptyDay(dateStr));
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadDay(selectedDate); }, [selectedDate, loadDay]);

  const persist = useCallback(async (obj) => {
    try {
      const result = await window.storage.set(`day:${obj.date}`, JSON.stringify(obj), false);
      if (!result) setSaveError(true);
      else setSaveError(false);
    } catch (e) {
      setSaveError(true);
    }
  }, []);

  const loadAllDays = useCallback(async () => {
    try {
      const listRes = await window.storage.list("day:", false);
      const keys = (listRes && listRes.keys) || [];
      const entries = await Promise.all(
        keys.map(async (k) => {
          try {
            const r = await window.storage.get(k, false);
            return r && r.value ? JSON.parse(r.value) : null;
          } catch (e) { return null; }
        })
      );
      const map = {};
      entries.forEach(e => { if (e && e.date) map[e.date] = e; });
      setAllDays(map);
      setAllLoaded(true);
    } catch (e) {
      setAllLoaded(true);
    }
  }, []);

  useEffect(() => {
    if ((activeTab === "reports" || activeTab === "logs") && !allLoaded) {
      loadAllDays();
    }
  }, [activeTab, allLoaded, loadAllDays]);

  function updateDay(mutator) {
    setDayData(prev => {
      const next = mutator(structuredCloneLite(prev));
      persist(next);
      setAllDays(m => ({ ...m, [next.date]: next }));
      return next;
    });
  }
  function structuredCloneLite(o) { return JSON.parse(JSON.stringify(o)); }

  function toggleBlock(blockId) {
    updateDay(d => {
      d.routine[blockId] = !d.routine[blockId];
      return d;
    });
    triggerFlash(dayData && !dayData.routine[blockId] ? "THWIP!" : null);
  }

  function setShift(shiftKey) {
    updateDay(d => { d.shift = shiftKey; return d; });
  }

  function toggleExerciseDone(exId) {
    updateDay(d => {
      d.workoutDone[exId] = !d.workoutDone[exId];
      return d;
    });
    triggerFlash(dayData && !dayData.workoutDone[exId] ? "SMASH!" : null);
  }

  function updateSet(exId, setIdx, field, value) {
    updateDay(d => {
      if (!d.sets[exId]) d.sets[exId] = [];
      while (d.sets[exId].length <= setIdx) d.sets[exId].push({ reps: "", weight: "" });
      d.sets[exId][setIdx][field] = value;
      return d;
    });
  }

  function triggerFlash(text) {
    if (!text) return;
    setFlash(text);
    setTimeout(() => setFlash(null), 700);
  }

  const rPercent = dayData ? routinePercent(dayData) : 0;
  const wPercent = dayData ? workoutPercent(dayData) : null;
  const shiftDef = dayData ? SHIFTS[dayData.shift] : SHIFTS.shift1;
  const splitDef = dayData ? WEEKLY_SPLIT[dayData.dayName] : null;

  /* ---------- streak calc ---------- */
  const streak = useMemo(() => {
    if (!allLoaded) return 0;
    let count = 0;
    let cursor = new Date();
    for (let i = 0; i < 365; i++) {
      const key = toKey(cursor);
      const d = key === dayData?.date ? dayData : allDays[key];
      if (d) {
        const rp = routinePercent(d);
        const wp = workoutPercent(d);
        const ok = rp >= 50 || wp === null || wp >= 50;
        if (ok && (rp > 0 || wp > 0)) { count++; } else break;
      } else break;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [allDays, allLoaded, dayData]);

  return (
    <div style={styles.page}>
      <style>{CSS}</style>

      {flash && <div className="sfx">{flash}</div>}

      <header style={styles.masthead}>
        <div style={styles.mastheadInner}>
          <div style={styles.webCorner} />
          <h1 style={styles.title}>THE WALL-CRAWLER'S LOG</h1>
          <p style={styles.subtitle}>Daily patrol tracker — routine, gym &amp; reports</p>
        </div>
      </header>

      <nav style={styles.tabs}>
        {[
          { id: "today", label: "Today" },
          { id: "workout", label: "Workout" },
          { id: "reports", label: "Reports" },
          { id: "logs", label: "Logs" }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{ ...styles.tabBtn, ...(activeTab === t.id ? styles.tabBtnActive : {}) }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {saveError && (
        <div style={styles.errorBanner}>Couldn't save — check connection and try again.</div>
      )}

      {activeTab === "today" && dayData && (
        <TodayTab
          dayData={dayData}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          shiftDef={shiftDef}
          splitDef={splitDef}
          rPercent={rPercent}
          wPercent={wPercent}
          streak={streak}
          toggleBlock={toggleBlock}
          setShift={setShift}
          todayStr={todayStr}
        />
      )}

      {activeTab === "workout" && dayData && splitDef && (
        <WorkoutTab
          dayData={dayData}
          splitDef={splitDef}
          toggleExerciseDone={toggleExerciseDone}
          updateSet={updateSet}
        />
      )}

      {activeTab === "reports" && (
        <ReportsTab
          allDays={allDays}
          allLoaded={allLoaded}
          monthCursor={monthCursor}
          setMonthCursor={setMonthCursor}
          streak={streak}
        />
      )}

      {activeTab === "logs" && (
        <LogsTab
          allDays={allDays}
          allLoaded={allLoaded}
          expandedLog={expandedLog}
          setExpandedLog={setExpandedLog}
        />
      )}
    </div>
  );
}

/* ============================== TODAY TAB ============================== */

function TodayTab({ dayData, selectedDate, setSelectedDate, shiftDef, splitDef, rPercent, wPercent, streak, toggleBlock, setShift, todayStr }) {
  return (
    <div style={styles.panel}>
      <div style={styles.dateRow}>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          style={styles.dateInput}
        />
        {selectedDate !== todayStr && (
          <button style={styles.smallBtn} onClick={() => setSelectedDate(todayStr)}>Jump to today</button>
        )}
        <span style={styles.dayBadge}>{dayData.dayName}</span>
      </div>

      <div style={styles.topGrid}>
        <div style={styles.meterCard}>
          <WebMeter percent={rPercent} />
          <div style={styles.streakRow}>
            <Flame size={16} color="#E62429" />
            <span style={styles.streakText}>{streak}-day streak</span>
          </div>
        </div>

        <div style={styles.shiftPicker}>
          <p style={styles.smallLabel}>Shift for this day</p>
          <div style={styles.shiftBtns}>
            {Object.entries(SHIFTS).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setShift(key)}
                style={{ ...styles.shiftBtn, ...(dayData.shift === key ? styles.shiftBtnActive : {}) }}
              >
                <div style={styles.shiftBtnLabel}>{s.label}</div>
                <div style={styles.shiftBtnTime}>{s.time}</div>
              </button>
            ))}
          </div>
          {splitDef && (
            <div style={styles.workoutPreview}>
              <Dumbbell size={16} color="#0D47A1" />
              <span>
                {splitDef.rest ? "Rest day — no lifting" : `${splitDef.focus} — ${splitDef.subtitle}`}
              </span>
              {wPercent !== null && <span style={styles.workoutPct}>{wPercent}% logged</span>}
            </div>
          )}
        </div>
      </div>

      <p style={styles.sectionHeading}>Patrol checklist</p>
      <div style={styles.blockList}>
        {shiftDef.blocks.map(b => {
          const Icon = ICONS[b.icon] || Check;
          const done = !!dayData.routine[b.id];
          return (
            <button
              key={b.id}
              onClick={() => toggleBlock(b.id)}
              style={{ ...styles.blockRow, ...(done ? styles.blockRowDone : {}) }}
            >
              <span style={{ ...styles.checkbox, ...(done ? styles.checkboxDone : {}) }}>
                {done && <Check size={14} color="#fff" strokeWidth={3} />}
              </span>
              <Icon size={17} color={done ? "#0D47A1" : "#5F5E5A"} style={{ flexShrink: 0 }} />
              <span style={styles.blockTime}>{b.time}</span>
              <span style={{ ...styles.blockActivity, ...(done ? styles.blockActivityDone : {}) }}>
                {b.activity}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================== WORKOUT TAB ============================== */

function WorkoutTab({ dayData, splitDef, toggleExerciseDone, updateSet }) {
  if (splitDef.rest) {
    return (
      <div style={styles.panel}>
        <div style={styles.restCard}>
          <Moon size={28} color="#0D47A1" />
          <p style={styles.restTitle}>Rest day, {dayData.dayName}</p>
          <p style={styles.restSub}>Recovery is part of the training. Sleep, hydrate, come back stronger.</p>
        </div>
      </div>
    );
  }
  return (
    <div style={styles.panel}>
      <div style={styles.workoutHeader}>
        <div>
          <p style={styles.focusTag}>{splitDef.focus}</p>
          <p style={styles.focusSub}>{splitDef.subtitle} · {splitDef.duration}</p>
        </div>
      </div>
      {splitDef.exercises.map(ex => {
        const done = !!dayData.workoutDone[ex.id];
        const sets = dayData.sets[ex.id] || [{ reps: "", weight: "" }, { reps: "", weight: "" }, { reps: "", weight: "" }];
        return (
          <div key={ex.id} style={styles.exerciseCard}>
            <div style={styles.exerciseHeaderRow}>
              <button onClick={() => toggleExerciseDone(ex.id)} style={{ ...styles.checkbox, ...(done ? styles.checkboxDone : {}) }}>
                {done && <Check size={14} color="#fff" strokeWidth={3} />}
              </button>
              <div style={{ flex: 1 }}>
                <p style={{ ...styles.exerciseName, ...(done ? styles.blockActivityDone : {}) }}>{ex.name}</p>
                <p style={styles.exerciseMeta}>{ex.target} · {ex.note}</p>
              </div>
            </div>
            <div style={styles.setsGrid}>
              <div style={styles.setsHeaderRow}>
                <span style={styles.setsHeaderCell}>Set</span>
                <span style={styles.setsHeaderCell}>Reps</span>
                <span style={styles.setsHeaderCell}>Weight (kg)</span>
              </div>
              {[0, 1, 2].map(i => (
                <div key={i} style={styles.setsRow}>
                  <span style={styles.setNum}>{i + 1}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="-"
                    value={sets[i]?.reps ?? ""}
                    onChange={e => updateSet(ex.id, i, "reps", e.target.value)}
                    style={styles.setInput}
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="-"
                    value={sets[i]?.weight ?? ""}
                    onChange={e => updateSet(ex.id, i, "weight", e.target.value)}
                    style={styles.setInput}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================== REPORTS TAB ============================== */

function ReportsTab({ allDays, allLoaded, monthCursor, setMonthCursor, streak }) {
  if (!allLoaded) {
    return <div style={styles.panel}><p style={styles.loadingText}>Loading your logs…</p></div>;
  }

  const { y, m } = monthCursor;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const monthLabel = new Date(y, m, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const chartData = [];
  let sumR = 0, countR = 0, gymSessions = 0, plannedGymDays = 0, studyDone = 0, devDone = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${y}-${pad(m + 1)}-${pad(day)}`;
    const d = allDays[key];
    const rp = d ? routinePercent(d) : 0;
    chartData.push({ day, pct: d ? rp : null });
    if (d) {
      sumR += rp; countR++;
      const wp = workoutPercent(d);
      if (wp !== null) {
        plannedGymDays++;
        if (wp >= 50) gymSessions++;
      }
      const shift = SHIFTS[d.shift] || SHIFTS.shift1;
      const studyBlock = shift.blocks.find(b => b.icon === "study");
      const devBlocks = shift.blocks.filter(b => b.icon === "dev");
      if (studyBlock && d.routine[studyBlock.id]) studyDone++;
      if (devBlocks.some(b => d.routine[b.id])) devDone++;
    }
  }

  const avgCompletion = countR ? Math.round(sumR / countR) : 0;

  const weightData = [];
  Object.values(allDays)
    .filter(d => d.dayName === "Thursday" || d.dayName === "Saturday")
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach(d => {
      const squatSets = d.sets["thu1"] || d.sets["sat1"];
      if (squatSets) {
        const weights = squatSets.map(s => Number(s.weight)).filter(w => w > 0);
        if (weights.length) {
          weightData.push({ date: d.date.slice(5), weight: Math.max(...weights) });
        }
      }
    });

  function shiftMonth(delta) {
    let nm = m + delta, ny = y;
    if (nm < 0) { nm = 11; ny -= 1; }
    if (nm > 11) { nm = 0; ny += 1; }
    setMonthCursor({ y: ny, m: nm });
  }

  return (
    <div style={styles.panel}>
      <div style={styles.monthNav}>
        <button style={styles.smallBtn} onClick={() => shiftMonth(-1)}>◀</button>
        <span style={styles.monthLabel}>{monthLabel}</span>
        <button style={styles.smallBtn} onClick={() => shiftMonth(1)}>▶</button>
      </div>

      <div style={styles.statsGrid}>
        <StatCard icon={<TrendingUp size={16} color="#0D47A1" />} label="Avg completion" value={`${avgCompletion}%`} />
        <StatCard icon={<Dumbbell size={16} color="#E62429" />} label="Gym sessions" value={`${gymSessions}/${plannedGymDays}`} />
        <StatCard icon={<BookOpen size={16} color="#0D47A1" />} label="Study days hit" value={studyDone} />
        <StatCard icon={<Code2 size={16} color="#E62429" />} label="Dev days hit" value={devDone} />
        <StatCard icon={<Flame size={16} color="#E62429" />} label="Current streak" value={`${streak} days`} />
      </div>

      <p style={styles.sectionHeading}>Daily completion — {monthLabel}</p>
      <div style={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0ddd4" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#5F5E5A" }} interval={2} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#5F5E5A" }} width={28} />
            <Tooltip
              formatter={(v) => v === null ? ["No log", ""] : [`${v}%`, "Completion"]}
              contentStyle={{ fontFamily: "Inter, sans-serif", fontSize: 12, borderRadius: 6, border: "2px solid #111" }}
            />
            <Bar dataKey="pct" radius={[3, 3, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.pct === null ? "#e0ddd4" : entry.pct >= 70 ? "#E62429" : "#0D47A1"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {weightData.length > 1 && (
        <>
          <p style={styles.sectionHeading}>Squat top-set progression</p>
          <div style={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0ddd4" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#5F5E5A" }} />
                <YAxis tick={{ fontSize: 10, fill: "#5F5E5A" }} width={28} />
                <Tooltip contentStyle={{ fontFamily: "Inter, sans-serif", fontSize: 12, borderRadius: 6, border: "2px solid #111" }} />
                <Line type="monotone" dataKey="weight" stroke="#E62429" strokeWidth={3} dot={{ r: 3, fill: "#E62429" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIconRow}>{icon}<span style={styles.statLabel}>{label}</span></div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

/* ============================== LOGS TAB ============================== */

function LogsTab({ allDays, allLoaded, expandedLog, setExpandedLog }) {
  if (!allLoaded) {
    return <div style={styles.panel}><p style={styles.loadingText}>Loading your logs…</p></div>;
  }
  const sorted = Object.values(allDays).sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <div style={styles.panel}>
        <div style={styles.restCard}>
          <Zap size={24} color="#0D47A1" />
          <p style={styles.restTitle}>No logs yet</p>
          <p style={styles.restSub}>Check off blocks on the Today tab and they'll show up here.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.panel}>
      {sorted.map(d => {
        const rp = routinePercent(d);
        const wp = workoutPercent(d);
        const isOpen = expandedLog === d.date;
        const shift = SHIFTS[d.shift] || SHIFTS.shift1;
        return (
          <div key={d.date} style={styles.logCard}>
            <button style={styles.logHeader} onClick={() => setExpandedLog(isOpen ? null : d.date)}>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span style={styles.logDate}>{prettyDate(fromKey(d.date))}</span>
              <span style={styles.logDayName}>{d.dayName}</span>
              <span style={styles.logPct}>{rp}%</span>
              {wp !== null && <span style={styles.logPctAlt}>{wp}% lift</span>}
            </button>
            {isOpen && (
              <div style={styles.logBody}>
                <p style={styles.logSubheading}>Routine ({shift.label})</p>
                {shift.blocks.map(b => (
                  <div key={b.id} style={styles.logRow}>
                    <span style={{ color: d.routine[b.id] ? "#0D47A1" : "#B4B2A9" }}>
                      {d.routine[b.id] ? <Check size={13} /> : "—"}
                    </span>
                    <span>{b.activity}</span>
                  </div>
                ))}
                {WEEKLY_SPLIT[d.dayName] && !WEEKLY_SPLIT[d.dayName].rest && (
                  <>
                    <p style={styles.logSubheading}>Workout ({WEEKLY_SPLIT[d.dayName].focus})</p>
                    {WEEKLY_SPLIT[d.dayName].exercises.map(ex => {
                      const sets = d.sets[ex.id] || [];
                      const bestSet = sets.filter(s => s.weight).sort((a, b) => Number(b.weight) - Number(a.weight))[0];
                      return (
                        <div key={ex.id} style={styles.logRow}>
                          <span style={{ color: d.workoutDone[ex.id] ? "#E62429" : "#B4B2A9" }}>
                            {d.workoutDone[ex.id] ? <Check size={13} /> : "—"}
                          </span>
                          <span>{ex.name}</span>
                          {bestSet && <span style={styles.logWeight}>{bestSet.reps}×{bestSet.weight}kg</span>}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================== STYLES ============================== */

const styles = {
  page: {
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#F0EEE6",
    backgroundImage: "radial-gradient(#111111 0.6px, transparent 0.6px)",
    backgroundSize: "14px 14px",
    padding: "16px",
    borderRadius: "10px",
    maxWidth: "640px",
    margin: "0 auto",
    color: "#111111",
    position: "relative"
  },
  masthead: {
    background: "#E62429",
    borderRadius: "8px",
    border: "3px solid #111111",
    padding: "16px 18px",
    marginBottom: "14px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "5px 5px 0 #111111"
  },
  mastheadInner: { position: "relative", zIndex: 1 },
  webCorner: {
    position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px",
    background: "radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(255,255,255,0.08) 41%, rgba(255,255,255,0.08) 43%, transparent 44%)",
    borderRadius: "50%"
  },
  title: {
    fontFamily: "'Bangers', cursive",
    fontSize: "28px",
    letterSpacing: "1px",
    color: "#F4F1EA",
    margin: 0,
    textShadow: "2px 2px 0 #0D47A1",
    lineHeight: 1.1
  },
  subtitle: { fontSize: "12px", color: "#FBEAEA", margin: "4px 0 0", fontWeight: 500 },
  tabs: { display: "flex", gap: "6px", marginBottom: "14px" },
  tabBtn: {
    flex: 1, padding: "9px 4px", fontSize: "12.5px", fontWeight: 600,
    fontFamily: "Inter, sans-serif", background: "#F4F1EA", border: "2px solid #111111",
    borderRadius: "6px", cursor: "pointer", color: "#5F5E5A"
  },
  tabBtnActive: { background: "#0D47A1", color: "#F4F1EA", borderColor: "#111111" },
  panel: {
    background: "#FFFFFF", border: "3px solid #111111", borderRadius: "8px",
    padding: "16px", boxShadow: "6px 6px 0 #111111"
  },
  errorBanner: {
    background: "#FCEBEB", border: "2px solid #791F1F", color: "#791F1F",
    borderRadius: "6px", padding: "8px 12px", fontSize: "12px", marginBottom: "12px", fontWeight: 600
  },
  dateRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", flexWrap: "wrap" },
  dateInput: {
    border: "2px solid #111111", borderRadius: "6px", padding: "6px 8px",
    fontFamily: "Inter, sans-serif", fontSize: "13px", background: "#F4F1EA"
  },
  smallBtn: {
    border: "2px solid #111111", borderRadius: "6px", padding: "5px 10px",
    background: "#F4F1EA", fontSize: "12px", fontWeight: 600, cursor: "pointer"
  },
  dayBadge: {
    marginLeft: "auto", background: "#0D47A1", color: "#F4F1EA", fontSize: "11px",
    fontWeight: 700, padding: "5px 10px", borderRadius: "5px", letterSpacing: "0.5px"
  },
  topGrid: { display: "flex", gap: "16px", marginBottom: "18px", flexWrap: "wrap", alignItems: "stretch" },
  meterCard: {
    flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: "8px", padding: "8px"
  },
  streakRow: { display: "flex", alignItems: "center", gap: "5px" },
  streakText: { fontSize: "12px", fontWeight: 700, color: "#111111" },
  shiftPicker: { flex: "1 1 220px", display: "flex", flexDirection: "column", gap: "8px" },
  smallLabel: { fontSize: "11px", fontWeight: 700, color: "#5F5E5A", letterSpacing: "0.5px", textTransform: "uppercase", margin: "0 0 2px" },
  shiftBtns: { display: "flex", flexDirection: "column", gap: "6px" },
  shiftBtn: {
    textAlign: "left", border: "2px solid #B4B2A9", borderRadius: "6px",
    padding: "7px 10px", background: "#F4F1EA", cursor: "pointer"
  },
  shiftBtnActive: { border: "2px solid #E62429", background: "#FCEBEB" },
  shiftBtnLabel: { fontSize: "12.5px", fontWeight: 700, color: "#111111" },
  shiftBtnTime: { fontSize: "10.5px", color: "#5F5E5A" },
  workoutPreview: {
    display: "flex", alignItems: "center", gap: "6px", fontSize: "12px",
    background: "#E6F1FB", border: "2px solid #0D47A1", borderRadius: "6px",
    padding: "7px 10px", marginTop: "4px", color: "#042C53", fontWeight: 600
  },
  workoutPct: { marginLeft: "auto", fontSize: "11px", color: "#0D47A1" },
  sectionHeading: {
    fontFamily: "'Bangers', cursive", fontSize: "17px", letterSpacing: "0.5px",
    color: "#111111", margin: "4px 0 10px"
  },
  blockList: { display: "flex", flexDirection: "column", gap: "6px" },
  blockRow: {
    display: "flex", alignItems: "center", gap: "9px", width: "100%",
    border: "2px solid #D3D1C7", borderRadius: "6px", padding: "8px 10px",
    background: "#FDFCF9", cursor: "pointer", textAlign: "left"
  },
  blockRowDone: { background: "#EAF3DE", borderColor: "#639922" },
  checkbox: {
    width: "20px", height: "20px", borderRadius: "4px", border: "2px solid #111111",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "#fff", cursor: "pointer"
  },
  checkboxDone: { background: "#0D47A1", borderColor: "#0D47A1" },
  blockTime: { fontSize: "11px", color: "#5F5E5A", fontFamily: "monospace", flexShrink: 0, minWidth: "78px" },
  blockActivity: { fontSize: "13px", fontWeight: 500, color: "#111111" },
  blockActivityDone: { textDecoration: "line-through", color: "#888780" },
  restCard: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
    padding: "30px 10px", textAlign: "center"
  },
  restTitle: { fontFamily: "'Bangers', cursive", fontSize: "22px", margin: "4px 0 0" },
  restSub: { fontSize: "13px", color: "#5F5E5A", margin: 0, maxWidth: "320px" },
  workoutHeader: { marginBottom: "14px" },
  focusTag: { fontFamily: "'Bangers', cursive", fontSize: "24px", color: "#E62429", margin: 0 },
  focusSub: { fontSize: "12.5px", color: "#5F5E5A", margin: "2px 0 0", fontWeight: 600 },
  exerciseCard: {
    border: "2px solid #111111", borderRadius: "7px", padding: "12px", marginBottom: "10px", background: "#FDFCF9"
  },
  exerciseHeaderRow: { display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" },
  exerciseName: { fontSize: "14px", fontWeight: 700, margin: 0 },
  exerciseMeta: { fontSize: "11.5px", color: "#5F5E5A", margin: "2px 0 0" },
  setsGrid: { display: "flex", flexDirection: "column", gap: "5px" },
  setsHeaderRow: { display: "grid", gridTemplateColumns: "36px 1fr 1fr", gap: "8px", padding: "0 2px" },
  setsHeaderCell: { fontSize: "10px", color: "#888780", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" },
  setsRow: { display: "grid", gridTemplateColumns: "36px 1fr 1fr", gap: "8px", alignItems: "center" },
  setNum: { fontSize: "12px", fontWeight: 700, color: "#5F5E5A" },
  setInput: {
    border: "2px solid #D3D1C7", borderRadius: "5px", padding: "6px 8px",
    fontSize: "13px", fontFamily: "monospace", width: "100%", boxSizing: "border-box"
  },
  monthNav: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" },
  monthLabel: { fontFamily: "'Bangers', cursive", fontSize: "20px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px", marginBottom: "18px" },
  statCard: { background: "#F4F1EA", border: "2px solid #111111", borderRadius: "6px", padding: "9px 10px" },
  statIconRow: { display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" },
  statLabel: { fontSize: "10.5px", color: "#5F5E5A", fontWeight: 700 },
  statValue: { fontSize: "18px", fontWeight: 700, fontFamily: "monospace" },
  chartWrap: { marginBottom: "18px", border: "2px solid #111111", borderRadius: "6px", padding: "10px 6px 4px", background: "#FDFCF9" },
  loadingText: { fontSize: "13px", color: "#5F5E5A", textAlign: "center", padding: "20px" },
  logCard: { border: "2px solid #D3D1C7", borderRadius: "6px", marginBottom: "6px", overflow: "hidden" },
  logHeader: {
    display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 10px",
    background: "#F4F1EA", border: "none", cursor: "pointer", textAlign: "left"
  },
  logDate: { fontSize: "12.5px", fontWeight: 700 },
  logDayName: { fontSize: "11px", color: "#5F5E5A" },
  logPct: { marginLeft: "auto", fontSize: "11.5px", fontWeight: 700, color: "#0D47A1" },
  logPctAlt: { fontSize: "11px", fontWeight: 700, color: "#E62429" },
  logBody: { padding: "8px 12px 12px 32px", background: "#FDFCF9", display: "flex", flexDirection: "column", gap: "3px" },
  logSubheading: { fontSize: "10.5px", fontWeight: 700, color: "#888780", textTransform: "uppercase", letterSpacing: "0.5px", margin: "6px 0 2px" },
  logRow: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" },
  logWeight: { marginLeft: "auto", fontFamily: "monospace", color: "#5F5E5A" }
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Inter:wght@400;500;600;700&display=swap');
.sfx {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, 0) rotate(-6deg);
  font-family: 'Bangers', cursive;
  font-size: 48px;
  color: #E62429;
  -webkit-text-stroke: 2px #111111;
  z-index: 999;
  pointer-events: none;
  animation: sfxPop 0.7s ease forwards;
}
@keyframes sfxPop {
  0% { opacity: 0; transform: translate(-50%, 10px) rotate(-6deg) scale(0.6); }
  20% { opacity: 1; transform: translate(-50%, 0) rotate(-6deg) scale(1.1); }
  70% { opacity: 1; transform: translate(-50%, 0) rotate(-6deg) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -10px) rotate(-6deg) scale(1); }
}
input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; }
`;
