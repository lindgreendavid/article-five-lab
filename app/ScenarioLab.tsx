"use client";

import { useMemo, useState } from "react";

const incidents = [
  { id: "conventional", label: "Conventional strike", threshold: "Armed-attack case strongly supported", note: "An overt state attack on Allied territory is the clearest Article 5 case. National self-defence, attribution and urgent Alliance consultation can run in parallel.", confidence: 4 },
  { id: "cyber", label: "Major cyberattack", threshold: "Threshold assessed case by case", note: "NATO says a significant cyberattack may amount to an armed attack. Effects, scale and attribution matter; no public automatic threshold exists.", confidence: 2 },
  { id: "sabotage", label: "Covert sabotage", threshold: "Attribution and effects are pivotal", note: "A covert incident may prompt investigation, resilience measures, bilateral support or Article 4 consultation without necessarily meeting Article 5’s threshold.", confidence: 1 },
  { id: "space", label: "Attack involving space", threshold: "Potential Article 5 case", note: "Allies have stated that attacks to, from or within space may reach the armed-attack threshold, but assessment remains case by case.", confidence: 2 },
];

const mobilityLayers = [
  { id: "permission", label: "Border permissions", status: "Governance bottleneck", fact: "The ECA found fragmented governance and administrative barriers. The Commission’s November 2025 legislative package remains listed as proposed in the June 2026 implementation tracker.", tags: ["Rules", "Customs", "Cross-border"] },
  { id: "infrastructure", label: "Bridges & roads", status: "Physical constraint", fact: "Civilian infrastructure may not meet military weight, height or loading requirements. EU grants co-finance dual-use upgrades rather than proving an entire corridor is ready.", tags: ["Load", "Clearance", "Capacity"] },
  { id: "intermodal", label: "Ports & rail", status: "Transfer constraint", fact: "Moving at scale depends on ports, rail terminals, airports and transloading between modes. A funded project count does not measure end-to-end throughput.", tags: ["Port", "Rail", "Transfer"] },
  { id: "resilience", label: "Cyber & sabotage", status: "Resilience constraint", fact: "Transport, communications and energy systems are civilian–military dependencies. Public sources establish the category of risk, not an attack plan or probability.", tags: ["Networks", "Energy", "Repair"] },
  { id: "support", label: "Host-nation support", status: "Sustainment constraint", fact: "Germany’s public OPLAN overview includes traffic management, fuel, maintenance, accommodation, medical care and legal support—many provided with civilian partners.", tags: ["Fuel", "Medical", "Maintenance"] },
];

const claims = [
  { claim: "Article 5 automatically declares war.", verdict: "False", explanation: "The treaty creates a duty to assist. It does not use the phrase “declare war,” and assistance may or may not involve armed force." },
  { claim: "Every Ally must make the same military response.", verdict: "False", explanation: "Each Ally chooses the action it deems necessary, subject to consultation, coordination and its constitutional processes." },
  { claim: "Article 4 must happen before Article 5.", verdict: "False", explanation: "NATO’s current guidance explicitly says Article 4 consultation is not a necessary precondition for Article 5 action." },
  { claim: "Cyber or space attacks can never trigger Article 5.", verdict: "False", explanation: "NATO says significant cyber or hybrid attacks, and attacks to, from or within space, may qualify case by case." },
  { claim: "€1.7 billion and 95 projects prove Europe can reinforce without delay.", verdict: "Unsupported", explanation: "The ECA found that swift and seamless movement had not yet been achieved. Inputs and projects are not end-to-end readiness measures." },
];

