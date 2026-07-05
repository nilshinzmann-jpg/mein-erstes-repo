/*
 * Rezept-Datenbank
 * ----------------
 * Jedes Rezept hat Nährwerte PRO PORTION. Die Mengen der Zutaten sind
 * ebenfalls fuer EINE Portion angegeben und werden in der App automatisch
 * auf die gewuenschte Personenzahl hochgerechnet.
 *
 * tags: vegetarisch, vegan, pescetarisch, low-carb, high-protein, glutenfrei, laktosefrei
 * meal: fruehstueck | mittag | abend | snack
 * cat  (Zutat): Obst & Gemuese | Milchprodukte | Fleisch & Fisch | Backwaren |
 *               Vorrat | Tiefkuehl | Getraenke | Sonstiges
 */

const REZEPTE = [
  // ---------- FRÜHSTÜCK ----------
  {
    id: "porridge-beere",
    name: "Beeren-Porridge mit Nüssen",
    meal: "fruehstueck",
    tags: ["vegetarisch", "high-protein"],
    zeit: 10,
    kcal: 380, protein: 14, kh: 52, fett: 12,
    zutaten: [
      { name: "Haferflocken", menge: 60, einheit: "g", cat: "Vorrat" },
      { name: "Milch", menge: 250, einheit: "ml", cat: "Milchprodukte" },
      { name: "Gemischte Beeren", menge: 80, einheit: "g", cat: "Tiefkuehl" },
      { name: "Walnüsse", menge: 15, einheit: "g", cat: "Vorrat" },
      { name: "Honig", menge: 1, einheit: "TL", cat: "Vorrat" },
    ],
    schritte: [
      "Haferflocken mit Milch in einen Topf geben und unter Rühren aufkochen.",
      "Bei niedriger Hitze 3–4 Minuten köcheln lassen, bis es cremig ist.",
      "In eine Schale geben, mit Beeren, gehackten Walnüssen und Honig toppen.",
    ],
  },
  {
    id: "overnight-oats-vegan",
    name: "Overnight Oats mit Banane (vegan)",
    meal: "fruehstueck",
    tags: ["vegan", "vegetarisch", "laktosefrei"],
    zeit: 5,
    kcal: 350, protein: 10, kh: 55, fett: 9,
    zutaten: [
      { name: "Haferflocken", menge: 60, einheit: "g", cat: "Vorrat" },
      { name: "Hafermilch", menge: 200, einheit: "ml", cat: "Milchprodukte" },
      { name: "Banane", menge: 1, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Chiasamen", menge: 1, einheit: "EL", cat: "Vorrat" },
      { name: "Ahornsirup", menge: 1, einheit: "TL", cat: "Vorrat" },
    ],
    schritte: [
      "Haferflocken, Hafermilch und Chiasamen in ein Glas geben und verrühren.",
      "Über Nacht abgedeckt in den Kühlschrank stellen.",
      "Am Morgen mit geschnittener Banane und Ahornsirup servieren.",
    ],
  },
  {
    id: "ruehrei-avocado",
    name: "Rührei mit Avocado",
    meal: "fruehstueck",
    tags: ["vegetarisch", "low-carb", "high-protein", "glutenfrei"],
    zeit: 12,
    kcal: 420, protein: 24, kh: 8, fett: 32,
    zutaten: [
      { name: "Eier", menge: 3, einheit: "Stück", cat: "Milchprodukte" },
      { name: "Avocado", menge: 0.5, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Butter", menge: 10, einheit: "g", cat: "Milchprodukte" },
      { name: "Schnittlauch", menge: 5, einheit: "g", cat: "Obst & Gemuese" },
      { name: "Salz & Pfeffer", menge: 1, einheit: "Prise", cat: "Vorrat" },
    ],
    schritte: [
      "Eier verquirlen, salzen und pfeffern.",
      "Butter in der Pfanne schmelzen, Eier bei mittlerer Hitze stocken lassen.",
      "Mit Avocadoscheiben und Schnittlauch anrichten.",
    ],
  },
  {
    id: "quark-obst",
    name: "Proteinquark mit Obst",
    meal: "fruehstueck",
    tags: ["vegetarisch", "high-protein", "glutenfrei"],
    zeit: 5,
    kcal: 300, protein: 32, kh: 24, fett: 6,
    zutaten: [
      { name: "Magerquark", menge: 250, einheit: "g", cat: "Milchprodukte" },
      { name: "Apfel", menge: 1, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Leinsamen", menge: 1, einheit: "EL", cat: "Vorrat" },
      { name: "Zimt", menge: 1, einheit: "Prise", cat: "Vorrat" },
    ],
    schritte: [
      "Magerquark glattrühren, bei Bedarf mit etwas Wasser cremiger machen.",
      "Apfel klein schneiden und unterheben.",
      "Mit Leinsamen und Zimt bestreuen.",
    ],
  },

  {
    id: "chia-pudding",
    name: "Chia-Pudding mit Kokosmilch & Beeren",
    meal: "fruehstueck",
    tags: ["vegan", "vegetarisch", "glutenfrei", "laktosefrei"],
    zeit: 5,
    kcal: 340, protein: 9, kh: 30, fett: 20,
    zutaten: [
      { name: "Chiasamen", menge: 3, einheit: "EL", cat: "Vorrat" },
      { name: "Kokosmilch", menge: 200, einheit: "ml", cat: "Vorrat" },
      { name: "Gemischte Beeren", menge: 80, einheit: "g", cat: "Tiefkuehl" },
      { name: "Ahornsirup", menge: 1, einheit: "TL", cat: "Vorrat" },
    ],
    schritte: [
      "Chiasamen mit Kokosmilch und Ahornsirup verrühren.",
      "Mind. 2 Stunden (oder über Nacht) im Kühlschrank quellen lassen.",
      "Mit Beeren toppen und servieren.",
    ],
  },

  // ---------- MITTAG ----------
  {
    id: "haehnchen-reis-bowl",
    name: "Hähnchen-Reis-Bowl mit Gemüse",
    meal: "mittag",
    tags: ["high-protein", "glutenfrei", "laktosefrei"],
    zeit: 25,
    kcal: 560, protein: 42, kh: 58, fett: 14,
    zutaten: [
      { name: "Hähnchenbrustfilet", menge: 150, einheit: "g", cat: "Fleisch & Fisch" },
      { name: "Basmatireis", menge: 70, einheit: "g", cat: "Vorrat" },
      { name: "Brokkoli", menge: 120, einheit: "g", cat: "Obst & Gemuese" },
      { name: "Paprika", menge: 0.5, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Olivenöl", menge: 1, einheit: "EL", cat: "Vorrat" },
      { name: "Sojasauce", menge: 1, einheit: "EL", cat: "Vorrat" },
    ],
    schritte: [
      "Reis nach Packungsanweisung kochen.",
      "Hähnchen würfeln und in Olivenöl scharf anbraten.",
      "Brokkoli und Paprika zugeben, 5–6 Minuten mitbraten.",
      "Mit Sojasauce ablöschen und mit dem Reis servieren.",
    ],
  },
  {
    id: "linsen-curry",
    name: "Rote-Linsen-Curry mit Kokosmilch",
    meal: "mittag",
    tags: ["vegan", "vegetarisch", "glutenfrei", "laktosefrei", "high-protein"],
    zeit: 30,
    kcal: 520, protein: 22, kh: 62, fett: 18,
    zutaten: [
      { name: "Rote Linsen", menge: 90, einheit: "g", cat: "Vorrat" },
      { name: "Kokosmilch", menge: 150, einheit: "ml", cat: "Vorrat" },
      { name: "Zwiebel", menge: 0.5, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Karotte", menge: 1, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Currypaste", menge: 1, einheit: "EL", cat: "Vorrat" },
      { name: "Reis", menge: 60, einheit: "g", cat: "Vorrat" },
    ],
    schritte: [
      "Zwiebel und Karotte würfeln, in etwas Öl andünsten.",
      "Currypaste zugeben, kurz mitrösten.",
      "Linsen, Kokosmilch und 150 ml Wasser zugeben, 15 Min köcheln.",
      "Mit gekochtem Reis servieren.",
    ],
  },
  {
    id: "lachs-quinoa",
    name: "Ofenlachs mit Quinoa & Spinat",
    meal: "mittag",
    tags: ["pescetarisch", "high-protein", "glutenfrei", "laktosefrei"],
    zeit: 28,
    kcal: 540, protein: 38, kh: 40, fett: 22,
    zutaten: [
      { name: "Lachsfilet", menge: 150, einheit: "g", cat: "Fleisch & Fisch" },
      { name: "Quinoa", menge: 60, einheit: "g", cat: "Vorrat" },
      { name: "Blattspinat", menge: 100, einheit: "g", cat: "Obst & Gemuese" },
      { name: "Zitrone", menge: 0.5, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Olivenöl", menge: 1, einheit: "EL", cat: "Vorrat" },
    ],
    schritte: [
      "Quinoa nach Packungsanweisung garen.",
      "Lachs mit Öl, Salz und Zitrone bei 200 °C ca. 15 Min backen.",
      "Spinat kurz in der Pfanne zusammenfallen lassen.",
      "Alles zusammen anrichten.",
    ],
  },
  {
    id: "kichererbsen-salat",
    name: "Mediterraner Kichererbsen-Salat",
    meal: "mittag",
    tags: ["vegan", "vegetarisch", "glutenfrei", "laktosefrei", "high-protein"],
    zeit: 15,
    kcal: 450, protein: 18, kh: 48, fett: 20,
    zutaten: [
      { name: "Kichererbsen (Dose)", menge: 120, einheit: "g", cat: "Vorrat" },
      { name: "Gurke", menge: 0.5, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Kirschtomaten", menge: 80, einheit: "g", cat: "Obst & Gemuese" },
      { name: "Rote Zwiebel", menge: 0.25, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Olivenöl", menge: 1, einheit: "EL", cat: "Vorrat" },
      { name: "Zitronensaft", menge: 1, einheit: "EL", cat: "Obst & Gemuese" },
    ],
    schritte: [
      "Kichererbsen abtropfen und abspülen.",
      "Gurke, Tomaten und Zwiebel klein schneiden.",
      "Alles mit Öl, Zitronensaft, Salz und Pfeffer vermengen.",
    ],
  },
  {
    id: "nudeln-pesto",
    name: "Vollkornnudeln mit Basilikum-Pesto",
    meal: "mittag",
    tags: ["vegetarisch"],
    zeit: 18,
    kcal: 580, protein: 19, kh: 78, fett: 20,
    zutaten: [
      { name: "Vollkornnudeln", menge: 90, einheit: "g", cat: "Vorrat" },
      { name: "Pesto", menge: 40, einheit: "g", cat: "Vorrat" },
      { name: "Kirschtomaten", menge: 80, einheit: "g", cat: "Obst & Gemuese" },
      { name: "Parmesan", menge: 15, einheit: "g", cat: "Milchprodukte" },
    ],
    schritte: [
      "Nudeln in Salzwasser al dente kochen.",
      "Tomaten halbieren.",
      "Nudeln mit Pesto und Tomaten mischen, mit Parmesan bestreuen.",
    ],
  },

  {
    id: "zoodles-haehnchen",
    name: "Zucchini-Nudeln mit Hähnchen",
    meal: "mittag",
    tags: ["low-carb", "high-protein", "glutenfrei", "laktosefrei"],
    zeit: 22,
    kcal: 430, protein: 40, kh: 14, fett: 22,
    zutaten: [
      { name: "Hähnchenbrustfilet", menge: 150, einheit: "g", cat: "Fleisch & Fisch" },
      { name: "Zucchini", menge: 1, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Kirschtomaten", menge: 100, einheit: "g", cat: "Obst & Gemuese" },
      { name: "Knoblauch", menge: 1, einheit: "Zehe", cat: "Obst & Gemuese" },
      { name: "Olivenöl", menge: 1, einheit: "EL", cat: "Vorrat" },
    ],
    schritte: [
      "Zucchini mit einem Spiralschneider zu Nudeln verarbeiten.",
      "Hähnchen würfeln und in Öl mit Knoblauch anbraten.",
      "Tomaten zugeben, kurz mitbraten, Zoodles 2–3 Min mitschwenken und würzen.",
    ],
  },
  {
    id: "thunfisch-salat",
    name: "Thunfisch-Salat mit Ei",
    meal: "mittag",
    tags: ["pescetarisch", "low-carb", "high-protein", "glutenfrei", "laktosefrei"],
    zeit: 12,
    kcal: 410, protein: 38, kh: 10, fett: 24,
    zutaten: [
      { name: "Thunfisch (Dose)", menge: 120, einheit: "g", cat: "Vorrat" },
      { name: "Eier", menge: 2, einheit: "Stück", cat: "Milchprodukte" },
      { name: "Blattsalat", menge: 100, einheit: "g", cat: "Obst & Gemuese" },
      { name: "Gurke", menge: 0.5, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Olivenöl", menge: 1, einheit: "EL", cat: "Vorrat" },
    ],
    schritte: [
      "Eier hart kochen, pellen und vierteln.",
      "Salat und Gurke schneiden, Thunfisch abtropfen.",
      "Alles anrichten und mit Öl, Salz und Pfeffer abschmecken.",
    ],
  },

  // ---------- ABEND ----------
  {
    id: "gemuese-omelett",
    name: "Gemüse-Omelett",
    meal: "abend",
    tags: ["vegetarisch", "low-carb", "high-protein", "glutenfrei"],
    zeit: 15,
    kcal: 340, protein: 26, kh: 10, fett: 22,
    zutaten: [
      { name: "Eier", menge: 3, einheit: "Stück", cat: "Milchprodukte" },
      { name: "Champignons", menge: 80, einheit: "g", cat: "Obst & Gemuese" },
      { name: "Paprika", menge: 0.5, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Gouda gerieben", menge: 30, einheit: "g", cat: "Milchprodukte" },
      { name: "Olivenöl", menge: 1, einheit: "TL", cat: "Vorrat" },
    ],
    schritte: [
      "Gemüse klein schneiden und in Öl anbraten.",
      "Verquirlte Eier darüber gießen und stocken lassen.",
      "Käse darüberstreuen und zusammenklappen.",
    ],
  },
  {
    id: "ofengemuese-feta",
    name: "Buntes Ofengemüse mit Feta",
    meal: "abend",
    tags: ["vegetarisch", "low-carb", "glutenfrei"],
    zeit: 35,
    kcal: 420, protein: 16, kh: 28, fett: 26,
    zutaten: [
      { name: "Zucchini", menge: 0.5, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Paprika", menge: 1, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Süßkartoffel", menge: 120, einheit: "g", cat: "Obst & Gemuese" },
      { name: "Feta", menge: 60, einheit: "g", cat: "Milchprodukte" },
      { name: "Olivenöl", menge: 1, einheit: "EL", cat: "Vorrat" },
    ],
    schritte: [
      "Gemüse in mundgerechte Stücke schneiden.",
      "Mit Öl, Salz und Pfeffer mischen, auf ein Blech geben.",
      "Bei 200 °C ca. 25 Min backen, Feta zerbröseln und die letzten 5 Min mitbacken.",
    ],
  },
  {
    id: "haehnchen-salat",
    name: "Großer Hähnchen-Salat",
    meal: "abend",
    tags: ["high-protein", "low-carb", "glutenfrei", "laktosefrei"],
    zeit: 20,
    kcal: 400, protein: 40, kh: 12, fett: 20,
    zutaten: [
      { name: "Hähnchenbrustfilet", menge: 150, einheit: "g", cat: "Fleisch & Fisch" },
      { name: "Blattsalat", menge: 100, einheit: "g", cat: "Obst & Gemuese" },
      { name: "Gurke", menge: 0.5, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Kirschtomaten", menge: 80, einheit: "g", cat: "Obst & Gemuese" },
      { name: "Olivenöl", menge: 1, einheit: "EL", cat: "Vorrat" },
      { name: "Balsamico", menge: 1, einheit: "EL", cat: "Vorrat" },
    ],
    schritte: [
      "Hähnchen würzen und in der Pfanne braten, dann in Streifen schneiden.",
      "Salat, Gurke und Tomaten in eine Schüssel geben.",
      "Mit Öl und Balsamico anmachen, Hähnchen darauf verteilen.",
    ],
  },
  {
    id: "gemuesepfanne-tofu",
    name: "Asiatische Gemüsepfanne mit Tofu",
    meal: "abend",
    tags: ["vegan", "vegetarisch", "laktosefrei", "high-protein"],
    zeit: 22,
    kcal: 460, protein: 26, kh: 34, fett: 22,
    zutaten: [
      { name: "Tofu natur", menge: 150, einheit: "g", cat: "Milchprodukte" },
      { name: "Wokgemüse (TK)", menge: 200, einheit: "g", cat: "Tiefkuehl" },
      { name: "Sojasauce", menge: 2, einheit: "EL", cat: "Vorrat" },
      { name: "Sesamöl", menge: 1, einheit: "EL", cat: "Vorrat" },
      { name: "Ingwer", menge: 10, einheit: "g", cat: "Obst & Gemuese" },
    ],
    schritte: [
      "Tofu würfeln und in Sesamöl knusprig braten.",
      "Ingwer und Wokgemüse zugeben, 6–8 Min braten.",
      "Mit Sojasauce abschmecken.",
    ],
  },
  {
    id: "suppe-gemuese",
    name: "Herzhafte Gemüsesuppe",
    meal: "abend",
    tags: ["vegan", "vegetarisch", "low-carb", "glutenfrei", "laktosefrei"],
    zeit: 30,
    kcal: 280, protein: 10, kh: 30, fett: 10,
    zutaten: [
      { name: "Karotte", menge: 2, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Sellerie", menge: 80, einheit: "g", cat: "Obst & Gemuese" },
      { name: "Kartoffel", menge: 1, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Zwiebel", menge: 0.5, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Gemüsebrühe", menge: 500, einheit: "ml", cat: "Vorrat" },
    ],
    schritte: [
      "Gemüse würfeln und in etwas Öl andünsten.",
      "Mit Brühe aufgießen und 20 Min köcheln lassen.",
      "Nach Belieben pürieren oder stückig lassen.",
    ],
  },
  {
    id: "rinderhack-bolognese",
    name: "Bolognese mit Vollkornspaghetti",
    meal: "abend",
    tags: ["high-protein"],
    zeit: 30,
    kcal: 620, protein: 38, kh: 66, fett: 22,
    zutaten: [
      { name: "Rinderhackfleisch", menge: 120, einheit: "g", cat: "Fleisch & Fisch" },
      { name: "Passierte Tomaten", menge: 200, einheit: "g", cat: "Vorrat" },
      { name: "Vollkornspaghetti", menge: 90, einheit: "g", cat: "Vorrat" },
      { name: "Zwiebel", menge: 0.5, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Knoblauch", menge: 1, einheit: "Zehe", cat: "Obst & Gemuese" },
    ],
    schritte: [
      "Zwiebel und Knoblauch anschwitzen, Hack zugeben und krümelig braten.",
      "Passierte Tomaten zugeben, würzen und 15 Min köcheln.",
      "Spaghetti kochen und mit der Sauce servieren.",
    ],
  },

  {
    id: "kichererbsen-ofengemuese",
    name: "Geröstete Kichererbsen mit Ofengemüse",
    meal: "abend",
    tags: ["vegan", "vegetarisch", "glutenfrei", "laktosefrei", "high-protein"],
    zeit: 30,
    kcal: 440, protein: 18, kh: 46, fett: 18,
    zutaten: [
      { name: "Kichererbsen (Dose)", menge: 120, einheit: "g", cat: "Vorrat" },
      { name: "Zucchini", menge: 0.5, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Paprika", menge: 1, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Rote Zwiebel", menge: 0.5, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Olivenöl", menge: 1, einheit: "EL", cat: "Vorrat" },
      { name: "Paprikapulver", menge: 1, einheit: "TL", cat: "Vorrat" },
    ],
    schritte: [
      "Kichererbsen abtropfen und trocken tupfen.",
      "Gemüse in Stücke schneiden, mit Kichererbsen, Öl und Gewürzen mischen.",
      "Auf einem Blech bei 200 °C ca. 25 Min rösten.",
    ],
  },

  // ---------- SNACK ----------
  {
    id: "joghurt-nuss",
    name: "Joghurt mit Nüssen & Honig",
    meal: "snack",
    tags: ["vegetarisch", "glutenfrei", "high-protein"],
    zeit: 3,
    kcal: 220, protein: 12, kh: 18, fett: 11,
    zutaten: [
      { name: "Naturjoghurt", menge: 150, einheit: "g", cat: "Milchprodukte" },
      { name: "Mandeln", menge: 15, einheit: "g", cat: "Vorrat" },
      { name: "Honig", menge: 1, einheit: "TL", cat: "Vorrat" },
    ],
    schritte: [
      "Joghurt in eine Schale geben.",
      "Mit gehackten Mandeln und Honig toppen.",
    ],
  },
  {
    id: "hummus-gemuese",
    name: "Hummus mit Gemüsesticks",
    meal: "snack",
    tags: ["vegan", "vegetarisch", "glutenfrei", "laktosefrei"],
    zeit: 8,
    kcal: 200, protein: 8, kh: 20, fett: 10,
    zutaten: [
      { name: "Hummus", menge: 60, einheit: "g", cat: "Vorrat" },
      { name: "Karotte", menge: 1, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Gurke", menge: 0.5, einheit: "Stück", cat: "Obst & Gemuese" },
    ],
    schritte: [
      "Karotte und Gurke in Sticks schneiden.",
      "Mit Hummus als Dip servieren.",
    ],
  },
  {
    id: "apfel-mandelmus",
    name: "Apfel mit Mandelmus",
    meal: "snack",
    tags: ["vegan", "vegetarisch", "glutenfrei", "laktosefrei"],
    zeit: 3,
    kcal: 190, protein: 5, kh: 24, fett: 9,
    zutaten: [
      { name: "Apfel", menge: 1, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Mandelmus", menge: 15, einheit: "g", cat: "Vorrat" },
    ],
    schritte: [
      "Apfel in Spalten schneiden.",
      "Mit Mandelmus genießen.",
    ],
  },
  {
    id: "eier-gemuese-snack",
    name: "Gekochte Eier mit Gemüsesticks",
    meal: "snack",
    tags: ["vegetarisch", "low-carb", "high-protein", "glutenfrei", "laktosefrei"],
    zeit: 10,
    kcal: 180, protein: 14, kh: 6, fett: 11,
    zutaten: [
      { name: "Eier", menge: 2, einheit: "Stück", cat: "Milchprodukte" },
      { name: "Karotte", menge: 1, einheit: "Stück", cat: "Obst & Gemuese" },
      { name: "Paprika", menge: 0.5, einheit: "Stück", cat: "Obst & Gemuese" },
    ],
    schritte: [
      "Eier hart kochen und pellen.",
      "Karotte und Paprika in Sticks schneiden.",
      "Mit etwas Salz genießen.",
    ],
  },
  {
    id: "proteinshake",
    name: "Protein-Shake mit Banane",
    meal: "snack",
    tags: ["vegetarisch", "high-protein", "glutenfrei"],
    zeit: 3,
    kcal: 250, protein: 28, kh: 26, fett: 4,
    zutaten: [
      { name: "Proteinpulver", menge: 30, einheit: "g", cat: "Vorrat" },
      { name: "Milch", menge: 250, einheit: "ml", cat: "Milchprodukte" },
      { name: "Banane", menge: 1, einheit: "Stück", cat: "Obst & Gemuese" },
    ],
    schritte: [
      "Alle Zutaten in einen Mixer geben.",
      "Cremig mixen und sofort trinken.",
    ],
  },
];

// Fuer Verwendung ohne Modul-System (direktes Einbinden per <script>)
if (typeof window !== "undefined") {
  window.REZEPTE = REZEPTE;
}
