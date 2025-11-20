import { requestSerial } from "./serial.ts";
import Express from "express";
import type { Request, Response } from "express";
import type { CommandName, CommandParams } from "./types.ts";
import "./sync.ts";

const PORT = 8080;

const app = Express();

app.use(Express.json());

function handle<T extends CommandName>(command: T) {
  return async (req: Request<{}, {}, CommandParams<T>>, res: Response) => {
    try {
      const body = req.body ?? [];
      res.json(await requestSerial(command, ...body));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to set mode" });
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
