/*
 * Ernährungsapp – App-Logik
 * -------------------------
 * Alles Client-seitig, kein Server. Profil & Plan werden im localStorage
 * gespeichert, damit deine Daten beim nächsten Öffnen wieder da sind.
 */

"use strict";

const STORAGE_KEY = "ernaehrungsapp.state.v1";

const DEFAULT_STATE = {
  profil: {
    name: "",
    geschlecht: "maennlich",
    alter: 30,
    groesse: 178,
    gewicht: 75,
    aktivitaet: 1.55,      // Aktivitätsfaktor (PAL)
    ziel: "halten",        // abnehmen | halten | zunehmen
    ernaehrung: "omnivor", // omnivor | vegetarisch | vegan | pescetarisch
    vorlieben: [],         // kombinierbar: ["high-protein", "low-carb"]
    allergien: [],         // z.B. ["glutenfrei", "laktosefrei"]
    abneigungen: [],       // Zutaten-Stichwörter, z.B. ["pilz", "fisch"]
    mahlzeiten: 3,         // 3 = F/M/A, 4 = + Snack
    personen: 1,
    kcalZiel: null,        // eigenes Kalorienziel (überschreibt Berechnung), null = automatisch
  },
  plan: null,       // generierter Wochenplan
  abgehakt: {},     // Einkaufsliste: { zutatKey: true }
  favoriten: [],    // gemerkte Rezept-IDs
};

let state = ladeState();

/* ---------------- Persistenz ---------------- */

function ladeState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const gespeichert = JSON.parse(raw);
    const zusammengefuehrt = {
      ...structuredClone(DEFAULT_STATE),
      ...gespeichert,
      profil: { ...DEFAULT_STATE.profil, ...(gespeichert.profil || {}) },
    };
    return migriere(zusammengefuehrt);
  } catch (e) {
    return structuredClone(DEFAULT_STATE);
  }
}

// Ältere Profile: "high-protein"/"low-carb" waren früher Ernährungsformen,
// jetzt sind es kombinierbare Vorlieben.
function migriere(s) {
  const p = s.profil;
  if (!Array.isArray(p.vorlieben)) p.vorlieben = [];
  if (p.ernaehrung === "high-protein" || p.ernaehrung === "low-carb") {
    if (!p.vorlieben.includes(p.ernaehrung)) p.vorlieben.push(p.ernaehrung);
    p.ernaehrung = "omnivor";
  }
  return s;
}

function speichereState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------------- Nährwert-Berechnung ---------------- */

// Grundumsatz nach Mifflin-St Jeor
function berechneBMR(p) {
  const basis = 10 * p.gewicht + 6.25 * p.groesse - 5 * p.alter;
  return p.geschlecht === "maennlich" ? basis + 5 : basis - 161;
}

function berechneZiele(p) {
  const bmr = berechneBMR(p);
  let berechnet = bmr * p.aktivitaet;
  if (p.ziel === "abnehmen") berechnet -= 400;
  if (p.ziel === "zunehmen") berechnet += 350;
  berechnet = Math.round(berechnet);

  // Eigenes Kalorienziel überschreibt die Berechnung
  const manuell = p.kcalZiel && p.kcalZiel > 0 ? Math.round(p.kcalZiel) : null;
  const kcal = manuell || berechnet;

  // Makro-Verteilung (an Ziel angepasst)
  let eiweissProKg = p.ziel === "abnehmen" ? 2.0 : 1.8;
  const protein = Math.round(p.gewicht * eiweissProKg);
  const fett = Math.round((kcal * 0.28) / 9);
  const kh = Math.max(0, Math.round((kcal - protein * 4 - fett * 9) / 4));

  return { kcal, protein, kh, fett, bmr: Math.round(bmr), berechnet, manuell };
}

// Effektives Tagesziel in kcal (manuell oder berechnet)
function zielKcal(p) {
  return berechneZiele(p).kcal;
}

/* ---------------- Rezept-Filter ---------------- */

