"use client"

import { useState, useEffect } from "react"
import { RoomCard } from "@/components/room-card"

export type RoomData = {
  id: string
  name: string
  currentTemp: number
  isOn: boolean
  mode: "manual" | "auto"
  fanSpeed: number
  thresholds: {
    low: number
    medium: number
    high: number
  }
  history: Array<{ time: string; temp: number }>
}

const initialRooms: RoomData[] = [
  {
    id: "room-1",
    name: "Habitación Principal",
    currentTemp: 24,
    isOn: true,
    mode: "auto",
    fanSpeed: 2,
    thresholds: { low: 22, medium: 25, high: 28 },
    history: [
      { time: "00:00", temp: 22 },
      { time: "04:00", temp: 21 },
      { time: "08:00", temp: 23 },
      { time: "12:00", temp: 25 },
      { time: "16:00", temp: 26 },
      { time: "20:00", temp: 24 },
    ],
  },
  {
    id: "room-2",
    name: "Sala de Estar",
    currentTemp: 26,
    isOn: true,
    mode: "manual",
    fanSpeed: 3,
    thresholds: { low: 23, medium: 26, high: 29 },
    history: [
      { time: "00:00", temp: 24 },
      { time: "04:00", temp: 23 },
      { time: "08:00", temp: 25 },
      { time: "12:00", temp: 27 },
      { time: "16:00", temp: 28 },
      { time: "20:00", temp: 26 },
    ],
  },
  {
    id: "room-3",
    name: "Dormitorio",
    currentTemp: 21,
    isOn: false,
    mode: "auto",
    fanSpeed: 1,
    thresholds: { low: 20, medium: 23, high: 26 },
    history: [
      { time: "00:00", temp: 20 },
      { time: "04:00", temp: 19 },
      { time: "08:00", temp: 21 },
      { time: "12:00", temp: 22 },
      { time: "16:00", temp: 23 },
      { time: "20:00", temp: 21 },
    ],
  },
]

export function TemperatureDashboard() {
  const [rooms, setRooms] = useState<RoomData[]>(initialRooms)

  useEffect(() => {
    const fetchTemperatures = async () => {
      try {
        const response = await fetch('http://localhost:8080/temp')
        const temps = await response.json()
        
        if (Array.isArray(temps) && temps.length >= 3) {
          setRooms((prev) => prev.map((room, index) => ({
            ...room,
            currentTemp: Math.round(temps[index] * 10) / 10
          })))
        }
      } catch (error) {
        console.error('Error fetching temperatures:', error)
      }
    }

    fetchTemperatures()
    const interval = setInterval(fetchTemperatures, 5_000) // Actualiza cada 5 segundos

    return () => clearInterval(interval)
  }, [])

  const updateRoom = (roomId: string, updates: Partial<RoomData>) => {
    setRooms((prev) => prev.map((room) => (room.id === roomId ? { ...room, ...updates } : room)))
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onUpdate={updateRoom} />
      ))}
    </div>
  )
}
