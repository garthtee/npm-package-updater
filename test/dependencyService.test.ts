import { promises as fs } from "fs"
import { getPackage } from "../src/api/api"
import { getUpdatedDependencies, writeDepsToFile } from "../src/services/dependencyService"

jest.mock("../src/api/api", () => ({ getPackage: jest.fn() }))
jest.mock("../src/utils/settings", () => ({ getIndentationSetting: () => 2 }))

const mockedGetPackage = jest.mocked(getPackage)

describe("dependencyService", () => {
  afterEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
  })

  describe("writeDepsToFile", () => {
    it("writes updated dependencies while preserving unrelated package fields", async () => {
      const writeFile = jest.spyOn(fs, "writeFile").mockResolvedValue()
      const packageObj = {
        name: "example",
        scripts: { test: "jest" },
        dependencies: { existing: "1.0.0" },
        devDependencies: { typescript: "5.0.0" }
      }

      await writeDepsToFile("/workspace/package.json", packageObj, [{ existing: "1.1.0" }], [{ typescript: "5.1.0" }])

      expect(writeFile).toHaveBeenCalledTimes(1)
      const [path, contents] = writeFile.mock.calls[0]

      expect(path).toBe("/workspace/package.json")
      expect(JSON.parse(contents.toString())).toEqual({
        name: "example",
        scripts: { test: "jest" },
        dependencies: { existing: "1.1.0" },
        devDependencies: { typescript: "5.1.0" }
      })
    })

    it("does not write when neither dependency section exists", async () => {
      const writeFile = jest.spyOn(fs, "writeFile").mockResolvedValue()

      await writeDepsToFile("/workspace/package.json", { name: "example" }, null, null)

      expect(writeFile).not.toHaveBeenCalled()
    })

    it("propagates write failures with the package path and original cause", async () => {
      const cause = new Error("disk full")
      jest.spyOn(fs, "writeFile").mockRejectedValue(cause)

      try {
        await writeDepsToFile("/workspace/package.json", {}, [{ example: "1.0.0" }], null)
        throw new Error("Expected writeDepsToFile to reject")
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toContain('/workspace/package.json": disk full')
        expect((error as Error).cause).toBe(cause)
      }
    })
  })

  describe("getUpdatedDependencies", () => {
    it("updates major versions and preserves range prefixes", async () => {
      mockedGetPackage.mockResolvedValue({ versions: ["2.0.0"], "dist-tags": { latest: "2.0.0" } })

      await expect(getUpdatedDependencies({ example: "^1.0.0" }, "major")).resolves.toEqual({
        updatedDependencies: [{ example: "^2.0.0" }],
        failures: []
      })
    })

    it("selects the highest stable patch regardless of registry ordering", async () => {
      mockedGetPackage.mockResolvedValue({
        versions: ["1.2.5", "1.2.4", "1.2.6-beta.1", "1.3.0"],
        "dist-tags": { latest: "1.3.0" }
      })

      await expect(getUpdatedDependencies({ example: "~1.2.3" }, "patch")).resolves.toEqual({
        updatedDependencies: [{ example: "~1.2.5" }],
        failures: []
      })
    })

    it("keeps the current version when the registry request fails", async () => {
      mockedGetPackage.mockRejectedValue(new Error("offline"))

      await expect(getUpdatedDependencies({ example: "1.0.0" }, "major")).resolves.toEqual({
        updatedDependencies: [{ example: "1.0.0" }],
        failures: [{ dependency: "example", message: "offline" }]
      })
    })
  })
})
