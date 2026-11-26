sap.ui.define([
    "sap/fiori/tech/academy/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("sap.fiori.tech.academy.controller.AdvancedLab", {

        onInit: function () {
            var oModel = new JSONModel();
            this.setModel(oModel, "advLab");

            this.getRouter().getRoute("advancedLab").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._loadAdvancedLabData();
        },

        _loadAdvancedLabData: function () {
            var that = this;
            var oModel = this.getModel("advLab");

            fetch("mockdata/advanced_lab_data.json")
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    oModel.setData(data);
                })
                .catch(function (err) {
                    console.error("Lỗi nạp advanced_lab_data.json:", err);
                });
        },

        onTabSelect: function (oEvent) {
            var sKey = oEvent.getParameter("key");
            // Tab change listener
        },

        // --- TAB 1: SECURITY & DCL LOGIC ---

        onRoleChange: function (oEvent) {
            var sRoleKey = oEvent.getParameter("selectedItem").getKey();
            var oModel = this.getModel("advLab");
            var aRoles = oModel.getProperty("/security/roles") || [];
            var oRole = aRoles.find(function (r) { return r.roleId === sRoleKey; });

            if (oRole) {
                var oPfcgObj = this.byId("txtPfcgObj");
                var oAllowed = this.byId("txtAllowedStatuses");
                var oWhere = this.byId("txtSqlWhereClause");
                var oCount = this.byId("txtRecordCount");

                if (oPfcgObj) oPfcgObj.setText(oRole.pfcgObject + " (ACTVT: " + oRole.actvt + ")");
                if (oAllowed) oAllowed.setText(oRole.allowedStatuses.join(", "));
                if (oWhere) {
                    var sStatuses = oRole.allowedStatuses.map(function (s) { return "'" + s + "'"; }).join(", ");
                    oWhere.setText("WHERE StatusCode IN (" + sStatuses + ")");
                }
                if (oCount) {
                    oCount.setText(oRole.viewableCount + " / 10 Bản ghi (" + (oRole.viewableCount * 10) + "% Khả dụng)");
                    oCount.setState(oRole.viewableCount > 5 ? "Success" : "Warning");
                }

                MessageToast.show("Đã áp dụng ngữ cảnh phân quyền DCL cho vai trò: " + oRole.roleId);
            }
        },

        onCopyDclCode: function () {
            var oModel = this.getModel("advLab");
            var sCode = oModel.getProperty("/security/dclCode");
            this._copyToClipboard(sCode, "Đã sao chép mã nguồn CDS Access Control (DCL)!");
        },

        onSimulateCsrfFetch: function () {
            var oBox = this.byId("csrfResultBox");
            var oBtnPost = this.byId("btnSendPostWithCsrf");

            if (oBox) oBox.setVisible(true);
            if (oBtnPost) oBtnPost.setEnabled(true);

            MessageToast.show("Bắt tay thành công! Nhận token: A9B2C4D8E0F1234567890ABCDEF12345==");
        },

        onSimulatePostWithCsrf: function () {
            MessageBox.success(
                "Yêu cầu POST ghi dữ liệu thành công (HTTP 201 Created)!\n\n" +
                "Header X-CSRF-Token và Session Cookie đã được kiểm chứng hợp lệ bởi SAP Gateway Security Filter.",
                { title: "Bảo Mật CSRF Được Xác Nhận" }
            );
        },

        // --- TAB 2: INTEGRATION & SM59 LOGIC ---

        onPingDestination: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext("advLab");
            if (oContext) {
                var sDest = oContext.getProperty("destination");
                var sTime = oContext.getProperty("responseTime");
                MessageToast.show("Ping thành công tới " + sDest + "! Thời gian phản hồi: " + sTime);
            }
        },

        onCopyProxyYaml: function () {
            var oModel = this.getModel("advLab");
            var sYaml = oModel.getProperty("/integration/proxyConfigYaml");
            this._copyToClipboard(sYaml, "Đã sao chép cấu hình Proxy Middleware (ui5.yaml)!");
        },

        // --- TAB 3: TESTING & QA LOGIC ---

        onOpenQUnitRunner: function () {
            window.open("test/unit/unitTests.qunit.html", "_blank");
        },

        onOpenOpa5Runner: function () {
            window.open("test/integration/opaTests.qunit.html", "_blank");
        },

        onViewAbapUnitTestCode: function () {
            var oPanel = this.byId("abapUnitPanel");
            if (oPanel) {
                oPanel.setExpanded(!oPanel.getExpanded());
            }
        },

        onCopyAbapUnitCode: function () {
            var oModel = this.getModel("advLab");
            var sCode = oModel.getProperty("/testing/abapUnitCode");
            this._copyToClipboard(sCode, "Đã sao chép mã nguồn ABAP Unit Test for RAP!");
        },

        // --- TAB 4: DEPLOYMENT & FLP LOGIC ---

        onPreviewTilePress: function () {
            MessageToast.show("Đang mở ứng dụng theo Target Mapping: #DemoTechnicalApp-display...");
            this.navTo("dashboard");
        },

        onDownloadDeployYaml: function () {
            var sContent = "# ui5-deploy.yaml: Cấu hình Deploy ứng dụng SAP Fiori vào SAP ABAP BSP Repository\n" +
                "specVersion: '3.0'\n" +
                "metadata:\n" +
                "  name: sap.fiori.tech.academy\n" +
                "type: application\n" +
                "builder:\n" +
                "  resources:\n" +
                "    excludes:\n" +
                "      - '/test/**'\n" +
                "      - '/localService/**'\n" +
                "  customTasks:\n" +
                "    - name: ui5-task-zipper\n" +
                "      afterTask: generateComponentPreload\n" +
                "      configuration:\n" +
                "        archiveName: ZFIORI_TECH_APP\n" +
                "    - name: deploy-to-abap\n" +
                "      afterTask: ui5-task-zipper\n" +
                "      configuration:\n" +
                "        target:\n" +
                "          url: http://s4h2025.corp.internal:8000\n" +
                "          client: '100'\n" +
                "        app:\n" +
                "          name: ZFIORI_TECH_APP\n" +
                "          package: ZNGHIANDD_TEST\n" +
                "          transport: S4DK911884\n";

            var blob = new Blob([sContent], { type: "text/yaml;charset=utf-8;" });
            var url = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "ui5-deploy.yaml");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            MessageToast.show("Đã tải xuống file ui5-deploy.yaml!");
        },

        // --- HELPER METHODS ---

        _copyToClipboard: function (sText, sMsg) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(sText).then(function () {
                    MessageToast.show(sMsg);
                }).catch(function () {
                    MessageToast.show("Vui lòng sao chép thủ công.");
                });
            } else {
                var oTemp = document.createElement("textarea");
                oTemp.value = sText;
                document.body.appendChild(oTemp);
                oTemp.select();
                document.execCommand("copy");
                document.body.removeChild(oTemp);
                MessageToast.show(sMsg);
            }
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

