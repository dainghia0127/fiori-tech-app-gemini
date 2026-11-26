sap.ui.define([
    "sap/fiori/tech/academy/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sap.fiori.tech.academy.controller.ArchitectureViewer", {
        onInit: function () {
        },

        onNavBack: function () {
            this.navTo("dashboard");
        }
    });
});

