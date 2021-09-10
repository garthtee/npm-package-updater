import * as vscode from "vscode";

const TAB = "\t";

enum IndentationType {
  Spaces = "Spaces",
  Tabs = "Tabs",
}

const getIndentationSetting = () => {
  // Check if user has specified an indentation size
  const settings = vscode.workspace.getConfiguration("npmPackageUpdater");
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

export {getIndentationSetting};
