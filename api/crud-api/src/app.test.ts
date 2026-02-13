import { describe, it, expect, vi, beforeEach } from "vitest";

// Set environment variables before importing the app
process.env.AUTH_HEADER = "test";
process.env.DATABASE_URL = "sqlite.db";
process.env.WEATHER_API_KEY = "test-key";

// Mock the weather API module
vi.mock("./apis/weather", () => ({
  weatherAPI: vi.fn(),
}));

// Mock the db model module
vi.mock("./db/model", async () => {
  const actual =
    await vi.importActual<typeof import("./db/model")>("./db/model");
  return {
    ...actual,
    dbModel: vi.fn(),
  };
});

// Import mocked modules and app after mocks are set up
import { weatherAPI } from "./apis/weather";
import { dbModel } from "./db/model";
import { app } from "./app";

describe("CRUD API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /all", () => {
    it("should return a list of capitals", async () => {
      const res = await app.request("/all");

      expect(res.status).toBe(200);
      const data = (await res.json()) as string[];
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /list", () => {
    it("should return paginated list of cities", async () => {
      // Setup mock for list operation
      const mockList = vi.fn().mockResolvedValue({
        data: [
          {
            id: "1",
            name: "Paris",
            state: "French Republic",
            country: "France",
            estimatedPopulation: 2161000,
            touristRating: null,
            dateEstablished: null,
            createdAt: Date.now(),
          },
        ],
        nextCursor: undefined,
      });

      (dbModel as ReturnType<typeof vi.fn>).mockReturnValue({
        cities: {
          get: vi.fn(),
          list: mockList,
          create: vi.fn(),
          update: vi.fn(),
          delete: vi.fn(),
        },
      });

      const res = await app.request("/list");

      expect(res.status).toBe(200);
      const data = (await res.json()) as {
        data: unknown[];
        nextCursor?: number;
      };
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe("GET /available/:name", () => {
    it("should return city data for valid capital", async () => {
      // Setup mock for weather API
      (weatherAPI as ReturnType<typeof vi.fn>).mockResolvedValue({
        temperature: 15.5,
        feelsLike: 14.2,
        humidity: 72,
        pressure: 1013,
        windSpeed: 3.5,
        windDirection: 220,
        cloudiness: 40,
        weather: "Clouds",
        description: "scattered clouds",
        icon: "03d",
      });

      // Setup mock for get operation (city doesn't exist yet)
      const mockCreate = vi.fn().mockResolvedValue({
        id: "test-id-123",
        name: "Paris",
        state: "French Republic",
        country: "France",
        estimatedPopulation: 2161000,
        touristRating: null,
        dateEstablished: null,
        createdAt: Date.now(),
      });

      (dbModel as ReturnType<typeof vi.fn>).mockReturnValue({
        cities: {
          get: vi.fn().mockResolvedValue(null),
          list: vi.fn(),
          create: mockCreate,
          update: vi.fn(),
          delete: vi.fn(),
        },
      });

      const res = await app.request("/available/Paris");

      expect(res.status).toBe(200);
      const data = (await res.json()) as {
        name: string;
        country: string;
        cca2: string;
        cca3: string;
      };
      expect(data).toHaveProperty("name");
      expect(data).toHaveProperty("country");
      expect(data).toHaveProperty("cca2");
      expect(data).toHaveProperty("cca3");
      expect(weatherAPI).toHaveBeenCalled();
    });

    it("should return 404 for invalid capital", async () => {
      const res = await app.request("/available/InvalidCity123");

      expect(res.status).toBe(404);
    });

    it("should return existing city data without creating new record", async () => {
      // Setup mock for weather API
      (weatherAPI as ReturnType<typeof vi.fn>).mockResolvedValue({
        temperature: 20.0,
        feelsLike: 19.5,
        humidity: 60,
        pressure: 1015,
        windSpeed: 2.0,
        windDirection: 180,
        cloudiness: 20,
        weather: "Clear",
        description: "clear sky",
        icon: "01d",
      });

      // Setup mock for get operation (city exists)
      const existingCity = {
        id: "existing-id",
        name: "Paris",
        state: "French Republic",
        country: "France",
        estimatedPopulation: 2161000,
        touristRating: 5,
        dateEstablished: "300 BC",
        createdAt: Date.now(),
      };

      const mockCreate = vi.fn();
      (dbModel as ReturnType<typeof vi.fn>).mockReturnValue({
        cities: {
          get: vi.fn().mockResolvedValue(existingCity),
          list: vi.fn(),
          create: mockCreate,
          update: vi.fn(),
          delete: vi.fn(),
        },
      });

      const res = await app.request("/available/Paris");

      expect(res.status).toBe(200);
      const data = (await res.json()) as {
        name: string;
        touristRating: number;
      };
      expect(data.name).toBe("Paris");
      expect(data.touristRating).toBe(5);
      expect(mockCreate).not.toHaveBeenCalled(); // Should not create new record
    });
  });

  describe("PUT /available/:id", () => {
    it("should update a city", async () => {
      const mockUpdate = vi.fn().mockResolvedValue(undefined);
      (dbModel as ReturnType<typeof vi.fn>).mockReturnValue({
        cities: {
          get: vi.fn(),
          list: vi.fn(),
          create: vi.fn(),
          update: mockUpdate,
          delete: vi.fn(),
        },
      });

      const res = await app.request("/available/test-id", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estimatedPopulation: 3000000,
          touristRating: 4.5,
        }),
      });

      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toBe("city-update");
    });
  });

  describe("DELETE /available/:id", () => {
    it("should delete a city", async () => {
      const mockDelete = vi.fn().mockResolvedValue(undefined);
      (dbModel as ReturnType<typeof vi.fn>).mockReturnValue({
        cities: {
          get: vi.fn(),
          list: vi.fn(),
          create: vi.fn(),
          update: vi.fn(),
          delete: mockDelete,
        },
      });

      const res = await app.request("/available/test-id", {
        method: "DELETE",
      });

      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toBe("city-delete");
    });
  });
});
