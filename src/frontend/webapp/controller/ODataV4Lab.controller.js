sap.ui.define([
    "sap/fiori/tech/academy/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("sap.fiori.tech.academy.controller.ODataV4Lab", {
        onInit: function () {
            var oModel = new JSONModel({
                queryPresets: [],
                activeQuery: {
                    entity: "DemoHeader",
                    select: "HeaderId,Title,Category,TotalAmount,CurrencyCode,Status",
                    expand: "_Items($select=ItemId,ItemName,Quantity,UnitPrice,LineTotal)",
                    filter: "Status eq 'Verified'",
                    orderby: "TotalAmount desc",
                    top: 5,
                    skip: 0
                },
                generatedUrl: "",
                rawResponseJson: "",
                responseStatus: "HTTP 200 OK (Sẵn sàng)",
                responseState: "Success",
                boundActionPayload: "POST /mock/odata/v4/demo/DemoHeader('HDR-001')/markAsVerified HTTP/1.1\nContent-Type: application/json;odata.metadata=minimal\nIf-Match: W/\"datetimeoffset'2026-11-07T08:00:00.0000000Z'\"\n\n{}",
                unboundFunctionResult: "",
                batchSample: {},
                batchResponseRaw: "",
                etagDemo: {
                    currentServerEtag: "W/\"datetimeoffset'2026-11-07T08:00:00.0000000Z'\"",
                    userAHasConflict: false
                },
                etagLogs: [
                    {
                        title: "Khởi Tạo Phiên Làm Việc",
                        details: "Server cấp phát ETag ban đầu V1: W/\"datetimeoffset'2026-11-07T08:00:00.0000000Z'\"",
                        status: "Synced",
                        icon: "sap-icon://sys-enter-2",
                        state: "Success"
                    }
                ]
            });

            this.setModel(oModel, "odataModel");

            this.getRouter().getRoute("odataLab").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._loadData();
            this._generateUrl();
            this.onExecuteQuery();
        },

        _loadData: function () {
            var that = this;
            var oModel = this.getModel("odataModel");

            fetch("mockdata/odata_v4_deepdive.json")
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    oModel.setProperty("/queryPresets", data.queryPresets);
                    oModel.setProperty("/batchSample", data.batchSample);
                    oModel.setProperty("/etagDemoTemplate", data.etagDemo);

                    // Setup sample batch response
                    var sBoundary = data.batchSample.boundary || "batch_sap_boundary";
                    var sChangeSet = data.batchSample.changeSetBoundary || "changeset_demo";
                    var sBatchResponse = "--" + sBoundary + "\n" +
                        "Content-Type: multipart/mixed; boundary=" + sChangeSet + "\n\n" +
                        "--" + sChangeSet + "\n" +
                        "Content-Type: application/http\n" +
                        "Content-Transfer-Encoding: binary\n" +
                        "Content-ID: 1\n\n" +
                        "HTTP/1.1 201 Created\n" +
                        "OData-Version: 4.0\n" +
                        "ETag: W/\"datetimeoffset'2026-11-07T08:10:00.0000000Z'\"\n" +
                        "Location: DemoHeader('HDR-NEW')\n\n" +
                        "{\"HeaderId\":\"HDR-NEW\",\"Title\":\"Kiến Trúc RAP Managed Draft\",\"Status\":\"In Progress\"}\n\n" +
                        "--" + sChangeSet + "\n" +
                        "Content-Type: application/http\n" +
                        "Content-Transfer-Encoding: binary\n" +
                        "Content-ID: 2\n\n" +
                        "HTTP/1.1 201 Created\n" +
                        "Location: DemoItem(HeaderId='HDR-NEW',ItemId='ITM-01')\n\n" +
                        "{\"HeaderId\":\"HDR-NEW\",\"ItemId\":\"ITM-01\",\"LineTotal\":1200.00}\n\n" +
                        "--" + sChangeSet + "--\n" +
                        "--" + sBoundary + "--";
                    oModel.setProperty("/batchResponseRaw", sBatchResponse);
                })
                .catch(function (err) {
                    console.error("Lỗi nạp mockdata odata v4:", err);
                });
        },

        _buildQueryString: function (q) {
            var aParams = [];
            if (q.select) aParams.push("$select=" + encodeURIComponent(q.select.trim()));
            if (q.expand) aParams.push("$expand=" + encodeURIComponent(q.expand.trim()));
            if (q.filter) aParams.push("$filter=" + encodeURIComponent(q.filter.trim()));
            if (q.orderby) aParams.push("$orderby=" + encodeURIComponent(q.orderby.trim()));
            if (q.top !== undefined && q.top !== null && q.top !== "") aParams.push("$top=" + q.top);
            if (q.skip !== undefined && q.skip !== null && q.skip !== "") aParams.push("$skip=" + q.skip);
            aParams.push("$count=true");
            return aParams.length > 0 ? "?" + aParams.join("&") : "";
        },

        _generateUrl: function () {
            var oModel = this.getModel("odataModel");
            var q = oModel.getProperty("/activeQuery");
            if (!q) return;

            var sQueryString = this._buildQueryString(q);
            var sFullUrl = "GET /mock/odata/v4/demo/" + q.entity + sQueryString;
            oModel.setProperty("/generatedUrl", sFullUrl);
        },

        onQueryParamChange: function () {
            this._generateUrl();
        },

        onPresetSelectChange: function (oEvent) {
            var sKey = oEvent.getParameter("selectedItem").getKey();
            var oModel = this.getModel("odataModel");
            var aPresets = oModel.getProperty("/queryPresets") || [];
            var oPreset = aPresets.find(function (p) { return p.id === sKey; });

            if (oPreset) {
                var oActive = {
                    entity: oPreset.entity,
                    select: oPreset.select,
                    expand: oPreset.expand,
                    filter: oPreset.filter,
                    orderby: oPreset.orderby,
                    top: oPreset.top,
                    skip: oPreset.skip
                };
                oModel.setProperty("/activeQuery", oActive);
                this._generateUrl();
                this.onExecuteQuery();
                MessageToast.show("Đã áp dụng mẫu truy vấn: " + oPreset.name);
            }
        },

        onExecuteQuery: function () {
            var oModel = this.getModel("odataModel");
            var q = oModel.getProperty("/activeQuery");
            if (!q) return;

            var sRequestPath = "/mock/odata/v4/demo/" + q.entity + this._buildQueryString(q);
            oModel.setProperty("/generatedUrl", "GET " + sRequestPath);
            oModel.setProperty("/responseStatus", "Đang gọi fe-mockserver...");
            oModel.setProperty("/responseState", "Information");

            fetch(sRequestPath, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }).then(function (res) {
                return res.text().then(function (sBody) {
                    var oParsed = null;
                    try {
                        oParsed = JSON.parse(sBody);
                    } catch (e) {
                        oParsed = { rawBody: sBody };
                    }

                    oModel.setProperty("/rawResponseJson", JSON.stringify(oParsed, null, 2));

                    if (res.ok) {
                        var aRows = (oParsed && Array.isArray(oParsed.value)) ? oParsed.value : [];
                        oModel.setProperty("/responseStatus", "HTTP " + res.status + " " + res.statusText + " (" + aRows.length + " bản ghi từ fe-mockserver)");
                        oModel.setProperty("/responseState", "Success");
                        MessageToast.show("Đã nhận phản hồi OData V4 thật từ fe-mockserver (" + aRows.length + " bản ghi)!");
                    } else {
                        oModel.setProperty("/responseStatus", "HTTP " + res.status + " " + res.statusText);
                        oModel.setProperty("/responseState", "Error");
                        MessageToast.show("fe-mockserver trả về lỗi HTTP " + res.status + " (xem chi tiết Response Body)");
                    }
                });
            }).catch(function (err) {
                oModel.setProperty("/rawResponseJson", JSON.stringify({ error: err.message }, null, 2));
                oModel.setProperty("/responseStatus", "Lỗi kết nối mạng");
                oModel.setProperty("/responseState", "Error");
            });
        },

        onResetQuery: function () {
            var oModel = this.getModel("odataModel");
            oModel.setProperty("/activeQuery", {
                entity: "DemoHeader",
                select: "HeaderId,Title,Category,TotalAmount,CurrencyCode,Status",
                expand: "_Items",
                filter: "",
                orderby: "HeaderId asc",
                top: 5,
                skip: 0
            });
            this._generateUrl();
            this.onExecuteQuery();
            MessageToast.show("Đã đặt lại thông số truy vấn ban đầu.");
        },

        // --- BOUND & UNBOUND OPERATIONS ---

        onExecuteBoundAction: function () {
            var oModel = this.getModel("odataModel");
            var oResult = {
                "@odata.context": "$metadata#DemoHeader/$entity",
                "HeaderId": "HDR-001",
                "Status": "Verified",
                "StatusCriticality": 3,
                "LocalLastChangedAt": new Date().toISOString(),
                "@Common.SideEffects": {
                    "refreshedProperties": ["Status", "StatusCriticality", "LocalLastChangedAt"]
                }
            };
            oModel.setProperty("/boundActionPayload", "HTTP/1.1 200 OK\nContent-Type: application/json;odata.metadata=minimal\nETag: W/\"datetimeoffset'" + new Date().toISOString() + "'\"\n\n" + JSON.stringify(oResult, null, 2));
            MessageToast.show("Đã thực thi Bound Action markAsVerified trên Header HDR-001!");
        },

        onExecuteUnboundFunction: function () {
            var oModel = this.getModel("odataModel");
            var oReport = {
                "@odata.context": "$metadata#SystemHealthReport",
                "kernelVersion": "7.93 PL 100",
                "abapPlatformRelease": "816 (S/4HANA 2025)",
                "activeWorkProcesses": 48,
                "freeBufferMemoryMb": 4096,
                "dbResponseTimeMs": 2.4,
                "timestamp": new Date().toISOString()
            };
            oModel.setProperty("/unboundFunctionResult", JSON.stringify(oReport, null, 2));
            MessageToast.show("Unbound Function getSystemHealthReport() trả về 200 OK!");
        },

        onSimulateBatchExecution: function () {
            MessageToast.show("Đã gửi gói tin Multipart $batch. Toàn bộ ChangeSet được tạo thành công!");
        },

        // --- ETAG OPTIMISTIC CONCURRENCY CONTROL ---

        onUserBCommit: function () {
            var oModel = this.getModel("odataModel");
            var sNewEtag = "W/\"datetimeoffset'2026-11-07T08:05:00.0000000Z'\"";
            oModel.setProperty("/etagDemo/currentServerEtag", sNewEtag);

            var aLogs = oModel.getProperty("/etagLogs") || [];
            aLogs.unshift({
                title: "Kỹ Sư B Cập Nhật & Commit Thành Công",
                details: "User B gửi If-Match: V1 -> Server cập nhật dữ liệu và nâng ETag lên: " + sNewEtag,
                status: "204 No Content",
                icon: "sap-icon://accept",
                state: "Success"
            });
            oModel.setProperty("/etagLogs", aLogs);
            MessageToast.show("Kỹ sư B đã commit thành công. ETag trên server đã đổi sang V2!");
        },

        onUserAConflictCommit: function () {
            var oModel = this.getModel("odataModel");
            var aLogs = oModel.getProperty("/etagLogs") || [];
            aLogs.unshift({
                title: "Kỹ Sư A Bị Từ Chối (Lost Update Blocked)",
                details: "User A gửi If-Match: V1 nhưng Server hiện đang ở V2. Kích hoạt ngoại lệ CX_RAP_ETAG_CONFLICT.",
                status: "HTTP 412 Precondition Failed",
                icon: "sap-icon://alert",
                state: "Error"
            });
            oModel.setProperty("/etagLogs", aLogs);

            MessageBox.error(
                "HTTP 412 Precondition Failed:\n\nDữ liệu của thực thể 'HDR-001' đã bị sửa đổi bởi Kỹ Sư B trên máy chủ.\nHeader If-Match của bạn không còn khớp với ETag hiện tại.\n\nVui lòng làm mới (Refresh) dữ liệu trước khi thực hiện lại.",
                { title: "Optimistic Concurrency Conflict (ETag Mismatch)" }
            );
        },

        onUserAResolveConflict: function () {
            var oModel = this.getModel("odataModel");
            var sCurrentServer = oModel.getProperty("/etagDemo/currentServerEtag");

            var aLogs = oModel.getProperty("/etagLogs") || [];
            aLogs.unshift({
                title: "Kỹ Sư A Đã Đồng Bộ ETag Mới",
                details: "User A đã tải lại dữ liệu mới nhất kèm ETag: " + sCurrentServer + ". Sẵn sàng cập nhật an toàn.",
                status: "Resolved",
                icon: "sap-icon://sys-enter-2",
                state: "Success"
            });
            oModel.setProperty("/etagLogs", aLogs);
            MessageToast.show("Đã giải quyết xung đột! Dữ liệu của Kỹ sư A đã được đồng bộ với Server.");
        },

        onNavBack: function () {
            this.navTo("dashboard");
        }
    });
});

