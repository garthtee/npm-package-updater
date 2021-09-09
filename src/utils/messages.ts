import * as vscode from "vscode";
import {DO_NOT_SHOW_AGAIN, SUCCESS_MSG} from "../constants/generic";
import Message from "../enums/Message";
import {displayMessage} from "./helpers";

const getCompletedMessage = (context: vscode.ExtensionContext) => {
  if (!context.globalState.get(SUCCESS_MSG)) {
    const completeMessageOptions = [DO_NOT_SHOW_AGAIN, "Ok"];
    displayMessage(
      "Version update complete.",
      Message.INFO,
      completeMessageOptions
    ).then((isOk) => {
      if (isOk === completeMessageOptions[0]) {
        context.globalState.update(SUCCESS_MSG, true);
      }
    });
  }
};

export {getCompletedMessage};
