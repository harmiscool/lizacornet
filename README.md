# lizacornet.com

Statische one-pager. Geen build, geen dependencies — `index.html` openen volstaat.
Lokaal bekijken: `python3 -m http.server 8765` en dan <http://localhost:8765>.

## Formulier

De aanvraag gaat via `api/aanvraag.js` (Vercel-function) naar liza@yicco.com,
verstuurd met [Resend](https://resend.com). Lukt dat niet, dan valt de pagina
terug op `mailto:` zodat er nooit een aanvraag verdampt.

Nodig om het live te laten werken:

1. Resend-account op **liza@yicco.com**, API-key aanmaken.
2. In Vercel bij Settings → Environment Variables: `RESEND_API_KEY`.
3. Deployen. Klaar.

Zolang het domein `yicco.com` niet in Resend geverifieerd is, verstuurt Resend
alleen vanaf `onboarding@resend.dev` en alleen naar het adres van het account —
voor dit formulier precies genoeg. Is het domein wél geverifieerd, zet dan
`AANVRAAG_VAN` op bijv. `Website <aanvraag@yicco.com>`; met `AANVRAAG_NAAR`
gaat de post naar een ander adres.

Zelfcontrole van de function: `node test-aanvraag.js`.

## Nog te doen

- De pdf is 9,4 MB. Voor een downloadknop prima, maar comprimeren scheelt de
  bezoeker een hoop.

## Wat er staat

- **Showreel** — klikt de bezoeker op de thumbnail, dan pas laadt de
  YouTube-iframe (`youtube-nocookie`). Scheelt laadtijd en zet geen cookies
  vooraf. De afspeelknop zit al in de thumbnail, dus er ligt er geen tweede
  overheen.
- **Persmap** — de twee kopieerknoppen zetten de biografie op het klembord;
  de downloads wijzen naar de bestanden in `img/` en de pdf in de root.
