"use client"

import { RoomId, roomsStore } from "@/app/store"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useStoreValue } from "@simplestack/store/react"

type TemperatureChartProps = {
  id: RoomId
}

export function TemperatureChart({ id }: TemperatureChartProps) {
  const history = useStoreValue(roomsStore.select(id)!.select!('history'))!

  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={history}>
        <XAxis dataKey="time" stroke="#ededed" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#ededed"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}°`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-card p-2 shadow-sm">
                  <div className="grid gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Temperatura</span>
                      <span className="font-bold text-card-foreground">{payload[0].value}°C</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line type="monotone" dataKey="temp" stroke="#ededed" strokeWidth={2} dot={true} />
      </LineChart>
    </ResponsiveContainer>
  )
}
