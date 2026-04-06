import { isPerfectVersion, getVersion, getVersionNumbers, isNumeric, getKeyValues } from "../src/utils/helpers"
import { IDepItem } from "../src/types"

describe("helpers", () => {
  describe("isPerfectVersion", () => {
    it("validates valid versions correctly", () => {
      expect(isPerfectVersion("1.0.0")).toBe(true)
      expect(isPerfectVersion("1.2.3")).toBe(true)
      expect(isPerfectVersion("15.15.13453")).toBe(true)
      expect(isPerfectVersion("0.0.1")).toBe(true)
    })

    it("rejects invalid versions correctly", () => {
      expect(isPerfectVersion("15.15.13453-alpha-1")).toBe(false)
      expect(isPerfectVersion("wawaweewa")).toBe(false)
      expect(isPerfectVersion("1.2.3.4")).toBe(false)
    })
  })

  describe("getVersion", () => {
    it("extracts version from version strings with prefixes", () => {
      expect(getVersion("^1.0.0-alpha")).toBe("1.0.0")
      expect(getVersion("~3.85.90sjdhfkdfj")).toBe("3.85.90")
    })

    it("returns full version when no prefix", () => {
      expect(getVersion("1.0.0")).toBe("1.0.0")
      expect(getVersion("2.5.10")).toBe("2.5.10")
    })

    it("handles special characters", () => {
      expect(getVersion(">=1.0.0")).toBe("1.0.0")
      expect(getVersion("||1.0.0")).toBe("1.0.0")
    })
  })

  describe("getVersionNumbers", () => {
    it("parses version strings correctly", () => {
      expect(getVersionNumbers("^1.0.0-alpha")).toEqual({ major: 1, minor: 0, patch: 0 })

      expect(getVersionNumbers("^77.4.3.2alpha")).toEqual({ major: 77, minor: 4, patch: 3 })
    })

    it("handles versions with x wildcards", () => {
      expect(getVersionNumbers("1.x.x")).toEqual({ major: 1, minor: 0, patch: 0 })

      expect(getVersionNumbers("2.5.x")).toEqual({ major: 2, minor: 5, patch: 0 })
    })

    it("throws error for invalid versions", () => {
      expect(() => getVersionNumbers("invalid")).toThrow()
    })
  })

  describe("isNumeric", () => {
    it("returns true for numeric strings", () => {
      expect(isNumeric("0")).toBe(true)
      expect(isNumeric("6")).toBe(true)
      expect(isNumeric("3")).toBe(true)
      expect(isNumeric("9")).toBe(true)
      expect(isNumeric("10")).toBe(true)
    })

    it("returns false for non-numeric strings", () => {
      expect(isNumeric("^")).toBe(false)
      expect(isNumeric("~")).toBe(false)
      expect(isNumeric("a")).toBe(false)
      expect(isNumeric("z")).toBe(false)
      expect(isNumeric("A")).toBe(false)
      expect(isNumeric("Z")).toBe(false)
      expect(isNumeric("")).toBe(false)
    })
  })

  describe("getKeyValues", () => {
    it("converts array of objects to key-value pairs", () => {
      const input: IDepItem[] = [{ lodash: "^4.17.21" }, { axios: "^1.6.0" }]
      const result = getKeyValues(input)
      expect(result).toEqual({ lodash: "^4.17.21", axios: "^1.6.0" })
    })

    it("handles empty array", () => {
      const result = getKeyValues([])
      expect(result).toEqual({})
    })

    it("merges with initial value", () => {
      const input: IDepItem[] = [{ axios: "^1.6.0" }]
      const result = getKeyValues(input, { lodash: "^4.17.20" })
      expect(result).toEqual({ lodash: "^4.17.20", axios: "^1.6.0" })
    })
  })
})
