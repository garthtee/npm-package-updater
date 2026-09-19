# Change Log

## 2.2.0 - 2026-09-19

### Added

- Add automatic `package.json.bak` backups before dependency updates, with a setting to disable them.
- Add support for authenticated private registries, scoped registries, proxies, and custom certificates through the project's npm configuration.
- Add per-package failure reporting when dependency metadata cannot be retrieved.
- Add production and test type-checking scripts. (Developer tooling)
- Add a VS Code Extension Host launch configuration and shared Prettier workspace settings. (Developer tooling)

### Changed

- Use npm to retrieve package metadata so `.npmrc` settings and credentials are respected.
- Use the `semver` package for version validation and comparison.
- Limit registry lookups to eight concurrent requests.
- Show successful updates in the VS Code status bar.
- Preserve dependency versions when individual registry requests fail instead of failing the entire update.
- Replace deprecated VS Marketplace Shields badges with approved marketplace badges.
- Improve pre-commit formatting failures with instructions for applying the required fixes. (Developer tooling)

### Fixed

- Wait for package file writes and backups to finish before reporting success.
- Include filesystem details when package file writes or backups fail.
- Reject malformed or incomplete package metadata returned by npm.
- Align VS Code format-on-save behavior with the project's Prettier configuration. (Developer tooling)

## 2.1.0 - 2026-04-06

- Update all packages to latest versions.
- Add Jest unit testing infrastructure with vscode mocks.
- Add error handling with user-friendly notifications when package updates fail.

## 2.0.1 - 2023-11-23

- Fix mac keyboard shortcuts.

## 2.0.0 - 2023-09-23

- Shortcuts updated as the old ones were causing a conflict with VSCode's default "Open Palette" shortcut. [PR #11](https://github.com/garthtee/npm-package-updater/pull/11)

## 1.4.0 - 2022-07-12

- Ability to update version to latest patch.

## 1.3.1 - 2022-04-02

## 1.3.0 - 2022-04-02

- Adding a custom registry setting.

## 1.2.5 - 2021-09-12

- Bug fixes.
- Recognising `x` as a valid character in versions.

## 1.2.3 - 2021-09-10

- Command shortcut updates.

## 1.2.2 - 2021-09-10

- Indentation settings for tabs or spaces.

## 1.2.1 - 2021-09-09

- Settings docs updates.

## 1.2.0 - 2021-09-09

- Update minor and patch versions of packages with the new `Update Latests Minors: NPM Package Updater` command.
- Bug fixes and improvements.

## 1.1.0 - 2021-04-14

- New extension icon.
- Shortcut to run the updater `ctrl+shift+u`.
- Messaging updated.

## 1.0.3 - 2021-04-12

- Error handling for package search. Now prints message to console.

## 1.0.2 - 2021-04-12

- Excluding beta and alpha versions.

## 1.0.1 - 2021-04-12

- Allowing for pre selectors in versions. E.g. `^1.1.1`.

## 1.0.0 - 2021-03-11

- Initial release
