import * as assert from "assert";

import * as vscode from "vscode";
import {
  isPerfectVersion,
  getVersion,
  getVersionNumbers,
} from "../../utils/helpers";

suite("helpers", () => {
  vscode.window.showInformationMessage("Test isPerfectVersion method.");

  test("isPerfectVersion validates versions correctly", () => {
    assert.ok(isPerfectVersion("1.0.0"));
    assert.ok(isPerfectVersion("1.2.3"));
    assert.ok(isPerfectVersion("15.15.13453"));
    assert.ok(isPerfectVersion("15.15.13453"));

    assert.deepStrictEqual(isPerfectVersion("15.15.13453-alpha-1"), false);
    assert.deepStrictEqual(isPerfectVersion("wawaweewa"), false);
  });

  vscode.window.showInformationMessage("Test getVersion method.");

  test("getVersion returns correct version string", () => {
    assert.deepStrictEqual(getVersion("^1.0.0-alpha"), "1.0.0");
    assert.deepStrictEqual(getVersion("~3.85.90sjdhfkdfj"), "3.85.90");
  });

  vscode.window.showInformationMessage("Test getVersionNumbers method.");

  test("getVersionNumbers returns correct object", () => {
    assert.deepStrictEqual(getVersionNumbers("^1.0.0-alpha"), {
      major: 1,
      minor: 0,
      patch: 0,
    });

    assert.deepStrictEqual(getVersionNumbers("^77.4.3.2alpha"), {
      major: 77,
      minor: 4,
      patch: 3,
    });
  });
});
