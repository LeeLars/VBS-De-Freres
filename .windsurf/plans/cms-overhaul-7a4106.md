# CMS Overhaul: Strakke connectie CMS <-> Frontend

Volledige audit en fix van het CMS zodat tekst en afbeeldingen per pagina overzichtelijk bewerkbaar zijn, zonder dat de layout kan breken.

---

## Gevonden Valkuilen

### 1. KRITIEK: `data-cms` keys matchen niet tussen frontend en CMS

De frontend HTML gebruikt `data-cms="home-hero-title"` maar de database slaat dit op als `content_key = "hero-title"` onder `page_slug = "home"`. De `cms-content.js` selector `[data-cms$="${key}"]` matcht op het **einde** van de string, dus `hero-title` matcht `home-hero-title`. Dit werkt **toevallig** maar is fragiel:
- `contact-email` op de home pagina matcht ook `contact-email` op de contact pagina
- Keys die in meerdere pagina's voorkomen (bv. `contact-title`) kunnen verkeerd matchen
- De `$=` (ends-with) selector is een hack, geen betrouwbare match

**Fix:** Exacte matching gebruiken: `[data-cms="${pageSlug}-${key}"]` OF de database keys aanpassen zodat ze 1:1 overeenkomen met de `data-cms` attributen.

### 2. KRITIEK: Authenticatie is client-side only

- Login check: `sessionStorage.getItem('cmsLoggedIn')` -- puur client-side
- Hardcoded credentials: `admin` / `test123` zichtbaar in de HTML source
- API routes hebben **geen authenticatie** -- iedereen kan PUT/POST/DELETE doen
- De "Test Credentials" blok staat zichtbaar op de login pagina

**Fix:** Server-side auth middleware toevoegen (JWT of session-based). Op korte termijn: minstens een API key/token check.

### 3. HOOG: CMS editor toont velden die niet in de database bestaan

Als je naar de "Visie" tab gaat in de CMS, worden velden gedefinieerd in de `sections` config (bv. `visie-approach-1-title`), maar als die keys niet in de database staan, verschijnt een leeg veld. Bij opslaan worden ze dan aangemaakt. Dit is niet per se een bug, maar:
- De init.sql mist veel keys die de frontend WEL gebruikt
- Visie pagina: `visie-cta-title`, `visie-cta-text` ontbreken in CMS sections
- Contact pagina: `contact-form-title`, `contact-form-subtitle`, `contact-email` ontbreken in CMS sections
- Home pagina: `home-cta-title`, `home-cta-text`, `contact-director-name` ontbreken in CMS sections

**Fix:** Alle `data-cms` attributen uit de frontend inventariseren en 1:1 matchen met CMS sections + init.sql.

### 4. HOOG: Dashboard is grotendeels placeholder

- Team sectie: hardcoded placeholder, geen CRUD
- Berichten sectie: hardcoded placeholder bericht, `loadContactMessages()` doet niets
- Instellingen sectie: formulier dat nergens opslaat
- `cms.js` heeft alert-placeholders: "functionaliteit komt binnenkort!"
- `btn-edit` en `btn-view` klikken op dashboard tonen alerts ipv te werken

**Fix:** Dashboard opruimen -- alleen werkende secties tonen, of secties die nog niet werken duidelijk markeren.

### 5. HOOG: `saveContent()` stuurt content_type niet mee

In `pages.html` wordt bij opslaan alleen `field.value` gestuurd, niet het type. De backend `content.routes.js` regel 49 doet `value.type || 'text'`, maar omdat er geen `.type` is, wordt alles als 'text' opgeslagen. Dit betekent dat image velden hun `content_type: 'image'` verliezen na opslaan.

**Fix:** Bij opslaan ook het type meesturen, vooral voor image velden.

### 6. MEDIUM: Onoverzichtelijke pages editor

- Alle pagina's zitten in 1 scherm met tabs bovenaan
- Per pagina staan ALLE velden onder elkaar (tekst + afbeeldingen door elkaar)
- Geen visuele scheiding tussen "wat je ziet" en "waar het staat"
- Geen collapsible secties -- je moet scrollen door 20+ velden

**Fix:** Secties inklapbaar maken, betere visuele scheiding, en per pagina alleen de velden tonen die daadwerkelijk op die pagina bestaan.

### 7. MEDIUM: Sidebar navigatie is inconsistent

- `dashboard.html` sidebar linkt naar `#team`, `#media`, `#berichten`, `#instellingen` (hash-based)
- `pages.html` sidebar linkt naar `/cms/dashboard.html#team` etc.
- `media.html` sidebar linkt naar `/cms/dashboard.html#team` etc.
- Klikken op "Pagina's" in dashboard gaat naar `/cms/pages.html`, maar klikken op "Media" in dashboard toont een inline sectie die doorlinkt naar `/cms/media.html`

**Fix:** Consistente navigatie: elke sectie is een eigen pagina OF alles zit in het dashboard.

### 8. LOW: Debug route is publiek toegankelijk

`/api/debug/config` toont welke env vars wel/niet geconfigureerd zijn. Niet kritiek (waarden zijn verborgen), maar onnodig in productie.

---

## Implementatieplan

### Fase 1: Data-integriteit fixen (KRITIEK)

1. **Inventariseer alle `data-cms` attributen** uit alle 9 HTML pagina's
2. **Fix de key-matching** in `cms-content.js` -- gebruik exacte match ipv ends-with
3. **Sync init.sql** zodat alle keys die de frontend gebruikt ook in de database staan
4. **Sync CMS sections** in `pages.html` zodat alle bewerkbare velden per pagina kloppen
5. **Fix saveContent()** zodat image velden hun `content_type: 'image'` behouden

### Fase 2: CMS UX opschonen

6. **Secties inklapbaar maken** in de pages editor (click to expand/collapse)
7. **Sidebar consistent maken** -- elke sectie een eigen pagina
8. **Dashboard opruimen** -- placeholder secties verwijderen of markeren als "binnenkort"
9. **Test credentials blok verwijderen** van login pagina

### Fase 3: Beveiliging (belangrijk maar apart)

10. **API auth middleware** toevoegen (minimaal een token check)
11. **Debug route** afschermen of verwijderen in productie

---

## Samenvatting prioriteiten

| # | Probleem | Impact |
|---|----------|--------|
| 1 | Key matching is fragiel (ends-with) | Data kan verkeerd laden |
| 3 | Frontend keys ontbreken in CMS | Velden niet bewerkbaar |
| 5 | Image type gaat verloren bij opslaan | Afbeeldingen breken |
| 6 | Editor is onoverzichtelijk | Gebruiker raakt de weg kwijt |
| 2 | Geen server-side auth | Iedereen kan content wijzigen |
| 4 | Dashboard vol placeholders | Verwarrend voor gebruiker |
| 7 | Sidebar navigatie inconsistent | Verwarrend voor gebruiker |
