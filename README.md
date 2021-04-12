# npm-package-updater

NPM Package Updater automatically checks the most up-to-date latest version of each dependency in your `package.json` file (both dependencies and devDependencies).

When you run the extension it will check if you like to create a backup of your `package.json` file. If you use git or another version control system you shouldn't need this.

## Features

To run an update on all your dependencies run the `Update All Latest: NPM Package Updater` command from your [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette). You will need to reinstall your package once complete by running `npm install` in your terminal.

See it in action here:
![Usage](https://i.imgur.com/1AiMd5Z.gif)

## Requirements

This will only work with Javascript projects that contain a `package.json` file.

## Release Notes
### 1.0.3

Error handling for package search. Now prints message to console.

### 1.0.2

Excluding beta and alpha versions.

### 1.0.1

Allowing for pre selectors in versions. E.g. `^1.1.1`.
