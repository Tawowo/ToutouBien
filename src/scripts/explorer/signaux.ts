import { CONTEXTS, PARTS, SCENARIOS, cuesSentence, readPosture, type Axis, type ContextValue, type PostureState } from '~/lib/signaux';

export function initSignaux(root: ParentNode = document): void {
  const lab = root.querySelector<HTMLElement>('[data-signaux]');
  const form = lab?.querySelector<HTMLFormElement>('[data-controls]');
  const dog = lab?.querySelector<SVGSVGElement>('.dog');
  const stage = lab?.querySelector<HTMLElement>('.xp__stage');
  if (!lab || !form || !dog || !stage) return;

  const $ = <T extends Element>(sel: string) => lab.querySelector<T>(sel)!;
  const title = $<HTMLElement>('[data-r-title]');
  const summary = $<HTMLElement>('[data-r-summary]');
  const cues = $<HTMLElement>('[data-r-cues]');
  const advice = $<HTMLElement>('[data-r-advice]');
  const ctxLabel = $<HTMLElement>('[data-ctx-label]');
  const quizPanel = $<HTMLElement>('[data-quiz-panel]');
  const quizFeedback = $<HTMLElement>('[data-quiz-feedback]');
  let quizAnswer: Axis | null = null;

  const read = (): { state: PostureState; context: ContextValue } => {
    const data = new FormData(form);
    const state = Object.fromEntries(PARTS.map((p) => [p.key, String(data.get(p.key))])) as PostureState;
    return { state, context: String(data.get('context')) as ContextValue };
  };

  const render = () => {
    const { state, context } = read();
    for (const [k, v] of Object.entries(state)) dog.dataset[k] = v;
    stage.dataset.context = context;
    ctxLabel.textContent = CONTEXTS.find((c) => c.value === context)?.label ?? '';
    const r = readPosture(state, context);
    title.textContent = r.title;
    summary.textContent = r.summary;
    cues.textContent = cuesSentence(r.cues);
    advice.textContent = r.advice;
    for (const [axis, v] of Object.entries(r.share)) {
      lab.querySelector<HTMLElement>(`[data-bar="${axis}"]`)?.style.setProperty('--v', v.toFixed(3));
    }
    return r;
  };

  const applyScenario = (id: string) => {
    const s = SCENARIOS.find((x) => x.id === id);
    if (!s) return;
    for (const [k, v] of Object.entries(s.state)) {
      const input = form.querySelector<HTMLInputElement>(`input[name="${k}"][value="${v}"]`);
      if (input) input.checked = true;
    }
    const ctx = form.querySelector<HTMLInputElement>(`input[name="context"][value="${s.context}"]`);
    if (ctx) ctx.checked = true;
  };

  form.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === 'scenario') applyScenario(t.value);
    else if (t.name !== 'context') form.querySelectorAll<HTMLInputElement>('input[name="scenario"]').forEach((i) => (i.checked = false));
    const r = render();
    if (quizAnswer) quizAnswer = r.dominant;
  });

  // Mode quiz : une posture tirée au hasard, la lecture est masquée jusqu'à la réponse.
  $<HTMLButtonElement>('[data-quiz-start]').addEventListener('click', () => {
    const s = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]!;
    applyScenario(s.id);
    form.querySelectorAll<HTMLInputElement>('input[name="scenario"]').forEach((i) => (i.checked = false));
    quizAnswer = render().dominant;
    lab.classList.add('is-quiz');
    quizPanel.hidden = false;
    quizFeedback.textContent = '';
    quizPanel.querySelector<HTMLButtonElement>('[data-answer]')?.focus();
  });

  quizPanel.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-answer]');
    if (!btn || !quizAnswer) return;
    const ok = btn.dataset.answer === quizAnswer;
    quizFeedback.textContent = ok
      ? 'Bien vu ! La lecture détaillée est affichée : comparez avec votre intuition.'
      : 'Pas tout à fait : regardez la lecture détaillée et les indices qui l’expliquent.';
    lab.classList.remove('is-quiz');
  });

  render();
}
