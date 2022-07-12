import {getPackage} from "../api/api";
import {promises as fs} from "fs";
import {
  getLatestMajorVersion,
  isHigherMinorOrPatch,
  isHigherPatch,
  isVersionValid,
} from "../utils/dependencyUtils";
import {consoleLogError, getKeyValues, isNumeric} from "../utils/helpers";
import {IDepItem} from "../types";
import {getIndentationSetting} from "../utils/settings";
import {SemanticLevel} from "../enums/SemanticLevel";

export const getDependencies = async (packageFilePath: string) => {
  const fileContents = await fs.readFile(packageFilePath);
  const packageObj = JSON.parse(fileContents?.toString());
  const dependencies = packageObj?.dependencies;
  const devDependencies = packageObj?.devDependencies;

  return {
    fileContents,
    dependencies,
    devDependencies,
    packageObj,
  };
};

const fetchLatestMajorVersion = async (dep: string, currentVersion: string) => {
  if (!isVersionValid(currentVersion)) {
    return currentVersion;
  }

  try {
    const packageInfo = await getPackage(dep);

    const latestVersion = packageInfo["dist-tags"]?.latest;

    if (!latestVersion) {
      return currentVersion;
    }

    return getLatestMajorVersion(currentVersion, latestVersion);
  } catch (error: any) {
    consoleLogError(error);
  }

  return currentVersion;
};

const checkForHigherVersions = async (
  dep: string,
  currentVersion: string,
  checkerFunc: (
    currentVersion: string,
    newVersion: string
  ) => boolean | undefined
) => {
  if (!isVersionValid(currentVersion)) {
    return currentVersion;
  }

  try {
    const packageInfo = await getPackage(dep);

    let highestMinorPatch = currentVersion;

    Object.keys(packageInfo.versions).forEach((version: any) => {
      if (checkerFunc(highestMinorPatch, version)) {
        highestMinorPatch = version;

        return;
      }
    });

    const firstCharacter = currentVersion.charAt(0);

    // Return first character of version of it's not a number (e.g. ~^).
    return isNumeric(firstCharacter) || highestMinorPatch === currentVersion
      ? highestMinorPatch
      : `${firstCharacter}${highestMinorPatch}`;
  } catch (error: any) {
    consoleLogError(error);
  }

  return currentVersion;
};

export const writeDepsToFile = async (
  packageFilePath: string,
  packageObj: any,
  updatedDependencies: IDepItem[] | null,
  updatedDevDependencies: IDepItem[] | null
) => {
  if (!updatedDependencies && !updatedDevDependencies) {
    return;
  }

  const deps = {
    ...packageObj,
    ...(updatedDependencies && {
      dependencies: getKeyValues(updatedDependencies),
    }),
    ...(updatedDevDependencies && {
      devDependencies: getKeyValues(updatedDevDependencies),
    }),
  };

  const indentation = getIndentationSetting();

  fs.writeFile(packageFilePath, JSON.stringify(deps, null, indentation));
};

export const getUpdatedDependencies = async (
  dependencies: any,
  semanticLevel: SemanticLevel
) =>
  dependencies
    ? Promise.all(
        Object.entries(dependencies).map(async ([dependency, version]: any) => {
          switch (semanticLevel) {
            case SemanticLevel.MAJOR:
              return {
                [dependency]: await fetchLatestMajorVersion(
                  dependency,
                  version
                ),
              };
            case SemanticLevel.MINOR:
              return {
                [dependency]: await checkForHigherVersions(
                  dependency,
                  version,
                  isHigherMinorOrPatch
                ),
              };
            case SemanticLevel.PATCH:
              return {
                [dependency]: await checkForHigherVersions(
                  dependency,
                  version,
                  isHigherPatch
                ),
              };
          }
        })
      )
    : null;
