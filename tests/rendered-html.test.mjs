import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the complete Article Five Lab", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Article Five Lab/);
  assert.match(html, /What happens if Russia attacks/);
  assert.match(html, /Not a war predictor/);
  assert.match(html, /Primary source register/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|react-loading-skeleton/);
});

test("interactive surfaces expose accessible controls and caveats", async () => {
  const [scenario, map, theatre] = await Promise.all([
    readFile(new URL("../app/ScenarioLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/EuropeEvidenceMap.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ResponseTheatre.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(scenario, /aria-pressed/);
  assert.match(scenario, /aria-expanded/);
  assert.match(scenario, /aria-live/);
  assert.match(scenario, /Illustrative evidence classification—not a probability/);
  for (const label of ["Conventional strike", "Major cyberattack", "Covert sabotage", "Attack involving space"]) assert.match(scenario, new RegExp(label));
  assert.match(map, /Geographic context only · no operational routes/);
  assert.match(map, /aria-pressed/);
  assert.match(map, /Decision[\s\S]*Mobility[\s\S]*Resilience/);
  for (const label of ["Overt conventional attack", "Air or missile attack", "Significant cyberattack", "Covert sabotage campaign"]) assert.match(theatre, new RegExp(label));
  assert.match(theatre, /Play the five-phase sequence/);
  assert.match(theatre, /Neither is an attack vector, reinforcement route, target, probability or measured response time/);
  assert.match(theatre, /prefers-reduced-motion/);
});

test("claims preserve key legal and evidentiary boundaries", async () => {
  const [page, scenario, register] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ScenarioLab.tsx", import.meta.url), "utf8"),
    readFile(new URL("../data/evidence-register.json", import.meta.url), "utf8"),
  ]);
  assert.match(page, /Each Ally must assist/);
  assert.match(page, /neither a required precondition/);
  assert.match(page, /not a measured law/);
  assert.match(scenario, /not_supported|No public automatic threshold|does not measure end-to-end throughput/i);
  assert.match(register, /"status": "not_supported"/);
  assert.doesNotMatch(`${page}${scenario}`, /NATO will (?:win|lose)|automatic declaration of war|exact response time/i);
});

test("source register uses primary institutions and a dated cutoff", async () => {
  const [page, register] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../data/evidence-register.json", import.meta.url), "utf8"),
  ]);
  for (const domain of ["nato.int", "eca.europa.eu", "commission.europa.eu", "cinea.ec.europa.eu", "bundeswehr.de", "railbaltica.org", "vrm.lrv.lt"]) assert.match(page, new RegExp(domain.replace(".", "\\.")));
  assert.match(register, /"research_cutoff": "2026-08-16"/);
});

test("starter preview is fully removed", async () => {
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
  assert.doesNotMatch(packageJson, /react-loading-skeleton|site-creator-vinext-starter/);
});
