import {getPackage} from "../api/api";
import {promises as fs} from "fs";
import {
  getLatestMajorVersion,
  isHigherMinorOrPatch,
  isVersionValid,
} from "../utils/dependencyUtils";
import {consoleLogError, getKeyValues} from "../utils/helpers";
import {IDepItem} from "../types";
import {getIndentationSetting} from "../utils/settings";

const getDependencies = async (packageFilePath: string) => {
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

    return getLatestMajorVersion(currentVersion, latestVersion);
  } catch (error: any) {
    consoleLogError(error);
  }

  return currentVersion;
};

const fetchLatestMinorVersion = async (dep: string, currentVersion: string) => {
  if (!isVersionValid(currentVersion)) {
    return currentVersion;
  }

  try {
    const packageInfo = await getPackage(dep);

    let highestMinorPatch = currentVersion;

    Object.keys(packageInfo.versions).forEach((version: any) => {
      if (isHigherMinorOrPatch(highestMinorPatch, version)) {
        highestMinorPatch = version;

        return;
      }
    });

    return highestMinorPatch;
  } catch (error: any) {
    consoleLogError(error);
  }

  return currentVersion;
};

const writeDepsToFile = async (
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

const getUpdatedDependencies = async (dependencies: any, isMajor = false) =>
  dependencies
    ? Promise.all(
        Object.entries(dependencies).map(async ([dependency, version]: any) => {
          const latestVersion = isMajor
            ? await fetchLatestMajorVersion(dependency, version)
            : await fetchLatestMinorVersion(dependency, version);

          return {
            [dependency]: latestVersion,
          };
        })
      )
    : null;

export {getDependencies, writeDepsToFile, getUpdatedDependencies};
