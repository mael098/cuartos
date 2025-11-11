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
import { RoomId } from "@/app/store";
import { ThresholdSettings } from "@/components/threshold-settings";
import { roomsStore } from "@/app/store";
import { useStoreValue } from "@simplestack/store/react";

type SettingsDialogProps = {
  id: RoomId;
};
export function SettingsDialog({ id }: SettingsDialogProps) {
  const room = useStoreValue(roomsStore.select(id)!.select!('name'))!
    return (<Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">
                  Configurar Umbrales - {room}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Define las temperaturas para cada velocidad del ventilador
                </DialogDescription>
              </DialogHeader>
              <ThresholdSettings
                id={id}
              />
            </DialogContent>
          </Dialog>)
}