"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import atlas from "world-atlas/countries-110m.json";

type IncidentId = "conventional" | "air" | "cyber" | "hybrid";
type RegionId = "baltic" | "north" | "central" | "black-sea";

type Scenario = {
  id: IncidentId;
  label: string;
  short: string;
  color: string;
  phases: Array<{ title: string; action: string; boundary: string; sources: number[] }>;
};

const scenarios: Scenario[] = [
  {
    id: "conventional", label: "Overt conventional attack", short: "Armed-attack case strongly supported", color: "#ff6757",
    phases: [
      { title: "Detect and defend", action: "The attacked state may act in individual self-defence immediately while facts and needs are shared with Allies.", boundary: "The model does not infer force movements, targets or battle outcomes.", sources: [1, 2] },
      { title: "Request or consent", action: "NATO's public Article 5 guidance identifies the attacked Ally's request or consent as a condition for collective action.", boundary: "Article 4 consultation is available but is not a mandatory prerequisite.", sources: [2] },
      { title: "Assess and decide", action: "The North Atlantic Council assesses the armed-attack case and coordinates by consensus; NATO has no public automatic trigger procedure.", boundary: "Consensus is not the same as identical national action.", sources: [2, 3] },
      { title: "Generate assistance", action: "Each Ally determines the action it deems necessary. The NATO Force Model organises national forces across readiness tiers.", boundary: "Readiness categories are not promises that a specific force will appear at a specific place or time.", sources: [1, 13] },
      { title: "Move, sustain, recover", action: "Permissions, ports, rail, roads, fuel, repair, medical support and resilient civilian services become coupled constraints.", boundary: "Public infrastructure evidence does not reveal an operational route or exact response time.", sources: [4, 7, 16] },
    ],
  },
  {
    id: "air", label: "Air or missile attack", short: "Defence functions already operate 24/7", color: "#ff9f68",
    phases: [
      { title: "Surveil and warn", action: "NATO's public IAMD policy describes persistent surveillance, detection, tracking and warning from peacetime through conflict.", boundary: "This view does not reproduce sensor coverage, trajectories or interception geometry.", sources: [14] },
      { title: "Protect nationally and collectively", action: "National and NATO command structures can employ active and passive defensive functions while political assessment proceeds.", boundary: "No weapon performance or interception probability is modelled.", sources: [14] },
      { title: "Classify the armed attack", action: "Allies assess the event and the attacked Ally's request or consent; the treaty pathway remains political and legal as well as military.", boundary: "A displayed sequence is not a guaranteed real-world timetable.", sources: [2, 3] },
      { title: "Adapt defensive posture", action: "The public policy describes a tailored, flexible and resilient air and missile defence posture across peacetime, crisis and conflict.", boundary: "The site does not identify protected assets, unit locations or response rules.", sources: [14] },
      { title: "Maintain continuity", action: "Passive protection, redundancy, warning and resilient civilian services aim to reduce consequences and preserve essential functions.", boundary: "Reducing consequences is not equivalent to eliminating harm.", sources: [14, 16] },
    ],
  },
  {
    id: "cyber", label: "Significant cyberattack", short: "Effects and attribution assessed case by case", color: "#c76dff",
    phases: [
      { title: "Contain and investigate", action: "National authorities lead incident response while technical information and indicators can be shared among Allied cyber defenders.", boundary: "No exploit, vulnerability or offensive cyber technique is represented.", sources: [15] },
      { title: "Request technical support", action: "NATO's public cyber guidance describes voluntary assistance and rapid-reaction support when requested and approved.", boundary: "Availability and approval are not automatic.", sources: [15] },
      { title: "Assess cumulative effects", action: "Significant malicious cyber activity may in certain circumstances be considered an armed attack, case by case.", boundary: "There is no public numeric threshold that this interface can calculate.", sources: [2, 15] },
      { title: "Coordinate the toolbox", action: "Political, diplomatic, technical and potentially military responses may be coordinated; each Ally retains national choices.", boundary: "The visualization does not recommend retaliation or escalation.", sources: [1, 15] },
      { title: "Restore resilient services", action: "Recovery depends on networks, energy, communications, government continuity and private-sector cooperation.", boundary: "Service recovery times and cascading failures are unknown here.", sources: [15, 16] },
    ],
  },
  {
    id: "hybrid", label: "Covert sabotage campaign", short: "Attribution and cumulative effects are pivotal", color: "#ffd36a",
    phases: [
      { title: "Detect a pattern", action: "The targeted country leads the response while intelligence, law enforcement and infrastructure operators establish whether incidents are connected.", boundary: "Individual incidents are not automatically attributed to a state actor.", sources: [17] },
      { title: "Protect essential services", action: "National resilience measures focus on government continuity, services to the population and civil support to the military.", boundary: "Nominal capacity does not prove operational performance under stress.", sources: [16] },
      { title: "Consult and attribute", action: "Allies may consult and share information; NATO states that hybrid actions could lead to an Article 5 decision.", boundary: "Could lead is not the same as automatically triggers.", sources: [2, 17] },
      { title: "Provide tailored support", action: "Public NATO guidance describes counter-hybrid support teams and other assistance at an Ally's request.", boundary: "The content and timing of a real support package are scenario-dependent.", sources: [17] },
      { title: "Recover and learn", action: "Repair, redundancy, public communication and institutional learning aim to reduce repeat disruption.", boundary: "This is a resilience cycle, not a claim that every attack can be prevented.", sources: [16, 17] },
    ],
  },
];

