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

const TITLE = "NPM Package Updater";

// Called when the extension is activated
export function activate(context: vscode.ExtensionContext) {
  console.log("npm-package-updater is now active!");

  const updateLatestMajors = vscode.commands.registerCommand(
    "npm-package-updater.updateLatestMajors",
    async () => {
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

          const {
            dependencies,
            devDependencies,
            packageObj,
          } = await getDependencies(packageFilePath);

          progress.report({
            message: "Getting latest dependencies",
            increment: 10,
          });

          const updatedDependencies = await getUpdatedDependencies(
            dependencies,
            true
          );

          progress.report({
            message: "Getting latest devDependencies",
            increment: 40,
          });

          const updatedDevDependencies = await getUpdatedDependencies(
            devDependencies,
            true
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
    }
  );

  const updateLatestMinors = vscode.commands.registerCommand(
    "npm-package-updater.updateLatestMinors",
    async () => {
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

          const {
            dependencies,
            devDependencies,
            packageObj,
          } = await getDependencies(packageFilePath);

          progress.report({
            message: "Getting latest dependencies",
            increment: 10,
          });

          const updatedDependencies = await getUpdatedDependencies(
            dependencies
          );

          progress.report({
            message: "Getting latest devDependencies",
            increment: 40,
          });

          const updatedDevDependencies = await getUpdatedDependencies(
            devDependencies
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
    }
  );

  context.subscriptions.push(updateLatestMajors);
  context.subscriptions.push(updateLatestMinors);
}

// Called when the extension is finished
// export function deactivate() {}
