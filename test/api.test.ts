import { execFile } from "child_process"
import { getPackage } from "../src/api/api"
import { getRegistrySetting } from "../src/utils/settings"

jest.mock("child_process", () => ({ execFile: jest.fn() }))
jest.mock("../src/utils/settings", () => ({ getRegistrySetting: jest.fn() }))

const mockedExecFile = jest.mocked(execFile)
const mockedGetRegistrySetting = jest.mocked(getRegistrySetting)

const completeExecFile = (error: Error | null, stdout = "", stderr = "") => {
  mockedExecFile.mockImplementationOnce((...args: any[]) => {
    const callback = args.at(-1)
    callback(error, stdout, stderr)
    return {} as ReturnType<typeof execFile>
  })
}

describe("getPackage", () => {
  beforeEach(() => {
    mockedGetRegistrySetting.mockReturnValue("https://registry.npmjs.com")
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("uses npm metadata with the project directory so npmrc authentication is inherited", async () => {
    completeExecFile(null, JSON.stringify({ versions: ["1.0.0", "1.1.0"], "dist-tags": { latest: "1.1.0" } }))

    await expect(getPackage("@private/example", "/workspace")).resolves.toEqual({
      versions: ["1.0.0", "1.1.0"],
      "dist-tags": { latest: "1.1.0" }
    })

    expect(mockedExecFile).toHaveBeenCalledWith(
      "npm",
      ["view", "@private/example", "versions", "dist-tags", "--json"],
      expect.objectContaining({ cwd: "/workspace", timeout: 30_000, maxBuffer: 10 * 1024 * 1024 }),
      expect.any(Function)
    )
  })

  it("passes a configured non-default registry to npm", async () => {
    mockedGetRegistrySetting.mockReturnValue("https://registry.example.com")
    completeExecFile(null, JSON.stringify({ versions: ["1.0.0"], "dist-tags": { latest: "1.0.0" } }))

    await getPackage("example", "/workspace")

    expect(mockedExecFile).toHaveBeenCalledWith(
      "npm",
      ["view", "example", "versions", "dist-tags", "--json", "--registry", "https://registry.example.com"],
      expect.any(Object),
      expect.any(Function)
    )
  })

  it("reports npm failures with stderr details", async () => {
    const cause = new Error("command failed")
    completeExecFile(cause, "", "npm error code E401")

    try {
      await getPackage("@private/example", "/workspace")
      throw new Error("Expected getPackage to reject")
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toBe("Could not fetch @private/example: npm error code E401")
      expect((error as Error).cause).toBe(cause)
    }
  })

  it("uses the process error when stderr is empty", async () => {
    completeExecFile(new Error("npm was not found"))

    await expect(getPackage("example", "/workspace")).rejects.toThrow("Could not fetch example: npm was not found")
  })

  it("rejects malformed metadata", async () => {
    completeExecFile(null, "not-json")

    await expect(getPackage("example", "/workspace")).rejects.toThrow("Could not parse metadata for example")
  })

  it.each([
    ["missing dist-tags", { versions: [] }],
    ["null dist-tags", { versions: [], "dist-tags": null }],
    ["array dist-tags", { versions: [], "dist-tags": [] }],
    ["non-string versions", { versions: [1], "dist-tags": { latest: "1.0.0" } }],
    ["non-string dist-tag", { versions: ["1.0.0"], "dist-tags": { latest: 1 } }]
  ])("rejects incomplete metadata: %s", async (_description, metadata) => {
    completeExecFile(null, JSON.stringify(metadata))

    await expect(getPackage("example", "/workspace")).rejects.toThrow("npm returned incomplete package metadata")
  })
})
