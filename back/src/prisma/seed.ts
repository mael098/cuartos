import { writeFile } from "node:fs";
import { rooms_id } from "../constants.ts";
import { db } from "./db.ts";

type SimulatedReading = {
  room_id: string;
  date: Date;
  temp: number;
};

export function generate_simulated_data(room_id: string): SimulatedReading[] {
  const start = new Date(2025, 0, 1, 0, 0, 0);
  const end = new Date(2025, 11, 15, 23, 0, 0);

  const data: SimulatedReading[] = [];

  const min_temp = 10;
  const max_temp = 35;
  const mid = (min_temp + max_temp) / 2;
  const amp = (max_temp - min_temp) / 2;

  const shifted_peak_month = 4;
  const phase = (shifted_peak_month / 12) * 2 * Math.PI;

  const annual_temp = (date: Date) => {
    const day_of_year = Math.floor(
      (date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const t = (day_of_year / 365) * 2 * Math.PI;

    return mid + amp * Math.sin(t - phase);
  };

  for (
    let d = new Date(start.getTime());
    d <= end;
    d = new Date(d.getTime() + 60 * 60 * 1000)
  ) {
    const base = annual_temp(d);

    const hour = d.getHours();
    const daily = Math.sin((hour / 24) * Math.PI * 2) * 1.5;

    const noise = (Math.random() - 0.5) * 2;

    const temp = base + daily + noise;

    data.push({
      room_id,
      date: new Date(d),
      temp: parseFloat(temp.toFixed(2)),
    });
  }

  return data;
}

console.table(generate_simulated_data(rooms_id.ROOM1));
writeFile(
  "datos.json",
  JSON.stringify(generate_simulated_data(rooms_id.ROOM1)),
  (err) => {
    console.log(err);
  }
);

await db.history.createMany({
  data: [
    ...generate_simulated_data(rooms_id.ROOM1),
    ...generate_simulated_data(rooms_id.ROOM2),
    ...generate_simulated_data(rooms_id.ROOM3),
  ],
});
