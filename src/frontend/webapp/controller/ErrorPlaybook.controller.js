sap.ui.define([
    "sap/fiori/tech/academy/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/ResponsivePopover",
    "sap/m/Dialog",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/Text",
    "sap/m/Title",
    "sap/m/Label",
    "sap/m/Button",
    "sap/m/ObjectStatus",
    "sap/m/FormattedText",
    "sap/ui/core/Icon",
    "sap/ui/layout/Grid"
], function (
    BaseController,
    JSONModel,
    Filter,
    FilterOperator,
    MessageToast,
    ResponsivePopover,
    Dialog,
    VBox,
    HBox,
    Text,
    Title,
    Label,
    Button,
    ObjectStatus,
    FormattedText,
    Icon,
    Grid
) {
    "use strict";

    return BaseController.extend("sap.fiori.tech.academy.controller.ErrorPlaybook", {

        onInit: function () {
            var oLocalState = new JSONModel({
                currentHoverError: null,
                selectedDiffError: null,
                searchQuery: "",
                selectedCategory: "ALL",
                selectedPhase: "ALL",
                selectedSeverity: "ALL",
                filteredCount: 15
            });
            this.setModel(oLocalState, "errorViewState");

            this.getRouter().getRoute("errorPlaybook").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._ensureErrorDataLoaded();
        },

        /**
         * Nạp dữ liệu error_playbook.json vào model nếu chưa có
         */
        _ensureErrorDataLoaded: function () {
            var oModel = this.getModel("errorPlaybook");
            var that = this;

            fetch("mockdata/error_playbook.json")
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    if (oModel) {
                        oModel.setData(data);
                    } else {
                        var oNewModel = new JSONModel(data);
                        that.setModel(oNewModel, "errorPlaybook");
                        that.getOwnerComponent().setModel(oNewModel, "errorPlaybook");
                    }
                    that._updateTableCount(data.errors ? data.errors.length : 0);
                })
                .catch(function (err) {
                    console.error("Lỗi nạp error_playbook.json:", err);
                });
        },

        onRefreshData: function () {
            var that = this;
            fetch("mockdata/error_playbook.json?ts=" + Date.now())
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    var oModel = that.getModel("errorPlaybook");
                    if (oModel) {
                        oModel.setData(data);
                    } else {
                        that.setModel(new JSONModel(data), "errorPlaybook");
                    }
                    that.onResetFilters();
                    MessageToast.show("Đã nạp lại thành công 15 sự cố kỹ thuật!");
                })
                .catch(function (err) {
                    MessageToast.show("Lỗi khi tải lại dữ liệu sự cố.");
                });
        },

        /**
         * Sau khi bảng cập nhật DOM: Gắn hover listener mượt mà, an toàn
         */
        onTableUpdateFinished: function (oEvent) {
            var oTable = oEvent.getSource();
            var aItems = oTable.getItems();
            var that = this;

            aItems.forEach(function (oItem) {
                var oDomRef = oItem.getDomRef();
                if (oDomRef && !oItem._hasHoverAttached) {
                    oItem._hasHoverAttached = true;

                    // Hover listener an toàn
                    oDomRef.addEventListener("mouseenter", function () {
                        var oContext = oItem.getBindingContext("errorPlaybook");
                        if (oContext) {
                            var oData = oContext.getObject();
                            var oStateModel = that.getModel("errorViewState");
                            oStateModel.setProperty("/currentHoverError", oData);
                        }
                    });
                }
            });
        },

        /**
         * Kích hoạt Dialog chi tiết khi click vào dòng hoặc nút
         */
        onItemRowPress: function (oEvent) {
            var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
            var oContext = oItem.getBindingContext("errorPlaybook");
            if (oContext) {
                this._openErrorDetailDialog(oContext.getObject());
            }
        },

        onShowPopoverForCurrentRow: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext("errorPlaybook");
            if (oContext) {
                this._openErrorDetailDialog(oContext.getObject());
            }
        },

        _openErrorDetailPopover: function (oControl, oErrorData) {
            this._openErrorDetailDialog(oErrorData);
        },

        /**
         * Hiển thị Dialog chi tiết sự cố kỹ thuật toàn diện 6 chiều
         */
        _openErrorDetailDialog: function (oErrorData) {
            var oStateModel = this.getModel("errorViewState");
            oStateModel.setProperty("/currentHoverError", oErrorData);
            var that = this;

            if (!this._oErrorDetailDialog) {
                var oFlagIcon = new Icon({ src: "sap-icon://flag", color: "#0a6ed1", size: "1.2rem" }).addStyleClass("sapUiTinyMarginEnd");
                var oHeaderLeft = new HBox({
                    alignItems: "Center",
                    items: [
                        oFlagIcon,
                        new Title({ text: "{errorViewState>/currentHoverError/id} - {errorViewState>/currentHoverError/title}", level: "H4" })
                    ]
                });
                var oHeaderRow = new HBox({
                    justifyContent: "SpaceBetween",
                    alignItems: "Center",
                    wrap: "Wrap",
                    items: [
                        oHeaderLeft,
                        new ObjectStatus({
                            text: "{errorViewState>/currentHoverError/severity}",
                            state: "{= ${errorViewState>/currentHoverError/severity} === 'Critical' ? 'Error' : (${errorViewState>/currentHoverError/severity} === 'High' ? 'Warning' : (${errorViewState>/currentHoverError/severity} === 'Medium' ? 'Information' : 'None')) }"
                        })
                    ]
                }).addStyleClass("sapUiTinyMarginBottom");

                var oGotchaBox = new HBox({
                    items: [
                        new Icon({ src: "sap-icon://hint", color: "#e6600d" }).addStyleClass("sapUiTinyMarginEnd sapUiTinyMarginTop"),
                        new VBox({
                            items: [
                                new Label({ text: "Lưu Ý Cho Fresher:", design: "Bold" }).addStyleClass("sapUiTinyMarginBottom"),
                                new Text({ text: "{errorViewState>/currentHoverError/fresherGotcha}", wrapping: true })
                            ]
                        })
                    ]
                }).addStyleClass("errorPopoverGotchaBox sapUiSmallMarginTop");

                var oDetailBody = new VBox({
                    items: [
                        oHeaderRow,
                        new Text({
                            text: "Mã kỹ thuật: {errorViewState>/currentHoverError/errorCode} | {errorViewState>/currentHoverError/phase} ({errorViewState>/currentHoverError/categoryName})",
                            wrapping: true
                        }).addStyleClass("sapUiTextMuted sapUiSmallMarginBottom"),

                        new Label({ text: "1. Thao Tác Kích Hoạt (Làm gì bị lỗi?):", design: "Bold" }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBottom"),
                        new Text({ text: "{errorViewState>/currentHoverError/whatTriggered}", wrapping: true }).addStyleClass("sapUiSmallMarginBottom errorPopoverTriggerText"),

                        new Label({ text: "2. Triệu Chứng Lỗi (Symptom):", design: "Bold" }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBottom"),
                        new Text({ text: "{errorViewState>/currentHoverError/symptom}", wrapping: true }).addStyleClass("sapUiSmallMarginBottom errorPopoverSymptomText"),

                        new Label({ text: "3. Bản Chất Kỹ Thuật (Root Cause):", design: "Bold" }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBottom"),
                        new Text({ text: "{errorViewState>/currentHoverError/rootCause}", wrapping: true }).addStyleClass("sapUiSmallMarginBottom"),

                        new Label({ text: "4. Tư Duy Kỹ Thuật Giải Quyết (Mental Model):", design: "Bold" }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBottom"),
                        new Text({ text: "{errorViewState>/currentHoverError/thoughtProcess}", wrapping: true }).addStyleClass("sapUiSmallMarginBottom errorPopoverThoughtText"),

                        new Label({ text: "5. Hướng Dẫn Khắc Phục Từng Bước (How to fix):", design: "Bold" }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBottom"),
                        new Text({ text: "{errorViewState>/currentHoverError/howToFix}", wrapping: true }).addStyleClass("sapUiSmallMarginBottom"),

                        oGotchaBox
                    ]
                }).addStyleClass("sapUiTinyMargin");

                this._oErrorDetailDialog = new Dialog({
                    title: "🔍 Phân Tích Kỹ Thuật Sự Cố Thực Tế",
                    icon: "sap-icon://alert",
                    contentWidth: "740px",
                    contentHeight: "auto",
                    resizable: true,
                    draggable: true,
                    content: [oDetailBody],
                    beginButton: new Button({
                        icon: "sap-icon://source-code",
                        text: "Xem So Sánh Code Diff",
                        type: "Emphasized",
                        press: function () {
                            var oCurr = oStateModel.getProperty("/currentHoverError");
                            that._oErrorDetailDialog.close();
                            that._openCodeDiffDialog(oCurr);
                        }
                    }),
                    endButton: new Button({
                        text: "Đóng",
                        press: function () {
                            that._oErrorDetailDialog.close();
                        }
                    })
                }).addStyleClass("sapUiContentPadding");

                this.getView().addDependent(this._oErrorDetailDialog);
            }

            this._oErrorDetailDialog.open();
        },

        /**
         * Mở Dialog so sánh Code Before & Code After
         */
        onOpenCodeDiffForCurrentRow: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext("errorPlaybook");
            if (oContext) {
                this._openCodeDiffDialog(oContext.getObject());
            }
        },

        _openCodeDiffDialog: function (oErrorData) {
            var oStateModel = this.getModel("errorViewState");
            oStateModel.setProperty("/selectedDiffError", oErrorData);
            var that = this;

            if (!this._oCodeDiffDialog) {
                var oBeforeBox = new VBox({
                    items: [
                        new HBox({
                            justifyContent: "SpaceBetween",
                            alignItems: "Center",
                            items: [
                                new Label({ text: "❌ TRƯỚC KHI SỬA (GÂY LỖI):", design: "Bold" }),
                                new Button({
                                    icon: "sap-icon://copy",
                                    text: "Copy",
                                    type: "Transparent",
                                    press: function () {
                                        var sCode = oStateModel.getProperty("/selectedDiffError/codeBefore");
                                        that._copyToClipboard(sCode, "Đã sao chép code gây lỗi!");
                                    }
                                })
                            ]
                        }).addStyleClass("sapUiTinyMarginBottom"),
                        new Text({ text: "{errorViewState>/selectedDiffError/codeBefore}", wrapping: true }).addStyleClass("codeDiffText codeBeforeColor")
                    ]
                }).addStyleClass("codeDiffBox codeDiffBoxBefore sapUiSmallMarginBottom");

                var oAfterBox = new VBox({
                    items: [
                        new HBox({
                            justifyContent: "SpaceBetween",
                            alignItems: "Center",
                            items: [
                                new Label({ text: "✅ SAU KHI SỬA (THÀNH CÔNG):", design: "Bold" }),
                                new Button({
                                    icon: "sap-icon://copy",
                                    text: "Copy",
                                    type: "Emphasized",
                                    press: function () {
                                        var sCode = oStateModel.getProperty("/selectedDiffError/codeAfter");
                                        that._copyToClipboard(sCode, "Đã sao chép giải pháp mã nguồn!");
                                    }
                                })
                            ]
                        }).addStyleClass("sapUiTinyMarginBottom"),
                        new Text({ text: "{errorViewState>/selectedDiffError/codeAfter}", wrapping: true }).addStyleClass("codeDiffText codeAfterColor")
                    ]
                }).addStyleClass("codeDiffBox codeDiffBoxAfter sapUiSmallMarginBottom");

                var oDiffBody = new VBox({
                    items: [
                        new HBox({
                            alignItems: "Center",
                            items: [
                                new Icon({ src: "sap-icon://error", color: "#d32f2f" }).addStyleClass("sapUiTinyMarginEnd"),
                                new Title({
                                    text: "{errorViewState>/selectedDiffError/id}: {errorViewState>/selectedDiffError/title}",
                                    level: "H4"
                                })
                            ]
                        }).addStyleClass("sapUiTinyMarginBottom"),
                        new Text({
                            text: "Triệu chứng: {errorViewState>/selectedDiffError/symptom}",
                            wrapping: true
                        }).addStyleClass("sapUiTextMuted sapUiSmallMarginBottom"),

                        new Grid({
                            defaultSpan: "XL6 L6 M12 S12",
                            hSpacing: 1,
                            vSpacing: 1,
                            content: [oBeforeBox, oAfterBox]
                        }),

                        new Label({ text: "💡 Giải Thích Cốt Lõi Tại Sao Sửa Như Vậy:", design: "Bold" }).addStyleClass("sapUiSmallMarginTop sapUiTinyMarginBottom"),
                        new Text({ text: "{errorViewState>/selectedDiffError/thoughtProcess}", wrapping: true }).addStyleClass("sapUiSmallMarginBottom"),

                        new Label({ text: "📌 Các Bước Xử Lý Cụ Thể:", design: "Bold" }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBottom"),
                        new Text({ text: "{errorViewState>/selectedDiffError/howToFix}", wrapping: true }).addStyleClass("sapUiTinyMarginBottom")
                    ]
                }).addStyleClass("sapUiTinyMargin");

                this._oCodeDiffDialog = new Dialog({
                    title: "So Sánh Mã Nguồn: Trước vs Sau Khi Sửa Lỗi",
                    icon: "sap-icon://compare",
                    contentWidth: "940px",
                    contentHeight: "auto",
                    resizable: true,
                    draggable: true,
                    content: [oDiffBody],
                    beginButton: new Button({
                        icon: "sap-icon://copy",
                        text: "Sao chép Hướng Dẫn Giải Quyết",
                        press: function () {
                            var oErr = oStateModel.getProperty("/selectedDiffError");
                            var sText = "=== SỰ CỐ: " + oErr.id + " - " + oErr.title + " ===\n" +
                                        "Làm gì bị lỗi: " + oErr.whatTriggered + "\n" +
                                        "Triệu chứng: " + oErr.symptom + "\n" +
                                        "Nguyên nhân: " + oErr.rootCause + "\n" +
                                        "Tư duy giải quyết: " + oErr.thoughtProcess + "\n" +
                                        "Cách sửa: " + oErr.howToFix + "\n\n" +
                                        "--- CODE GÂY LỖI ---\n" + oErr.codeBefore + "\n\n" +
                                        "--- CODE ĐÃ SỬA ---\n" + oErr.codeAfter;
                            that._copyToClipboard(sText, "Đã sao chép trọn bộ thông tin sự cố!");
                        }
                    }),
                    endButton: new Button({
                        text: "Đóng",
                        press: function () {
                            that._oCodeDiffDialog.close();
                        }
                    })
                }).addStyleClass("sapUiContentPadding");

                this.getView().addDependent(this._oCodeDiffDialog);
            }

            this._oCodeDiffDialog.open();
        },

        onCopySolutionForCurrentRow: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext("errorPlaybook");
            if (oContext) {
                var oErr = oContext.getObject();
                var sText = "=== SỰ CỐ: " + oErr.id + " - " + oErr.title + " ===\n" +
                            "Cách sửa: " + oErr.howToFix + "\n" +
                            "Code đã sửa:\n" + oErr.codeAfter;
                this._copyToClipboard(sText, "Đã sao chép hướng dẫn giải quyết sự cố " + oErr.id + "!");
            }
        },

        _copyToClipboard: function (sText, sSuccessMsg) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(sText).then(function () {
                    MessageToast.show(sSuccessMsg || "Đã sao chép vào bộ nhớ tạm!");
                });
            } else {
                var oTextArea = document.createElement("textarea");
                oTextArea.value = sText;
                document.body.appendChild(oTextArea);
                oTextArea.select();
                document.execCommand("copy");
                document.body.removeChild(oTextArea);
                MessageToast.show(sSuccessMsg || "Đã sao chép vào bộ nhớ tạm!");
            }
        },

        // --- FILTER & SEARCH LOGIC ---

        onSearchLiveChange: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue") || "";
            var oStateModel = this.getModel("errorViewState");
            oStateModel.setProperty("/searchQuery", sQuery);
            this._applyCombinedFilters();
        },

        onFilterChange: function () {
            var oCatSelect = this.byId("categoryFilterSelect");
            var oPhaseSelect = this.byId("phaseFilterSelect");
            var oSevSelect = this.byId("severityFilterSelect");

            var oStateModel = this.getModel("errorViewState");
            if (oCatSelect) oStateModel.setProperty("/selectedCategory", oCatSelect.getSelectedKey());
            if (oPhaseSelect) oStateModel.setProperty("/selectedPhase", oPhaseSelect.getSelectedKey());
            if (oSevSelect) oStateModel.setProperty("/selectedSeverity", oSevSelect.getSelectedKey());

            this._applyCombinedFilters();
        },

        onFilterAll: function () {
            this.onResetFilters();
        },

        onFilterFE: function () {
            this._quickSetCategory("CAT_FE");
        },

        onFilterOData: function () {
            this._quickSetCategory("CAT_ODATA");
        },

        onFilterADT: function () {
            this._quickSetCategory("CAT_ADT");
        },

        onFilterRAP: function () {
            this._quickSetCategory("CAT_RAP");
        },

        _quickSetCategory: function (sCatKey) {
            var oCatSelect = this.byId("categoryFilterSelect");
            if (oCatSelect) {
                oCatSelect.setSelectedKey(sCatKey);
            }
            var oStateModel = this.getModel("errorViewState");
            oStateModel.setProperty("/selectedCategory", sCatKey);
            this._applyCombinedFilters();
        },

        onResetFilters: function () {
            var oCatSelect = this.byId("categoryFilterSelect");
            var oPhaseSelect = this.byId("phaseFilterSelect");
            var oSevSelect = this.byId("severityFilterSelect");
            var oSearchField = this.byId("errorSearchField");

            if (oCatSelect) oCatSelect.setSelectedKey("ALL");
            if (oPhaseSelect) oPhaseSelect.setSelectedKey("ALL");
            if (oSevSelect) oSevSelect.setSelectedKey("ALL");
            if (oSearchField) oSearchField.setValue("");

            var oStateModel = this.getModel("errorViewState");
            oStateModel.setProperty("/searchQuery", "");
            oStateModel.setProperty("/selectedCategory", "ALL");
            oStateModel.setProperty("/selectedPhase", "ALL");
            oStateModel.setProperty("/selectedSeverity", "ALL");

            this._applyCombinedFilters();
            MessageToast.show("Đã đặt lại toàn bộ bộ lọc!");
        },

        _applyCombinedFilters: function () {
            var oStateModel = this.getModel("errorViewState");
            var sQuery = (oStateModel.getProperty("/searchQuery") || "").toLowerCase().trim();
            var sCat = oStateModel.getProperty("/selectedCategory") || "ALL";
            var sPhase = oStateModel.getProperty("/selectedPhase") || "ALL";
            var sSev = oStateModel.getProperty("/selectedSeverity") || "ALL";

            var aFilters = [];

            if (sCat !== "ALL") {
                aFilters.push(new Filter("category", FilterOperator.EQ, sCat));
            }
            if (sPhase !== "ALL") {
                aFilters.push(new Filter("phase", FilterOperator.EQ, sPhase));
            }
            if (sSev !== "ALL") {
                aFilters.push(new Filter("severity", FilterOperator.EQ, sSev));
            }

            if (sQuery) {
                var aSub = [
                    new Filter("id", FilterOperator.Contains, sQuery),
                    new Filter("title", FilterOperator.Contains, sQuery),
                    new Filter("errorCode", FilterOperator.Contains, sQuery),
                    new Filter("whatTriggered", FilterOperator.Contains, sQuery),
                    new Filter("symptom", FilterOperator.Contains, sQuery),
                    new Filter("rootCause", FilterOperator.Contains, sQuery),
                    new Filter("thoughtProcess", FilterOperator.Contains, sQuery),
                    new Filter("howToFix", FilterOperator.Contains, sQuery)
                ];
                aFilters.push(new Filter({ filters: aSub, and: false }));
            }

            var oTable = this.byId("errorTable");
            if (oTable) {
                var oBinding = oTable.getBinding("items");
                if (oBinding) {
                    oBinding.filter(aFilters);
                    var iCount = oBinding.getLength();
                    this._updateTableCount(iCount);
                }
            }
        },

        _updateTableCount: function (iCount) {
            var oTitle = this.byId("errorTableTitle");
            if (oTitle) {
                oTitle.setText("Danh Sách Sự Cố (" + iCount + " mục phù hợp - Bấm vào dòng để xem chi tiết)");
            }
        },

        onShowQuickHoverHelp: function () {
            MessageToast.show("💡 Bấm vào bất kỳ dòng nào hoặc nút '🔍 Chi Tiết' để xem trọn bộ 6 chiều phân tích nguyên nhân và cách khắc phục!");
        },

        onDownloadPlaybookMarkdown: function () {
            // Tải về file ERROR_HANDLING_PLAYBOOK.md
            fetch("mockdata/error_playbook.json")
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    var sMd = "# SỔ TAY XỬ LÝ 15 SỰ CỐ KỸ THUẬT THỰC TẾ\n\n";
                    if (data.errors) {
                        data.errors.forEach(function (e) {
                            sMd += "## " + e.id + ": " + e.title + "\n";
                            sMd += "- **Mã lỗi:** `" + e.errorCode + "` | " + e.phase + " (" + e.categoryName + ")\n";
                            sMd += "- **Mức độ:** " + e.severity + "\n";
                            sMd += "- **Làm gì bị lỗi:** " + e.whatTriggered + "\n";
                            sMd += "- **Triệu chứng:** `" + e.symptom + "`\n";
                            sMd += "- **Nguyên nhân:** " + e.rootCause + "\n";
                            sMd += "- **Tư duy giải quyết:** " + e.thoughtProcess + "\n";
                            sMd += "- **Cách khắc phục:** " + e.howToFix + "\n";
                            sMd += "- **Lưu ý Fresher:** " + e.fresherGotcha + "\n\n";
                            sMd += "```\n" + e.codeAfter + "\n```\n\n---\n\n";
                        });
                    }
                    var blob = new Blob([sMd], { type: "text/markdown;charset=utf-8" });
                    var url = URL.createObjectURL(blob);
                    var a = document.createElement("a");
                    a.href = url;
                    a.download = "ERROR_HANDLING_PLAYBOOK.md";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    MessageToast.show("Đã tải xuống sổ tay ERROR_HANDLING_PLAYBOOK.md thành công!");
                })
                .catch(function () {
                    MessageToast.show("Lỗi khi tải file tài liệu markdown.");
                });
        },

        onNavBack: function () {
            this.navTo("dashboard");
        },

        onNavToGuideline: function () {
            this.openGuidelineWorkspace();
        }
    });
});
