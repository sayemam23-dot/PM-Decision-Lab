import { PROJECTS } from '../data/projects';
export default function Setup({ onPick, onBack }) {
  return (
    <section className="section">
      <button className="link" onClick={onBack}>← Back</button>
      <h1>Choose your project</h1>
      <p className="muted">All projects and figures are fictional. Each starts with different conditions.</p>
      <div className="grid2">
        {PROJECTS.map((p) => (
          <button key={p.id} className="card pick" onClick={() => onPick(p)}>
            <h3>{p.name}</h3><p className="muted">{p.blurb}</p>
            <dl className="facts"><div><dt>Duration</dt><dd>{p.weeks} weeks</dd></div><div><dt>Budget</dt><dd>৳{p.budget.toLocaleString('en-US')}</dd></div><div><dt>Team</dt><dd>{p.team}</dd></div><div><dt>Complexity</dt><dd>{p.complexity}</dd></div></dl>
          </button>))}
      </div>
    </section>
  );
}
