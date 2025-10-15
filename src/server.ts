import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Config } from "./config";
import { generateSimpleRoom, generateStrongRoom } from "./utils";
import { NewRoomSchema } from "./schemas/newRoomSchema";
import { type Room } from "./ts/room";

const app = express();

app.use(express.json());

const activeRooms = new Map<string, Room>();

app.post("/api/rooms", (req, res) => {
  const body = NewRoomSchema.parse(req.body);

  let room: string;
  if (!body.room_id) {
    switch (body.generate_variant) {
      case "simple":
        room = generateSimpleRoom(2);
        break;
      case "strong":
        room = generateStrongRoom(2, 5);
        break;
      default:
        room = generateSimpleRoom(2);
        break;
    }
  } else {
    room = body.room_id;
  }

  const expiresAt = Date.now() + body.duration_hours * 60 * 60 * 1000;

  activeRooms.set(room, {
    created: Date.now(),
    expires: expiresAt,
    hits: 0,
  });

  setTimeout(
    () => {
      activeRooms.delete(room);
    },
    body.duration_hours * 60 * 60 * 1000,
  );

  res.json({
    success: true,
    room_id: room,
    url: Config.service.publicUrl + room,
    expires_at: new Date(expiresAt).toISOString(),
  });
});

app.get("/api/rooms", (req, res) => {
  const rooms = Array.from(activeRooms.entries()).map(([id, data]) => ({
    room_id: id,
    created: new Date(data.created).toISOString(),
    expires: new Date(data.expires).toISOString(),
    hits: data.hits,
  }));

  res.json({ active_rooms: rooms.length, rooms });
});

app.delete("/api/rooms/:room_id", (req, res) => {
  const { room_id } = req.params;

  if (activeRooms.has(room_id)) {
    activeRooms.delete(room_id);
    res.json({ success: true, message: "Room deleted" });
  } else {
    res.status(404).json({ error: "Room not found" });
  }
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    active_rooms: activeRooms.size,
  });
});

app.get("/auth/:room_id", (req, res) => {
  const { room_id } = req.params;

  if (activeRooms.has(room_id)) {
    const room = activeRooms.get(room_id)!;
    room.hits++;
    res.status(200).send("OK");
  } else {
    res.status(403).send("Forbidden");
  }
});

const PORT = Config.app.port;
app.listen(PORT, () => {
  console.log(`Whitelist service is listening on port ${PORT}`);
});
