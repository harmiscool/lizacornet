/* Zelfcontrole van de aanvraag-function: node test-aanvraag.js */
const assert = require('assert');
process.env.RESEND_API_KEY = 'test';
const handler = require('./api/aanvraag.js');

const compleet = {
  naam: 'Test Persoon', email: 'test@example.com', organisatie: 'Testorganisatie',
  datum: '2026-11-12', tijdstip: 'Ochtend', aantal: '30 — 100', locatie: 'Den Haag',
  onderdeel: 'Keynote', toelichting: 'Even testen.',
};

let verstuurd;
global.fetch = async (url, opties) => {
  verstuurd = { url, ...JSON.parse(opties.body) };
  return { ok: true, status: 200, text: async () => '' };
};

async function roep(body, method = 'POST') {
  verstuurd = null;
  let uit = {};
  const res = { status(c){ uit.code = c; return this; }, json(j){ uit.body = j; return this; } };
  await handler({ method, body }, res);
  return uit;
}

(async () => {
  assert.strictEqual((await roep(compleet, 'GET')).code, 405, 'GET moet geweigerd worden');

  assert.strictEqual((await roep({ ...compleet, naam: '  ' })).code, 400, 'lege naam moet 400 geven');
  assert.strictEqual((await roep({ ...compleet, email: 'geen-adres' })).code, 400, 'kapot e-mailadres moet 400 geven');
  assert.strictEqual(verstuurd, null, 'bij een fout mag er niets verstuurd worden');

  assert.strictEqual((await roep({ ...compleet, _gotcha: 'bot' })).code, 200, 'bot krijgt een net antwoord');
  assert.strictEqual(verstuurd, null, 'maar er gaat geen mail uit');

  assert.strictEqual((await roep({ ...compleet, onderdeel: '', toelichting: '' })).code, 200, 'optionele velden mogen leeg');

  const ok = await roep(compleet);
  assert.strictEqual(ok.code, 200);
  assert.deepStrictEqual(verstuurd.to, ['liza@yicco.com']);
  assert.strictEqual(verstuurd.reply_to, 'test@example.com', 'antwoorden gaat naar de aanvrager');
  assert.strictEqual(verstuurd.subject, 'Aanvraag Testorganisatie — 2026-11-12');
  assert.ok(verstuurd.text.includes('Locatie: Den Haag'), 'alle velden staan in de mail');
  assert.ok(!verstuurd.text.includes('_gotcha'), 'het honeypot-veld hoort er niet in');

  assert.strictEqual((await roep(JSON.stringify(compleet))).code, 200, 'body als string moet ook werken');

  global.fetch = async () => ({ ok: false, status: 401, text: async () => 'nope' });
  assert.strictEqual((await roep(compleet)).code, 502, 'Resend-fout wordt een 502');

  console.log('alles goed');
})();
