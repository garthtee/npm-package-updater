# NPM Package Updater

<a href="https://marketplace.visualstudio.com/items?itemName=GarthToland.npm-package-updater">
  <img alt="VS Code Marketplace Version" src="https://img.shields.io/vscode-marketplace/v/GarthToland.npm-package-updater.svg?style=flat-square&label=Visual%20Studio%20Code%20Marketplace">
</a>
<a href="https://marketplace.visualstudio.com/items?itemName=GarthToland.npm-package-updater">
  <img alt="VS Code Marketplace Downloads" src="https://img.shields.io/visual-studio-marketplace/d/GarthToland.npm-package-updater">
</a>
<a href="https://marketplace.visualstudio.com/items?itemName=GarthToland.npm-package-updater">
  <img alt="VS Code Marketplace Installs" src="https://img.shields.io/visual-studio-marketplace/i/GarthToland.npm-package-updater">
</a>

NPM Package Updater automatically checks for either the most up-to-date latest version of each dependency in your `package.json` file, or the latest minor or patch versions (both dependencies and devDependencies).

When you run the extension it will check if you'd like to create a backup of your `package.json` file. If you use git or another version control system you shouldn't need this.

Be sure to **reinstall your packages** once complete by running `npm install` or `yarn install` in your terminal.

## Features

#### <ins>Update to the latest **major, minor and patch** version (Shortcut: `ctrl+shift+u`)</ins>

1. Run the `Update Latest Majors: NPM Package Updater` command from your [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) to get the most up-to-date version of all your packages.

#### <ins>Update to the latest **minor and patch** version (Shortcut: `ctrl+shift+m`)</ins>

2. Run the `Update Latest Minors: NPM Package Updater` command from your [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) to get the most up-to-date minor and patch versions of all of your packages.

#### <ins>Update to the latest **patch** version (Shortcut: `ctrl+shift+p`)</ins>

3. Run the `Update Latest Patches: NPM Package Updater` command from your [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) to get the most up-to-date patch (non-breaking) versions of all of your packages.

## See it in action here:

![Usage](https://i.imgur.com/1AiMd5Z.gif)

## Settings

#### <ins>Indentation size & type</ins>

This extension allows for customisable indentation types of your package.json. Whether you prefer tabs or spaces it's your decision 😉 Look for the `Npm Package Updater: Indentation Size` & `Npm Package Updater: Indentation Type` settings.

#### <ins>Registry</ins>

Use a registry different to the standard NPM one. For example if you're working for an organisation that has it's own registry. Look for the `Npm Package Updater: Registry` setting.

## Useful links

[Semantic Versioning explanation](https://docs.npmjs.com/about-semantic-versioning).
