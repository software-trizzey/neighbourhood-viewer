import MapClient from "./components/MapClient";

export default function HomePage() {
  return (
    <main className="min-h-screen p-8 space-y-6">
      <div className="mx-auto max-w-2xl space-y-6">
      <MapClient />
      </div>
    </main>
  );
}
