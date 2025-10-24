"use client"

import { useState } from "react"
import { SimpleInput } from "@/components/inputs"
import { Button } from "@/components/button"
import type { RoomData } from "@/components/temperature-dashboard"

type ThresholdSettingsProps = {
  thresholds: RoomData["thresholds"]
  onUpdate: (thresholds: RoomData["thresholds"]) => void
}

export function ThresholdSettings({ thresholds, onUpdate }: ThresholdSettingsProps) {
  const [localThresholds, setLocalThresholds] = useState(thresholds)

  const handleSave = () => {
    onUpdate(localThresholds)
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
            value={localThresholds.low}
            onChange={(e) =>
              setLocalThresholds({
                ...localThresholds,
                low: Number(e.target.value),
              })
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
            value={localThresholds.medium}
            onChange={(e) =>
              setLocalThresholds({
                ...localThresholds,
                medium: Number(e.target.value),
              })
            }
            className="bg-secondary"
          />
          <span className="text-muted-foreground">°C</span>
        </div>
        <p className="text-xs text-muted-foreground">
          El ventilador funcionará a velocidad media entre {localThresholds.low}°C y este valor
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
            value={localThresholds.high}
            onChange={(e) =>
              setLocalThresholds({
                ...localThresholds,
                high: Number(e.target.value),
              })
            }
            className="bg-secondary"
          />
          <span className="text-muted-foreground">°C</span>
        </div>
        <p className="text-xs text-muted-foreground">
          El ventilador funcionará a velocidad alta cuando la temperatura supere {localThresholds.medium}°C
        </p>
      </div>

      <Button onClick={handleSave} className="w-full">
        Guardar Configuración
      </Button>
    </div>
  )
}
