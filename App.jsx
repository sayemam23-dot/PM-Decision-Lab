import { useEffect, useState } from 'react';
import { SCENARIOS } from './data/scenarios';
import { newSim, decide, advance, getProject, health } from './utils/engine';
import { loadSim, saveSim, clearSim, loadPrefs, savePrefs, loadDone, saveDone } from './utils/storage';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Play from './pages/Play';
import Results from './pages/Results';
import About from './pages/About';

export default function App() {
  const [sim, setSim] = useState(loadSim);
  const [prefs, setPrefs] = useState(loadPrefs);
  const [view, setView] = useState(() => (sim ? (sim.phase === 'done' ? 'results' : 'play') : 'landing'));
  useEffect(() => { sim ? saveSim(sim) : clearSim(); }, [sim]);
  useEffect(() => savePrefs(prefs), [prefs]);
  useEffect(() => { window.scrollTo(0, 0); }, [view, sim?.step, sim?.phase]);

  const project = sim && getProject(sim.projectId);
  const start = (p) => { setSim(newSim(p)); setView('play'); };
  const next = () => {
    const s = advance(sim, SCENARIOS.length);
    setSim(s);
    if (s.phase === 'done') { saveDone([...loadDone(), { projectId: s.projectId, health: health(s.metrics), at: Date.now() }]); setView('results'); }
  };
  const restart = () => { if (window.confirm('Discard this simulation and start over?')) { setSim(null); setView('setup'); } };
  const active = sim && sim.phase !== 'done';

  return (
    <>
      <header className="topbar">
        <button className="brand" onClick={() => setView('landing')}><span className="logo" aria-hidden="true" />PM Decision Lab</button>
        <nav><button className="link" onClick={() => setView('about')}>About</button></nav>
      </header>
      <main>
        {view === 'landing' && <Landing onStart={() => setView('setup')} canResume={!!active} onResume={() => setView('play')} onAbout={() => setView('about')} />}
        {view === 'setup' && <Setup onPick={start} onBack={() => setView('landing')} />}
        {view === 'about' && <About onBack={() => setView(sim ? (sim.phase === 'done' ? 'results' : 'play') : 'landing')} />}
        {view === 'play' && active && <Play sim={sim} project={project} learn={prefs.learn} setLearn={(learn) => setPrefs({ ...prefs, learn })} onDecide={(i) => setSim(decide(sim, SCENARIOS, i))} onNext={next} onQuit={restart} />}
        {view === 'results' && sim?.phase === 'done' && <Results sim={sim} project={project} onAgain={() => { setSim(null); setView('setup'); }} onHome={() => setView('landing')} />}
      </main>
    </>
  );
}
