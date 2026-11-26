sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/fiori/tech/academy/test/integration/pages/Common",
    "sap/fiori/tech/academy/test/integration/DashboardJourney"
], function (Opa5, Common) {
    "use strict";

    Opa5.extendConfig({
        arrangements: new Common(),
        viewNamespace: "sap.fiori.tech.academy.view.",
        autoWait: true
    });
});

