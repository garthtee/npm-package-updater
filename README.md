# NPM Package Updater

[![version](https://img.shields.io/vscode-marketplace/v/GarthToland.npm-package-updater.svg?style=flat-square&label=Visual%20Studio%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=GarthToland.npm-package-updater)

NPM Package Updater automatically checks for either the most up-to-date latest version of each dependency in your `package.json` file, or the latest minor and patch versions (both dependencies and devDependencies).

When you run the extension it will check if you'd like to create a backup of your `package.json` file. If you use git or another version control system you shouldn't need this.

Be sure to **reinstall your packages** once complete by running `npm install` in your terminal.

## Features

#### <ins>Update to the latest **major, minor and patch** version</ins>

1. Run the `Update Latest Majors: NPM Package Updater` command from your [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) to get the most up-to-date version of all your packages.

#### <ins>Update to the latest **minor and patch** version</ins>

2. Run the `Update Latest Minors: NPM Package Updater` command from your [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) to get the most up-to-date minor and patch (non-breaking) versions of all of your packages.

See it in action here:
![Usage](https://i.imgur.com/1AiMd5Z.gif)

## Settings

#### <ins>Indentation size/type</ins>

This extension allows for customisable indentation types of your package.json. Whether you prefer tabs or spaces it's your decision 😉 Look for the `Npm Package Updater: Indentation Size` & `Npm Package Updater: Indentation Type` settings.

## FYI

[Semantic Versioning](https://docs.npmjs.com/about-semantic-versioning) explanation: For example the version `1.2.3` would be (`1` = Major) (`2 `= Minor) (`3` = Patch)
