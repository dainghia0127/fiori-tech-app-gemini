sap.ui.define([
    "sap/fiori/tech/academy/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/fiori/tech/academy/model/formatter",
    "sap/fiori/tech/academy/util/CodeTips"
], function (BaseController, JSONModel, Filter, FilterOperator, MessageToast, formatter, CodeTips) {
    "use strict";

    return BaseController.extend("sap.fiori.tech.academy.controller.CodeExplorer", {
        formatter: formatter,

        onInit: function () {
            var oCodeModel = new JSONModel({
                filePath: "",
                relatedFeature: "",
                architectureNotes: []
            });
            this.setModel(oCodeModel, "codeModel");

            this.getRouter().getRoute("code").attachPatternMatched(this._onRouteMatched, this);
            this.getRouter().getRoute("codeDefault").attachPatternMatched(this._onRouteDefaultMatched, this);
        },

        _onRouteDefaultMatched: function () {
            this._selectSnippetById("SNIP_BDEF_HEADER");
        },

        _onRouteMatched: function (oEvent) {
            var sSnippetId = oEvent.getParameter("arguments").snippetId || "SNIP_BDEF_HEADER";
            this._selectSnippetById(sSnippetId);
        },

        _selectSnippetById: function (sSnippetId) {
            var oSnippetsModel = this.getModel("snippets");
            if (!oSnippetsModel) {
                return;
            }

            var aSnippets = oSnippetsModel.getProperty("/snippets") || [];
            var oFound = null;

            for (var i = 0; i < aSnippets.length; i++) {
                if (aSnippets[i].id === sSnippetId) {
                    oFound = aSnippets[i];
                    break;
                }
            }

            if (!oFound && aSnippets.length > 0) {
                oFound = aSnippets[0];
            }

            if (oFound) {
                this._displaySnippet(oFound);
                this._highlightListItem(oFound.id);
            }
        },

        _displaySnippet: function (oSnippet) {
            this.byId("snippetTitle").setText(oSnippet.title);
            this.byId("snippetDescription").setText(oSnippet.description);
            this.byId("snippetCategory").setText("Phân hệ Kỹ thuật: " + oSnippet.category);

            var oLangBadge = this.byId("snippetLanguageBadge");
            oLangBadge.setText(oSnippet.language);

            var oStatusBadge = this.byId("snippetStatusBadge");
            oStatusBadge.setText(oSnippet.status);
            if (oSnippet.status.indexOf("Verified") >= 0) {
                oStatusBadge.setState("Success");
            } else if (oSnippet.status.indexOf("Proposed") >= 0) {
                oStatusBadge.setState("Warning");
            } else {
                oStatusBadge.setState("Information");
            }

            var oCodeModel = this.getModel("codeModel");
            if (oCodeModel) {
                oCodeModel.setProperty("/filePath", oSnippet.filePath || "Chưa gắn đường dẫn");
                oCodeModel.setProperty("/relatedFeature", oSnippet.relatedFeature || oSnippet.category || "");
                oCodeModel.setProperty("/architectureNotes", oSnippet.architectureNotes || [
                    "Mã nguồn này minh họa chuẩn kỹ thuật trong dự án SAP Fiori Technical Academy."
                ]);
            }

            var sLang = (oSnippet.language || "").toLowerCase();
            var sKind = null;
            if (sLang.indexOf("bdl") >= 0) sKind = "bdef";
            else if (sLang.indexOf("cds") >= 0 || sLang.indexOf("ddic") >= 0) sKind = "cds";
            else if (sLang.indexOf("abap") >= 0) sKind = "abap";
            else if (sLang.indexOf("xml") >= 0) sKind = "xml";
            else if (sLang.indexOf("json") >= 0) sKind = "json";
            else if (sLang.indexOf("javascript") >= 0) sKind = "js";

            var oHtml = this.byId("codeInteractiveHtml");
            if (oHtml) {
                oHtml.setContent(CodeTips.parseToHtml(oSnippet.code || "", sKind, oSnippet.annotatedLines || null));
                setTimeout(function () {
                    var oDomRef = oHtml.getDomRef();
                    if (oDomRef) {
                        CodeTips.attach(oDomRef);
                    }
                }, 80);
            }

            this._currentCodeString = oSnippet.code;
        },

        _highlightListItem: function (sId) {
            var oList = this.byId("snippetList");
            if (!oList) {
                return;
            }

            var aItems = oList.getItems();
            for (var i = 0; i < aItems.length; i++) {
                var oContext = aItems[i].getBindingContext("snippets");
                if (oContext && oContext.getProperty("id") === sId) {
                    oList.setSelectedItem(aItems[i], true);
                    break;
                }
            }
        },

        onSnippetSelect: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            var oContext = oItem.getBindingContext("snippets");
            if (oContext) {
                var sSnippetId = oContext.getProperty("id");
                this.navTo("code", {
                    snippetId: sSnippetId
                });
            }
        },

        onSnippetSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oList = this.byId("snippetList");
            var oBinding = oList.getBinding("items");

            if (!oBinding) {
                return;
            }

            if (sQuery && sQuery.trim().length > 0) {
                var sTerm = sQuery.trim();
                var aFilters = [
                    new Filter("title", FilterOperator.Contains, sTerm),
                    new Filter("category", FilterOperator.Contains, sTerm),
                    new Filter("language", FilterOperator.Contains, sTerm)
                ];
                oBinding.filter(new Filter({
                    filters: aFilters,
                    and: false
                }));
            } else {
                oBinding.filter([]);
            }
        },

        onCopySnippet: function () {
            if (!this._currentCodeString) {
                return;
            }

            var sText = this._currentCodeString;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(sText).then(function () {
                    MessageToast.show("Đã sao chép mã nguồn vào bộ nhớ tạm!");
                });
            } else {
                // Fallback cho trình duyệt cũ
                var oTextArea = document.createElement("textarea");
                oTextArea.value = sText;
                document.body.appendChild(oTextArea);
                oTextArea.select();
                try {
                    document.execCommand("copy");
                    MessageToast.show("Đã sao chép mã nguồn vào bộ nhớ tạm!");
                } catch (e) {
                    MessageToast.show("Không thể sao chép tự động.");
                }
                document.body.removeChild(oTextArea);
            }
        },

        _escapeHtml: function (str) {
            if (!str) {
                return "";
            }
            return str
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        },

        onNavBack: function () {
            this.navTo("catalog");
        }
    });
});

