import { SCENARIOS } from '../data/scenarios';
import { KEYS, getProject } from './engine';
// Every read is wrapped: corrupted or missing data falls back safely instead of crashing.
const read = (k, fb) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fb; } catch { return fb; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };
const validSim = (s) => s && typeof s === 'object' && getProject(s.projectId) && Number.isInteger(s.step) && s.step >= 0 && s.step <= SCENARIOS.length
  && ['decide', 'feedback', 'done'].includes(s.phase) && s.metrics && KEYS.every((k) => Number.isFinite(s.metrics[k]))
  && Array.isArray(s.history) && s.history.length <= SCENARIOS.length && s.history.every((h) => h && h.delta && h.after && Number.isInteger(h.opt));
export const loadSim = () => { const s = read('pmdl:sim', null); return validSim(s) ? s : null; };
export const saveSim = (s) => write('pmdl:sim', s);
export const clearSim = () => { try { localStorage.removeItem('pmdl:sim'); } catch { /* ignore */ } };
export const loadPrefs = () => { const p = read('pmdl:prefs', {}); return { learn: p && p.learn === true }; };
export const savePrefs = (p) => write('pmdl:prefs', p);
export const loadDone = () => { const d = read('pmdl:done', []); return Array.isArray(d) ? d.filter((x) => x && typeof x.health === 'number') : []; };
export const saveDone = (d) => write('pmdl:done', d.slice(-20));
