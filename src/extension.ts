import * as vscode from "vscode";
import {promises as fs} from "fs";
import {displayMessage, doBackup, getPath} from "./utils/helpers";
import {
  getDependencies,
  getUpdatedDependencies,
  writeDepsToFile,
} from "./services/dependencyService";
import Message from "./enums/Message";
import {getCompletedMessage} from "./utils/messages";
import {SemanticLevel} from "./enums/SemanticLevel";

const TITLE = "NPM Package Updater";

const createCommand = (
  context: vscode.ExtensionContext,
  commandName: string,
  semanticLevel: SemanticLevel
) => {
  return vscode.commands.registerCommand(commandName, async () => {
    const path = getPath();

    if (!path) {
      displayMessage(
        "Working folder not found, open a folder an try again.",
        Message.ERROR
      );
      return;
    }

    const packageFilePath = `${path}/package.json`;

    try {
      // Check if file exists
      await fs.access(packageFilePath);
    } catch (error) {
      displayMessage("package.json file not found.", Message.ERROR);
      return;
    }

    if (!(await doBackup(context, packageFilePath))) {
      return;
    }

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        cancellable: false,
        title: TITLE,
      },
      async (progress) => {
        progress.report({increment: 0});

        // Get & update deps

        const {dependencies, devDependencies, packageObj} =
          await getDependencies(packageFilePath);

        progress.report({
          message: "Getting latest dependencies",
          increment: 10,
        });

        const updatedDependencies = await getUpdatedDependencies(
          dependencies,
          semanticLevel
        );

        progress.report({
          message: "Getting latest devDependencies",
          increment: 40,
        });

        const updatedDevDependencies = await getUpdatedDependencies(
          devDependencies,
          semanticLevel
        );

        progress.report({
          message: "Updating package.json file",
          increment: 80,
        });

        // Write updated deps to file

        await writeDepsToFile(
          packageFilePath,
          packageObj,
          updatedDependencies,
          updatedDevDependencies
        );

        progress.report({increment: 100});
      }
    );

    getCompletedMessage(context);
  });
};

// Called when the extension is activated
export function activate(context: vscode.ExtensionContext) {
  console.log("npm-package-updater is now active!");

  const updateLatestMajors = createCommand(
    context,
    "npm-package-updater.updateLatestMajors",
    SemanticLevel.MAJOR
  );

  const updateLatestMinors = createCommand(
    context,
    "npm-package-updater.updateLatestMinors",
    SemanticLevel.MINOR
  );

  const updateLatestPatch = createCommand(
    context,
    "npm-package-updater.updateLatestPatch",
    SemanticLevel.PATCH
  );

  context.subscriptions.push(updateLatestMajors);
  context.subscriptions.push(updateLatestMinors);
  context.subscriptions.push(updateLatestPatch);
}

// Called when the extension is finished
// export function deactivate() {}
