"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { ThermometerIcon } from "lucide-react";
import { TemperatureChart } from "@/components/temperature-chart";
import { ManualToggle } from "./manual-toggle";
import { SettingsDialog } from "./settings-dialog";
import { RoomId, roomsStore } from "@/app/store";
import { useStoreValue } from "@simplestack/store/react";

type RoomCardProps = {
  id: RoomId;
};

export function RoomCard({ id }: RoomCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        {/* Current Temperature */}
        <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/20 p-2">
              <ThermometerIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <RoomName id={id} />
              <CurrentTemp id={id} />
            </div>
          </div>
          <SettingsDialog id={id} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Temperature Chart */}
        <div className="rounded-lg bg-foreground/10 p-3">
          <p className="text-xs text-foreground mb-2">
            Historial (últimas 24h)
          </p>
          <TemperatureChart id={id} />
        </div>

        {/* Controls */}
        <div className="space-y-3 pt-2">
          {/* Power Switch */}
          <div className="flex items-center justify-between rounded-lg p-3">
            <ManualToggle id={id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CurrentTemp({ id }: { id: RoomId }) {
  const currentTemp = useStoreValue(
    roomsStore.select(id)!.select!("currentTemp")
  )!;
  return (
    <p className="text-2xl font-bold text-card-foreground">{currentTemp}°C</p>
  );
}

function RoomName({ id }: { id: RoomId }) {
  const name = useStoreValue(roomsStore.select(id)!.select!("name"))!;
  return <CardTitle className="text-lg text-card-foreground">{name}</CardTitle>;
}
