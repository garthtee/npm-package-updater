import {getPackage} from "../api/api";
import {promises as fs} from "fs";

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
	const packageInfo = await getPackage(dep);

	const latestVersion = packageInfo["dist-tags"]?.latest;
	const currentSplit = currentVersion.split(".");
	const latestSplit = latestVersion?.split(".");

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
		return latestVersion;
	}

	return currentVersion;
};

export {getDependencies, getLatestVersion};
