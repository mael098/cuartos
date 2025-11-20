import { store } from "@simplestack/store";

export const ROOM_KEYS = {
    ROOM1: "room-1",
    ROOM2: "room-2",
    ROOM3: "room-3"
} as const

export type RoomId = typeof ROOM_KEYS[keyof typeof ROOM_KEYS]

export const FAN_MODES = {
    AUTO: "auto",
    MANUAL: "manual"
} as const

export type FanMode = typeof FAN_MODES[keyof typeof FAN_MODES]

export type RoomData = {
  id: RoomId
  name: string
  currentTemp: number
  isOn: boolean
  mode: FanMode
  fanSpeed: number
  thresholds: {
    low: number
    medium: number
    high: number
  }
  history: Array<{ time: string; temp: number }>
}

export const roomsStore = store<Record<RoomId, RoomData>>({
  [ROOM_KEYS.ROOM1]:{
    id: ROOM_KEYS.ROOM1,
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
  [ROOM_KEYS.ROOM2]:{
    id: ROOM_KEYS.ROOM2,
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
  [ROOM_KEYS.ROOM3]:{
    id: ROOM_KEYS.ROOM3,
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
});

export function updateAllTemperatures(temps: [number, number, number]) {
  const ids = Object.values(ROOM_KEYS)
  for (let i = 0; i < temps.length; i++) {
    const temp = temps[i];
    const id = ids[i]
    roomsStore.select(id).select?.("currentTemp").set(temp);
  }
}