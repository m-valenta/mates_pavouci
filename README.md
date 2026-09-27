# Mates pavouci – encyklopedie českých pavouků

Statická webová encyklopedie českých pavouků pro děti. React + TypeScript + MUI, data v jednom
JSON souboru, hostováno na GitHub Pages.

- Zadání: [docs/zadani_md.md](docs/zadani_md.md)
- Realizační plán: [docs/plan.md](docs/plan.md)

## Požadavky

- Node.js 22 a npm (ověřeno s Node 22.22, npm 10.9)

## Spuštění pro vývoj

```bash
npm install
npm run dev
```

Vite vypíše adresu (obvykle `http://localhost:5173`). Stránka se při každé změně souboru sama
obnoví. Pro vyzkoušení na telefonu ve stejné Wi‑Fi spusť `npm run dev -- --host` a otevři
zobrazenou adresu s IP počítače.

## Build produkční verze

```bash
npm run validate-data   # zkontroluje spiders.json a existenci fotek
npm run build           # typová kontrola + build do složky dist/
npm run preview         # lokálně servíruje hotový build
```

Build je nastaven pro GitHub Pages pod cestou `/mates_pavouci/` (viz `vite.config.ts`). Při push
na větev `main` ho GitHub Actions (`.github/workflows/deploy.yml`) sám vybuildí a nasadí.
V nastavení repozitáře je nutné jednou zapnout Pages se zdrojem „GitHub Actions“.
Web pak běží na https://m-valenta.github.io/mates_pavouci/.

## Práce s daty

- Data: `public/data/spiders.json`, schéma a typy: `src/data/schema.ts`.
- Nový pavouk: přidej záznam do JSON s prázdným `photos: []` a spusť:

```bash
npm run fetch-photos                   # dohledá fotky pro pavouky bez fotek
npm run fetch-photos -- --only=<id>    # jen pro jednoho
npm run fetch-photos -- --force        # znovu i pro ty, kteří fotky mají
```

Skript hledá na Wikimedia Commons fotky s volnou licencí (CC BY, CC BY‑SA, CC0, public domain),
zmenší je do WebP (`public/images/<id>/`) a do JSON zapíše autora, licenci a odkaz na zdroj.
Vybrané fotky je dobré po stažení zkontrolovat očima, případně ručně nahradit.

Další skripty: `npm run lint`, `npm run format`.

## Jak si pomoct na iPhonu (srdíčka a „viděli jsme“)

Oblíbené a „viděli jsme“ se ukládají jen v prohlížeči v telefonu (localStorage). Žádný účet,
nic se neposílá na server. Z toho plyne pár věcí:

1. **Údaje jsou vázané na prohlížeč.** Co si označíš v Opeře, neuvidíš v Safari a naopak.
   Vyber si jeden prohlížeč a používej ten.
2. **iOS maže úložiště webů, které nenavštívíš 7 dní.** Platí to pro všechny prohlížeče na
   iPhonu, i pro Operu. Nejjistější ochrana je přidat web na plochu (viz níže), takovému webu
   se úložiště nemaže.
3. **Přidání na plochu:** na iPhonu to jde jen ze Safari. Otevři web v Safari, klepni na ikonu
   Sdílet (čtvereček se šipkou) a vyber „Přidat na plochu“. Web se pak spouští jako aplikace
   a srdíčka zůstávají.
4. **Záloha:** v aplikaci bude tlačítko „Zálohovat“, které vytvoří krátký kód nebo soubor.
   Ten stačí uložit (např. do Poznámek) a na jiném zařízení nebo po smazání dat použít
   „Obnovit“.
5. **Soukromý režim** nic neuloží. Používej normální okno.
6. Když se srdíčka ztratila: zkontroluj, že jsi ve stejném prohlížeči, že to není soukromé
   okno a že nebyla vymazána „Data webů“ v nastavení prohlížeče. Pak použij „Obnovit“ ze zálohy.
