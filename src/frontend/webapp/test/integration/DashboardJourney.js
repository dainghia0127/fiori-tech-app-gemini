sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/fiori/tech/academy/test/integration/pages/Dashboard"
], function (opaTest) {
    "use strict";

    QUnit.module("Dashboard Journey");

    opaTest("Nên hiển thị Dashboard với đầy đủ KPI Tiles", function (Given, When, Then) {
        // Arrangements
        Given.iStartTheApp();

        // Assertions
        Then.onTheDashboardPage.iShouldSeeDashboardPage();
        Then.onTheDashboardPage.iShouldSeeKpiTiles();
    });

    opaTest("Nên có thể kích hoạt liên kết Guideline", function (Given, When, Then) {
        // Actions
        When.onTheDashboardPage.iPressOnFresherGuidelineLink();

        // Cleanup
        Then.iTeardownTheApp();
    });
});

