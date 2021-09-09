import * as assert from "assert";

import * as vscode from "vscode";
import {
  getLatestMajorVersion,
  isHigherMinorOrPatch,
  isVersionValid,
} from "../../utils/dependencyUtils";

suite("dependencyUtils", () => {
  vscode.window.showInformationMessage("Test isVersionValid method.");

  test("isVersionValid validates good versions correctly", () => {
    assert.ok(isVersionValid("1.2.3"));
    assert.ok(isVersionValid("15.15.13453"));
    assert.ok(isVersionValid("15.15.13453"));
  });

  test("isVersionValid validates bad versions correctly", () => {
    assert.deepStrictEqual(isVersionValid("1.2.3.lvksl;dk"), false);
    assert.deepStrictEqual(isVersionValid("wow-so-nice"), false);
    assert.deepStrictEqual(isVersionValid("1"), false);
  });

  vscode.window.showInformationMessage("Test isHigherMinorOrPatch method.");

  test("isHigherMinorOrPatch return correct value", () => {
    // Should pass
    assert.ok(isHigherMinorOrPatch("1.0.0", "1.1.1"));
    assert.ok(isHigherMinorOrPatch("16.5.8", "16.5.9"));
    assert.ok(isHigherMinorOrPatch("2.0.0", "2.0.1"));
    assert.ok(isHigherMinorOrPatch("111.0.0", "111.1.0"));
    assert.ok(isHigherMinorOrPatch("1354.234.234", "1354.234.250"));

    // Should fail
    assert.deepStrictEqual(isHigherMinorOrPatch("1.0.0", "2.0.0"), false);
    assert.deepStrictEqual(isHigherMinorOrPatch("111.0.0", "222.0.0"), false);
    assert.deepStrictEqual(isHigherMinorOrPatch("1.2.2", "1.1.2"), false);
  });

  vscode.window.showInformationMessage("Test getLatestMajorVersion method.");

  test("isHigherMinorOrPatch returns correct value", () => {
    assert.deepStrictEqual(getLatestMajorVersion("1.0.0", "1.1.1"), "1.1.1");
    assert.deepStrictEqual(getLatestMajorVersion("1.0.0", "2.0.0"), "2.0.0");
  });
});
