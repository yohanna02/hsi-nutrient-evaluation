# HSI Nutrient Evaluation — project website

A single-page site describing the invention
**"Hyperspectral Imaging (HSI) System for Non-destructive Evaluation of Nutrients in
Food and Agricultural Products"**, presented at the **2026 TETFund National Research
Fair / Exhibition**.

**Inventor:** Abdulwahab Durojaiye Ismail
Department of Agricultural and Bioresources Engineering, Faculty of Engineering and
Engineering Technology, Abubakar Tafawa Balewa University, P.M.B. 0248, Yelwa Campus,
Bauchi State, Nigeria.
`adismail@atbu.edu.ng` · 08060434467

---

## Running it

There is no build step and no dependency to install. Open the file:

```
open index.html          # macOS
xdg-open index.html      # Linux
```

Or serve the folder (recommended if you want to share it on a local network at the fair):

```
python3 -m http.server 8080
# then visit http://localhost:8080
```

To publish, upload the whole folder to any static host — GitHub Pages, Netlify,
Cloudflare Pages, or a university web server. Nothing needs configuring.

**It works fully offline.** No web fonts, no CDN, no analytics, no framework — every
asset is local, so the page renders identically with no network connection.

## Built for a phone

Most visitors will be reading this on their own handset, so the layout is
mobile-first and the reading path is short:

- **Section links are always visible.** There is no hamburger menu to discover — the
  links sit in a row under the brand and scroll sideways if they run out of width.
  The link for the section you are reading is highlighted and auto-scrolls into view.
- **The headline is a plain sentence** ("Reading the nutrients in food — without
  destroying it"), with the formal project title further down, so the first screen
  says what the thing does.
- **Detail is one tap away.** The full validation table, the six result figures, the
  component list and the longer explanation are behind `<details>` summaries that
  start closed. The page is short to scroll; the depth is still there.
- **Tap targets are at least 44 px**, and text is 17 px with generous line height.
- **The video is portrait**, 360×640, so it fills the screen rather than sitting in
  a letterbox. It is `preload="none"`, so the 7.5 MB is only fetched when someone
  actually plays it, and it pauses itself when scrolled out of view or when another
  tab is opened.

## What's in it

| Path | Contents |
|---|---|
| `index.html` | The whole page: hero, overview, video, instrument, samples, results, uses, contact |
| `assets/css/styles.css` | All styling, light + dark themes, responsive layout, print stylesheet |
| `assets/js/main.js` | Theme toggle, scroll spy, sample filters, video auto-pause, image lightbox |
| `assets/img/` | University crest, cabinet renderings |
| `assets/img/samples/` | 8 RGB photographs paired with their hyperspectral scan strips |
| `assets/img/figures/` | 6 validation figures from the project |
| `assets/video/` | The instrument walkthrough (MP4) and its poster frame |

Total weight is about 10 MB, of which 7.5 MB is the video. Everything else is
about 2.3 MB of imagery and text.

## Sections

- **Overview** — the idea in one minute: a destructive assay next to a non-destructive
  one, then the three steps (scan → predict → map). The longer argument sits behind
  a "Why this matters" summary.
- **Video** — the instrument, running, with a short explanation of what the
  touchscreen is doing.
- **Instrument** — the closed enclosure, the six-step acquisition pipeline, the ten
  cabinet components and the touchscreen controls, the latter two behind summaries.
- **Samples** — yam (three cuts), Irish potatoes, PBR beans (two placements), fried
  plantain and jollof rice. Each card pairs the RGB photograph with the reconstructed
  image and false-colour spectral map. Filterable by food; tap any image to enlarge.
- **Results** — R² meters for all ten nutrient targets, with the full validation
  table (R², adjusted R², RMSE, MAE) and the six original figures behind summaries.
- **Uses** — where a non-destructive reading is useful.
- **Contact** — inventor, department, university and direct contact links.

## Source of the content

All text, figures and measurements come from the exhibition roll-up banner
(`Rollup Barnner.docx`) and the bench video of the working system. The images were
extracted from that document and are used unaltered apart from resizing and metadata
stripping.

Numbers in the results table are transcribed exactly from the project's own
validation figures:

| Sample | Target | R² |
|---|---|---|
| Irish potatoes | Carbohydrate | 0.995 |
| Chicken | Protein (LightGBM) | 0.982 |
| Cooked beans | Protein | 0.969 |
| Boiled yam | K / Se / Na / Fe / Ca | 0.9442 / 0.9418 / 0.9341 / 0.9301 / 0.9085 |
| Beef | Vitamin B2 / B1 | 0.9113 / 0.8977 |

Nothing has been estimated or filled in. Where a statistic was not reported in the
source figure it is shown as "—". Units are stated only where the source figure
states them (yam minerals in mg/kg, beef vitamins in mg/100 g).

The touchscreen details in the video section — the three analysis systems
(Proximate, Mineral, Vitamins), the seven sample modes, and the field names on the
Selection tab — were read off the screen in the video and are described as shown.

## Editing notes

- **Colours** live in the `:root` token block at the top of `styles.css`. The dark
  values are declared twice — once under `prefers-color-scheme` and once under
  `[data-theme="dark"]` — so the manual toggle wins over the OS setting in both
  directions.
- **The accent** (`#0f7a52` light, `#2fa87a` dark) was checked for lightness band,
  chroma floor and ≥ 3:1 contrast against its surface. If you change it, re-check
  contrast; the R² meters rely on it.
- **The muted text colour** (`--ink-3`) is `#666e6a` in light mode, the lightest
  grey that still clears 4.5:1 against the card, paper and sunken backgrounds.
  Going lighter breaks contrast — re-check it if you adjust it.
- **Replacing the video:** drop the new file in `assets/video/`, update the
  `<source>` in `index.html`, and regenerate the poster with
  `ffmpeg -ss 3 -i new.mp4 -frames:v 1 -q:v 3 poster.jpg`. Keep it portrait
  (360×640) and the CSS will letterbox it correctly.
- **Adding a sample:** copy the `.scan` article in `index.html`, set `data-food`,
  drop the two images in `assets/img/samples/`, and update the counts on the filter
  chips. The filter logic reads `data-food`, so no JavaScript change is needed.
- **Adding a result row:** add a `.meter` list item (set `--v` to the R² value) and
  a matching `<tr>` in the table.
- **Adding a collapsible section:** use `<details class="more"><summary>Title
  <span class="more-hint">short note</span></summary><div class="more-body">…</div></details>`.
  Printing expands every one of them automatically.
- Scientific figures and cabinet renderings deliberately stay on a white card in
  dark mode — inverting them would misrepresent the plots.

## Accessibility

Keyboard-operable throughout: skip link, visible focus rings, `aria-pressed` filter
chips, a dialog lightbox that closes on Escape and restores focus to its trigger.
Every image carries descriptive alt text, and the video has captions in the
surrounding text describing what it shows. The R² meters print their values
directly and the same numbers appear in the table, so no information is available
only on hover or only through colour. Body and muted text clear 4.5:1 in both light
and dark mode. Motion is reduced under `prefers-reduced-motion`, and the print
stylesheet expands every collapsed section so nothing is lost on paper.