function passtZuProfil(rezept, p) {
  // Basis-Ernährungsform (nur eine)
  const e = p.ernaehrung;
  const t = rezept.tags;
  if (e === "vegan" && !t.includes("vegan")) return false;
  if (e === "vegetarisch" && !(t.includes("vegetarisch") || t.includes("vegan"))) return false;
  if (e === "pescetarisch") {
    const okFleisch = t.includes("vegetarisch") || t.includes("vegan") || t.includes("pescetarisch");
    if (!okFleisch) return false;
  }

  // Zusätzliche Vorlieben (frei kombinierbar, z.B. high-protein + low-carb)
  for (const v of p.vorlieben || []) {
    if (!t.includes(v)) return false;
  }

  // Allergien / Unverträglichkeiten (müssen als Tag vorhanden sein)
  for (const a of p.allergien) {
    if (!t.includes(a)) return false;
  }

  // Abneigungen: kein Rezept mit einer ungeliebten Zutat
  const abn = p.abneigungen.map((x) => x.toLowerCase().trim()).filter(Boolean);
  if (abn.length) {
    const zutatenText = rezept.zutaten.map((z) => z.name.toLowerCase()).join(" ");
    const nameText = rezept.name.toLowerCase();
    for (const wort of abn) {
      if (zutatenText.includes(wort) || nameText.includes(wort)) return false;
    }
  }
  return true;
}

function rezepteFuer(meal, p) {
  return REZEPTE.filter((r) => r.meal === meal && passtZuProfil(r, p));
}

/* ---------------- Favoriten ---------------- */

function istFavorit(id) {
  return state.favoriten.includes(id);
}

function toggleFavorit(id) {
  const i = state.favoriten.indexOf(id);
  if (i === -1) state.favoriten.push(id);
  else state.favoriten.splice(i, 1);
  speichereState();
}

function rezeptById(id) {
  return REZEPTE.find((r) => r.id === id);
}

/* ---------------- Wochenplan ---------------- */

const WOCHENTAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

// Kleiner Shuffle mit möglichst wenig Wiederholung.
// Favoriten werden pro Durchlauf bevorzugt gewählt (kommen zuerst dran).
function waehleReihe(pool, anzahl) {
  if (pool.length === 0) return [];
  const ergebnis = [];
  let rest = [];
  for (let i = 0; i < anzahl; i++) {
    if (rest.length === 0) rest = ordnePool(pool);
    ergebnis.push(rest.pop());
  }
  return ergebnis;
}

