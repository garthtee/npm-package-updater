import {getPackage} from "../api/api";
import {promises as fs} from "fs";
import {AxiosError} from "axios";

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

const getLatestVersion = async (dep: string, currentVersion: string) => {
  const validRegex = new RegExp(/^([\^~]?)([\d]+).([\d]+).([\d]*)$/);
  if (!validRegex.test(currentVersion)) {
    return currentVersion;
  }

  try {
    const packageInfo = await getPackage(dep);

    const numberRegex = /[^\d.]/g;

    const latestVersion = packageInfo["dist-tags"]?.latest;
    const currentSplit = currentVersion?.replaceAll(numberRegex, "").split(".");
    const latestSplit = latestVersion?.replaceAll(numberRegex, "").split(".");

    const latestMajor = latestSplit[0];
    const latestMinor = latestSplit[1];
    const latestPatch = latestSplit[2];

    const currentMajor = currentSplit[0];
    const currentMinor = currentSplit[1];
    const currentPatch = currentSplit[2];

    if (
      latestMajor > currentMajor ||
      (latestMinor > currentMinor && latestMajor === currentMajor) ||
      (latestPatch > currentPatch &&
        latestMinor === currentMinor &&
        latestMajor === currentMajor)
    ) {
      if (!currentVersion[0].match(/^\d/)) {
        return `${currentVersion[0]}${latestVersion}`;
      }
      return latestVersion;
    }
  } catch (error) {
    if (error?.isAxiosError) {
      console.error(error.message);
    }
  }

  return currentVersion;
};

export {getDependencies, getLatestVersion};
