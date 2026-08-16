"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import atlas from "world-atlas/countries-110m.json";

type Layer = "decision" | "mobility" | "resilience";

type Marker = {
  id: string;
  layer: Layer;
  label: string;
  place: string;
  lon: number;
  lat: number;
  status: string;
  evidence: string;
  source: number;
};

const bounds = { west: -12, east: 32, south: 35, north: 72 };

const markers: Marker[] = [
  { id: "nac", layer: "decision", label: "Political authority", place: "Brussels, Belgium", lon: 4.35, lat: 50.85, status: "Alliance decision layer", evidence: "The North Atlantic Council expresses the collective political will of the Allies. NATO decisions are made by consensus, not by majority vote.", source: 3 },
  { id: "shape", layer: "decision", label: "Military command", place: "Mons, Belgium", lon: 3.95, lat: 50.45, status: "Planning and execution layer", evidence: "Allied Command Operations at SHAPE plans and executes Alliance operations under NATO's political authority. This does not remove national decisions over forces and assistance.", source: 9 },
  { id: "hamburg", layer: "mobility", label: "Civil–military rehearsal", place: "Hamburg, Germany", lon: 9.99, lat: 53.55, status: "Public exercise evidence", evidence: "Red Storm Bravo rehearsed cooperation among the Bundeswehr, emergency services, authorities and civilian companies in a fictional reinforcement scenario in September 2025.", source: 10 },
  { id: "germany", layer: "mobility", label: "Host-nation support", place: "Germany · national scale", lon: 11.2, lat: 51.1, status: "Public planning scale", evidence: "Germany's public operational-plan overview frames transit as a system of traffic management, fuel, repair, medical, accommodation and legal support—not merely a route on a map.", source: 7 },
  { id: "rail-baltica", layer: "mobility", label: "Rail interoperability", place: "Kaunas, Lithuania", lon: 23.90, lat: 54.90, status: "Dual-use infrastructure", evidence: "Rail Baltica is intended to connect the Baltic states to Europe's 1,435 mm standard-gauge network. The implementing body describes the existing 1,520 mm system as a technical and logistical barrier.", source: 11 },
  { id: "shelters", layer: "resilience", label: "Civil protection", place: "Lithuania · national scale", lon: 25.28, lat: 54.69, status: "Population resilience", evidence: "Lithuania's Interior Ministry reported 6,513 shelters covering about 1.6 million people, or roughly 56% of the population, while modernization continues. Capacity is not the same as readiness or accessibility.", source: 12 },
];

const layerCopy: Record<Layer, { label: string; title: string; body: string }> = {
  decision: { label: "Decision", title: "Authority is distributed.", body: "Political consent, military planning and national implementation are connected, but they are not one institution or one automatic command." },
  mobility: { label: "Mobility", title: "A corridor is a chain.", body: "Public evidence identifies hubs, exercises and interoperability projects. It does not disclose an operational reinforcement route." },
  resilience: { label: "Resilience", title: "Civil protection is part of the system.", body: "Shelters, emergency services, transport operators and communications affect how societies absorb and recover from disruption." },
};

function project(lon: number, lat: number) {
  return {
    x: ((lon - bounds.west) / (bounds.east - bounds.west)) * 100,
    y: ((bounds.north - lat) / (bounds.north - bounds.south)) * 100,
  };
}

export default function EuropeEvidenceMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [layer, setLayer] = useState<Layer>("decision");
  const visible = useMemo(() => markers.filter((marker) => marker.layer === layer), [layer]);
  const [selectedId, setSelectedId] = useState(visible[0].id);
  const selected = visible.find((marker) => marker.id === selectedId) ?? visible[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      const context = canvas.getContext("2d");
      if (!context) return;
      context.scale(ratio, ratio);
      context.clearRect(0, 0, rect.width, rect.height);
      context.fillStyle = "#071c2a";
      context.fillRect(0, 0, rect.width, rect.height);

      const collection = feature(
        atlas as never,
        (atlas as unknown as { objects: { countries: never } }).objects.countries,
      ) as unknown as { features: Array<{ geometry: { type: string; coordinates: unknown } }> };

      const point = (coordinate: number[]) => ({
        x: ((coordinate[0] - bounds.west) / (bounds.east - bounds.west)) * rect.width,
        y: ((bounds.north - coordinate[1]) / (bounds.north - bounds.south)) * rect.height,
      });

      const ring = (coordinates: number[][]) => {
        coordinates.forEach((coordinate, index) => {
          const p = point(coordinate);
          if (index === 0) context.moveTo(p.x, p.y);
          else context.lineTo(p.x, p.y);
        });
        context.closePath();
      };

      context.beginPath();
      collection.features.forEach(({ geometry }) => {
        if (geometry.type === "Polygon") {
          (geometry.coordinates as number[][][]).forEach(ring);
        } else if (geometry.type === "MultiPolygon") {
          (geometry.coordinates as number[][][][]).forEach((polygon) => polygon.forEach(ring));
        }
      });
      context.fillStyle = "#0d3143";
      context.fill("evenodd");
      context.strokeStyle = "rgba(180, 218, 231, .28)";
      context.lineWidth = 0.8;
      context.stroke();

      context.strokeStyle = "rgba(76, 151, 255, .16)";
      context.lineWidth = 1;
      for (let x = 0; x <= rect.width; x += rect.width / 8) {
        context.beginPath(); context.moveTo(x, 0); context.lineTo(x, rect.height); context.stroke();
      }
      for (let y = 0; y <= rect.height; y += rect.height / 6) {
        context.beginPath(); context.moveTo(0, y); context.lineTo(rect.width, y); context.stroke();
      }
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="map-section" id="map">
      <div className="section-label light"><span>03</span><p>Public systems geography</p></div>
      <div className="map-heading">
        <div><p className="eyebrow">Interactive evidence map</p><h2>See the system.<br /><em>Do not mistake it for a route.</em></h2></div>
        <p>This map locates public institutions and illustrative evidence. It deliberately excludes precise infrastructure, targets, force positions and operational paths.</p>
      </div>
      <div className="map-lab">
        <div className="map-tabs" role="group" aria-label="Evidence layer">
          {(Object.keys(layerCopy) as Layer[]).map((key) => <button type="button" key={key} aria-pressed={layer === key} onClick={() => { setLayer(key); setSelectedId(markers.find((marker) => marker.layer === key)?.id ?? selectedId); }}>{layerCopy[key].label}</button>)}
        </div>
        <div className="map-grid">
          <div className="europe-map" aria-label="Simplified map of Europe with selectable public-evidence locations">
            <canvas ref={canvasRef} aria-hidden="true" />
            {visible.map((marker) => {
              const position = project(marker.lon, marker.lat);
              return <button className="map-marker" style={{ left: `${position.x}%`, top: `${position.y}%` }} type="button" key={marker.id} aria-pressed={selected.id === marker.id} aria-label={`${marker.label}, ${marker.place}`} onClick={() => setSelectedId(marker.id)}><span />{marker.label}</button>;
            })}
            <p className="map-boundary">Geographic context only · no operational routes</p>
          </div>
          <aside className="map-detail" aria-live="polite">
            <span>{selected.status}</span><h3>{selected.label}</h3><strong>{selected.place}</strong><p>{selected.evidence}</p><a href={`#source-${selected.source}`}>Read primary source [{selected.source}]</a>
            <div><small>{layerCopy[layer].label} layer</small><h4>{layerCopy[layer].title}</h4><p>{layerCopy[layer].body}</p></div>
          </aside>
        </div>
      </div>
    </section>
  );
}
