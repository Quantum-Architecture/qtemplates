// interop_test.js — runs demos/qe_preuve.js in Node (WebCrypto), produces a journal from sample events, writes preuves/demo.jsonl
// and an altered copy; the public Python verifier must say VALID / INVALID. No browser needed.
const fs = require('fs'); const path = require('path');
const window = { crypto: require('crypto').webcrypto, document: null }; globalThis.window = window; globalThis.crypto = window.crypto;
globalThis.TextEncoder = require('util').TextEncoder;
new Function('window', 'crypto', 'TextEncoder', fs.readFileSync(path.join(__dirname, '..', 'demos', 'qe_preuve.js'), 'utf8'))(window, window.crypto, TextEncoder);
(async () => {
  const events = [
    { t: '2026-09-26T00:00:00Z', type: 'session', data: { template: 'QE Verifiable Journal SDK', edition: 'developer' } },
    { t: '2026-09-26T00:00:01Z', type: 'event', data: { note: 'accents — « guillemets » — 😀', amount: 12.5, n: 3 } },
    { t: '2026-09-26T00:00:02Z', type: 'close', data: { ok: true } },
  ];
  const txt = await window.QE_PREUVE(events);
  fs.writeFileSync(path.join(__dirname, 'demo.jsonl'), txt);
  const lines = txt.trim().split('\n'); const r = JSON.parse(lines[1]); r.data.amount = '99.9'; lines[1] = JSON.stringify(r);
  fs.writeFileSync(path.join(__dirname, 'demo_alt.jsonl'), lines.join('\n') + '\n');
  if (!/"amount":"12.5"/.test(txt)) { console.error('non-integer number must be serialised as a string'); process.exit(1); }
  console.log('journal produced:', lines.length, 'records');
})();
