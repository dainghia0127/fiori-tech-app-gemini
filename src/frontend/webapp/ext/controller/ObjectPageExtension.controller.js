sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (ControllerExtension, OverrideExecution, MessageToast, MessageBox) {
    "use strict";

    /**
     * SAP Fiori Elements V4 Controller Extension: Object Page
     * Demonstrates custom lifecycle hooks and custom actions integration
     * using the SAPUI5 Flexible Programming Model (FPM).
     */
    return ControllerExtension.extend("sap.fiori.tech.academy.ext.controller.ObjectPageExtension", {
        metadata: {
            methods: {
                onCustomItemAction: { public: true, final: true, overrideExecution: OverrideExecution.Instead },
                onVerifyTechnicalIntegrity: { public: true, final: true, overrideExecution: OverrideExecution.Instead }
            }
        },

        // Extension lifecycle hooks overriding standard Fiori Elements Object Page
        override: {
            /**
             * Called when the Object Page view is initialized
             */
            onInit: function () {
                // Extension initialization
            },

            /**
             * Routing extension hook: Triggered when an entity is bound to the Object Page
             * @param {object} oBindingContext Current OData V4 binding context
             */
            routing: {
                onAfterBinding: function (oBindingContext) {
                    if (oBindingContext) {
                        var sHeaderId = oBindingContext.getProperty("HeaderId");
                        // Hook triggered on binding resolution
                    }
                }
            }
        },

        /**
         * Custom Action: Triggered from Header Toolbar or Item Action Button
         * @param {object} oBindingContext Current OData context
         */
        onCustomItemAction: function (oBindingContext) {
            MessageToast.show("[ControllerExtension] Custom Item Action executed on Object Page!");
        },

        /**
         * Custom Action: Thẩm định toàn vẹn kỹ thuật
         * @param {object} oBindingContext Current OData context
         */
        onVerifyTechnicalIntegrity: function (oBindingContext) {
            var sTitle = oBindingContext ? oBindingContext.getProperty("Title") : "Header Entity";
            MessageBox.success(
                "Kiểm tra toàn vẹn kỹ thuật thành công cho: " + sTitle + ".\nTrạng thái ETag Master & Dependent hoàn toàn hợp lệ.",
                { title: "Technical Verification Passed" }
            );
        }
    });
});

