import * as vscode from "vscode"

export const getCompletedMessage = () => vscode.window.setStatusBarMessage("$(check) Version update complete.", 5_000)
