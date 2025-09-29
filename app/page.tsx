import MapWrapper from "./components/MapWrapper";

export default function HomePage() {
  return (
    <main className="space-y-6">
      <section className="prose">
        <h2>Welcome 👋</h2>
        <p>
          This is a minimal Next.js + React Leaflet starter. It loads a basemap,
          a sample GeoJSON polygon, and a choropleth-ready style function. Swap the data in <code>/public/data</code>
          and start building.
        </p>
      </section>
      <MapWrapper />
    </main>
  );
}
