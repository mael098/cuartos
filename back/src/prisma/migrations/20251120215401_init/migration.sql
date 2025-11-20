-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mode" TEXT NOT NULL DEFAULT 'manual',
    "name" TEXT NOT NULL,
    "speed" INTEGER NOT NULL DEFAULT 0,
    "low" INTEGER NOT NULL DEFAULT 20,
    "medium" INTEGER NOT NULL DEFAULT 25,
    "high" INTEGER NOT NULL DEFAULT 30
);

-- CreateTable
CREATE TABLE "history" (
    "room_id" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "temp" INTEGER NOT NULL,

    PRIMARY KEY ("room_id", "date"),
    CONSTRAINT "history_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_name_key" ON "rooms"("name");
