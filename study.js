/* Additional practice features for the existing 300-phrase speaking site. */
(() => {
  'use strict';
  const cards = Array.from(document.querySelectorAll('.card'));
  const groups = Array.from(document.querySelectorAll('.category'));
  const empty = document.getElementById('empty');
  const count = document.getElementById('count');
  if (!cards.length || !empty || !count || typeof filter !== 'function') return;

  const storageKey = 'eiken-grade1-speaking-progress-v1';
  const allowed = new Set(['review', 'mastered']);
  const progress = {};
  let canSave = true;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      for (const [id, value] of Object.entries(saved)) {
        if (/^\d{3}$/.test(id) && allowed.has(value)) progress[id] = value;
      }
    }
  } catch (_) { canSave = false; }

  const panel = document.createElement('section');
  panel.className = 'study-panel';
  panel.setAttribute('aria-label', '学習状況と復習');
  panel.innerHTML =
    '<div class="study-panel-title"><strong>学習と復習</strong><span id="study-summary" aria-live="polite"></span></div>' +
    '<div class="study-panel-controls"><label for="study-status-filter">学習状況で絞る</label>' +
    '<select id="study-status-filter"><option value="all">すべて</option><option value="new">未学習</option>' +
    '<option value="review">要復習</option><option value="mastered">習得済み</option></select>' +
    '<button type="button" id="study-review-random">要復習から1つ練習</button></div>' +
    '<p class="study-note" id="study-storage-note">各表現の「要復習」「習得済み」を記録できます。記録はこのブラウザ内だけに保存され、端末間では同期されません。</p>';
  empty.parentNode.insertBefore(panel, empty);
  const summary = document.getElementById('study-summary');
  const statusSelect = document.getElementById('study-status-filter');
  const randomReview = document.getElementById('study-review-random');
  const speechReady = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  for (const card of cards) {
    const actions = document.createElement('div');
    actions.className = 'study-card-actions';
    actions.innerHTML =
      '<button type="button" data-study-action="recall" aria-pressed="false">英文を隠して練習</button>' +
      '<button type="button" data-study-action="speak"' +
      (speechReady ? '' : ' disabled title="この環境では音声読み上げを使用できません"') + '>例文①を聴く</button>' +
      '<button type="button" data-study-action="review" aria-pressed="false">要復習</button>' +
      '<button type="button" data-study-action="mastered" aria-pressed="false">習得済み</button>';
    card.insertBefore(actions, card.querySelector('.examples') || card.firstChild);
  }

  const statusOf = card => progress[card.dataset.id] || 'new';
  function showStorageWarning() {
    if (canSave) return;
    const note = document.getElementById('study-storage-note');
    note.textContent = 'このブラウザでは学習履歴を保存できません。画面を閉じると記録が失われる可能性があります。';
    note.setAttribute('role', 'alert');
  }
  function persist() {
    if (!canSave) return;
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); }
    catch (_) { canSave = false; showStorageWarning(); }
  }
  function showCardState(card) {
    for (const name of ['review', 'mastered']) {
      const button = card.querySelector('[data-study-action="' + name + '"]');
      const active = statusOf(card) === name;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('study-selected', active);
      button.title = active ? 'もう一度押すと未学習に戻します' : '';
    }
  }
  function updateSummary() {
    const review = cards.filter(c => statusOf(c) === 'review').length;
    const mastered = cards.filter(c => statusOf(c) === 'mastered').length;
    summary.textContent = '未学習 ' + (cards.length - review - mastered) +
      ' · 要復習 ' + review + ' · 習得済み ' + mastered;
    randomReview.disabled = review === 0;
  }
  function applyFilters() {
    // Respect the original search/category/priority filters first.
    filter();
    const selection = statusSelect.value;
    let visible = 0;
    for (const card of cards) {
      if (!card.hidden && selection !== 'all' && statusOf(card) !== selection) card.hidden = true;
      if (!card.hidden) visible++;
    }
    for (const group of groups) {
      group.hidden = !Array.from(group.querySelectorAll('.card')).some(c => !c.hidden);
    }
    count.textContent = visible + ' 表現 / ' + visible * 3 + ' 例文';
    empty.hidden = visible > 0;
    updateSummary();
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-study-action]');
    if (!button) return;
    const card = button.closest('.card');
    if (!card) return;
    const action = button.dataset.studyAction;
    if (action === 'recall') {
      const hidden = card.classList.toggle('study-recall-mode');
      button.setAttribute('aria-pressed', String(hidden));
      button.textContent = hidden ? '英文を表示する' : '英文を隠して練習';
      if (hidden) {
        const jp = document.getElementById('jp');
        if (jp && !jp.checked) {
          jp.checked = true;
          jp.dispatchEvent(new Event('change'));
        }
      }
      return;
    }
    if (action === 'speak' && speechReady) {
      const example = card.querySelector('.example .english');
      if (!example) return;
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(example.textContent.trim());
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
      return;
    }
    if (allowed.has(action)) {
      const id = card.dataset.id;
      if (statusOf(card) === action) delete progress[id];
      else progress[id] = action;
      persist();
      showCardState(card);
      applyFilters();
    }
  });

  // The existing event handlers run first; our status filter runs after them.
  document.getElementById('search').addEventListener('input', applyFilters);
  document.getElementById('category').addEventListener('change', applyFilters);
  document.getElementById('priority').addEventListener('change', applyFilters);
  statusSelect.addEventListener('change', applyFilters);
  randomReview.addEventListener('click', () => {
    const pending = cards.filter(c => statusOf(c) === 'review');
    if (!pending.length) return;
    document.getElementById('search').value = '';
    document.getElementById('category').value = '';
    document.getElementById('priority').checked = false;
    statusSelect.value = 'review';
    applyFilters();
    cards.forEach(c => c.classList.remove('spotlight'));
    const selected = pending[Math.floor(Math.random() * pending.length)];
    selected.classList.add('spotlight');
    selected.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  cards.forEach(showCardState);
  showStorageWarning();
  applyFilters();
})();