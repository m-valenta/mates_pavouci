Potřeboval bych pro syna vytvořit webou encyklopedii českých pavouků.

Moje představa je staticka single-page 
- html, typescript/react/MUI
- možná nějaké browser storage (vysvětlím v později) 


## Data

Data o pavoucich vyhledáme na internetu, dával bych je do jednoho .json souboru. který se přilinkuje k webu. Stránka je načte a zobrazí (kokrétního vybraného).

### Co nás zajímá
- Jméno (české)
- Velikost, délka života
- Způsob života (lov, potrava přezymování)
- Výskyt (v cř, kde se v přírodě vyskytuje)
- Fotka(y)


## UX
High-level bych viděl reaktivni stránku, bude zobrazena často na výšku v telefonu. Poprosil bych při návrhu uvážit, že by to mělo byt určeno pro dítě (9let).

Názvy pavouků nabídneme v menu/sloupci/listu s vyhledáváním. V první fázi vytvoříme české pavouky, poždeji by mohli přibýt sklípkani. Další sekce bude standardně obsahovat popisy a fotografie (detail). Sekci s detaily by bral jako generickou, načte data a zobrazí.

Vše by bylo fajn navrhnout, aby bylo hezké (šabloblona /  barvy) a jednoduché na ovládání.

### Speciální funkce
- Hezké by bylo aby detail obsahoval srdíčko (bude se řadit před ostatní / může být zvýrazněn v listu).
- Hezké by bylo možnost si poznamenat, že jsme ho viděli v přírodě (opět možné zvátraznit v listu)
- Prototo bych si představoval, prozkoumat možnosti prohlížečě (uvažuji to někde hostovat)


### Pro co optimalizovat
iphone 12 (opera), google chrome (desktop)


## Deploy
- ideálně statický web
- prohledejme možnosti hostování (Je to rodinný projekt, nechci aby to bylo drahé)




