(() => {
  "use strict";

  const C = window.QUIZ_CONFIG;
  const T = C.texts;
  const STORAGE_KEY = "hostageQuiz.played";
  const STAGE_KEY = "hostageQuiz.stage";
  const DEADLINE_KEY = "hostageQuiz.huntDeadline";

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
  // Open the page with "?reset" to wipe saved progress (handy for testing)
  if (new URLSearchParams(location.search).has("reset")) {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STAGE_KEY);
      localStorage.removeItem(DEADLINE_KEY);
    } catch {}
    history.replaceState(null, "", location.pathname);
  }

  let played = loadPlayed();

  // Progress after the quiz ("hunt" / "suspect"), so a refresh or a
  // closed tab during the object hunt doesn't send everyone back to the quiz
  function loadStage() {
    try { return localStorage.getItem(STAGE_KEY) || ""; } catch { return ""; }
  }
  function saveStage(stage) {
    try {
      if (stage) localStorage.setItem(STAGE_KEY, stage);
      else {
        localStorage.removeItem(STAGE_KEY);
        localStorage.removeItem(DEADLINE_KEY);
      }
    } catch {}
  }

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
    el.dataset.person = person.name;
    const initials = () => {
      el.textContent = person.name.trim().charAt(0).toUpperCase();
    };
    if (!person.photo) return initials();
    el.style.backgroundImage = `url("${person.photo}")`;
    const probe = new Image();
    probe.onerror = () => {
      // Ignore late failures from a previous person (roulette spins fast)
      if (el.dataset.person !== person.name) return;
      el.style.backgroundImage = "";
      initials();
    };
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

  // ---------------------------------------------------------------
  //  Background music: whole game, except the suspect screen (the
  //  alarm takes over). Browsers only allow sound after a tap, so every
  //  tap (re)starts it if it should be playing: that also covers
  //  resuming after a refresh.
  // ---------------------------------------------------------------
  const bgm = $("bg-music");
  if (C.backgroundMusic) bgm.src = C.backgroundMusic;
  bgm.volume = C.musicVolume ?? 0.4;

  function syncAudio() {
    const onSuspect = !$("screen-suspect").hidden;
    const onFail = !$("screen-over").hidden; // only the fail sound there
    if (C.backgroundMusic) {
      if (onSuspect || onFail) bgm.pause();
      else if (bgm.paused) bgm.play().catch(() => {});
    }
    if (C.suspect.music && onSuspect && music.paused) music.play().catch(() => {});
  }
  let muted = false;

  // ---------------------------------------------------------------
  //  Sound effects (gunshot on every tap, correct answer, mission
  //  failed). Web Audio: no latency and shots can overlap on rapid taps.
  //  Falls back to plain <audio> if the file can't be fetched (file://).
  // ---------------------------------------------------------------
  const S = C.sounds || {};
  const sfxVolume = S.volume ?? 0.8;
  const sfxBuffers = {};
  const sfxFallback = {};
  const AC = window.AudioContext || window.webkitAudioContext;
  const actx = AC ? new AC() : null;

  // iPhone: play effects even when the silent switch is on, like the music
  try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch {}

  async function loadSfx(name) {
    const src = S[name];
    if (!src) return;
    try {
      if (!actx) throw new Error("no Web Audio");
      const res = await fetch(src);
      if (!res.ok) throw new Error(res.status);
      sfxBuffers[name] = await actx.decodeAudioData(await res.arrayBuffer());
    } catch {
      const a = new Audio(src);
      a.preload = "auto";
      sfxFallback[name] = a;
    }
  }
  ["gunshot", "selecting", "found", "correct", "wrong", "fail"].forEach(loadSfx);

  // Returns a function that stops the sound (used to cut the fail sound)
  function playSfx(name) {
    if (muted) return () => {};
    const buf = sfxBuffers[name];
    if (buf) {
      if (actx.state !== "running") actx.resume();
      const src = actx.createBufferSource();
      const gain = actx.createGain();
      src.buffer = buf;
      gain.gain.value = sfxVolume;
      src.connect(gain).connect(actx.destination);
      src.start();
      return () => { try { src.stop(); } catch {} };
    }
    if (sfxFallback[name]) {
      const a = sfxFallback[name].cloneNode();
      a.volume = sfxVolume;
      a.play().catch(() => {});
      return () => a.pause();
    }
    return () => {};
  }

  // Reticle drawn where the screen was tapped
  function showReticle(x, y) {
    const el = document.createElement("div");
    el.className = "tap-reticle";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.innerHTML =
      '<svg viewBox="0 0 60 60" aria-hidden="true">' +
      '<circle cx="30" cy="30" r="18"/>' +
      '<line x1="30" y1="4" x2="30" y2="18"/><line x1="30" y1="42" x2="30" y2="56"/>' +
      '<line x1="4" y1="30" x2="18" y2="30"/><line x1="42" y1="30" x2="56" y2="30"/>' +
      '<circle class="dot" cx="30" cy="30" r="2.2"/></svg>';
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }

  document.addEventListener("pointerdown", (e) => {
    if (e.target.closest("#btn-sound")) return;
    syncAudio();
    playSfx("gunshot");
    showReticle(e.clientX, e.clientY);
  });

  // Warm the cache so images appear instantly during the timed questions
  C.participants.forEach((p) => preload(p.photo));
  C.questions.forEach((q) => {
    preload(q.image);
    q.answers.forEach((a) => preload(a.image));
  });
  preload(C.hunt.image);

  function renderHistory() {
    const box = $("history");
    box.hidden = played.length === 0;
    $("history-list").textContent = fill(T.alreadyPlayed, { list: played.join(", ") });
  }
  renderHistory();

  $("btn-reset").onclick = () => {
    played = [];
    savePlayed(played);
    saveStage("");
    renderHistory();
  };

  // ---------------------------------------------------------------
  //  Flow: start -> briefing -> pick -> assignment -> questions
  // ---------------------------------------------------------------
  $("btn-start").onclick = showBriefing;
  $("btn-rewind").onclick = () => {
    stopFailSound();
    showBriefing();
    syncAudio(); // main music back on
  };

  const B = C.briefing || { lines: [] };
  const briefingFullText = B.lines.join("\n");
  let typeTimer = null;

  if (B.photo) $("briefing-photo").src = B.photo;
  $("briefing-figure").hidden = !B.photo;
  $("briefing-photo").onerror = () => ($("briefing-figure").hidden = true);
  $("briefing-caption").textContent = B.caption || "";

  function showBriefing() {
    if (!briefingFullText && !B.photo) return pickParticipant();
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
  $("btn-briefing").onclick = pickParticipant;

  let chosen = null;

  function pickParticipant() {
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
    const stopSelecting = playSfx("selecting"); // cut when the player is found

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
        stopSelecting();
        playSfx("found");
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
      playSfx("correct");
      setTimeout(() => {
        qIndex++;
        if (qIndex < C.questions.length) showQuestion();
        else victory();
      }, 800);
    } else {
      // The correct answer is NOT revealed, so the next agent can't cheat
      btn.classList.add("wrong");
      playSfx("wrong");
      setTimeout(() => gameOver(T.wrongAnswer), 900);
    }
  }

  // ---------------------------------------------------------------
  //  Endings
  // ---------------------------------------------------------------
  let stopFailSound = () => {};

  function gameOver(reason) {
    flash("red");
    bgm.pause(); // silence the main music: only the fail sound plays
    stopFailSound = playSfx("fail");
    if (navigator.vibrate) navigator.vibrate([200, 100, 400]);
    $("over-reason").textContent = reason;
    renderHistory();
    show("screen-over");
  }

  function victory() {
    saveStage("hunt");
    // Fresh countdown for this run (it starts when the hunt screen opens)
    try { localStorage.removeItem(DEADLINE_KEY); } catch {}
    show("screen-win");

    // Lock the button for a few seconds so nobody skips the instructions
    const btn = $("btn-continue");
    let left = C.hunt.victoryDelaySeconds || 0;
    const update = () => {
      btn.disabled = left > 0;
      btn.textContent = left > 0 ? `${T.continueButton} (${left})` : T.continueButton;
      if (left-- > 0) setTimeout(update, 1000);
    };
    update();
  }

  // ---------------------------------------------------------------
  //  Object hunt: find the item in the house, enter its secret code
  // ---------------------------------------------------------------
  const normalizeCode = (s) => String(s).replace(/\s+/g, "").toUpperCase();
  const codeInput = $("code-input");

  if (C.hunt.image) $("hunt-image").src = C.hunt.image;
  $("hunt-figure").hidden = !C.hunt.image;
  $("hunt-image").onerror = () => ($("hunt-figure").hidden = true);
  // All-digit code: show the phone's number pad
  codeInput.inputMode = /^\d+$/.test(normalizeCode(C.hunt.code)) ? "numeric" : "text";

  $("btn-continue").onclick = showHunt;

  function showHunt() {
    saveStage("hunt");
    codeInput.value = "";
    codeInput.classList.remove("invalid");
    $("code-error").textContent = "";
    show("screen-hunt");
    startHuntTimer();
  }

  // Countdown stored as an absolute deadline, so a refresh doesn't reset it.
  // At zero it shows "time's up" and counts overtime, but the code still
  // works: the ending must always stay reachable.
  let huntInterval = null;

  function startHuntTimer() {
    let deadline = 0;
    try { deadline = Number(localStorage.getItem(DEADLINE_KEY)) || 0; } catch {}
    if (!deadline) {
      deadline = Date.now() + (C.hunt.seconds || 300) * 1000;
      try { localStorage.setItem(DEADLINE_KEY, String(deadline)); } catch {}
    }

    const el = $("hunt-timer");
    const mmss = (ms) => {
      const s = Math.floor(ms / 1000);
      return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    };
    let wasOver = false;

    const tick = () => {
      const left = deadline - Date.now();
      const over = left <= 0;
      el.textContent = over ? "+" + mmss(-left) : mmss(left + 999);
      el.classList.toggle("danger", !over && left <= 30000);
      el.classList.toggle("over", over);
      $("hunt-timeup").hidden = !over;
      if (over && !wasOver) {
        wasOver = true;
        if (navigator.vibrate) navigator.vibrate([400, 150, 400]);
      }
    };
    clearInterval(huntInterval);
    tick();
    huntInterval = setInterval(tick, 250);
  }

  codeInput.addEventListener("input", () => {
    codeInput.classList.remove("invalid");
    $("code-error").textContent = "";
  });

  $("code-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (normalizeCode(codeInput.value) === normalizeCode(C.hunt.code)) {
      codeInput.blur();
      clearInterval(huntInterval);
      flash("green");
      showSuspect(true);
    } else {
      codeInput.classList.remove("invalid");
      void codeInput.offsetWidth; // restart shake animation
      codeInput.classList.add("invalid");
      $("code-error").textContent = T.codeWrong;
      if (navigator.vibrate) navigator.vibrate(300);
    }
  });

  // ---------------------------------------------------------------
  //  Suspect reveal: photo only, the name is never shown
  // ---------------------------------------------------------------
  const music = $("suspect-music");
  if (C.suspect.music) music.src = C.suspect.music;

  function showSuspect(withSound) {
    saveStage("suspect");
    const suspect = C.participants.find((p) => p.role === "protected");
    const host = C.participants.find((p) => p.role === "host");
    setAvatar($("suspect-avatar"), { name: "?", photo: suspect && suspect.photo });
    $("suspect-text").textContent = fill(T.suspectText, { host: host ? host.name : "" });
    show("screen-suspect");
    bgm.pause();
    if (navigator.vibrate) navigator.vibrate([300, 150, 300, 150, 600]);
    if (C.suspect.music && withSound) {
      music.currentTime = 0;
      music.play().catch(() => {});
    }
  }

  $("btn-home").onclick = () => {
    music.pause();
    clearInterval(huntInterval);
    played = [];
    savePlayed(played);
    saveStage("");
    renderHistory();
    show("screen-start");
    syncAudio();
  };

  // Mute / unmute everything (music, alarm, sound effects)
  $("btn-sound").onclick = () => {
    muted = !muted;
    bgm.muted = music.muted = muted;
    $("btn-sound").textContent = muted ? "🔇" : "🔊";
    $("btn-sound").classList.toggle("muted", muted);
  };

  // Resume where we left off after a refresh
  const savedStage = loadStage();
  if (savedStage === "hunt") showHunt();
  // No sound on resume: browsers block audio until the user taps
  else if (savedStage === "suspect") showSuspect(false);
})();
