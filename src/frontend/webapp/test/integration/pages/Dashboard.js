sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/PropertyStrictEquals"
], function (Opa5, Press, PropertyStrictEquals) {
    "use strict";

    var sViewName = "Dashboard";

    Opa5.createPageObjects({
        onTheDashboardPage: {
            actions: {
                iPressOnFresherGuidelineLink: function () {
                    return this.waitFor({
                        controlType: "sap.m.Link",
                        viewName: sViewName,
                        actions: new Press(),
                        errorMessage: "Không thể tìm thấy hoặc nhấn vào liên kết Guideline trên Dashboard"
                    });
                }
            },
            assertions: {
                iShouldSeeDashboardPage: function () {
                    return this.waitFor({
                        id: "dashboardPage",
                        viewName: sViewName,
                        success: function () {
                            Opa5.assert.ok(true, "Trang Dashboard đã hiển thị thành công.");
                        },
                        errorMessage: "Không tìm thấy trang Dashboard"
                    });
                },
                iShouldSeeKpiTiles: function () {
                    return this.waitFor({
                        controlType: "sap.m.GenericTile",
                        viewName: sViewName,
                        success: function (aTiles) {
                            Opa5.assert.ok(aTiles.length >= 4, "Dashboard hiển thị đủ các thẻ KPI tổng quan.");
                        },
                        errorMessage: "Không tìm thấy các thẻ KPI trên Dashboard"
                    });
                }
            }
        }
    });
});

