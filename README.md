# Oktan — oktan.dk

En clean, grafisk **placeholder** i ren HTML/CSS/JS. Ingen frameworks, ingen
build, ingen afhængigheder. Ét roligt skærmbillede.

Signaturen er en fuldskærms-**benzin-shader** (WebGL): domæne-warpet støj giver
en flydende, iriserende væske domineret af neongrøn. Et mørkt slør dæmper
benzinen overalt — **undtagen gennem bogstaverne i `OKTAN`**, så ordet ser ud
til at være fyldt med levende, flydende brændstof, omkranset af en blød neon-kant.

## Sådan virker OKTAN-effekten

- `#fuel` (canvas) renderer benzinen i fuld styrke.
- `.veil` (SVG) lægger et mørkt slør over alt, med et **OKTAN-formet hul**
  (SVG-maske) — så benzinen kun ses i fuld styrke gennem bogstaverne.
- En gennemsigtig `<h1>` reserverer den præcise plads; `app.js` placerer
  SVG-teksten oven på den (og holder den synkron ved resize / font-load).
- Falder tilbage til en CSS-gradient hvis WebGL ikke er tilgængelig.

## Filer

| Fil | Formål |
|-----|--------|
| `index.html` | Struktur, indhold og meta (SEO + Open Graph) |
| `style.css` | Tema, slør/maske, layout, animationer + reduced-motion |
| `fuel.js` | WebGL-baggrund (flydende, iriserende benzin) — CSS-gradient som fallback |
| `app.js` | Placerer benzin-`OKTAN` oven på overskriften + årstal i footeren |
| `favicon.svg` | Browserikon (grøn benzindråbe) |
| `og.png` | Delebillede til sociale medier (1200×630) |
| `robots.txt` / `sitemap.xml` | SEO |
| `_headers` | Sikkerheds-/cache-headers (Cloudflare Pages) |

## Kør lokalt

Dobbeltklik på `index.html`, eller server den (anbefales — så virker alt):

```bash
python -m http.server 8000   # → http://localhost:8000
```

## Udgiv på Cloudflare Pages

Via Git (auto-deploy ved hvert push):

1. dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Vælg repoet, branch `main`. **Build command:** *(tom)*, **Build output directory:** `/`.
3. **Custom domains** → tilføj `oktan.dk` (og gerne `www.oktan.dk`). HTTPS kommer automatisk.

Eller manuelt: **Upload assets** og træk hele mappens indhold ind.

## Ret indhold

- **Tekst:** kicker, `OKTAN` og tagline ligger i `index.html`.
- **Farve:** skift `--accent` i `style.css`. Benzinens farver styres i
  fragment-shaderens farveblok i `fuel.js`.
- **Slørets styrke:** `.veil__fill` (mørkere = mere dæmpet baggrund); neon-kanten
  er `.veil__glow`.
- **Benzinens udtryk:** juster `SCALE`, hastighed (`tm`) og `smoothstep`-tærskler
  i `fuel.js`.
- **Delebillede:** `og.png` (1200×630) — gendan hvis teksten ændres.
- **Tilgængelighed:** alt respekterer `prefers-reduced-motion`, og WebGL har
  en CSS-gradient-fallback.
