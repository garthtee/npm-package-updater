import { execFile } from "child_process"
import { getRegistrySetting } from "../utils/settings"

interface IPackageInfo {
  versions: string[]
  "dist-tags": Record<string, string>
}

const DEFAULT_REGISTRY = "https://registry.npmjs.com"

const getPackage = async (packageName: string, projectDirectory?: string): Promise<IPackageInfo> => {
  const registry = getRegistrySetting()
  const args = ["view", packageName, "versions", "dist-tags", "--json"]

  // Let npm resolve project/user .npmrc and scope-specific registries by default.
  if (registry !== DEFAULT_REGISTRY) {
    args.push("--registry", registry)
  }

  return new Promise((resolve, reject) => {
    execFile(
      "npm",
      args,
      { cwd: projectDirectory, timeout: 30_000, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          const detail = stderr.trim() || error.message
          reject(new Error(`Could not fetch ${packageName}: ${detail}`, { cause: error }))
          return
        }

        try {
          const packageInfo = JSON.parse(stdout) as Partial<IPackageInfo>
          const distTags = packageInfo["dist-tags"]

          if (
            !Array.isArray(packageInfo.versions) ||
            !packageInfo.versions.every((version) => typeof version === "string") ||
            !distTags ||
            Array.isArray(distTags) ||
            typeof distTags !== "object" ||
            !Object.values(distTags).every((version) => typeof version === "string")
          ) {
            throw new Error("npm returned incomplete package metadata")
          }

          resolve(packageInfo as IPackageInfo)
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error)
          reject(new Error(`Could not parse metadata for ${packageName}: ${message}`, { cause: error }))
        }
      }
    )
  })
}

export { getPackage, IPackageInfo }
