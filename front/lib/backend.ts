import {
  FAN_MODES,
  ROOM_KEYS,
  RoomId,
  roomsStore,
  updateAllTemperatures,
} from "@/app/store";
import type { FanMode } from "@/app/store";

type ThresholdTuple = [low: number, medium: number, high: number];
const ROOM_ORDER: RoomId[] = [
  ROOM_KEYS.ROOM1,
  ROOM_KEYS.ROOM2,
  ROOM_KEYS.ROOM3,
];
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function roomIndex(id: RoomId) {
  return ROOM_ORDER.indexOf(id);
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchTemperatures() {
  return getJson<[number, number, number]>("/temp");
}

export async function fetchModes() {
  return getJson<FanMode[]>("/mode");
}

export async function fetchSpeeds() {
  return getJson<number[]>("/speed");
}

export async function fetchThresholds() {
  return getJson<ThresholdTuple[]>("/thresholds");
}

export async function syncStateFromBackend() {
  const [temps, modes, speeds, thresholds] = await Promise.all([
    fetchTemperatures(),
    fetchModes(),
    fetchSpeeds(),
    fetchThresholds(),
  ]);

  updateAllTemperatures(temps);

  ROOM_ORDER.forEach((roomId, index) => {
    const thresholdsTuple = thresholds[index];
    roomsStore.select(roomId)!.select!("mode").set(
      modes[index] ?? FAN_MODES.MANUAL
    );
    roomsStore.select(roomId)!.select!("fanSpeed").set(speeds[index] ?? 0);
    roomsStore.select(roomId)!.select!("thresholds").set({
      low: thresholdsTuple?.[0] ?? 20,
      medium: thresholdsTuple?.[1] ?? 25,
      high: thresholdsTuple?.[2] ?? 30,
    });
  });

  return { temps, modes, speeds, thresholds };
}

export async function setRoomMode(id: RoomId, mode: FanMode) {
  const modes = await fetchModes();
  modes[roomIndex(id)] = mode;
  await postJson<null>("/mode", modes);
  roomsStore.select(id)!.select!("mode").set(mode);
}

export async function setRoomSpeed(id: RoomId, speed: number) {
  const speeds = await fetchSpeeds();
  speeds[roomIndex(id)] = speed;
  await postJson<null>("/speed", speeds);
  roomsStore.select(id)!.select!("fanSpeed").set(speed);
}

export async function setRoomThresholds(
  id: RoomId,
  thresholds: { low: number; medium: number; high: number }
) {
  const current = await fetchThresholds();
  current[roomIndex(id)] = [thresholds.low, thresholds.medium, thresholds.high];
  await postJson<null>("/thresholds", current);
  roomsStore.select(id)!.select!("thresholds").set(thresholds);
}

export async function refreshTemperatures() {
  const temps = await fetchTemperatures();
  updateAllTemperatures(temps);
  return temps;
}
