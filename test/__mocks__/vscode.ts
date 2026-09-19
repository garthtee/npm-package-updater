const workspace = {
  workspaceFolders: [{ uri: { fsPath: "/test/workspace" } }],
  getConfiguration: (_section?: string) => ({
    get: <T>(key: string, defaultValue?: T): T | undefined => {
      const settings: Record<string, unknown> = {
        indentationType: "Spaces",
        indentationSize: 2,
        registry: "https://registry.npmjs.com",
        createBackup: true
      }
      return (settings[key] as T | undefined) ?? defaultValue
    }
  })
}

const window = {
  showInformationMessage: (msg: string, ...opts: string[]) => Promise.resolve(opts[0]),
  showErrorMessage: (msg: string, ...opts: string[]) => Promise.resolve(opts[0]),
  showWarningMessage: (msg: string, ...opts: string[]) => Promise.resolve(opts[0]),
  withProgress: async (opts: unknown, cb: (p: { report: (o: unknown) => void }) => Promise<void>) => {
    await cb({ report: () => {} })
  }
}

const commands = { registerCommand: (cmd: string, fn: (...args: unknown[]) => unknown) => ({ dispose: () => {} }) }

const ProgressLocation = { Window: 1 }

interface GlobalState {
  get(key: string): unknown
  update(key: string, value: unknown): Promise<void>
}

interface Subscription {
  dispose(): void
}

interface ExtensionContext {
  globalState: GlobalState
  subscriptions: Subscription[]
}

const ExtensionContext: ExtensionContext = {
  globalState: { get: () => false, update: () => Promise.resolve() },
  subscriptions: []
}

export { workspace, window, commands, ProgressLocation, ExtensionContext }

const vscode = { workspace, window, commands, ProgressLocation, ExtensionContext }

export default vscode
