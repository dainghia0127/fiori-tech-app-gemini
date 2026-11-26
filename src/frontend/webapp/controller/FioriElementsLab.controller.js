sap.ui.define([
    "sap/fiori/tech/academy/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, Filter, FilterOperator, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("sap.fiori.tech.academy.controller.FioriElementsLab", {
        onInit: function () {
            var oViewModel = new JSONModel({
                headers: [],
                allItems: [],
                selectedHeader: null,
                selectedItems: [],
                hasSelection: false,
                sideEffectsDemo: {
                    itemId: "ITM-010",
                    quantity: 2,
                    unitPrice: 720.25,
                    lineTotal: 1440.50,
                    headerTotal: 2840.50,
                    formattedLineTotal: "$1,440.50",
                    formattedHeaderTotal: "$2,840.50"
                },
                sideEffectsLogs: [
                    {
                        event: "Hệ thống Khởi tạo",
                        details: "Đã nạp quy tắc @Common.SideEffects: Source [Quantity, UnitPrice] -> Target [LineTotal, _Header/TotalAmount]",
                        timestamp: new Date().toLocaleTimeString(),
                        icon: "sap-icon://sys-enter-2"
                    }
                ],
                buildingBlocks: [
                    {
                        name: "FilterBar Macro",
                        tag: "<macros:FilterBar>",
                        metaPath: "@UI.SelectionFields",
                        description: "Tự động sinh bộ lọc tìm kiếm đa tiêu chí dựa trên annotation SelectionFields."
                    },
                    {
                        name: "Table Macro",
                        tag: "<macros:Table>",
                        metaPath: "@UI.LineItem",
                        description: "Tự động kết xuất bảng dữ liệu, phân trang, định dạng cột và nút thao tác từ LineItem."
                    },
                    {
                        name: "Field Macro",
                        tag: "<macros:Field>",
                        metaPath: "DemoHeader/Status",
                        description: "Tự động kết xuất input hoặc text kèm semantic colors (Criticality) và value helps."
                    },
                    {
                        name: "Chart Macro",
                        tag: "<macros:Chart>",
                        metaPath: "@UI.Chart",
                        description: "Kết xuất biểu đồ phân tích tương tác trực quan từ metadata khai báo."
                    }
                ],
                fpmMacroSnippet: '<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:macros="sap.fe.macros">\n  <!-- FPM: Nhúng trực tiếp FilterBar và Table vào Custom Page -->\n  <macros:FilterBar id="fbMain" metaPath="@UI.SelectionFields" />\n  <macros:Table id="tblHeaders" metaPath="@UI.LineItem" filterBar="fbMain" />\n</mvc:View>',
                fpmExtensionLogs: [
                    {
                        action: "Controller Extension Ready",
                        message: "Khởi tạo thành công extension: sap.fiori.tech.academy.ext.controller.ListReportExtension",
                        timestamp: new Date().toLocaleTimeString(),
                        icon: "sap-icon://sys-enter-2"
                    }
                ],
                rawAnnotationsXml: "",
                rawMetadataXml: "",
                rawExtensionJs: ""
            });

            this.setModel(oViewModel, "feModel");

            this.getRouter().getRoute("feLab").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._loadData();
            this._loadXmlAssets();
        },

        _loadData: function () {
            var that = this;
            var oModel = this.getModel("feModel");

            // Fetch Headers and Items from localService mockdata or fe-mockserver
            Promise.all([
                fetch("localService/mockdata/DemoHeader.json").then(function (r) { return r.json(); }),
                fetch("localService/mockdata/DemoItem.json").then(function (r) { return r.json(); })
            ]).then(function (aResults) {
                var aHeaders = aResults[0];
                var aItems = aResults[1];

                oModel.setProperty("/headers", aHeaders);
                oModel.setProperty("/allItems", aItems);

                // Auto-select first header
                if (aHeaders && aHeaders.length > 0) {
                    that._selectHeader(aHeaders[0]);
                }
            }).catch(function (err) {
                console.error("Error loading mockdata:", err);
            });
        },

        _loadXmlAssets: function () {
            var oModel = this.getModel("feModel");

            fetch("localService/annotations.xml").then(function (r) { return r.text(); })
                .then(function (text) { oModel.setProperty("/rawAnnotationsXml", text); });

            fetch("localService/metadata.xml").then(function (r) { return r.text(); })
                .then(function (text) { oModel.setProperty("/rawMetadataXml", text); });

            fetch("ext/controller/ListReportExtension.controller.js").then(function (r) { return r.text(); })
                .then(function (text) { oModel.setProperty("/rawExtensionJs", text); });
        },

        _selectHeader: function (oHeader) {
            var oModel = this.getModel("feModel");
            var aAllItems = oModel.getProperty("/allItems") || [];

            var aFilteredItems = aAllItems.filter(function (item) {
                return item.HeaderId === oHeader.HeaderId;
            });

            oModel.setProperty("/selectedHeader", Object.assign({}, oHeader));
            oModel.setProperty("/selectedItems", aFilteredItems);
            oModel.setProperty("/hasSelection", true);

            // Populate combo in Tab 2
            var oCombo = this.byId("seItemSelect");
            if (oCombo && aFilteredItems.length > 0) {
                oCombo.removeAllItems();
                aFilteredItems.forEach(function (itm) {
                    oCombo.addItem(new sap.ui.core.Item({
                        key: itm.ItemId,
                        text: itm.ItemId + " - " + itm.ItemName
                    }));
                });
                oCombo.setSelectedKey(aFilteredItems[0].ItemId);
            }
        },

        onHeaderSelect: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            if (!oSelectedItem) return;

            var oContext = oSelectedItem.getBindingContext("feModel");
            if (oContext) {
                this._selectHeader(oContext.getObject());
            }
        },

        onOpenObjectPage: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext("feModel");
            if (oContext) {
                this._selectHeader(oContext.getObject());
                var oPanel = this.byId("objectPagePanel");
                if (oPanel) {
                    oPanel.focus();
                }
                MessageToast.show("Đã mở Object Page cho: " + oContext.getProperty("HeaderId"));
            }
        },

        onExecuteVerifyAction: function () {
            var oModel = this.getModel("feModel");
            var oHeader = oModel.getProperty("/selectedHeader");
            if (!oHeader) return;

            // Execute Bound Action Simulation: markAsVerified
            oHeader.Status = "Verified";
            oHeader.StatusCriticality = 3;
            oModel.setProperty("/selectedHeader", oHeader);

            // Update in headers table list
            var aHeaders = oModel.getProperty("/headers") || [];
            aHeaders.forEach(function (h) {
                if (h.HeaderId === oHeader.HeaderId) {
                    h.Status = "Verified";
                    h.StatusCriticality = 3;
                }
            });
            oModel.setProperty("/headers", aHeaders);

            MessageToast.show("Đã thực thi Bound Action markAsVerified trên Header " + oHeader.HeaderId + "!");
        },

        onSideEffectTriggered: function () {
            var oModel = this.getModel("feModel");
            var oDemo = oModel.getProperty("/sideEffectsDemo");

            var nQty = Number(this.byId("seQuantityInput").getValue()) || 1;
            var nPrice = Number(this.byId("seUnitPriceInput").getValue()) || 50;

            var nNewLineTotal = nQty * nPrice;
            var nOldHeaderTotal = oDemo.headerTotal;
            var nDiff = nNewLineTotal - oDemo.lineTotal;
            var nNewHeaderTotal = nOldHeaderTotal + nDiff;

            oDemo.quantity = nQty;
            oDemo.unitPrice = nPrice;
            oDemo.lineTotal = nNewLineTotal;
            oDemo.headerTotal = nNewHeaderTotal;
            oDemo.formattedLineTotal = "$" + nNewLineTotal.toLocaleString("en-US", { minimumFractionDigits: 2 });
            oDemo.formattedHeaderTotal = "$" + nNewHeaderTotal.toLocaleString("en-US", { minimumFractionDigits: 2 });

            oModel.setProperty("/sideEffectsDemo", oDemo);

            // Add reaction log entry
            var aLogs = oModel.getProperty("/sideEffectsLogs") || [];
            aLogs.unshift({
                event: "@Common.SideEffects Kích hoạt Tính lại",
                details: "Thay đổi: Qty=" + nQty + ", Price=$" + nPrice + " -> Tự động tính LineTotal=" + oDemo.formattedLineTotal + " & Header Total=" + oDemo.formattedHeaderTotal,
                timestamp: new Date().toLocaleTimeString(),
                icon: "sap-icon://simulate"
            });
            oModel.setProperty("/sideEffectsLogs", aLogs);

            MessageToast.show("Side Effects: Đã cập nhật LineTotal & Header TotalAmount!");
        },

        onResetSideEffectDemo: function () {
            var oModel = this.getModel("feModel");
            var oDemo = {
                itemId: "ITM-010",
                quantity: 2,
                unitPrice: 720.25,
                lineTotal: 1440.50,
                headerTotal: 2840.50,
                formattedLineTotal: "$1,440.50",
                formattedHeaderTotal: "$2,840.50"
            };
            this.byId("seQuantityInput").setValue(2);
            this.byId("seUnitPriceInput").setValue(720.25);
            oModel.setProperty("/sideEffectsDemo", oDemo);
            MessageToast.show("Đã khôi phục dữ liệu thử nghiệm ban đầu.");
        },

        onFilterChange: function () {
            this.onApplyFilters();
        },

        onFilterLiveChange: function () {
            this.onApplyFilters();
        },

        onApplyFilters: function () {
            var sHeaderId = this.byId("filterHeaderId").getValue().trim().toUpperCase();
            var sCategory = this.byId("filterCategory").getSelectedKey();
            var sStatus = this.byId("filterStatus").getSelectedKey();

            var aFilters = [];
            if (sHeaderId) {
                aFilters.push(new Filter("HeaderId", FilterOperator.Contains, sHeaderId));
            }
            if (sCategory && sCategory !== "ALL") {
                aFilters.push(new Filter("Category", FilterOperator.EQ, sCategory));
            }
            if (sStatus && sStatus !== "ALL") {
                aFilters.push(new Filter("Status", FilterOperator.EQ, sStatus));
            }

            var oTable = this.byId("headersTable");
            var oBinding = oTable.getBinding("items");
            if (oBinding) {
                oBinding.filter(aFilters);
            }
        },

        onResetFilters: function () {
            this.byId("filterHeaderId").setValue("");
            this.byId("filterCategory").setSelectedKey("ALL");
            this.byId("filterStatus").setSelectedKey("ALL");
            this.onApplyFilters();
        },

        onSimulatePageReady: function () {
            var oModel = this.getModel("feModel");
            var aLogs = oModel.getProperty("/fpmExtensionLogs") || [];
            aLogs.unshift({
                action: "Lifecycle Hook: onPageReady",
                message: "Fiori Elements Page hoàn tất render; ControllerExtension nhận tham số mParameters thành công.",
                timestamp: new Date().toLocaleTimeString(),
                icon: "sap-icon://accept"
            });
            oModel.setProperty("/fpmExtensionLogs", aLogs);
            MessageToast.show("Đã kích hoạt Lifecycle Hook onPageReady!");
        },

        onSimulateCustomHeaderAction: function () {
            var oModel = this.getModel("feModel");
            var oHeader = oModel.getProperty("/selectedHeader");
            var sId = oHeader ? oHeader.HeaderId : "HDR-001";
            var aLogs = oModel.getProperty("/fpmExtensionLogs") || [];
            aLogs.unshift({
                action: "Custom Action Invoked",
                message: "ListReportExtension.onCustomHeaderAction được gọi trên context: " + sId,
                timestamp: new Date().toLocaleTimeString(),
                icon: "sap-icon://action"
            });
            oModel.setProperty("/fpmExtensionLogs", aLogs);
            MessageToast.show("[ControllerExtension] Custom Header Action executed!");
        },

        onSimulateExportReport: function () {
            var oModel = this.getModel("feModel");
            var aHeaders = oModel.getProperty("/headers") || [];
            var aLogs = oModel.getProperty("/fpmExtensionLogs") || [];
            aLogs.unshift({
                action: "Batch Report Generation",
                message: "Tạo báo cáo tổng hợp kỹ thuật cho toàn bộ " + aHeaders.length + " thực thể DemoHeader.",
                timestamp: new Date().toLocaleTimeString(),
                icon: "sap-icon://excel-attachment"
            });
            oModel.setProperty("/fpmExtensionLogs", aLogs);
            MessageBox.information(
                "Đã tạo báo cáo kỹ thuật tùy chỉnh cho " + aHeaders.length + " thực thể DemoHeader.\n\nĐịnh dạng xuất: Technical Architecture Metrics (OData V4 + RAP Strict 2).",
                { title: "Controller Extension: Export Technical Report" }
            );
        },

        onNavBack: function () {
            this.navTo("dashboard");
        }
    });
});