export function ScenarioLab() {
  const [incidentId, setIncidentId] = useState(incidents[0].id);
  const [attribution, setAttribution] = useState<"clear" | "contested">("clear");
  const [request, setRequest] = useState<"yes" | "no">("yes");
  const selected = incidents.find((incident) => incident.id === incidentId) ?? incidents[0];
  const assessment = useMemo(() => {
    if (request === "no") return { label: "No collective action requested", body: "NATO’s current guidance says the attacked Ally must request or consent to collective action. National, bilateral and consultative avenues remain available." };
    if (attribution === "contested" && incidentId !== "conventional") return { label: "Classification remains open", body: "Contested attribution weakens any deterministic pathway. Investigation, resilience and consultation may dominate before an Article 5 determination." };
    return { label: selected.threshold, body: selected.note };
  }, [attribution, incidentId, request, selected]);

  return <section className="lab" id="scenario">
    <div className="lab-controls"><p className="eyebrow">Interactive process map</p><h2>Change the incident.<br />Watch the pathway change.</h2><fieldset><legend>Incident type</legend><div className="incident-list">{incidents.map((incident) => <button key={incident.id} type="button" aria-pressed={incidentId === incident.id} onClick={() => setIncidentId(incident.id)}><span>{incident.label}</span><small>{incident.threshold}</small></button>)}</div></fieldset><div className="mini-controls"><fieldset><legend>Attribution</legend><div className="segmented">{(["clear","contested"] as const).map((value)=><button type="button" key={value} aria-pressed={attribution===value} onClick={()=>setAttribution(value)}>{value}</button>)}</div></fieldset><fieldset><legend>Attacked Ally requests/consents</legend><div className="segmented">{(["yes","no"] as const).map((value)=><button type="button" key={value} aria-pressed={request===value} onClick={()=>setRequest(value)}>{value}</button>)}</div></fieldset></div></div>
    <div className="process-stage" aria-live="polite">
      <div className="stage-head"><span>Evidence-led assessment</span><strong>{assessment.label}</strong><p>{assessment.body}</p></div>
      <ol className="process-line">
        <li className="active"><span>01</span><div><strong>Detect &amp; attribute</strong><small>Effects, source and international element</small></div></li>
        <li className={request === "yes" ? "active" : "muted"}><span>02</span><div><strong>Defend &amp; consult</strong><small>National action; Article 4 is available</small></div></li>
        <li className={request === "yes" ? "active" : "muted"}><span>03</span><div><strong>Assess Article 5</strong><small>Armed attack + Ally request or consent</small></div></li>
        <li className={request === "yes" ? "active" : "muted"}><span>04</span><div><strong>Coordinate assistance</strong><small>Consensus; each Ally determines its action</small></div></li>
        <li className={request === "yes" ? "active" : "muted"}><span>05</span><div><strong>Sustain &amp; reinforce</strong><small>Ports, rail, roads, borders and resilience</small></div></li>
      </ol>
      <div className="uncertainty"><span>Public confidence that this incident is an obvious armed-attack case</span><div>{[1,2,3,4].map((step)=><i key={step} className={step <= selected.confidence && attribution === "clear" ? "filled" : ""} />)}</div><small>Illustrative evidence classification—not a probability.</small></div>
    </div>
  </section>;
}

export function MobilityLab() {
  const [layerId, setLayerId] = useState(mobilityLayers[0].id);
  const layer = mobilityLayers.find((item) => item.id === layerId) ?? mobilityLayers[0];
  return <section className="mobility-section" id="mobility"><div className="section-label light"><span>02</span><p>Physical mobility system</p></div><div className="mobility-intro"><p className="eyebrow">Bottleneck explorer</p><h2>Money funds nodes.<br /><em>Readiness depends on the chain.</em></h2><p>Select a layer to inspect why a transport network is only as usable as its permissions, infrastructure, transfer capacity, resilience and support.</p></div><div className="mobility-lab"><div className="layer-buttons">{mobilityLayers.map((item)=><button key={item.id} type="button" aria-pressed={layerId===item.id} onClick={()=>setLayerId(item.id)}><span>{item.label}</span><small>{item.status}</small></button>)}</div><div className={`corridor-map layer-${layer.id}`} aria-live="polite"><div className="map-line"><i className="node port">P</i><b /><i className="node rail">R</i><b /><i className="node border">B</i><b /><i className="node road">D</i><b /><i className="node support">S</i></div><div className="map-labels"><span>Port</span><span>Rail</span><span>Border</span><span>Road</span><span>Support</span></div><article><span>{layer.status}</span><h3>{layer.label}</h3><p>{layer.fact}</p><ul>{layer.tags.map((tag)=><li key={tag}>{tag}</li>)}</ul></article></div></div><p className="citation-line dark">Evidence: ECA audit, CINEA completion notice, Commission tracker and Bundeswehr overview <a href="#source-4">[4]</a> <a href="#source-5">[5]</a> <a href="#source-6">[6]</a> <a href="#source-7">[7]</a></p></section>;
}

export function ClaimLab() {
  const [open, setOpen] = useState(0);
  return <section className="claim-section" id="claims"><div className="section-label"><span>06</span><p>Claim audit</p></div><div className="claim-layout"><div><p className="eyebrow">Test the headline</p><h2>Five claims.<br />Three kinds of error.</h2><p>Click each claim to compare familiar language with what the public record actually supports.</p></div><div className="claim-list">{claims.map((item,index)=><article key={item.claim} className={open===index?"open":""}><button type="button" aria-expanded={open===index} onClick={()=>setOpen(index)}><span>{item.claim}</span><b>{item.verdict}</b></button>{open===index?<p>{item.explanation}</p>:null}</article>)}</div></div></section>;
}
