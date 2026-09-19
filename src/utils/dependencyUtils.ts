import * as semver from "semver"

const SUPPORTED_VERSION_PATTERN = /^[~^]?\d+\.(?:\d+\.(?:\d+|x)|x\.x)$/

export const isVersionValid = (version: string) =>
  SUPPORTED_VERSION_PATTERN.test(version) && semver.validRange(version) !== null

const getMinimumVersion = (version: string) => (isVersionValid(version) ? semver.minVersion(version) : null)

export const getUpdatedMajorVersion = (currentVersion: string, latestVersion: string) => {
  const current = getMinimumVersion(currentVersion)
  const latest = semver.valid(latestVersion)

  if (!current || !latest || semver.prerelease(latest) || !semver.gt(latest, current)) {
    return currentVersion
  }

  const currentFirstChar = currentVersion[0]

  if (currentFirstChar === "^" || currentFirstChar === "~") {
    return `${currentFirstChar}${latest}`
  }

  return latest
}

/**
 * Checks if newVersion has a higher minor or patch than currentVersion.
 * @param currentVersion string version.
 * @param newVersion string version.
 * @returns string version.
 */
export const isHigherMinorOrPatch = (currentVersion: string, newVersion: string) => {
  const current = getMinimumVersion(currentVersion)
  const candidate = semver.valid(newVersion)

  if (!current || !candidate || semver.prerelease(candidate) || semver.eq(current, candidate)) {
    return
  }

  return semver.major(candidate) === semver.major(current) && semver.gt(candidate, current)
}

/**
 * Checks if newVersion has a higher patch than currentVersion.
 * @param currentVersion string version.
 * @param newVersion string version.
 * @returns string version.
 */
export const isHigherPatch = (currentVersion: string, newVersion: string) => {
  const current = getMinimumVersion(currentVersion)
  const candidate = semver.valid(newVersion)

  if (!current || !candidate || semver.prerelease(candidate) || semver.eq(current, candidate)) {
    return
  }

  return (
    semver.major(candidate) === semver.major(current) &&
    semver.minor(candidate) === semver.minor(current) &&
    semver.gt(candidate, current)
  )
}
