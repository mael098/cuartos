"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { ThermometerIcon } from "lucide-react";
import { TemperatureChart } from "@/components/temperature-chart";
import type { RoomData } from "@/components/temperature-dashboard";
import { ManualToggle } from "./manual-toggle";
import { SettingsDialog } from './settings-dialog'

type RoomCardProps = {
  room: RoomData;
  onUpdate: (roomId: string, updates: Partial<RoomData>) => void;
};

export function RoomCard({ room, onUpdate }: RoomCardProps) {
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
              <CardTitle className="text-lg text-card-foreground">
                {room.name}
              </CardTitle>
              <p className="text-2xl font-bold text-card-foreground">
                {room.currentTemp}°C
              </p>
            </div>
          </div>
          <SettingsDialog onUpdate={onUpdate} room={room} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Temperature Chart */}
        <div className="rounded-lg bg-foreground/10 p-3">
          <p className="text-xs text-foreground mb-2">
            Historial (últimas 24h)
          </p>
          <TemperatureChart data={room.history} />
        </div>

        {/* Controls */}
        <div className="space-y-3 pt-2">
          {/* Power Switch */}
          <div className="flex items-center justify-between rounded-lg p-3">
            <ManualToggle room={room} onUpdate={onUpdate} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
