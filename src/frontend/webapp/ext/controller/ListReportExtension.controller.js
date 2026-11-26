sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (ControllerExtension, OverrideExecution, MessageToast, MessageBox) {
    "use strict";

    /**
     * SAP Fiori Elements V4 Controller Extension: List Report Page
     * Demonstrates custom lifecycle hooks and custom actions integration
     * using the SAPUI5 Flexible Programming Model (FPM).
     */
    return ControllerExtension.extend("sap.fiori.tech.academy.ext.controller.ListReportExtension", {
        metadata: {
            methods: {
                onCustomHeaderAction: { public: true, final: true, overrideExecution: OverrideExecution.Instead },
                onExportTechnicalReport: { public: true, final: true, overrideExecution: OverrideExecution.Instead }
            }
        },

        // Extension lifecycle hooks overriding the standard Fiori Elements Page
        override: {
            /**
             * Called when the List Report view is initialized
             */
            onInit: function () {
                // Base controller extension init
            },

            /**
             * Fiori Elements V4 Page Hook: Triggered once the page and all controls are ready
             * @param {object} mParameters Page ready parameters
             */
            onPageReady: function (mParameters) {
                // Custom initialization hook for List Report
            }
        },

        /**
         * Custom Action: Triggered from Table Toolbar Custom Button
         * @param {object} oContext Current selection context or table binding
         */
        onCustomHeaderAction: function (oContext) {
            MessageToast.show("[ControllerExtension] Custom Header Action executed via Flexible Programming Model!");
        },

        /**
         * Custom Action: Batch Technical Report Generation
         * @param {Array} aSelectedContexts Array of selected contexts
         */
        onExportTechnicalReport: function (aSelectedContexts) {
            var nSelected = (aSelectedContexts && aSelectedContexts.length) || 0;
            MessageBox.information(
                "Đã kích hoạt tạo báo cáo kỹ thuật tùy chỉnh cho " + nSelected + " thực thể được chọn.",
                { title: "Fiori Elements Controller Extension" }
            );
        }
    });
});

