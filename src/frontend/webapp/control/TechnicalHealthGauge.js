sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    "use strict";

    /**
     * Custom Control: TechnicalHealthGauge
     * SAPUI5 Custom Control demonstrating custom HTML5 rendering,
     * reactive property binding, threshold-based state calculation,
     * and custom event handling.
     */
    return Control.extend("sap.fiori.tech.academy.control.TechnicalHealthGauge", {
        metadata: {
            properties: {
                title: { type: "string", defaultValue: "System Metric" },
                value: { type: "float", defaultValue: 0 },
                maxValue: { type: "float", defaultValue: 100 },
                unit: { type: "string", defaultValue: "%" },
                thresholdWarning: { type: "float", defaultValue: 70 },
                thresholdCritical: { type: "float", defaultValue: 90 },
                size: { type: "string", defaultValue: "Medium" }
            },
            events: {
                press: {
                    parameters: {
                        value: { type: "float" },
                        title: { type: "string" }
                    }
                }
            }
        },

        renderer: function (oRm, oControl) {
            var fVal = oControl.getValue();
            var fMax = oControl.getMaxValue() || 100;
            var fPercent = Math.min(100, Math.max(0, (fVal / fMax) * 100));
            var sUnit = oControl.getUnit();
            var sTitle = oControl.getTitle();

            var fWarn = oControl.getThresholdWarning();
            var fCrit = oControl.getThresholdCritical();

            // Calculate color state
            var sColor = "#107e3e"; // Good (Green)
            var sStatusText = "Tối Ưu";
            if (fVal >= fCrit) {
                sColor = "#b00"; // Critical (Red)
                sStatusText = "Cảnh Báo Đỏ";
            } else if (fVal >= fWarn) {
                sColor = "#e9730c"; // Warning (Orange)
                sStatusText = "Cảnh Báo";
            }

            oRm.openStart("div", oControl);
            oRm.class("techGaugeContainer");
            oRm.attr("role", "progressbar");
            oRm.attr("aria-valuenow", fVal);
            oRm.attr("aria-valuemin", 0);
            oRm.attr("aria-valuemax", fMax);
            oRm.attr("title", sTitle + ": " + fVal + sUnit + " (" + sStatusText + ")");
            oRm.openEnd();

            // Header title
            oRm.openStart("div");
            oRm.class("techGaugeTitle");
            oRm.openEnd();
            oRm.text(sTitle);
            oRm.close("div");

            // Meter Bar Track
            oRm.openStart("div");
            oRm.class("techGaugeTrack");
            oRm.openEnd();

            // Meter Fill Bar
            oRm.openStart("div");
            oRm.class("techGaugeFill");
            oRm.attr("style", "width: " + fPercent + "%; background-color: " + sColor + ";");
            oRm.openEnd();
            oRm.close("div");

            oRm.close("div"); // End Track

            // Metrics readout
            oRm.openStart("div");
            oRm.class("techGaugeReadout");
            oRm.openEnd();

            oRm.openStart("span");
            oRm.class("techGaugeNumber");
            oRm.attr("style", "color: " + sColor + ";");
            oRm.openEnd();
            oRm.text(fVal + sUnit);
            oRm.close("span");

            oRm.openStart("span");
            oRm.class("techGaugeBadge");
            oRm.attr("style", "border-color: " + sColor + "; color: " + sColor + ";");
            oRm.openEnd();
            oRm.text(sStatusText);
            oRm.close("span");

            oRm.close("div"); // End Readout

            oRm.close("div"); // End Container
        },

        onclick: function (oEvent) {
            oEvent.preventDefault();
            this.firePress({
                value: this.getValue(),
                title: this.getTitle()
            });
        }
    });
});

