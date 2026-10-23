import assert from "node:assert/strict";
import { test, before, after } from "node:test";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
const req = createRequire(import.meta.url);
let pw; try { pw = req(process.env.PW_PATH || "playwright"); } catch { pw = null; }
const PORT = 20000 + Math.floor(Math.random() * 20000), ROOT = new URL("../public", import.meta.url).pathname, SHOTS = process.env.BIPA_SHOTS;
let srv, browser;
const skip = !pw && "playwright not installed (set PW_PATH)";
before(async () => { if (skip) return; srv = spawn("python3", ["-m", "http.server", String(PORT), "-d", ROOT], { stdio: "ignore" }); await new Promise((r) => setTimeout(r, 800));
  browser = await pw.chromium.launch({ executablePath: process.env.CHROME || undefined }); });
after(async () => { if (browser) await browser.close(); if (srv) srv.kill(); });
async function page(vp) {
  const ctx = await browser.newContext(vp); const p = await ctx.newPage();
  await p.addInitScript(() => { window.__PHOTO_AI_TEST = true; localStorage.setItem("theosis-consent", JSON.stringify({ version: "2026-10-22c", ts: "2026-10-22T00:00:00Z", req: true, opt: { ai: true, photoAi: false, biometric: false, labAi: false } }));
    window.__pickers = 0; const o = HTMLInputElement.prototype.click; HTMLInputElement.prototype.click = function () { if (this.type === "file") { window.__pickers++; return; } return o.call(this); }; });
  await p.goto(`http://localhost:${PORT}/simulator/index.html`); await p.waitForFunction(() => window.TheosisConsent && window.TheosisConsent.photoGate);
  return p;
}
const gate = (p) => p.evaluate(() => { window.__went = 0; TheosisConsent.photoGate(() => { window.__went++; document.getElementById("file-photo").click(); }); });
test("consent shows before any picker; Continue disabled until checked; stores version + timestamp", { skip }, async () => {
  const p = await page({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  await gate(p);
  assert.equal(await p.evaluate(() => window.__pickers), 0);
  assert.equal(await p.isChecked("#bipa-chk"), false);
  assert.equal(await p.isDisabled("#bipa-go"), true);
  assert.ok((await p.textContent("#bipa-dlg")).includes("may keep it briefly for abuse monitoring"));
  if (SHOTS) await p.screenshot({ path: SHOTS + "/pc-1-consent-unchecked.png" });
  await p.check("#bipa-chk"); assert.equal(await p.isDisabled("#bipa-go"), false);
  if (SHOTS) await p.screenshot({ path: SHOTS + "/pc-2-consent-checked.png" });
  await p.click("#bipa-go");
  assert.equal(await p.evaluate(() => window.__pickers), 1);
  const c = await p.evaluate(() => JSON.parse(localStorage.getItem("theosis-consent")));
  assert.equal(c.opt.photoAi, true); assert.equal(c.opt.biometric, true);
  assert.equal(c.bipa.version, await p.evaluate(() => TheosisConsent.BIPA_VERSION)); assert.ok(!isNaN(Date.parse(c.bipa.ts)));
  await gate(p); assert.equal(await p.$("#bipa-dlg"), null); assert.equal(await p.evaluate(() => window.__pickers), 2);
  await p.context().close();
});
test("No thanks: no picker, nothing granted", { skip }, async () => {
  const p = await page({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await gate(p); if (SHOTS) await p.screenshot({ path: SHOTS + "/phone-1-consent.png" });
  await p.click("#bipa-no");
  assert.equal(await p.evaluate(() => window.__pickers), 0);
  assert.equal(await p.evaluate(() => TheosisConsent.has("biometric")), false);
  await p.context().close();
});
test("Upload/Take photo buttons go through the gate", { skip }, async () => {
  const p = await page({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  await p.evaluate(() => document.getElementById("btn-upload").click());
  assert.ok(await p.$("#bipa-dlg")); assert.equal(await p.evaluate(() => window.__pickers), 0);
  await p.context().close();
});
test("Withdraw in Settings deletes on-device photo consent and turns it off", { skip }, async () => {
  const p = await page({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await gate(p); await p.check("#bipa-chk"); await p.click("#bipa-go");
  await p.evaluate(() => TheosisConsent.setConfirm(() => true));
  const ok = await p.evaluate(() => TheosisConsent.withdraw("photo"));
  assert.equal(ok, true);
  assert.equal(await p.evaluate(() => TheosisConsent.has("photoAi") || TheosisConsent.has("biometric")), false);
  await p.evaluate(() => { location.hash = "#settings"; const a = document.querySelector('[data-view="settings"]'); if (a) a.click(); });
  await p.waitForTimeout(600); const card = await p.$("#privacy-consents");
  if (card) { await card.scrollIntoViewIfNeeded(); if (SHOTS) await card.screenshot({ path: SHOTS + "/phone-2-settings-privacy.png" }); }
  await p.context().close();
});
