import { EventEmitter } from "node:events";
import { parser, requestSerial } from "./serial.ts";
import { db } from "./prisma/db.ts";
import { Mode } from "./prisma/generated/enums.ts";
import { CronJob } from "cron";
import { rooms_id } from "./constants.ts";

type Events = {
  ready: [];
};
const job = new CronJob(
  "0 0 * * *",
  async function () {
    try {
      const [temp1, temp2, temp3] = await requestSerial("get_temp");
      await db.history.createMany({
        data: [
          { temp: temp1, date: new Date(), room_id: rooms_id.ROOM1 },
          { temp: temp2, date: new Date(), room_id: rooms_id.ROOM2 },
          { temp: temp3, date: new Date(), room_id: rooms_id.ROOM3 },
        ],
      });
    } catch (error) {
      console.error("Error logging temperatures");
      console.error(error);
    }
  },
  null,
  true,
  "America/Monterrey"
);
const client = new EventEmitter<Events>();
function listener(chunk: string) {
  const message = JSON.parse(chunk);
  client.emit(message.event, ...(message.data ?? []));
}

parser.on("data", listener);

client.on("ready", async () => {
  const room1 = await db.room.findUnique({
    where: { name: rooms_id.ROOM1 },
  });
  const room2 = await db.room.findUnique({
    where: { name: rooms_id.ROOM2 },
  });
  const room3 = await db.room.findUnique({
    where: { name: rooms_id.ROOM3 },
  });
  try {
    await requestSerial(
      "set_mode",
      room1?.mode || Mode.manual,
      room2?.mode || Mode.manual,
      room3?.mode || Mode.manual
    );
  } catch (error) {
    console.error("Error setting mode on ready");
    console.error(error);
  }
  try {
    await requestSerial(
      "set_speed",
      room1?.speed || 0,
      room2?.speed || 0,
      room3?.speed || 0
    );
  } catch (error) {
    console.error("Error setting speed on ready");
    console.error(error);
  }
  try {
    if (room1 && room2 && room3)
      await requestSerial(
        "set_thresholds",
        [room1.low, room1.medium, room1.high],
        [room2.low, room2.medium, room2.high],
        [room3.low, room3.medium, room3.high]
      );
  } catch (error) {
    console.error("Error setting thresholds on ready");
    console.error(error);
  }
});