const regions = [
  { id: "baltic" as RegionId, label: "Baltic region", lon: 24.2, lat: 56.4 },
  { id: "north" as RegionId, label: "High North", lon: 21.0, lat: 68.3 },
  { id: "central" as RegionId, label: "Central Europe", lon: 15.0, lat: 50.8 },
  { id: "black-sea" as RegionId, label: "Black Sea region", lon: 27.5, lat: 44.8 },
];

const institutions = [
  { label: "NAC", sub: "political", lon: 4.35, lat: 50.85, phase: 2, labelX: -66, labelY: -25 },
  { label: "SHAPE", sub: "command", lon: 3.95, lat: 50.45, phase: 2, labelX: 13, labelY: 24 },
  { label: "AIRCOM", sub: "air defence", lon: 7.60, lat: 49.44, phase: 1, labelX: 12, labelY: -17, only: "air" as IncidentId },
  { label: "HOST", sub: "support", lon: 10.45, lat: 51.10, phase: 3, labelX: 12, labelY: -15 },
];

const visualGrammar: Record<IncidentId, string> = {
  conventional: "Staged assistance dependencies",
  air: "Surveillance and defensive layers",
  cyber: "Distributed information coordination",
  hybrid: "Pattern detection under uncertainty",
};

const countries = feature(
  atlas as never,
  (atlas as unknown as { objects: { countries: never } }).objects.countries,
) as unknown as { features: Array<{ geometry: { type: string; coordinates: unknown } }> };

const bounds = { west: -13, east: 34, south: 34, north: 72 };

function project(lon: number, lat: number, width: number, height: number) {
  return { x: ((lon - bounds.west) / (bounds.east - bounds.west)) * width, y: ((bounds.north - lat) / (bounds.north - bounds.south)) * height };
}

