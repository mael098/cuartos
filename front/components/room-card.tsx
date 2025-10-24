"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Button } from "@/components/button";
import { TemperatureChart } from "@/components/temperature-chart";
import { Thermometer, Settings } from "lucide-react";
import type { RoomData } from "@/components/temperature-dashboard";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/Dialog";
import { ThresholdSettings } from "@/components/threshold-settings";
import { ManualToggle } from "./manual-toggle";

type RoomCardProps = {
  room: RoomData;
  onUpdate: (roomId: string, updates: Partial<RoomData>) => void;
};

export function RoomCard({ room, onUpdate }: RoomCardProps) {
  const handleThresholdsUpdate = (thresholds: RoomData["thresholds"]) => {
    onUpdate(room.id, { thresholds });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        {/* Current Temperature */}
        <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/20 p-2">
              <Thermometer className="h-5 w-5 text-primary" />
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">
                  Configurar Umbrales - {room.name}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Define las temperaturas para cada velocidad del ventilador
                </DialogDescription>
              </DialogHeader>
              <ThresholdSettings
                thresholds={room.thresholds}
                onUpdate={handleThresholdsUpdate}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Temperature Chart */}
        <div className="rounded-lg bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground mb-2">
            Historial (últimas 24h)
          </p>
          <TemperatureChart data={room.history} />
        </div>

        {/* Controls */}
        <div className="space-y-3 pt-2">
          {/* Power Switch */}
          <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-3">
            <ManualToggle room={room} onUpdate={onUpdate} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
