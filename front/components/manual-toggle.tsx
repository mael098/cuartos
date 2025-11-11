import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Fan } from "lucide-react";
import { Button } from "./button";
import { FAN_MODES, RoomId, roomsStore } from "@/app/store";
import { useStoreValue } from "@simplestack/store/react";

interface Props {
  id: RoomId
}
export function ManualToggle({ id }: Props) {
  const mode = useStoreValue(roomsStore.select(id)!.select!('mode'))!
  return (
    <Tabs className="TabsRoot" defaultValue={mode} >
      <TabsList className="TabsList bg-background" aria-label="Manage your account">
        <TabsTrigger className="TabsTrigger bg-background" value={FAN_MODES.AUTO}>
          Automático
        </TabsTrigger>
        <TabsTrigger className="TabsTrigger bg-background" value={FAN_MODES.MANUAL}>
          Manual
        </TabsTrigger>
      </TabsList>
      <AutoTab id={id} />
      <ManualTab id={id} />
    </Tabs>
  );
}

interface ManualTabProps {
  id: RoomId
}
function ManualTab({ id }: ManualTabProps) {
  const fanSpeed = useStoreValue(roomsStore.select(id)!.select!('fanSpeed'))!

  const handleSpeedChange = (speed: number) => {
    roomsStore.select(id).select?.('fanSpeed').set(speed)
  };

  return (
    <TabsContent className="TabsContent" value={FAN_MODES.MANUAL}>
        <div className="rounded-lg bg-secondary/30 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-card-foreground">
              Velocidad Manual
            </label>
            <div className="flex items-center gap-2">
              <Fan className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-card-foreground">
                Nivel {fanSpeed}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((speed) => (
              <Button
                key={speed}
                variant={fanSpeed === speed ? "default" : "outline"}
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
  )
}

function AutoTab({ id }: ManualTabProps) {
  const thresholds = useStoreValue(roomsStore.select(id)!.select!('thresholds'))!

  return (
    <TabsContent className="TabsContent" value={FAN_MODES.AUTO}>
      <div className="rounded-lg bg-accent/10 border border-accent/30 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Fan className="h-4 w-4 text-accent" />
          <span className="text-xs font-medium text-accent">
            Modo Automático Activo
          </span>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>• Velocidad 1: &lt; {thresholds.low}°C</p>
          <p>
            • Velocidad 2: {thresholds.low}°C - {thresholds.medium}
            °C
          </p>
          <p>• Velocidad 3: &gt; {thresholds.medium}°C</p>
        </div>
      </div>
    </TabsContent>
  )
}