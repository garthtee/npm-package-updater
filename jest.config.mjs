export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/src/test/"],
  moduleNameMapper: { "^vscode$": "<rootDir>/test/__mocks__/vscode.ts" },
  transform: { "^.+\\.tsx?$": ["ts-jest", { tsconfig: "<rootDir>/test/tsconfig.json" }] },
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/**/test/**"]
}
