# Encyklopedie českých pavouků – realizační plán

Stav: odsouhlaseno, v realizaci (2026-09-27)

## 1. Cíl

Statická single-page webová encyklopedie českých pavouků pro devítileté dítě.
Primárně telefon na výšku (iPhone 12, Opera), sekundárně desktop Chrome.
Levný nebo bezplatný hosting. Data v jednom JSON souboru, detail pavouka
generický (načte a zobrazí, cokoliv v datech je).

## 2. Technologie

| Oblast | Volba | Poznámka |
|---|---|---|
| Build | Vite + React 18 + TypeScript | rychlý dev server, statický `dist/` |
| UI | MUI v6 | téma, ikony, responzivní grid, dostupnost |
| Routing | react-router (hash nebo history s fallbackem) | URL na konkrétního pavouka, sdílení odkazů |
| Data | `public/data/spiders.json` + validace schématu (zod) | načítáno `fetch` při startu, TS typy odvozené ze schématu |
| Vyhledávání | jednoduchý filtr v paměti, bez diakritiky | ~50–100 položek, žádná knihovna není třeba |
| Persistence | `localStorage` | srdíčka, „viděli jsme“ (detail v kap. 6) |
| Obrázky | `public/images/<id>/*.webp` | zmenšené na cca 1200 px, plus náhled 300 px |
| Kvalita | ESLint, Prettier, Vitest pro datové utility | lehké, bez přehnaného testování |
| CI/CD | GitHub Actions → hosting | build + deploy při push na `main` |

## 3. Datový model

Jeden soubor `spiders.json`, pole objektů. Návrh položky:

```ts
interface Spider {
  id: string;                 // slug, např. "krizak-obecny"
  category: "cz" | "tarantula"; // "tarantula" pro budoucí sklípkany
  nameCs: string;             // Křižák obecný
  nameLat: string;            // Araneus diadematus
  family?: string;            // křižákovití
  size: {
    femaleMm: [number, number]; // rozsah délky těla samice
    maleMm?: [number, number];
    note?: string;              // „s nohama až 4 cm“
  };
  lifespan: string;           // „1 rok, samice přezimuje jako vajíčka“
  lifestyle: {
    hunting: string;          // způsob lovu (síť, číhání, aktivní lov)
    food: string;             // potrava
    wintering: string;        // přezimování
  };
  occurrence: {
    czech: string;            // výskyt v ČR (hojný / vzácný / kde)
    habitat: string;          // biotop: zahrady, lesy, domy, voda
    months?: number[];        // měsíce, kdy ho lze potkat (pro ikonku kalendáře)
  };
  dangerToHumans: "neskodny" | "muze-kousnout" | "jedovaty";
  funFact?: string;           // jedna zajímavost pro děti
  photos: {
    src: string;
    thumb?: string;
    alt: string;
    author: string;           // povinné kvůli licenci
    license: string;          // např. "CC BY-SA 4.0"
    sourceUrl: string;
  }[];
}
```

Zásady:
- Texty krátké, srozumitelné pro 9 let, jedna myšlenka na řádek.
- Fotky pouze s licencí dovolující zveřejnění (Wikimedia Commons, iNaturalist CC),
  vždy s autorem a licencí zobrazenou u fotky. Web bude veřejný, takže to je nutné.
- Skript `npm run validate-data` zkontroluje JSON proti schématu a existenci obrázků.
- Skript `npm run images` zmenší a převede fotky do WebP (sharp).

Návrh prvních cca 20 druhů: křižák obecný, křižák pruhovaný, pokoutník domácí,
třesavka velká, skákavka pruhovaná, běžník kopretinový, lovčík hajní, slíďák hajní,
vodouch stříbřitý, zápřednice jedovatá, snovačka, čelistnatka rákosní, cedivka,
pavučenka, listovník, plachetnatka, sklípkánek černý, stepník rudý, pokoutník tmavý,
běžník zelený. Seznam doladíme společně se synem.

## 4. UX a rozvržení

### Mobil (výchozí)
- **Seznam**: karty s náhledem, českým názvem a malými ikonami (♥ oblíbený, 👁 viděli).
  Nahoře vyhledávací pole (bez diakritiky, hledá i v latinském názvu) a dvě přepínací
  ikony filtru: „Oblíbení“ a „Viděli jsme“.
- Řazení: oblíbení první, potom abecedně.
- **Detail**: velká fotka (možnost přejíždět mezi více fotkami), pod ní název česky
  a latinsky, řada „chipů“ s ikonami (velikost, délka života, nebezpečnost).
  Dále sekce s ikonou a krátkým textem: Jak žije, Co jí, Kde ho najdeš, Zima,
  Zajímavost. Dole velká tlačítka ♥ a „Viděli jsme ho!“.
- Zpět šipkou nebo gestem, URL `/#/pavouk/krizak-obecny`.