export default function ResponseTheatre() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [incidentId, setIncidentId] = useState<IncidentId>("conventional");
  const [regionId, setRegionId] = useState<RegionId>("baltic");
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [intensity, setIntensity] = useState(2);
  const scenario = scenarios.find((item) => item.id === incidentId) ?? scenarios[0];
  const region = regions.find((item) => item.id === regionId) ?? regions[0];
  const current = scenario.phases[phase];
  const visibleInstitutions = useMemo(() => institutions.filter((item) => !item.only || item.only === incidentId), [incidentId]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setPhase((value) => (value + 1) % 5), 1500);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let animation = 0;

    const draw = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const targetWidth = Math.round(rect.width * ratio);
      const targetHeight = Math.round(rect.height * ratio);
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) { canvas.width = targetWidth; canvas.height = targetHeight; }
      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const width = rect.width;
      const height = rect.height;
      context.clearRect(0, 0, width, height);

      const gradient = context.createRadialGradient(width * .62, height * .42, 0, width * .62, height * .42, width * .72);
      gradient.addColorStop(0, "#123a51"); gradient.addColorStop(.55, "#071f31"); gradient.addColorStop(1, "#020d18");
      context.fillStyle = gradient; context.fillRect(0, 0, width, height);

      context.strokeStyle = "rgba(86,151,186,.12)"; context.lineWidth = 1;
      for (let x = 0; x < width; x += Math.max(44, width / 14)) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
      for (let y = 0; y < height; y += Math.max(44, height / 10)) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }

      const point = (coordinate: number[]) => project(coordinate[0], coordinate[1], width, height);
      const ring = (coordinates: number[][]) => { coordinates.forEach((coordinate, index) => { const p = point(coordinate); if (index === 0) context.moveTo(p.x, p.y); else context.lineTo(p.x, p.y); }); context.closePath(); };
      context.beginPath();
      countries.features.forEach(({ geometry }) => {
        if (geometry.type === "Polygon") (geometry.coordinates as number[][][]).forEach(ring);
        else if (geometry.type === "MultiPolygon") (geometry.coordinates as number[][][][]).forEach((polygon) => polygon.forEach(ring));
      });
      context.fillStyle = "rgba(25,70,86,.82)"; context.fill("evenodd");
      context.strokeStyle = "rgba(183,224,231,.28)"; context.lineWidth = 1; context.stroke();

      const target = project(region.lon, region.lat, width, height);
      const speed = time / 700;
      const maxRadius = 34 + intensity * 13;
      const drawDependency = (start: { x: number; y: number }, index: number, dashed = true) => {
        context.beginPath(); context.moveTo(start.x, start.y);
        context.quadraticCurveTo((start.x + target.x) / 2, Math.min(start.y, target.y) - 28 - index * 10, target.x, target.y);
        context.strokeStyle = "rgba(129,201,255,.68)"; context.lineWidth = 1.5;
        if (dashed) { context.setLineDash([8, 10]); context.lineDashOffset = -frame; }
        context.stroke(); context.setLineDash([]);
      };

      if (incidentId === "conventional") {
        for (let index = 0; index < intensity + 1; index++) {
          const progress = (speed * .16 + index / (intensity + 1)) % 1;
          context.beginPath(); context.arc(target.x, target.y, 10 + progress * maxRadius, 0, Math.PI * 2);
          context.strokeStyle = `${scenario.color}${Math.max(12, Math.round((1 - progress) * 125)).toString(16).padStart(2, "0")}`;
          context.lineWidth = 2.5; context.stroke();
        }
        visibleInstitutions.forEach((node, index) => {
          if (phase >= node.phase) drawDependency(project(node.lon, node.lat, width, height), index);
        });
      }

      if (incidentId === "air") {
        const sweep = (speed * .34) % (Math.PI * 2);
        const radius = maxRadius * 1.5;
        const radar = context.createRadialGradient(target.x, target.y, 0, target.x, target.y, radius);
        radar.addColorStop(0, "rgba(255,159,104,.24)"); radar.addColorStop(1, "rgba(255,159,104,0)");
        context.fillStyle = radar; context.beginPath(); context.moveTo(target.x, target.y); context.arc(target.x, target.y, radius, sweep - .34, sweep); context.closePath(); context.fill();
        for (let layer = 1; layer <= intensity + 1; layer++) {
          context.beginPath(); context.arc(target.x, target.y, 16 + layer * 16, Math.PI * 1.08, Math.PI * 1.92);
          context.strokeStyle = `rgba(255,159,104,${.28 + layer * .08})`; context.lineWidth = 2; context.stroke();
        }
        const aircom = visibleInstitutions.find((node) => node.label === "AIRCOM");
        if (aircom && phase >= aircom.phase) drawDependency(project(aircom.lon, aircom.lat, width, height), 0, false);
      }

      if (incidentId === "cyber") {
        const network = [...visibleInstitutions.map((node) => project(node.lon, node.lat, width, height)), target];
        network.forEach((start, index) => {
          const end = network[(index + 1) % network.length];
          context.beginPath(); context.moveTo(start.x, start.y); context.lineTo(end.x, end.y);
          context.strokeStyle = "rgba(199,109,255,.38)"; context.setLineDash([3, 8]); context.lineDashOffset = frame; context.stroke(); context.setLineDash([]);
          if (index <= phase) {
            const progress = (speed * .22 + index * .19) % 1;
            const x = start.x + (end.x - start.x) * progress; const y = start.y + (end.y - start.y) * progress;
            context.fillStyle = scenario.color; context.fillRect(x - 3, y - 3, 6, 6);
          }
        });
        for (let ringIndex = 0; ringIndex < intensity; ringIndex++) {
          const progress = (speed * .26 + ringIndex / intensity) % 1;
          context.beginPath(); context.rect(target.x - 10 - progress * maxRadius, target.y - 10 - progress * maxRadius, 20 + progress * maxRadius * 2, 20 + progress * maxRadius * 2);
          context.strokeStyle = `rgba(199,109,255,${(1 - progress) * .55})`; context.stroke();
        }
      }

      if (incidentId === "hybrid") {
        const offsets = [[-48,-21],[34,-38],[-21,42],[54,23],[-63,34],[15,-58],[69,-14],[3,65]];
        offsets.slice(0, 3 + intensity + phase).forEach(([dx, dy], index) => {
          const flicker = .45 + Math.sin(speed * 2.1 + index * 2.3) * .22;
          context.beginPath(); context.arc(target.x + dx, target.y + dy, 3 + (index % 3), 0, Math.PI * 2);
          context.fillStyle = `rgba(255,211,106,${flicker})`; context.fill();
          if (phase >= 2) {
            context.beginPath(); context.moveTo(target.x + dx, target.y + dy); context.lineTo(target.x, target.y);
            context.strokeStyle = `rgba(255,211,106,${phase === 2 ? .18 : .34})`; context.setLineDash([2, 8]); context.stroke(); context.setLineDash([]);
          }
        });
        if (phase >= 3) visibleInstitutions.forEach((node, index) => { if (phase >= node.phase) drawDependency(project(node.lon, node.lat, width, height), index); });
      }

      visibleInstitutions.forEach((node) => {
        const active = phase >= node.phase;
        const start = project(node.lon, node.lat, width, height);
        context.beginPath(); context.arc(start.x, start.y, active ? 6 : 4, 0, Math.PI * 2); context.fillStyle = active ? "#b9e8ff" : "#496a7a"; context.fill();
        const labelX = start.x + node.labelX; const labelY = start.y + node.labelY;
        context.strokeStyle = active ? "rgba(185,232,255,.5)" : "rgba(73,106,122,.45)"; context.lineWidth = 1;
        context.beginPath(); context.moveTo(start.x, start.y); context.lineTo(labelX + (node.labelX < 0 ? 54 : -4), labelY + 4); context.stroke();
        context.fillStyle = "rgba(2,13,24,.86)"; context.fillRect(labelX - 5, labelY - 11, 58, 25);
        context.strokeStyle = active ? "rgba(185,232,255,.45)" : "rgba(73,106,122,.35)"; context.strokeRect(labelX - 5, labelY - 11, 58, 25);
        context.fillStyle = active ? "#e8f7ff" : "#6f8a96"; context.font = "700 9px monospace"; context.fillText(node.label, labelX, labelY);
        context.fillStyle = active ? "#8eabb8" : "#526b76"; context.font = "7px monospace"; context.fillText(node.sub.toUpperCase(), labelX, labelY + 9);
      });

      context.beginPath(); context.arc(target.x, target.y, 7 + Math.sin(speed) * 2, 0, Math.PI * 2); context.fillStyle = scenario.color; context.fill();
      context.fillStyle = "#ffffff"; context.font = "700 10px monospace"; context.fillText(region.label.toUpperCase(), target.x + 12, target.y + 4);
      context.fillStyle = "rgba(204,228,238,.55)"; context.font = "9px monospace"; context.fillText("CONCEPTUAL FUNCTIONS · NOT OPERATIONS OR ROUTES", 18, height - 18);
      frame = (frame + .65) % 1000;
      if (!reduceMotion) animation = window.requestAnimationFrame(draw);
    };

    animation = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(animation);
  }, [incidentId, intensity, phase, region, scenario.color, visibleInstitutions]);

  return (
    <section className="theatre-section" id="response-theatre">
      <div className="section-label light"><span>03</span><p>Interactive response theatre</p></div>
      <div className="theatre-heading"><div><p className="eyebrow">Five phases · four incident classes</p><h2>Explore a response.<br /><em>Keep uncertainty visible.</em></h2></div><p>Choose a hypothetical event and step through public defensive functions. The animation changes with the evidence; it never predicts who wins or reproduces a real NATO plan.</p></div>

      <div className="theatre-shell">
        <div className="theatre-controls">
          <fieldset><legend>Incident class</legend>{scenarios.map((item) => <button type="button" key={item.id} aria-pressed={incidentId === item.id} onClick={() => { setIncidentId(item.id); setPhase(0); setPlaying(false); }}><i style={{ background: item.color }} /><span>{item.label}<small>{item.short}</small></span></button>)}</fieldset>
          <fieldset><legend>Illustrative affected region</legend><div className="region-grid">{regions.map((item) => <button type="button" key={item.id} aria-pressed={regionId === item.id} onClick={() => setRegionId(item.id)}>{item.label}</button>)}</div></fieldset>
          <div className="view-controls"><label>Explanatory detail <input aria-label="Explanatory detail" type="range" min="1" max="4" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} /></label><p><span>Visual grammar</span>{visualGrammar[incidentId]}</p></div>
        </div>

        <div className="theatre-stage">
          <div className="theatre-viewport"><div className="theatre-plane"><canvas ref={canvasRef} /></div><div className="theatre-hud"><span>PUBLIC MODEL</span><b>{String(phase + 1).padStart(2, "0")} / 05</b><small>{scenario.label} · {region.label}</small></div><div className={`signal-symbol signal-${incidentId}`} aria-hidden="true"><i /><i /><i /></div></div>
          <div className="phase-timeline" role="group" aria-label="Response phase">{scenario.phases.map((item, index) => <button type="button" key={item.title} aria-pressed={phase === index} onClick={() => { setPhase(index); setPlaying(false); }}><span>{String(index + 1).padStart(2, "0")}</span><small>{item.title}</small></button>)}</div>
          <div className="theatre-readout" aria-live="polite"><div><span>Current public function</span><h3>{current.title}</h3><p>{current.action}</p></div><aside><span>Evidence boundary</span><p>{current.boundary}</p><div>{current.sources.map((source) => <a key={source} href={`#source-${source}`}>[{source}]</a>)}</div></aside></div>
          <button className="play-response" type="button" aria-pressed={playing} onClick={() => setPlaying((value) => !value)}>{playing ? "Pause sequence" : "Play the five-phase sequence"}<span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span></button>
        </div>
      </div>
      <p className="theatre-disclaimer"><strong>Interpretation rule:</strong> rings, scans, packets and pattern links are distinct explanatory symbols for public institutional functions. None represents an attack vector, reinforcement route, target, probability or measured response time.</p>
    </section>
  );
}
