sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast"
], function (Controller, UIComponent, MessageToast) {
    "use strict";

    return Controller.extend("sap.fiori.tech.academy.controller.BaseController", {
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        getModel: function (sName) {
            return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
        },

        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        getText: function (sKey, aArgs) {
            return this.getResourceBundle().getText(sKey, aArgs);
        },

        navTo: function (sRouteName, oParameters, bReplace) {
            this.getRouter().navTo(sRouteName, oParameters, bReplace);
        },

        showMessage: function (sText) {
            MessageToast.show(sText);
        },

        openGuidelineWorkspace: function () {
            var sBaseUrl = window.location.href.split("#")[0].split("?")[0];
            window.open(sBaseUrl + "?workspace=guideline#/guideline", "_blank", "noopener");
        },

        formatCodeBlockHtml: function (sCode) {
            var sText = sCode ? String(sCode) : "(Chưa có dữ liệu — bấm nút thực thi để xem kết quả)";
            var sEsc = sText
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            return '<pre class="guidelineFileExcerpt"><code>' + sEsc + '</code></pre>';
        }
    });
});

