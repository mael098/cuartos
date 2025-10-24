import { TemperatureDashboard } from "@/components/temperature-dashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-card-foreground">Control de Clima</h1>
          <p className="text-muted-foreground mt-2">Monitoreo y control de temperatura en tiempo real</p>
        </div>
        <TemperatureDashboard />
      </div>
    </main>
  );
}
