import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import useCountUp from '../utils/useCountUp';
import { KEYS, LABELS, isGood, health, weekFor } from '../utils/engine';
import { SCENARIOS } from '../data/scenarios';

const tone = (k, v) => { const s = k === 'risk' ? 100 - v : v; return s >= 65 ? 'good' : s >= 40 ? 'warn' : 'bad'; };
const sign = (n) => (n > 0 ? `+${n}` : `${n}`);

export function ProgressBar({ value, tone: t, label }) {
  return <div className="bar" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><span className={`fill ${t}`} style={{ width: `${value}%` }} /></div>;
}

export function MetricCard({ k, value, prev, sub }) {
  const shown = useCountUp(value);
  const d = prev == null ? 0 : value - prev;
  return (
    <div className="card metric">
      <div className="metric-top"><span className="label">{LABELS[k]}</span>
        {d !== 0 && <span className={`delta ${isGood(k, d) ? 'good' : 'bad'}`}>{prev}% → {value}%</span>}</div>
      <div className="metric-val">{shown}<small>%</small></div>
      <ProgressBar value={value} tone={tone(k, value)} label={LABELS[k]} />
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}

export function ProjectHeader({ project, week, status }) {
  return (
    <div className="proj-head">
      <div><div className="eyebrow">Project</div><h1>{project.name}</h1></div>
      <div className="proj-meta"><strong>Week {week} of {project.weeks}</strong><span className="pill">{status}</span></div>
    </div>
  );
}

export function DecisionButton({ letter, label, onClick, disabled }) {
  return <button className="decision" onClick={onClick} disabled={disabled}><span className="letter">{letter}</span><span>{label}</span></button>;
}

export function ImpactPanel({ delta, choice, why, concept, lesson, learn }) {
  return (
    <div className="card impact" role="status">
      <div className="eyebrow">Decision impact</div>
      <h2>{choice}</h2>
      <ul className="effects">
        {KEYS.map((k) => (
          <li key={k}><span>{LABELS[k]}</span><b className={delta[k] === 0 ? '' : isGood(k, delta[k]) ? 'good' : 'bad'}>{delta[k] === 0 ? '0' : sign(delta[k])}</b></li>
        ))}
      </ul>
      <p>{why}</p>
      {learn && <div className="callout"><b>Concept: {concept}</b><p>{lesson}</p></div>}
    </div>
  );
}

export function DecisionTimeline({ sim, project }) {
  return (
    <ol className="timeline">
      <li><b>Week 1</b> Project started</li>
      {sim.history.map((h, i) => (
        <li key={h.sid}>
          <b>Week {weekFor(i, SCENARIOS.length, project.weeks)}</b> {SCENARIOS[i].title}
          <span className="arrow">→ {SCENARIOS[i].options[h.opt].label}</span>
        </li>
      ))}
      {sim.phase === 'done' && <li><b>Week {project.weeks}</b> Project completed</li>}
    </ol>
  );
}

const COLORS = { health: '#e6edf7', schedule: '#5b8cff', budget: '#2fbf8a', scope: '#a78bfa', quality: '#22b8cf', morale: '#f0b429', stakeholders: '#f783ac', risk: '#ef5350' };
export function ChartPanel({ sim, project }) {
  const data = [{ week: 'Start', ...project.start, health: health(project.start) }].concat(
    sim.history.map((h, i) => ({ week: `W${weekFor(i, SCENARIOS.length, project.weeks)}`, ...h.after, health: health(h.after) })));
  const summary = `Line chart of project metrics over ${data.length - 1} decisions. Final project health ${data[data.length - 1].health}%.`;
  return (
    <div className="card" role="img" aria-label={summary}>
      <div className="eyebrow">Project health over time</div>
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#243049" vertical={false} />
            <XAxis dataKey="week" stroke="#8a97ad" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} stroke="#8a97ad" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#0f1729', border: '1px solid #243049', borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {['health', ...KEYS].map((k) => <Line key={k} type="monotone" dataKey={k} name={k === 'health' ? 'Project Health' : LABELS[k]} stroke={COLORS[k]} strokeWidth={k === 'health' ? 3 : 1.5} dot={false} isAnimationActive={!window.matchMedia('(prefers-reduced-motion: reduce)').matches} />)}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
