import { z } from "zod";

/**
 * Helper function to check if a pony is at least 18 moons old
 *
 * @param {Date} date - The birth date to check
 * @returns {boolean} True if the pony is at least 18 pony-years old, false otherwise
 */
const isAtLeast18MoonsAgo = (date: Date) => {
  const today = new Date();
  const eighteenMoonsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
  );
  return date <= eighteenMoonsAgo;
};

/**
 * Equestrian name regex (allows accents, hyphens, spaces, and apostrophes)
 */
const ponyNameRegex = /^[a-zA-ZÀ-ÿ\-\s']+$/;

/**
 * Equestrian postal code regex (5 magic digits)
 */
const ponyZipCodeRegex = /^[0-9]{5}$/;

/**
 * Zod schema for pony registration in Equestria
 *
 * @type {z.ZodObject}
 * @property {z.ZodString} firstName - Pony's first name (min 2 chars, Equestrian-friendly format)
 * @property {z.ZodString} lastName - Pony's last name (min 2 chars, Equestrian-friendly format)
 * @property {z.ZodString} email - Pony's enchanted scroll address
 * @property {z.ZodDate} birthDate - Pony's birth date (must be at least 18 moons ago)
 * @property {z.ZodString} city - Ponyville, Canterlot, or another Equestrian town (min 2 chars)
 * @property {z.ZodString} postalCode - Pony's postal scroll code (5 digits)
 */
export const registrationSchema = z.object({
  firstName: z
      .string()
      .min(2, "First name must have at least 2 characters")
      .regex(ponyNameRegex, "First name contains invalid characters"),
  lastName: z
      .string()
      .min(2, "Last name must have at least 2 characters")
      .regex(ponyNameRegex, "Last name contains invalid characters"),
  email: z.string().email("Scroll address is not valid"),
  birthDate: z
      .date()
      .refine(isAtLeast18MoonsAgo, "You must be at least 18 moons old to enter"),
  city: z
      .string()
      .min(2, "City must have at least 2 characters")
      .regex(ponyNameRegex, "City contains invalid characters"),
  postalCode: z
      .string()
      .regex(ponyZipCodeRegex, "Postal code must have exactly 5 digits"),
});

/**
 * Type definition for Equestrian registration scroll
 *
 * @typedef {Object} PonyRegistrationScroll
 * @property {string} firstName - Pony's first name
 * @property {string} lastName - Pony's last name
 * @property {string} email - Magical scroll address
 * @property {Date} birthDate - Pony's birth date
 * @property {string} city - Equestrian city or village
 * @property {string} postalCode - Magical postal code
 */
export type PonyRegistrationScroll = z.infer<typeof registrationSchema>;
