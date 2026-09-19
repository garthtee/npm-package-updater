import { promises as fs } from "fs"
import * as vscode from "vscode"
import { doBackup } from "../src/utils/helpers"
import { getCreateBackupSetting } from "../src/utils/settings"

jest.mock("../src/utils/settings", () => ({ getCreateBackupSetting: jest.fn() }))

const mockedGetCreateBackupSetting = jest.mocked(getCreateBackupSetting)

describe("doBackup", () => {
  afterEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
  })

  it("creates a backup when the setting is enabled", async () => {
    mockedGetCreateBackupSetting.mockReturnValue(true)
    const copyFile = jest.spyOn(fs, "copyFile").mockResolvedValue()

    await expect(doBackup("/workspace/package.json")).resolves.toBe(true)
    expect(copyFile).toHaveBeenCalledWith("/workspace/package.json", "/workspace/package.json.bak")
  })

  it("does not create a backup when the setting is disabled", async () => {
    mockedGetCreateBackupSetting.mockReturnValue(false)
    const copyFile = jest.spyOn(fs, "copyFile").mockResolvedValue()

    await expect(doBackup("/workspace/package.json")).resolves.toBe(true)
    expect(copyFile).not.toHaveBeenCalled()
  })

  it("reports a copy failure and stops the update", async () => {
    mockedGetCreateBackupSetting.mockReturnValue(true)
    jest.spyOn(fs, "copyFile").mockRejectedValue(new Error("permission denied"))
    const showErrorMessage = jest.spyOn(vscode.window, "showErrorMessage")

    await expect(doBackup("/workspace/package.json")).resolves.toBe(false)
    expect(showErrorMessage).toHaveBeenCalledWith("Could not create backup: permission denied")
  })
})
