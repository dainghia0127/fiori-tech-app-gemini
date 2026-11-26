sap.ui.define([
    "sap/ui/test/Opa5"
], function (Opa5) {
    "use strict";

    return Opa5.extend("sap.fiori.tech.academy.test.integration.pages.Common", {
        iStartTheApp: function (oOptions) {
            oOptions = oOptions || {};
            return this.iStartMyUIComponent({
                componentConfig: {
                    name: "sap.fiori.tech.academy",
                    async: true
                },
                hash: oOptions.hash || ""
            });
        },

        iTeardownTheApp: function () {
            return this.iTeardownMyUIComponent();
        }
    });
});

