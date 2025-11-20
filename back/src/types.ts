import type { UUID } from "crypto";
import type { Mode } from "./prisma/generated/enums";

type Speed = number;
type Thresholds = [low: number, medium: number, high: number];
export type CommandMap = {
  get_temp: { params: []; data: [room1: number, room2: number, room3: number] };
  set_speed: { params: [room1: Speed, room2: Speed, room3: Speed]; data: null };
  set_thresholds: {
    params: [room1: Thresholds, room2: Thresholds, room3: Thresholds];
    data: null;
  };
  set_mode: { params: [room1: Mode, room2: Mode, room3: Mode]; data: null };
  get_mode: { params: []; data: [room1: Mode, room2: Mode, room3: Mode] };
  get_speed: { params: []; data: [room1: Speed, room2: Speed, room3: Speed] };
  get_thresholds: {
    params: [];
    data: [room1: Thresholds, room2: Thresholds, room3: Thresholds];
  };
};
export type CommandName = keyof CommandMap;
export type CommandData<T extends CommandName> = CommandMap[T]["data"];
export type CommandParams<T extends CommandName> = CommandMap[T]["params"];
export type CommandResponse<T extends string = ""> = T extends CommandName
  ? { event: T; id: UUID; data: CommandMap[T]["data"] }
  : { event: string; id: UUID; data: unknown };
