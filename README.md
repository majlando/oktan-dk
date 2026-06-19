# Oktan — oktan.dk

En clean, grafisk **placeholder** i ren HTML/CSS/JS. Ingen frameworks, ingen
build, ingen afhængigheder. Ét roligt skærmbillede.

Signaturen er en fuldskærms-**benzin-shader** (WebGL): domæne-warpet støj giver
en flydende, iriserende væske domineret af neongrøn. Ovenpå sidder et **crisp,
solidt `OKTAN`-wordmark** (hvid→neongrøn gradient) på en mørk fokus-pool, så det
står knivskarpt — flankeret af en kicker og en tagline.

## Filer

| Fil | Formål |
|-----|--------|
| `index.html` | Struktur, indhold og meta (SEO + Open Graph) |
| `style.css` | Tema, layout, wordmark, fokus-pool, animationer + reduced-motion |
| `fuel.js` | WebGL-baggrund (flydende, iriserende benzin) — CSS-gradient som fallback |
| `app.js` | Sætter årstallet i footeren (resten er ren CSS + WebGL) |
| `404.html` | Brandet 404-side (samme shader + wordmark) |
| `favicon.svg` | Browserikon (grøn benzindråbe) |
| `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest` | App-ikoner + web app manifest (installbar) |
| `og.jpg` | Delebillede til sociale medier (1200×630, ~48 KB) |
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
- **Wordmark:** gradient og størrelse styres af `.word` i `style.css`.
- **Læsbarhed:** `.stage::before` er den mørke fokus-pool bag teksten (mørkere = mere kontrast).
- **Benzinens udtryk:** farver, `SCALE`, hastighed (`tm`) og `smoothstep`-tærskler i `fuel.js`.
- **Delebillede:** `og.jpg` (1200×630) — gendan hvis udtrykket ændres.
- **Tilgængelighed:** alt respekterer `prefers-reduced-motion`, og WebGL har en CSS-gradient-fallback.
