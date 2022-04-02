import * as vscode from "vscode";

const TAB = "\t";

enum IndentationType {
  Spaces = "Spaces",
  Tabs = "Tabs",
}

const CONFIG_NAME = "npmPackageUpdater";

const getIndentationSetting = () => {
  // Check if user has specified an indentation size
  const settings = vscode.workspace.getConfiguration(CONFIG_NAME);
  const indentationType: IndentationType =
    settings.get("indentationType") || IndentationType.Spaces;
  const indentationSize: number = settings.get("indentationSize") || 2;

  // If tabs, then add some tabs together
  if (indentationType === IndentationType.Tabs) {
    return TAB.repeat(indentationSize);
  }

  // If spaces, then return space amount
  return indentationSize;
};

const getRegistrySetting = () => {
  const settings = vscode.workspace.getConfiguration(CONFIG_NAME);
  const registry = settings.get("registry") as string;

  return registry && registry?.trim() !== ""
    ? registry
    : "https://registry.npmjs.com";
};

export {getIndentationSetting, getRegistrySetting};
