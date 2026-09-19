import * as vscode from "vscode"
import { promises as fs } from "fs"
import { type ReleaseType } from "semver"
import { displayMessage, doBackup, getPath } from "./utils/helpers"
import { getDependencies, getUpdatedDependencies, writeDepsToFile } from "./services/dependencyService"
import Message from "./enums/Message"
import { getCompletedMessage } from "./utils/messages"

const TITLE = "NPM Package Updater"

const createCommand = (commandName: string, semanticLevel: ReleaseType) => {
  return vscode.commands.registerCommand(commandName, async () => {
    const projectDirectory = getPath()

    if (!projectDirectory) {
      displayMessage("Working folder not found, open a folder an try again.", Message.ERROR)
      return
    }

    const packageFilePath = `${projectDirectory}/package.json`

    try {
      // Check if file exists
      await fs.access(packageFilePath)
    } catch {
      displayMessage("package.json file not found.", Message.ERROR)
      return
    }

    try {
      if (!(await doBackup(packageFilePath))) {
        return
      }

      const failedDependencies: string[] = []

      await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Window, cancellable: false, title: TITLE },
        async (progress) => {
          progress.report({ increment: 0 })

          // Get & update deps

          const { dependencies, devDependencies, packageObj } = await getDependencies(packageFilePath)

          progress.report({ message: "Getting latest dependencies", increment: 10 })

          const dependencyResult = await getUpdatedDependencies(dependencies, semanticLevel, projectDirectory)
          failedDependencies.push(...dependencyResult.failures.map(({ dependency }) => dependency))

          progress.report({ message: "Getting latest devDependencies", increment: 40 })

          const devDependencyResult = await getUpdatedDependencies(devDependencies, semanticLevel, projectDirectory)
          failedDependencies.push(...devDependencyResult.failures.map(({ dependency }) => dependency))

          progress.report({ message: "Updating package.json file", increment: 80 })

          // Write updated deps to file

          await writeDepsToFile(
            packageFilePath,
            packageObj,
            dependencyResult.updatedDependencies,
            devDependencyResult.updatedDependencies
          )

          progress.report({ increment: 100 })
        }
      )

      if (failedDependencies.length > 0) {
        await displayMessage(
          `Version update completed, but could not check: ${failedDependencies.join(", ")}.`,
          Message.WARN
        )
      } else {
        getCompletedMessage()
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)

      await displayMessage(`Failed to update packages: ${message}`, Message.ERROR)
    }
  })
}

// Called when the extension is activated
export function activate(context: vscode.ExtensionContext) {
  console.log("npm-package-updater is now active!")

  const updateLatestMajors = createCommand("npm-package-updater.updateLatestMajors", "major")

  const updateLatestMinors = createCommand("npm-package-updater.updateLatestMinors", "minor")

  const updateLatestPatch = createCommand("npm-package-updater.updateLatestPatch", "patch")

  context.subscriptions.push(updateLatestMajors)
  context.subscriptions.push(updateLatestMinors)
  context.subscriptions.push(updateLatestPatch)
}

// Called when the extension is finished
// export function deactivate() {}
