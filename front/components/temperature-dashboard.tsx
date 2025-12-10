"use client"

import { useEffect } from "react"
import { RoomCard } from "@/components/room-card"
import { ROOM_KEYS, roomsStore } from "@/app/store"
import { refreshTemperatures, syncStateFromBackend } from "@/lib/backend"

export function TemperatureDashboard() {
  useEffect(() => {
    const fetchTemperatures = async () => {
      try {
        await syncStateFromBackend()
      } catch (error) {
        console.error('Error fetching temperatures:', error)
      }
    }

    fetchTemperatures()
    const interval = setInterval(refreshTemperatures, 5_000) // Actualiza cada 5 segundos

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    roomsStore.subscribe((store) => {
      localStorage.setItem('rooms', JSON.stringify(store))
    })
    const storedRooms = localStorage.getItem('rooms')
    if (storedRooms) {
      roomsStore.set(JSON.parse(storedRooms))
    }
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {(Object.values(ROOM_KEYS)).map((room) => (
        <RoomCard key={room} id={room} />
      ))}
    </div>
  )
}
