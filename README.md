# lizacornet.com

Statische one-pager. Geen build, geen dependencies — `index.html` openen volstaat.
Lokaal bekijken: `python3 -m http.server 8765` en dan <http://localhost:8765>.

## Nog aan te leveren

Twee beelden ontbreken. Ze staan in `index.html` uitgecommentarieerd met een
`TODO`-markering: bestand in `img/` zetten en het commentaar weghalen.

| Pad | Waar |
|---|---|
| `img/liza-cornet-podium.jpg` | Header. Zonder beeld toont de header het diepe burgundy vlak — dat oogt bewust, dus geen haast. |
| `img/liza-cornet-zaal.jpg` | Brede band boven de kenmerken (WODC-congres), incl. het bijschrift eronder. |

## Nog te doen

- Formulier post nu via `mailto:`. Wissel om naar Formspree of Netlify Forms zodra
  de site live staat — zie het commentaar in het `<script>`-blok.
- De pdf is 9,4 MB. Voor een downloadknop prima, maar comprimeren scheelt de
  bezoeker een hoop.

## Wat er staat

- **Showreel** — klikt de bezoeker op de thumbnail, dan pas laadt de
  YouTube-iframe (`youtube-nocookie`). Scheelt laadtijd en zet geen cookies
  vooraf. De afspeelknop zit al in de thumbnail, dus er ligt er geen tweede
  overheen.
- **Persmap** — de twee kopieerknoppen zetten de biografie op het klembord;
  de downloads wijzen naar de bestanden in `img/` en de pdf in de root.
