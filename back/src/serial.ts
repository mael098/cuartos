import { SerialPort, ReadlineParser } from "serialport";
import { randomUUID, type UUID } from "node:crypto";
import type {
  CommandData,
  CommandMap,
  CommandName,
  CommandResponse,
} from "./types";

const portName = "COM4";

export const port = new SerialPort({
  path: portName,
  baudRate: 9600,
});

function sendCommand(command: CommandName, id: UUID, ...params: any[]) {
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
  ...params: CommandMap[T]["params"]
) {
  const { promise, reject, resolve } = Promise.withResolvers<CommandData<T>>();

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
  const error = new Error("Time end");
  setTimeout(() => {
    parser.removeListener("data", listener);
    reject(error);
  }, 3_000);

  return promise;
}
