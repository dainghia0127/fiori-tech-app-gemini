sap.ui.define([
    "sap/fiori/tech/academy/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sap.fiori.tech.academy.controller.NotFound", {
        onNavHome: function () {
            this.navTo("dashboard");
        }
    });
});

