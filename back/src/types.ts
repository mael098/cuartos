import type { UUID } from "crypto";
import type { Mode } from "./prisma/generated/enums";

export type CommandMap = {
    get_temp: { params: [], data: [room1: number, room2: number, room3: number] };
    set_speed: { params: [speed: 0 | 1 | 2 | 3], data: null };
    set_thresholds: { params: [low: number, medium: number, high: number], data: null };
    set_mode: { params: [Mode], data: null };
    get_mode: { params: [], data: Mode };
    get_speed: { params: [], data: 0 | 1 | 2 | 3 };
    get_thresholds: { params: [], data: [low: number, medium: number, high: number] };
}
export type CommandName = keyof CommandMap;
export type CommandData<T extends CommandName> = CommandMap[T]['data'];
export type CommandParams<T extends CommandName> = CommandMap[T]['params'];
export type CommandResponse<T extends string> = T extends CommandName
    ? { event: T; id: UUID; data: CommandMap[T]['data'] }
    : { event: string; id: UUID; data: unknown };