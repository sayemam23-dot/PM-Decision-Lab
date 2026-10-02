export default function About({ onBack }) {
  return (
    <section className="section narrow">
      <button className="link" onClick={onBack}>← Back</button>
      <h1>About</h1>
      <p className="lead">PM Decision Lab is a frontend-only educational simulation designed to demonstrate project management decision-making and trade-offs.</p>
      <p>There is no single correct answer. Each option improves some metrics while costing others, which is the core idea of managing a project under constraints.</p>
      <p className="callout">This is an educational simulation, not a professional project-management assessment. All projects, figures and scenarios are fictional.</p>
    </section>
  );
}
