(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const R = Object.fromEntries(REGIONS.map(r => [r.id, r]));
  const PARENT = {};
  REGIONS.forEach(r => (r.children || []).forEach(c => (PARENT[c] = r.id)));
  const NAT = { cortex: "#f1c6ae", deep: "#e7aa9a", stem: "#e6b39e", cbl: "#ecbaa5", gland: "#dd9a8c", wm: "#f7e4d6" };
  const VIEW_HINT = {
    lateral: "Outside view — left side of the brain, front facing left. Hover or tap any region.",
    medial: "Inside view — brain cut down the middle. Hippocampus and amygdala are shown projected; basal ganglia dashed."
  };

  const store = {
    get(k, d) { try { const v = localStorage.getItem("mindatlas:" + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("mindatlas:" + k, JSON.stringify(v)); } catch {} }
  };

  const state = { view: "lateral", sel: null, colored: store.get("colored", false), labels: store.get("labels", false) };
  const inView = (id, view) => SHAPES[view].some(s => !s.deco && s.id === id);

  /* ---------- SVG ---------- */
  function buildSVG(view) {
    const L = { under: "", cortex: "", over: "" };
    let labels = "";
    for (const s of SHAPES[view]) {
      if (s.deco) { L[s.layer] += `<path d="${s.d}" class="deco ${s.cls}"/>`; continue; }
      const r = R[s.id];
      L[s.layer] += `<path d="${s.d}" class="region${s.dashed ? " dashed" : ""}" data-id="${r.id}" style="--c:${r.color};--n:${NAT[r.kind]}" tabindex="0" role="button" aria-label="${r.name}"/>`;
      labels += `<text x="${s.lx}" y="${s.ly}" class="lbl" data-for="${r.id}">${r.short}</text>`;
    }
    return `<svg viewBox="100 60 630 500" class="brain${state.colored ? " colored" : ""}${state.labels ? " show-labels" : ""}" role="img" aria-label="Interactive brain diagram">
      <defs>
        <clipPath id="clip-${view}"><path d="${OUTLINE}"/></clipPath>
        <radialGradient id="shade-${view}" cx="38%" cy="28%" r="80%">
          <stop offset="0" stop-color="#fff" stop-opacity=".35"/>
          <stop offset=".55" stop-color="#fff" stop-opacity="0"/>
          <stop offset="1" stop-color="#5a1a1a" stop-opacity=".22"/>
        </radialGradient>
      </defs>
      ${L.under}
      <g clip-path="url(#clip-${view})"><path d="${OUTLINE}" class="base"/>${L.cortex}</g>
      <path d="${OUTLINE}" class="shade" fill="url(#shade-${view})"/>
      <path d="${OUTLINE}" class="outline"/>
      ${L.over}
      <g class="labels">${labels}</g>
    </svg>`;
  }

  function renderStage() {
    $("#stage").innerHTML = buildSVG(state.view);
    $("#viewHint").textContent = VIEW_HINT[state.view];
    $$(".seg-btn").forEach(b => b.classList.toggle("active", b.dataset.view === state.view));
    applySel();
  }

  function applySel() {
    const kids = state.sel ? R[state.sel].children || [] : [];
    $$("#stage .region").forEach(p => {
      p.classList.toggle("active", p.dataset.id === state.sel);
      p.classList.toggle("child", kids.includes(p.dataset.id));
    });
    $$("#stage .lbl").forEach(t => t.classList.toggle("show", t.dataset.for === state.sel));
    $$("#chips .chip").forEach(c => c.classList.toggle("active", c.dataset.region === state.sel));
  }

  /* ---------- Panel ---------- */
  const chip = (id) => `<button class="chip" data-region="${id}"><span class="dot" style="background:${R[id].color}"></span>${R[id].name}</button>`;
  const dayIndex = () => Math.floor(Date.now() / 864e5);

  function renderPanel() {
    const panel = $("#panel");
    const r = R[state.sel];
    if (!r) {
      const f = REGIONS[dayIndex() % REGIONS.length];
      panel.innerHTML = `<div class="intro">
        <p class="kicker">Welcome</p>
        <h2>The Brain</h2>
        <p>Welcome to the brain, the command center of the body. Weighing about three pounds (1.4 kg), it controls everything from your heartbeat to your memories, emotions and sense of self.</p>
        <p>It contains about <b>86 billion neurons</b> that communicate with chemical and electrical signals. Groups of neurons link up through long fibers called axons to form circuits, and different regions specialize in different jobs — while constantly working together.</p>
        <p>Alongside neurons are billions of <b>glial cells</b>, which support, protect and nourish them.</p>
        <div class="fact"><b>Fact of the day — ${f.name}:</b> ${f.fact}</div>
        <div class="how"><b>How to explore:</b> click any region of the brain, pick one from the menu, or switch to the <b>Inside view</b> to see deep structures like the hippocampus and amygdala.</div>
      </div>`;
      return;
    }
    const related = TOPICS.filter(t => t.regions.includes(r.id)).map(t => t.title);
    const idx = REGIONS.indexOf(r);
    const prev = REGIONS[(idx - 1 + REGIONS.length) % REGIONS.length];
    const next = REGIONS[(idx + 1) % REGIONS.length];
    panel.innerHTML = `
      <p class="kicker">${r.group}</p>
      <h2>${r.name}</h2>
      <p class="where">Location: ${r.where}</p>
      <p class="lead">${r.summary}</p>
      <h3>What it does</h3>
      <ul>${r.functions.map(f => `<li>${f}</li>`).join("")}</ul>
      <h3>Psychology connection</h3>
      <p>${r.psych}</p>
      <h3>When it's damaged</h3>
      <p>${r.damage}</p>
      <h3>Keep it healthy</h3>
      <ul class="tips-list">${r.tips.map(t => `<li>${t}</li>`).join("")}</ul>
      <div class="fact"><b>Did you know?</b> ${r.fact}</div>
      ${r.children ? `<h3>Includes</h3><div class="chips">${r.children.map(chip).join("")}</div>` : ""}
      ${PARENT[r.id] ? `<h3>Part of</h3><div class="chips">${chip(PARENT[r.id])}</div>` : ""}
      ${related.length ? `<h3>Involved in</h3><p class="small">${related.join(" · ")}</p>` : ""}
      <h3>My notes</h3>
      <textarea class="notes" id="notes" placeholder="Your own notes about the ${r.name}… (saved in this browser)"></textarea>
      <div class="panel-nav">
        <button class="tool" data-region="${prev.id}">← ${prev.short}</button>
        <button class="tool" data-region="${next.id}">${next.short} →</button>
      </div>`;
    const notes = $("#notes");
    notes.value = store.get("notes:" + r.id, "");
    notes.addEventListener("input", () => store.set("notes:" + r.id, notes.value));
    panel.scrollTop = 0;
  }

  /* ---------- Selection ---------- */
  function select(id, { scroll = false } = {}) {
    state.sel = id && R[id] ? id : null;
    if (state.sel && !inView(state.sel, state.view)) {
      state.view = inView(state.sel, "lateral") ? "lateral" : "medial";
      renderStage();
    } else applySel();
    renderPanel();
    $("#regionSelect").value = state.sel || "";
    history.replaceState(null, "", state.sel ? "#region=" + state.sel : location.pathname);
    if (scroll) $("#explore").scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- Toolbar ---------- */
  function initToolbar() {
    const sel = $("#regionSelect");
    const cats = [...new Set(REGIONS.map(r => r.cat))];
    sel.innerHTML = `<option value="">The Brain (overview)</option>` + cats.map(c =>
      `<optgroup label="${c}">${REGIONS.filter(r => r.cat === c).map(r => `<option value="${r.id}">${r.name}</option>`).join("")}</optgroup>`).join("");
    sel.addEventListener("change", () => select(sel.value));

    $$(".seg-btn").forEach(b => b.addEventListener("click", () => { state.view = b.dataset.view; renderStage(); }));

    const lb = $("#labelsBtn"), cb = $("#colorBtn");
    const sync = () => {
      lb.setAttribute("aria-pressed", state.labels);
      cb.setAttribute("aria-pressed", state.colored);
      const svg = $("#stage svg");
      svg.classList.toggle("show-labels", state.labels);
      svg.classList.toggle("colored", state.colored);
    };
    lb.addEventListener("click", () => { state.labels = !state.labels; store.set("labels", state.labels); sync(); });
    cb.addEventListener("click", () => { state.colored = !state.colored; store.set("colored", state.colored); sync(); });
    sync();

    $("#randomBtn").addEventListener("click", () => {
      let r; do { r = REGIONS[Math.floor(Math.random() * REGIONS.length)]; } while (r.id === state.sel);
      select(r.id);
    });
    $("#fsBtn").addEventListener("click", () => {
      const w = $("#stageWrap");
      if (document.fullscreenElement) document.exitFullscreen();
      else w.requestFullscreen?.();
    });
  }

  /* ---------- Stage events ---------- */
  function initStage() {
    const stage = $("#stage"), tip = $("#tip"), wrap = $("#stageWrap");
    stage.addEventListener("click", e => {
      const p = e.target.closest(".region");
      if (p) select(p.dataset.id);
    });
    stage.addEventListener("keydown", e => {
      const p = e.target.closest(".region");
      if (p && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(p.dataset.id); }
    });
    stage.addEventListener("pointermove", e => {
      const p = e.target.closest(".region");
      if (!p || e.pointerType === "touch") { tip.hidden = true; return; }
      const box = wrap.getBoundingClientRect();
      tip.textContent = R[p.dataset.id].name;
      tip.style.left = e.clientX - box.left + "px";
      tip.style.top = e.clientY - box.top + "px";
      tip.hidden = false;
    });
    stage.addEventListener("pointerleave", () => (tip.hidden = true));
  }

  /* ---------- Chips + search ---------- */
  function renderChips() {
    const q = $("#search").value.trim().toLowerCase();
    const list = REGIONS.filter(r => !q || [r.name, r.group, r.summary, r.functions.join(" "), r.psych].join(" ").toLowerCase().includes(q));
    $("#chips").innerHTML = list.length ? list.map(r => chip(r.id)).join("") : `<span class="muted small">No regions match “${q.replace(/[<>&"]/g, "")}”.</span>`;
    applySel();
  }

  /* ---------- Topics, chemistry, myths ---------- */
  function renderTopics() {
    $("#topics").innerHTML = TOPICS.map(t => `
      <article class="card">
        <h3>${t.title}</h3>
        <p>${t.text}</p>
        <div class="chips">${t.regions.map(chip).join("")}</div>
        <p class="insight"><b>Insight:</b> ${t.insight}</p>
      </article>`).join("");
    $("#myths").innerHTML = MYTHS.map(m => `
      <div class="myth"><div class="m"><b>Myth</b>${m.myth}</div><div class="f"><b>Fact</b>${m.fact}</div></div>`).join("");
    $("#chems").innerHTML = CHEMS.map(c => `
      <div class="chem"><h3>${c.name}</h3><p>${c.role}</p><p class="note">${c.note}</p></div>`).join("");
  }

  /* ---------- Tips + habit tracker ---------- */
  const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  function renderTips() {
    $("#tipGrid").innerHTML = TIPS.map(g => `
      <div class="tip-card"><h3>${g.title}</h3><dl>${g.items.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join("")}</dl></div>`).join("");
    const today = new Date();
    $("#trackerDate").textContent = today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    const key = "habits:" + dateKey(today);
    const done = store.get(key, []);
    $("#habitList").innerHTML = HABITS.map((h, i) => `<label><input type="checkbox" data-i="${i}" ${done.includes(i) ? "checked" : ""}> ${h}</label>`).join("");
    const update = () => {
      const now = $$("#habitList input").filter(c => c.checked).map(c => +c.dataset.i);
      store.set(key, now);
      $("#habitBar").style.width = (now.length / HABITS.length) * 100 + "%";
      $("#habitCount").textContent = `${now.length} / ${HABITS.length} done today${now.length === HABITS.length ? " — great job!" : ""}`;
      renderWeek();
    };
    $("#habitList").addEventListener("change", update);
    update();
  }
  function renderWeek() {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const n = store.get("habits:" + dateKey(d), []).length;
      const a = n / HABITS.length;
      out.push(`<div class="day" title="${n}/${HABITS.length}"><i style="${n ? `background:rgba(210,68,95,${0.15 + a * 0.85})` : ""}"></i>${d.toLocaleDateString(undefined, { weekday: "narrow" })}</div>`);
    }
    $("#week").innerHTML = out.join("");
  }

  /* ---------- Quiz ---------- */
  const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const quiz = { qs: [], i: 0, score: 0 };
  function startQuiz() {
    quiz.qs = shuffle(REGIONS).slice(0, 10).map(r => ({
      r, options: shuffle([r, ...shuffle(REGIONS.filter(x => x.id !== r.id)).slice(0, 3)])
    }));
    quiz.i = 0; quiz.score = 0;
    renderQuiz();
  }
  function renderQuiz() {
    const box = $("#quizBox");
    if (quiz.i >= quiz.qs.length) {
      const best = Math.max(store.get("quizBest", 0), quiz.score);
      store.set("quizBest", best);
      const msg = quiz.score >= 9 ? "Neuroscientist level!" : quiz.score >= 6 ? "Nicely done — your hippocampus is working." : "Good start — try again tomorrow; spacing helps memory.";
      box.innerHTML = `<p class="muted">Your score</p><p class="score">${quiz.score} / ${quiz.qs.length}</p><p>${msg}</p><p class="muted small">Best score: ${best} / 10</p>
        <div class="btn-row"><button class="btn" id="restart">Play again</button></div>`;
      $("#restart").onclick = startQuiz;
      return;
    }
    const { r, options } = quiz.qs[quiz.i];
    box.innerHTML = `<div class="qmeta"><span>Question ${quiz.i + 1} of ${quiz.qs.length}</span><span>Score: ${quiz.score}</span></div>
      <p class="clue">Which brain region is this? “${r.q}”</p>
      <div class="options">${options.map(o => `<button class="opt" data-id="${o.id}">${o.name}</button>`).join("")}</div>
      <div id="after"></div>`;
    $$(".opt", box).forEach(b => b.addEventListener("click", () => {
      const ok = b.dataset.id === r.id;
      if (ok) quiz.score++;
      $$(".opt", box).forEach(x => { x.disabled = true; if (x.dataset.id === r.id) x.classList.add("right"); });
      if (!ok) b.classList.add("wrong");
      $("#after").innerHTML = `<div class="explain"><b>${ok ? "Correct!" : "Not quite —"}</b> ${r.name}: ${r.summary}</div>
        <div class="btn-row"><button class="btn" id="nextQ">${quiz.i + 1 < quiz.qs.length ? "Next question" : "See score"}</button>
        <button class="btn ghost" data-region="${r.id}">View in explorer</button></div>`;
      $("#nextQ").onclick = () => { quiz.i++; renderQuiz(); };
    }));
  }

  /* ---------- Global ---------- */
  document.addEventListener("click", e => {
    const c = e.target.closest("[data-region]");
    if (!c) return;
    const inExplorer = c.closest("#explore");
    select(c.dataset.region, { scroll: !inExplorer });
  });
  $("#search").addEventListener("input", renderChips);

  renderStage();
  initToolbar();
  initStage();
  renderChips();
  renderTopics();
  renderTips();
  startQuiz();
  const m = location.hash.match(/region=(\w+)/);
  select(m ? m[1] : null);
})();
