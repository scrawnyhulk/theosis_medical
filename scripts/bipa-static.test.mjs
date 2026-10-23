import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../public/simulator/index.html", import.meta.url), "utf8");
const mirror = readFileSync(new URL("../.vercel/output/static/simulator/index.html", import.meta.url), "utf8");
const fns = ["ai.js", "preview.js", "foodphoto.js"].map((f) => readFileSync(new URL("../netlify/functions/" + f, import.meta.url), "utf8"));
test("public and .vercel mirrors match", () => assert.equal(html, mirror));
test("final BIPA wording present, Status line and footnote absent", () => {
  assert.match(html, /Biometric consent \(required for photo features\)/);
  assert.match(html, /may keep it briefly for abuse monitoring under its terms\. We don't store it on our servers/);
  assert.match(html, /I give my written consent \(a written release\) for Theosis Health LLC/);
  assert.match(html, /No thanks, use without photos/);
  assert.doesNotMatch(html, /written release" BIPA requires/);
  assert.doesNotMatch(html, /\*\*Status/);
});
test("no 'after processing' wording, no Theosis Medical in BIPA flow", () => {
  assert.doesNotMatch(html, /after processing/i);
  const g = html.slice(html.indexOf("function photoGate"), html.indexOf("function photoGate") + 4000);
  assert.doesNotMatch(g, /Theosis Medical|theosismedical/i);
});
test("after-image label", () => assert.ok((html.match(/AI images are illustrations, not predictions/g) || []).length >= 2));
test("server functions never log image data or upstream text", () => {
  for (const src of fns) for (const line of src.match(/console\.(log|warn|error|info)\([^;]*\);/g) || []) {
    assert.doesNotMatch(line, /body\.image|inlineData|\.data\b|e\.detail|e\.message|dataUrl/, line.trim().slice(0, 120));
  }
});
test("photo AI stays off on the server unless PHOTO_AI_ENABLED", () => {
  assert.match(fns[0], /PHOTO_AI_ENABLED/); assert.match(fns[1], /PHOTO_AI_ENABLED/);
  assert.doesNotMatch(readFileSync(new URL("../netlify.toml", import.meta.url), "utf8"), /PHOTO_AI_ENABLED\s*=\s*"?(1|true)/);
});
