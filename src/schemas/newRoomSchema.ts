import * as z from "zod";
import { zIntegerParam } from "./shared";

export const NewRoomSchema = z.object({
  room_id: z
    .string({ error: "room_id is incorrect" })
    .min(3, { error: "room_id must contain at least 3 symbols" })
    .trim()
    .optional(),
  generate_variant: z
    .enum(["simple", "strong"], {
      error: "generate_variant must be one of simple,strong",
    })
    .optional()
    .default("simple"),
  generate_simple_sections: zIntegerParam("generate_simple_sections", 1, 8),
  generate_strong_sections: zIntegerParam("generate_strong_sections", 1, 5),
  generate_strong_symbols: zIntegerParam("generate_strong_symbols", 3, 8),
  duration_hours: z
    .number({ error: "duration_hours is incorrect" })
    .positive({ error: "duration_hours must be positive" })
    .optional()
    .default(24),
});
