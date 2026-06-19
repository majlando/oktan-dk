# Oktan — oktan.dk

En clean, grafisk **placeholder** i ren HTML/CSS/JS. Ingen frameworks, ingen
build, ingen afhængigheder. Ét roligt skærmbillede.

Signaturen er en fuldskærms-**benzin-shader** (WebGL): domæne-warpet støj giver
en flydende, iriserende væske domineret af neongrøn. Oven på den sidder tre
linjer: kicker, `OKTAN`-wordmark og tagline — plus et diskret årstal i bunden.

## Filer

| Fil | Formål |
|-----|--------|
| `index.html` | Struktur, indhold og meta (SEO + Open Graph) |
| `style.css` | Tema, layout, animationer, responsivt + reduced-motion |
| `fuel.js` | WebGL-baggrund (flydende, iriserende benzin) — falder tilbage til CSS-gradient |
| `app.js` | Sætter årstallet i footeren (resten er ren CSS + WebGL) |
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

1. dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Navngiv projektet `oktan`, træk hele mappens indhold ind (ikke en undermappe), **Deploy**.
3. **Custom domains** → tilføj `oktan.dk` (og gerne `www.oktan.dk`). HTTPS kommer automatisk.

> Alternativt via Git: tilslut repoet, sæt **Build command** til *(tom)* og
> **Build output directory** til `/` (roden). Der er ingen build.

## Ret indhold

- **Tekst:** kicker, wordmark og tagline ligger i `index.html`.
- **Farve:** skift `--accent` (og iris-farverne) i `style.css`. Benzinens farver
  styres i fragment-shaderens farveblok i `fuel.js`.
- **Benzinens udtryk:** juster `SCALE` (opløsning/blødhed) i `fuel.js`, samt
  hastighed og `smoothstep`-tærsklerne i farveblokken.
- **Delebillede:** `og.png` (1200×630) bruges i link-previews. Erstat den, hvis
  teksten ændres.
- **Tilgængelighed:** alt respekterer `prefers-reduced-motion`, og WebGL har en
  CSS-gradient-fallback.
