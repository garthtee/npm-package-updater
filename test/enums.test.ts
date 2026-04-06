import { SemanticLevel } from "../src/enums/SemanticLevel"
import Message from "../src/enums/Message"
import YesNo from "../src/enums/YesNo"

describe("enums", () => {
  describe("SemanticLevel", () => {
    it("has correct values", () => {
      expect(SemanticLevel.MAJOR).toBe(0)
      expect(SemanticLevel.MINOR).toBe(1)
      expect(SemanticLevel.PATCH).toBe(2)
    })

    it("has three levels", () => {
      const levels = Object.keys(SemanticLevel).filter(
        (k) => typeof (SemanticLevel as Record<string, unknown>)[k] === "number"
      )
      expect(levels.length).toBe(3)
    })
  })

  describe("Message", () => {
    it("has correct values", () => {
      expect(Message.ERROR).toBe(0)
      expect(Message.INFO).toBe(1)
      expect(Message.WARN).toBe(2)
    })

    it("has three message types", () => {
      const types = Object.keys(Message).filter((k) => typeof (Message as Record<string, unknown>)[k] === "number")
      expect(types.length).toBe(3)
    })
  })

  describe("YesNo", () => {
    it("has correct string values", () => {
      expect(YesNo.YES).toBe("Yes")
      expect(YesNo.NO).toBe("No")
    })

    it("has two options", () => {
      const options = Object.keys(YesNo).filter((k) => typeof (YesNo as Record<string, unknown>)[k] === "string")
      expect(options.length).toBe(2)
    })
  })
})