// Mischt den Pool, stellt Favoriten aber ans Ende (pop() nimmt sie zuerst)
function ordnePool(pool) {
  const favs = shuffle(pool.filter((r) => istFavorit(r.id)));
  const rest = shuffle(pool.filter((r) => !istFavorit(r.id)));
  return [...rest, ...favs];
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generierePlan(p) {
  const mahlzeiten = ["fruehstueck", "mittag", "abend"];
  if (p.mahlzeiten >= 4) mahlzeiten.push("snack");

  const pools = {};
  for (const m of mahlzeiten) pools[m] = rezepteFuer(m, p);

  // Fehlt eine Kategorie komplett -> melden
  const fehlend = mahlzeiten.filter((m) => pools[m].length === 0);
  if (fehlend.length) {
    return { fehler: fehlend };
  }

  const reihen = {};
  for (const m of mahlzeiten) reihen[m] = waehleReihe(pools[m], 7);

  const ziel = zielKcal(p);
  const tage = WOCHENTAGE.map((tag, i) => {
    const gerichte = mahlzeiten.map((m) => reihen[m][i]);
    const faktor = portionsFaktor(gerichte, ziel);
    return { tag, mahlzeiten, gerichte, faktor, summe: tagesSumme(gerichte, faktor) };
  });

  return { tage, ziel, erstelltAm: new Date().toISOString() };
}

// Faktor, mit dem die Portionen skaliert werden, damit der Tag das Ziel trifft
function portionsFaktor(gerichte, ziel) {
  const basis = gerichte.reduce((s, r) => s + r.kcal, 0);
  if (!basis) return 1;
  const f = ziel / basis;
  return Math.min(4, Math.max(0.4, Math.round(f * 100) / 100));
}

// Tages-Nährwerte inkl. Portions-Skalierung
function tagesSumme(gerichte, faktor) {
  return gerichte.reduce(
    (acc, r) => ({
      kcal: acc.kcal + Math.round(r.kcal * faktor),
      protein: acc.protein + Math.round(r.protein * faktor),
      kh: acc.kh + Math.round(r.kh * faktor),
      fett: acc.fett + Math.round(r.fett * faktor),
    }),
    { kcal: 0, protein: 0, kh: 0, fett: 0 }
  );
}

/* ---------------- Einkaufsliste ---------------- */

const MEAL_LABEL = {
  fruehstueck: "Frühstück",
  mittag: "Mittag",
  abend: "Abendessen",
  snack: "Snack",
};

function baueEinkaufsliste(plan, personen) {
  const map = new Map(); // key: name|einheit -> {name, einheit, menge, cat}
  for (const tag of plan.tage) {
    const faktor = tag.faktor || 1;
    for (const r of tag.gerichte) {
      for (const z of r.zutaten) {
        const key = `${z.name.toLowerCase()}|${z.einheit}`;
        const menge = z.menge * personen * faktor;
        if (map.has(key)) {
          map.get(key).menge += menge;
        } else {
          map.set(key, { name: z.name, einheit: z.einheit, menge, cat: z.cat });
        }
      }
    }
  }
  // Nach Kategorie gruppieren
  const gruppen = {};
  for (const item of map.values()) {
    (gruppen[item.cat] ||= []).push(item);
  }
  for (const cat of Object.keys(gruppen)) {
    gruppen[cat].sort((a, b) => a.name.localeCompare(b.name, "de"));
  }
  return gruppen;
}

function itemKey(item) {
  return `${item.name.toLowerCase()}|${item.einheit}`;
}

function formatMenge(menge) {
  const gerundet = Math.round(menge * 100) / 100;
  return Number.isInteger(gerundet) ? String(gerundet) : gerundet.toFixed(2).replace(/0$/, "");
}

// Einkaufsliste: immer auf ganze Zahlen aufrunden (keine Kommazahlen)
function formatEinkaufsMenge(menge) {
  return String(Math.ceil(menge - 1e-6));
}

/* ==================================================================
 *  UI
 * ================================================================== */

const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

function zeigeTab(name) {
  document.querySelectorAll(".tab-inhalt").forEach((n) => n.classList.remove("aktiv"));
  document.querySelectorAll(".tab-btn").forEach((n) => n.classList.remove("aktiv"));
  $("#tab-" + name).classList.add("aktiv");
  document.querySelector(`.tab-btn[data-tab="${name}"]`).classList.add("aktiv");
}

/* -------- Profil-Formular -------- */

function renderProfil() {
  const p = state.profil;
  $("#f-name").value = p.name;
  $("#f-geschlecht").value = p.geschlecht;
  $("#f-alter").value = p.alter;
  $("#f-groesse").value = p.groesse;
  $("#f-gewicht").value = p.gewicht;
  $("#f-aktivitaet").value = p.aktivitaet;
  $("#f-ziel").value = p.ziel;
  $("#f-ernaehrung").value = p.ernaehrung;
  $("#f-mahlzeiten").value = p.mahlzeiten;
  $("#f-personen").value = p.personen;
  $("#f-abneigungen").value = p.abneigungen.join(", ");
  $("#f-kcalziel").value = p.kcalZiel || "";

  document.querySelectorAll(".vorliebe-cb").forEach((cb) => {
    cb.checked = (p.vorlieben || []).includes(cb.value);
  });
  document.querySelectorAll(".allergie-cb").forEach((cb) => {
    cb.checked = p.allergien.includes(cb.value);
  });

  renderZiele();
}

function renderZiele() {
  const z = berechneZiele(state.profil);
  const box = $("#ziel-anzeige");
  box.innerHTML = "";
  const items = [
    ["Kalorien", z.kcal + " kcal"],
    ["Eiweiß", z.protein + " g"],
    ["Kohlenhydrate", z.kh + " g"],
    ["Fett", z.fett + " g"],
  ];
  for (const [label, wert] of items) {
    const card = el("div", "ziel-card");
    card.appendChild(el("div", "ziel-wert", wert));
    card.appendChild(el("div", "ziel-label", label));
    box.appendChild(card);
  }
  if (z.manuell) {
    $("#bmr-hinweis").textContent =
      `Eigenes Ziel aktiv: ${z.manuell} kcal (berechnet wären ${z.berechnet} kcal). ` +
      `Die Portionen im Wochenplan werden auf dieses Ziel skaliert.`;
  } else {
    $("#bmr-hinweis").textContent =
      `Grundumsatz ca. ${z.bmr} kcal · Tagesbedarf inkl. Aktivität & Ziel: ${z.kcal} kcal. ` +
      `Die Portionen im Wochenplan werden auf dieses Ziel skaliert.`;
  }
}

function leseProfilAusFormular() {
  const p = state.profil;
  p.name = $("#f-name").value.trim();
  p.geschlecht = $("#f-geschlecht").value;
  p.alter = clampNum($("#f-alter").value, 10, 100, 30);
  p.groesse = clampNum($("#f-groesse").value, 100, 230, 175);
  p.gewicht = clampNum($("#f-gewicht").value, 30, 250, 75);
  p.aktivitaet = parseFloat($("#f-aktivitaet").value);
  p.ziel = $("#f-ziel").value;
  p.ernaehrung = $("#f-ernaehrung").value;
  p.mahlzeiten = parseInt($("#f-mahlzeiten").value, 10);
  p.personen = clampNum($("#f-personen").value, 1, 12, 1);
  p.abneigungen = $("#f-abneigungen").value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  p.vorlieben = [...document.querySelectorAll(".vorliebe-cb:checked")].map((cb) => cb.value);
  p.allergien = [...document.querySelectorAll(".allergie-cb:checked")].map((cb) => cb.value);
  const kcalRaw = $("#f-kcalziel").value.trim();
  p.kcalZiel = kcalRaw === "" ? null : clampNum(kcalRaw, 800, 6000, null);
}

function clampNum(v, min, max, fallback) {
  const n = parseFloat(v);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/* -------- Plan-Ansicht -------- */

function renderPlan() {
  const wrap = $("#plan-inhalt");
  wrap.innerHTML = "";

  if (!state.plan || !state.plan.tage) {
    wrap.appendChild(
      el("p", "hinweis", "Noch kein Plan erstellt. Klicke auf „Wochenplan erstellen“.")
    );
    return;
  }

  const ziel = state.plan.ziel || berechneZiele(state.profil).kcal;

  for (const tag of state.plan.tage) {
    const faktor = tag.faktor || 1;
    const card = el("div", "tag-card");
    const kopf = el("div", "tag-kopf");
    kopf.appendChild(el("h3", null, tag.tag));
    const diff = tag.summe.kcal - ziel;
    const badge = el(
      "span",
      "kcal-badge " + (Math.abs(diff) <= 250 ? "gut" : "abweichung"),
      `${tag.summe.kcal} kcal`
    );
    kopf.appendChild(badge);
    card.appendChild(kopf);

    const liste = el("div", "gericht-liste");
    tag.gerichte.forEach((r, idx) => {
      const meal = tag.mahlzeiten[idx];
      const row = el("div", "gericht");
      const info = el("div", "gericht-info");
      info.appendChild(el("span", "gericht-meal", MEAL_LABEL[meal]));
      info.appendChild(el("span", "gericht-name", r.name));
      const portionHinweis = Math.abs(faktor - 1) > 0.05 ? ` · ${formatMenge(faktor)} Portionen` : "";
      info.appendChild(
        el("span", "gericht-kcal", `${Math.round(r.kcal * faktor)} kcal · ${r.zeit} Min${portionHinweis}`)
      );
      row.appendChild(info);

      const btnGroup = el("div", "gericht-actions");
      const favBtn = el("button", "mini-btn herz" + (istFavorit(r.id) ? " aktiv" : ""), istFavorit(r.id) ? "❤️" : "🤍");
      favBtn.title = "Als Favorit merken";
      favBtn.onclick = () => {
        toggleFavorit(r.id);
        renderPlan();
        renderFavoriten();
      };
      const rezeptBtn = el("button", "mini-btn", "Rezept");
      rezeptBtn.onclick = () => zeigeRezept(r, faktor);
      const tauschBtn = el("button", "mini-btn", "↻");
      tauschBtn.title = "Gericht tauschen";
      tauschBtn.onclick = () => tauscheGericht(tag, idx, meal);
      btnGroup.appendChild(favBtn);
      btnGroup.appendChild(rezeptBtn);
      btnGroup.appendChild(tauschBtn);
      row.appendChild(btnGroup);

      liste.appendChild(row);
    });
    card.appendChild(liste);

    const makros = el(
      "div",
      "tag-makros",
      `Eiweiß ${tag.summe.protein} g · KH ${tag.summe.kh} g · Fett ${tag.summe.fett} g`
    );
    card.appendChild(makros);
    wrap.appendChild(card);
  }
}

function tauscheGericht(tag, idx, meal) {
  const pool = rezepteFuer(meal, state.profil);
  if (pool.length <= 1) return;
  const aktuell = tag.gerichte[idx].id;
  const kandidaten = pool.filter((r) => r.id !== aktuell);
  const neu = kandidaten[Math.floor(Math.random() * kandidaten.length)];
  tag.gerichte[idx] = neu;
  const ziel = state.plan.ziel || zielKcal(state.profil);
  tag.faktor = portionsFaktor(tag.gerichte, ziel);
  tag.summe = tagesSumme(tag.gerichte, tag.faktor);
  speichereState();
  renderPlan();
  renderEinkauf();
}

/* -------- Rezept-Modal -------- */

let aktuellesRezeptId = null;

function aktualisiereFavButton() {
  const btn = $("#btn-fav");
  if (!aktuellesRezeptId) return;
  const fav = istFavorit(aktuellesRezeptId);
  btn.textContent = fav ? "❤️ Favorit" : "🤍 Als Favorit merken";
  btn.classList.toggle("aktiv", fav);
}

function zeigeRezept(r, faktor = 1) {
  const p = state.profil;
  aktuellesRezeptId = r.id;
  aktualisiereFavButton();
  $("#modal-titel").textContent = r.name;
  $("#modal-meta").textContent =
    `${MEAL_LABEL[r.meal]} · ${r.zeit} Min · ${Math.round(r.kcal * faktor)} kcal · ` +
    `E ${Math.round(r.protein * faktor)}g / KH ${Math.round(r.kh * faktor)}g / F ${Math.round(r.fett * faktor)}g`;

  const ztDiv = $("#modal-zutaten");
  ztDiv.innerHTML = "";
  const portionInfo = Math.abs(faktor - 1) > 0.05 ? `, ${formatMenge(faktor)} Portionen` : "";
  ztDiv.appendChild(
    el("h4", null, `Zutaten (für ${p.personen} Person${p.personen > 1 ? "en" : ""}${portionInfo})`)
  );
  const ul = el("ul");
  for (const z of r.zutaten) {
    ul.appendChild(el("li", null, `${formatMenge(z.menge * p.personen * faktor)} ${z.einheit} ${z.name}`));
  }
  ztDiv.appendChild(ul);

  const schrDiv = $("#modal-schritte");
  schrDiv.innerHTML = "";
  schrDiv.appendChild(el("h4", null, "Zubereitung"));
  const ol = el("ol");
  for (const s of r.schritte) ol.appendChild(el("li", null, s));
  schrDiv.appendChild(ol);

  $("#modal").classList.add("offen");
}

function schliesseModal() {
  $("#modal").classList.remove("offen");
}

/* -------- Favoriten-Ansicht -------- */

function renderFavoriten() {
  const wrap = $("#favoriten-inhalt");
  wrap.innerHTML = "";
  const favs = state.favoriten.map(rezeptById).filter(Boolean);

  if (favs.length === 0) {
    wrap.appendChild(
      el("p", "hinweis", "Noch keine Favoriten. Öffne ein Rezept und tippe auf das Herz ❤️, um es hier zu sammeln.")
    );
    return;
  }

  for (const r of favs) {
    const card = el("div", "fav-card");
    const info = el("div", "gericht-info");
    info.appendChild(el("span", "gericht-meal", MEAL_LABEL[r.meal]));
    info.appendChild(el("span", "gericht-name", r.name));
    info.appendChild(el("span", "gericht-kcal", `${r.kcal} kcal · ${r.zeit} Min`));
    card.appendChild(info);

    const actions = el("div", "gericht-actions");
    const rezeptBtn = el("button", "mini-btn", "Rezept");
    rezeptBtn.onclick = () => zeigeRezept(r);
    const entfBtn = el("button", "mini-btn herz aktiv", "❤️");
    entfBtn.title = "Aus Favoriten entfernen";
    entfBtn.onclick = () => {
      toggleFavorit(r.id);
      renderFavoriten();
      renderPlan();
    };
    actions.appendChild(rezeptBtn);
    actions.appendChild(entfBtn);
    card.appendChild(actions);
    wrap.appendChild(card);
  }
}

/* -------- Einkaufsliste -------- */

function renderEinkauf() {
  const wrap = $("#einkauf-inhalt");
  wrap.innerHTML = "";
  if (!state.plan || !state.plan.tage) {
    wrap.appendChild(el("p", "hinweis", "Erstelle zuerst einen Wochenplan."));
    return;
  }
  const gruppen = baueEinkaufsliste(state.plan, state.profil.personen);
  const reihenfolge = [
    "Obst & Gemuese", "Fleisch & Fisch", "Milchprodukte",
    "Backwaren", "Tiefkuehl", "Vorrat", "Getraenke", "Sonstiges",
  ];
  const labelMap = { "Obst & Gemuese": "Obst & Gemüse", "Tiefkuehl": "Tiefkühl" };

  for (const cat of reihenfolge) {
    if (!gruppen[cat]) continue;
    const sektion = el("div", "einkauf-gruppe");
    sektion.appendChild(el("h3", null, labelMap[cat] || cat));
    for (const item of gruppen[cat]) {
      const key = itemKey(item);
      const row = el("label", "einkauf-item" + (state.abgehakt[key] ? " erledigt" : ""));
      const cb = el("input");
      cb.type = "checkbox";
      cb.checked = !!state.abgehakt[key];
      cb.onchange = () => {
        if (cb.checked) state.abgehakt[key] = true;
        else delete state.abgehakt[key];
        speichereState();
        row.classList.toggle("erledigt", cb.checked);
      };
      row.appendChild(cb);
      row.appendChild(el("span", "ek-menge", `${formatEinkaufsMenge(item.menge)} ${item.einheit}`));
      row.appendChild(el("span", "ek-name", item.name));
      sektion.appendChild(row);
    }
    wrap.appendChild(sektion);
  }
}

function einkaufAlsText() {
  const gruppen = baueEinkaufsliste(state.plan, state.profil.personen);
  const labelMap = { "Obst & Gemuese": "Obst & Gemüse", "Tiefkuehl": "Tiefkühl" };
  let text = "Einkaufsliste\n=============\n";
  for (const cat of Object.keys(gruppen)) {
    text += `\n${labelMap[cat] || cat}:\n`;
    for (const item of gruppen[cat]) {
      text += `- ${formatEinkaufsMenge(item.menge)} ${item.einheit} ${item.name}\n`;
    }
  }
  return text;
}

/* ==================================================================
 *  Events / Init
 * ================================================================== */

// Erstellt einen (frischen) Wochenplan. wechselTab=false bleibt im Plan-Tab.
function erstellePlan(wechselTab) {
  leseProfilAusFormular();
  const plan = generierePlan(state.profil);
  if (plan.fehler) {
    const namen = plan.fehler.map((m) => MEAL_LABEL[m]).join(", ");
    alert(
      `Für folgende Mahlzeit(en) gibt es mit deinen aktuellen Einstellungen keine passenden Rezepte: ${namen}.\n\n` +
      `Tipp: Lockere die Filter (Ernährungsform, Allergien oder Abneigungen) etwas.`
    );
    return;
  }
  state.plan = plan;
  state.abgehakt = {};
  speichereState();
  renderPlan();
  renderEinkauf();
  if (wechselTab) zeigeTab("plan");
}

function init() {
  // Tabs
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.onclick = () => zeigeTab(btn.dataset.tab);
  });

  // Profil live aktualisieren
  document.querySelectorAll("#profil-form input, #profil-form select").forEach((inp) => {
    inp.addEventListener("input", () => {
      leseProfilAusFormular();
      speichereState();
      renderZiele();
    });
  });

  $("#btn-plan").onclick = () => erstellePlan(true);
  $("#btn-neue-woche").onclick = () => erstellePlan(false);

  $("#btn-modal-schliessen").onclick = schliesseModal;
  $("#modal").addEventListener("click", (e) => {
    if (e.target.id === "modal") schliesseModal();
  });

  $("#btn-fav").onclick = () => {
    if (!aktuellesRezeptId) return;
    toggleFavorit(aktuellesRezeptId);
    aktualisiereFavButton();
    renderFavoriten();
    renderPlan();
  };

  $("#btn-einkauf-kopieren").onclick = async () => {
    if (!state.plan) return;
    const text = einkaufAlsText();
    try {
      await navigator.clipboard.writeText(text);
      $("#btn-einkauf-kopieren").textContent = "✓ Kopiert!";
      setTimeout(() => ($("#btn-einkauf-kopieren").textContent = "Als Text kopieren"), 1500);
    } catch (e) {
      prompt("Einkaufsliste (kopieren mit Strg+C):", text);
    }
  };

  $("#btn-reset").onclick = () => {
    if (confirm("Wirklich alle Daten zurücksetzen?")) {
      localStorage.removeItem(STORAGE_KEY);
      state = ladeState();
      renderProfil();
      renderPlan();
      renderEinkauf();
      renderFavoriten();
      zeigeTab("profil");
    }
  };

  renderProfil();
  renderPlan();
  renderEinkauf();
  renderFavoriten();
}

document.addEventListener("DOMContentLoaded", init);
