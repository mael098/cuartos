import { EventEmitter } from "node:events";
import { parser, requestSerial } from "./serial.ts";
import { db } from "./prisma/db.ts";
import { Mode } from "./prisma/generated/enums.ts";
import { CronJob } from "cron";

const rooms_id = { ROOM1: "room1", ROOM2: "room2", ROOM3: "room3" };
type Events = {
  ready: [];
};
const job = new CronJob(
  "0 0 * * *",
  async function () {
    const [temp1, temp2, temp3] = await requestSerial("get_temp");
    db.history.createMany({
      data: [
        { temp: temp1, date: new Date(), room_id: rooms_id.ROOM1 },
        { temp: temp2, date: new Date(), room_id: rooms_id.ROOM2 },
        { temp: temp3, date: new Date(), room_id: rooms_id.ROOM3 },
      ],
    });
  },
  null,
  true,
  "America/Monterrey"
);
const client = new EventEmitter<Events>();
function listener(chunk: string) {
  const message = JSON.parse(chunk);
  client.emit(message.event, ...message.data);
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
  requestSerial(
    "set_mode",
    room1?.mode || Mode.manual,
    room2?.mode || Mode.manual,
    room3?.mode || Mode.manual
  );
  requestSerial(
    "set_speed",
    room1?.speed || 0,
    room2?.speed || 0,
    room3?.speed || 0
  );
  if (room1 && room2 && room3)
    requestSerial(
      "set_thresholds",
      [room1.low, room1.medium, room1.high],
      [room2.low, room2.medium, room2.high],
      [room3.low, room3.medium, room3.high]
    );
});
