import { DO_NOT_SHOW_AGAIN, BACKUP_MSG, SUCCESS_MSG } from "../src/constants/generic"

describe("constants", () => {
  describe("generic constants", () => {
    it("DO_NOT_SHOW_AGAIN has correct value", () => {
      expect(DO_NOT_SHOW_AGAIN).toBe("Don't show again")
    })

    it("BACKUP_MSG has correct value", () => {
      expect(BACKUP_MSG).toBe("backup-message")
    })

    it("SUCCESS_MSG has correct value", () => {
      expect(SUCCESS_MSG).toBe("success-message")
    })
  })
})
