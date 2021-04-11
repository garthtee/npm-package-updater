import * as vscode from "vscode";
import {promises as fs} from "fs";
import {displayMessage, doBackup, getKeyValues, getPath} from "./utils/helpers";
import {getDependencies, getLatestVersion} from "./utils/dependencyUtils";
import Message from "./enums/Message";
import {DO_NOT_SHOW_AGAIN, SUCCESS_MSG} from "./constants/generic";

interface IDep {
	dependency: string;
	version: string;
}

// Called when the extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log("npm-package-updater is now active!");
  
	let disposable = vscode.commands.registerCommand(
    "npm-package-updater.updateLatestVersions",
		async () => {
      const path = getPath();

      if (!path) {
        displayMessage("Working folder not found, open a folder an try again.", Message.ERROR);
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
      
      if (!await doBackup(context, packageFilePath)) {
        return;
      }

			await vscode.window.withProgress(
				{
					location: vscode.ProgressLocation.Window,
					cancellable: false,
					title: "NPM-PU",
				},
				async (progress) => {
					progress.report({increment: 0});

					// Get deps
					const {
						dependencies,
						devDependencies,
						packageObj,
					} = await getDependencies(packageFilePath);

					progress.report({
            message: "Getting latest dependencies",
            increment: 10
          });

					// For each dep/devDep, save the latest version tag (if greater)
					const updatedDependencies = await Promise.all(
						Object.entries(dependencies).map(
							async ([dependency, version]: any) => {
								const latestVersion = await getLatestVersion(
									dependency,
									version
								);

								return {
									[dependency]: latestVersion,
								};
							}
						)
					);

					progress.report({
            message: "Getting latest devDependencies",
            increment: 40
          });

					const updatedDevDependencies = await Promise.all(
						Object.entries(devDependencies).map(
							async ([dependency, version]: any) => {
								const latestVersion = await getLatestVersion(
									dependency,
									version
								);

								return {
									[dependency]: latestVersion,
								};
							}
						)
					);

					progress.report({
            message: "Updating package.json file",
            increment: 80
          });

					// Write deps back to the file
					await fs.writeFile(
						packageFilePath,
						JSON.stringify(
							{
								...packageObj,
								dependencies: getKeyValues(updatedDependencies),
								devDependencies: getKeyValues(updatedDevDependencies),
							},
							null,
							"\t"
						)
					);

          progress.report({increment: 100});
				}
			);

      if (!context.globalState.get(SUCCESS_MSG)) {
        const completeMessageOptions = [DO_NOT_SHOW_AGAIN, 'Ok'];
        displayMessage("Version update complete.", Message.INFO, completeMessageOptions)
        .then((isOk) => {
          if (isOk === completeMessageOptions[0]) {
            context.globalState.update(SUCCESS_MSG, true);
          }
        });
      }
		}
	);

	context.subscriptions.push(disposable);
}

// Called when the extension is finished
export function deactivate() {}
