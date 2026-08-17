/* Neemt de aanvraag van het formulier aan en mailt hem naar Liza.
   Draait als Vercel-function; de sleutel staat in de env, nooit in de repo. */

const NAAR = process.env.AANVRAAG_NAAR || 'liza@yicco.com';
/* Zonder geverifieerd domein staat Resend alleen onboarding@resend.dev toe,
   en alleen naar het adres waarmee het account is aangemaakt. Domein
   geverifieerd? Zet AANVRAAG_VAN op bijv. "Website <aanvraag@yicco.com>". */
const VAN = process.env.AANVRAAG_VAN || 'Aanvraag lizacornet.com <onboarding@resend.dev>';

const VELDEN = [
  ['naam', 'Naam', true],
  ['email', 'E-mail', true],
  ['organisatie', 'Organisatie', true],
  ['datum', 'Datum', true],
  ['tijdstip', 'Tijdstip', true],
  ['aantal', 'Aantal mensen', true],
  ['locatie', 'Locatie', true],
  ['onderdeel', 'Onderdeel', false],
  ['toelichting', 'Toelichting', false],
];

const schoon = (v) => String(v == null ? '' : v).trim().slice(0, 2000);
const isMail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ fout: 'Alleen POST' });
  if (!process.env.RESEND_API_KEY) return res.status(500).json({ fout: 'Verzending niet geconfigureerd' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (schoon(body._gotcha)) return res.status(200).json({ ok: true }); // bot: stilletjes slikken

  const waarden = VELDEN.map(([sleutel, label, verplicht]) => [label, schoon(body[sleutel]), verplicht]);
  const ontbreekt = waarden.filter(([, v, verplicht]) => verplicht && !v).map(([label]) => label);
  if (ontbreekt.length) return res.status(400).json({ fout: 'Ontbrekende velden: ' + ontbreekt.join(', ') });

  const email = waarden.find(([label]) => label === 'E-mail')[1];
  if (!isMail(email)) return res.status(400).json({ fout: 'Ongeldig e-mailadres' });

  const organisatie = waarden.find(([label]) => label === 'Organisatie')[1];
  const datum = waarden.find(([label]) => label === 'Datum')[1];
  const tekst = waarden.filter(([, v]) => v).map(([label, v]) => label + ': ' + v).join('\n');

  const antwoord = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: VAN,
      to: [NAAR],
      reply_to: email,
      subject: `Aanvraag ${organisatie} — ${datum}`,
      text: 'Aanvraag via lizacornet.com\n\n' + tekst,
    }),
  });

  if (!antwoord.ok) {
    console.error('Resend gaf', antwoord.status, await antwoord.text());
    return res.status(502).json({ fout: 'Versturen mislukt' });
  }
  return res.status(200).json({ ok: true });
};

/* ponytail: geen rate limiting. Komt er spam doorheen ondanks de honeypot,
   dan een teller per IP in Vercel KV of Cloudflare Turnstile ervoor. */
