"use client"

import { useEffect } from "react"
import { RoomCard } from "@/components/room-card"
import { ROOM_KEYS, roomsStore, updateAllTemperatures } from "@/app/store"

export function TemperatureDashboard() {
  useEffect(() => {
    const fetchTemperatures = async () => {
      try {
        const response = await fetch('http://localhost:8080/temp')
        const temps = await response.json()
        
        updateAllTemperatures(temps)
      } catch (error) {
        console.error('Error fetching temperatures:', error)
      }
    }

    fetchTemperatures()
    const interval = setInterval(fetchTemperatures, 5_000) // Actualiza cada 5 segundos

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    roomsStore.subscribe((store) => {
      localStorage.setItem('rooms', JSON.stringify(store))
    })
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
