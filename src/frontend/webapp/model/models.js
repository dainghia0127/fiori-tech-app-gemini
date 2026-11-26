sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], function (JSONModel, Device) {
    "use strict";

    return {
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        createAppModel: function (sInitialMode) {
            var oModel = new JSONModel({
                runtimeMode: sInitialMode || "STANDALONE",
                isSideExpanded: true,
                selectedKey: "dashboard",
                activeFilterCategory: "ALL",
                activeFilterLevel: "ALL",
                searchQuery: "",
                selectedSnippetId: "SNIP_BDEF_HEADER"
            });
            return oModel;
        }
    };
});

