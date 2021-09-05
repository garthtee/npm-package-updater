import * as vscode from "vscode";

const getIndentationSetting = () => {
  // Check if user has specified an indentation size
  const settings = vscode.workspace.getConfiguration("npmPackageUpdater");
  const settingValue = (settings.get("indentation") as any) as
    | string
    | number
    | undefined;

  if (!settingValue) {
    return 2;
  }

  const indentation =
    settingValue === "tab" ? "\t" : Number.parseInt(settingValue?.toString());

  return indentation;
};

export {getIndentationSetting};
