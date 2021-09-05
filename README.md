# NPM Package Updater

[![version](https://img.shields.io/vscode-marketplace/v/GarthToland.npm-package-updater.svg?style=flat-square&label=Visual%20Studio%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=GarthToland.npm-package-updater)

NPM Package Updater automatically checks the most up-to-date latest version of each dependency in your `package.json` file (both dependencies and devDependencies).

When you run the extension it will check if you like to create a backup of your `package.json` file. If you use git or another version control system you shouldn't need this.

Be sure to **reinstall your packages** once complete by running `npm install` in your terminal.

## Features

#### Update to the latest **major, minor and patch** version

1. Run the `Update All Latest: NPM Package Updater` command from your [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).

#### Update to the latest **minor and patch** version

2. Run the `Update Minor & Patches: NPM Package Updater` command from your [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).

See it in action here:
![Usage](https://i.imgur.com/1AiMd5Z.gif)

## Requirements

This will only work with Javascript projects that contain a `package.json` file.
