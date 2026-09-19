interface IDepItem {
  [dependency: string]: string
}

interface IDependencyFailure {
  dependency: string
  message: string
}

interface IDependencyUpdateResult {
  updatedDependencies: IDepItem[] | null
  failures: IDependencyFailure[]
}

export { IDepItem, IDependencyFailure, IDependencyUpdateResult }
