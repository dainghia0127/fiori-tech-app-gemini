sap.ui.define([
    "sap/fiori/tech/academy/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, Filter, FilterOperator, MessageToast) {
    "use strict";

    return BaseController.extend("sap.fiori.tech.academy.controller.UserManual", {

        onInit: function () {
            var oModel = new JSONModel();
            this.setModel(oModel, "userManual");

            this.getRouter().getRoute("userManual").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._loadManualData();
        },

        _loadManualData: function () {
            var that = this;
            var oModel = this.getModel("userManual");

            fetch("mockdata/user_manual.json")
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    oModel.setData(data);
                    if (data.sections && data.sections.length > 0) {
                        var oCurr = oModel.getProperty("/selectedSection");
                        if (!oCurr) {
                            oModel.setProperty("/selectedSection", data.sections[0]);
                            setTimeout(function () {
                                that._syncListSelection(data.sections[0].id);
                            }, 100);
                        } else {
                            setTimeout(function () {
                                that._syncListSelection(oCurr.id);
                            }, 100);
                        }
                    }
                })
                .catch(function (err) {
                    console.error("Lỗi khi tải dữ liệu user_manual.json:", err);
                });
        },

        onSectionSelect: function (oEvent) {
            var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
            var oContext = oItem.getBindingContext("userManual");
            if (oContext) {
                var oSection = oContext.getObject();
                this.getModel("userManual").setProperty("/selectedSection", oSection);
            }
        },

        onNextSection: function () {
            var oModel = this.getModel("userManual");
            var aSections = oModel.getProperty("/sections");
            var oCurrent = oModel.getProperty("/selectedSection");
            if (!aSections || !oCurrent) {
                return;
            }
            var iIdx = -1;
            for (var i = 0; i < aSections.length; i++) {
                if (aSections[i].id === oCurrent.id) {
                    iIdx = i;
                    break;
                }
            }
            if (iIdx >= 0 && iIdx < aSections.length - 1) {
                var oNext = aSections[iIdx + 1];
                oModel.setProperty("/selectedSection", oNext);
                this._syncListSelection(oNext.id);
                MessageToast.show("Đã chuyển tới: " + oNext.index + ". " + oNext.title);
            } else {
                MessageToast.show("Bạn đang xem phân hệ cuối cùng (10/10)!");
            }
        },

        onPreviousSection: function () {
            var oModel = this.getModel("userManual");
            var aSections = oModel.getProperty("/sections");
            var oCurrent = oModel.getProperty("/selectedSection");
            if (!aSections || !oCurrent) {
                return;
            }
            var iIdx = -1;
            for (var i = 0; i < aSections.length; i++) {
                if (aSections[i].id === oCurrent.id) {
                    iIdx = i;
                    break;
                }
            }
            if (iIdx > 0) {
                var oPrev = aSections[iIdx - 1];
                oModel.setProperty("/selectedSection", oPrev);
                this._syncListSelection(oPrev.id);
                MessageToast.show("Đã quay lại: " + oPrev.index + ". " + oPrev.title);
            } else {
                MessageToast.show("Bạn đang ở phân hệ đầu tiên (01/10)!");
            }
        },

        _syncListSelection: function (sId) {
            var oList = this.byId("manualSectionList");
            if (!oList) {
                return;
            }
            var aItems = oList.getItems();
            for (var i = 0; i < aItems.length; i++) {
                var oCtx = aItems[i].getBindingContext("userManual");
                if (oCtx && oCtx.getProperty("id") === sId) {
                    oList.setSelectedItem(aItems[i], true);
                    break;
                }
            }
        },

        onSearchManualLiveChange: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var aFilters = [];

            if (sQuery && sQuery.trim()) {
                var q = sQuery.trim().toLowerCase();
                aFilters.push(new Filter({
                    filters: [
                        new Filter("title", FilterOperator.Contains, q),
                        new Filter("summary", FilterOperator.Contains, q),
                        new Filter("category", FilterOperator.Contains, q),
                        new Filter("description", FilterOperator.Contains, q)
                    ],
                    and: false
                }));
            }

            var oList = this.byId("manualSectionList");
            if (oList) {
                var oBinding = oList.getBinding("items");
                if (oBinding) {
                    oBinding.filter(aFilters);
                }
            }
        },

        onNavigateToFeature: function () {
            var oModel = this.getModel("userManual");
            var oSection = oModel.getProperty("/selectedSection");
            if (oSection && oSection.targetRoute) {
                MessageToast.show("Đang chuyển tới chức năng: " + oSection.title);
                this.navTo(oSection.targetRoute);
            }
        },

        onDownloadUserManualMd: function () {
            fetch("../../docs/USER_MANUAL.md")
                .then(function (res) {
                    if (!res.ok) {
                        return fetch("/docs/USER_MANUAL.md");
                    }
                    return res;
                })
                .then(function (res) { return res.text(); })
                .then(function (sMarkdown) {
                    var blob = new Blob([sMarkdown], { type: "text/markdown;charset=utf-8;" });
                    var url = URL.createObjectURL(blob);
                    var link = document.createElement("a");
                    link.setAttribute("href", url);
                    link.setAttribute("download", "USER_MANUAL.md");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    MessageToast.show("Đã tải xuống file USER_MANUAL.md thành công!");
                })
                .catch(function () {
                    window.open("docs/USER_MANUAL.md", "_blank");
                });
        },

        onNavBack: function () {
            this.navTo("dashboard");
        },

        onNavToGuideline: function () {
            this.openGuidelineWorkspace();
        },

        onNavToErrorPlaybook: function () {
            this.navTo("errorPlaybook");
        }
    });
});
