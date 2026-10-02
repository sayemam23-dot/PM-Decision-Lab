import { useState } from 'react';
import { SCENARIOS } from '../data/scenarios';
import { CONCEPTS } from '../data/concepts';
import { KEYS, weekFor } from '../utils/engine';
import { MetricCard, ProjectHeader, DecisionButton, ImpactPanel, DecisionTimeline } from '../components/ui';
export default function Play({ sim, project, learn, setLearn, onDecide, onNext, onQuit }) {
  const [showHist, setShowHist] = useState(false);
  const total = SCENARIOS.length, sc = SCENARIOS[sim.step], fb = sim.phase === 'feedback';
  const last = sim.history[sim.history.length - 1];
  const prev = (k) => (fb ? sim.metrics[k] - last.delta[k] : null);
  const concepts = sc.concepts.map((c) => CONCEPTS[c][0]).join(' · ');
  return (
    <section className="section">
      <ProjectHeader project={project} week={weekFor(sim.step, total, project.weeks)} status="In progress" />
      <div className="toolbar">
        <div className="seg" role="group" aria-label="Mode">
          <button aria-pressed={!learn} onClick={() => setLearn(false)}>Simulation</button>
          <button aria-pressed={learn} onClick={() => setLearn(true)}>Learning</button>
        </div>
        <button className="link" onClick={() => setShowHist(!showHist)} aria-expanded={showHist}>Decision history</button>
        <button className="link" onClick={onQuit}>Restart</button>
      </div>
      <div className="metrics">
        {KEYS.map((k) => <MetricCard key={k} k={k} value={sim.metrics[k]} prev={prev(k)} sub={k === 'budget' ? `৳${Math.round((project.budget * sim.metrics.budget) / 100).toLocaleString('en-US')} remaining` : null} />)}
      </div>
      {showHist && <div className="card"><DecisionTimeline sim={sim} project={project} /></div>}
      <div key={`${sim.step}-${sim.phase}`} className="stage">
        {!fb ? (
          <div className="card scenario">
            <div className="eyebrow">Scenario {String(sim.step + 1).padStart(2, '0')} of {total}</div>
            <h2>{sc.title}</h2><p className="lead">{sc.text}</p>
            {learn && <div className="callout"><b>Concept: {concepts}</b><p>{CONCEPTS[sc.concepts[0]][1]}</p></div>}
            <div className="decisions">{sc.options.map((o, i) => <DecisionButton key={o.label} letter={String.fromCharCode(65 + i)} label={o.label} onClick={() => onDecide(i)} />)}</div>
          </div>
        ) : (
          <>
            <ImpactPanel delta={last.delta} choice={sc.options[last.opt].label} why={sc.options[last.opt].why} concept={concepts} lesson={sc.lesson} learn={learn} />
            <button className="btn primary wide" onClick={onNext} autoFocus>{sim.step + 1 >= total ? 'See results' : 'Continue'}</button>
          </>
        )}
      </div>
    </section>
  );
}
