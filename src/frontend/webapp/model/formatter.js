sap.ui.define([], function () {
    "use strict";

    return {
        levelState: function (sLevel) {
            switch (sLevel) {
                case "Associate":
                    return "Information";
                case "Professional":
                    return "Success";
                case "Architect":
                    return "Indication05"; // Purple / Advanced highlight
                default:
                    return "None";
            }
        },

        levelIcon: function (sLevel) {
            switch (sLevel) {
                case "Associate":
                    return "sap-icon://study-leave";
                case "Professional":
                    return "sap-icon://wrench";
                case "Architect":
                    return "sap-icon://line-charts";
                default:
                    return "sap-icon://course-book";
            }
        },

        statusState: function (sStatus) {
            switch (sStatus) {
                case "Completed":
                    return "Success";
                case "In Progress":
                    return "Warning";
                case "Pending":
                    return "None";
                case "Supported":
                    return "Success";
                case "Not Verified":
                    return "Warning";
                case "Restricted":
                    return "Information";
                default:
                    return "None";
            }
        },

        runtimeModeText: function (sMode) {
            if (sMode === "SAP_CONNECTED") {
                return "SAP S/4HANA Connected (PQPOC 100)";
            }
            return "Standalone Mode (Mock Engine)";
        },

        runtimeModeState: function (sMode) {
            if (sMode === "SAP_CONNECTED") {
                return "Success";
            }
            return "Information";
        },

        languageIcon: function (sLang) {
            if (!sLang) {
                return "sap-icon://syntax";
            }
            if (sLang.indexOf("ABAP") >= 0) {
                return "sap-icon://database";
            }
            if (sLang.indexOf("XML") >= 0) {
                return "sap-icon://document-text";
            }
            if (sLang.indexOf("JSON") >= 0) {
                return "sap-icon://attachment";
            }
            return "sap-icon://source-code";
        }
    };
});

