sap.ui.define([
    "sap/fiori/tech/academy/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sap.fiori.tech.academy.controller.Dashboard", {
        onInit: function () {
            // Khởi tạo Dashboard
        },

        onNavToCatalog: function () {
            var oAppModel = this.getModel("appView");
            oAppModel.setProperty("/activeFilterCategory", "ALL");
            oAppModel.setProperty("/activeFilterLevel", "ALL");
            this.navTo("catalog");
        },

        onNavToArchitecture: function () {
            this.navTo("architecture");
        },

        onNavToGuideline: function () {
            this.openGuidelineWorkspace();
        },

        onNavToErrorPlaybook: function () {
            this.navTo("errorPlaybook");
        },

        onNavToAdvancedLab: function () {
            this.navTo("advancedLab");
        },

        onNavToUserManual: function () {
            this.navTo("userManual");
        },

        onCategoryPress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("catalog");
            if (oContext) {
                var sCategoryId = oContext.getProperty("id");
                var oAppModel = this.getModel("appView");
                oAppModel.setProperty("/activeFilterCategory", sCategoryId);
                this.navTo("catalog");
            }
        },

        onOpenModeDialog: function () {
            // Ủy thác mở dialog cho Root App Controller
            var oRootController = this.getOwnerComponent().getRootControl().getController();
            if (oRootController && oRootController.onOpenModeDialog) {
                oRootController.onOpenModeDialog();
            }
        }
    });
});

