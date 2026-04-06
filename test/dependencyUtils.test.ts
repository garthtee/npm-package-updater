import {
  isVersionValid,
  getLatestMajorVersion,
  isHigherMinorOrPatch,
  isHigherPatch
} from "../src/utils/dependencyUtils"

describe("dependencyUtils", () => {
  describe("isVersionValid", () => {
    it("validates good versions correctly", () => {
      expect(isVersionValid("1.2.3")).toBe(true)
      expect(isVersionValid("15.15.13453")).toBe(true)
      expect(isVersionValid("^1.2.3")).toBe(true)
      expect(isVersionValid("~1.2.3")).toBe(true)
      expect(isVersionValid("1.x.x")).toBe(true)
      expect(isVersionValid("1.2.x")).toBe(true)
      expect(isVersionValid("^0.0.1")).toBe(true)
    })

    it("validates bad versions correctly", () => {
      expect(isVersionValid("1.2.3.lvksl;dk")).toBe(false)
      expect(isVersionValid("wow-so-nice")).toBe(false)
      expect(isVersionValid("1")).toBe(false)
      expect(isVersionValid("")).toBe(false)
      expect(isVersionValid("1.2")).toBe(false)
    })
  })

  describe("getLatestMajorVersion", () => {
    it("returns latest version when higher", () => {
      expect(getLatestMajorVersion("1.0.0", "2.0.0")).toBe("2.0.0")
      expect(getLatestMajorVersion("1.0.0", "1.1.1")).toBe("1.1.1")
    })

    it("returns current version when latest is not higher", () => {
      expect(getLatestMajorVersion("2.0.0", "1.0.0")).toBe("2.0.0")
    })

    it("preserves version prefix", () => {
      expect(getLatestMajorVersion("^1.0.0", "2.0.0")).toBe("^2.0.0")
      expect(getLatestMajorVersion("~1.0.0", "1.1.0")).toBe("~1.1.0")
    })

    it("returns current version when versions are equal", () => {
      expect(getLatestMajorVersion("1.0.0", "1.0.0")).toBe("1.0.0")
    })

    it("handles invalid versions gracefully", () => {
      expect(getLatestMajorVersion("invalid", "1.0.0")).toBe("invalid")
    })
  })

  describe("isHigherMinorOrPatch", () => {
    it("returns true when minor is higher", () => {
      expect(isHigherMinorOrPatch("1.0.0", "1.1.0")).toBe(true)
      expect(isHigherMinorOrPatch("16.5.8", "16.6.0")).toBe(true)
      expect(isHigherMinorOrPatch("111.0.0", "111.1.0")).toBe(true)
    })

    it("returns true when patch is higher with same minor", () => {
      expect(isHigherMinorOrPatch("16.5.8", "16.5.9")).toBe(true)
      expect(isHigherMinorOrPatch("1.0.0", "1.0.1")).toBe(true)
      expect(isHigherMinorOrPatch("1354.234.234", "1354.234.250")).toBe(true)
    })

    it("returns true when both minor and patch are higher", () => {
      expect(isHigherMinorOrPatch("1.0.0", "1.1.1")).toBe(true)
      expect(isHigherMinorOrPatch("2.0.0", "2.1.1")).toBe(true)
    })

    it("returns false when major is higher", () => {
      expect(isHigherMinorOrPatch("1.0.0", "2.0.0")).toBe(false)
      expect(isHigherMinorOrPatch("111.0.0", "222.0.0")).toBe(false)
    })

    it("returns false when minor is lower", () => {
      expect(isHigherMinorOrPatch("1.2.2", "1.1.2")).toBe(false)
    })

    it("returns undefined when versions are equal", () => {
      expect(isHigherMinorOrPatch("1.0.0", "1.0.0")).toBeUndefined()
    })

    it("returns undefined for invalid new version", () => {
      expect(isHigherMinorOrPatch("1.0.0", "invalid")).toBeUndefined()
    })
  })

  describe("isHigherPatch", () => {
    it("returns true when patch is higher", () => {
      expect(isHigherPatch("1.0.0", "1.0.1")).toBe(true)
      expect(isHigherPatch("16.5.8", "16.5.9")).toBe(true)
      expect(isHigherPatch("1.2.3", "1.2.100")).toBe(true)
    })

    it("returns false when major is different", () => {
      expect(isHigherPatch("1.0.0", "2.0.0")).toBe(false)
      expect(isHigherPatch("2.0.0", "1.0.0")).toBe(false)
    })

    it("returns false when minor is different", () => {
      expect(isHigherPatch("1.0.0", "1.1.0")).toBe(false)
      expect(isHigherPatch("1.1.0", "1.0.0")).toBe(false)
    })

    it("returns undefined when versions are equal", () => {
      expect(isHigherPatch("1.0.0", "1.0.0")).toBeUndefined()
    })

    it("returns undefined for invalid new version", () => {
      expect(isHigherPatch("1.0.0", "invalid")).toBeUndefined()
    })
  })
})
