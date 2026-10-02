const FACE = [['Scope Creep', 'The client wants more than was agreed.'], ['Deadline Pressure', 'The date will not move. Something else must.'], ['Budget Cuts', 'Fewer resources, same expectations.'], ['Team Conflict', 'Two strong opinions, one decision.'], ['Critical Bugs', 'A serious defect, days before release.'], ['Stakeholder Changes', 'Requirements shift mid-project.']];
const STEPS = ['Choose a project', 'Face real-world challenges', 'Make decisions', 'Watch the project evolve', 'Review your final outcome'];
export default function Landing({ onStart, onResume, canResume, onAbout }) {
  return (
    <>
      <section className="hero">
        <div className="eyebrow">Interactive project management simulation</div>
        <h1 className="display">PM Decision Lab</h1>
        <p className="tagline">Every decision changes the project.</p>
        <p className="lead">Step into the role of a Project Manager. Handle scope changes, deadlines, team conflicts, budget pressure and unexpected risks — then see how your decisions shape the project.</p>
        <div className="cta">
          <button className="btn primary" onClick={onStart}>Start Simulation</button>
          <a className="btn" href="#how">How It Works</a>
          {canResume && <button className="btn" onClick={onResume}>Resume simulation</button>}
        </div>
      </section>
      <section id="how" className="section"><h2>How it works</h2>
        <ol className="steps">{STEPS.map((s, i) => <li key={s} className="card"><span className="num">{i + 1}</span>{s}</li>)}</ol></section>
      <section className="section"><h2>What you'll face</h2>
        <div className="grid3">{FACE.map(([t, d]) => <div className="card" key={t}><h3>{t}</h3><p className="muted">{d}</p></div>)}</div></section>
      <footer className="footer"><div><strong>PM Decision Lab</strong><div className="muted">An interactive project management simulation.</div></div>
        <div className="foot-links"><button className="link" onClick={onAbout}>About</button><a href="https://github.com/your-username/pm-decision-lab" target="_blank" rel="noreferrer">GitHub</a></div></footer>
    </>
  );
}
