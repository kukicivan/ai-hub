import "./utils/polyfills";
import "@testing-library/jest-dom";
import { mockServer } from "./utils/mock-server";

// Mock import.meta for Jest tests
Object.defineProperty(global, "importMeta", {
  value: {
    env: {
      VITE_API_URL: "http://localhost:3001",
      // Add other VITE_ variables here as needed
      MODE: "test",
      DEV: true,
    },
  },
});

// Dummy test to satisfy Jest
it("dummy", () => {
  expect(true).toBe(true);
});

beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());
