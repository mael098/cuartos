import { requestSerial } from "./serial.ts";
import Express from "express";
import type { Request, Response } from "express";
import type { CommandData, CommandName, CommandParams } from "./types.ts";
import "./sync.ts";
import cors from "cors";
import { db } from "./prisma/db.ts";
import { Temporal } from "@js-temporal/polyfill";
import { createSession } from "better-sse";
import { rooms_id } from "./constants.ts";

const PORT = 8080;

const app = Express();

app.use(Express.json());
app.use(
  cors({
    origin: process.env.FRONT_ORIGIN,
  })
);

function handle<T extends CommandName>(command: T) {
  return async (req: Request<{}, {}, CommandParams<T>>, res: Response) => {
    try {
      const body = req.body ?? [];
      res.json(await requestSerial(command, ...body));
    } catch (error1) {
      try {
        res.json(await fromDB(command));
      } catch (error2) {
        console.error(error1);
        console.error(error2);
        res.status(500).json({ error: "Failed to command" });
      }
    }
    try {
      await handleDB(command, ...(req.body ?? []));
    } catch (error) {
      console.error("Error handling DB operation");
      console.error(error);
    }
  };
}

app.get("/temp", handle("get_temp"));

app.get("/mode", handle("get_mode"));
app.get("/speed", handle("get_speed"));
app.get("/threshold", handle("get_threshold"));

app.post("/mode", handle("set_mode"));
app.post("/speed", handle("set_speed"));
app.post("/threshold", handle("set_threshold"));

app.get("/history", async (_, res) => {
  const limit_hour = Temporal.Now.plainDateTimeISO()
    .with({
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    })
    .subtract({
      months: 1,
    })
    .toZonedDateTime("America/Monterrey").epochMilliseconds;
  const history = await db.history.findMany({
    where: {
      date: {
        gte: new Date(limit_hour),
      },
    },
  });
  res.json(history);
});

app.post("/query", async (req, res) => {
  try {
    res.json(await db.history.findMany(req.body));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to query history", cause: `${error}` });
  }
});

app.get("/rt", async (req, res) => {
  const session = await createSession(req, res);

  const interval = setInterval(async () => {
    session.push(await requestSerial("get_temp"));
  }, 1_000);

  session.once("disconnected", () => {
    clearInterval(interval);
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

async function handleDB<T extends CommandName>(
  command: T,
  ...params: CommandParams<T>
) {
  // -------------
  // Set Mode
  // -------------
  if (command == "set_mode") {
    const [mode1, mode2, mode3] = params as CommandParams<"set_mode">;
    try {
      await db.room.update({
        where: { id: rooms_id.ROOM1 },
        data: { mode: mode1 },
      });
    } catch {}
    try {
      await db.room.update({
        where: { id: rooms_id.ROOM2 },
        data: { mode: mode2 },
      });
    } catch {}
    try {
      await db.room.update({
        where: { id: rooms_id.ROOM3 },
        data: { mode: mode3 },
      });
    } catch {}
  }
  // -------------
  // Set Speed
  // -------------
  if (command == "set_speed") {
    const [speed1, speed2, speed3] = params as CommandParams<"set_speed">;
    try {
      await db.room.update({
        where: { id: rooms_id.ROOM1 },
        data: { speed: speed1 },
      });
    } catch {}
    try {
      await db.room.update({
        where: { id: rooms_id.ROOM2 },
        data: { speed: speed2 },
      });
    } catch {}
    try {
      await db.room.update({
        where: { id: rooms_id.ROOM3 },
        data: { speed: speed3 },
      });
    } catch {}
  }
  // -------------
  // Set Threshold
  // -------------
  if (command == "set_threshold") {
    const [
      [low1, medium1, high1],
      [low2, medium2, high2],
      [low3, medium3, high3],
    ] = params as CommandParams<"set_threshold">;
    try {
      await db.room.update({
        where: { id: rooms_id.ROOM1 },
        data: { low: low1, medium: medium1, high: high1 },
      });
    } catch {}
    try {
      await db.room.update({
        where: { id: rooms_id.ROOM2 },
        data: { low: low2, medium: medium2, high: high2 },
      });
    } catch {}
    try {
      await db.room.update({
        where: { id: rooms_id.ROOM3 },
        data: { low: low3, medium: medium3, high: high3 },
      });
    } catch {}
  }
}

async function fromDB<T extends CommandName>(
  command: T
): Promise<CommandData<T>> {
  // -------------
  // Get Mode
  // -------------
  if (command == "get_mode") {
    const rooms = await db.room.findMany({
      select: {
        id: true,
        mode: true,
      },
    });
    const modes = rooms
      .map((r) => ({ ...r, n: +r.id.substring(r.id.length - 1) }))
      .sort((a, b) => a.n - b.n)
      .map((r) => r.mode);
    return modes as CommandData<T>;
  }
  // -------------
  // Get Speed
  // -------------
  if (command == "get_speed") {
    const rooms = await db.room.findMany({
      select: {
        id: true,
        speed: true,
      },
    });
    const modes = rooms
      .map((r) => ({ ...r, n: +r.id.substring(r.id.length - 1) }))
      .sort((a, b) => a.n - b.n)
      .map((r) => r.speed);
    return modes as CommandData<T>;
  }
  // -------------
  // Get Threshold
  // -------------
  if (command == "get_threshold") {
    const rooms = await db.room.findMany({
      select: {
        id: true,
        low: true,
        medium: true,
        high: true,
      },
    });
    const modes = rooms
      .map((r) => ({ ...r, n: +r.id.substring(r.id.length - 1) }))
      .sort((a, b) => a.n - b.n)
      .map((r) => [r.low, r.medium, r.high]);
    return modes as CommandData<T>;
  }
  return [0, 0, 0];
}
