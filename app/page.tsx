import { ClaimLab, MobilityLab, ScenarioLab } from "./ScenarioLab";
import EuropeEvidenceMap from "./EuropeEvidenceMap";

const sources = [
  { n: 1, title: "The North Atlantic Treaty", org: "NATO · official text · 1949", href: "https://www.nato.int/en/about-us/official-texts-and-resources/official-texts/1949/04/04/the-north-atlantic-treaty" },
  { n: 2, title: "Collective defence and Article 5", org: "NATO · topic page · checked 16 Aug 2026", href: "https://www.nato.int/en/what-we-do/introduction-to-nato/collective-defence-and-article-5" },
  { n: 3, title: "Consensus decision-making at NATO", org: "NATO · topic page", href: "https://www.nato.int/en/what-we-do/introduction-to-nato/consensus-decision-making-at-nato" },
  { n: 4, title: "Special report 04/2025: EU military mobility", org: "European Court of Auditors · DOI 10.2865/5248734", href: "https://www.eca.europa.eu/en/publications/sr-2025-04" },
  { n: 5, title: "11 military-mobility projects completed", org: "CINEA · 19 Nov 2025", href: "https://cinea.ec.europa.eu/news-events/news/11-military-mobility-projects-successfully-completed-across-8-eu-member-states-2025-11-19_en" },
  { n: 6, title: "Security and defence implementation tracker", org: "European Commission · updated 25 Jun 2026", href: "https://commission.europa.eu/priorities-2024-2029/security-and-defence/implementation-tracker_en" },
  { n: 7, title: "Operational Plan for Germany", org: "Bundeswehr · public overview", href: "https://www.bundeswehr.de/en/organization/bundeswehr-joint-force-command/missions/operational-plan-for-germany" },
  { n: 8, title: "2026 NATO Summit in Ankara", org: "NATO · official overview · 7–8 Jul 2026", href: "https://www.nato.int/en/news-and-events/events/2026/07/overview---2026-nato-summit-in-ankara-" },
  { n: 9, title: "Allied Command Operations", org: "NATO · command structure · updated 14 Jul 2026", href: "https://www.nato.int/en/about-us/organization/nato-structure/allied-command-operations-aco" },
  { n: 10, title: "Red Storm Bravo: Bundeswehr exercise 2025", org: "Bundeswehr · public exercise overview · 24 Jul 2025", href: "https://www.bundeswehr.de/de/organisation/operatives-fuehrungskommando-der-bundeswehr/landeskommando/hamburg/red-storm-bravo" },
  { n: 11, title: "About Rail Baltica", org: "RB Rail AS · official implementing-body overview", href: "https://www.railbaltica.org/about-rail-baltica/" },
  { n: 12, title: "Lithuania's shelter network and crisis readiness", org: "Lithuanian Ministry of the Interior · updated 17 Apr 2026", href: "https://vrm.lrv.lt/en/news/lithuania-seeks-to-learn-from-finland-focus-on-shelter-network-and-crisis-readiness-yrW2/" },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top"><span>A5</span><strong>Article Five Lab</strong></a>
        <nav aria-label="Primary navigation"><a href="#scenario">Scenario</a><a href="#law">Decision</a><a href="#mobility">Mobility</a><a href="#map">Map</a><a href="#claims">Claim lab</a><a href="#sources">Sources</a></nav>
        <p>Evidence brief · 16 Aug 2026</p>
      </header>

      <section className="hero" id="top">
        <div className="hero-kicker"><span>Geopolitical systems explorer</span><span>Public evidence only</span></div>
        <h1>What happens if Russia attacks <em>NATO territory?</em></h1>
        <div className="hero-grid"><p className="lede">There is no single switch marked “Article 5.” An attack would set two coupled systems in motion: a political–legal process to classify and coordinate the response, and a physical system to move people, equipment and support.</p><aside><strong>Not a war predictor.</strong><p>This lab explains public institutions, decision points and logistics. It does not model targets, tactics, classified plans or who would “win.”</p></aside></div>
      </section>

      <section className="finding-strip" aria-label="Key findings"><div><span>32</span><p>NATO Allies in the current official membership count</p></div><div><span>1×</span><p>Article 5 action in NATO history: after 11 September 2001</p></div><div><span>95</span><p>EU-funded dual-use military-mobility projects in 21 member states</p></div><div><span>€1.7bn</span><p>Dedicated 2021–2027 EU mobility budget, already allocated</p></div></section>

      <ScenarioLab />

      <section className="essay-section" id="law">
        <div className="section-label"><span>01</span><p>Political–legal system</p></div>
        <div className="essay-copy"><p className="eyebrow">What the treaty actually does</p><h2>Obligation is automatic.<br /><em>Response is not uniform.</em></h2><p className="standfirst">NATO’s current explainer identifies two conditions: an Ally sustains an armed attack, and that Ally requests or consents to collective action. Article 4 consultation is available, but it is neither a required precondition nor a synonym for Article 5.</p><div className="legal-grid"><article><span>Attack</span><h3>National defence need not wait.</h3><p>The attacked state retains its right of individual self-defence under Article 51 of the UN Charter. Bilateral help and defensive measures can begin while Allies assess the facts.</p></article><article><span>Alliance</span><h3>The Council coordinates by consensus.</h3><p>NATO decisions express the collective will of all Allies; consensus means there is no vote. The attacked Ally identifies needs and offers of assistance are coordinated.</p></article><article><span>Allies</span><h3>Assistance can differ.</h3><p>Each Ally must assist but chooses the action it deems necessary. That may include armed force, but the treaty does not prescribe one identical contribution.</p></article><article><span>Constitutions</span><h3>National procedures still matter.</h3><p>Article 11 recognises constitutional processes. Parliamentary approval or consultation may shape how a specific Ally fulfils its obligation.</p></article></div><p className="citation-line">Evidence: NATO treaty and current Article 5 guidance <a href="#source-1">[1]</a> <a href="#source-2">[2]</a> <a href="#source-3">[3]</a></p></div>
      </section>

      <section className="two-system-section">
        <div><p className="eyebrow">Working thesis</p><h2>The response is governed by two clocks, not one countdown.</h2></div>
        <div className="clock-diagram" aria-label="Two coupled systems"><article><span>Clock A</span><h3>Classification &amp; consent</h3><p>Effects → attribution → attacked Ally’s request → Allied assessment → consensus coordination</p><i /></article><b>⇄</b><article><span>Clock B</span><h3>Movement &amp; sustainment</h3><p>Readiness → permissions → ports and rail → bridges and roads → fuel, repair and medical support</p><i /></article></div>
        <p className="thesis-note"><strong>New synthesis, not a measured law:</strong> the sources support treating legal coordination and military mobility as coupled constraints. They do not provide a public formula for converting them into a response time.</p>
      </section>

      <MobilityLab />

      <EuropeEvidenceMap />

      <section className="evidence-section">
        <div className="section-label"><span>04</span><p>What public evidence establishes</p></div>
        <div className="evidence-ledger"><article><span>Observed</span><strong>95 projects</strong><p>EU funding covered dual-use transport projects in 21 member states. The full dedicated budget was allocated.</p></article><article><span>Observed</span><strong>11 completed</strong><p>CINEA reported the first 11 projects completed across eight member states by 19 November 2025.</p></article><article><span>Audited</span><strong>Goal not achieved</strong><p>The ECA concluded swift and seamless movement at short notice and large scale had not yet been achieved.</p></article><article><span>Proposed</span><strong>“Military Schengen”</strong><p>The Commission proposed a new mobility regulation in November 2025; its June 2026 tracker still lists the legislative part as proposed.</p></article><article><span>Public plan scale</span><strong>800k + 200k</strong><p>Germany says up to 800,000 Allied troops and 200,000 vehicles may need transit and host-nation support within six months.</p></article><article className="not-measured"><span>Not measured</span><strong>No public victory clock</strong><p>These figures do not establish a classified route, exact wartime transit time, battle outcome or probability of escalation.</p></article></div>
      </section>

      <ClaimLab />

      <section className="boundary-section" id="limits"><p className="eyebrow">Read the boundary first</p><h2>This is a process model,<br />not a conflict simulation.</h2><div className="boundary-grid"><div><h3>Included</h3><ul><li>Published treaty obligations</li><li>Official NATO decision procedures</li><li>Audited EU mobility evidence</li><li>Publicly stated German planning scale</li><li>Explicit uncertainty and evidence status</li></ul></div><div><h3>Excluded</h3><ul><li>Classified plans or routes</li><li>Targets, tactics or weapons effects</li><li>Invented probabilities or response times</li><li>Claims about automatic war declarations</li><li>Predictions of victory, defeat or nuclear use</li></ul></div></div></section>

      <section className="methods-section"><div><p className="eyebrow">Method</p><h2>How this brief was built.</h2></div><ol><li><span>01</span><p><strong>Bound the question.</strong> Explain institutions and publicly documented logistics, not operational outcomes.</p></li><li><span>02</span><p><strong>Use lead registers carefully.</strong> The supplied research brief and Drive source collection helped locate material; every displayed claim was then checked against the linked primary source.</p></li><li><span>03</span><p><strong>Separate statuses.</strong> Observed, audited, proposed, inferred and unknown are never presented as interchangeable.</p></li><li><span>04</span><p><strong>Re-check time-sensitive pages.</strong> Sources and current institutional status checked 16 August 2026.</p></li></ol></section>

      <section className="sources-section" id="sources"><div className="sources-head"><p className="eyebrow">Primary source register</p><h2>Read the evidence yourself.</h2><p>Links open the official source. No NATO insignia or restricted operational material is reproduced.</p></div><div className="source-list">{sources.map((source) => <a id={`source-${source.n}`} key={source.n} href={source.href} target="_blank" rel="noreferrer"><span>{String(source.n).padStart(2,"0")}</span><div><strong>{source.title}</strong><small>{source.org}</small></div><b aria-hidden="true">↗</b></a>)}</div></section>

      <footer><a className="brand" href="#top"><span>A5</span><strong>Article Five Lab</strong></a><p>Independent evidence explainer · No affiliation with NATO, the EU or any government.</p><p>Research cut-off: 16 August 2026</p></footer>
    </main>
  );
}
