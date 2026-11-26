sap.ui.define([
    "sap/fiori/tech/academy/model/formatter"
], function (formatter) {
    "use strict";

    QUnit.module("Formatter - Technical Level and Badges");

    QUnit.test("Should format level states correctly", function (assert) {
        assert.strictEqual(formatter.levelState("Associate"), "Information", "Associate should map to Information state");
        assert.strictEqual(formatter.levelState("Professional"), "Success", "Professional should map to Success state");
        assert.strictEqual(formatter.levelState("Architect"), "Indication05", "Architect should map to Indication05 state");
        assert.strictEqual(formatter.levelState("Unknown"), "None", "Unknown level should map to None state");
    });

    QUnit.test("Should format level icons correctly", function (assert) {
        assert.strictEqual(formatter.levelIcon("Associate"), "sap-icon://study-leave");
        assert.strictEqual(formatter.levelIcon("Professional"), "sap-icon://wrench");
        assert.strictEqual(formatter.levelIcon("Architect"), "sap-icon://line-charts");
    });

    QUnit.module("Formatter - Runtime Mode");

    QUnit.test("Should format runtime mode text and state correctly", function (assert) {
        assert.strictEqual(formatter.runtimeModeText("STANDALONE"), "Standalone Mode (Mock Engine)");
        assert.strictEqual(formatter.runtimeModeText("SAP_CONNECTED"), "SAP S/4HANA Connected (PQPOC 100)");

        assert.strictEqual(formatter.runtimeModeState("STANDALONE"), "Information");
        assert.strictEqual(formatter.runtimeModeState("SAP_CONNECTED"), "Success");
    });
});

