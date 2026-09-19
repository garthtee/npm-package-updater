import * as vscode from "vscode"
import { promises as fs } from "fs"
import Message from "../enums/Message"
import { IDepItem } from "../types"
import { getCreateBackupSetting } from "./settings"

const NUMBER_REGEX = new RegExp("^[0-9]+$")

const getKeyValues = (arr: IDepItem[], initialValue: any = {}) =>
  arr.reduce((acc: IDepItem, item: any) => {
    const entries = Object.entries(item)
    const key = entries[0][0]
    const value = entries[0][1] as string

    acc[key] = value

    return acc
  }, initialValue)

/**
 * Get current workspace path.
 * @returns current workspace path
 */
const getPath = () => {
  if (vscode.workspace.workspaceFolders !== undefined) {
    return vscode.workspace.workspaceFolders[0].uri.fsPath
  }

  return null
}

/**
 * VSCode message wrapper to prepend extension name.
 * @param text Message text
 * @param type Type of message
 * @param options Button options
 * @returns Thenable<string | undefined>
 */
const displayMessage = (message: string, type: Message, options: string[] = []) => {
  switch (type) {
    case Message.ERROR:
      return vscode.window.showErrorMessage(message, ...options)
    case Message.INFO:
      return vscode.window.showInformationMessage(message, ...options)
    case Message.WARN:
      return vscode.window.showWarningMessage(message, ...options)
    default:
      return vscode.window.showInformationMessage(message, ...options)
  }
}

/**
 * Checks if user would like to backup their package.json file.
 * @param context Extension context
 * @param filePath Package.json file path
 * @returns boolean Whether successful
 */
const doBackup = async (filePath: string) => {
  if (!getCreateBackupSetting()) {
    return true
  }

  try {
    await fs.copyFile(filePath, `${filePath}.bak`)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)

    await displayMessage(`Could not create backup: ${message}`, Message.ERROR)
    return false
  }

  return true
}

const isPerfectVersion = (version: string) => !version.replace(/([0-9]*)([.])([0-9]*)([.])([0-9]*)/g, "")

const getVersion = (version: string) => version.match(/([0-9]*)([.])([0-9]*|[x])([.])([x]|[0-9]*)/g)?.[0] as string

const getVersionNumbers = (version: string) => {
  const split = getVersion(version).split(".")

  try {
    const major = Number.parseInt(split[0])
    const minor = split[1] === "x" ? 0 : Number.parseInt(split[1])
    const patch = split[2] === "x" ? 0 : Number.parseInt(split[2])

    return { major, minor, patch }
  } catch {
    throw new Error("Error occurred while finding version numbers.")
  }
}

const consoleLogError = (error: any) => {
  if (error?.isAxiosError) {
    console.error(error.message)
  } else {
    console.log(error)
  }
}

const isNumeric = (char: string) => NUMBER_REGEX.test(char)

export {
  getKeyValues,
  getPath,
  displayMessage,
  doBackup,
  isPerfectVersion,
  getVersion,
  getVersionNumbers,
  consoleLogError,
  isNumeric
}
