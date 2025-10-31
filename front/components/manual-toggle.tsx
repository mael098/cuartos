import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Fan } from "lucide-react";
import { Button } from "./button";
import { RoomData } from "./temperature-dashboard";

interface Props {
  room: RoomData;
  onUpdate: (roomId: string, updates: Partial<RoomData>) => void;
}
export function ManualToggle({ room, onUpdate }: Props) {
  const handleSpeedChange = (speed: number) => {
    onUpdate(room.id, { fanSpeed: speed });
  };
  return (
    <Tabs className="TabsRoot" defaultValue="tab1">
      <TabsList className="TabsList bg-background" aria-label="Manage your account">
        <TabsTrigger className="TabsTrigger bg-background" value="tab1">
          Automático
        </TabsTrigger>
        <TabsTrigger className="TabsTrigger bg-background" value="tab2">
          Manual
        </TabsTrigger>
      </TabsList>
      <TabsContent className="TabsContent" value="tab1">
        <div className="rounded-lg bg-accent/10 border border-accent/30 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Fan className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-accent">
              Modo Automático Activo
            </span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>• Velocidad 1: &lt; {room.thresholds.low}°C</p>
            <p>
              • Velocidad 2: {room.thresholds.low}°C - {room.thresholds.medium}
              °C
            </p>
            <p>• Velocidad 3: &gt; {room.thresholds.medium}°C</p>
          </div>
        </div>
      </TabsContent>
      <TabsContent className="TabsContent" value="tab2">
        <div className="rounded-lg bg-secondary/30 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-card-foreground">
              Velocidad Manual
            </label>
            <div className="flex items-center gap-2">
              <Fan className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-card-foreground">
                Nivel {room.fanSpeed}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((speed) => (
              <Button
                key={speed}
                variant={room.fanSpeed === speed ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => handleSpeedChange(speed)}
              >
                {speed}
              </Button>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
