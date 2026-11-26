sap.ui.define([
    "sap/fiori/tech/academy/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/message/Message",
    "sap/ui/core/message/MessageType",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/MessagePopover",
    "sap/m/MessageItem"
], function (BaseController, JSONModel, Fragment, Message, MessageType, MessageToast, MessageBox, MessagePopover, MessageItem) {
    "use strict";

    return BaseController.extend("sap.fiori.tech.academy.controller.FreestyleLab", {
        onInit: function () {
            var oModel = new JSONModel({
                systemConfig: {},
                modules: [],
                selectedModule: null,
                inspectedModule: null,
                sampleValidationEntities: {},
                messages: [],
                messageCount: 0,
                fragmentLogs: [
                    {
                        event: "Khởi tạo Phân hệ",
                        details: "Sẵn sàng quản lý vòng đời XML Fragment QuickInspectDialog.",
                        timestamp: new Date().toLocaleTimeString(),
                        icon: "sap-icon://sys-enter-2"
                    }
                ],
                rawCustomControlJs: "",
                rawFragmentXml: ""
            });

            this.setModel(oModel, "freestyleModel");

            // Register MessageManager Listener
            var oMessageManager = sap.ui.getCore().getMessageManager();
            var oMessageModel = oMessageManager.getMessageModel();
            this.getView().setModel(oMessageModel, "messageModel");

            oMessageModel.attachPropertyChange(this._syncMessages, this);

            this.getRouter().getRoute("freestyleLab").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._loadData();
            this._loadCodeAssets();
        },

        _loadData: function () {
            var that = this;
            var oModel = this.getModel("freestyleModel");

            fetch("mockdata/freestyle_data.json")
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    oModel.setProperty("/systemConfig", data.systemConfig);
                    oModel.setProperty("/modules", data.modules);
                    oModel.setProperty("/sampleValidationEntities", data.sampleValidationEntities);

                    if (data.modules && data.modules.length > 0) {
                        that._selectModule(data.modules[0]);
                    }
                })
                .catch(function (err) {
                    console.error("Lỗi nạp dữ liệu freestyle:", err);
                });
        },

        _loadCodeAssets: function () {
            var oModel = this.getModel("freestyleModel");

            fetch("control/TechnicalHealthGauge.js")
                .then(function (r) { return r.text(); })
                .then(function (text) { oModel.setProperty("/rawCustomControlJs", text); });

            fetch("fragment/QuickInspectDialog.fragment.xml")
                .then(function (r) { return r.text(); })
                .then(function (text) { oModel.setProperty("/rawFragmentXml", text); });
        },

        _selectModule: function (oModule) {
            var oModel = this.getModel("freestyleModel");
            oModel.setProperty("/selectedModule", Object.assign({}, oModule));
            oModel.setProperty("/inspectedModule", Object.assign({}, oModule));

            var oSelect = this.byId("moduleContextSelect");
            if (oSelect) {
                oSelect.setSelectedKey(oModule.id);
            }
        },

        onModuleSelectChange: function (oEvent) {
            var sKey = oEvent.getParameter("selectedItem").getKey();
            var oModel = this.getModel("freestyleModel");
            var aModules = oModel.getProperty("/modules") || [];
            var oTarget = aModules.find(function (m) { return m.id === sKey; });

            if (oTarget) {
                this._selectModule(oTarget);
                MessageToast.show("Đã kích hoạt Element Binding cho Module: " + oTarget.name);
            }
        },

        // --- CUSTOM CONTROL EVENT HANDLER ---

        onGaugePress: function (oEvent) {
            var fVal = oEvent.getParameter("value");
            var sTitle = oEvent.getParameter("title");
            MessageToast.show("[Custom Control Event] Bạn đã nhấp vào: " + sTitle + " (Chỉ số: " + fVal + ")");
        },

        // --- XML FRAGMENT DIALOG LIFECYCLE ---

        onOpenInspectDialog: function () {
            var oView = this.getView();
            var oModel = this.getModel("freestyleModel");

            if (!this._pInspectDialog) {
                this._pInspectDialog = Fragment.load({
                    id: oView.getId(),
                    name: "sap.fiori.tech.academy.fragment.QuickInspectDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pInspectDialog.then(function (oDialog) {
                oDialog.open();

                var aLogs = oModel.getProperty("/fragmentLogs") || [];
                aLogs.unshift({
                    event: "Mở XML Fragment Dialog",
                    details: "Đã tải bất đồng bộ QuickInspectDialog và gán dependent với View cha.",
                    timestamp: new Date().toLocaleTimeString(),
                    icon: "sap-icon://popup-window"
                });
                oModel.setProperty("/fragmentLogs", aLogs);
            });
        },

        onCloseInspectDialog: function () {
            if (this._pInspectDialog) {
                this._pInspectDialog.then(function (oDialog) {
                    oDialog.close();
                });
            }
        },

        onConfirmModuleInspection: function () {
            var oModel = this.getModel("freestyleModel");
            var oMod = oModel.getProperty("/inspectedModule");

            this.onCloseInspectDialog();

            var aLogs = oModel.getProperty("/fragmentLogs") || [];
            aLogs.unshift({
                event: "Xác Nhận Đạt Chuẩn",
                details: "Đã phê duyệt kiểm định kỹ thuật cho module: " + (oMod ? oMod.name : "Module"),
                timestamp: new Date().toLocaleTimeString(),
                icon: "sap-icon://accept"
            });
            oModel.setProperty("/fragmentLogs", aLogs);

            MessageToast.show("Thẩm định kỹ thuật thành công qua XML Fragment!");
        },

        // --- MESSAGEMANAGER & VALIDATION ENGINE ---

        onValidateForm: function () {
            var oMessageManager = sap.ui.getCore().getMessageManager();
            oMessageManager.removeAllMessages();

            var oInputName = this.byId("inputEntityName");
            var oInputKey = this.byId("inputConfigKey");
            var oInputEmail = this.byId("inputEmail");

            var sName = oInputName.getValue().trim();
            var sKey = oInputKey.getValue().trim();
            var sEmail = oInputEmail.getValue().trim();

            var bHasError = false;

            if (!sName) {
                oMessageManager.addMessages(new Message({
                    message: "Tên Thực Thể Cấu Hình là bắt buộc.",
                    type: MessageType.Error,
                    target: oInputName.getId() + "/value",
                    processor: this.getView().getModel()
                }));
                bHasError = true;
            }

            if (!sKey.startsWith("CFG_")) {
                oMessageManager.addMessages(new Message({
                    message: "Khóa Cấu Hình phải bắt đầu bằng tiền tố 'CFG_'.",
                    type: MessageType.Warning,
                    target: oInputKey.getId() + "/value",
                    processor: this.getView().getModel()
                }));
                bHasError = true;
            }

            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(sEmail)) {
                oMessageManager.addMessages(new Message({
                    message: "Email thông báo không đúng định dạng chuẩn RFC 5322.",
                    type: MessageType.Error,
                    target: oInputEmail.getId() + "/value",
                    processor: this.getView().getModel()
                }));
                bHasError = true;
            }

            this._syncMessages();

            if (!bHasError) {
                oMessageManager.addMessages(new Message({
                    message: "Toàn bộ dữ liệu biểu mẫu đạt chuẩn kiểm tra (Validation Passed)!",
                    type: MessageType.Success,
                    processor: this.getView().getModel()
                }));
                this._syncMessages();
                MessageToast.show("Validation Passed: Biểu mẫu hoàn toàn hợp lệ!");
            } else {
                this.onToggleMessagePopover(this.byId("messagePopoverBtn"));
            }
        },

        onSimulateBackendError: function () {
            var oMessageManager = sap.ui.getCore().getMessageManager();
            oMessageManager.addMessages(new Message({
                message: "HTTP 500: CX_RAP_QUERY_FAILED - Lỗi truy vấn cơ sở dữ liệu trên SAP Kernel S/4HANA.",
                description: "Ngoại lệ phát sinh trong Behavior Pool của ZI_DemoHeaderTP tại save_modified sequence.",
                type: MessageType.Error,
                processor: this.getView().getModel()
            }));
            this._syncMessages();
            this.onToggleMessagePopover(this.byId("messagePopoverBtn"));
        },

        onClearAllMessages: function () {
            sap.ui.getCore().getMessageManager().removeAllMessages();
            this._syncMessages();
            MessageToast.show("Đã xóa toàn bộ thông báo trong MessageManager.");
        },

        _syncMessages: function () {
            var oMessageManager = sap.ui.getCore().getMessageManager();
            var aRawMessages = oMessageManager.getMessageModel().getData() || [];
            var oModel = this.getModel("freestyleModel");

            var aFormatted = aRawMessages.map(function (m) {
                return {
                    message: m.message,
                    description: m.description || "Gắn với: " + (m.target || "Toàn cục"),
                    type: m.type
                };
            });

            oModel.setProperty("/messages", aFormatted);
            oModel.setProperty("/messageCount", aFormatted.length);
        },

        onToggleMessagePopover: function (oEvent) {
            var oSource = oEvent.getSource ? oEvent.getSource() : oEvent;

            if (!this._oMessagePopover) {
                this._oMessagePopover = new MessagePopover({
                    items: {
                        path: "messageModel>/",
                        template: new MessageItem({
                            type: "{messageModel>type}",
                            title: "{messageModel>message}",
                            description: "{messageModel>description}",
                            subtitle: "{messageModel>target}"
                        })
                    }
                });
                this.getView().addDependent(this._oMessagePopover);
            }

            if (this._oMessagePopover.isOpen()) {
                this._oMessagePopover.close();
            } else {
                this._oMessagePopover.openBy(oSource);
            }
        },

        onNavBack: function () {
            this.navTo("dashboard");
        }
    });
});

