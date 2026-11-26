sap.ui.define([
    "sap/fiori/tech/academy/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Image",
    "sap/m/VBox",
    "sap/m/Text",
    "sap/fiori/tech/academy/util/CodeTips"
], function (BaseController, JSONModel, MessageToast, Dialog, Button, Image, VBox, Text, CodeTips) {
    "use strict";

    var CHECKLIST_STORAGE_KEY = "fresher_rebuild_checklist_v1";

    return BaseController.extend("sap.fiori.tech.academy.controller.Guideline", {
        onInit: function () {
            var oModel = new JSONModel({
                chapters: [],
                globalWorkflow: [],
                blueprint: {
                    folderTree: "",
                    buildPhases: [],
                    routesSummary: []
                },
                treeNodes: [],
                filteredTreeNodes: [],
                checklistItems: [],
                filteredChecklist: [],
                checklistFilter: "ALL",
                checklistStats: {
                    doneCount: 0,
                    totalCount: 0,
                    percent: 0
                },
                activeTreeLabel: "Tổng quan 14 Chương",
                fastTrackTools: [],
                goldenShortcuts: [],
                selectedChapter: null,
                selectedChapterId: "chap1",
                activeCodeFileName: "",
                activeCodeFilePath: "",
                activeCodeSnippet: "",
                searchQuery: ""
            });
            this.setModel(oModel, "guidelineModel");

            this._bIgnoreTreeSelect = false;
            this._lastSpiedNodeId = "";
            this._scrollTimer = null;

            this.getRouter().getRoute("guideline").attachPatternMatched(this._onRouteMatched, this);
        },

        onAfterRendering: function () {
            this._attachScrollSpy();
        },

        onExit: function () {
            this._detachScrollSpy();
        },

        _onRouteMatched: function () {
            this._loadGuidelineData();
            setTimeout(this._attachScrollSpy.bind(this), 250);
        },

        _loadGuidelineData: function () {
            var that = this;
            var oModel = this.getModel("guidelineModel");

            fetch("mockdata/fresher_guideline.json")
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    oModel.setProperty("/title", data.title);
                    oModel.setProperty("/subtitle", data.subtitle);
                    oModel.setProperty("/fastTrackTools", data.fastTrackTools || []);
                    oModel.setProperty("/goldenShortcuts", data.goldenShortcuts || []);
                    oModel.setProperty("/globalWorkflow", data.globalWorkflow || []);
                    oModel.setProperty("/blueprint", data.blueprint || {
                        folderTree: "",
                        buildPhases: [],
                        routesSummary: []
                    });
                    oModel.setProperty("/chapters", data.chapters || []);

                    var aTree = that._buildTreeNodes(data.chapters || []);
                    oModel.setProperty("/treeNodes", aTree);
                    oModel.setProperty("/filteredTreeNodes", aTree);

                    that._initChecklist(data.checklistItems || []);

                    if (data.chapters && data.chapters.length > 0) {
                        var sCurrentId = oModel.getProperty("/selectedChapterId") || "chap1";
                        var oTarget = data.chapters.find(function (c) { return c.id === sCurrentId; }) || data.chapters[0];
                        that._selectChapterObject(oTarget);
                        setTimeout(function () {
                            var oTree = that.byId("guidelineNavTree");
                            if (oTree && oTree.expandToLevel) {
                                oTree.expandToLevel(1);
                                that._syncTreeSelectionToNode(oTarget.id, oTarget.title);
                            }
                        }, 120);
                    }
                })
                .catch(function (err) {
                    console.error("Lỗi khi tải dữ liệu Guideline:", err);
                });
        },

        _buildTreeNodes: function (aChapters) {
            var aPhaseDefs = [
                { id: "phase-1", title: "📁 Phần 1: Nền Tảng & Khung App (Chap 1–4)", ids: ["chap1", "chap2", "chap3", "chap4"] },
                { id: "phase-2", title: "📁 Phần 2: Dashboard & Tra Cứu (Chap 5–6)", ids: ["chap5", "chap6"] },
                { id: "phase-3", title: "📁 Phần 3: 4 Phòng Lab & Sổ Tay (Chap 7–11)", ids: ["chap7", "chap8", "chap9", "chap10", "chap11"] },
                { id: "phase-4", title: "📁 Phần 4: QA Tests & Guideline (Chap 12)", ids: ["chap12"] },
                { id: "phase-5", title: "📁 Phần 5: SAP S/4HANA ABAP RAP (Chap 13–14)", ids: ["chap13", "chap14"] }
            ];

            var mChapById = {};
            aChapters.forEach(function (c) { mChapById[c.id] = c; });

            var aResult = [
                {
                    id: "overview-blueprint",
                    title: "🗂️ Cây Thư Mục & Blueprint (91 Files)",
                    icon: "sap-icon://org-chart",
                    type: "section",
                    targetId: "guidelineBlueprintPanel",
                    tooltip: "Xem tổng quan cây thư mục và thứ tự 5 giai đoạn tạo app",
                    nodes: []
                },
                {
                    id: "overview-checklist",
                    title: "✅ Checklist Tạo App Từ 0 → 100%",
                    icon: "sap-icon://activity-items",
                    type: "section",
                    targetId: "guidelineChecklistPanel",
                    tooltip: "Checklist từng hạng mục kèm tick lưu tiến độ thực hành",
                    nodes: []
                }
            ];

            aPhaseDefs.forEach(function (oPhase) {
                var aChapNodes = [];
                oPhase.ids.forEach(function (sChapId) {
                    var oCh = mChapById[sChapId];
                    if (!oCh) {
                        return;
                    }
                    var aLeafNodes = [];

                    (oCh.steps || []).forEach(function (st) {
                        aLeafNodes.push({
                            id: oCh.id + "-step-" + st.stepNumber,
                            title: "Bước " + st.stepNumber + ": " + st.actionTitle,
                            icon: "sap-icon://task",
                            type: "step",
                            chapterId: oCh.id,
                            stepNumber: st.stepNumber,
                            filePath: st.targetFilePath || "",
                            tooltip: "Bước " + st.stepNumber + " — " + st.actionTitle,
                            nodes: []
                        });
                    });

                    (oCh.relatedFiles || []).forEach(function (rf) {
                        var sShortPath = (rf.filePath || "")
                            .replace(/^src\/frontend\/webapp\//, "webapp/")
                            .replace(/^src\/backend\/rap\//, "rap/");
                        aLeafNodes.push({
                            id: oCh.id + "-file-" + rf.filePath,
                            title: "📄 " + sShortPath,
                            icon: "sap-icon://document-text",
                            type: "file",
                            chapterId: oCh.id,
                            filePath: rf.filePath,
                            tooltip: rf.filePath + " — " + rf.role,
                            nodes: []
                        });
                    });

                    var sShortChap = (oCh.title || "").replace(/^Chương\s+(\d+):\s*/, "Ch.$1: ");
                    aChapNodes.push({
                        id: oCh.id,
                        title: sShortChap,
                        icon: "sap-icon://course-book",
                        type: "chapter",
                        chapterId: oCh.id,
                        tooltip: oCh.title,
                        nodes: aLeafNodes
                    });
                });

                if (aChapNodes.length > 0) {
                    aResult.push({
                        id: oPhase.id,
                        title: oPhase.title,
                        icon: "sap-icon://folder-full",
                        type: "phase",
                        tooltip: oPhase.title,
                        nodes: aChapNodes
                    });
                }
            });

            return aResult;
        },

        onExpandAllTree: function () {
            var oTree = this.byId("guidelineNavTree");
            if (oTree && oTree.expandToLevel) {
                oTree.expandToLevel(3);
            }
        },

        onCollapseAllTree: function () {
            var oTree = this.byId("guidelineNavTree");
            if (oTree && oTree.collapseAll) {
                oTree.collapseAll();
                oTree.expandToLevel(1);
            }
        },

        onTreeSearch: function (oEvent) {
            var sQuery = (oEvent.getParameter("newValue") || "").trim().toLowerCase();
            var oModel = this.getModel("guidelineModel");
            var aSource = oModel.getProperty("/treeNodes") || [];

            if (!sQuery) {
                oModel.setProperty("/filteredTreeNodes", aSource);
                return;
            }

            function filterNodes(aNodes) {
                var aOut = [];
                aNodes.forEach(function (n) {
                    var bSelfMatch = ((n.title || "").toLowerCase().indexOf(sQuery) >= 0) ||
                        ((n.filePath || "").toLowerCase().indexOf(sQuery) >= 0) ||
                        ((n.tooltip || "").toLowerCase().indexOf(sQuery) >= 0);
                    var aChildMatches = n.nodes && n.nodes.length ? filterNodes(n.nodes) : [];
                    if (bSelfMatch || aChildMatches.length > 0) {
                        var oCopy = Object.assign({}, n);
                        oCopy.nodes = aChildMatches.length > 0 ? aChildMatches : (n.nodes || []);
                        aOut.push(oCopy);
                    }
                });
                return aOut;
            }

            oModel.setProperty("/filteredTreeNodes", filterNodes(aSource));
            var oTree = this.byId("guidelineNavTree");
            if (oTree && oTree.expandToLevel) {
                setTimeout(function () { oTree.expandToLevel(3); }, 60);
            }
        },

        onTreeItemSelect: function (oEvent) {
            if (this._bIgnoreTreeSelect) {
                return;
            }
            var oItem = oEvent.getParameter("listItem");
            if (!oItem) {
                return;
            }
            var oCtx = oItem.getBindingContext("guidelineModel");
            if (!oCtx) {
                return;
            }
            var oNode = oCtx.getObject();
            var oTree = this.byId("guidelineNavTree");

            if (oNode.type === "phase") {
                if (oTree && oItem) {
                    var iIdx = oTree.indexOfItem(oItem);
                    if (iIdx >= 0) {
                        if (oItem.getExpanded()) {
                            oTree.collapse(iIdx);
                        } else {
                            oTree.expand(iIdx);
                        }
                    }
                }
                return;
            }

            if (oNode.type === "section") {
                var oPanel = this.byId(oNode.targetId);
                if (oPanel) {
                    if (oPanel.setExpanded) {
                        oPanel.setExpanded(true);
                    }
                    setTimeout(function () {
                        var oDom = oPanel.getDomRef();
                        if (oDom) {
                            oDom.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                    }, 100);
                }
                this.getModel("guidelineModel").setProperty("/activeTreeLabel", oNode.title);
                return;
            }

            var sTargetChapId = oNode.chapterId;
            if (sTargetChapId) {
                var oModel = this.getModel("guidelineModel");
                var aChapters = oModel.getProperty("/chapters") || [];
                var oTargetChap = aChapters.find(function (c) { return c.id === sTargetChapId; });
                if (oTargetChap && oModel.getProperty("/selectedChapterId") !== sTargetChapId) {
                    this._selectChapterObject(oTargetChap);
                }

                oModel.setProperty("/activeTreeLabel", oNode.title);

                if (oNode.type === "chapter") {
                    if (oTree && !oItem.getExpanded()) {
                        var iChapIdx = oTree.indexOfItem(oItem);
                        if (iChapIdx >= 0) {
                            oTree.expand(iChapIdx);
                        }
                    }
                    this._scrollRightToSelector('[id$="chapterHeaderPanel"]');
                } else if (oNode.type === "step") {
                    this._scrollRightToSelector('[data-spy-step="' + oNode.stepNumber + '"]');
                } else if (oNode.type === "file") {
                    var sEscPath = oNode.filePath.replace(/"/g, '\\"');
                    this._scrollRightToSelector('[id$="guidelineRelatedFilesTable"] [data-spy-file="' + sEscPath + '"]');
                }
            }
        },

        _scrollRightToSelector: function (sSelector) {
            setTimeout(function () {
                var oEl = document.querySelector(sSelector);
                if (oEl) {
                    oEl.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 140);
        },

        _attachScrollSpy: function () {
            var oScrollCtrl = this.byId("guidelineRightScroll");
            if (!oScrollCtrl) {
                return;
            }
            var oScrollDom = oScrollCtrl.getDomRef();
            if (!oScrollDom) {
                return;
            }
            if (this._boundScrollEl === oScrollDom) {
                return;
            }
            this._detachScrollSpy();

            var that = this;
            this._fnOnRightScroll = function () {
                if (that._scrollTimer) {
                    clearTimeout(that._scrollTimer);
                }
                that._scrollTimer = setTimeout(function () {
                    that._evaluateScrollSpy(oScrollDom);
                }, 90);
            };

            oScrollDom.addEventListener("scroll", this._fnOnRightScroll, { passive: true });
            this._boundScrollEl = oScrollDom;
        },

        _detachScrollSpy: function () {
            if (this._boundScrollEl && this._fnOnRightScroll) {
                this._boundScrollEl.removeEventListener("scroll", this._fnOnRightScroll);
            }
            this._boundScrollEl = null;
            this._fnOnRightScroll = null;
            if (this._scrollTimer) {
                clearTimeout(this._scrollTimer);
                this._scrollTimer = null;
            }
        },

        _evaluateScrollSpy: function (oScrollDom) {
            var oContainerRect = oScrollDom.getBoundingClientRect();
            var aSpyEls = Array.from(oScrollDom.querySelectorAll("[data-spy-type]"));
            if (!aSpyEls.length) {
                return;
            }

            var oActiveEl = null;
            var nThreshold = oContainerRect.top + 150;
            for (var i = 0; i < aSpyEls.length; i++) {
                var oRect = aSpyEls[i].getBoundingClientRect();
                if (oRect.height === 0) {
                    continue;
                }
                if (oRect.top <= nThreshold) {
                    oActiveEl = aSpyEls[i];
                } else if (!oActiveEl && oRect.top < oContainerRect.bottom) {
                    oActiveEl = aSpyEls[i];
                    break;
                }
            }
            if (!oActiveEl) {
                return;
            }

            var sType = oActiveEl.getAttribute("data-spy-type");
            var sChapId = this.getModel("guidelineModel").getProperty("/selectedChapterId") || "chap1";
            var sNodeId = sChapId;
            var sLabel = sChapId.toUpperCase();

            if (sType === "section") {
                var sSecId = oActiveEl.getAttribute("data-spy-section");
                sNodeId = sSecId;
                sLabel = (sSecId === "overview-checklist") ? "Checklist Tạo App 0 → 100%" : "Project Blueprint";
            } else if (sType === "step") {
                var sStep = oActiveEl.getAttribute("data-spy-step");
                var sStepFile = oActiveEl.getAttribute("data-spy-file");
                sNodeId = sChapId + "-step-" + sStep;
                sLabel = sChapId.toUpperCase() + " • Bước " + sStep + (sStepFile ? " • " + sStepFile : "");
            } else if (sType === "file") {
                var sFile = oActiveEl.getAttribute("data-spy-file");
                sNodeId = sChapId + "-file-" + sFile;
                sLabel = sChapId.toUpperCase() + " • " + sFile;
            }

            if (sNodeId !== this._lastSpiedNodeId) {
                this._lastSpiedNodeId = sNodeId;
                this.getModel("guidelineModel").setProperty("/activeTreeLabel", sLabel);
                this._syncTreeSelectionToNode(sNodeId, sLabel);
            }
        },

        _findTreePathForId: function (aNodes, sTargetId, aTrail) {
            for (var i = 0; i < aNodes.length; i++) {
                var oNode = aNodes[i];
                var aNextTrail = aTrail.concat([oNode.id]);
                if (oNode.id === sTargetId) {
                    return aNextTrail;
                }
                if (oNode.nodes && oNode.nodes.length > 0) {
                    var aFound = this._findTreePathForId(oNode.nodes, sTargetId, aNextTrail);
                    if (aFound) {
                        return aFound;
                    }
                }
            }
            return null;
        },

        _syncTreeSelectionToNode: function (sNodeId) {
            var oTree = this.byId("guidelineNavTree");
            if (!oTree) {
                return;
            }
            var aTreeNodes = this.getModel("guidelineModel").getProperty("/filteredTreeNodes") || [];
            var aPathIds = this._findTreePathForId(aTreeNodes, sNodeId, []);
            if (!aPathIds || aPathIds.length === 0) {
                return;
            }

            this._bIgnoreTreeSelect = true;
            try {
                // Expand các node cha trước khi chọn node con
                for (var p = 0; p < aPathIds.length - 1; p++) {
                    var sParentId = aPathIds[p];
                    var aCurrentItems = oTree.getItems();
                    for (var j = 0; j < aCurrentItems.length; j++) {
                        var oCtx = aCurrentItems[j].getBindingContext("guidelineModel");
                        if (oCtx && oCtx.getProperty("id") === sParentId && !aCurrentItems[j].getExpanded()) {
                            oTree.expand(oTree.indexOfItem(aCurrentItems[j]));
                            break;
                        }
                    }
                }

                var aFinalItems = oTree.getItems();
                for (var k = 0; k < aFinalItems.length; k++) {
                    var oLeafCtx = aFinalItems[k].getBindingContext("guidelineModel");
                    if (oLeafCtx && oLeafCtx.getProperty("id") === sNodeId) {
                        oTree.setSelectedItem(aFinalItems[k], true);
                        var oItemDom = aFinalItems[k].getDomRef();
                        if (oItemDom && oItemDom.scrollIntoView) {
                            oItemDom.scrollIntoView({ behavior: "smooth", block: "nearest" });
                        }
                        break;
                    }
                }
            } finally {
                var that = this;
                setTimeout(function () {
                    that._bIgnoreTreeSelect = false;
                }, 50);
            }
        },

        _initChecklist: function (aItems) {
            var oSavedMap = {};
            try {
                oSavedMap = JSON.parse(localStorage.getItem(CHECKLIST_STORAGE_KEY) || "{}") || {};
            } catch (e) {
                oSavedMap = {};
            }
            var aHydrated = aItems.map(function (item) {
                return Object.assign({}, item, {
                    done: !!oSavedMap[item.id]
                });
            });
            var oModel = this.getModel("guidelineModel");
            oModel.setProperty("/checklistItems", aHydrated);
            this._refreshChecklistView();
        },

        _refreshChecklistView: function () {
            var oModel = this.getModel("guidelineModel");
            var aItems = oModel.getProperty("/checklistItems") || [];
            var sFilter = oModel.getProperty("/checklistFilter") || "ALL";
            var iDone = aItems.filter(function (x) { return !!x.done; }).length;
            var iTotal = aItems.length;
            var iPercent = iTotal > 0 ? Math.round((iDone / iTotal) * 100) : 0;

            oModel.setProperty("/checklistStats", {
                doneCount: iDone,
                totalCount: iTotal,
                percent: iPercent
            });

            var aFiltered = aItems.filter(function (x) {
                if (sFilter === "PENDING") {
                    return !x.done;
                }
                if (sFilter === "DONE") {
                    return !!x.done;
                }
                return true;
            });
            oModel.setProperty("/filteredChecklist", aFiltered);
        },

        onToggleChecklistItem: function () {
            var oModel = this.getModel("guidelineModel");
            var aItems = oModel.getProperty("/checklistItems") || [];
            var oSave = {};
            aItems.forEach(function (x) {
                if (x.done) {
                    oSave[x.id] = true;
                }
            });
            try {
                localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(oSave));
            } catch (e) {
                // Bỏ qua nếu private mode chặn localStorage
            }
            this._refreshChecklistView();
        },

        onChecklistFilterChange: function (oEvent) {
            var sKey = oEvent.getParameter("item") ? oEvent.getParameter("item").getKey() : "ALL";
            this.getModel("guidelineModel").setProperty("/checklistFilter", sKey);
            this._refreshChecklistView();
        },

        onResetChecklist: function () {
            var aItems = this.getModel("guidelineModel").getProperty("/checklistItems") || [];
            aItems.forEach(function (x) { x.done = false; });
            try {
                localStorage.removeItem(CHECKLIST_STORAGE_KEY);
            } catch (e) {
                // Ignore
            }
            this._refreshChecklistView();
            MessageToast.show("Đã đặt lại toàn bộ Checklist thực hành về 0%.");
        },

        onJumpToChecklistItem: function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext("guidelineModel");
            if (!oCtx) {
                return;
            }
            var oItem = oCtx.getObject();
            var oModel = this.getModel("guidelineModel");
            var aChapters = oModel.getProperty("/chapters") || [];
            var oTarget = aChapters.find(function (c) { return c.id === oItem.chapterId; });
            if (oTarget) {
                this._selectChapterObject(oTarget);
                if (oItem.stepNumber) {
                    this._scrollRightToSelector('[data-spy-step="' + oItem.stepNumber + '"]');
                }
                this._syncTreeSelectionToNode(oItem.stepNumber ? (oItem.chapterId + "-step-" + oItem.stepNumber) : oItem.chapterId);
            }
        },

        formatInstructionHtml: function (sText) {
            if (!sText) {
                return "";
            }
            var sEsc = String(sText)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");

            sEsc = sEsc
                .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                .replace(/`([^`]+)`/g, "<code>$1</code>");

            var aLines = sEsc.split(/\r?\n/);
            var aHtml = [];
            var bInList = false;

            aLines.forEach(function (sLine) {
                var sTrim = sLine.trim();
                if (!sTrim) {
                    if (bInList) {
                        aHtml.push("</ul>");
                        bInList = false;
                    }
                    return;
                }
                if (sTrim.indexOf("• ") === 0 || sTrim.indexOf("- ") === 0) {
                    if (!bInList) {
                        aHtml.push("<ul>");
                        bInList = true;
                    }
                    aHtml.push("<li>" + sTrim.slice(2) + "</li>");
                } else {
                    if (bInList) {
                        aHtml.push("</ul>");
                        bInList = false;
                    }
                    if (/^\d+\.\s+/.test(sTrim)) {
                        aHtml.push('<p style="margin-left: 16px;">' + sTrim + "</p>");
                    } else {
                        aHtml.push("<p>" + sTrim + "</p>");
                    }
                }
            });

            if (bInList) {
                aHtml.push("</ul>");
            }
            return aHtml.join("");
        },

        _selectChapterObject: function (oChapter) {
            var oModel = this.getModel("guidelineModel");
            oModel.setProperty("/selectedChapter", oChapter);
            oModel.setProperty("/selectedChapterId", oChapter.id);
            oModel.setProperty("/activeCodeFileName", oChapter.primaryFile || "");
            oModel.setProperty("/activeCodeFilePath", oChapter.primaryFilePath || "");
            oModel.setProperty("/activeCodeSnippet", oChapter.codeSnippet || "");
            oModel.setProperty("/activeTreeLabel", oChapter.title || oChapter.id);
            this._lastSpiedNodeId = oChapter.id;
            this._updateFullCodeDisplay(oChapter.codeSnippet, oChapter.annotatedLines, oChapter.primaryFilePath);
            this._syncTreeSelectionToNode(oChapter.id);
        },

        _updateFullCodeDisplay: function (sCode, aAnnotatedLines, sFilePath) {
            var oHtml = this.byId("guidelineFullCodeHtml");
            if (oHtml) {
                var oModel = this.getModel("guidelineModel");
                var aAnn = aAnnotatedLines;
                if (!aAnn && oModel) {
                    var oCur = oModel.getProperty("/selectedChapter");
                    if (oCur) aAnn = oCur.annotatedLines;
                }
                var sKind = this._detectLanguageKind(sFilePath);
                var sRendered = CodeTips.parseToHtml(sCode || "", sKind, aAnn);
                oHtml.setContent(sRendered);
                setTimeout(function () {
                    var oDomRef = oHtml.getDomRef();
                    if (oDomRef) {
                        CodeTips.attach(oDomRef);
                    }
                }, 80);
            }
        },

        formatCodeExcerptHtml: function (sCode) {
            return this.formatCodeBlockHtml(sCode);
        },

        _detectLanguageKind: function (sFilePath) {
            var p = (sFilePath || "").toLowerCase();
            if (p.endsWith(".json")) return "json";
            if (p.endsWith(".yaml") || p.endsWith(".yml")) return "yaml";
            if (p.endsWith(".xml")) return "xml";
            if (p.endsWith(".js")) return "js";
            if (p.endsWith(".asbdef") || p.endsWith(".bdef")) return "bdef";
            if (p.endsWith(".asddls") || p.endsWith(".ddls") || p.endsWith(".assrvd")) return "cds";
            if (p.endsWith(".abap")) return "abap";
            if (p.endsWith(".md")) return "md";
            if (p.endsWith(".bat") || p.endsWith(".html") || p.endsWith(".sql") || p.endsWith(".properties") || p.endsWith(".css")) return "shell";
            return null;
        },

        onChapterSelect: function (oEvent) {
            var sKey = oEvent.getParameter("key");
            var oModel = this.getModel("guidelineModel");
            var aChapters = oModel.getProperty("/chapters") || [];
            var oSelected = aChapters.find(function (c) { return c.id === sKey; });

            if (oSelected) {
                this._selectChapterObject(oSelected);
            }
        },

        onQuickChapterChange: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (!oSelectedItem) {
                return;
            }
            var sKey = oSelectedItem.getKey();
            var oModel = this.getModel("guidelineModel");
            var aChapters = oModel.getProperty("/chapters") || [];
            var oSelected = aChapters.find(function (c) { return c.id === sKey; });

            if (oSelected) {
                this._selectChapterObject(oSelected);
                var oTabBar = this.byId("chapterTabBar");
                if (oTabBar) {
                    oTabBar.setSelectedKey(sKey);
                }
            }
        },

        _loadFileIntoSection3: function (oFileObj) {
            if (!oFileObj) {
                return;
            }
            var oModel = this.getModel("guidelineModel");
            var sCode = oFileObj.fullCode || oFileObj.codeExcerpt || "";
            var sPath = oFileObj.filePath || "";
            var sName = sPath.split("/").pop();

            oModel.setProperty("/activeCodeFileName", sName);
            oModel.setProperty("/activeCodeFilePath", sPath);
            oModel.setProperty("/activeCodeSnippet", sCode);
            this._updateFullCodeDisplay(sCode, oFileObj.annotatedLines || [], sPath);

            MessageToast.show("Đã nạp mã nguồn file: " + sPath + " xuống Mục 3");
            var oHtml = this.byId("guidelineFullCodeHtml");
            if (oHtml && oHtml.getDomRef()) {
                oHtml.getDomRef().scrollIntoView({ behavior: "smooth", block: "center" });
            }
        },

        onInspectRelatedFile: function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext("guidelineModel");
            if (!oCtx) {
                return;
            }
            this._loadFileIntoSection3(oCtx.getObject());
        },

        onInspectStepTargetFile: function (oEvent) {
            var oSource = oEvent.getSource();
            var oCtx = oSource.getBindingContext("guidelineModel");
            if (!oCtx) {
                return;
            }
            var sTargetPath = oSource.data("filePath") || oCtx.getProperty("filePath") || oCtx.getProperty("targetFilePath");
            if (!sTargetPath) {
                return;
            }
            var oModel = this.getModel("guidelineModel");
            var oCurChap = oModel.getProperty("/selectedChapter");
            var aChapters = oModel.getProperty("/chapters") || [];
            var aPool = (oCurChap && oCurChap.relatedFiles ? oCurChap.relatedFiles : []).slice();
            aChapters.forEach(function (c) {
                if (c !== oCurChap && Array.isArray(c.relatedFiles)) {
                    aPool = aPool.concat(c.relatedFiles);
                }
            });
            var oMatch = aPool.find(function (f) { return f.filePath === sTargetPath; });
            if (oMatch) {
                this._loadFileIntoSection3(oMatch);
            } else {
                MessageToast.show("File " + sTargetPath + " nằm trong Bản Đồ File.");
            }
        },

        onCopyStepCode: function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext("guidelineModel");
            if (!oCtx) {
                return;
            }
            var sCode = oCtx.getProperty("stepCode");
            if (sCode) {
                this._copyToClipboard(sCode, "Đã sao chép đoạn code mẫu của Bước " + oCtx.getProperty("stepNumber") + "!");
            }
        },

        onResetPrimaryCode: function () {
            var oChap = this.getModel("guidelineModel").getProperty("/selectedChapter");
            if (oChap) {
                this._selectChapterObject(oChap);
                MessageToast.show("Đã quay lại mã nguồn file chính: " + oChap.primaryFilePath);
            }
        },

        onCopyCliCommand: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext("guidelineModel");
            var sCommands = "";

            if (oContext) {
                var aCmds = oContext.getProperty("cliCommands") || [];
                sCommands = aCmds.join("\n");
            } else {
                var oModel = this.getModel("guidelineModel");
                var oChap = oModel.getProperty("/selectedChapter");
                if (oChap && oChap.cliCommands) {
                    sCommands = oChap.cliCommands.join("\n");
                }
            }

            if (sCommands) {
                this._copyToClipboard(sCommands, "Đã sao chép các lệnh Terminal vào Clipboard!");
            }
        },

        onCopyCodeSnippet: function () {
            var oModel = this.getModel("guidelineModel");
            var sCode = oModel.getProperty("/activeCodeSnippet");
            var sName = oModel.getProperty("/activeCodeFileName") || "code";
            if (!sCode) {
                var oChap = oModel.getProperty("/selectedChapter");
                sCode = oChap && oChap.codeSnippet;
                sName = (oChap && oChap.primaryFile) || sName;
            }
            if (sCode) {
                this._copyToClipboard(sCode, "Đã sao chép toàn bộ mã nguồn của file: " + sName + "!");
            }
        },

        onCopyStepCommand: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext("guidelineModel");
            if (oContext) {
                var sCommand = oContext.getProperty("commandOrPath");
                if (sCommand) {
                    this._copyToClipboard(sCommand, "Đã sao chép: " + sCommand);
                }
            }
        },

        onPreviewImage: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext("guidelineModel");
            var sImageSrc = "";
            var sCaption = "Hình ảnh minh họa thực tế";

            if (oSource.getMetadata && oSource.getMetadata().getName() === "sap.m.Image") {
                sImageSrc = oSource.getSrc();
            }

            if (oContext) {
                var sStepImg = oContext.getProperty("stepImage");
                var sChapImg = oContext.getProperty("image");
                if (sStepImg && (!sImageSrc || sImageSrc.indexOf(sStepImg) !== -1)) {
                    sImageSrc = sStepImg;
                    sCaption = oContext.getProperty("stepImageCaption") || oContext.getProperty("actionTitle") || sCaption;
                } else if (sChapImg) {
                    sImageSrc = sChapImg;
                    sCaption = oContext.getProperty("imageCaption") || oContext.getProperty("title") || sCaption;
                }
            }

            if (!sImageSrc) {
                var oModel = this.getModel("guidelineModel");
                var oChap = oModel.getProperty("/selectedChapter");
                if (oChap && oChap.image) {
                    sImageSrc = oChap.image;
                    sCaption = oChap.imageCaption || oChap.title || sCaption;
                }
            }

            if (!sImageSrc) {
                MessageToast.show("Không tìm thấy đường dẫn ảnh!");
                return;
            }

            if (!this._oImagePreviewDialog) {
                var oImgControl = new Image({
                    src: sImageSrc,
                    width: "100%",
                    densityAware: false
                }).addStyleClass("dialogPreviewImage");

                var oCaptionText = new Text({
                    text: sCaption
                }).addStyleClass("sapUiTextBold sapUiSmallMarginTop dialogCaptionText");

                var oContentBox = new VBox({
                    alignItems: "Center",
                    justifyContent: "Center",
                    items: [
                        oImgControl,
                        oCaptionText
                    ]
                }).addStyleClass("sapUiSmallMargin imageDialogContainer");

                this._oImagePreviewDialog = new Dialog({
                    title: "🔍 Chi Tiết Hình Ảnh Minh Họa Thực Tế",
                    icon: "sap-icon://zoom-in",
                    contentWidth: "85vw",
                    contentHeight: "82vh",
                    resizable: true,
                    draggable: true,
                    content: [oContentBox],
                    endButton: new Button({
                        text: "Đóng",
                        icon: "sap-icon://decline",
                        type: "Emphasized",
                        press: function () {
                            this._oImagePreviewDialog.close();
                        }.bind(this)
                    })
                });

                this.getView().addDependent(this._oImagePreviewDialog);
            }

            var oBox = this._oImagePreviewDialog.getContent()[0];
            if (oBox && oBox.getItems) {
                var aItems = oBox.getItems();
                if (aItems[0] && aItems[0].setSrc) {
                    aItems[0].setSrc(sImageSrc);
                }
                if (aItems[1] && aItems[1].setText) {
                    aItems[1].setText(sCaption);
                }
            }

            this._oImagePreviewDialog.open();
        },

        _copyToClipboard: function (sText, sSuccessMsg) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(sText).then(function () {
                    MessageToast.show(sSuccessMsg);
                }).catch(function () {
                    MessageToast.show("Không thể tự động sao chép, vui lòng copy thủ công.");
                });
            } else {
                var oTempInput = document.createElement("textarea");
                oTempInput.value = sText;
                document.body.appendChild(oTempInput);
                oTempInput.select();
                document.execCommand("copy");
                document.body.removeChild(oTempInput);
                MessageToast.show(sSuccessMsg);
            }
        },

        onNavBack: function () {
            if (window.location.search.indexOf("workspace=guideline") >= 0) {
                window.location.href = window.location.href.split("?")[0].split("#")[0] + "#/dashboard";
            } else {
                this.navTo("dashboard");
            }
        },

        onNextChapter: function () {
            var oModel = this.getModel("guidelineModel");
            var aChapters = oModel.getProperty("/chapters") || [];
            var sCurrentId = oModel.getProperty("/selectedChapterId");
            var iIdx = -1;
            for (var i = 0; i < aChapters.length; i++) {
                if (aChapters[i].id === sCurrentId) {
                    iIdx = i;
                    break;
                }
            }
            if (iIdx >= 0 && iIdx < aChapters.length - 1) {
                var oNext = aChapters[iIdx + 1];
                this._selectChapterObject(oNext);
                var oTabBar = this.byId("chapterTabBar");
                if (oTabBar) {
                    oTabBar.setSelectedKey(oNext.id);
                }
                MessageToast.show("Đã chuyển sang: " + oNext.title);
                this._scrollRightToSelector('[id$="chapterHeaderPanel"]');
            } else {
                MessageToast.show("Bạn đã hoàn thành chương cuối cùng (Chương " + aChapters.length + ")!");
            }
        },

        onPreviousChapter: function () {
            var oModel = this.getModel("guidelineModel");
            var aChapters = oModel.getProperty("/chapters") || [];
            var sCurrentId = oModel.getProperty("/selectedChapterId");
            var iIdx = -1;
            for (var i = 0; i < aChapters.length; i++) {
                if (aChapters[i].id === sCurrentId) {
                    iIdx = i;
                    break;
                }
            }
            if (iIdx > 0) {
                var oPrev = aChapters[iIdx - 1];
                this._selectChapterObject(oPrev);
                var oTabBar = this.byId("chapterTabBar");
                if (oTabBar) {
                    oTabBar.setSelectedKey(oPrev.id);
                }
                MessageToast.show("Đã quay lại: " + oPrev.title);
                this._scrollRightToSelector('[id$="chapterHeaderPanel"]');
            } else {
                MessageToast.show("Bạn đang ở chương đầu tiên (Chương 1)!");
            }
        }
    });
});