### Desktop
- Dvousloupcový layout: seznam vlevo (cca 320 px), detail vpravo. Stejné komponenty.

### Pro dítě
- Velké dotykové plochy (min. 48 px), větší písmo, málo textu, ikony k každé sekci.
- Přátelské barevné téma (např. tmavě zelená + krémová + oranžový akcent), zaoblené karty.
- Prázdné stavy s hláškou („Zatím žádný oblíbený pavouk. Klepni na srdíčko!“).
- Drobná odměna: počítadlo „Viděli jsme X pavouků“ v hlavičce, případně později odznaky.
- Žádné blikání, žádné modály, žádné cookies lišty (nic nesledujeme).

## 5. Struktura projektu

```
mates_pavouci/
  public/
    data/spiders.json
    images/<id>/...
  scripts/
    validate-data.ts
    process-images.ts
  src/
    main.tsx, App.tsx, theme.ts
    data/schema.ts        (zod schéma + typy)
    data/useSpiders.ts    (načtení a cache JSON)
    storage/useUserMarks.ts (oblíbené, viděli – localStorage)
    components/ SpiderList, SearchBar, SpiderCard, SpiderDetail,
                PhotoGallery, InfoSection, MarkButtons, EmptyState
    pages/ ListPage, DetailPage
  docs/plan.md, docs/zadani_md.md, README.md
```

## 6. Ukládání v prohlížeči (srdíčko, viděli jsme)

- Fáze 1: `localStorage`, klíč `spider-enc:v1`, hodnota `{ favorites: string[], seen: {id, date}[] }`.
  Jednoduché, synchronní, funguje v Opeře na iOS i v Chrome.
- Riziko: iOS (WebKit, platí i pro Operu na iPhonu) může smazat úložiště webu,
  který nebyl 7 dní navštíven. Řešení: přidat web na plochu (pak se nemaže), plus
  tlačítko „Zálohovat“ a „Obnovit“ (export/import malého JSON souboru nebo zkopírování kódu).
- Fáze 2 (volitelně): PWA manifest + service worker pro offline použití v přírodě
  a ikonu na ploše. Na iOS jde instalace jen ze Safari, Opera to neumí; funkčně
  to ale nevadí, data zůstávají.
- Bez serveru a bez účtů: žádná GDPR agenda, nulové náklady.

## 7. Hosting

| Možnost | Cena | Vlastní doména | Poznámka |
|---|---|---|---|
| GitHub Pages | zdarma | ano | nejjednodušší, kód i web na jednom místě; URL `m-valenta.github.io/mates_pavouci` |
| Cloudflare Pages | zdarma | ano | rychlé CDN, snadné náhledy větví |
| Netlify / Vercel | zdarma (limity) | ano | podobné, o něco více „magie“ |

Doporučení: **GitHub Pages** s GitHub Actions. Volitelně vlastní `.cz` doména
(cca 200–300 Kč/rok) přes Cloudflare DNS. Bez domény je vše za 0 Kč.

## 8. Fáze realizace

| # | Fáze | Obsah | Odhad |
|---|---|---|---|
| 0 ✅ | Základ | git repo, Vite+React+TS+MUI, ESLint/Prettier, CI deploy prázdné stránky na Pages | 1 večer |
| 1 ✅ | Data | schéma, validátor, skript na obrázky, 5 prvních pavouků s fotkami | 1–2 večery |
| 2 | UI kostra | seznam, vyhledávání, detail, routing, responzivní layout | 2 večery |
| 3 | Značky | srdíčko a „viděli jsme“, filtry, řazení, záloha/obnova | 1 večer |
| 4 | Vzhled | téma, ikony, prázdné stavy, test na iPhonu, dostupnost | 1–2 večery |
| 5 | Naplnění dat | doplnění na ~20 druhů, korektura textů se synem | průběžně |
| 6 | Rozšíření | kategorie sklípkani, PWA offline, odznaky/kvíz | později |
| 7 | Úklid | projít projekt a odstranit vše nepotřebné (zbytky šablony, nepoužité závislosti a skripty) | na závěr |

Po fázi 2 je web už použitelný a dá se ukazovat synovi, zbytek jde iterovat.

## 9. Rozhodnutí (2026-09-27)

1. Hosting: GitHub Pages + GitHub Actions. Bez vlastní domény.
2. Start s 20 nejčastějšími druhy, další později.
3. Fotky: dohledat a stáhnout z Wikimedia Commons (jen CC licence), uložit lokálně s autorem a licencí.
4. Latinské názvy se v UI nezobrazují (v datech zůstávají kvůli dohledávání fotek). Čeleď se zobrazuje.
5. Sklípkani přibudou do jednoho společného seznamu, vizuálně oddělení (nadpis sekce / barevný štítek kategorie).
