import { SerialPort, ReadlineParser } from "serialport";
import { randomUUID, UUID } from "node:crypto";
import { Mode } from "./prisma/generated/enums";

const portName = "COM4";

export const port = new SerialPort({
    path: portName,
    baudRate: 9600,
});

type CommandMap = {
    get_temp: { params: [], data: [number, number, number] };
    set_low: { params: [], data: void };
    set_medium: { params: [], data: void };
    set_high: { params: [], data: void };
    set_mode: { params: [Mode], data: void };
    get_mode: { params: [], data: Mode };
};
type CommandName = keyof CommandMap;
type CommandData<T extends CommandName> = CommandMap[T]['data'];
type CommandResponse<T extends string> = T extends CommandName
    ? { event: T; id: UUID; data: CommandMap[T]['data'] }
    : { event: string; id: UUID; data: unknown };

function sendCommand(command: CommandName, id: string, ...params: any[]) {
    port.write(`${JSON.stringify({ event: command, id, params })}\n`);
}

export const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

port.on("error", (err) => {
    console.error("Error:", err.message);
});

port.on("open", () => {
    console.log(`Conectado al puerto ${portName}`);
});

export function requestSerial<T extends CommandName>(
    command: T,
    ...params: CommandMap[T]['params']
) {
    const { promise, reject, resolve } =
        Promise.withResolvers<CommandData<T>>();

    const id = randomUUID();
    sendCommand(command, id, ...params);

    const listener = (chunk: string) => {
        try {
            const data: CommandResponse<T> = JSON.parse(chunk);
            if (data.event !== command || data.id !== id) return;
            resolve(data.data as CommandData<T>);
            parser.removeListener("data", listener);
        } catch (error) {
            console.error("Error parsing data:", error);
            reject(new Error("Failed to get temperature"));
        }
    };

    parser.on("data", listener);
    setTimeout(() => {
        reject(new Error("Time end"));
        parser.removeListener("data", listener);
    }, 3_000);

    return promise;
}
