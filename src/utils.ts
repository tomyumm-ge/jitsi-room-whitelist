import * as crypto from "crypto";

/**
 * Generates a simple (human-readable) room id
 * @param sections how much sections we should generate
 * @returns room id string
 * @example generateSimpleRoom(2) // 1234-5678
 */
export const generateSimpleRoom = (sections: number = 2): string => {
  const numbers = Array(sections)
    .fill(null)
    .map(() => crypto.randomInt(1000, 10000));
  return numbers.join("-");
};

/**
 * Generates a strong (non-bruteforcable) room id
 * @param sections how much sections we should generate
 * @param sectionLength how much symbols we should place inside sections
 * @returns room id string
 * @example generateStrongRoom(2, 5) // 8f4b9-985c6
 */
export const generateStrongRoom = (
  sections: number = 2,
  sectionLength: number = 5,
): string => {
  const bytesPerSection = Math.ceil(sectionLength / 2);
  const strings = Array(sections)
    .fill(null)
    .map(() => {
      const bytes = crypto.randomBytes(bytesPerSection);
      return bytes.toString("hex").slice(0, sectionLength);
    });
  return strings.join("-");
};
