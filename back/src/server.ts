import { requestSerial } from "./serial.ts";
import Express from "express";
import type { Request, Response } from "express";
import type { CommandName, CommandParams } from "./types.ts";
import "./sync.ts";
import cors from "cors";
import { db } from "./prisma/db.ts";
import { Temporal } from "@js-temporal/polyfill";
import { createSession } from "better-sse";

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
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to command", cause: `${error}` });
    }
  };
}

app.get("/temp", handle("get_temp"));

app.get("/mode", handle("get_mode"));
app.get("/speed", handle("get_speed"));
app.get("/thresholds", handle("get_thresholds"));

app.post("/mode", handle("set_mode"));
app.post("/speed", handle("set_speed"));
app.post("/thresholds", handle("set_thresholds"));

app.get("/history", async (req, res) => {
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
