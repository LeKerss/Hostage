(() => {
  "use strict";

  const C = window.QUIZ_CONFIG;
  const T = C.texts;
  const STORAGE_KEY = "hostageQuiz.played";

  const $ = (id) => document.getElementById(id);
  const fill = (str, vars = {}) =>
    str.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

  // ---------------------------------------------------------------
  //  Persistent "already played" list (survives a page refresh)
  // ---------------------------------------------------------------
  function loadPlayed() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }
  function savePlayed(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  }
  let played = loadPlayed();

  // ---------------------------------------------------------------
  //  Randomness (crypto-grade, unbiased)
  // ---------------------------------------------------------------
  function randomInt(max) {
    const buf = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / max) * max;
    do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
    return buf[0] % max;
  }

  // Players who haven't played yet; if none are left, only the host.
  function eligiblePool() {
    const players = C.participants.filter((p) => p.role === "player");
    const fresh = players.filter((p) => !played.includes(p.name));
    if (fresh.length) return fresh;
    const host = C.participants.find((p) => p.role === "host");
    return host ? [host] : players; // no host configured: allow repeats
  }

  // ---------------------------------------------------------------
  //  Screens
  // ---------------------------------------------------------------
  function show(id) {
    document.querySelectorAll(".screen").forEach((s) => (s.hidden = s.id !== id));
  }

  function flash(color) {
    const f = $("flash");
    f.className = "flash";
    void f.offsetWidth; // restart animation
    f.className = "flash " + color;
  }

  function setAvatar(el, person) {
    el.textContent = "";
    el.style.backgroundImage = "";
    const initials = () => {
      el.textContent = person.name.trim().charAt(0).toUpperCase();
    };
    if (!person.photo) return initials();
    el.style.backgroundImage = `url("${person.photo}")`;
    const probe = new Image();
    probe.onerror = () => { el.style.backgroundImage = ""; initials(); };
    probe.src = person.photo;
  }

  function preload(src) {
    if (src) new Image().src = src;
  }

  // ---------------------------------------------------------------
  //  Init
  // ---------------------------------------------------------------
  document.querySelectorAll("[data-text]").forEach((el) => {
    el.textContent = T[el.dataset.text] || "";
  });
  document.title = T.appTitle;
  if (C.backgroundImage) $("bg").style.backgroundImage = `url("${C.backgroundImage}")`;

  const video = $("intro-video");
  video.src = C.introVideo || "";

  // Warm the cache so images appear instantly during the timed questions
  C.participants.forEach((p) => preload(p.photo));
  C.questions.forEach((q) => {
    preload(q.image);
    q.answers.forEach((a) => preload(a.image));
  });
  preload(C.secret.image);

  function renderHistory() {
    const box = $("history");
    box.hidden = played.length === 0;
    $("history-list").textContent = fill(T.alreadyPlayed, { list: played.join(", ") });
  }
  renderHistory();

  $("btn-reset").onclick = () => {
    played = [];
    savePlayed(played);
    renderHistory();
  };

  // ---------------------------------------------------------------
  //  Flow: start -> briefing -> video -> pick -> assignment -> questions
  // ---------------------------------------------------------------
  $("btn-start").onclick = showBriefing;
  $("btn-rewind").onclick = showBriefing;

  const B = C.briefing || { lines: [] };
  const briefingFullText = B.lines.join("\n");
  let typeTimer = null;

  if (B.photo) $("briefing-photo").src = B.photo;
  $("briefing-figure").hidden = !B.photo;
  $("briefing-photo").onerror = () => ($("briefing-figure").hidden = true);
  $("briefing-caption").textContent = B.caption || "";

  function showBriefing() {
    if (!briefingFullText && !B.photo) return playIntro();
    const el = $("briefing-text");
    el.textContent = "";
    el.classList.add("typing");
    $("btn-briefing").hidden = true;
    show("screen-briefing");

    let i = 0;
    clearTimeout(typeTimer);
    const type = () => {
      el.textContent = briefingFullText.slice(0, ++i);
      const ch = briefingFullText[i - 1];
      if (i < briefingFullText.length) {
        typeTimer = setTimeout(type, ch === "\n" ? 350 : 38);
      } else {
        finishTyping();
      }
    };
    typeTimer = setTimeout(type, 400);
  }

  function finishTyping() {
    clearTimeout(typeTimer);
    $("briefing-text").textContent = briefingFullText;
    $("briefing-text").classList.remove("typing");
    $("btn-briefing").hidden = false;
  }

  // Tap the dossier to skip the typing animation
  $("dossier").onclick = finishTyping;
  $("btn-briefing").onclick = playIntro;

  function playIntro() {
    if (!C.introVideo) return pickParticipant();
    introDone = false;
    show("screen-video");
    video.currentTime = 0;
    // User tapped a button, so playing with sound is allowed.
    // If the file is missing/unplayable, go straight to the draw.
    video.play().catch(() => { if (video.error) endIntro(); });
  }

  let introDone = false;
  function endIntro() {
    if ($("screen-video").hidden || introDone) return;
    introDone = true;
    video.pause();
    pickParticipant();
  }
  video.addEventListener("ended", endIntro);
  video.addEventListener("error", endIntro);
  $("btn-skip").onclick = endIntro;

  let chosen = null;

  function pickParticipant() {
    introDone = true;
    const pool = eligiblePool();
    chosen = pool[randomInt(pool.length)];

    // Record immediately so a refresh can't re-roll the same person
    if (!played.includes(chosen.name)) {
      played.push(chosen.name);
      savePlayed(played);
    }

    // Roulette animation: spin through the pool (or everyone pickable
    // if the pool is a single person, to keep the suspense)
    const reel = pool.length > 1
      ? pool
      : C.participants.filter((p) => p.role !== "protected");

    const screen = $("screen-pick");
    screen.classList.remove("chosen");
    $("pick-title").textContent = T.pickingTitle;
    show("screen-pick");

    let i = randomInt(reel.length);
    let delay = 60;
    const spin = () => {
      const p = reel[i % reel.length];
      setAvatar($("pick-avatar"), p);
      $("pick-name").textContent = p.name;
      i++;
      delay *= 1.12;
      if (delay < 480) {
        setTimeout(spin, delay);
      } else {
        setAvatar($("pick-avatar"), chosen);
        $("pick-name").textContent = chosen.name;
        $("pick-title").textContent = T.chosenIntro;
        screen.classList.add("chosen");
        setTimeout(showAssignment, 2200);
      }
    };
    spin();
  }

  function showAssignment() {
    setAvatar($("assign-avatar"), chosen);
    $("assign-name").textContent = chosen.name;
    $("assign-text").textContent = fill(T.assignment, {
      name: chosen.name,
      seconds: C.timerSeconds,
    });
    show("screen-assign");
  }

  $("btn-ready").onclick = () => {
    qIndex = 0;
    showQuestion();
  };

  // ---------------------------------------------------------------
  //  Questions
  // ---------------------------------------------------------------
  let qIndex = 0;
  let timerRaf = null;
  let answered = false;

  function showQuestion() {
    const q = C.questions[qIndex];
    answered = false;

    $("q-label").textContent = fill(T.questionLabel, {
      n: qIndex + 1,
      total: C.questions.length,
    });
    $("q-text").textContent = q.question;

    const img = $("q-image");
    img.hidden = !q.image;
    if (q.image) img.src = q.image;

    const box = $("answers");
    box.innerHTML = "";
    box.className = "answers";
    if (q.answers.some((a) => a.image)) box.classList.add("with-images");

    let order = q.answers.map((_, i) => i);
    if (C.shuffleAnswers) {
      for (let i = order.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [order[i], order[j]] = [order[j], order[i]];
      }
    }

    order.forEach((i) => {
      const a = q.answers[i];
      const btn = document.createElement("button");
      btn.className = "answer";
      if (a.image) {
        const im = document.createElement("img");
        im.src = a.image;
        im.alt = "";
        btn.appendChild(im);
      }
      if (a.text) {
        const span = document.createElement("span");
        span.textContent = a.text;
        btn.appendChild(span);
      }
      btn.onclick = () => onAnswer(i, btn);
      box.appendChild(btn);
    });

    show("screen-question");
    $("screen-question").scrollTop = 0;
    startTimer();
  }

  function startTimer() {
    cancelAnimationFrame(timerRaf);
    const total = C.timerSeconds * 1000;
    const start = performance.now();
    const bar = $("timer-bar");
    const num = $("timer-num");

    const tick = (now) => {
      if (answered) return;
      const left = Math.max(0, total - (now - start));
      bar.style.transform = `scaleX(${left / total})`;
      const secs = Math.ceil(left / 1000);
      num.textContent = secs;
      num.classList.toggle("danger", secs <= 3);
      if (left <= 0) {
        answered = true;
        $("answers").classList.add("locked");
        gameOver(T.timeUp);
        return;
      }
      timerRaf = requestAnimationFrame(tick);
    };
    timerRaf = requestAnimationFrame(tick);
  }

  function onAnswer(i, btn) {
    if (answered) return;
    answered = true;
    cancelAnimationFrame(timerRaf);
    $("answers").classList.add("locked");

    const q = C.questions[qIndex];
    if (i === q.correct) {
      btn.classList.add("correct");
      flash("green");
      setTimeout(() => {
        qIndex++;
        if (qIndex < C.questions.length) showQuestion();
        else victory();
      }, 800);
    } else {
      // The correct answer is NOT revealed, so the next agent can't cheat
      btn.classList.add("wrong");
      setTimeout(() => gameOver(T.wrongAnswer), 900);
    }
  }

  // ---------------------------------------------------------------
  //  Endings
  // ---------------------------------------------------------------
  function gameOver(reason) {
    flash("red");
    if (navigator.vibrate) navigator.vibrate([200, 100, 400]);
    $("over-reason").textContent = reason;
    introDone = false;
    renderHistory();
    show("screen-over");
  }

  function victory() {
    introDone = false;
    show("screen-win");
  }

  const music = $("secret-music");
  if (C.secret.music) music.src = C.secret.music;

  $("btn-reveal").onclick = () => {
    $("secret-title").textContent = C.secret.title;
    const img = $("secret-image");
    img.hidden = !C.secret.image;
    if (C.secret.image) img.src = C.secret.image;
    show("screen-secret");
    if (C.secret.music) {
      music.currentTime = 0;
      music.play().catch(() => {});
    }
  };

  $("btn-home").onclick = () => {
    music.pause();
    played = [];
    savePlayed(played);
    renderHistory();
    introDone = false;
    show("screen-start");
  };
})();
