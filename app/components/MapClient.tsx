"use client";

import dynamic from "next/dynamic";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { useEffect, useMemo, useState } from "react";
import { colorFromValue } from "../(maps)/color";
import Legend from "./Legend";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const GeoJSONLayer = dynamic(() => import("react-leaflet").then(m => m.GeoJSON), { ssr: false });

type Props = {
  dataUrl?: string;
};

export default function MapClient({ dataUrl = "/data/edmonton.geojson.json" }: Props) {
  const [data, setData] = useState<FeatureCollection<Geometry, any> | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetch(dataUrl).then(r => r.json()).then(setData).catch(console.error);
  }, [dataUrl]);

  const styleFn = useMemo(() => (feature: Feature) => ({
    weight: 1,
    color: "#111827",
    fillOpacity: 0.6,
    fillColor: colorFromValue(feature.properties?.score ?? null),
  }), []);

  const tileUrl = process.env.NEXT_PUBLIC_TILE_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attribution = process.env.NEXT_PUBLIC_TILE_ATTRIBUTION || "© OpenStreetMap contributors";

  const position: [number, number] = [53.5461, -113.4938];

  if (!isClient) {
    return <div className="h-[70vh] w-full flex items-center justify-center">Loading map...</div>;
  }

  return (
    <div className="h-[70vh] w-full">
      <MapContainer 
        center={position} 
        zoom={11} 
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
        whenReady={() => {
          // Force a resize after the map is ready to fix tile rendering
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, 100);
        }}
      >
        <TileLayer 
          url={tileUrl} 
          attribution={attribution}
          tileSize={256}
          zoomOffset={0}
        />
        {data && (
          <GeoJSONLayer
            key="edm-geojson"
            data={data as any}
            style={styleFn as any}
            onEachFeature={(feature, layer) => {
              const name = feature.properties?.name ?? "Area";
              const value = feature.properties?.score ?? "n/a";
              layer.bindTooltip(`<div class='text-sm font-medium'>${name}</div><div class='text-xs text-gray-600'>score: ${value}</div>`, { sticky: true });
            }}
          />
        )}
      </MapContainer>
      <Legend />
    </div>
  );
}
