import {getVersionNumbers, isPerfectVersion} from "./helpers";

export const isVersionValid = (version: string) => {
  const validRegex = new RegExp(/^([\^~]?)([\d]+).([\d]+|[x]).([\d]*|[x])$/);

  return validRegex.test(version);
};

export const getLatestMajorVersion = (
  currentVersion: string,
  latestVersion: string
) => {
  try {
    const {
      major: currentMajor,
      minor: currentMinor,
      patch: currentPatch,
    } = getVersionNumbers(currentVersion);
    const {
      major: latestMajor,
      minor: latestMinor,
      patch: latestPatch,
    } = getVersionNumbers(latestVersion);

    // Check if version is newer
    if (
      latestMajor > currentMajor ||
      (latestMinor > currentMinor && latestMajor === currentMajor) ||
      (latestPatch > currentPatch &&
        latestMinor === currentMinor &&
        latestMajor === currentMajor)
    ) {
      // Ensure the leading character is returned with new version
      if (!currentVersion[0].match(/^\d/)) {
        return `${currentVersion[0]}${latestVersion}`;
      }
      return latestVersion;
    }
  } catch (error: any) {
    console.log(error);
  }

  return currentVersion;
};

/**
 * Checks if newVersion has a higher minor or patch than currentVersion.
 * @param currentVersion string version.
 * @param newVersion string version.
 * @returns string version.
 */
export const isHigherMinorOrPatch = (
  currentVersion: string,
  newVersion: string
) => {
  if (!isPerfectVersion(newVersion) || currentVersion === newVersion) {
    return;
  }

  try {
    const {
      major: currentMajor,
      minor: currentMinor,
      patch: currentPatch,
    } = getVersionNumbers(currentVersion);
    const {
      major: newMajor,
      minor: newMinor,
      patch: newPatch,
    } = getVersionNumbers(newVersion);

    if (newMajor !== currentMajor) {
      return false;
    }

    if (newMinor > currentMinor) {
      return true;
    }

    // Ensure versions with a high patch and lower minor
    // aren't seen as the higher version!
    if (newPatch > currentPatch && newMinor >= currentMinor) {
      return true;
    }
  } catch (e) {
    console.log(e);

    return false;
  }

  return false;
};

/**
 * Checks if newVersion has a higher patch than currentVersion.
 * @param currentVersion string version.
 * @param newVersion string version.
 * @returns string version.
 */
export const isHigherPatch = (currentVersion: string, newVersion: string) => {
  if (!isPerfectVersion(newVersion) || currentVersion === newVersion) {
    return;
  }

  try {
    const {
      major: currentMajor,
      minor: currentMinor,
      patch: currentPatch,
    } = getVersionNumbers(currentVersion);
    const {
      major: newMajor,
      minor: newMinor,
      patch: newPatch,
    } = getVersionNumbers(newVersion);

    if (newMajor !== currentMajor || newMinor !== currentMinor) {
      return false;
    }

    if (newPatch > currentPatch) {
      return true;
    }
  } catch (e) {
    console.log(e);

    return false;
  }

  return false;
};
