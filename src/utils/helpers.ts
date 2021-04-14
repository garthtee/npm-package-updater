import * as vscode from "vscode";
import {promises as fs} from "fs";
import {BACKUP_MSG, DO_NOT_SHOW_AGAIN} from "../constants/generic";
import Message from "../enums/Message";
import YesNo from "../enums/YesNo";
import {IDepItem} from "../types";

const getKeyValues = (arr: IDepItem[], initialValue: any = {}) =>
  arr.reduce((acc: IDepItem, item: any) => {
    const entries = Object.entries(item);
    const key = entries[0][0];
    const value = entries[0][1] as string;

    acc[key] = value;

    return acc;
  }, initialValue);

/**
 * Get current workspace path.
 * @returns current workspace path
 */
const getPath = () => {
  if (vscode.workspace.workspaceFolders !== undefined) {
    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  }

  return null;
};

/**
 * VSCode message wrapper to prepend
 * @param text Message text
 * @param type Type of message
 * @param options Button options
 * @returns Thenable
 */
const displayMessage = (message: string, type: Message, options?: string[]) => {
  switch (type) {
    case Message.ERROR: {
      if (options) {
        return vscode.window.showErrorMessage(message, ...options);
      } else {
        return vscode.window.showErrorMessage(message);
      }
    }
    case Message.INFO: {
      if (options) {
        return vscode.window.showInformationMessage(message, ...options);
      } else {
        return vscode.window.showInformationMessage(message);
      }
    }
    case Message.WARN: {
      if (options) {
        return vscode.window.showWarningMessage(message, ...options);
      } else {
        return vscode.window.showWarningMessage(message);
      }
    }
  }
};

/**
 * Checks if user would like to backup their package.json file
 * @param context Extension context
 * @param filePath Package.json file path
 * @returns boolean Whether successful
 */
const doBackup = async (context: vscode.ExtensionContext, filePath: string) => {
  if (context.globalState.get(BACKUP_MSG)) {
    return true;
  }

  const backupMsgOptions = [DO_NOT_SHOW_AGAIN, YesNo.YES, YesNo.NO];
  const result = await displayMessage(
    "Backup package.json?",
    Message.WARN,
    backupMsgOptions
  );

  if (result === YesNo.YES) {
    fs.copyFile(filePath, `${filePath}.bak`);
  } else if (result === DO_NOT_SHOW_AGAIN) {
    context.globalState.update(BACKUP_MSG, true);
  } else if (!result) {
    displayMessage("Backup failed.", Message.ERROR);
    return false;
  }

  return true;
};

export {getKeyValues, getPath, displayMessage, doBackup};
