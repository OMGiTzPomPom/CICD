import { describe, it, expect } from "vitest";
import { registrationSchema } from "./registrationSchema";

describe("registrationSchema", () => {
  describe("age validation", () => {
    it("should accept dates for users over 18", () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 20);
      const result = registrationSchema.safeParse({
        birthDate: date,
        firstName: "Twilight",
        lastName: "Sparkle",
        email: "twilight@ponyville.com",
        city: "Ponyville",
        postalCode: "12345",
      });
      expect(result.success).toBe(true);
    });

    it("should reject dates for users under 18", () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 17);
      const result = registrationSchema.safeParse({
        birthDate: date,
        firstName: "Twilight",
        lastName: "Sparkle",
        email: "twilight@ponyville.com",
        city: "Ponyville",
        postalCode: "12345",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("postal code validation", () => {
    it("should accept valid French postal codes", () => {
      const result = registrationSchema.safeParse({
        birthDate: new Date(1990, 0, 1),
        firstName: "Rainbow",
        lastName: "Dash",
        email: "rainbow@cloudsdale.com",
        city: "Cloudsdale",
        postalCode: "75001",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid postal codes", () => {
      const result = registrationSchema.safeParse({
        birthDate: new Date(1990, 0, 1),
        firstName: "Rainbow",
        lastName: "Dash",
        email: "rainbow@cloudsdale.com",
        city: "Cloudsdale",
        postalCode: "7500", // Trop court
      });
      expect(result.success).toBe(false);
    });
  });

  describe("name validation", () => {
    it("should accept names with accents and hyphens", () => {
      const result = registrationSchema.safeParse({
        birthDate: new Date(1990, 0, 1),
        firstName: "Rarity-Belle",
        lastName: "Élégance-Saphir",
        email: "rarity@carousel.com",
        city: "Canterlot",
        postalCode: "69008",
      });
      expect(result.success).toBe(true);
    });

    it("should reject names with numbers or special characters", () => {
      const result = registrationSchema.safeParse({
        birthDate: new Date(1990, 0, 1),
        firstName: "Applejack99",
        lastName: "Smith",
        email: "applejack@farm.com",
        city: "Sweet Apple Acres",
        postalCode: "75001",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("email validation", () => {
    it("should accept valid email addresses", () => {
      const result = registrationSchema.safeParse({
        birthDate: new Date(1990, 0, 1),
        firstName: "Fluttershy",
        lastName: "Kindheart",
        email: "fluttershy@everfree.com",
        city: "Everfree Forest",
        postalCode: "31415",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      const result = registrationSchema.safeParse({
        birthDate: new Date(1990, 0, 1),
        firstName: "Pinkie",
        lastName: "Pie",
        email: "partytime",
        city: "Sugarcube Corner",
        postalCode: "75001",
      });
      expect(result.success).toBe(false);
    });
  });
});
