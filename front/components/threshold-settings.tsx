"use client"

import { SimpleInput } from "@/components/inputs"
import { Button } from "@/components/button"
import { RoomId, roomsStore } from "@/app/store"
import { useStoreValue } from "@simplestack/store/react"

type ThresholdSettingsProps = {
  id: RoomId
}

export function ThresholdSettings({ id }: ThresholdSettingsProps) {
  const thresholds = useStoreValue(roomsStore.select(id)!.select!('thresholds'))!

  const handleSave = () => {
    roomsStore.select(id)!.select!('thresholds').set(thresholds)
  }

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label htmlFor="low" className="text-card-foreground">
          Velocidad 1 (Baja) - Hasta:
        </label>
        <div className="flex items-center gap-2">
          <SimpleInput
            id="low"
            type="number"
            value={thresholds.low}
            onChange={(e) =>
              roomsStore.select(id)!.select!('thresholds').select!('low').set(Number(e.target.value))
            }
            className="bg-secondary"
          />
          <span className="text-muted-foreground">°C</span>
        </div>
        <p className="text-xs text-muted-foreground">
          El ventilador funcionará a velocidad baja cuando la temperatura esté por debajo de este valor
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="medium" className="text-card-foreground">
          Velocidad 2 (Media) - Hasta:
        </label>
        <div className="flex items-center gap-2">
          <SimpleInput
            id="medium"
            type="number"
            value={thresholds.medium}
            onChange={(e) =>
              roomsStore.select(id)!.select!('thresholds').select!('medium').set(Number(e.target.value))
            }
            className="bg-secondary"
          />
          <span className="text-muted-foreground">°C</span>
        </div>
        <p className="text-xs text-muted-foreground">
          El ventilador funcionará a velocidad media entre {thresholds.low}°C y este valor
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="high" className="text-card-foreground">
          Velocidad 3 (Alta) - Desde:
        </label>
        <div className="flex items-center gap-2">
          <SimpleInput
            id="high"
            type="number"
            value={thresholds.high}
            onChange={(e) =>
              roomsStore.select(id)!.select!('thresholds').select!('high').set(Number(e.target.value))
            }
            className="bg-secondary"
          />
          <span className="text-muted-foreground">°C</span>
        </div>
        <p className="text-xs text-muted-foreground">
          El ventilador funcionará a velocidad alta cuando la temperatura supere {thresholds.medium}°C
        </p>
      </div>

      <Button onClick={handleSave} className="w-full">
        Guardar Configuración
      </Button>
    </div>
  )
}
