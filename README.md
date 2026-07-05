# 🥗 Mein Ernährungsplan

Eine persönliche Ernährungsapp, die sich ganz auf dich und deine Wünsche einstellt –
mit passenden Rezepten und einer automatisch erstellten Einkaufsliste.

## Funktionen

- **Persönliches Profil**: Geschlecht, Alter, Größe, Gewicht, Aktivität und Ziel
  (Abnehmen / Halten / Zunehmen).
- **Automatischer Tagesbedarf**: Kalorien und Makronährstoffe (Eiweiß, Kohlenhydrate,
  Fett) werden nach der Mifflin-St-Jeor-Formel berechnet.
- **Ernährungsformen & Filter**: omnivor, vegetarisch, vegan, pescetarisch,
  low-carb, high-protein – dazu Glutenfrei/Laktosefrei und beliebige
  „mag ich nicht“-Zutaten.
- **Wochenplan**: 7 Tage mit Frühstück, Mittag, Abendessen (optional Snack).
  Einzelne Gerichte lassen sich per Klick tauschen (↻).
- **Rezepte**: Zutaten (auf deine Personenzahl hochgerechnet) und Schritt-für-Schritt-Anleitung.
- **Einkaufsliste**: fasst alle Zutaten der Woche zusammen, gruppiert nach
  Supermarkt-Kategorien, zum Abhaken und als Text kopierbar.
- **Speicherung**: Alle Daten bleiben lokal im Browser (localStorage) – kein Server, kein Konto.

## Nutzung

Einfach `index.html` im Browser öffnen. Es ist keine Installation und kein Build nötig
(reines HTML/CSS/JavaScript).

Alternativ über GitHub Pages veröffentlichen: In den Repo-Einstellungen unter
*Pages* den Branch als Quelle wählen – die App ist dann direkt online erreichbar.

## Projektstruktur

```
index.html        # Oberfläche
css/styles.css    # Design
js/recipes.js     # Rezept-Datenbank (Nährwerte & Zutaten pro Portion)
js/app.js         # Logik: Bedarf, Filter, Wochenplan, Einkaufsliste
```

## Eigene Rezepte hinzufügen

In `js/recipes.js` ein neues Objekt zum `REZEPTE`-Array ergänzen – mit `meal`
(`fruehstueck`/`mittag`/`abend`/`snack`), passenden `tags`, Nährwerten pro Portion
sowie `zutaten` und `schritte`. Die App bezieht es automatisch in Plan und
Einkaufsliste ein.

---

*Hinweis: Alle Angaben sind Richtwerte und ersetzen keine medizinische Ernährungsberatung.*
