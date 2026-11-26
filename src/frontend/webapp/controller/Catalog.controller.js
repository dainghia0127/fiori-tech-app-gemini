sap.ui.define([
    "sap/fiori/tech/academy/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/fiori/tech/academy/model/formatter"
], function (BaseController, Filter, FilterOperator, formatter) {
    "use strict";

    return BaseController.extend("sap.fiori.tech.academy.controller.Catalog", {
        formatter: formatter,

        onInit: function () {
            this.getRouter().getRoute("catalog").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._applyFilters();
        },

        onFilterChange: function () {
            this._applyFilters();
        },

        onResetFilters: function () {
            var oAppModel = this.getModel("appView");
            oAppModel.setProperty("/activeFilterCategory", "ALL");
            oAppModel.setProperty("/activeFilterLevel", "ALL");
            oAppModel.setProperty("/searchQuery", "");
            this._applyFilters();
        },

        _applyFilters: function () {
            var oTable = this.byId("topicsTable");
            if (!oTable) {
                return;
            }
            var oBinding = oTable.getBinding("items");
            if (!oBinding) {
                return;
            }

            var oAppModel = this.getModel("appView");
            var sCategory = oAppModel.getProperty("/activeFilterCategory") || "ALL";
            var sLevel = oAppModel.getProperty("/activeFilterLevel") || "ALL";
            var sQuery = oAppModel.getProperty("/searchQuery") || "";

            var aFilters = [];

            // Lọc theo Category
            if (sCategory && sCategory !== "ALL") {
                aFilters.push(new Filter("categoryId", FilterOperator.EQ, sCategory));
            }

            // Lọc theo Level
            if (sLevel && sLevel !== "ALL") {
                aFilters.push(new Filter("level", FilterOperator.EQ, sLevel));
            }

            // Lọc theo Search Query (tìm trên title, summary, lab)
            if (sQuery && sQuery.trim().length > 0) {
                var sTerm = sQuery.trim();
                var aSearchSubFilters = [
                    new Filter("title", FilterOperator.Contains, sTerm),
                    new Filter("summary", FilterOperator.Contains, sTerm),
                    new Filter("lab", FilterOperator.Contains, sTerm)
                ];
                aFilters.push(new Filter({
                    filters: aSearchSubFilters,
                    and: false
                }));
            }

            oBinding.filter(aFilters);

            // Cập nhật số lượng đếm
            var oCountText = this.byId("itemCountText");
            if (oCountText) {
                var iCount = oBinding.getLength();
                oCountText.setText("Hiển thị " + iCount + " chuyên đề");
            }
        },

        onViewSnippetPress: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var oContext = oItem.getBindingContext("catalog");
            if (oContext) {
                var sSnippetId = oContext.getProperty("codeSnippetId");
                this.navTo("code", {
                    snippetId: sSnippetId || "SNIP_BDEF_HEADER"
                });
            }
        },

        onNavBack: function () {
            this.navTo("dashboard");
        }
    });
});

