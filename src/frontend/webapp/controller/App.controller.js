sap.ui.define([
    "sap/fiori/tech/academy/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
], function (BaseController, Fragment, MessageBox) {
    "use strict";

    return BaseController.extend("sap.fiori.tech.academy.controller.App", {
        onInit: function () {
            // Đồng bộ selectedKey của menu khi route thay đổi
            this.getRouter().attachRouteMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sRouteName = oEvent.getParameter("name");
            var oAppModel = this.getModel("appView");
            var oToolPage = this.byId("toolPage");
            var oSideNav = this.byId("sideNavigation");
            var oToolHeader = this.byId("toolHeader");
            var bIsWorkspace = window.location.search.indexOf("workspace=guideline") >= 0;

            // Tự động ẩn menu trái mặc định khi mở Guideline (để cột trái hiển thị Cây Thư Mục Dự Án)
            var bGuidelineFocus = (sRouteName === "guideline");
            if (oSideNav && oSideNav.setVisible) {
                oSideNav.setVisible(!bGuidelineFocus);
            }
            if (oToolHeader && oToolHeader.setVisible) {
                oToolHeader.setVisible(!(bGuidelineFocus && bIsWorkspace));
            }
            if (oToolPage) {
                oToolPage.toggleStyleClass("academyWorkspaceMode", bGuidelineFocus);
            }
            if (bGuidelineFocus) {
                oAppModel.setProperty("/isSideExpanded", false);
            } else {
                oAppModel.setProperty("/isSideExpanded", true);
            }

            if (sRouteName === "dashboard" || !sRouteName) {
                oAppModel.setProperty("/selectedKey", "dashboard");
            } else if (sRouteName === "catalog") {
                oAppModel.setProperty("/selectedKey", "catalog");
            } else if (sRouteName === "code" || sRouteName === "codeDefault") {
                oAppModel.setProperty("/selectedKey", "code");
            } else if (sRouteName === "feLab") {
                oAppModel.setProperty("/selectedKey", "feLab");
            } else if (sRouteName === "freestyleLab") {
                oAppModel.setProperty("/selectedKey", "freestyleLab");
            } else if (sRouteName === "odataLab") {
                oAppModel.setProperty("/selectedKey", "odataLab");
            } else if (sRouteName === "advancedLab") {
                oAppModel.setProperty("/selectedKey", "advancedLab");
            } else if (sRouteName === "guideline" || sRouteName === "errorPlaybook" || sRouteName === "userManual") {
                // Tách biệt khỏi menu trái, xóa highlight cũ trên sideNavigation
                oAppModel.setProperty("/selectedKey", "");
                if (oSideNav && oSideNav.setSelectedItem) {
                    oSideNav.setSelectedItem(null);
                }
            } else if (sRouteName === "architecture") {
                oAppModel.setProperty("/selectedKey", "architecture");
            }
        },

        onSideNavToggle: function () {
            var oAppModel = this.getModel("appView");
            var bExpanded = oAppModel.getProperty("/isSideExpanded");
            oAppModel.setProperty("/isSideExpanded", !bExpanded);
        },

        onItemSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            var sKey = oItem.getKey();

            switch (sKey) {
                case "dashboard":
                    this.navTo("dashboard");
                    break;
                case "catalog":
                    this.navTo("catalog");
                    break;
                case "code":
                    this.navTo("codeDefault");
                    break;
                case "feLab":
                    this.navTo("feLab");
                    break;
                case "freestyleLab":
                    this.navTo("freestyleLab");
                    break;
                case "odataLab":
                    this.navTo("odataLab");
                    break;
                case "advancedLab":
                    this.navTo("advancedLab");
                    break;
                case "guideline":
                    this.navTo("guideline");
                    break;
                case "errorPlaybook":
                    this.navTo("errorPlaybook");
                    break;
                case "userManual":
                    this.navTo("userManual");
                    break;
                case "architecture":
                    this.navTo("architecture");
                    break;
                default:
                    this.navTo("dashboard");
                    break;
            }
        },

        onNavToGuideline: function () {
            this.openGuidelineWorkspace();
        },

        onNavToAdvancedLab: function () {
            this.navTo("advancedLab");
        },

        onNavToErrorPlaybook: function () {
            this.navTo("errorPlaybook");
        },

        onNavToUserManual: function () {
            this.navTo("userManual");
        },

        onNavToArchitecture: function () {
            this.navTo("architecture");
        },

        // --- RUNTIME MODE SELECTOR LOGIC ---

        onOpenModeDialog: function () {
            var oView = this.getView();
            var oAppModel = this.getModel("appView");
            var sCurrentMode = oAppModel.getProperty("/runtimeMode");

            if (!this._pModeDialog) {
                this._pModeDialog = Fragment.load({
                    id: oView.getId(),
                    name: "sap.fiori.tech.academy.fragment.ModeSelectorDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pModeDialog.then(function (oDialog) {
                // Đồng bộ RadioButtonGroup theo chế độ hiện tại
                var oRadioGroup = Fragment.byId(oView.getId(), "modeRadioGroup");
                if (oRadioGroup) {
                    oRadioGroup.setSelectedIndex(sCurrentMode === "SAP_CONNECTED" ? 1 : 0);
                }
                oDialog.open();
            });
        },

        onCloseModeDialog: function () {
            if (this._pModeDialog) {
                this._pModeDialog.then(function (oDialog) {
                    oDialog.close();
                });
            }
        },

        onConfirmModeSwitch: function () {
            var oView = this.getView();
            var oRadioGroup = Fragment.byId(oView.getId(), "modeRadioGroup");
            var iSelectedIndex = oRadioGroup ? oRadioGroup.getSelectedIndex() : 0;
            var sNewMode = iSelectedIndex === 1 ? "SAP_CONNECTED" : "STANDALONE";

            var oAppModel = this.getModel("appView");
            var sOldMode = oAppModel.getProperty("/runtimeMode");

            this.onCloseModeDialog();

            if (sNewMode !== sOldMode) {
                MessageBox.information(
                    "Ứng dụng sẽ nạp lại trang để tái khởi tạo mô hình kết nối và các bộ đệm OData V4 sang chế độ: " +
                    (sNewMode === "SAP_CONNECTED" ? "SAP S/4HANA Connected (PQPOC 100)" : "Standalone Mock Engine") + ".",
                    {
                        title: "Khởi động lại Phiên làm việc",
                        actions: [MessageBox.Action.OK],
                        onClose: function () {
                            localStorage.setItem("academy_runtime_mode", sNewMode);
                            window.location.reload();
                        }
                    }
                );
            }
        }
    });
});

