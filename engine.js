import { PROJECTS } from '../data/projects';
export const KEYS = ['schedule', 'budget', 'scope', 'quality', 'morale', 'stakeholders', 'risk'];
export const LABELS = { schedule: 'Schedule', budget: 'Budget', scope: 'Scope', quality: 'Quality', morale: 'Team Morale', stakeholders: 'Stakeholder Satisfaction', risk: 'Risk' };
export const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
export const getProject = (id) => PROJECTS.find((p) => p.id === id);
export const weekFor = (i, total, weeks) => Math.max(1, Math.round(((i + 1) / total) * weeks));

export function applyEffects(metrics, fx) {
  const next = {}, delta = {};
  KEYS.forEach((k, i) => { next[k] = clamp(metrics[k] + fx[i]); delta[k] = next[k] - metrics[k]; });
  return { next, delta };
}
// Project Health: average of the six positive metrics and inverted risk.
export const health = (m) => Math.round((KEYS.filter((k) => k !== 'risk').reduce((s, k) => s + m[k], 0) + (100 - m.risk)) / 7);
// Higher value is "better" for every metric except risk.
export const isGood = (k, d) => (k === 'risk' ? d < 0 : d > 0);

export const newSim = (project) => ({ projectId: project.id, step: 0, phase: 'decide', metrics: { ...project.start }, history: [], startedAt: Date.now() });
export function decide(sim, scenarios, optIdx) {
  const o = scenarios[sim.step].options[optIdx];
  const { next, delta } = applyEffects(sim.metrics, o.fx);
  return { ...sim, metrics: next, phase: 'feedback', history: [...sim.history, { sid: scenarios[sim.step].id, opt: optIdx, delta, after: next }] };
}
export function advance(sim, total) {
  const step = sim.step + 1;
  return { ...sim, step, phase: step >= total ? 'done' : 'decide' };
}
export function outcome(m) {
  const h = health(m);
  const weak = KEYS.filter((k) => k !== 'risk' && m[k] < 45).length + (m.risk > 65 ? 1 : 0);
  if (h >= 72 && weak === 0) return { title: 'Successful Delivery', text: 'The project reached production with strong quality and manageable risk.' };
  if (h >= 55 && weak <= 2) return { title: 'Challenging Delivery', text: 'The project was delivered, but schedule and team pressure created significant trade-offs.' };
  return { title: 'Recovery Required', text: 'The project encountered major problems. Several decisions created compounding effects that affected the final outcome.' };
}
export function insights(sim, scenarios) {
  const rows = sim.history.map((h, i) => {
    const net = KEYS.reduce((s, k) => s + (k === 'risk' ? -h.delta[k] : h.delta[k]), 0);
    const size = KEYS.reduce((s, k) => s + Math.abs(h.delta[k]), 0);
    return { i, title: scenarios[i].title, net, size };
  });
  if (!rows.length) return null;
  const by = (f) => rows.reduce((a, b) => (f(b) > f(a) ? b : a));
  const totals = KEYS.map((k) => [k, sim.history.reduce((s, h) => s + Math.abs(h.delta[k]), 0)]);
  return { best: by((r) => r.net), worst: by((r) => -r.net), influential: by((r) => r.size), metric: totals.reduce((a, b) => (b[1] > a[1] ? b : a))[0] };
}
