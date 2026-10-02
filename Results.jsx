import { SCENARIOS } from '../data/scenarios';
import { CONCEPTS } from '../data/concepts';
import { KEYS, LABELS, health, outcome, insights } from '../utils/engine';
import { MetricCard, ChartPanel, DecisionTimeline, ProjectHeader } from '../components/ui';
export default function Results({ sim, project, onAgain, onHome }) {
  const m = sim.metrics, out = outcome(m), ins = insights(sim, SCENARIOS);
  const seen = [...new Set(SCENARIOS.flatMap((s) => s.concepts))];
  return (
    <section className="section">
      <ProjectHeader project={project} week={project.weeks} status="Completed" />
      <div className="card result">
        <div className="eyebrow">Simulation outcome</div>
        <h2>{out.title}</h2><p className="lead">{out.text}</p>
        <div className="health"><span>Project Health</span><strong>{health(m)}%</strong></div>
        <p className="muted small">This score reflects the simulated outcome of your decisions, not your real-world project management ability.</p>
      </div>
      <div className="metrics">{KEYS.map((k) => <MetricCard key={k} k={k} value={m[k]} />)}</div>
      <ChartPanel sim={sim} project={project} />
      {ins && <div className="grid3">
        <div className="card"><div className="eyebrow">Largest positive impact</div><h3>{ins.best.title}</h3></div>
        <div className="card"><div className="eyebrow">Largest negative impact</div><h3>{ins.worst.title}</h3></div>
        <div className="card"><div className="eyebrow">Most affected metric</div><h3>{LABELS[ins.metric]}</h3></div>
        <div className="card span3"><p>Your most influential decision was Scenario {ins.influential.i + 1}: {ins.influential.title}.</p></div>
      </div>}
      <div className="card"><div className="eyebrow">Decision history</div><DecisionTimeline sim={sim} project={project} /></div>
      <div className="card"><div className="eyebrow">Concepts you encountered</div>
        <ul className="concepts">{seen.map((c) => <li key={c}><b>{CONCEPTS[c][0]}</b><span className="muted">{CONCEPTS[c][1]}</span></li>)}</ul></div>
      <div className="cta"><button className="btn primary" onClick={onAgain}>Try another project</button><button className="btn" onClick={onHome}>Home</button></div>
    </section>
  );
}
