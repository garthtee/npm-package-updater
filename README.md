# NPM Package Updater

<a href="https://marketplace.visualstudio.com/items?itemName=GarthToland.npm-package-updater">
  <img alt="VS Code Marketplace Version" src="https://img.shields.io/vscode-marketplace/v/GarthToland.npm-package-updater.svg?style=flat-square&label=Visual%20Studio%20Code%20Marketplace">
</a>
<a href="https://marketplace.visualstudio.com/items?itemName=GarthToland.npm-package-updater">
  <img alt="VS Code Marketplace Installs" src="https://img.shields.io/visual-studio-marketplace/i/GarthToland.npm-package-updater">
</a>

<a href="https://www.buymeacoffee.com/garthtoland" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

<br/>

NPM Package Updater automatically checks for either the most up-to-date latest version of each dependency in your `package.json` file, or the latest minor or patch versions (both dependencies and devDependencies).

When you run the extension it will check if you'd like to create a backup of your `package.json` file. If you use git or another version control system you shouldn't need this.

Be sure to **reinstall your packages** once complete by running `npm install` or `yarn install` in your terminal.

## Features

The following commands can be accessed from the VSCode [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).

#### <ins>Update Latest Majors</ins>

Run this command to get the most up-to-date version of all your packages.

Shortcuts:

- Windows/Linux: <kbd>ctrl</kbd>+<kbd>alt</kbd>+<kbd>u</kbd>
- macOS: <kbd>ctrl</kbd>+<kbd>option</kbd>+<kbd>u</kbd>

#### <ins>Update Latest Minors</ins>

Run this command to get the most up-to-date minor and patch versions of all of your packages.

Shortcuts:

- Windows/Linux: <kbd>ctrl</kbd>+<kbd>alt</kbd>+<kbd>m</kbd>
- macOS: <kbd>ctrl</kbd>+<kbd>option</kbd>+<kbd>m</kbd>

#### <ins>Update Latest Patches</ins>

Run this command to get the most up-to-date patch (non-breaking) versions of all of your packages.

Shortcuts:

- Windows/Linux: <kbd>ctrl</kbd>+<kbd>alt</kbd>+<kbd>p</kbd>
- macOS: <kbd>ctrl</kbd>+<kbd>option</kbd>+<kbd>p</kbd>

## See it in action here:

![Usage](https://i.imgur.com/1AiMd5Z.gif)

## Settings

#### <ins>Indentation size & type</ins>

This extension allows for customisable indentation types of your package.json. Whether you prefer tabs or spaces it's your decision 😉 Look for the `Npm Package Updater: Indentation Size` & `Npm Package Updater: Indentation Type` settings.

#### <ins>Registry</ins>

Update the registry used for fetching package details. You can use a registry different to the standard NPM one (which is set by default). For example if you're working for an organisation that has it's own registry. Look for the `Npm Package Updater: Registry` setting.

## Useful links

[Semantic Versioning explanation](https://docs.npmjs.com/about-semantic-versioning).
