import { getPackage } from "../api/api"
import { promises as fs } from "fs"
import { type ReleaseType } from "semver"
import { getUpdatedMajorVersion, isHigherMinorOrPatch, isHigherPatch, isVersionValid } from "../utils/dependencyUtils"
import { getKeyValues, isNumeric } from "../utils/helpers"
import { IDepItem, IDependencyFailure, IDependencyUpdateResult } from "../types"
import { getIndentationSetting } from "../utils/settings"

export const getDependencies = async (packageFilePath: string) => {
  const fileContents = await fs.readFile(packageFilePath)
  const packageObj = JSON.parse(fileContents?.toString())
  const dependencies = packageObj?.dependencies
  const devDependencies = packageObj?.devDependencies

  return { fileContents, dependencies, devDependencies, packageObj }
}

const MAX_CONCURRENT_REQUESTS = 8

const fetchLatestMajorVersion = async (dep: string, currentVersion: string, projectDirectory?: string) => {
  if (!isVersionValid(currentVersion)) {
    return currentVersion
  }

  const packageInfo = await getPackage(dep, projectDirectory)

  const latestVersion = packageInfo["dist-tags"]?.latest

  if (!latestVersion) {
    return currentVersion
  }

  return getUpdatedMajorVersion(currentVersion, latestVersion)
}

const checkForHigherVersions = async (
  dep: string,
  currentVersion: string,
  checkerFunc: (currentVersion: string, newVersion: string) => boolean | undefined,
  projectDirectory?: string
) => {
  if (!isVersionValid(currentVersion)) {
    return currentVersion
  }

  const packageInfo = await getPackage(dep, projectDirectory)

  let highestMinorPatch = currentVersion

  packageInfo.versions.forEach((version) => {
    if (checkerFunc(highestMinorPatch, version)) {
      highestMinorPatch = version

      return
    }
  })

  const firstCharacter = currentVersion.charAt(0)

  // Return first character of version if it's not a number (e.g. ~^).
  return isNumeric(firstCharacter) || highestMinorPatch === currentVersion
    ? highestMinorPatch
    : `${firstCharacter}${highestMinorPatch}`
}

export const writeDepsToFile = async (
  packageFilePath: string,
  packageObj: any,
  updatedDependencies: IDepItem[] | null,
  updatedDevDependencies: IDepItem[] | null
) => {
  if (!updatedDependencies && !updatedDevDependencies) {
    return
  }

  const deps = {
    ...packageObj,
    ...(updatedDependencies && { dependencies: getKeyValues(updatedDependencies) }),
    ...(updatedDevDependencies && { devDependencies: getKeyValues(updatedDevDependencies) })
  }

  const indentation = getIndentationSetting()

  try {
    await fs.writeFile(packageFilePath, JSON.stringify(deps, null, indentation))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)

    throw new Error(`Could not write package file "${packageFilePath}": ${message}`, { cause: error })
  }
}

export const getUpdatedDependencies = async (
  dependencies: Record<string, string> | undefined,
  semanticLevel: ReleaseType,
  projectDirectory?: string
): Promise<IDependencyUpdateResult> => {
  if (!dependencies) {
    return { updatedDependencies: null, failures: [] }
  }

  const entries = Object.entries(dependencies)
  const updatedDependencies: IDepItem[] = new Array(entries.length)
  const failures: IDependencyFailure[] = []
  let nextIndex = 0

  const updateNextDependency = async (): Promise<void> => {
    while (nextIndex < entries.length) {
      const index = nextIndex++
      const [dependency, version] = entries[index]

      try {
        let updatedVersion = version

        switch (semanticLevel) {
          case "major":
            updatedVersion = await fetchLatestMajorVersion(dependency, version, projectDirectory)
            break
          case "minor":
            updatedVersion = await checkForHigherVersions(dependency, version, isHigherMinorOrPatch, projectDirectory)
            break
          case "patch":
            updatedVersion = await checkForHigherVersions(dependency, version, isHigherPatch, projectDirectory)
            break
        }

        updatedDependencies[index] = { [dependency]: updatedVersion }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        updatedDependencies[index] = { [dependency]: version }
        failures.push({ dependency, message })
      }
    }
  }

  const workerCount = Math.min(MAX_CONCURRENT_REQUESTS, entries.length)
  await Promise.all(Array.from({ length: workerCount }, updateNextDependency))

  return { updatedDependencies, failures }
}
