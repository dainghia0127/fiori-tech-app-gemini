sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/fiori/tech/academy/model/models"
], function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("sap.fiori.tech.academy.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            // Gọi phương thức khởi tạo của lớp cha
            UIComponent.prototype.init.apply(this, arguments);

            // Thiết lập Device Model
            this.setModel(models.createDeviceModel(), "device");

            // Khởi tạo Runtime Mode từ LocalStorage (mặc định STANDALONE)
            var sStoredMode = localStorage.getItem("academy_runtime_mode") || "STANDALONE";
            var oAppModel = models.createAppModel(sStoredMode);
            this.setModel(oAppModel, "appView");

            // Khởi tạo Router và điều hướng trang
            this.getRouter().initialize();
        }
    });
});

