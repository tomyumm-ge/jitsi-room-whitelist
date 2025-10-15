import * as z from "zod";

export const zIntegerParam = (paramName: string, min: number, max: number) =>
  z
    .number({
      error: `${paramName} is incorrect`,
    })
    .min(min, { error: `${paramName} must be minimum ${min}` })
    .max(max, { error: `${paramName} must be maximum ${max}` })
    .optional();
