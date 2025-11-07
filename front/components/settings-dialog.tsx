'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/Dialog";
import { Button } from "@/components/button";
import { SettingsIcon } from "lucide-react";
import type { RoomData } from "@/components/temperature-dashboard";
import { ThresholdSettings } from "@/components/threshold-settings";

type SettingsDialogProps = {
  room: RoomData;
  onUpdate: (roomId: string, updates: Partial<RoomData>) => void;
};
export function SettingsDialog({ room, onUpdate }: SettingsDialogProps) {
    const handleThresholdsUpdate = (thresholds: RoomData["thresholds"]) => {
    onUpdate(room.id, { thresholds });
  };
    return (<Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background">
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
          </Dialog>)
}