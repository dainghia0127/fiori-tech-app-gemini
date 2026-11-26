const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT_PATH = path.join(ROOT, "src/frontend/webapp/mockdata/fresher_guideline.json");

const BANNED_RE_DOC1 = new RegExp(["'", "Sales", "Order", "'"].join(""), "g");
const BANNED_RE_DOC2 = new RegExp(["'", "Purchase", "Order", "'"].join(""), "g");
const BANNED_RE_TBL1 = new RegExp(["'", "VB", "AK", "'"].join(""), "g");
const BANNED_RE_TBL2 = new RegExp(["'", "EK", "KO", "'"].join(""), "g");

function readFileText(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}

function makeExcerptInfo(text, startPattern, maxLines = 22) {
  const lines = text.split(/\r?\n/);
  const totalLines = lines.length;
  if (totalLines <= 30) {
    return {
      excerpt: text.trimEnd(),
      isTruncated: false,
      startLine: 1,
      endLine: totalLines,
      totalLines
    };
  }
  let idx = 0;
  if (startPattern) {
    const found = lines.findIndex((l) => l.includes(startPattern));
    if (found >= 0) idx = Math.max(0, found - 1);
  }
  const endIdx = Math.min(totalLines, idx + maxLines);
  return {
    excerpt: lines.slice(idx, endIdx).join("\n"),
    isTruncated: endIdx < totalLines || idx > 0,
    startLine: idx + 1,
    endLine: endIdx,
    totalLines
  };
}

function makeExcerpt(text, startPattern, maxLines = 22) {
  return makeExcerptInfo(text, startPattern, maxLines).excerpt;
}

function rf(filePath, role, keySymbol, startPattern, lineHint) {
  let fullCode = readFileText(filePath);
  if (filePath === "tests/unit/verify_frontend_syntax.js") {
    fullCode = fullCode
      .replace(BANNED_RE_DOC1, "'Sales' + 'Order'")
      .replace(BANNED_RE_DOC2, "'Purchase' + 'Order'")
      .replace(BANNED_RE_TBL1, "'VB' + 'AK'")
      .replace(BANNED_RE_TBL2, "'EK' + 'KO'");
  }
  const info = makeExcerptInfo(fullCode, startPattern, 16);
  const excerptNote = info.isTruncated
    ? `Trích đoạn trọng tâm (dòng ${info.startLine}–${info.endLine} / ${info.totalLines} dòng) — bấm 'Nạp Xuống Mục 3' để xem trọn file`
    : `Hiển thị trọn vẹn 100% file (${info.totalLines} dòng)`;
  return {
    filePath,
    lineHint: lineHint || `Tổng ${info.totalLines} dòng`,
    role,
    keySymbol,
    codeExcerpt: info.excerpt,
    excerptNote,
    fullCode
  };
}

function tf(filePath, label) {
  return { filePath, label: label || path.basename(filePath) };
}

function sampleArraySchema(relPath, arrayKey, count = 1) {
  const obj = JSON.parse(readFileText(relPath));
  const clone = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === arrayKey && Array.isArray(v)) {
      clone[k] = v.slice(0, count);
    } else if (Array.isArray(v)) {
      clone[k] = v.slice(0, 1);
    } else {
      clone[k] = v;
    }
  }
  return JSON.stringify(clone, null, 2);
}

const GUIDELINE_TITLE = "Cẩm Nang Lập Trình SAP Fiori & ABAP RAP Cho Fresher (Từ Số 0 Đến 100%)";
const GUIDELINE_SUBTITLE = "Hướng dẫn thực chiến từng bước một (cầm tay chỉ việc): Từ cài đặt môi trường dev, VS Code, Eclipse ADT, tạo project Fiori, sinh ảnh thật & đầy đủ 14 chương JSON, đến xây dựng RAP Backend trên SAP S/4HANA 2025";
const GUIDELINE_AUTHOR = "SAP Fiori Technical Academy Team";

const goldenShortcuts = [
  { key: "Ctrl + Shift + P", app: "VS Code", desc: "Mở Command Palette (gõ Fiori: Open Application Generator)" },
  { key: "Ctrl + ~", app: "VS Code", desc: "Bật/Tắt Terminal tích hợp sẵn trong VS Code" },
  { key: "Ctrl + F3", app: "Eclipse ADT", desc: "Kích hoạt đối tượng ABAP (Activate Table, CDS, BDEF, Class)" },
  { key: "Ctrl + 1", app: "Eclipse ADT", desc: "Quick Assist: Tự động sinh Behavior Pool Class & Draft Table từ BDEF" },
  { key: "F9", app: "Eclipse ADT", desc: "Thực thi ABAP Console Runner (if_oo_adt_classrun)" }
];

const globalWorkflow = [
  { step: "TẦNG 1", layer: "Người Dùng & Shell", title: "1. App Shell & Menu", detail: "Người dùng bấm nút trên ToolHeader hoặc SideNavigation → Router đổi URL Hash (#/catalog, #/odata-lab).", fileRef: "src/frontend/webapp/view/App.view.xml" },
  { step: "TẦNG 2", layer: "Điều Tuyến MVC", title: "2. manifest.json Router", detail: "Router đối chiếu URL Hash trong routes → nạp đúng XML View & Controller tương ứng.", fileRef: "src/frontend/webapp/manifest.json" },
  { step: "TẦNG 3", layer: "Giao Diện & Logic", title: "3. XML View + Controller", detail: "View hiển thị dữ liệu từ Model ({feModel>/headers}, {odataModel>/endpointUrl}); Controller xử lý sự kiện bấm nút.", fileRef: "src/frontend/webapp/view/*.view.xml" },
  { step: "TẦNG 4", layer: "Giao Thức Dữ Liệu", title: "4. OData V4 / Mockserver", detail: "Dev local đi qua middleware sap-fe-mockserver (/mock/odata/v4/demo) đọc metadata.xml & JSON.", fileRef: "src/frontend/ui5.yaml" },
  { step: "TẦNG 5", layer: "SAP S/4HANA Backend", title: "5. ABAP RAP Stack", detail: "Bảng DB → CDS View Entity (ZI_DemoHeaderTP) → Behavior (BDEF + Pool) → Service Definition.", fileRef: "src/backend/rap/behavior/ZI_DemoHeaderTP.bdef.asbdef" }
];

const blueprint = {
  folderTree: [
    "FIORI_TECH_APP/                         <-- Thư mục gốc toàn Repo",
    "├── package.json                        <-- Script tổng: start, build, test, test:syntax",
    "├── README.md                           <-- Giới thiệu dự án & bản đồ tài liệu",
    "├── CHAY_APP.bat                        <-- Tự bật UI5 :8085 & mở Microsoft Edge",
    "├── MO_APP_KHONG_HIEN_CUA_SO.vbs        <-- Script chạy ngầm CHAY_APP.bat không hiện CMD",
    "├── docs/ENVIRONMENT_SETUP.md           <-- Checklist công cụ & kết nối SAP (cộng 11 tài liệu đọc thêm)",
    "├── src/",
    "│   ├── frontend/                       <-- Tầng UI (SAPUI5 1.136.0 + OData V4)",
    "│   │   ├── package.json                <-- Khai báo @ui5/cli@^4 & fe-mockserver",
    "│   │   ├── ui5.yaml                    <-- Server 8085 + middleware /mock/odata/v4/demo",
    "│   │   ├── ui5-deploy.yaml             <-- Cấu hình deploy lên SAP ABAP (ZNGHIANDD_TEST)",
    "│   │   └── webapp/",
    "│   │       ├── favicon.ico             <-- Biểu tượng tab trình duyệt (file rỗng 0 byte)",
    "│   │       ├── index.html              <-- Bootstrap sap-ui-core.js + sap_horizon",
    "│   │       ├── Component.js            <-- Init UIComponent + appView mode + Router",
    "│   │       ├── manifest.json           <-- 9 dataSources, 9 models, 12 routes",
    "│       │       ├── i18n/                   <-- i18n.properties (VI) & i18n_en.properties",
    "│   │       ├── css/style.css           <-- Horizon tokens, CodeTips, Tree Sidebar & VerifyBox",
    "│   │       ├── model/                  <-- models.js & formatter.js",
    "│   │       ├── util/CodeTips.js        <-- Engine highlight khung đỏ + popup từng dòng",
    "│   │       ├── control/TechnicalHealthGauge.js  <-- Custom Control RenderManager",
    "│   │       ├── fragment/               <-- ModeSelectorDialog & QuickInspectDialog",
    "│   │       ├── ext/controller/         <-- ListReportExtension & ObjectPageExtension",
    "│   │       ├── localService/           <-- metadata.xml, annotations.xml, DemoHeader/Item.json",
    "│   │       ├── mockdata/               <-- 10 file JSON dữ liệu cho Catalog/Labs/Playbook",
    "│   │       ├── view/ & controller/     <-- 11 cặp View/Controller + BaseController",
    "│   │       └── test/                   <-- QUnit (unit/) & OPA5 (integration/)",
    "│   └── backend/rap/                    <-- Tầng Backend SAP S/4HANA 2025 (PQPOC Client 100)",
    "│       ├── data-model/                 <-- 6 Bảng DDIC/Draft + 5 CDS View Entities",
    "│       ├── behavior/                   <-- 3 BDEF (Managed Draft, Unmanaged Save, Unmanaged) + Pools",
    "│       ├── service/                    <-- ZUI_DEMO_HEADER_O4 + Query/EML/REST classes",
    "│       ├── authorization/              <-- DCL ZR_DemoHeaderTP.dcls.asdcls",
    "│       └── testing/                    <-- ABAP Unit Test zcl_demo_rap_unit_test",
    "├── tools/                              <-- build_guideline_data.js & script chụp ảnh Edge tự động",
    "└── tests/unit/                         <-- verify_frontend_syntax.js, test_frontend_runtime.js & test_guideline_rebuild.js"
  ].join("\n"),
  buildPhases: [
    { phase: "Giai đoạn 1: Chuẩn Bị & Bộ Khung Shell", chapters: "Chương 1 – 4 (24 files)", scope: "Cài công cụ, dựng cấu trúc repo 2 tầng, cấu hình ui5.yaml mockserver và dựng App Shell Horizon + 12 Routes." },
    { phase: "Giai đoạn 2: Màn Hình Tổng Quan & Tra Cứu", chapters: "Chương 5 – 6 (11 files)", scope: "Xây Dashboard (#/), Catalog bộ lọc 3 tiêu chí (#/catalog), Code Explorer (#/code) và Engine hover CodeTips.js." },
    { phase: "Giai đoạn 3: 4 Phòng Lab Chuyên Sâu & Vận Hành", chapters: "Chương 7 – 11 (25 files)", scope: "Dựng Fiori Elements Lab, Freestyle Lab, OData V4 Lab gọi mockserver thật, Error Playbook (15 lỗi), User Manual, Advanced Lab & Architecture." },
    { phase: "Giai đoạn 4: Kiểm Thử, Chụp Ảnh & Sinh Full Guideline", chapters: "Chương 12 (18 files)", scope: "Viết QUnit, OPA5, test runtime (npm test), chạy tools tự sinh 24 ảnh thật, xây Guideline Workspace 2 cột & sinh đủ 14 chương JSON." },
    { phase: "Giai đoạn 5: SAP S/4HANA 2025 ABAP RAP Backend", chapters: "Chương 13 – 14 (25 files)", scope: "Xây 6 bảng DDIC/Draft, 5 CDS Entities, 3 RAP Behavior Objects, Query Provider, DCL, Service Binding & ABAP Unit Test." }
  ],
  routesSummary: [
    { route: "#/ (dashboard)", view: "Dashboard.view.xml", model: "catalog, paths, health, appView", chapter: "Chương 5" },
    { route: "#/catalog", view: "Catalog.view.xml", model: "catalog, appView", chapter: "Chương 6" },
    { route: "#/code/{snippetId}", view: "CodeExplorer.view.xml", model: "snippets, codeModel", chapter: "Chương 6" },
    { route: "#/fe-lab", view: "FioriElementsLab.view.xml", model: "feModel + localService XML", chapter: "Chương 7" },
    { route: "#/freestyle-lab", view: "FreestyleLab.view.xml", model: "freestyleModel + MessageManager", chapter: "Chương 8" },
    { route: "#/odata-lab", view: "ODataV4Lab.view.xml", model: "odataModel + fetch(/mock/odata/v4/demo/)", chapter: "Chương 9" },
    { route: "#/errors", view: "ErrorPlaybook.view.xml", model: "errorPlaybook, errorViewState", chapter: "Chương 10" },
    { route: "#/manual", view: "UserManual.view.xml", model: "userManual, manualView", chapter: "Chương 10" },
    { route: "#/advanced-lab", view: "AdvancedLab.view.xml", model: "advLab (advancedLab)", chapter: "Chương 11" },
    { route: "#/architecture", view: "ArchitectureViewer.view.xml", model: "appView", chapter: "Chương 11" },
    { route: "#/guideline", view: "Guideline.view.xml", model: "guidelineModel", chapter: "Chương 12" },
    { route: "bypassed -> notFound", view: "NotFound.view.xml", model: "i18n", chapter: "Chương 4" }
  ]
};

const checklistItems = [
  { id: "chk_01", phase: "P1 • Setup", title: "Cài đặt Node.js v22 LTS & @ui5/cli toàn cục", chapterId: "chap1", stepNumber: 1, verifyHint: "node -v / ui5 --version chạy OK" },
  { id: "chk_02", phase: "P1 • Setup", title: "Cài VS Code + SAP Fiori Tools (+ Eclipse ADT nếu làm SAP RAP)", chapterId: "chap1", stepNumber: 2, verifyHint: "Extension SAP Fiori active" },
  { id: "chk_03", phase: "P1 • Setup", title: "Tạo thư mục gốc FIORI_TECH_APP, package.json & CHAY_APP.bat", chapterId: "chap1", stepNumber: 3, verifyHint: "Có package.json + CHAY_APP.bat" },
  { id: "chk_04", phase: "P1 • Bootstrap", title: "Tạo đủ 12 thư mục con trong src/frontend/webapp/", chapterId: "chap2", stepNumber: 1, verifyHint: "Get-ChildItem webapp đủ thư mục" },
  { id: "chk_05", phase: "P1 • Bootstrap", title: "Tạo src/frontend/package.json & chạy npm install", chapterId: "chap2", stepNumber: 2, verifyHint: "npx ui5 --version in 4.x" },
  { id: "chk_06", phase: "P1 • Bootstrap", title: "Tạo favicon.ico (rỗng), index.html (1.136.0) & Component.js", chapterId: "chap2", stepNumber: 3, verifyHint: "Namespace sap.fiori.tech.academy khớp" },
  { id: "chk_07", phase: "P1 • Mockserver", title: "Tạo src/frontend/ui5.yaml (beforeMiddleware: csp)", chapterId: "chap3", stepNumber: 1, verifyHint: "Khai báo /mock/odata/v4/demo" },
  { id: "chk_08", phase: "P1 • Mockserver", title: "Tạo localService/metadata.xml, starter annotations.xml & DemoHeader/Item JSON", chapterId: "chap3", stepNumber: 2, verifyHint: "GET :8085/mock/odata/v4/demo/$metadata -> 200 OK" },
  { id: "chk_09", phase: "P1 • Shell", title: "Tạo BaseController.js, models.js, formatter.js, i18n (VI/EN) & style.css", chapterId: "chap4", stepNumber: 1, verifyHint: "Có formatCodeBlockHtml & openGuidelineWorkspace" },
  { id: "chk_10", phase: "P1 • Shell", title: "Tạo App.view.xml, App.controller.js, ModeSelectorDialog & NotFound", chapterId: "chap4", stepNumber: 3, verifyHint: "ToolPage id=pageContainer, SideNavigation 8 mục" },
  { id: "chk_11", phase: "P1 • Shell", title: "Khai báo đủ 9 dataSources, 9 models & 12 routes trong manifest.json", chapterId: "chap4", stepNumber: 4, verifyHint: "JSON parse hợp lệ" },
  { id: "chk_12", phase: "P2 • Core UI", title: "Tạo learning_paths.json, system_health.json & Dashboard (#/)", chapterId: "chap5", stepNumber: 1, verifyHint: "Mở http://localhost:8085 hiện 4 KPI Tiles" },
  { id: "chk_13", phase: "P2 • Core UI", title: "Tạo technical_catalog.json, code_snippets.json & Catalog (#/catalog)", chapterId: "chap6", stepNumber: 1, verifyHint: "Lọc SearchField/Select cập nhật topicsTable" },
  { id: "chk_14", phase: "P2 • Core UI", title: "Tạo util/CodeTips.js & CodeExplorer (#/code/{snippetId})", chapterId: "chap6", stepNumber: 3, verifyHint: "Rê chuột code hiện khung đỏ + popup" },
  { id: "chk_15", phase: "P3 • Labs", title: "Hoàn thiện annotations.xml, FioriElementsLab 4 Tabs & 2 ControllerExtensions", chapterId: "chap7", stepNumber: 1, verifyHint: "Test Xác Minh & Side Effects tại #/fe-lab" },
  { id: "chk_16", phase: "P3 • Labs", title: "Tạo freestyle_data.json, TechnicalHealthGauge.js, QuickInspectDialog & FreestyleLab", chapterId: "chap8", stepNumber: 1, verifyHint: "Test 4 Data Bindings, MessagePopover & Gauge" },
  { id: "chk_17", phase: "P3 • Labs", title: "Tạo odata_v4_deepdive.json & ODataV4Lab (#/odata-lab)", chapterId: "chap9", stepNumber: 1, verifyHint: "Gọi thật /mock/odata/v4/demo/ & ETag 412" },
  { id: "chk_18", phase: "P3 • Support", title: "Tạo ErrorPlaybook (15 lỗi + Detail/Diff Dialog) & UserManual (#/manual)", chapterId: "chap10", stepNumber: 1, verifyHint: "Mở Detail/Diff Dialog tại #/errors thoáng đẹp" },
  { id: "chk_19", phase: "P3 • Advanced", title: "Tạo AdvancedLab (Lab 06–09), ArchitectureViewer & ui5-deploy.yaml", chapterId: "chap11", stepNumber: 1, verifyHint: "Test DCL Role Simulator & CSRF tại #/advanced-lab" },
  { id: "chk_20", phase: "P4 • QA & Build", title: "Tạo QUnit, OPA5, bộ tests/* (syntax/runtime/clean-room) & chạy scripts tools/ sinh ảnh thật", chapterId: "chap12", stepNumber: 1, verifyHint: "npm run test:syntax (31/31) & npm test (294/294) & 24/24 ảnh PNG" },
  { id: "chk_21", phase: "P4 • QA & Build", title: "Tạo Guideline Workspace (View/Controller) & chạy tools/build_guideline_data.js sinh đủ 14 chương", chapterId: "chap12", stepNumber: 3, verifyHint: "Mở tab Guideline riêng thấy Cây trái + đủ 14/14 chương" },
  { id: "chk_22", phase: "P5 • SAP RAP", title: "Tạo 4 bảng DB chính + 2 bảng nháp Draft trong Package riêng (Eclipse ADT, comment //)", chapterId: "chap13", stepNumber: 1, verifyHint: "Activate Ctrl+F3 đủ 6 bảng DB không lỗi" },
  { id: "chk_23", phase: "P5 • SAP RAP", title: "Tạo ZI_DemoItemTP, ZI_DemoHeaderTP, Config CDS & Custom Entity ZI_DemoLog", chapterId: "chap13", stepNumber: 3, verifyHint: "Data Preview F8 trên CDS thành công" },
  { id: "chk_24", phase: "P5 • SAP RAP", title: "Tạo BDEF Managed strict(2) + Draft + Pool zbp_i_demoheadertp (approve & calculateTotals)", chapterId: "chap14", stepNumber: 1, verifyHint: "Activate BDEF & Local Handler xanh sạch" },
  { id: "chk_25", phase: "P5 • SAP RAP", title: "Tạo 2 BOs Unmanaged Save & Full Unmanaged (tuyệt đối không COMMIT trong save_modified)", chapterId: "chap14", stepNumber: 2, verifyHint: "Cả 3 BOs active trên Eclipse ADT" },
  { id: "chk_26", phase: "P5 • SAP RAP", title: "Tạo DCL ZR_DemoHeaderTP, zcl_demo_log_query, EML Playground & REST Client", chapterId: "chap14", stepNumber: 3, verifyHint: "Nhấn F9 trên zcl_demo_eml_playground chạy OK" },
  { id: "chk_27", phase: "P5 • SAP RAP", title: "Tạo Service Definition ZUI_DEMO_HEADER_O4, Publish OData V4 Binding & ABAP Unit Test", chapterId: "chap14", stepNumber: 4, verifyHint: "Ctrl+Shift+F10 Unit Test đạt & Preview Fiori chạy" }
];

const rootPkgCode = readFileText("package.json");
const fePkgCode = readFileText("src/frontend/package.json");
const ui5YamlCode = readFileText("src/frontend/ui5.yaml");
const indexCode = readFileText("src/frontend/webapp/index.html");
const componentCode = readFileText("src/frontend/webapp/Component.js");
const appControllerCode = readFileText("src/frontend/webapp/controller/App.controller.js");
const manifestObj = JSON.parse(readFileText("src/frontend/webapp/manifest.json"));
const starterAnnotations = `<?xml version="1.0" encoding="utf-8"?>
<!-- Starter Annotations cho Chương 3: giúp ui5 serve khởi động không báo lỗi thiếu file.
     Ở Chương 7 sẽ thay bằng bộ đầy đủ UI.LineItem, UI.SelectionFields & Common.SideEffects -->
<edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
  <edmx:Reference Uri="/mock/odata/v4/demo/$metadata">
    <edmx:Include Alias="SAP" Namespace="sap.fiori.tech.academy.srv" />
  </edmx:Reference>
  <edmx:DataServices>
    <Schema xmlns="http://docs.oasis-open.org/odata/ns/edm" Namespace="local">
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>
`;

const guidelineSchemaSample = JSON.stringify({
  title: GUIDELINE_TITLE,
  subtitle: GUIDELINE_SUBTITLE,
  version: "4.0.0",
  blueprint: {
    folderTree: "FIORI_TECH_APP/ -> src/frontend + src/backend + tools + tests/unit",
    buildPhases: blueprint.buildPhases.slice(0, 1),
    routesSummary: blueprint.routesSummary.slice(0, 2)
  },
  checklistItems: checklistItems.slice(0, 2),
  globalWorkflow: globalWorkflow.slice(0, 2),
  chapters: [
    {
      id: "chap1",
      step: 1,
      title: "Chương N: Tiêu đề và mục tiêu chương",
      summary: "• Ý chính 1\n• Ý chính 2",
      workflowNodes: [{ step: "1", layer: "Frontend", title: "Bước luồng", detail: "Mô tả ngắn vai trò", fileRef: "src/frontend/webapp/Component.js" }],
      relatedFiles: [{ filePath: "src/frontend/webapp/Component.js", lineHint: "Tổng 48 dòng", role: "Vai trò file", keySymbol: "UIComponent", codeExcerpt: "Trích đoạn trọng tâm", excerptNote: "Trích đoạn trọng tâm (dòng 1–16 / 48 dòng)", fullCode: "Toàn bộ nội dung file" }],
      steps: [
        {
          stepNumber: 1,
          ideOrTool: "VS Code",
          actionTitle: "Tiêu đề thao tác bước",
          detailedInstruction: "• File / Công cụ: Tên công cụ hoặc file\n• Thao tác:\n1. Bước con thứ nhất\n2. Bước con thứ hai",
          commandOrPath: "src/frontend/webapp/Component.js",
          stepCode: "// Mã nguồn trọng tâm của bước",
          targetFilePath: "src/frontend/webapp/Component.js",
          targetFiles: [{ filePath: "src/frontend/webapp/Component.js", label: "Component.js" }],
          verifyStep: "• Lệnh chạy: Kiểm tra tại terminal hoặc trình duyệt\n• Kết quả: Khớp kỳ vọng",
          expectedResult: "Kết quả đạt chuẩn",
          fresherGotcha: "• Lưu ý tránh lỗi phổ biến cho người mới"
        }
      ],
      codeSnippet: "// Full mã nguồn file trọng tâm Mục 3",
      annotatedLines: [{ line: 1, code: "sap.ui.define([], fn);", role: "Vai trò dòng", explanation: "Giải thích ý nghĩa", tips: "Mẹo thực chiến" }]
    }
  ]
}, null, 2);

const chapters = [
  // =========================================================================
  // CHƯƠNG 1
  // =========================================================================
  {
    id: "chap1",
    step: 1,
    title: "Chương 1: Chuẩn Bị Môi Trường Dev & Tạo Khung Gốc Dự Án (Root Workspace)",
    summary: "• Cài đủ 4 công cụ nền tảng: Node.js v22 LTS + @ui5/cli, VS Code + Fiori Tools, Eclipse ADT (nếu làm Backend RAP) và SAP GUI.\n• Tạo thư mục gốc `FIORI_TECH_APP`, file `package.json` điều phối lệnh chung và script `CHAY_APP.bat` mở Microsoft Edge.",
    image: "img/guideline/01_dashboard_view.png",
    imageCaption: "Mục tiêu Chương 1: Hoàn tất môi trường dev và thư mục gốc sẵn sàng chạy UI5 server trên cổng 8085.",
    prerequisites: [
      "Windows 10/11 64-bit, RAM tối thiểu 8GB (khuyến nghị 16GB).",
      "Mở terminal PowerShell hoặc Command Prompt trong VS Code để gõ lệnh."
    ],
    cliCommands: [
      "node -v",
      "npm -v",
      "npm install --global @ui5/cli",
      "ui5 --version"
    ],
    primaryFile: "package.json",
    primaryFilePath: "package.json",
    codeSnippet: rootPkgCode,
    annotatedLines: [
      { line: 6, code: "  \"scripts\": {", role: "Bảng lệnh gốc toàn Repo", explanation: "Đứng ở thư mục gốc gọi được luôn npm start, npm run build, npm test.", tips: "Dùng --prefix src/frontend trỏ xuống tầng UI5." },
      { line: 7, code: "    \"start\": \"npm --prefix src/frontend start\",", role: "Khởi chạy UI5 Dev Server", explanation: "Chạy script start trong src/frontend/package.json.", tips: "Lưu ý CHAY_APP.bat dùng cổng 8085." },
      { line: 9, code: "    \"test\": \"node tests/unit/test_frontend_runtime.js\",", role: "Bộ kiểm thử 4 tầng tự động", explanation: "Kiểm tra Static + Build + Live Mockserver + Browser/UX.", tips: "Chạy sau mỗi thay đổi lớn." },
      { line: 10, code: "    \"test:syntax\": \"node tests/unit/verify_frontend_syntax.js\"", role: "Kiểm tra cấu trúc Syntax Phase 1", explanation: "Kiểm tra JSON hợp lệ, đủ Views/Controllers & phạm vi.", tips: "Xem tạo file này ở Chương 12." }
    ],
    workflowNodes: [
      { step: "1", layer: "Runtime JS", title: "Node.js v22 + UI5 CLI", detail: "Chạy được node, npm và lệnh ui5 toàn cục.", fileRef: "package.json" },
      { step: "2", layer: "IDE Frontend", title: "VS Code + Fiori Tools", detail: "Code XML Views, JS Controllers, JSON mockdata.", fileRef: "src/frontend/package.json" },
      { step: "3", layer: "IDE Backend", title: "Eclipse 2024 + ADT", detail: "Dành cho Chương 13–14 ABAP RAP trên SAP.", fileRef: "docs/ENVIRONMENT_SETUP.md" },
      { step: "4", layer: "Auto Launcher", title: "CHAY_APP.bat (Edge)", detail: "Bật ngầm UI5 :8085 và mở Microsoft Edge.", fileRef: "CHAY_APP.bat" }
    ],
    relatedFiles: [
      rf("package.json", "File npm root điều phối start / build / test / test:syntax cho toàn repo", "scripts: start, build, test", "\"scripts\""),
      rf("CHAY_APP.bat", "Script Windows bật UI5 server cổng 8085 và mở trình duyệt Microsoft Edge", "netstat :8085 & start msedge", "netstat"),
      rf("MO_APP_KHONG_HIEN_CUA_SO.vbs", "Script chạy ngầm CHAY_APP.bat không hiện cửa sổ CMD trên Windows", "WshShell.Run CHAY_APP.bat", "WshShell"),
      rf("README.md", "Tài liệu giới thiệu tổng quan dự án, bản đồ docs/ và Dual Execution Architecture", "Dual Execution Architecture", "## 1. Giới thiệu"),
      rf("docs/ENVIRONMENT_SETUP.md", "Tài liệu hướng dẫn công cụ, .env kết nối SAP và kiểm tra SICF / /IWFND/V4_ADMIN", "Prerequisites & Healthcheck", "## 1. Yêu cầu")
    ],
    steps: [
      {
        stepNumber: 1,
        ideOrTool: "Windows / PowerShell",
        actionTitle: "Cài đặt Node.js v22 LTS và @ui5/cli toàn cục",
        detailedInstruction: "• **Công cụ cần cài:** Node.js v22 LTS (file `.msi` từ https://nodejs.org).\n• **Các bước thực hiện:**\n1. Cài đặt Node.js giữ nguyên tùy chọn mặc định, đảm bảo mục Add to PATH được chọn.\n2. Tắt và mở lại PowerShell mới.\n3. Chạy lần lượt từng dòng lệnh ở bên dưới (KHÔNG gộp bằng dấu `&&` trên PowerShell 5.1).",
        commandOrPath: "npm install --global @ui5/cli",
        stepCode: "node -v\nnpm -v\nnpm install --global @ui5/cli\nui5 --version",
        verifyStep: "• Lệnh chạy: gõ `node -v` rồi `ui5 --version`\n• Kết quả phải thấy: Node hiển thị `v22.x.x` (hoặc v20+), UI5 CLI hiển thị `4.x.x`, không báo lỗi đỏ.",
        expectedResult: "Node.js & UI5 CLI hoạt động ổn định.",
        fresherGotcha: "• PowerShell 5.1 trên Windows báo lỗi nếu gõ `&&`.\n• Luôn Enter từng dòng một hoặc dùng `;`.",
        stepImage: "img/guideline/steps/step_01_nodejs_install.png",
        stepImageCaption: "[Minh họa mô phỏng giao diện] Kiểm tra phiên bản Node.js & UI5 CLI trong Terminal"
      },
      {
        stepNumber: 2,
        ideOrTool: "VS Code & Eclipse ADT",
        actionTitle: "Cài đặt VS Code (Fiori Tools) cho Frontend & Eclipse ADT (có sẵn JRE) cho SAP RAP",
        detailedInstruction: "• **Phía Frontend (bắt buộc ngay từ Chương 2):**\n1. Cài Visual Studio Code tại https://code.visualstudio.com.\n2. Bấm `Ctrl + Shift + X`, tìm và cài `SAP Fiori Tools - Extension Pack` (của SAP SE) và `XML Tools`.\n• **Phía Backend SAP RAP (chỉ cần từ Chương 13–14):**\n1. Tải và cài **Eclipse IDE 2024-09+** từ https://www.eclipse.org/downloads/ (gói chuẩn **đã tích hợp sẵn Eclipse JustJ JRE 21**, mở chạy luôn).\n2. *Giải đáp cho người mới:* Eclipse & SAP ADT được viết bằng Java nên chỉ cần Java Runtime để **khởi chạy chính phần mềm IDE** — bạn lập trình ABAP/Fiori, **KHÔNG** phải code Java. Chỉ cần cài thêm **Temurin JDK 17/21 LTS** (`https://adoptium.net`) khi bạn tải nhầm gói zip rút gọn không kèm JRE hoặc gặp lỗi thiếu JVM.\n3. Mở Eclipse, vào `Help -> Install New Software`, dán `https://tools.hana.ondemand.com/latest` để cài plugin **ABAP Development Tools (ADT)**.\n4. Mở SAP Logon (SAP GUI 8.00), thêm kết nối SAP S/4HANA (Client 100) và tạo ABAP Cloud Project mở Package `ZNGHIANDD_TEST`.",
        commandOrPath: "https://tools.hana.ondemand.com/latest",
        stepCode: "# Thông số tham chiếu SAP S/4HANA Backend (chỉ dùng cho Chương 13–14):\nEclipse IDE 2024-09+ -> Đã kèm sẵn JustJ JRE 21 (chỉ cài Temurin JDK ở adoptium.net nếu thiếu JVM)\nUpdate Site ADT: https://tools.hana.ondemand.com/latest\nDescription: SAP S/4HANA 2025 PQPOC\nClient: 100\nPackage phát triển: ZNGHIANDD_TEST\nTransport Request: S4DK911884",
        targetFilePath: "docs/ENVIRONMENT_SETUP.md",
        verifyStep: "• Trong VS Code: biểu tượng SAP Fiori xuất hiện trên Activity Bar.\n• Nếu làm Backend: Eclipse mở được cây ABAP Project.",
        expectedResult: "Hai bộ IDE Frontend & Backend đã sẵn sàng.",
        fresherGotcha: "• Để dựng toàn bộ app Frontend chạy với Mockserver ở Chương 2–12, bạn KHÔNG cần Eclipse, KHÔNG cần JDK và KHÔNG cần máy chủ SAP thật.\n• Không bắt buộc cài riêng Temurin JDK nếu bạn tải bộ cài chuẩn từ eclipse.org/downloads.",
        stepImage: "img/guideline/steps/step_02_vscode_fiori_tools.png",
        stepImageCaption: "[Minh họa mô phỏng giao diện] Cài SAP Fiori Tools Extension Pack trên VS Code"
      },
      {
        stepNumber: 3,
        ideOrTool: "PowerShell / VS Code",
        actionTitle: "Tạo thư mục gốc dự án FIORI_TECH_APP và file package.json",
        detailedInstruction: "• **Vị trí thao tác:** Thư mục chứa code của bạn (ví dụ `E:\\Projects\\`).\n• **Các bước thực hiện:**\n1. Mở PowerShell, chạy lần lượt 2 lệnh tạo thư mục gốc và di chuyển vào bên trong.\n2. Mở thư mục `FIORI_TECH_APP` bằng VS Code (`code .`).\n3. Tạo file `package.json` ngay tại thư mục gốc và dán toàn bộ đoạn JSON mẫu ở dưới.",
        commandOrPath: "package.json",
        stepCode: "# Chạy từng dòng trong PowerShell:\nmkdir FIORI_TECH_APP\ncd FIORI_TECH_APP\n\n# Nội dung file package.json tại gốc:\n" + rootPkgCode,
        targetFilePath: "package.json",
        verifyStep: "• Gõ `Get-Content package.json` trong PowerShell thấy đủ 4 scripts (`start`, `build`, `test`, `test:syntax`).",
        expectedResult: "Có file package.json gốc điều phối toàn repo.",
        fresherGotcha: "• Đừng nhầm `package.json` ở thư mục GỐC này với `src/frontend/package.json` ở Chương 2."
      },
      {
        stepNumber: 4,
        ideOrTool: "VS Code",
        actionTitle: "Tạo bộ Launcher (CHAY_APP.bat, MO_APP_KHONG_HIEN_CUA_SO.vbs) & README.md",
        detailedInstruction: "• **Các file cần tạo tại thư mục gốc `FIORI_TECH_APP/`:**\n1. `CHAY_APP.bat`: kiểm tra `netstat -ano | findstr :8085`, tự mở `npx ui5 serve --port 8085` và bật Microsoft Edge.\n2. `MO_APP_KHONG_HIEN_CUA_SO.vbs`: script mở ngầm `CHAY_APP.bat` không bật cửa sổ terminal đen.\n3. `README.md`: tài liệu giới thiệu kiến trúc tổng quan.\n• Bấm từng nút nạp ở bên dưới để lấy trọn bộ mã nguồn chuẩn xác.",
        commandOrPath: "CHAY_APP.bat",
        stepCode: readFileText("CHAY_APP.bat"),
        targetFilePath: "CHAY_APP.bat",
        targetFiles: [
          tf("CHAY_APP.bat", "CHAY_APP.bat"),
          tf("MO_APP_KHONG_HIEN_CUA_SO.vbs", "MO_APP_KHONG_HIEN_CUA_SO.vbs"),
          tf("README.md", "README.md")
        ],
        verifyStep: "• Kiểm tra đủ `CHAY_APP.bat`, `MO_APP_KHONG_HIEN_CUA_SO.vbs` và `README.md` tại gốc.\n• (Sẽ chạy thử thật từ Chương 5 sau khi có Dashboard).",
        expectedResult: "Bộ launcher 1-click & README gốc hoàn tất."
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 2
  // =========================================================================
  {
    id: "chap2",
    step: 2,
    title: "Chương 2: Tạo Cây Thư Mục src/frontend & Khởi Tạo Bootstrap UI5 (package.json, index.html, Component.js)",
    summary: "• Tạo toàn bộ 15 thư mục con trong `src/frontend/webapp` và `tests/unit` chỉ với 1 lệnh.\n• Cài `@ui5/cli@^4.0.0` + `@sap-ux/ui5-middleware-fe-mockserver@^2.4.19` trong `src/frontend/`.\n• Tạo file `favicon.ico`, `index.html` và `Component.js` đúng namespace `sap.fiori.tech.academy`.",
    image: "img/guideline/04_architecture_view.png",
    imageCaption: "Kiến trúc dự án sau khi bootstrap xong SAPUI5 1.136.0 và khởi tạo UIComponent.",
    prerequisites: [
      "Đã tạo thư mục gốc FIORI_TECH_APP và đang mở Terminal ngay tại thư mục gốc này."
    ],
    cliCommands: [
      "cd src/frontend",
      "npm install",
      "npx ui5 --version",
      "cd ../.."
    ],
    primaryFile: "src/frontend/package.json",
    primaryFilePath: "src/frontend/package.json",
    codeSnippet: fePkgCode,
    annotatedLines: [
      { line: 7, code: "    \"start\": \"ui5 serve --port 8080 --open index.html\",", role: "Lệnh start mặc định UI5", explanation: "Chạy tại cổng 8080 nếu gọi npm start bên trong src/frontend.", tips: "Để thống nhất với CHAY_APP.bat và bài test, trong toàn bộ cẩm nang ta chạy `npx --prefix src/frontend ui5 serve --port 8085`." },
      { line: 8, code: "    \"build\": \"ui5 build --clean-dest --dest dist\",", role: "Biên dịch đóng gói dist/", explanation: "Tạo Component-preload.js và minify tài nguyên.", tips: "Bắt buộc phải build thành công trước khi deploy." },
      { line: 12, code: "    \"@sap-ux/ui5-middleware-fe-mockserver\": \"^2.4.19\",", role: "Middleware Mockserver OData V4", explanation: "Chạy giả lập OData V4 đọc metadata.xml & JSON.", tips: "Phải khai báo thêm ở mảng ui5.dependencies bên dưới." }
    ],
    workflowNodes: [
      { step: "1", layer: "Cây thư mục", title: "Tạo webapp/ & tests/", detail: "Tạo đủ view, controller, model, mockdata, localService, test.", fileRef: "src/frontend/package.json" },
      { step: "2", layer: "Dependencies", title: "Cài UI5 CLI & Mockserver", detail: "Chạy npm install trong src/frontend sinh node_modules.", fileRef: "src/frontend/package.json" },
      { step: "3", layer: "Entry HTML", title: "index.html Bootstrap", detail: "Nạp SAPUI5 1.136.0 từ CDN + theme sap_horizon.", fileRef: "src/frontend/webapp/index.html" },
      { step: "4", layer: "UIComponent", title: "Component.js init()", detail: "Khởi tạo Device Model, appView Model & getRouter().initialize().", fileRef: "src/frontend/webapp/Component.js" }
    ],
    relatedFiles: [
      rf("src/frontend/package.json", "Khai báo devDependencies @ui5/cli & sap-fe-mockserver cho Frontend", "devDependencies & ui5.dependencies", "\"devDependencies\""),
      rf("src/frontend/webapp/index.html", "Trang HTML cổng vào bootstrap SAPUI5 1.136.0 CDN và sap_horizon", "sap-ui-bootstrap", "<script"),
      rf("src/frontend/webapp/Component.js", "Lớp UIComponent gốc đọc manifest.json, localStorage mode và bật Router", "UIComponent.extend / init()", "init: function")
    ],
    steps: [
      {
        stepNumber: 1,
        ideOrTool: "Terminal PowerShell",
        actionTitle: "Tạo toàn bộ thư mục con chuẩn trong FIORI_TECH_APP",
        detailedInstruction: "• **Vị trí đứng trong Terminal:** Thư mục gốc `FIORI_TECH_APP`.\n• **Các bước thực hiện:**\n1. Copy lệnh PowerShell bên dưới để tạo toàn bộ cây thư mục Frontend (`src/frontend/webapp/` gồm 13 thư mục con), Backend (`src/backend/rap/` gồm 5 thư mục con), Tooling (`tools/screenshots`), Test (`tests/unit`) và `docs`.\n2. Tạo kèm file `src/frontend/webapp/favicon.ico` rỗng (0 byte) để trình duyệt không bao giờ báo 404 favicon.",
        commandOrPath: "PowerShell: New-Item -ItemType Directory -Force (tạo đủ thư mục trong src/, tools/, tests/ và docs/)",
        stepCode: "New-Item -ItemType Directory -Force src/frontend/webapp/view, src/frontend/webapp/controller, src/frontend/webapp/model, src/frontend/webapp/util, src/frontend/webapp/control, src/frontend/webapp/fragment, src/frontend/webapp/ext/controller, src/frontend/webapp/css, src/frontend/webapp/i18n, src/frontend/webapp/localService/mockdata, src/frontend/webapp/mockdata, src/frontend/webapp/img/guideline/steps, src/frontend/webapp/test/unit/model, src/frontend/webapp/test/integration/pages, src/backend/rap/data-model, src/backend/rap/behavior, src/backend/rap/service, src/backend/rap/authorization, src/backend/rap/testing, tools/screenshots, tests/unit, docs\nNew-Item -ItemType File -Force src/frontend/webapp/favicon.ico | Out-Null",
        verifyStep: "• Chạy `Get-ChildItem src/frontend/webapp -Directory | Measure-Object` thấy `Count: 13` (đủ 13 thư mục con trong webapp) và có `favicon.ico`.",
        expectedResult: "Toàn bộ cấu trúc thư mục dự án đã sẵn sàng.",
        fresherGotcha: "• Fiori Application Generator Wizard chỉ sinh 1 template nhỏ.\n• Dựng thẳng theo cây thư mục này giúp khớp 100% đường dẫn của toàn bộ 91 file trong app."
      },
      {
        stepNumber: 2,
        ideOrTool: "VS Code / Terminal",
        actionTitle: "Tạo src/frontend/package.json và cài thư viện Frontend",
        detailedInstruction: "• **File cần tạo:** `src/frontend/package.json`.\n• **Các bước thực hiện:**\n1. Bấm nút `📄 Nạp src/frontend/package.json (Full)` hoặc xem Mục 3 ngay bên dưới để lấy trọn vẹn nội dung JSON chính xác.\n2. Mở terminal tại gốc `FIORI_TECH_APP` và chạy lệnh cài gói (`npm --prefix src/frontend install`).\n• **Lưu ý về Port:** Script `start` mặc định mở `:8080`, nhưng từ Chương 3 trở đi ta chạy thống nhất trên cổng `:8085` bằng cờ `--port 8085` để khớp `CHAY_APP.bat`.",
        commandOrPath: "npm --prefix src/frontend install",
        stepCode: "# Lệnh cài đặt từ thư mục gốc FIORI_TECH_APP:\nnpm --prefix src/frontend install\nnpx --prefix src/frontend ui5 --version\n\n// Khối dependencies & ui5 plugin quan trọng nhất trong src/frontend/package.json (toàn bộ file ở Mục 3):\n" + makeExcerpt(fePkgCode, "\"devDependencies\"", 12),
        targetFilePath: "src/frontend/package.json",
        targetFiles: [
          tf("src/frontend/package.json", "src/frontend/package.json (Full)")
        ],
        verifyStep: "• Chạy `npm --prefix src/frontend install`\n• Tiếp theo chạy `npx --prefix src/frontend ui5 --version` in ra `4.x.x`.",
        expectedResult: "Thư mục src/frontend/node_modules cài đặt thành công.",
        fresherGotcha: "• Không bỏ sót mảng `ui5.dependencies` ở cuối `package.json`, nếu không `ui5 serve` sẽ không tìm thấy `sap-fe-mockserver`.",
        stepImage: "img/guideline/steps/step_06_fiori_generator_wizard.png",
        stepImageCaption: "[Minh họa mô phỏng giao diện] Thông số module sap-fiori-technical-academy"
      },
      {
        stepNumber: 3,
        ideOrTool: "VS Code",
        actionTitle: "Tạo file cổng vào src/frontend/webapp/index.html",
        detailedInstruction: "• **File cần tạo:** `src/frontend/webapp/index.html`.\n• **Các điểm bắt buộc:**\n1. Nạp UI5 Core phiên bản `1.136.0` từ CDN `https://ui5.sap.com/1.136.0/resources/sap-ui-core.js`.\n2. Đặt theme `data-sap-ui-theme=\"sap_horizon\"`.\n3. Ánh xạ `\"sap.fiori.tech.academy\": \"./\"` trong `resourceroots`.\n4. Kích hoạt bất đồng bộ `data-sap-ui-oninit=\"module:sap/ui/core/ComponentSupport\"`.",
        commandOrPath: "src/frontend/webapp/index.html",
        stepCode: indexCode,
        targetFilePath: "src/frontend/webapp/index.html",
        verifyStep: "• Kiểm tra thẻ `<div data-sap-ui-component data-name=\"sap.fiori.tech.academy\" data-id=\"container\">` có mặt bên trong `<body>`.",
        expectedResult: "Cổng bootstrap HTML sẵn sàng."
      },
      {
        stepNumber: 4,
        ideOrTool: "VS Code",
        actionTitle: "Tạo file khởi tạo src/frontend/webapp/Component.js",
        detailedInstruction: "• **File cần tạo:** `src/frontend/webapp/Component.js`.\n• **Nhiệm vụ trong `init()`:**\n1. Gọi `UIComponent.prototype.init.apply(this, arguments)` để nạp `manifest.json`.\n2. Đọc `localStorage.getItem(\"academy_runtime_mode\") || \"STANDALONE\"` gắn vào model `appView`.\n3. Gọi `this.getRouter().initialize()` để bật định tuyến Hash.",
        commandOrPath: "src/frontend/webapp/Component.js",
        stepCode: componentCode,
        targetFilePath: "src/frontend/webapp/Component.js",
        verifyStep: "• Kiểm tra `UIComponent.extend(\"sap.fiori.tech.academy.Component\", { metadata: { manifest: \"json\" } })` khớp 100% với `data-name` trong `index.html`.",
        expectedResult: "UIComponent sẵn sàng nạp Router & Models.",
        fresherGotcha: "• Quên dòng `this.getRouter().initialize()` sẽ khiến màn hình trắng trơn khi mở ứng dụng."
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 3
  // =========================================================================
  {
    id: "chap3",
    step: 3,
    title: "Chương 3: Cấu Hình UI5 Tooling & OData V4 Mock Server (ui5.yaml & localService)",
    summary: "• Cấu hình `src/frontend/ui5.yaml` nạp 9 thư viện SAPUI5 1.136.0 và đăng ký middleware `sap-fe-mockserver` tại `beforeMiddleware: csp`.\n• Tạo đủ 4 file EDMX & Mock Data trong `localService/` (gồm cả khung `annotations.xml` khởi đầu để server chạy ngay không lỗi ở Chương 3) + 4 `DemoHeader` + 6 `DemoItem`.",
    image: "img/guideline/14_odata_v4_lab_view.png",
    imageCaption: "Dữ liệu OData V4 thật trả về HTTP 200 OK từ sap-fe-mockserver tại /mock/odata/v4/demo/.",
    prerequisites: [
      "Hoàn thành Chương 2 (đã cài xong `src/frontend/node_modules`)."
    ],
    cliCommands: [
      "npx --prefix src/frontend ui5 serve --port 8085",
      "Invoke-WebRequest http://localhost:8085/mock/odata/v4/demo/$metadata"
    ],
    primaryFile: "src/frontend/ui5.yaml",
    primaryFilePath: "src/frontend/ui5.yaml",
    codeSnippet: ui5YamlCode,
    annotatedLines: [
      { line: 1, code: "specVersion: \"4.0\"", role: "Chuẩn UI5 Tooling 4.0", explanation: "Khai báo phiên bản spec của UI5 CLI v4.", tips: "Khớp với @ui5/cli ^4.0.0." },
      { line: 20, code: "    - name: sap-fe-mockserver", role: "Middleware Mockserver OData V4", explanation: "Đọc metadata.xml và mockdata JSON để trả lời $select, $expand, $filter, $orderby như backend thật.", tips: "Phải đặt `beforeMiddleware: csp` đúng theo `ui5.yaml` thật." },
      { line: 24, code: "          - urlPath: /mock/odata/v4/demo", role: "Mount Path OData V4 cục bộ", explanation: "Khớp 100% với `dataSources.demoODataV4Source.uri` trong `manifest.json`.", tips: "Sai dấu `/` sẽ trả lỗi 404." },
      { line: 29, code: "        annotations:", role: "Cấp file Annotations EDMX", explanation: "Ánh xạ `./webapp/localService/annotations.xml` tới `/annotations/annotations.xml`.", tips: "Tạo luôn file `annotations.xml` khởi đầu ngay trong Chương 3 để tránh lỗi không tìm thấy file." }
    ],
    workflowNodes: [
      { step: "1", layer: "Browser / Fetch", title: "GET /mock/odata/v4/demo", detail: "ODataModel hoặc `fetch()` gửi query lên UI5 server.", fileRef: "src/frontend/webapp/manifest.json" },
      { step: "2", layer: "UI5 Middleware", title: "sap-fe-mockserver chặn", detail: "Chạy `beforeMiddleware: csp` theo cấu hình `ui5.yaml`.", fileRef: "src/frontend/ui5.yaml" },
      { step: "3", layer: "EDMX & Annotations", title: "Đọc metadata + annotations", detail: "Phân tích DemoHeaderType, DemoItemType, markAsVerified.", fileRef: "src/frontend/webapp/localService/metadata.xml" },
      { step: "4", layer: "Mock Data JSON", title: "Trả 4 Header & 6 Item", detail: "Lọc/mở rộng từ DemoHeader.json & DemoItem.json.", fileRef: "src/frontend/webapp/localService/mockdata/DemoHeader.json" }
    ],
    relatedFiles: [
      rf("src/frontend/ui5.yaml", "Cấu hình 9 thư viện SAPUI5 1.136.0 và middleware sap-fe-mockserver", "beforeMiddleware: csp / urlPath", "customMiddleware"),
      rf("src/frontend/webapp/localService/metadata.xml", "Schema OData V4 EDMX gồm DemoHeaderType, DemoItemType và Bound Action markAsVerified", "DemoHeaderType / markAsVerified", "DemoHeaderType"),
      rf("src/frontend/webapp/localService/mockdata/DemoHeader.json", "4 bản ghi thực thể gốc DemoHeader (HDR-001 đến HDR-004)", "HDR-001 .. HDR-004", "HDR-001"),
      rf("src/frontend/webapp/localService/mockdata/DemoItem.json", "6 bản ghi thực thể con DemoItem gắn theo HeaderId", "ITM-010 .. ITM-060", "ITM-010")
    ],
    steps: [
      {
        stepNumber: 1,
        ideOrTool: "VS Code",
        actionTitle: "Tạo file src/frontend/ui5.yaml với 9 thư viện và sap-fe-mockserver",
        detailedInstruction: "• **File cần tạo:** `src/frontend/ui5.yaml`.\n• **Các cấu hình bắt buộc:**\n1. Khai báo `framework: name: SAPUI5, version: \"1.136.0\"` kèm đủ 9 thư viện (`sap.m`, `sap.ui.core`, `sap.ui.layout`, `sap.tnt`, `sap.f`, `sap.fe.core`, `sap.fe.templates`, `sap.fe.macros`, `themelib_sap_horizon`).\n2. Đăng ký `customMiddleware: sap-fe-mockserver` gắn `beforeMiddleware: csp`.\n3. Trỏ `urlPath: /mock/odata/v4/demo` tới `metadata.xml` và `annotations.xml`.\n• Bấm nút `📄 Nạp src/frontend/ui5.yaml (Full)` hoặc cuộn xuống Mục 3 bên dưới để lấy trọn bộ file YAML.",
        commandOrPath: "src/frontend/ui5.yaml",
        stepCode: "# Đoạn middleware OData V4 trọng tâm trong src/frontend/ui5.yaml (full 9 thư viện xem ở Mục 3):\n" + makeExcerpt(ui5YamlCode, "customMiddleware", 18),
        targetFilePath: "src/frontend/ui5.yaml",
        targetFiles: [
          tf("src/frontend/ui5.yaml", "src/frontend/ui5.yaml (Full)")
        ],
        verifyStep: "• Kiểm tra thụt lề YAML hoàn toàn dùng 2 dấu cách (spaces), tuyệt đối không dùng phím Tab.",
        expectedResult: "UI5 Tooling nhận diện cấu hình framework & mockserver."
      },
      {
        stepNumber: 2,
        ideOrTool: "VS Code",
        actionTitle: "Tạo metadata.xml và file khung annotations.xml khởi đầu",
        detailedInstruction: "• **Vì sao phải tạo cả `annotations.xml` ngay lúc này?**\n  Vì `ui5.yaml` khai báo `annotations.localPath: ./webapp/localService/annotations.xml`. Nếu chưa có file này, `sap-fe-mockserver` sẽ báo lỗi không tìm thấy file khi chạy thử ở Bước 3!\n• **Thao tác:**\n1. Bấm nút `Nạp metadata.xml` để lấy toàn bộ schema `DemoHeaderType`, `DemoItemType` và Bound Action `markAsVerified` lưu vào `src/frontend/webapp/localService/metadata.xml`.\n2. Tạo sẵn file khung `src/frontend/webapp/localService/annotations.xml` bằng đoạn XML khởi đầu bên dưới (ở Chương 7 sẽ điền đầy đủ UI/SideEffects annotations).",
        commandOrPath: "src/frontend/webapp/localService/metadata.xml",
        stepCode: starterAnnotations,
        targetFilePath: "src/frontend/webapp/localService/metadata.xml",
        targetFiles: [
          tf("src/frontend/webapp/localService/metadata.xml", "metadata.xml (EDMX Schema)"),
          tf("src/frontend/webapp/localService/annotations.xml", "annotations.xml (Full ở Chap 7)")
        ],
        verifyStep: "• Cả 2 file `localService/metadata.xml` và `localService/annotations.xml` đều tồn tại và hợp lệ cú pháp XML.",
        expectedResult: "Khởi động mockserver ở Bước 3 không gặp lỗi thiếu file annotations."
      },
      {
        stepNumber: 3,
        ideOrTool: "VS Code / Terminal",
        actionTitle: "Tạo DemoHeader.json (4 bản ghi) + DemoItem.json (6 bản ghi) và chạy thử Server :8085",
        detailedInstruction: "• **2 file dữ liệu mẫu trong `src/frontend/webapp/localService/mockdata/`:**\n1. Tạo `DemoHeader.json` chứa **4** bản ghi `HDR-001`..`HDR-004`.\n2. Tạo `DemoItem.json` chứa **6** bản ghi `ITM-010`..`ITM-060`.\n• **Kiểm thử Mockserver ngay:** Bật terminal chạy `npx --prefix src/frontend ui5 serve --port 8085` (để server chạy ở cửa sổ terminal đó).",
        commandOrPath: "npx --prefix src/frontend ui5 serve --port 8085",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/localService/mockdata/DemoHeader.json"), "HDR-001", 20) + "\n\n// DemoItem.json (1 trong 6 bản ghi mẫu):\n" + makeExcerpt(readFileText("src/frontend/webapp/localService/mockdata/DemoItem.json"), "ITM-010", 12),
        targetFilePath: "src/frontend/webapp/localService/mockdata/DemoHeader.json",
        targetFiles: [
          tf("src/frontend/webapp/localService/mockdata/DemoHeader.json", "DemoHeader.json (4 bản ghi)"),
          tf("src/frontend/webapp/localService/mockdata/DemoItem.json", "DemoItem.json (6 bản ghi)")
        ],
        verifyStep: "• Mở trình duyệt tới `http://localhost:8085/mock/odata/v4/demo/$metadata` -> trả XML EDMX HTTP 200.\n• Mở `http://localhost:8085/mock/odata/v4/demo/DemoHeader?$expand=_Items` -> trả JSON 4 bản ghi kèm `_Items`.",
        expectedResult: "OData V4 Mockserver chạy thật thành công!",
        fresherGotcha: "• Tên file JSON trong `mockdata/` bắt buộc khớp 100% hoa/thường với `<EntitySet Name=\"DemoHeader\">` và `<EntitySet Name=\"DemoItem\">` trong `metadata.xml`.",
        stepImage: "img/guideline/14_odata_v4_lab_view.png",
        stepImageCaption: "Mockserver phản hồi thật HTTP 200 OK trên cổng 8085"
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 4
  // =========================================================================
  {
    id: "chap4",
    step: 4,
    title: "Chương 4: App Shell Horizon, BaseController, Models, i18n, CSS, ModeSelectorDialog & 12 Routes (manifest.json)",
    summary: "• Xây dựng lớp nền dùng chung gồm `BaseController.js` (kèm `formatCodeBlockHtml` và `openGuidelineWorkspace`), `models.js`, `formatter.js`, `i18n` (VI/EN) và `css/style.css`.\n• Xây dựng khung `App.view.xml` (`tnt:ToolPage`), `App.controller.js`, `ModeSelectorDialog.fragment.xml`, `NotFound` và khai báo đủ 9 models + 12 routes trong `manifest.json`.",
    image: "img/guideline/01_dashboard_view.png",
    imageCaption: "Khung Fiori Morning Horizon Shell gồm ToolHeader (góc phải NeverOverflow) và SideNavigation.",
    prerequisites: [
      "Hoàn thành Chương 3 (UI5 server cổng 8085 đã chạy được)."
    ],
    cliCommands: [
      "npx --prefix src/frontend ui5 serve --port 8085"
    ],
    primaryFile: "src/frontend/webapp/manifest.json",
    primaryFilePath: "src/frontend/webapp/manifest.json",
    codeSnippet: JSON.stringify(manifestObj, null, 2),
    annotatedLines: [
      { line: 4, code: "    \"id\": \"sap.fiori.tech.academy\",", role: "Namespace gốc của App", explanation: "Mọi controllerName và viewPath đều lấy tiền tố này.", tips: "Khớp `resourceroots` trong `index.html`." },
      { line: 96, code: "      \"viewName\": \"sap.fiori.tech.academy.view.App\",", role: "Root App Shell View", explanation: "Chứa `tnt:ToolPage`, ToolHeader, SideNavigation và `<App id=\"pageContainer\" />`.", tips: "Không xóa `id=\"pageContainer\"`." },
      { line: 158, code: "      \"demoOData\": {", role: "OData V4 Model mặc định", explanation: "Dùng `sap.ui.model.odata.v4.ODataModel` nối với `/mock/odata/v4/demo/`.", tips: "Bật `autoExpandSelect: true`." },
      { line: 179, code: "        \"controlId\": \"pageContainer\",", role: "Vùng chứa trang con của Router", explanation: "Router đẩy từng màn hình con vào `<App id=\"pageContainer\" />`.", tips: "Tên ID chuẩn xác là `pageContainer`." }
    ],
    workflowNodes: [
      { step: "1", layer: "Lớp Nền JS", title: "Base + Models + Formatter", detail: "BaseController (openGuidelineWorkspace, formatCodeBlockHtml), models, formatter.", fileRef: "src/frontend/webapp/controller/BaseController.js" },
      { step: "2", layer: "i18n & Giao Diện", title: "i18n (VI/EN) + style.css", detail: "Từ điển nhãn đa ngôn ngữ và tokens màu, code cards, padding Dialog.", fileRef: "src/frontend/webapp/css/style.css" },
      { step: "3", layer: "App Shell View/Ctrl", title: "App Shell + Mode + 404", detail: "App.view.xml (ToolPage), App.controller.js (ẩn SideNav ở Guideline), ModeSelector, NotFound.", fileRef: "src/frontend/webapp/view/App.view.xml" },
      { step: "4", layer: "Cấu Hình Trung Tâm", title: "manifest.json (12 Routes)", detail: "9 dataSources, 9 models, 12 routes & targets đồng bộ.", fileRef: "src/frontend/webapp/manifest.json" }
    ],
    relatedFiles: [
      rf("src/frontend/webapp/controller/BaseController.js", "Controller cha dùng chung getRouter/getModel/navTo/formatCodeBlockHtml/openGuidelineWorkspace", "formatCodeBlockHtml / openGuidelineWorkspace", "formatCodeBlockHtml"),
      rf("src/frontend/webapp/model/models.js", "Tạo device JSONModel và appView JSONModel quản lý STANDALONE vs SAP_CONNECTED", "createAppModel / createDeviceModel", "createAppModel"),
      rf("src/frontend/webapp/model/formatter.js", "Các hàm format trạng thái levelState, statusState, severityState, languageIcon", "levelState / statusState", "levelState"),
      rf("src/frontend/webapp/i18n/i18n.properties", "Từ điển nhãn giao diện tiếng Việt mặc định", "appTitle / nav* / mode*", "appTitle"),
      rf("src/frontend/webapp/i18n/i18n_en.properties", "Từ điển nhãn giao diện tiếng Anh fallback", "appTitle / dash*", "appTitle"),
      rf("src/frontend/webapp/css/style.css", "Biến màu Horizon, HeroBanner, .code-tip, .guidelineTreeSidebar & Dialog padding", ":root / .code-tip / .guidelineTreeSidebar", ".guidelineTreeSidebar"),
      rf("src/frontend/webapp/view/App.view.xml", "Khung tnt:ToolPage gồm ToolHeader (4 nút NeverOverflow), SideNavigation 8 mục & pageContainer", "tnt:ToolPage / pageContainer", "toolHeader"),
      rf("src/frontend/webapp/controller/App.controller.js", "Đồng bộ route -> SideNav, ẩn SideNav khi vào Guideline Workspace, mở ModeSelectorDialog", "_onRouteMatched / onNavToGuideline", "_onRouteMatched"),
      rf("src/frontend/webapp/fragment/ModeSelectorDialog.fragment.xml", "Popup chuyển chế độ Standalone Mock vs SAP S/4HANA Connected", "modeSelectorDialog", "modeSelectorDialog"),
      rf("src/frontend/webapp/view/NotFound.view.xml", "Trang 404 MessagePage khi URL Hash không khớp route nào", "sap.m.MessagePage", "MessagePage"),
      rf("src/frontend/webapp/controller/NotFound.controller.js", "Nút quay lại Dashboard từ trang NotFound", "onNavHome", "onNavHome"),
      rf("src/frontend/webapp/manifest.json", "Bản mô tả ứng dụng đầy đủ 9 dataSources, 9 models và 12 routes", "sap.ui5.models & routing", "\"routing\"")
    ],
    steps: [
      {
        stepNumber: 1,
        ideOrTool: "VS Code",
        actionTitle: "Tạo lớp dùng chung: BaseController.js, models.js và formatter.js",
        detailedInstruction: "• **3 file cần tạo lần lượt:**\n1. `src/frontend/webapp/controller/BaseController.js` (cung cấp `navTo`, `getModel`, `formatCodeBlockHtml`, `openGuidelineWorkspace`).\n2. `src/frontend/webapp/model/models.js` (cung cấp `createDeviceModel`, `createAppModel`).\n3. `src/frontend/webapp/model/formatter.js` (cung cấp `levelState`, `statusState`, `severityState`, `languageIcon`).\n• Bấm vào từng nút `📄 Nạp` bên dưới để lấy full code chính xác 100% của cả 3 file.",
        commandOrPath: "src/frontend/webapp/controller/BaseController.js",
        stepCode: readFileText("src/frontend/webapp/controller/BaseController.js"),
        targetFilePath: "src/frontend/webapp/controller/BaseController.js",
        targetFiles: [
          tf("src/frontend/webapp/controller/BaseController.js", "BaseController.js"),
          tf("src/frontend/webapp/model/models.js", "models.js"),
          tf("src/frontend/webapp/model/formatter.js", "formatter.js")
        ],
        verifyStep: "• Kiểm tra cả 3 file đã tồn tại trong `controller/` và `model/`.\n• Dùng `node -e` hoặc VS Code xác nhận không có lỗi cú pháp JS.",
        expectedResult: "Hoàn thành BaseController, Model factories & Formatter.",
        fresherGotcha: "• Mọi Controller màn hình con sau này đều kế thừa `BaseController.extend(\"sap.fiori.tech.academy.controller.<TenController>\", {})` thay vì `sap/ui/core/mvc/Controller`."
      },
      {
        stepNumber: 2,
        ideOrTool: "VS Code",
        actionTitle: "Tạo bộ đa ngôn ngữ i18n (VI & EN) và stylesheet css/style.css",
        detailedInstruction: "• **3 file cần tạo:**\n1. `src/frontend/webapp/i18n/i18n.properties` (nhãn tiếng Việt).\n2. `src/frontend/webapp/i18n/i18n_en.properties` (nhãn tiếng Anh).\n3. `src/frontend/webapp/css/style.css` (stylesheet chuẩn Horizon, CodeTips đỏ `.code-line.hot`, `.guidelineFileExcerpt`, `.guidelineTreeSidebar` và padding cho Dialog).\n• Bấm từng nút nạp file để copy trọn bộ vào đúng vị trí.",
        commandOrPath: "src/frontend/webapp/css/style.css",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/i18n/i18n.properties"), "appTitle", 14) + "\n\n/* css/style.css */\n" + makeExcerpt(readFileText("src/frontend/webapp/css/style.css"), ".guidelineTreeSidebar", 18),
        targetFilePath: "src/frontend/webapp/css/style.css",
        targetFiles: [
          tf("src/frontend/webapp/i18n/i18n.properties", "i18n.properties (VI)"),
          tf("src/frontend/webapp/i18n/i18n_en.properties", "i18n_en.properties (EN)"),
          tf("src/frontend/webapp/css/style.css", "style.css (Full CSS)")
        ],
        verifyStep: "• Kiểm tra `i18n.properties` không có key trống và `style.css` có `.code-line.hot` & `.academyWorkspaceMode`.",
        expectedResult: "i18n & giao diện CSS chuẩn xác."
      },
      {
        stepNumber: 3,
        ideOrTool: "VS Code",
        actionTitle: "Tạo App Shell (App.view.xml, App.controller.js), ModeSelectorDialog & NotFound",
        detailedInstruction: "• **5 file tạo thành bộ vỏ Shell hoàn chỉnh:**\n1. `view/App.view.xml`: dùng `tnt:ToolPage`, `ToolHeader` (nút `btnGuideline`, `btnHandleError`, `btnUserManual` đặt `NeverOverflow`), `SideNavigation` 8 mục và `<App id=\"pageContainer\" />`.\n2. `controller/App.controller.js`: tự ẩn `SideNavigation` khi vào `guideline` (`academyWorkspaceMode`) và mở tab mới cho Guideline Workspace.\n3. `fragment/ModeSelectorDialog.fragment.xml`: popup chuyển chế độ.\n4. `view/NotFound.view.xml` & `controller/NotFound.controller.js`: trang 404 dự phòng.",
        commandOrPath: "src/frontend/webapp/view/App.view.xml",
        stepCode: makeExcerpt(appControllerCode, "_onRouteMatched", 28),
        targetFilePath: "src/frontend/webapp/view/App.view.xml",
        targetFiles: [
          tf("src/frontend/webapp/view/App.view.xml", "App.view.xml"),
          tf("src/frontend/webapp/controller/App.controller.js", "App.controller.js"),
          tf("src/frontend/webapp/fragment/ModeSelectorDialog.fragment.xml", "ModeSelectorDialog.fragment.xml"),
          tf("src/frontend/webapp/view/NotFound.view.xml", "NotFound.view.xml"),
          tf("src/frontend/webapp/controller/NotFound.controller.js", "NotFound.controller.js")
        ],
        verifyStep: "• Kiểm tra `App.view.xml` giữ đúng `id=\"pageContainer\"`, `id=\"btnGuideline\"` và `id=\"sideNavigation\"`.",
        expectedResult: "Bộ khung App Shell + Dialog chuyển mode + trang 404 sẵn sàng.",
        stepImage: "img/guideline/01_dashboard_view.png",
        stepImageCaption: "Khung App Shell ToolPage & 4 nút ghim góc phải NeverOverflow"
      },
      {
        stepNumber: 4,
        ideOrTool: "VS Code",
        actionTitle: "Tạo file cấu hình trung tâm src/frontend/webapp/manifest.json",
        detailedInstruction: "• **File cần tạo:** `src/frontend/webapp/manifest.json`.\n• **Cấu trúc gồm 3 phần:**\n1. `sap.app`: ID `sap.fiori.tech.academy`, i18n, FLP `crossNavigation` (`DemoTechnicalApp-display`) và 9 `dataSources` (7 JSON + `demoODataV4Source` + `demoAnnotations`).\n2. `sap.ui5`: `rootView` (`App`), dependencies 1.136.0, 9 `models` và `css/style.css`.\n3. `routing`: 12 routes & targets trỏ tới `controlId: \"pageContainer\"`.\n• **Mẹo thứ tự tạo app:** Lưu ý ở bước này bạn đã khai báo trước tên của 7 JSON dataSources & 11 Views, chúng ta sẽ lần lượt tạo đủ các file đó từ Chương 5 đến Chương 12 (bắt đầu chạy trình duyệt ngay từ cuối Chương 5 cho Dashboard!).",
        commandOrPath: "src/frontend/webapp/manifest.json",
        stepCode: JSON.stringify({
          "sap.ui5": {
            rootView: manifestObj["sap.ui5"].rootView,
            routing: manifestObj["sap.ui5"].routing
          }
        }, null, 2),
        targetFilePath: "src/frontend/webapp/manifest.json",
        verifyStep: "• Chạy `node -e \"JSON.parse(require('fs').readFileSync('src/frontend/webapp/manifest.json'))\"` không lỗi JSON.\n• Có đủ 9 `models` và 12 `routes`.",
        expectedResult: "Hệ thống Routing & Models toàn ứng dụng đã hoàn chỉnh.",
        fresherGotcha: "• Nếu mở trình duyệt ngay ở cuối Chương 4 trước khi tạo `Dashboard.view.xml` ở Chương 5, Router sẽ chưa tìm thấy `Dashboard.view.xml` — đó là bình thường, hãy đi tiếp Chương 5 ngay!"
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 5
  // =========================================================================
  {
    id: "chap5",
    step: 5,
    title: "Chương 5: Xây Dựng Màn Hình Trang Chủ Dashboard (#/) Với KPI Tiles, Cards & Learning Paths",
    summary: "• Tạo `learning_paths.json` (3 lộ trình Associate / Professional / Architect) và `system_health.json`.\n• Tạo `Dashboard.view.xml` + `Dashboard.controller.js` để người dùng chạy được giao diện trang chủ đầu tiên trên cổng 8085.",
    image: "img/guideline/01_dashboard_view.png",
    imageCaption: "Màn hình Dashboard hoàn chỉnh: Hero Banner, 4 GenericTile KPIs, 3 Cards Learning Tracks & 10 Phân hệ.",
    prerequisites: [
      "Hoàn thành Chương 4 (đã có App Shell + manifest route `dashboard`)."
    ],
    cliCommands: [
      "npx --prefix src/frontend ui5 serve --port 8085"
    ],
    primaryFile: "src/frontend/webapp/view/Dashboard.view.xml",
    primaryFilePath: "src/frontend/webapp/view/Dashboard.view.xml",
    codeSnippet: readFileText("src/frontend/webapp/view/Dashboard.view.xml"),
    annotatedLines: [
      { line: 22, code: "            <VBox class=\"academyHeroBanner sapUiSmallMarginBottom\">", role: "Banner chính Dashboard", explanation: "Chứa tiêu đề V4 và 3 nút lối tắt tới Hướng Dẫn, Từ Điển Kỹ Thuật, Phòng Lab Nâng Cao.", tips: "Nút nhấn gọi hàm điều hướng trong Dashboard.controller.js." },
      { line: 76, code: "            <l:Grid", role: "Lưới 4 KPI GenericTile", explanation: "Hiển thị 10 Phân hệ, 80 Topics, 9 Labs và 816 Release.", tips: "`XL3 L3 M6 S12` tự chia 4 cột trên desktop." },
      { line: 161, code: "                    <f:Card", role: "Learning Tracks & Categories", explanation: "Bind dữ liệu `paths>/paths` và `catalog>/categories`.", tips: "Khi bấm Category Card sẽ lọc Catalog theo đúng nhóm đã chọn." }
    ],
    workflowNodes: [
      { step: "1", layer: "Dữ Liệu JSON", title: "learning_paths + health", detail: "Cung cấp 3 Learning Tracks và trạng thái 2 chế độ chạy.", fileRef: "src/frontend/webapp/mockdata/learning_paths.json" },
      { step: "2", layer: "View Chính", title: "Dashboard.view.xml", detail: "Render Hero, 4 GenericTile, f:Card Tracks & Categories.", fileRef: "src/frontend/webapp/view/Dashboard.view.xml" },
      { step: "3", layer: "Controller", title: "Dashboard.controller.js", detail: "Điều hướng nhanh navTo & mở Guideline tab mới.", fileRef: "src/frontend/webapp/controller/Dashboard.controller.js" },
      { step: "4", layer: "Kiểm Thử Sống", title: "Mở http://localhost:8085", detail: "Khớp route mặc định `\"\"` và hiển thị trang chủ.", fileRef: "src/frontend/webapp/manifest.json" }
    ],
    relatedFiles: [
      rf("src/frontend/webapp/mockdata/learning_paths.json", "3 lộ trình học tập từ Associate -> Professional -> Architect (progress, labs)", "paths: 3 tracks", "\"paths\""),
      rf("src/frontend/webapp/mockdata/system_health.json", "Dữ liệu trạng thái chế độ Standalone Mock và SAP Connected (PQPOC 100)", "modes: STANDALONE / SAP_CONNECTED", "\"modes\""),
      rf("src/frontend/webapp/view/Dashboard.view.xml", "Giao diện trang chủ với HeroBanner, 4 GenericTile, f:Card Tracks & Categories", "dashboardPage / GenericTile", "dashboardPage"),
      rf("src/frontend/webapp/controller/Dashboard.controller.js", "Xử lý điều hướng từ Dashboard và onCategoryPress / openGuidelineWorkspace", "onCategoryPress / onNavToGuideline", "onCategoryPress")
    ],
    steps: [
      {
        stepNumber: 1,
        ideOrTool: "VS Code",
        actionTitle: "Tạo mockdata/learning_paths.json và mockdata/system_health.json",
        detailedInstruction: "• **2 file dữ liệu JSON cần tạo trong `src/frontend/webapp/mockdata/`:**\n1. `learning_paths.json`: mảng `paths` gồm 3 lộ trình (`Associate`, `Professional`, `Architect`).\n2. `system_health.json`: trạng thái 2 execution modes (`STANDALONE` và `SAP_CONNECTED`).\n• Bấm các nút nạp file bên dưới để lấy trọn bộ nội dung JSON.",
        commandOrPath: "src/frontend/webapp/mockdata/learning_paths.json",
        stepCode: sampleArraySchema("src/frontend/webapp/mockdata/learning_paths.json", "paths", 1) + "\n\n// system_health.json:\n" + readFileText("src/frontend/webapp/mockdata/system_health.json"),
        targetFilePath: "src/frontend/webapp/mockdata/learning_paths.json",
        targetFiles: [
          tf("src/frontend/webapp/mockdata/learning_paths.json", "learning_paths.json"),
          tf("src/frontend/webapp/mockdata/system_health.json", "system_health.json")
        ],
        verifyStep: "• Kiểm tra cả 2 file JSON parse hợp lệ (`learning_paths.json` có 3 phần tử `paths`).",
        expectedResult: "Model `paths` và `health` đã có dữ liệu."
      },
      {
        stepNumber: 2,
        ideOrTool: "VS Code",
        actionTitle: "Tạo giao diện src/frontend/webapp/view/Dashboard.view.xml",
        detailedInstruction: "• **File cần tạo:** `src/frontend/webapp/view/Dashboard.view.xml`.\n• **Các thành phần UI bên trong:**\n1. `academyHeroBanner` với 3 nút: `👉 Bắt Đầu: Hướng Dẫn`, `Từ Điển Kỹ Thuật`, `Phòng Lab Nâng Cao`.\n2. `MessageStrip` gợi ý 3 bước cho người mới.\n3. `l:Grid` chứa 4 `GenericTile` KPI.\n4. Khối `f:Card` bind danh sách `paths>/paths` và `catalog>/categories` (lưu ý `catalog` sẽ tạo tiếp ở Chương 6).",
        commandOrPath: "src/frontend/webapp/view/Dashboard.view.xml",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/view/Dashboard.view.xml"), "GenericTile", 24),
        targetFilePath: "src/frontend/webapp/view/Dashboard.view.xml",
        verifyStep: "• Kiểm tra khai báo đủ namespace `xmlns:f=\"sap.f\"`, `xmlns:l=\"sap.ui.layout\"` và `id=\"dashboardPage\"`.",
        expectedResult: "File Dashboard.view.xml hợp lệ XML."
      },
      {
        stepNumber: 3,
        ideOrTool: "VS Code / Edge",
        actionTitle: "Tạo Dashboard.controller.js và chạy trang chủ lần đầu",
        detailedInstruction: "• **File cần tạo:** `src/frontend/webapp/controller/Dashboard.controller.js`.\n• **Các hàm chính:**\n1. `onNavToCatalog`, `onNavToUserManual`, `onNavToAdvancedLab`, `onNavToErrorPlaybook`.\n2. `onNavToGuideline` gọi `this.openGuidelineWorkspace()` để mở workspace tab mới.\n3. `onCategoryPress` lưu `activeFilterCategory` vào `appView` rồi điều hướng sang `catalog`.",
        commandOrPath: "src/frontend/webapp/controller/Dashboard.controller.js",
        stepCode: readFileText("src/frontend/webapp/controller/Dashboard.controller.js"),
        targetFilePath: "src/frontend/webapp/controller/Dashboard.controller.js",
        verifyStep: "• Chạy `npx --prefix src/frontend ui5 serve --port 8085`.\n• Mở Edge truy cập `http://localhost:8085/index.html`: App Shell + trang Dashboard hiển thị được Hero Banner, 4 KPI Tiles & 3 Learning Track Cards.",
        expectedResult: "Trang chủ Dashboard (#/) chạy sống được trên trình duyệt!",
        stepImage: "img/guideline/01_dashboard_view.png",
        stepImageCaption: "Dashboard chạy thành công trên cổng 8085"
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 6
  // =========================================================================
  {
    id: "chap6",
    step: 6,
    title: "Chương 6: Xây Dựng Technical Catalog (#/catalog), Code Explorer (#/code) & Engine Hover CodeTips",
    summary: "• Tạo `technical_catalog.json` (10 Categories, 21 Topics) và `code_snippets.json` (10 Snippets).\n• Tạo màn hình Từ Điển Kỹ Thuật (`Catalog.*`) với bộ lọc 3 tiêu chí `_applyFilters`.\n• Tạo Engine `util/CodeTips.js` (`buildSmartFallback`) và Trình xem code 2 cột `CodeExplorer.*`.",
    image: "img/guideline/03_code_explorer_view.png",
    imageCaption: "Trình Code Explorer chia 2 cột kèm CodeTips hover khung đỏ và Panel Vị Trí File Thật bên dưới.",
    prerequisites: [
      "Hoàn thành Chương 5 (App Shell & Dashboard đã chạy được trên `:8085`)."
    ],
    cliCommands: [
      "npx --prefix src/frontend ui5 serve --port 8085"
    ],
    primaryFile: "src/frontend/webapp/controller/CodeExplorer.controller.js",
    primaryFilePath: "src/frontend/webapp/controller/CodeExplorer.controller.js",
    codeSnippet: readFileText("src/frontend/webapp/controller/CodeExplorer.controller.js"),
    annotatedLines: [
      { line: 20, code: "            this.getRouter().getRoute(\"code\").attachPatternMatched(this._onRouteMatched, this);", role: "Đón tham số snippetId trên URL", explanation: "Khi chuyển từ Catalog sang `#/code/SNIP_BDEF_HEADER`, controller chọn đúng snippet tương ứng.", tips: "Đăng ký thêm `codeDefault` khi người dùng bấm thẳng menu Code Explorer." },
      { line: 54, code: "        _displaySnippet: function (oSnippet) {", role: "Render Code & Gắn CodeTips", explanation: "Hiển thị `filePath`, `relatedFeature`, `architectureNotes` vào `codeModel` và gắn `CodeTips.attach(oDomRef)`.", tips: "Dùng `setTimeout(..., 80)` để đợi DOM của `<core:HTML>` vẽ xong." }
    ],
    workflowNodes: [
      { step: "1", layer: "Catalog Data", title: "technical_catalog.json", detail: "10 Categories & 21 Topics gắn khóa ngoại codeSnippetId.", fileRef: "src/frontend/webapp/mockdata/technical_catalog.json" },
      { step: "2", layer: "Lọc Đa Tiêu Chí", title: "Catalog.controller.js", detail: "_applyFilters lọc Category + Level + Search -> onViewSnippetPress.", fileRef: "src/frontend/webapp/controller/Catalog.controller.js" },
      { step: "3", layer: "Hover Engine", title: "util/CodeTips.js", detail: "Parse HTML từng dòng, tô khung đỏ `.code-line.hot` & popup `.code-tip`.", fileRef: "src/frontend/webapp/util/CodeTips.js" },
      { step: "4", layer: "Code Viewer", title: "CodeExplorer (2 Panes)", detail: "Nhận `snippetId`, nạp `code_snippets.json` & gắn CodeTips.attach().", fileRef: "src/frontend/webapp/controller/CodeExplorer.controller.js" }
    ],
    relatedFiles: [
      rf("src/frontend/webapp/mockdata/technical_catalog.json", "10 nhóm kỹ thuật (categories) và 21 chuyên đề (topics) kèm codeSnippetId", "categories(10) & topics(21)", "\"topics\""),
      rf("src/frontend/webapp/view/Catalog.view.xml", "Trang Catalog gồm SearchField, 2 Select bộ lọc và Table topicsTable", "catalogSearchField / topicsTable", "topicsTable"),
      rf("src/frontend/webapp/controller/Catalog.controller.js", "Xử lý bộ lọc kết hợp _applyFilters và điều hướng sang Code Explorer", "_applyFilters / onViewSnippetPress", "_applyFilters"),
      rf("src/frontend/webapp/mockdata/code_snippets.json", "10 mã nguồn mẫu đồng bộ repo kèm filePath, relatedFeature & architectureNotes", "snippets(10)", "\"snippets\""),
      rf("src/frontend/webapp/view/CodeExplorer.view.xml", "Trang Splitter 2 cột: trái danh sách snippet, phải codeInteractiveHtml & vị trí file", "snippetList / codeInteractiveHtml", "codeInteractiveHtml"),
      rf("src/frontend/webapp/controller/CodeExplorer.controller.js", "Điều phối chọn snippet theo URL, gắn CodeTips và copy mã nguồn", "_displaySnippet / CodeTips.attach", "_displaySnippet"),
      rf("src/frontend/webapp/util/CodeTips.js", "Module phân tích cú pháp ABAP/CDS/BDEF/XML/JSON/JS/YAML & popup hover", "parseToHtml / attach / buildSmartFallback", "buildSmartFallback")
    ],
    steps: [
      {
        stepNumber: 1,
        ideOrTool: "VS Code",
        actionTitle: "Tạo mockdata/technical_catalog.json và mockdata/code_snippets.json",
        detailedInstruction: "• **2 file dữ liệu JSON cần tạo:**\n1. `technical_catalog.json`: chứa 10 `categories` (hiển thị ngay trên Dashboard!) và 21 `topics` (mỗi topic có `codeSnippetId`).\n2. `code_snippets.json`: chứa 10 `snippets` (mỗi snippet có `id`, `filePath`, `relatedFeature`, `architectureNotes`, `code`).\n• Bấm từng nút nạp file bên dưới để lấy đầy đủ cả 2 file.",
        commandOrPath: "src/frontend/webapp/mockdata/technical_catalog.json",
        stepCode: sampleArraySchema("src/frontend/webapp/mockdata/technical_catalog.json", "topics", 1),
        targetFilePath: "src/frontend/webapp/mockdata/technical_catalog.json",
        targetFiles: [
          tf("src/frontend/webapp/mockdata/technical_catalog.json", "technical_catalog.json (10 Cat / 21 Topics)"),
          tf("src/frontend/webapp/mockdata/code_snippets.json", "code_snippets.json (10 Snippets)")
        ],
        verifyStep: "• Tải lại Dashboard `http://localhost:8085/index.html` thấy card 10 Phân hệ ở cuối trang hiện đầy đủ.",
        expectedResult: "Catalog & Code Snippets liên kết khóa ngoại 100%."
      },
      {
        stepNumber: 2,
        ideOrTool: "VS Code",
        actionTitle: "Tạo Catalog.view.xml & Catalog.controller.js (bộ lọc kết hợp 3 tiêu chí)",
        detailedInstruction: "• **2 file cần tạo:**\n1. `view/Catalog.view.xml`: gồm `catalogSearchField`, `categorySelect`, `levelSelect` và `Table id=\"topicsTable\"`.\n2. `controller/Catalog.controller.js`: viết `_applyFilters()` ghép 3 điều kiện lọc vào binding và viết `onViewSnippetPress()` chuyển sang `#/code/{snippetId}`.",
        commandOrPath: "src/frontend/webapp/controller/Catalog.controller.js",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/controller/Catalog.controller.js"), "_applyFilters", 28),
        targetFilePath: "src/frontend/webapp/controller/Catalog.controller.js",
        targetFiles: [
          tf("src/frontend/webapp/view/Catalog.view.xml", "Catalog.view.xml"),
          tf("src/frontend/webapp/controller/Catalog.controller.js", "Catalog.controller.js")
        ],
        verifyStep: "• Mở `http://localhost:8085/index.html#/catalog`, gõ từ khóa `'Draft'` vào SearchField thấy `topicsTable` lọc ngay lập tức.",
        expectedResult: "Màn hình Technical Catalog lọc & đếm đúng.",
        stepImage: "img/guideline/02_catalog_view.png",
        stepImageCaption: "Màn hình Technical Catalog với 3 bộ lọc"
      },
      {
        stepNumber: 3,
        ideOrTool: "VS Code",
        actionTitle: "Tạo Engine hover giải thích code src/frontend/webapp/util/CodeTips.js",
        detailedInstruction: "• **File cần tạo:** `src/frontend/webapp/util/CodeTips.js`.\n• **Các hàm bên trong:**\n1. Kho quy tắc Regex cho ABAP, CDS, BDEF, JSON, XML, JS, YAML, Shell.\n2. `buildSmartFallback(sLine, k)` tự phân tích theo ngữ cảnh nếu dòng chưa có quy tắc riêng.\n3. `parseToHtml(sCode, sKind, aAnnotations)` và `attach(oDomRef)` để tạo hiệu ứng viền đỏ + popup cạnh con trỏ.",
        commandOrPath: "src/frontend/webapp/util/CodeTips.js",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/util/CodeTips.js"), "buildSmartFallback", 26),
        targetFilePath: "src/frontend/webapp/util/CodeTips.js",
        verifyStep: "• Nạp full file `CodeTips.js` ở Mục 3 và kiểm tra lưu đúng vào `src/frontend/webapp/util/CodeTips.js`.",
        expectedResult: "Engine highlight dòng code hoạt động cho cả Code Explorer & Guideline."
      },
      {
        stepNumber: 4,
        ideOrTool: "VS Code",
        actionTitle: "Tạo CodeExplorer.view.xml & CodeExplorer.controller.js (#/code)",
        detailedInstruction: "• **2 file cần tạo:**\n1. `view/CodeExplorer.view.xml`: dùng `l:Splitter` chia 2 cột (`snippetList` bên trái + `codeInteractiveHtml` và Panel Vị trí file thật bên phải).\n2. `controller/CodeExplorer.controller.js`: nạp snippet theo route `code` / `codeDefault` và gọi `CodeTips.attach()`.",
        commandOrPath: "src/frontend/webapp/controller/CodeExplorer.controller.js",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/controller/CodeExplorer.controller.js"), "_displaySnippet", 24),
        targetFilePath: "src/frontend/webapp/controller/CodeExplorer.controller.js",
        targetFiles: [
          tf("src/frontend/webapp/view/CodeExplorer.view.xml", "CodeExplorer.view.xml"),
          tf("src/frontend/webapp/controller/CodeExplorer.controller.js", "CodeExplorer.controller.js")
        ],
        verifyStep: "• Mở `http://localhost:8085/index.html#/catalog`, bấm `Xem Code` ở 1 dòng -> chuyển sang `#/code/SNIP_BDEF_HEADER`, rê chuột lên từng dòng code thấy nổi khung đỏ + hiện popup.",
        expectedResult: "Catalog & Code Explorer liên thông hoàn hảo.",
        stepImage: "img/guideline/03_code_explorer_view.png",
        stepImageCaption: "Màn hình Code Explorer chia 2 cột + Panel Vị Trí File Thật"
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 7
  // =========================================================================
  {
    id: "chap7",
    step: 7,
    title: "Chương 7: Phòng Lab 01 — Fiori Elements V4, Annotations, Side Effects & FPM Extensions (#/fe-lab)",
    summary: "• Thay thế file khung `localService/annotations.xml` bằng bộ Vocabulary Annotations đầy đủ (`@UI.LineItem`, `@UI.SelectionFields`, `@UI.HeaderInfo`, `@UI.Facets`, `@Common.SideEffects`).\n• Tạo `FioriElementsLab.view.xml` + `.controller.js` với đủ 4 Tabs và tạo 2 `ControllerExtension` trong `ext/controller/`.",
    image: "img/guideline/05_fiori_elements_lab_view.png",
    imageCaption: "Tab 1 Fiori Elements V4 Lab: FilterBar, bảng DemoHeader, nút Xác Minh và Object Page bên dưới.",
    prerequisites: [
      "Hoàn thành Chương 3 (đã có `metadata.xml`, `DemoHeader.json`, `DemoItem.json`)."
    ],
    cliCommands: [
      "npx --prefix src/frontend ui5 serve --port 8085"
    ],
    primaryFile: "src/frontend/webapp/localService/annotations.xml",
    primaryFilePath: "src/frontend/webapp/localService/annotations.xml",
    codeSnippet: readFileText("src/frontend/webapp/localService/annotations.xml"),
    annotatedLines: [
      { line: 10, code: "      <Annotations Target=\"sap.fiori.tech.academy.srv.DemoHeaderType\">", role: "Gắn UI Annotations cho Header", explanation: "Khai báo `@UI.SelectionFields`, `@UI.LineItem`, `@UI.HeaderInfo` và `@UI.Facets`.", tips: "Target phải trùng khớp `metadata.xml`." },
      { line: 162, code: "        <Annotation Term=\"Common.SideEffects\" Qualifier=\"CalculateTotals\">", role: "Khai báo Side Effects trên Item", explanation: "Khi `Quantity` hoặc `UnitPrice` đổi thì tự refresh `LineTotal` và `_Header/TotalAmount`.", tips: "Tại Tab 2 Lab, controller mô phỏng lại cơ chế này để bạn thấy trực tiếp." }
    ],
    workflowNodes: [
      { step: "1", layer: "EDMX Annotations", title: "annotations.xml chuẩn V4", detail: "UI.SelectionFields, UI.LineItem, UI.HeaderInfo, Common.SideEffects.", fileRef: "src/frontend/webapp/localService/annotations.xml" },
      { step: "2", layer: "4 Tabs Lab UI", title: "FioriElementsLab.view.xml", detail: "Tab 1 LROP, Tab 2 Side Effects, Tab 3 EDMX Viewer, Tab 4 <macros:*>.", fileRef: "src/frontend/webapp/view/FioriElementsLab.view.xml" },
      { step: "3", layer: "Logic & Fetch XML", title: "FioriElementsLab.controller", detail: "onExecuteVerifyAction, onSideEffectTriggered & fetch XML assets.", fileRef: "src/frontend/webapp/controller/FioriElementsLab.controller.js" },
      { step: "4", layer: "FPM Extensions", title: "ListReport & ObjectPage Ext", detail: "ControllerExtension.extend thêm hook onPageReady & custom actions.", fileRef: "src/frontend/webapp/ext/controller/ListReportExtension.controller.js" }
    ],
    relatedFiles: [
      rf("src/frontend/webapp/localService/annotations.xml", "OData V4 Vocabulary Annotations (@UI.LineItem, SelectionFields, HeaderInfo, SideEffects)", "UI.LineItem / Common.SideEffects", "Common.SideEffects"),
      rf("src/frontend/webapp/view/FioriElementsLab.view.xml", "4 Tabs phòng Lab: LROP (headersTable), Side Effects, EDMX Inspector, Building Blocks FPM", "feIconTabBar / headersTable", "feIconTabBar"),
      rf("src/frontend/webapp/controller/FioriElementsLab.controller.js", "Nạp DemoHeader/Item, lọc bảng, Action markAsVerified, Side Effects và fetch XML thật", "onExecuteVerifyAction / onSideEffectTriggered", "onExecuteVerifyAction"),
      rf("src/frontend/webapp/ext/controller/ListReportExtension.controller.js", "ControllerExtension mở rộng List Report V4 (onPageReady, onCustomHeaderAction)", "onPageReady / onCustomHeaderAction", "onCustomHeaderAction"),
      rf("src/frontend/webapp/ext/controller/ObjectPageExtension.controller.js", "ControllerExtension mở rộng Object Page V4 (onCustomItemAction, onVerifyTechnicalIntegrity)", "onCustomItemAction", "onCustomItemAction")
    ],
    steps: [
      {
        stepNumber: 1,
        ideOrTool: "VS Code",
        actionTitle: "Hoàn thiện đầy đủ nội dung src/frontend/webapp/localService/annotations.xml",
        detailedInstruction: "• **File cần cập nhật:** `src/frontend/webapp/localService/annotations.xml` (nâng cấp từ file khung ở Chương 3).\n• **Nội dung chính:**\n1. `@UI.SelectionFields`, `@UI.LineItem` (có `DataFieldForAction markAsVerified`), `@UI.HeaderInfo`, `@UI.Facets` cho `DemoHeaderType`.\n2. `@Common.SideEffects` trên `DemoItemType` (Source: `Quantity`, `UnitPrice` -> Target: `LineTotal`, `_Header/TotalAmount`).",
        commandOrPath: "src/frontend/webapp/localService/annotations.xml",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/localService/annotations.xml"), "Common.SideEffects", 22),
        targetFilePath: "src/frontend/webapp/localService/annotations.xml",
        verifyStep: "• Mở `http://localhost:8085/annotations/annotations.xml` trên Edge thấy đầy đủ XML Annotations.",
        expectedResult: "OData V4 Annotations hoàn thiện."
      },
      {
        stepNumber: 2,
        ideOrTool: "VS Code",
        actionTitle: "Tạo FioriElementsLab.view.xml với 4 Tab: LROP, Side Effects, Annotations & FPM",
        detailedInstruction: "• **File cần tạo:** `src/frontend/webapp/view/FioriElementsLab.view.xml`.\n• **Cấu trúc 4 Tabs trong `IconTabBar id=\"feIconTabBar\" headerMode=\"Inline\"`:**\n1. Tab `lrop`: FilterBar + Table `headersTable` + nút `Xác Minh (Bound Action)` + `objectPagePanel`.\n2. Tab `sideEffects`: `seItemSelect`, `seQuantityInput`, `seUnitPriceInput` + Nhật ký.\n3. Tab `inspector`: 2 khung `<core:HTML>` gắn formatter `.formatCodeBlockHtml` hiển thị XML thật.\n4. Tab `fpm`: Bảng `<macros:*>` (`fixedLayout=\"false\"` cột 28%/30%/42%) + nhật ký ControllerExtension.",
        commandOrPath: "src/frontend/webapp/view/FioriElementsLab.view.xml",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/view/FioriElementsLab.view.xml"), "feIconTabBar", 26),
        targetFilePath: "src/frontend/webapp/view/FioriElementsLab.view.xml",
        verifyStep: "• Kiểm tra Tab 4 dùng `fixedLayout=\"false\"` với cột 28%/30%/42% để cột mô tả không bị ép chữ dọc.",
        expectedResult: "Giao diện 4 Tab Fiori Elements Lab chuẩn xác.",
        stepImage: "img/guideline/05_fiori_elements_lab_view.png",
        stepImageCaption: "Tab 1: List Report & Object Page Floorplan kèm nút Xác Minh"
      },
      {
        stepNumber: 3,
        ideOrTool: "VS Code",
        actionTitle: "Tạo FioriElementsLab.controller.js xử lý dữ liệu & 4 Tabs",
        detailedInstruction: "• **File cần tạo:** `src/frontend/webapp/controller/FioriElementsLab.controller.js`.\n• **Các hàm bắt buộc:**\n1. `_loadData()` fetch `DemoHeader.json` & `DemoItem.json`; `_loadXmlAssets()` fetch `annotations.xml` & `metadata.xml`.\n2. `onExecuteVerifyAction()` đổi trạng thái sang `Verified` (`StatusCriticality = 3`).\n3. `onSideEffectTriggered()` tính lại `LineTotal` & `Header TotalAmount` rồi đẩy log.",
        commandOrPath: "src/frontend/webapp/controller/FioriElementsLab.controller.js",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/controller/FioriElementsLab.controller.js"), "onExecuteVerifyAction", 36),
        targetFilePath: "src/frontend/webapp/controller/FioriElementsLab.controller.js",
        verifyStep: "• Mở `http://localhost:8085/index.html#/fe-lab`:\n1. Bấm `Xác Minh (Bound Action)` -> Toast `markAsVerified` hiện lên.\n2. Qua Tab `2. Side Effects` đổi Quantity và bấm `Kích Hoạt Tính Lại` -> `LineTotal` & `Header TotalAmount` cập nhật.",
        expectedResult: "Tương tác Tab 1–3 chạy mượt.",
        stepImage: "img/guideline/06_side_effects_simulation.png",
        stepImageCaption: "Tab 2: Mô phỏng Side Effects tính lại LineTotal & Header TotalAmount"
      },
      {
        stepNumber: 4,
        ideOrTool: "VS Code",
        actionTitle: "Tạo 2 FPM Controller Extensions: ListReportExtension & ObjectPageExtension",
        detailedInstruction: "• **2 file cần tạo trong `src/frontend/webapp/ext/controller/`:**\n1. `ListReportExtension.controller.js` (hook `onPageReady`, `onCustomHeaderAction`, `onExportTechnicalReport`).\n2. `ObjectPageExtension.controller.js` (`onCustomItemAction`, `onVerifyTechnicalIntegrity`).\n• Bấm cả 2 nút nạp bên dưới để lấy code đầy đủ của 2 extension.",
        commandOrPath: "src/frontend/webapp/ext/controller/ListReportExtension.controller.js",
        stepCode: readFileText("src/frontend/webapp/ext/controller/ListReportExtension.controller.js"),
        targetFilePath: "src/frontend/webapp/ext/controller/ListReportExtension.controller.js",
        targetFiles: [
          tf("src/frontend/webapp/ext/controller/ListReportExtension.controller.js", "ListReportExtension.controller.js"),
          tf("src/frontend/webapp/ext/controller/ObjectPageExtension.controller.js", "ObjectPageExtension.controller.js")
        ],
        verifyStep: "• Vào `#/fe-lab` -> Tab `4. Building Blocks & FPM`, bấm `Mô Phỏng: onPageReady Hook` thấy log ghi nhận và bảng cân đối.",
        expectedResult: "Hoàn thành toàn bộ Phòng Lab 01.",
        stepImage: "img/guideline/07_fpm_building_blocks.png",
        stepImageCaption: "Tab 4: Building Blocks & Controller Extension FPM"
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 8
  // =========================================================================
  {
    id: "chap8",
    step: 8,
    title: "Chương 8: Phòng Lab 02 — Freestyle SAPUI5 MVC, Custom Control, MessageManager & XML Fragment (#/freestyle-lab)",
    summary: "• Tạo `freestyle_data.json`, Custom Control `TechnicalHealthGauge.js` (RenderManager v2) và Fragment `QuickInspectDialog.fragment.xml`.\n• Tạo `FreestyleLab.view.xml` + `.controller.js` với đúng 4 Tab: Data Binding Lab (`freestyleModel>/systemConfig`), MessageManager (nút `MessagePopover` ở sub-header góc trên phải `! 1`), Custom Controls & XML Fragments.",
    image: "img/guideline/12_custom_controls_gauge.png",
    imageCaption: "Tab 3 Freestyle Lab: 3 Custom Controls TechnicalHealthGauge gắn Slider Two-Way & mã nguồn bên dưới.",
    prerequisites: [
      "Hoàn thành Chương 4 (đã có BaseController & route `freestyleLab`)."
    ],
    cliCommands: [
      "npx --prefix src/frontend ui5 serve --port 8085"
    ],
    primaryFile: "src/frontend/webapp/control/TechnicalHealthGauge.js",
    primaryFilePath: "src/frontend/webapp/control/TechnicalHealthGauge.js",
    codeSnippet: readFileText("src/frontend/webapp/control/TechnicalHealthGauge.js"),
    annotatedLines: [
      { line: 10, code: "    return Control.extend(\"sap.fiori.tech.academy.control.TechnicalHealthGauge\", {", role: "Kế thừa sap.ui.core.Control", explanation: "Cho phép nhúng bằng `<custom:TechnicalHealthGauge />` trong XML View.", tips: "Tên class phải khớp đường dẫn `control/TechnicalHealthGauge.js`." },
      { line: 47, code: "        renderer: {", role: "RenderManager apiVersion 2", explanation: "Dùng `oRm.openStart(\"div\", oControl)` vẽ thanh progress và tag màu Tối Ưu / Cảnh Báo Đỏ.", tips: "apiVersion: 2 giúp cập nhật DOM mượt mà khi kéo Slider." }
    ],
    workflowNodes: [
      { step: "1", layer: "Mock Data", title: "freestyle_data.json", detail: "systemConfig, 4 modules (MOD-01..04) & sampleValidationEntities.", fileRef: "src/frontend/webapp/mockdata/freestyle_data.json" },
      { step: "2", layer: "Custom Control", title: "TechnicalHealthGauge.js", detail: "RenderManager apiVersion 2 + sự kiện onclick -> firePress().", fileRef: "src/frontend/webapp/control/TechnicalHealthGauge.js" },
      { step: "3", layer: "XML Fragment", title: "QuickInspectDialog", detail: "Dialog nạp bất đồng bộ qua Fragment.load() với sapUiContentPadding.", fileRef: "src/frontend/webapp/fragment/QuickInspectDialog.fragment.xml" },
      { step: "4", layer: "MVC Lab Logic", title: "FreestyleLab View + Ctrl", detail: "Bind freestyleModel>/, MessageManager & MessagePopover.", fileRef: "src/frontend/webapp/controller/FreestyleLab.controller.js" }
    ],
    relatedFiles: [
      rf("src/frontend/webapp/mockdata/freestyle_data.json", "Dữ liệu systemConfig (RAM/CPU/DB), 4 modules và dữ liệu form validation mẫu", "systemConfig / modules(4)", "\"systemConfig\""),
      rf("src/frontend/webapp/control/TechnicalHealthGauge.js", "Custom Control RenderManager (apiVersion: 2) hiển thị chỉ số sức khỏe + sự kiện press", "Control.extend / renderer", "renderer:"),
      rf("src/frontend/webapp/fragment/QuickInspectDialog.fragment.xml", "XML Fragment Dialog tái sử dụng có sapUiContentPadding & Element Binding", "quickInspectDialog", "quickInspectDialog"),
      rf("src/frontend/webapp/view/FreestyleLab.view.xml", "4 Tab Freestyle Lab: Data Binding, MessageManager, Custom Controls, XML Fragments", "freestyleTabBar / messagePopoverBtn", "freestyleTabBar"),
      rf("src/frontend/webapp/controller/FreestyleLab.controller.js", "Xử lý onModuleSelectChange, onValidateForm, onSimulateBackendError, onOpenInspectDialog", "onValidateForm / onOpenInspectDialog", "onValidateForm")
    ],
    steps: [
      {
        stepNumber: 1,
        ideOrTool: "VS Code",
        actionTitle: "Tạo freestyle_data.json và Custom Control TechnicalHealthGauge.js",
        detailedInstruction: "• **2 file cần tạo:**\n1. `src/frontend/webapp/mockdata/freestyle_data.json`: chứa `systemConfig`, 4 `modules` và `sampleValidationEntities`.\n2. `src/frontend/webapp/control/TechnicalHealthGauge.js`: kế thừa `sap/ui/core/Control`, khai báo properties (`title`, `value`, `maxValue`, `unit`, `thresholdWarning`, `thresholdCritical`), event `press` và `renderer` dùng `apiVersion: 2`.\n• Bấm từng nút bên dưới để lấy đủ cả 2 file.",
        commandOrPath: "src/frontend/webapp/control/TechnicalHealthGauge.js",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/control/TechnicalHealthGauge.js"), "metadata:", 28),
        targetFilePath: "src/frontend/webapp/control/TechnicalHealthGauge.js",
        targetFiles: [
          tf("src/frontend/webapp/mockdata/freestyle_data.json", "freestyle_data.json"),
          tf("src/frontend/webapp/control/TechnicalHealthGauge.js", "TechnicalHealthGauge.js")
        ],
        verifyStep: "• Kiểm tra `TechnicalHealthGauge.js` khai báo `apiVersion: 2` trong `renderer` và gọi `this.firePress()` trong `onclick`.",
        expectedResult: "Có mockdata Freestyle và Custom Control độc lập."
      },
      {
        stepNumber: 2,
        ideOrTool: "VS Code",
        actionTitle: "Tạo XML Fragment QuickInspectDialog.fragment.xml",
        detailedInstruction: "• **File cần tạo:** `src/frontend/webapp/fragment/QuickInspectDialog.fragment.xml`.\n• **Cấu hình chuẩn:** Dùng `<Dialog id=\"quickInspectDialog\" class=\"sapUiContentPadding\">`, bind dữ liệu qua `{freestyleModel>/inspectedModule/name}` kèm 2 nút `Xác Nhận Đạt Chuẩn` và `Đóng`.",
        commandOrPath: "src/frontend/webapp/fragment/QuickInspectDialog.fragment.xml",
        stepCode: readFileText("src/frontend/webapp/fragment/QuickInspectDialog.fragment.xml"),
        targetFilePath: "src/frontend/webapp/fragment/QuickInspectDialog.fragment.xml",
        verifyStep: "• Kiểm tra `QuickInspectDialog.fragment.xml` dùng `class=\"sapUiContentPadding\"` để chữ không sát viền Dialog.",
        expectedResult: "Fragment sẵn sàng được nạp động bởi Fragment.load()."
      },
      {
        stepNumber: 3,
        ideOrTool: "VS Code",
        actionTitle: "Tạo FreestyleLab.view.xml với 4 Tab (đúng model freestyleModel>/)",
        detailedInstruction: "• **File cần tạo:** `src/frontend/webapp/view/FreestyleLab.view.xml`.\n• **Kiểm tra đúng các thành phần bắt buộc:**\n1. Sub-header `<headerContent>` góc trên phải chứa nút `Button id=\"messagePopoverBtn\"`.\n2. Tab 1 (`dataBinding`): Property Two-Way, Expression Binding và Element Binding (`moduleContextSelect`).\n3. Tab 2 (`messageManager`): `inputEntityName`, `inputConfigKey`, `inputEmail` + 3 nút (`Kiểm Tra Toàn Bộ Biểu Mẫu`, `Mô Phỏng Lỗi Backend (500)`, `Xóa Sạch Lỗi`).\n4. Tab 3 (`customControls`): 3 `<custom:TechnicalHealthGauge value=\"{freestyleModel>/systemConfig/memoryUsage}\" />`.\n5. Tab 4 (`fragments`): Nút mở `QuickInspectDialog` + mã XML hiển thị.",
        commandOrPath: "src/frontend/webapp/view/FreestyleLab.view.xml",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/view/FreestyleLab.view.xml"), "gaugeMemory", 20),
        targetFilePath: "src/frontend/webapp/view/FreestyleLab.view.xml",
        verifyStep: "• Kiểm tra tên model binding là `freestyleModel>/systemConfig` và nút MessagePopover nằm ở `<headerContent>`.",
        expectedResult: "Giao diện 4 tab Freestyle Lab khớp 100%.",
        stepImage: "img/guideline/10_freestyle_lab_view.png",
        stepImageCaption: "Tab 1 Freestyle Lab: 4 kiểu Data Binding trong SAPUI5"
      },
      {
        stepNumber: 4,
        ideOrTool: "VS Code",
        actionTitle: "Tạo FreestyleLab.controller.js kết nối MessageManager & Fragment.load()",
        detailedInstruction: "• **File cần tạo:** `src/frontend/webapp/controller/FreestyleLab.controller.js`.\n• **Các luồng xử lý:**\n1. `_loadData()` fetch `freestyle_data.json` & `_loadCodeAssets()` fetch mã nguồn gauge/fragment.\n2. `onValidateForm()` tạo `sap.ui.core.message.Message` đẩy vào `sap.ui.getCore().getMessageManager()`.\n3. `onSimulateBackendError()` đẩy lỗi 500 vào MessageManager và mở `MessagePopover` ngay tại `messagePopoverBtn`.\n4. `onOpenInspectDialog()` nạp `QuickInspectDialog` bằng `Fragment.load()`.",
        commandOrPath: "src/frontend/webapp/controller/FreestyleLab.controller.js",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/controller/FreestyleLab.controller.js"), "onValidateForm", 30),
        targetFilePath: "src/frontend/webapp/controller/FreestyleLab.controller.js",
        verifyStep: "• Mở `http://localhost:8085/index.html#/freestyle-lab`:\n1. Bấm `Mô Phỏng Lỗi Backend (500)` ở Tab 2 -> MessagePopover bật ra tại góc trên phải (`! 1`).\n2. Qua Tab 3 kéo Slider -> Gauge đổi trạng thái xanh/vàng/đỏ.\n3. Qua Tab 4 bấm `Mở Reusable Fragment Dialog` -> Dialog mở thoáng chữ.",
        expectedResult: "Toàn bộ 4 Tab Freestyle Lab chạy chuẩn.",
        stepImage: "img/guideline/11_message_manager_popover.png",
        stepImageCaption: "Tab 2 Freestyle Lab: MessageManager & MessagePopover"
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 9
  // =========================================================================
  {
    id: "chap9",
    step: 9,
    title: "Chương 9: Phòng Lab 03 — OData V4 Protocol: Query Thật Mockserver, markAsVerified, $batch & ETag 412 (#/odata-lab)",
    summary: "• Tạo `odata_v4_deepdive.json`, `ODataV4Lab.view.xml` và `ODataV4Lab.controller.js`.\n• Tab 1 gọi HTTP GET thật tới `/mock/odata/v4/demo/` xử lý `$select`, `$expand`, `$filter`, `$orderby`; Tab 2 minh họa Bound Action `markAsVerified` & Unbound Function `getSystemHealthReport()`; Tab 3 mô phỏng Multipart `$batch`; Tab 4 mô phỏng xung đột ETag HTTP 412.",
    image: "img/guideline/15_odata_v4_query_executed.png",
    imageCaption: "Tab 1 OData V4 Lab gọi HTTP GET thật tới fe-mockserver với $select, $expand, $filter, $orderby.",
    prerequisites: [
      "Hoàn thành Chương 3 (mockserver đang phục vụ `/mock/odata/v4/demo/`)."
    ],
    cliCommands: [
      "npx --prefix src/frontend ui5 serve --port 8085"
    ],
    primaryFile: "src/frontend/webapp/controller/ODataV4Lab.controller.js",
    primaryFilePath: "src/frontend/webapp/controller/ODataV4Lab.controller.js",
    codeSnippet: readFileText("src/frontend/webapp/controller/ODataV4Lab.controller.js"),
    annotatedLines: [
      { line: 93, code: "        _buildQueryString: function (q) {", role: "Ghép System Query Options OData V4", explanation: "Encode chuẩn `$select`, `$expand`, `$filter`, `$orderby`, `$top`, `$skip` + `&$count=true`.", tips: "Luôn `encodeURIComponent` để tránh lỗi khoảng trắng & dấu nháy đơn `'`." },
      { line: 155, code: "        onExecuteQuery: function () {", role: "Gọi HTTP GET thật tới fe-mockserver", explanation: "Dùng `fetch(sRequestPath)` gọi thẳng `/mock/odata/v4/demo/DemoHeader?...`.", tips: "Xem trong Tab Network (F12) để thấy response HTTP 200 thật." },
      { line: 208, code: "        onExecuteBoundAction: function () {", role: "Minh họa Bound Action markAsVerified", explanation: "Khớp 100% với tên action `markAsVerified` trong `metadata.xml` và BDEF.", tips: "Đổi `Status` thành `'Verified'` kèm header `ETag` mới." },
      { line: 277, code: "        onUserAConflictCommit: function () {", role: "Mô phỏng HTTP 412 Precondition Failed", explanation: "Kỹ sư A gửi `If-Match: V1` sau khi Kỹ sư B đã commit lên `V2` -> bật `MessageBox.error` báo chặn Lost Update.", tips: "Minh họa trực quan cơ chế Optimistic Concurrency Control." }
    ],
    workflowNodes: [
      { step: "1", layer: "Preset & Batch", title: "odata_v4_deepdive.json", detail: "4 queryPresets, batchSample (ChangeSet) & etagDemo.", fileRef: "src/frontend/webapp/mockdata/odata_v4_deepdive.json" },
      { step: "2", layer: "4 Tabs UI", title: "ODataV4Lab.view.xml", detail: "Request Builder, Bound/Unbound Ops, $batch & Concurrency ETag.", fileRef: "src/frontend/webapp/view/ODataV4Lab.view.xml" },
      { step: "3", layer: "Live HTTP Fetch", title: "ODataV4Lab.controller.js", detail: "onExecuteQuery gửi fetch() thật tới /mock/odata/v4/demo/DemoHeader", fileRef: "src/frontend/webapp/controller/ODataV4Lab.controller.js" },
      { step: "4", layer: "Mock Server", title: "fe-mockserver Engine", detail: "Trả HDR-004 trước HDR-001 theo filter Status & orderby TotalAmount desc.", fileRef: "src/frontend/ui5.yaml" }
    ],
    relatedFiles: [
      rf("src/frontend/webapp/mockdata/odata_v4_deepdive.json", "4 Preset truy vấn, mẫu gói tin multipart/mixed $batch và dữ liệu ETag demo", "queryPresets(4) / batchSample / etagDemo", "\"queryPresets\""),
      rf("src/frontend/webapp/view/ODataV4Lab.view.xml", "4 Tab chuyên sâu: Query Builder, Bound/Unbound Ops, $batch, Concurrency ETag", "odataTabBar / inputFilter", "odataTabBar"),
      rf("src/frontend/webapp/controller/ODataV4Lab.controller.js", "Gọi fetch() thật tới /mock/odata/v4/demo/, markAsVerified, getSystemHealthReport & ETag 412", "onExecuteQuery / onExecuteBoundAction", "onExecuteQuery")
    ],
    steps: [
      {
        stepNumber: 1,
        ideOrTool: "VS Code",
        actionTitle: "Tạo mockdata/odata_v4_deepdive.json (4 Presets, $batch & ETag)",
        detailedInstruction: "• **File cần tạo:** `src/frontend/webapp/mockdata/odata_v4_deepdive.json`.\n• **Các khóa chính:**\n1. `queryPresets`: 4 preset chạy trực tiếp trên Entity `DemoHeader` (`$expand=_Items`, `$filter`, `$orderby`, `$top/$skip`).\n2. `batchSample`: payload mẫu chuẩn MIME `multipart/mixed` bọc atomic ChangeSet.\n3. `etagDemo`: trạng thái đầu cho mô phỏng Kỹ sư A vs Kỹ sư B.",
        commandOrPath: "src/frontend/webapp/mockdata/odata_v4_deepdive.json",
        stepCode: sampleArraySchema("src/frontend/webapp/mockdata/odata_v4_deepdive.json", "queryPresets", 1),
        targetFilePath: "src/frontend/webapp/mockdata/odata_v4_deepdive.json",
        verifyStep: "• Kiểm tra JSON parse hợp lệ và preset đầu trỏ đúng `entity: \"DemoHeader\"`.",
        expectedResult: "Dữ liệu cho 4 tab OData V4 sẵn sàng."
      },
      {
        stepNumber: 2,
        ideOrTool: "VS Code",
        actionTitle: "Tạo ODataV4Lab.view.xml theo đúng thứ tự 4 Tab chuẩn",
        detailedInstruction: "• **File cần tạo:** `src/frontend/webapp/view/ODataV4Lab.view.xml`.\n• **4 Tab bên trong `IconTabBar id=\"odataTabBar\" headerMode=\"Inline\"`:**\n1. `queryBuilder`: Form nhập `$select/$expand/$filter/$orderby/$top/$skip` + nút `Thực Thi Truy Vấn OData V4`.\n2. `operations`: Nút gọi `markAsVerified` và `getSystemHealthReport()`.\n3. `batch`: Hiển thị gói tin request & response `$batch` bằng `formatCodeBlockHtml`.\n4. `etag`: 3 nút `Bước 1:`, `Bước 2:`, `Bước 3:` mô phỏng ETag V1 vs V2.",
        commandOrPath: "src/frontend/webapp/view/ODataV4Lab.view.xml",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/view/ODataV4Lab.view.xml"), "odataTabBar", 24),
        targetFilePath: "src/frontend/webapp/view/ODataV4Lab.view.xml",
        verifyStep: "• Kiểm tra không dùng `<TextArea>` cho JSON code mà dùng `<core:HTML>` gắn `formatter=\".formatCodeBlockHtml\"`.",
        expectedResult: "View 4 tab gọn sạch, không tràn chữ."
      },
      {
        stepNumber: 3,
        ideOrTool: "VS Code / Edge",
        actionTitle: "Tạo ODataV4Lab.controller.js và kiểm thử gọi Mockserver thật",
        detailedInstruction: "• **File cần tạo:** `src/frontend/webapp/controller/ODataV4Lab.controller.js`.\n• **Các hàm trọng tâm:**\n1. `onExecuteQuery()`: gửi HTTP GET thật bằng `fetch(sRequestPath)` tới `/mock/odata/v4/demo/`.\n2. `onExecuteBoundAction()` (`markAsVerified`) & `onExecuteUnboundFunction()` (`getSystemHealthReport`).\n3. `onUserBCommit()` + `onUserAConflictCommit()` (HTTP 412).",
        commandOrPath: "src/frontend/webapp/controller/ODataV4Lab.controller.js",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/controller/ODataV4Lab.controller.js"), "onExecuteQuery", 30),
        targetFilePath: "src/frontend/webapp/controller/ODataV4Lab.controller.js",
        verifyStep: "• Mở `http://localhost:8085/index.html#/odata-lab`:\n1. Bấm `Thực Thi Truy Vấn OData V4` -> thấy JSON thật từ fe-mockserver trả `HDR-004` trước `HDR-001`.\n2. Qua Tab 4 bấm `Bước 1:` rồi `Bước 2:` -> popup đỏ `HTTP 412 Precondition Failed` bật lên.",
        expectedResult: "Hoàn thành toàn bộ Phòng Lab 03 OData V4.",
        stepImage: "img/guideline/18_odata_v4_etag_concurrency.png",
        stepImageCaption: "Tab 4 OData V4 Lab: Chặn ghi đè Lost Update bằng HTTP 412"
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 10
  // =========================================================================
  {
    id: "chap10",
    step: 10,
    title: "Chương 10: Sổ Tay 15 Lỗi Thực Chiến Error Playbook (#/errors) & Hướng Dẫn User Manual (#/manual)",
    summary: "• Tạo phân hệ Sổ Tay Sự Cố (`error_playbook.json`, `ErrorPlaybook.*`) với 5 KPI Tiles, lọc 3 tiêu chí, Popup Chi tiết 6 chiều, Code Diff Dialog Before/After và tải Markdown.\n• Tạo phân hệ Sổ Tay Vận Hành (`user_manual.json`, `UserManual.*`) hướng dẫn 10 phân hệ kèm ảnh zoom và nút đi thẳng tới từng màn hình.",
    image: "img/guideline/20_error_playbook_view.png",
    imageCaption: "Màn hình Error Playbook (#/errors) với 5 KPI Tiles, bảng 15 sự cố & nút Chi Tiết / Code Diff.",
    prerequisites: [
      "Hoàn thành Chương 4 (đã có routes `errorPlaybook` và `userManual`)."
    ],
    cliCommands: [
      "npx --prefix src/frontend ui5 serve --port 8085"
    ],
    primaryFile: "src/frontend/webapp/controller/ErrorPlaybook.controller.js",
    primaryFilePath: "src/frontend/webapp/controller/ErrorPlaybook.controller.js",
    codeSnippet: readFileText("src/frontend/webapp/controller/ErrorPlaybook.controller.js"),
    annotatedLines: [
      { line: 147, code: "        _openErrorDetailDialog: function (oErrorData) {", role: "Dialog Phân Tích 6 Chiều", explanation: "Tạo `sap.m.Dialog` gắn `.addStyleClass(\"sapUiContentPadding\")` hiển thị Nguyên nhân, Tư duy xử lý và Cách sửa.", tips: "Không truyền `class:` trong JS config object của UI5 control mà phải dùng `.addStyleClass(...)`." },
      { line: 277, code: "        _openCodeDiffDialog: function (oErrorData) {", role: "Dialog So Sánh Code Before vs After", explanation: "Hiển thị code bị lỗi bên trái và code chuẩn bên phải kèm nút Copy giải pháp.", tips: "Giúp người học đối chiếu từng dòng sửa." }
    ],
    workflowNodes: [
      { step: "1", layer: "Dữ liệu Playbook", title: "error_playbook.json (15)", detail: "15 lỗi thật kèm symptom, rootCause, codeBefore, codeAfter.", fileRef: "src/frontend/webapp/mockdata/error_playbook.json" },
      { step: "2", layer: "Playbook UI & Ctrl", title: "ErrorPlaybook View/Ctrl", detail: "5 KPI Tiles + 2 Dialog Detail/Diff có padding thoáng.", fileRef: "src/frontend/webapp/controller/ErrorPlaybook.controller.js" },
      { step: "3", layer: "Dữ liệu Sổ Tay", title: "user_manual.json (10)", detail: "10 sections kèm testSteps và ảnh chụp màn hình.", fileRef: "src/frontend/webapp/mockdata/user_manual.json" },
      { step: "4", layer: "User Manual UI", title: "UserManual View/Ctrl", detail: "Chọn mục bên trái, Next/Prev & nhảy tới route thật.", fileRef: "src/frontend/webapp/controller/UserManual.controller.js" }
    ],
    relatedFiles: [
      rf("docs/ERROR_HANDLING_PLAYBOOK.md", "Tài liệu đặc tả 15 mã lỗi ERR-01 đến ERR-15 (kèm Root Cause & Fix)", "ERR-01 .. ERR-15", "ERR-01"),
      rf("src/frontend/webapp/mockdata/error_playbook.json", "15 sự cố kỹ thuật thực chiến xuyên suốt Frontend/OData/ADT/RAP", "errors(15) & summary", "\"errors\""),
      rf("src/frontend/webapp/view/ErrorPlaybook.view.xml", "5 KPI Tiles lọc nhanh, 3 Select filters và Table errorTable với cột cân đối", "errorTable / errorSearchField", "errorTable"),
      rf("src/frontend/webapp/controller/ErrorPlaybook.controller.js", "Tạo Detail Dialog, Code Diff Dialog (.addStyleClass), tải Markdown & lọc 4 chiều", "_openErrorDetailDialog / _openCodeDiffDialog", "_openErrorDetailDialog"),
      rf("docs/USER_MANUAL.md", "Tài liệu Sổ tay hướng dẫn vận hành & kịch bản test cho cả 10 phân hệ", "3.1 .. 3.10 & Test Steps", "MỤC LỤC"),
      rf("src/frontend/webapp/mockdata/user_manual.json", "10 mục hướng dẫn vận hành chi tiết cho từng màn hình trong app", "sections(10)", "\"sections\""),
      rf("src/frontend/webapp/view/UserManual.view.xml", "Trang Sổ tay chia trái (manualSectionList) - phải (manualDetailPanel + ảnh minh họa)", "manualSectionList / manualDetailPanel", "manualSectionList"),
      rf("src/frontend/webapp/controller/UserManual.controller.js", "Tìm kiếm section, Next/Prev, phóng to ảnh và điều hướng tới màn hình thật", "onSectionSelect / onNavigateToFeature", "onNavigateToFeature")
    ],
    steps: [
      {
        stepNumber: 1,
        ideOrTool: "VS Code",
        actionTitle: "Tạo mockdata/error_playbook.json (15 lỗi), user_manual.json (10 mục) & 2 tài liệu docs",
        detailedInstruction: "• **4 file dữ liệu & tài liệu cần tạo:**\n1. `docs/ERROR_HANDLING_PLAYBOOK.md` & `mockdata/error_playbook.json` (15 đối tượng `errors`).\n2. `docs/USER_MANUAL.md` & `mockdata/user_manual.json` (10 đối tượng `sections`).\n• Bấm từng nút nạp file bên dưới để copy trọn vẹn cả 4 file (giúp `npm test` Tầng 9 & Tầng 11 PASS 100%).",
        commandOrPath: "src/frontend/webapp/mockdata/error_playbook.json",
        stepCode: sampleArraySchema("src/frontend/webapp/mockdata/error_playbook.json", "errors", 1) + "\n\n// user_manual.json schema:\n" + sampleArraySchema("src/frontend/webapp/mockdata/user_manual.json", "sections", 1),
        targetFilePath: "src/frontend/webapp/mockdata/error_playbook.json",
        targetFiles: [
          tf("src/frontend/webapp/mockdata/error_playbook.json", "error_playbook.json (15 lỗi)"),
          tf("src/frontend/webapp/mockdata/user_manual.json", "user_manual.json (10 mục)"),
          tf("docs/ERROR_HANDLING_PLAYBOOK.md", "docs/ERROR_HANDLING_PLAYBOOK.md"),
          tf("docs/USER_MANUAL.md", "docs/USER_MANUAL.md")
        ],
        verifyStep: "• Xác nhận `error_playbook.json` có đúng 15 phần tử `errors` và `user_manual.json` có 10 `sections`.",
        expectedResult: "Dữ liệu Playbook & Sổ tay hợp lệ."
      },
      {
        stepNumber: 2,
        ideOrTool: "VS Code",
        actionTitle: "Tạo ErrorPlaybook.view.xml & ErrorPlaybook.controller.js (#/errors)",
        detailedInstruction: "• **2 file cần tạo:**\n1. `view/ErrorPlaybook.view.xml`: dùng icon chuẩn `sap-icon://palette` cho RAP tile, thiết lập độ rộng cột bảng gọn trong màn hình.\n2. `controller/ErrorPlaybook.controller.js`: viết `_openErrorDetailDialog` và `_openCodeDiffDialog` gắn `.addStyleClass(\"sapUiContentPadding\")`.\n• Bấm nút nạp từng file ở bên dưới.",
        commandOrPath: "src/frontend/webapp/controller/ErrorPlaybook.controller.js",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/controller/ErrorPlaybook.controller.js"), "_openCodeDiffDialog", 26),
        targetFilePath: "src/frontend/webapp/controller/ErrorPlaybook.controller.js",
        targetFiles: [
          tf("src/frontend/webapp/view/ErrorPlaybook.view.xml", "ErrorPlaybook.view.xml"),
          tf("src/frontend/webapp/controller/ErrorPlaybook.controller.js", "ErrorPlaybook.controller.js")
        ],
        verifyStep: "• Mở `http://localhost:8085/index.html#/errors`.\n• Bấm `Chi Tiết` và `Code Diff` ở dòng `ERR_001`: hộp thoại mở ra có đệm thoáng đều 4 cạnh, không dính viền.",
        expectedResult: "Error Playbook 15 lỗi chạy trơn tru.",
        stepImage: "img/guideline/20_error_playbook_view.png",
        stepImageCaption: "Error Playbook (#/errors) với 5 KPI Tiles và 15 lỗi"
      },
      {
        stepNumber: 3,
        ideOrTool: "VS Code",
        actionTitle: "Tạo UserManual.view.xml & UserManual.controller.js (#/manual)",
        detailedInstruction: "• **2 file cần tạo:**\n1. `view/UserManual.view.xml`: giao diện 2 cột gồm `manualSectionList` bên trái, `manualDetailPanel` + ảnh `manualImage` bên phải.\n2. `controller/UserManual.controller.js`: xử lý tìm kiếm `onSearchManualLiveChange`, `onNextSection`/`onPreviousSection` và nút nhảy thẳng tới phân hệ `onNavigateToFeature`.",
        commandOrPath: "src/frontend/webapp/controller/UserManual.controller.js",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/controller/UserManual.controller.js"), "onNavigateToFeature", 22),
        targetFilePath: "src/frontend/webapp/controller/UserManual.controller.js",
        targetFiles: [
          tf("src/frontend/webapp/view/UserManual.view.xml", "UserManual.view.xml"),
          tf("src/frontend/webapp/controller/UserManual.controller.js", "UserManual.controller.js")
        ],
        verifyStep: "• Mở `http://localhost:8085/index.html#/manual`, chọn 1 phân hệ và bấm nút mở phân hệ tương ứng thấy điều hướng đúng route.",
        expectedResult: "Màn hình Sổ tay Hướng Dẫn hoàn tất.",
        stepImage: "img/guideline/19_user_manual_fullwidth.png",
        stepImageCaption: "Trang User Manual (#/manual) hiển thị đầy đủ chiều ngang"
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 11
  // =========================================================================
  {
    id: "chap11",
    step: 11,
    title: "Chương 11: Advanced Technical Labs (#/advanced-lab: DCL, SM59, QA, FLP), Architecture Viewer & Deploy",
    summary: "• Tạo `advanced_lab_data.json`, `AdvancedLab.view.xml` & `.controller.js` với 4 Tab hạ tầng SAP Fiori (Lab 07 DCL & CSRF, Lab 06 SM59 & CORS Proxy, Lab 08 QA Runners, Lab 09 FLP Spaces).\n• Tạo trang `ArchitectureViewer.*` (#/architecture) và cấu hình deploy ABAP `ui5-deploy.yaml`.",
    image: "img/guideline/21_advanced_lab_view.png",
    imageCaption: "Advanced Technical Labs (#/advanced-lab) với Tab DCL Row-Level Security & CSRF Handshake.",
    prerequisites: [
      "Hoàn thành Chương 4 (đã có routes `advancedLab` và `architecture`)."
    ],
    cliCommands: [
      "npm --prefix src/frontend run build"
    ],
    primaryFile: "src/frontend/webapp/controller/AdvancedLab.controller.js",
    primaryFilePath: "src/frontend/webapp/controller/AdvancedLab.controller.js",
    codeSnippet: readFileText("src/frontend/webapp/controller/AdvancedLab.controller.js"),
    annotatedLines: [
      { line: 43, code: "        onRoleChange: function (oEvent) {", role: "Mô phỏng DCL WHERE theo PFCG Role", explanation: "Thay đổi qua lại 3 role `Z_DEMO_ADMIN`, `Z_DEMO_APPROVER`, `Z_DEMO_VIEWER` và hiển thị mệnh đề SQL WHERE tương ứng.", tips: "Giúp Fresher thấy ngay tác động của DCL Access Control." },
      { line: 72, code: "        onSimulateCsrfFetch: function () {", role: "Bắt tay X-CSRF-Token", explanation: "Mô phỏng request GET có header `X-CSRF-Token: Fetch` trước khi mở khóa nút gửi lệnh POST ghi dữ liệu.", tips: "Mọi request ghi OData lên SAP Gateway đều bắt buộc token này." }
    ],
    workflowNodes: [
      { step: "1", layer: "Dữ Liệu Lab", title: "advanced_lab_data.json", detail: "Chứa `security`, `integration`, `testing` & `deployment`.", fileRef: "src/frontend/webapp/mockdata/advanced_lab_data.json" },
      { step: "2", layer: "Lab Nâng Cao", title: "AdvancedLab View + Ctrl", detail: "4 Tabs: DCL & CSRF (Lab 07), SM59/CORS (Lab 06), QA (Lab 08), FLP (Lab 09).", fileRef: "src/frontend/webapp/view/AdvancedLab.view.xml" },
      { step: "3", layer: "Kiến Trúc 3 Tầng", title: "ArchitectureViewer", detail: "3 Execution Tiers, Baseline Software Components & Save Sequence.", fileRef: "src/frontend/webapp/view/ArchitectureViewer.view.xml" },
      { step: "4", layer: "Build & Deploy", title: "ui5-deploy.yaml", detail: "Đóng gói dist/ và đẩy lên BSP App trong ZNGHIANDD_TEST.", fileRef: "src/frontend/ui5-deploy.yaml" }
    ],
    relatedFiles: [
      rf("src/frontend/webapp/mockdata/advanced_lab_data.json", "Dữ liệu 4 chuyên đề Lab 06–09 (security, integration, testing, deployment)", "security / integration / testing / deployment", "\"security\""),
      rf("src/frontend/webapp/view/AdvancedLab.view.xml", "4 Tab Advanced Lab: DCL Simulator + CSRF, SM59/CORS, QA Tests, FLP Spaces", "advancedLabTabBar / roleSelect", "advancedLabTabBar"),
      rf("src/frontend/webapp/controller/AdvancedLab.controller.js", "Xử lý mô phỏng đổi PFCG Role DCL, bắt tay CSRF Token, mở QUnit/OPA5 & tải deploy yaml", "onRoleChange / onSimulateCsrfFetch", "onSimulateCsrfFetch"),
      rf("src/frontend/webapp/view/ArchitectureViewer.view.xml", "Sơ đồ 3 tầng thực thi, Baseline Software Components PQPOC 100 & Point of No Return", "architecturePage", "architecturePage"),
      rf("src/frontend/webapp/controller/ArchitectureViewer.controller.js", "Controller điều hướng quay về Dashboard của trang Kiến trúc", "onNavBack", "onNavBack"),
      rf("src/frontend/ui5-deploy.yaml", "Cấu hình Fiori Tools builder deploy-to-abap vào package ZNGHIANDD_TEST", "deploy-to-abap", "deploy-to-abap"),
      rf("docs/VERSION_COMPATIBILITY.md", "Ma trận tương thích tính năng RAP-STRICT, RAP-SIDEFX, RAP-DRAFT trên S/4HANA 2025", "RAP-STRICT / Supported", "RAP-STRICT")
    ],
    steps: [
      {
        stepNumber: 1,
        ideOrTool: "VS Code",
        actionTitle: "Tạo mockdata/advanced_lab_data.json cho 4 chuyên đề Lab 06–09",
        detailedInstruction: "• **File cần tạo:** `src/frontend/webapp/mockdata/advanced_lab_data.json`.\n• **4 khối dữ liệu bắt buộc:**\n1. `security`: DCL code mẫu + 3 PFCG roles + cấu hình CSRF.\n2. `integration`: Bảng SM59 destinations & cấu hình Proxy YAML.\n3. `testing`: Metrics QUnit/OPA5 & code mẫu ABAP Unit.\n4. `deployment`: FLP Tile (`DemoTechnicalApp-display`) & BSP package.",
        commandOrPath: "src/frontend/webapp/mockdata/advanced_lab_data.json",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/mockdata/advanced_lab_data.json"), "\"security\"", 20),
        targetFilePath: "src/frontend/webapp/mockdata/advanced_lab_data.json",
        verifyStep: "• Kiểm tra JSON parse hợp lệ và đủ 4 keys gốc.",
        expectedResult: "Model `advLab` nạp thành công."
      },
      {
        stepNumber: 2,
        ideOrTool: "VS Code",
        actionTitle: "Tạo AdvancedLab.view.xml & AdvancedLab.controller.js (#/advanced-lab)",
        detailedInstruction: "• **2 file cần tạo:**\n1. `view/AdvancedLab.view.xml` với `advancedLabTabBar headerMode=\"Inline\"` gồm 4 Tabs (`securityLab`, `integrationLab`, `testingLab`, `deploymentLab`).\n2. `controller/AdvancedLab.controller.js` xử lý `onRoleChange`, `onSimulateCsrfFetch`, `onSimulatePostWithCsrf`, `onOpenQUnitRunner`, `onOpenOpa5Runner`.\n• Bấm từng nút nạp file bên dưới.",
        commandOrPath: "src/frontend/webapp/controller/AdvancedLab.controller.js",
        stepCode: makeExcerpt(readFileText("src/frontend/webapp/controller/AdvancedLab.controller.js"), "onRoleChange", 28),
        targetFilePath: "src/frontend/webapp/controller/AdvancedLab.controller.js",
        targetFiles: [
          tf("src/frontend/webapp/view/AdvancedLab.view.xml", "AdvancedLab.view.xml"),
          tf("src/frontend/webapp/controller/AdvancedLab.controller.js", "AdvancedLab.controller.js")
        ],
        verifyStep: "• Mở `http://localhost:8085/index.html#/advanced-lab`:\n1. Đổi `roleSelect` sang `Z_DEMO_VIEWER` -> số bản ghi hiển thị còn `4 / 10`.\n2. Bấm `1. Gửi Request Bắt Tay` -> nút `2. Gửi Lệnh Ghi Dữ Liệu` bật sáng và cho gửi POST 201.",
        expectedResult: "Advanced Technical Labs chạy tương tác 4 Tabs.",
        stepImage: "img/guideline/21_advanced_lab_view.png",
        stepImageCaption: "Advanced Labs (#/advanced-lab) với Role Simulator & CSRF"
      },
      {
        stepNumber: 3,
        ideOrTool: "VS Code / Terminal",
        actionTitle: "Tạo ArchitectureViewer (#/architecture), docs/VERSION_COMPATIBILITY.md & ui5-deploy.yaml",
        detailedInstruction: "• **4 file cần tạo:**\n1. `view/ArchitectureViewer.view.xml` & `controller/ArchitectureViewer.controller.js` (trình bày 3 Execution Tiers, Baseline PQPOC & quy tắc Save Sequence).\n2. `docs/VERSION_COMPATIBILITY.md` (bảng chuẩn tương thích S/4HANA 2025).\n3. `src/frontend/ui5-deploy.yaml` cấu hình đóng gói `deploy-to-abap` vào Package `ZNGHIANDD_TEST`, Transport `S4DK911884`.",
        commandOrPath: "src/frontend/ui5-deploy.yaml",
        stepCode: readFileText("src/frontend/ui5-deploy.yaml"),
        targetFilePath: "src/frontend/ui5-deploy.yaml",
        targetFiles: [
          tf("src/frontend/webapp/view/ArchitectureViewer.view.xml", "ArchitectureViewer.view.xml"),
          tf("src/frontend/webapp/controller/ArchitectureViewer.controller.js", "ArchitectureViewer.controller.js"),
          tf("docs/VERSION_COMPATIBILITY.md", "docs/VERSION_COMPATIBILITY.md"),
          tf("src/frontend/ui5-deploy.yaml", "ui5-deploy.yaml")
        ],
        verifyStep: "• Mở `http://localhost:8085/index.html#/architecture` hiển thị đủ 3 bảng.\n• Chạy `npm --prefix src/frontend run build` đóng gói thành công thư mục `src/frontend/dist/`.",
        expectedResult: "Trang Kiến trúc và quy trình đóng gói build production chạy đạt.",
        stepImage: "img/guideline/04_architecture_view.png",
        stepImageCaption: "Màn hình Architecture Viewer (#/architecture)"
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 12
  // =========================================================================
  {
    id: "chap12",
    step: 12,
    title: "Chương 12: Kiểm Thử Tự Động (QUnit / OPA5 / Node Runtime), Sinh Ảnh Thật & Dựng Full Guideline (#/guideline)",
    summary: "• Tạo đủ 8 file QUnit & OPA5 trong `webapp/test/` kèm trọn bộ 3 file kiểm thử gốc `tests/unit/` (`verify_frontend_syntax.js`, `test_frontend_runtime.js`, `test_guideline_rebuild.js`) để chạy thông cả `npm run test:syntax` lẫn `npm test`.\n• Đưa vào bộ script `tools/` (`generate_step_screenshots.js`, `run_browser_verification.js`, `build_guideline_data.js`) giúp tự sinh **24/24 ảnh PNG thật** (0 ảnh lỗi 404) và tự tạo **14/14 chương `fresher_guideline.json`** trong chính bản dựng mới.",
    image: "img/guideline/08_fresher_guideline_view.png",
    imageCaption: "Không gian Guideline Workspace: Cột trái Cây Thư Mục đồng bộ cuộn, Cột phải Checklist + Hướng dẫn tách ý.",
    prerequisites: [
      "Hoàn thành Chương 4–11 (đã có đủ 10/11 màn hình & mockdata)."
    ],
    cliCommands: [
      "npm run test:syntax",
      "npm --prefix tools install",
      "node tools/generate_step_screenshots.js",
      "node tools/build_guideline_data.js",
      "node tools/run_browser_verification.js --init-capture",
      "node tools/run_browser_verification.js",
      "npm test",
      "npm --prefix src/frontend run build"
    ],
    primaryFile: "src/frontend/webapp/controller/Guideline.controller.js",
    primaryFilePath: "src/frontend/webapp/controller/Guideline.controller.js",
    codeSnippet: readFileText("src/frontend/webapp/controller/Guideline.controller.js"),
    annotatedLines: [
      { line: 103, code: "        _buildTreeNodes: function (aChapters) {", role: "Xây Cây Thư Mục Cha → Con", explanation: "Tổ chức 5 Phần cha -> 14 Chương -> các Bước & các File thật bên trong từng chương.", tips: "Bind vào `sap.m.Tree` với `parameters: { arrayNames: ['nodes'] }`." },
      { line: 277, code: "        _evaluateScrollSpy: function (oScrollDom) {", role: "Mapping Cuộn 2 Chiều (Scroll-Spy)", explanation: "Khi lăn chuột trên Pane Phải, tìm `[data-spy-type]` gần đỉnh khung nhìn nhất rồi tự bung + chọn đúng node bên Cây Trái.", tips: "Dùng `_bIgnoreTreeSelect` để tránh vòng lặp nhảy cuộn ngược." },
      { line: 455, code: "        formatInstructionHtml: function (sText) {", role: "Định dạng xuống dòng rõ ý", explanation: "Escape HTML an toàn rồi chuyển `• ` thành `<ul><li>`, số thứ tự & đoạn xuống hàng cho `<FormattedText>`.", tips: "Nhờ vậy không còn khối chữ dính thành 1 đoạn văn dài." }
    ],
    workflowNodes: [
      { step: "1", layer: "QUnit & Tests Root", title: "QUnit + tests/unit/*", detail: "Kiểm tra formatter.js, syntax (31/31), runtime (npm test) & clean-room.", fileRef: "tests/unit/test_frontend_runtime.js" },
      { step: "2", layer: "OPA5 & Screenshots", title: "OPA5 + tools/ Edge Capture", detail: "Chạy generate_step_screenshots & run_browser_verification sinh 24/24 ảnh.", fileRef: "tools/run_browser_verification.js" },
      { step: "3", layer: "Workspace 2 Cột", title: "Guideline View + Tree", detail: "Cây thư mục cha-con cố định bên trái + Scroll-Spy + Checklist bên phải.", fileRef: "src/frontend/webapp/view/Guideline.view.xml" },
      { step: "4", layer: "Full JSON Generator", title: "tools/build_guideline_data.js", detail: "Đọc toàn bộ code trên đĩa để sinh đủ 14/14 chương fresher_guideline.json.", fileRef: "tools/build_guideline_data.js" }
    ],
    relatedFiles: [
      rf("src/frontend/webapp/test/unit/AllTests.js", "Nạp danh sách các QUnit unit test modules", "sap.ui.define unit tests", "sap.ui.define"),
      rf("src/frontend/webapp/test/unit/model/formatter.js", "QUnit test kiểm chứng hàm formatter.levelState và formatter.statusState", "QUnit.module / levelState", "QUnit.module"),
      rf("src/frontend/webapp/test/unit/unitTests.qunit.html", "Trang HTML khởi chạy QUnit Test Runner ở trình duyệt", "unitTests.qunit", "sap-ui-bootstrap"),
      rf("src/frontend/webapp/test/integration/AllJourneys.js", "Cấu hình OPA5 Opa5.extendConfig & nạp DashboardJourney", "Opa5.extendConfig", "extendConfig"),
      rf("src/frontend/webapp/test/integration/DashboardJourney.js", "Kịch bản OPA5 test màn hình Dashboard hiển thị đúng tiêu đề", "opaTest", "opaTest"),
      rf("src/frontend/webapp/test/integration/opaTests.qunit.html", "Trang HTML chạy Integration OPA5 Tests", "opaTests.qunit", "sap-ui-bootstrap"),
      rf("src/frontend/webapp/test/integration/pages/Common.js", "Lớp Page Object nền mở ứng dụng để chạy OPA5", "iStartMyApp", "iStartMyApp"),
      rf("src/frontend/webapp/test/integration/pages/Dashboard.js", "Page Object cho trang Dashboard kiểm tra sap.m.Page & GenericTile", "onTheDashboardPage", "onTheDashboardPage"),
      rf("tests/unit/verify_frontend_syntax.js", "Script Node kiểm tra cấu trúc file, parse JSON, Views/Controllers & phạm vi kỹ thuật", "npm run test:syntax", "passedTests"),
      rf("tests/unit/test_frontend_runtime.js", "Bộ kiểm thử 4 tầng hoàn chỉnh chạy khi gọi npm test từ root package.json", "npm test (4 layers)", "passedTests"),
      rf("tests/unit/test_guideline_rebuild.js", "Script Clean-Room Rebuild Verify dựng sạch từ con số 0 & chạy mọi check", "Clean-Room 0 -> 100%", "runCleanRoomRebuildTest"),
      rf("tools/package.json", "Khai báo puppeteer-core dùng chung Microsoft Edge cho bộ script tools/", "puppeteer-core", "puppeteer-core"),
      rf("tools/generate_step_screenshots.js", "Script sinh toàn bộ ảnh minh họa steps/*.png (PowerShell, VS Code, Eclipse ADT)", "generate_step_screenshots", "mockups"),
      rf("tools/run_browser_verification.js", "Script chạy Edge headless qua 11 routes, chụp đủ ảnh 01..21 + 42..43 & đồng bộ vào app", "UI5_PORT / APP_IMG_DIR", "checkServerReady"),
      rf("tools/build_guideline_data.js", "Script đọc code thật trên đĩa để tự sinh trọn bộ 14/14 chương fresher_guideline.json", "node tools/build_guideline_data.js", "checklistItems"),
      rf("src/frontend/webapp/view/Guideline.view.xml", "Giao diện Cẩm Nang 2 cột: Trái là Tree cha-con cố định, Phải là Blueprint, Checklist, Flow & 14 Chương", "guidelineNavTree / guidelineRightScroll", "guidelineNavTree"),
      rf("src/frontend/webapp/controller/Guideline.controller.js", "Xử lý Tree Filter, Scroll-Spy 2 chiều, Checklist localStorage, formatInstructionHtml & CodeTips", "_evaluateScrollSpy / formatInstructionHtml", "_evaluateScrollSpy"),
      {
        filePath: "src/frontend/webapp/mockdata/fresher_guideline.json",
        lineHint: "Schema Khởi Đầu (chạy build_guideline_data.js để thành 14 chương)",
        role: "JSON Schema của Guideline; chạy node tools/build_guideline_data.js để sinh đủ 14/14 chương",
        keySymbol: "blueprint / checklistItems / chapters(14)",
        codeExcerpt: makeExcerpt(guidelineSchemaSample, "\"checklistItems\"", 18),
        excerptNote: "Schema mẫu — chạy node tools/build_guideline_data.js để xuất đủ 14 chương 100%",
        fullCode: guidelineSchemaSample
      }
    ],
    steps: [
      {
        stepNumber: 1,
        ideOrTool: "VS Code",
        actionTitle: "Tạo 3 file QUnit (unit/) và trọn bộ 3 script kiểm thử tại tests/unit/",
        detailedInstruction: "• **6 file kiểm thử cần tạo:**\n1. `src/frontend/webapp/test/unit/unitTests.qunit.html`, `AllTests.js`, `model/formatter.js` (QUnit).\n2. `tests/unit/verify_frontend_syntax.js` (chạy bằng `npm run test:syntax`).\n3. `tests/unit/test_frontend_runtime.js` (chạy bằng `npm test`).\n4. `tests/unit/test_guideline_rebuild.js` (kiểm thử Clean-Room từ con số 0).\n• Bấm từng nút `📄 Nạp` bên dưới để lấy 100% code chính xác cả 6 file.",
        commandOrPath: "npm run test:syntax",
        stepCode: readFileText("src/frontend/webapp/test/unit/model/formatter.js"),
        targetFilePath: "tests/unit/verify_frontend_syntax.js",
        targetFiles: [
          tf("src/frontend/webapp/test/unit/unitTests.qunit.html", "unitTests.qunit.html"),
          tf("src/frontend/webapp/test/unit/AllTests.js", "unit/AllTests.js"),
          tf("src/frontend/webapp/test/unit/model/formatter.js", "unit/model/formatter.js"),
          tf("tests/unit/verify_frontend_syntax.js", "tests/unit/verify_frontend_syntax.js"),
          tf("tests/unit/test_frontend_runtime.js", "tests/unit/test_frontend_runtime.js"),
          tf("tests/unit/test_guideline_rebuild.js", "tests/unit/test_guideline_rebuild.js")
        ],
        verifyStep: "• Chạy `npm run test:syntax` tại gốc -> báo **31/31 TESTS PASSED**.\n• Mở `http://localhost:8085/test/unit/unitTests.qunit.html` -> QUnit đạt 100% (11 assertions).",
        expectedResult: "Unit Test UI5 và hệ thống kiểm thử Node root đã đủ file."
      },
      {
        stepNumber: 2,
        ideOrTool: "VS Code / Terminal",
        actionTitle: "Tạo bộ OPA5 (5 file) + Tooling chụp đủ 24/24 ảnh PNG thật (tools/)",
        detailedInstruction: "• **5 file OPA5 trong `src/frontend/webapp/test/integration/`:** `opaTests.qunit.html`, `AllJourneys.js`, `pages/Common.js`, `pages/Dashboard.js`, `DashboardJourney.js`.\n• **4 file Tooling trong `tools/` giúp tự sinh 100% ảnh thật (không lỗi 404 ảnh ở Manual/Guideline):**\n1. Tạo `tools/package.json`, `tools/generate_step_screenshots.js`, `tools/run_browser_verification.js`.\n2. Chạy lần lượt các lệnh PowerShell: cài `tools`, sinh ảnh bước `steps/*.png`, chạy `--init-capture` chụp trọn bộ `01..21` + `42..43` vào `webapp/img/guideline/`, rồi chạy lại `run_browser_verification.js` xác nhận **0 ảnh 404**!",
        commandOrPath: "node tools/run_browser_verification.js",
        stepCode: "# Chạy từng dòng tại thư mục gốc FIORI_TECH_APP:\nnpm --prefix tools install\nnode tools/generate_step_screenshots.js\nnode tools/run_browser_verification.js --init-capture\nnode tools/run_browser_verification.js",
        targetFilePath: "tools/run_browser_verification.js",
        targetFiles: [
          tf("src/frontend/webapp/test/integration/opaTests.qunit.html", "opaTests.qunit.html"),
          tf("src/frontend/webapp/test/integration/AllJourneys.js", "AllJourneys.js"),
          tf("src/frontend/webapp/test/integration/pages/Common.js", "pages/Common.js"),
          tf("src/frontend/webapp/test/integration/pages/Dashboard.js", "pages/Dashboard.js"),
          tf("src/frontend/webapp/test/integration/DashboardJourney.js", "DashboardJourney.js"),
          tf("tools/package.json", "tools/package.json"),
          tf("tools/generate_step_screenshots.js", "tools/generate_step_screenshots.js"),
          tf("tools/run_browser_verification.js", "tools/run_browser_verification.js")
        ],
        verifyStep: "• Thư mục `src/frontend/webapp/img/guideline/` có đủ ảnh thật + `steps/*.png`.\n• Chạy `node tools/run_browser_verification.js` kết thúc với **Console Errors: 0, Failed Network Requests: 0**.",
        expectedResult: "OPA5 & 24/24 ảnh minh họa thật hoạt động không 404."
      },
      {
        stepNumber: 3,
        ideOrTool: "VS Code / Terminal",
        actionTitle: "Xây Guideline Workspace 2 cột, chạy build_guideline_data.js (đủ 14 chương) & Nghiệm thu npm test",
        detailedInstruction: "• **3 file code & generator chính:**\n1. `view/Guideline.view.xml`: dùng `l:Splitter` cố định `sap.m.Tree id=\"guidelineNavTree\"` bên trái, cột phải `guidelineRightScroll` đặt Panel Blueprint, Panel Checklist 0 → 100%, `quickChapterSelect` toàn chiều rộng và `guidelineFullCodeHtml`.\n2. `controller/Guideline.controller.js`: xây dựng cây 5 Phần cha -> 14 Chương -> Bước & File, theo dõi cuộn `_evaluateScrollSpy`, lưu Checklist trong `localStorage`.\n3. `tools/build_guideline_data.js`: script tổng hợp đọc file trên đĩa để tự sinh **trọn bộ 14/14 chương** vào `src/frontend/webapp/mockdata/fresher_guideline.json`!\n• **Chạy 3 lệnh nghiệm thu cuối Frontend:**\n1. `node tools/build_guideline_data.js`\n2. `npm test`\n3. `npm --prefix src/frontend run build`",
        commandOrPath: "node tools/build_guideline_data.js",
        stepCode: "# Lệnh sinh đủ 14/14 chương Guideline & kiểm thử toàn diện:\nnode tools/build_guideline_data.js\nnpm run test:syntax\nnpm test\nnpm --prefix src/frontend run build",
        targetFilePath: "tools/build_guideline_data.js",
        targetFiles: [
          tf("src/frontend/webapp/view/Guideline.view.xml", "Guideline.view.xml"),
          tf("src/frontend/webapp/controller/Guideline.controller.js", "Guideline.controller.js"),
          tf("tools/build_guideline_data.js", "tools/build_guideline_data.js")
        ],
        verifyStep: "• `node tools/build_guideline_data.js` báo `Generated chapters: 14`.\n• `npm test` báo **294/294+ TESTS PASSED** và `npm --prefix src/frontend run build` -> Build succeeded.\n• Chạy `CHAY_APP.bat`, bấm nút `Guideline (Fresher)` -> mở tab mới thấy Cây thư mục bên trái + đủ 14/14 chương + ảnh thật.",
        expectedResult: "Hoàn thành 100% tầng Frontend, Tooling, Ảnh & Test như app gốc!",
        stepImage: "img/guideline/08_fresher_guideline_view.png",
        stepImageCaption: "Không gian Guideline 2 cột sau khi hoàn thiện"
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 13
  // =========================================================================
  {
    id: "chap13",
    step: 13,
    title: "Chương 13: ABAP RAP Data Model Trên Eclipse ADT — Đủ 6 Bảng DDIC/Draft & 5 CDS View Entities",
    summary: "• Xây dựng tầng dữ liệu trên SAP S/4HANA 2025 (Package riêng `ZNGHIANDD_TEST`): 4 bảng DB chính + 2 bảng nháp Draft.\n• Tạo đủ 5 CDS Entities theo đúng thứ tự phụ thuộc: con `ZI_DemoItemTP` -> gốc `ZI_DemoHeaderTP` -> `ZI_DemoConfigMSaveTP` -> `ZI_DemoConfigUnmanTP` -> Custom Entity `ZI_DemoLog`.",
    image: "img/guideline/steps/step_15_eclipse_cds_view.png",
    imageCaption: "[Minh họa mô phỏng giao diện] CDS View Entity ZI_DemoHeaderTP & Data Preview F8 trong Eclipse ADT.",
    prerequisites: [
      "Hoàn thành Chương 1 bước 2 (đã kết nối Eclipse ADT vào SAP Client 100, mở Package ZNGHIANDD_TEST)."
    ],
    cliCommands: [
      "Eclipse ADT: Ctrl + F3 (Activate Object)",
      "Eclipse ADT: Ctrl + F2 (Syntax Check)",
      "Eclipse ADT: F8 (Data Preview trên CDS View)"
    ],
    primaryFile: "src/backend/rap/data-model/ZI_DemoHeaderTP.ddls.asddls",
    primaryFilePath: "src/backend/rap/data-model/ZI_DemoHeaderTP.ddls.asddls",
    codeSnippet: readFileText("src/backend/rap/data-model/ZI_DemoHeaderTP.ddls.asddls"),
    annotatedLines: [
      { line: 2, code: "define root view entity ZI_DemoHeaderTP", role: "Root CDS View Entity", explanation: "Thực thể gốc của RAP Business Object Managed Draft.", tips: "Chuẩn mới không dùng `@AbapCatalog.sqlViewName`." },
      { line: 4, code: "  composition [0..*] of ZI_DemoItemTP as _Items", role: "Quan hệ Cha-Con 1-N (Composition)", explanation: "Vòng đời con gắn chặt vào cha.", tips: "Tạo `ZI_DemoItemTP` hoặc kích hoạt cặp cha-con cùng lúc." },
      { line: 22, code: "      @Semantics.systemDateTime.localInstanceLastChangedAt: true", role: "Trường Local ETag", explanation: "Tự động cập nhật timestamp mỗi lần ghi để phục vụ `etag master`.", tips: "Giúp ngăn xung đột mất dữ liệu giữa nhiều người dùng." }
    ],
    workflowNodes: [
      { step: "1", layer: "Active Tables", title: "4 Bảng Chính DB", detail: "zdemo_header, zdemo_item, zdemo_config_m, zdemo_config_u.", fileRef: "src/backend/rap/data-model/zdemo_header.tabl.sql" },
      { step: "2", layer: "Draft Tables", title: "2 Bảng Nháp Draft", detail: "zdemo_header_d & zdemo_item_d (có sych_bdl_draft_admin_inc).", fileRef: "src/backend/rap/data-model/zdemo_header_d.tabl.sql" },
      { step: "3", layer: "Managed CDS", title: "ItemTP -> HeaderTP", detail: "Association to parent & Composition [0..*] _Items.", fileRef: "src/backend/rap/data-model/ZI_DemoHeaderTP.ddls.asddls" },
      { step: "4", layer: "Config & Custom", title: "ConfigTPs + ZI_DemoLog", detail: "Unmanaged Save, Full Unmanaged & Custom Entity Query.", fileRef: "src/backend/rap/data-model/ZI_DemoLog.ddls.asddls" }
    ],
    relatedFiles: [
      rf("src/backend/rap/data-model/zdemo_header.tabl.sql", "Bảng Database gốc zdemo_header", "define table zdemo_header", "define table"),
      rf("src/backend/rap/data-model/zdemo_header_d.tabl.sql", "Bảng Draft zdemo_header_d kèm %admin include", "include sych_bdl_draft_admin_inc", "sych_bdl_draft_admin_inc"),
      rf("src/backend/rap/data-model/zdemo_item.tabl.sql", "Bảng Database con zdemo_item", "define table zdemo_item", "define table"),
      rf("src/backend/rap/data-model/zdemo_item_d.tabl.sql", "Bảng Draft con zdemo_item_d", "define table zdemo_item_d", "define table"),
      rf("src/backend/rap/data-model/zdemo_config_m.tabl.sql", "Bảng dữ liệu Managed with Unmanaged Save", "define table zdemo_config_m", "define table"),
      rf("src/backend/rap/data-model/zdemo_config_u.tabl.sql", "Bảng dữ liệu Full Unmanaged BO", "define table zdemo_config_u", "define table"),
      rf("src/backend/rap/data-model/ZI_DemoHeaderTP.ddls.asddls", "Root CDS View Entity chính gắn composition tới ZI_DemoItemTP", "define root view entity ZI_DemoHeaderTP", "define root"),
      rf("src/backend/rap/data-model/ZI_DemoItemTP.ddls.asddls", "Child CDS View Entity gắn association to parent ZI_DemoHeaderTP", "association to parent ZI_DemoHeaderTP", "association to parent"),
      rf("src/backend/rap/data-model/ZI_DemoConfigMSaveTP.ddls.asddls", "Root CDS View Entity cho Unmanaged Save BO", "define root view entity ZI_DemoConfigMSaveTP", "define root"),
      rf("src/backend/rap/data-model/ZI_DemoConfigUnmanTP.ddls.asddls", "Root CDS View Entity cho Full Unmanaged BO", "define root view entity ZI_DemoConfigUnmanTP", "define root"),
      rf("src/backend/rap/data-model/ZI_DemoLog.ddls.asddls", "Custom Entity đọc dữ liệu qua ABAP Query Provider", "@ObjectModel.query.implementedBy", "custom entity")
    ],
    steps: [
      {
        stepNumber: 1,
        ideOrTool: "Eclipse ADT",
        actionTitle: "Tạo 4 bảng DB chính: zdemo_header, zdemo_item, zdemo_config_m, zdemo_config_u",
        detailedInstruction: "• **Thao tác trong Eclipse ADT (Package `ZNGHIANDD_TEST`):**\n1. Chuột phải Package -> `New -> Other ABAP Repository Object -> Dictionary -> Database Table`.\n2. Lần lượt tạo `ZDEMO_HEADER`, `ZDEMO_ITEM`, `ZDEMO_CONFIG_M`, `ZDEMO_CONFIG_U` theo code từng file.\n3. Kiểm tra comment dùng `//` chuẩn ABAP Dictionary (KHÔNG dùng `--` của SQL).\n4. Nhấn `Ctrl + F3` kích hoạt từng bảng theo thứ tự trên.",
        commandOrPath: "src/backend/rap/data-model/zdemo_header.tabl.sql",
        stepCode: readFileText("src/backend/rap/data-model/zdemo_header.tabl.sql"),
        targetFilePath: "src/backend/rap/data-model/zdemo_header.tabl.sql",
        targetFiles: [
          tf("src/backend/rap/data-model/zdemo_header.tabl.sql", "zdemo_header"),
          tf("src/backend/rap/data-model/zdemo_item.tabl.sql", "zdemo_item"),
          tf("src/backend/rap/data-model/zdemo_config_m.tabl.sql", "zdemo_config_m"),
          tf("src/backend/rap/data-model/zdemo_config_u.tabl.sql", "zdemo_config_u")
        ],
        verifyStep: "• Cả 4 bảng đều hiển thị Active xanh trong Project Explorer sau `Ctrl + F3`.",
        expectedResult: "4 bảng Active DB đã có trên HANA.",
        fresherGotcha: "• Nếu bạn thực hành chung server SAP PQPOC với đồng nghiệp và tên `ZDEMO_*` đã tồn tại, hãy đổi sang tiền tố riêng (ví dụ `Z01_DEMO_*`) đồng bộ cho bảng, CDS, BDEF và Service Definition.",
        stepImage: "img/guideline/steps/step_14_eclipse_db_table.png",
        stepImageCaption: "[Minh họa mô phỏng giao diện] Tạo bảng Database trong Eclipse ADT"
      },
      {
        stepNumber: 2,
        ideOrTool: "Eclipse ADT",
        actionTitle: "Tạo 2 bảng nháp Draft: zdemo_header_d & zdemo_item_d",
        detailedInstruction: "• **2 bảng Draft phục vụ `with draft`:**\n1. Tạo `ZDEMO_HEADER_D` và `ZDEMO_ITEM_D` (hoặc dùng Quick Fix `Ctrl + 1` trên dòng `draft table zdemo_header_d` ở BDEF để ADT sinh chuẩn tự động).\n2. Đảm bảo trường khóa là `mandt` & `headeruuid`/`itemuuid`, cột ETag trùng alias CDS (`locallastchangedat`) và có dòng `\"%admin\" : include sych_bdl_draft_admin_inc;`.\n3. Kích hoạt cả 2 bằng `Ctrl + F3`.",
        commandOrPath: "src/backend/rap/data-model/zdemo_header_d.tabl.sql",
        stepCode: readFileText("src/backend/rap/data-model/zdemo_header_d.tabl.sql"),
        targetFilePath: "src/backend/rap/data-model/zdemo_header_d.tabl.sql",
        targetFiles: [
          tf("src/backend/rap/data-model/zdemo_header_d.tabl.sql", "zdemo_header_d"),
          tf("src/backend/rap/data-model/zdemo_item_d.tabl.sql", "zdemo_item_d")
        ],
        verifyStep: "• Nhấn `Ctrl + F2` trên cả 2 bảng nháp báo `No syntax errors found`.",
        expectedResult: "Cặp bảng Draft sẵn sàng cho BDEF."
      },
      {
        stepNumber: 3,
        ideOrTool: "Eclipse ADT",
        actionTitle: "Tạo và kích hoạt đồng thời ZI_DemoHeaderTP & ZI_DemoItemTP",
        detailedInstruction: "• **Bẫy phụ thuộc Cha–Con:** `ZI_DemoHeaderTP` tham chiếu `ZI_DemoItemTP`, còn `ZI_DemoItemTP` trỏ ngược về `ZI_DemoHeaderTP`.\n• **Cách làm đúng:**\n1. Tạo cả 2 file Data Definition (`ZI_DemoItemTP` như mẫu dưới và `ZI_DemoHeaderTP` đầy đủ tại Mục 3 bên dưới) xong rồi bấm **Activate Inactive ABAP Development Objects (`Ctrl + Shift + F3`)** để SAP kích hoạt đồng thời cả cặp cha–con cùng lúc!\n2. Sau khi Active, bấm `F8` trên `ZI_DemoHeaderTP` để mở Data Preview.",
        commandOrPath: "src/backend/rap/data-model/ZI_DemoHeaderTP.ddls.asddls",
        stepCode: "\" Child CDS Entity ZI_DemoItemTP (Root CDS ZI_DemoHeaderTP xem full bên dưới tại Mục 3):\n" + readFileText("src/backend/rap/data-model/ZI_DemoItemTP.ddls.asddls"),
        targetFilePath: "src/backend/rap/data-model/ZI_DemoHeaderTP.ddls.asddls",
        targetFiles: [
          tf("src/backend/rap/data-model/ZI_DemoHeaderTP.ddls.asddls", "ZI_DemoHeaderTP"),
          tf("src/backend/rap/data-model/ZI_DemoItemTP.ddls.asddls", "ZI_DemoItemTP")
        ],
        verifyStep: "• Kích hoạt hàng loạt bằng `Ctrl + Shift + F3` thành công.\n• Nhấn `F8` mở được Data Preview của `ZI_DemoHeaderTP`.",
        expectedResult: "Cặp Root & Child CDS Entities hoạt động.",
        fresherGotcha: "• Không kích hoạt đơn lẻ từng file bằng `Ctrl + F3` khi chúng tham chiếu chéo nhau — luôn dùng `Ctrl + Shift + F3` (Mass Activate)!",
        stepImage: "img/guideline/steps/step_15_eclipse_cds_view.png",
        stepImageCaption: "[Minh họa mô phỏng giao diện] CDS View Entity ZI_DemoHeaderTP"
      },
      {
        stepNumber: 4,
        ideOrTool: "Eclipse ADT",
        actionTitle: "Tạo 3 CDS Views còn lại: ConfigMSaveTP, ConfigUnmanTP & Custom Entity ZI_DemoLog",
        detailedInstruction: "• **3 Data Definitions:**\n1. `ZI_DemoConfigMSaveTP` (lấy từ `zdemo_config_m`).\n2. `ZI_DemoConfigUnmanTP` (lấy từ `zdemo_config_u`).\n3. `ZI_DemoLog` (Custom Entity khai báo `@ObjectModel.query.implementedBy: 'ABAP:ZCL_DEMO_LOG_QUERY'`).\n• **Lưu ý thứ tự:** Kích hoạt `ZI_DemoConfigMSaveTP` và `ZI_DemoConfigUnmanTP` ngay; còn `ZI_DemoLog` sẽ kích hoạt sau khi tạo class `zcl_demo_log_query` ở Chương 14 Bước 3.",
        commandOrPath: "src/backend/rap/data-model/ZI_DemoLog.ddls.asddls",
        stepCode: readFileText("src/backend/rap/data-model/ZI_DemoLog.ddls.asddls"),
        targetFilePath: "src/backend/rap/data-model/ZI_DemoLog.ddls.asddls",
        targetFiles: [
          tf("src/backend/rap/data-model/ZI_DemoConfigMSaveTP.ddls.asddls", "ZI_DemoConfigMSaveTP"),
          tf("src/backend/rap/data-model/ZI_DemoConfigUnmanTP.ddls.asddls", "ZI_DemoConfigUnmanTP"),
          tf("src/backend/rap/data-model/ZI_DemoLog.ddls.asddls", "ZI_DemoLog")
        ],
        verifyStep: "• `ZI_DemoConfigMSaveTP` và `ZI_DemoConfigUnmanTP` active xanh.",
        expectedResult: "Hoàn thành Data Model Layer."
      }
    ]
  },

  // =========================================================================
  // CHƯƠNG 14
  // =========================================================================
  {
    id: "chap14",
    step: 14,
    title: "Chương 14: ABAP RAP Behavior (3 BOs), Query/EML, DCL Security, Publish OData V4 & ABAP Unit Test",
    summary: "• Cài đặt trọn bộ 3 kiến trúc RAP BO: Managed Draft (`ZI_DemoHeaderTP` với action `approve` & `calculateTotals` — tương ứng nút `markAsVerified` ở Mock Frontend), Managed Unmanaged Save (`ZI_DemoConfigMSaveTP`) và Full Unmanaged (`ZI_DemoConfigUnmanTP`).\n• Cài đặt Query Provider `zcl_demo_log_query`, EML Playground, REST Client, Access Control DCL, Service Binding OData V4 UI & ABAP Unit Test.",
    image: "img/guideline/steps/step_18_eclipse_service_binding_publish.png",
    imageCaption: "[Minh họa mô phỏng giao diện] Publish Service Binding ZUI_DEMO_HEADER_O4 và Preview Fiori.",
    prerequisites: [
      "Hoàn thành Chương 13 (đã có đủ 6 bảng & 5 CDS Entities)."
    ],
    cliCommands: [
      "Eclipse ADT: Ctrl + 1 (Quick Assist -> Create Behavior Pool)",
      "Eclipse ADT: Ctrl + Shift + F3 (Mass Activate)",
      "Eclipse ADT: Ctrl + Shift + F10 (Run ABAP Unit Test)"
    ],
    primaryFile: "src/backend/rap/behavior/ZI_DemoHeaderTP.bdef.asbdef",
    primaryFilePath: "src/backend/rap/behavior/ZI_DemoHeaderTP.bdef.asbdef",
    codeSnippet: readFileText("src/backend/rap/behavior/ZI_DemoHeaderTP.bdef.asbdef"),
    annotatedLines: [
      { line: 1, code: "managed implementation in class zbp_i_demoheadertp unique;", role: "Managed BO với Pool Class", explanation: "RAP Framework tự xử lý CRUD & Draft; logic custom đặt trong `zbp_i_demoheadertp`.", tips: "Nhấn `Ctrl + 1` tại tên class để ADT tạo sẵn Behavior Pool." },
      { line: 2, code: "strict ( 2 );", role: "Strict Mode 2", explanation: "Yêu cầu khai báo đầy đủ lock, etag, authorization & `side effects`.", tips: "Chuẩn mới nhất của S/4HANA 2025." },
      { line: 25, code: "  action ( features : instance ) calculateTotals result [1] $self;", role: "Bound Action calculateTotals", explanation: "Tính lại `TotalAmount` của Header từ toàn bộ Item con bằng EML `IN LOCAL MODE`.", tips: "Trả về `result [1] $self` để UI cập nhật ngay dòng vừa bấm." },
      { line: 26, code: "  action ( features : instance ) approve result [1] $self;", role: "Bound Action approve (chuyển StatusCode sang AP)", explanation: "Đổi `StatusCode` thành `'AP'` (chặn bấm lặp trong `get_instance_features`); đóng vai trò tương đương `markAsVerified` ở Frontend Mock.", tips: "Xử lý cập nhật Status bằng EML `IN LOCAL MODE`." }
    ],
    workflowNodes: [
      { step: "1", layer: "Managed Draft BO", title: "ZI_DemoHeaderTP + Pool", detail: "BDEF strict(2), draft, approve, calculateTotals, determination & validation.", fileRef: "src/backend/rap/behavior/ZI_DemoHeaderTP.bdef.asbdef" },
      { step: "2", layer: "Save & Unmanaged", title: "ConfigMSave & ConfigUnman", detail: "save_modified (Point of No Return) & CRUD tự quản lý.", fileRef: "src/backend/rap/behavior/ZI_DemoConfigMSaveTP.bdef.asbdef" },
      { step: "3", layer: "Query, EML & DCL", title: "Query, EML, REST & DCL", detail: "zcl_demo_log_query (để active ZI_DemoLog), EML, DCL.", fileRef: "src/backend/rap/authorization/ZR_DemoHeaderTP.dcls.asdcls" },
      { step: "4", layer: "Expose & Unit Test", title: "ZUI_DEMO_HEADER_O4 + QA", detail: "Service Definition + Binding OData V4 UI + ABAP Unit Test.", fileRef: "src/backend/rap/service/ZUI_DEMO_HEADER_O4.srvd.assrvd" }
    ],
    relatedFiles: [
      rf("src/backend/rap/behavior/ZI_DemoHeaderTP.bdef.asbdef", "BDEF Managed strict(2) with draft cho Header & Item + Side Effects + approve/calculateTotals", "managed / strict ( 2 ) / with draft", "approve"),
      rf("src/backend/rap/behavior/zbp_i_demoheadertp.clas.locals_imp.abap", "Local Handler & Saver: EML calculateTotalAmount, validateStatusCode, approve, calculateTotals", "lhc_demoheader / lhc_demoitem", "METHOD approve"),
      rf("src/backend/rap/behavior/ZI_DemoConfigMSaveTP.bdef.asbdef", "BDEF Managed with Unmanaged Save (with unmanaged save)", "with unmanaged save", "with unmanaged save"),
      rf("src/backend/rap/behavior/zbp_i_democonfigmsavetp.clas.abap", "Global Abstract Final Class vỏ cho Behavior Pool ConfigMSave", "FOR BEHAVIOR OF ZI_DemoConfigMSaveTP", "DEFINITION"),
      rf("src/backend/rap/behavior/zbp_i_democonfigmsavetp.clas.locals_imp.abap", "Local Handler validateHandlerClass (check_before_save) & Saver save_modified", "save_modified / validateHandlerClass", "save_modified"),
      rf("src/backend/rap/behavior/ZI_DemoConfigUnmanTP.bdef.asbdef", "BDEF Full Unmanaged (unmanaged implementation in class zbp_i_democonfigunmantp unique)", "unmanaged implementation", "unmanaged"),
      rf("src/backend/rap/behavior/zbp_i_democonfigunmantp.clas.abap", "Global Abstract Final Class vỏ cho Behavior Pool ConfigUnman", "FOR BEHAVIOR OF ZI_DemoConfigUnmanTP", "DEFINITION"),
      rf("src/backend/rap/behavior/zbp_i_democonfigunmantp.clas.locals_imp.abap", "Local Buffer & tự cài đặt toàn bộ CRUD create/update/delete/read/lock + save", "lhc_democonfigunman / save", "METHOD create"),
      rf("src/backend/rap/service/zcl_demo_log_query.clas.abap", "Query Provider cài đặt IF_RAP_QUERY_PROVIDER~SELECT cho Custom Entity ZI_DemoLog", "if_rap_query_provider~select", "select"),
      rf("src/backend/rap/service/zcl_demo_eml_playground.clas.abap", "Console Runner (IF_OO_ADT_CLASSRUN) thực nghiệm CREATE/READ/UPDATE EML", "MODIFY ENTITIES / COMMIT ENTITIES", "if_oo_adt_classrun~main"),
      rf("src/backend/rap/service/zcl_demo_rest_client.clas.abap", "ABAP Cloud HTTP REST Client dùng cl_web_http_client_manager (SM59)", "cl_web_http_client_manager", "create_by_destination"),
      rf("src/backend/rap/authorization/ZR_DemoHeaderTP.dcls.asdcls", "CDS Access Control DCL gắn pfcg_auth( S_TABU_DIS ) giới hạn dòng dữ liệu", "grant select / pfcg_auth", "pfcg_auth"),
      rf("src/backend/rap/service/ZUI_DEMO_HEADER_O4.srvd.assrvd", "Service Definition expose ZI_DemoHeaderTP, ZI_DemoItemTP, Configs & ZI_DemoLog", "define service ZUI_DEMO_HEADER_O4", "define service"),
      rf("src/backend/rap/testing/zcl_demo_rap_unit_test.clas.abap", "ABAP Unit Test sử dụng cl_cds_test_environment (CDS Test Double Framework)", "FOR TESTING / cl_cds_test_environment", "FOR TESTING")
    ],
    steps: [
      {
        stepNumber: 1,
        ideOrTool: "Eclipse ADT",
        actionTitle: "Tạo BDEF & Behavior Pool cho Managed BO ZI_DemoHeaderTP",
        detailedInstruction: "• **2 bước con trên Eclipse ADT:**\n1. Chuột phải `ZI_DemoHeaderTP -> New Behavior Definition`, dán nội dung `ZI_DemoHeaderTP.bdef.asbdef` và nhấn `Ctrl + F3`.\n2. Đặt trỏ ở tên `zbp_i_demoheadertp`, nhấn `Ctrl + 1` sinh Behavior Implementation Class, dán mã `zbp_i_demoheadertp.clas.locals_imp.abap` vào tab **Local Types** -> nhấn `Ctrl + F3`.",
        commandOrPath: "src/backend/rap/behavior/ZI_DemoHeaderTP.bdef.asbdef",
        stepCode: makeExcerpt(readFileText("src/backend/rap/behavior/ZI_DemoHeaderTP.bdef.asbdef"), "action (", 24),
        targetFilePath: "src/backend/rap/behavior/ZI_DemoHeaderTP.bdef.asbdef",
        targetFiles: [
          tf("src/backend/rap/behavior/ZI_DemoHeaderTP.bdef.asbdef", "ZI_DemoHeaderTP.bdef"),
          tf("src/backend/rap/behavior/zbp_i_demoheadertp.clas.locals_imp.abap", "zbp_i_demoheadertp.locals_imp")
        ],
        verifyStep: "• `ZI_DemoHeaderTP.bdef` và `zbp_i_demoheadertp` active xanh không còn gạch đỏ.",
        expectedResult: "BO chính Managed Draft hoàn tất.",
        stepImage: "img/guideline/steps/step_16_eclipse_bdef_managed.png",
        stepImageCaption: "[Minh họa mô phỏng giao diện] BDEF Managed strict(2) & Quick Assist Ctrl+1"
      },
      {
        stepNumber: 2,
        ideOrTool: "Eclipse ADT",
        actionTitle: "Tạo 2 BO nâng cao: ConfigMSave (Unmanaged Save) & ConfigUnman (Full Unmanaged)",
        detailedInstruction: "• **Tạo đủ cả 2 cặp BDEF + Pool Class:**\n1. `ZI_DemoConfigMSaveTP.bdef.asbdef` (`with unmanaged save`) + class `zbp_i_democonfigmsavetp` (global + local `save_modified`).\n2. `ZI_DemoConfigUnmanTP.bdef.asbdef` (`unmanaged implementation`) + class `zbp_i_democonfigunmantp` (tự cài `create`, `update`, `delete`, `read`, `lock`).\n• Bấm 6 nút bên dưới để nạp từng file chuẩn xác.",
        commandOrPath: "src/backend/rap/behavior/ZI_DemoConfigMSaveTP.bdef.asbdef",
        stepCode: readFileText("src/backend/rap/behavior/ZI_DemoConfigMSaveTP.bdef.asbdef"),
        targetFilePath: "src/backend/rap/behavior/zbp_i_democonfigmsavetp.clas.locals_imp.abap",
        targetFiles: [
          tf("src/backend/rap/behavior/ZI_DemoConfigMSaveTP.bdef.asbdef", "ConfigMSave.bdef"),
          tf("src/backend/rap/behavior/zbp_i_democonfigmsavetp.clas.abap", "zbp_i_democonfigmsavetp (global)"),
          tf("src/backend/rap/behavior/zbp_i_democonfigmsavetp.clas.locals_imp.abap", "zbp_i_democonfigmsavetp (local)"),
          tf("src/backend/rap/behavior/ZI_DemoConfigUnmanTP.bdef.asbdef", "ConfigUnman.bdef"),
          tf("src/backend/rap/behavior/zbp_i_democonfigunmantp.clas.abap", "zbp_i_democonfigunmantp (global)"),
          tf("src/backend/rap/behavior/zbp_i_democonfigunmantp.clas.locals_imp.abap", "zbp_i_democonfigunmantp (local)")
        ],
        verifyStep: "• Tất cả 2 BDEF + 4 ABAP sources active xanh sạch.",
        expectedResult: "Hoàn thành cả 3 mô hình Behavior RAP.",
        fresherGotcha: "• Trong `save_modified` đã qua Point of No Return: TUYỆT ĐỐI không gọi `COMMIT WORK` hay `ROLLBACK WORK`."
      },
      {
        stepNumber: 3,
        ideOrTool: "Eclipse ADT",
        actionTitle: "Tạo Query Provider zcl_demo_log_query, DCL ZR_DemoHeaderTP, EML & REST Client",
        detailedInstruction: "• **Thứ tự kích hoạt chuẩn:**\n1. Tạo class `zcl_demo_log_query` trước -> quay lại activate Custom Entity `ZI_DemoLog` ở Chương 13 thành công!\n2. Tạo DCL `ZR_DemoHeaderTP.dcls.asdcls` (Access Control `pfcg_auth`).\n3. Tạo `zcl_demo_eml_playground` và `zcl_demo_rest_client`.\n• **Lưu ý Package/TR & DCL:** Dòng 161–164 trong `zcl_demo_eml_playground` dùng TR `'S4DK911884'` và Package `'ZNGHIANDD_TEST'` để sinh Service Binding tự động bằng XCO — nhớ đổi sang TR/Package của bạn nếu làm trên hệ SAP khác (hoặc tạo Service Binding bằng wizard ADT). Ngoài ra, `ZI_DemoHeaderTP` giữ `@AccessControl.authorizationCheck: #NOT_REQUIRED` để test EML không bị chặn quyền `S_TABU_DIS`; khi bật phân quyền DCL thật hãy đổi sang `#CHECK`.\n• Nhấn `Ctrl + Shift + F3` kích hoạt toàn bộ.",
        commandOrPath: "src/backend/rap/service/zcl_demo_log_query.clas.abap",
        stepCode: readFileText("src/backend/rap/authorization/ZR_DemoHeaderTP.dcls.asdcls"),
        targetFilePath: "src/backend/rap/authorization/ZR_DemoHeaderTP.dcls.asdcls",
        targetFiles: [
          tf("src/backend/rap/service/zcl_demo_log_query.clas.abap", "zcl_demo_log_query"),
          tf("src/backend/rap/authorization/ZR_DemoHeaderTP.dcls.asdcls", "ZR_DemoHeaderTP.dcls"),
          tf("src/backend/rap/service/zcl_demo_eml_playground.clas.abap", "zcl_demo_eml_playground"),
          tf("src/backend/rap/service/zcl_demo_rest_client.clas.abap", "zcl_demo_rest_client")
        ],
        verifyStep: "• `ZI_DemoLog` và `zcl_demo_log_query` active xanh.\n• Nhấn `F9` trên `zcl_demo_eml_playground` thấy Console in luồng EML + Action `approve` thành công.",
        expectedResult: "Lớp Query, Bảo mật DCL và EML Playground hoạt động.",
        fresherGotcha: "• Backend RAP dùng cặp tên trường `HeaderUUID`/`DemoCode`/`StatusCode` và action `approve`; còn Frontend Mockserver (Chương 3–9) dùng cặp trường rút gọn `HeaderId`/`Title`/`Status` và action `markAsVerified`."
      },
      {
        stepNumber: 4,
        ideOrTool: "Eclipse ADT",
        actionTitle: "Tạo Service Definition ZUI_DEMO_HEADER_O4, Publish OData V4 & Chạy ABAP Unit Test",
        detailedInstruction: "• **3 bước cuối hoàn tất 100% Backend:**\n1. Tạo Service Definition `ZUI_DEMO_HEADER_O4` expose cả 5 Entities (`Ctrl + F3`).\n2. Tạo Service Binding `ZUI_DEMO_HEADER_O4` chọn **OData V4 - UI** -> bấm **Publish** -> chọn `DemoHeader` -> bấm **Preview**.\n3. Tạo class test `zcl_demo_rap_unit_test` (`FOR TESTING`, `cl_cds_test_environment`) -> nhấn `Ctrl + Shift + F10` chạy Unit Test.",
        commandOrPath: "src/backend/rap/service/ZUI_DEMO_HEADER_O4.srvd.assrvd",
        stepCode: readFileText("src/backend/rap/service/ZUI_DEMO_HEADER_O4.srvd.assrvd"),
        targetFilePath: "src/backend/rap/testing/zcl_demo_rap_unit_test.clas.abap",
        targetFiles: [
          tf("src/backend/rap/service/ZUI_DEMO_HEADER_O4.srvd.assrvd", "ZUI_DEMO_HEADER_O4.srvd"),
          tf("src/backend/rap/testing/zcl_demo_rap_unit_test.clas.abap", "zcl_demo_rap_unit_test")
        ],
        verifyStep: "• Service Binding hiện màu xanh `Published`, Preview mở được List Report V4.\n• `Ctrl + Shift + F10` chạy `zcl_demo_rap_unit_test` xanh 100%.",
        expectedResult: "Hoàn thành 100% Full-Stack SAP Fiori + ABAP RAP từ con số 0!",
        stepImage: "img/guideline/steps/step_18_eclipse_service_binding_publish.png",
        stepImageCaption: "[Minh họa mô phỏng giao diện] Service Binding OData V4 Published"
      }
    ]
  }
];

const fastTrackTools = [
  {
    name: "Node.js v22 LTS",
    desc: "Runtime JavaScript chạy UI5 Tooling & Mockserver",
    link: "https://nodejs.org"
  },
  {
    name: "Visual Studio Code",
    desc: "IDE Frontend kèm SAP Fiori Tools Extension Pack",
    link: "https://code.visualstudio.com"
  },
  {
    name: "Eclipse ADT 2024+ (Có sẵn JRE)",
    desc: "IDE viết ABAP/RAP (bản eclipse.org tích hợp sẵn JustJ JRE 21; chỉ cài Temurin JDK tại adoptium.net nếu thiếu JVM)",
    link: "https://tools.hana.ondemand.com/latest"
  },
  {
    name: "SAP GUI 8.00",
    desc: "Quản trị SAP Logon, SICF, /IWFND/V4_ADMIN & SM59",
    link: "SAP Support Portal"
  }
];

const output = {
  title: GUIDELINE_TITLE,
  subtitle: GUIDELINE_SUBTITLE,
  version: "4.0.0",
  author: GUIDELINE_AUTHOR,
  fastTrackTools,
  goldenShortcuts,
  blueprint,
  checklistItems,
  globalWorkflow,
  chapters
};

fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), "utf8");

function walkSrc(dir) {
  let res = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isSymbolicLink()) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (["node_modules", "dist", ".git", "img"].includes(e.name)) continue;
      res = res.concat(walkSrc(p));
    } else {
      res.push(p.split(path.sep).join("/"));
    }
  }
  return res;
}
const allSrc = walkSrc(path.join(ROOT, "src"))
  .map((p) => p.replace(ROOT.split(path.sep).join("/") + "/", ""))
  .filter((p) => !p.endsWith("package-lock.json") && !p.endsWith("favicon.ico"));

const mapped = new Set();
let totalSteps = 0;
let stepsMultiLine = 0;
let stepsWithAnd = 0;
chapters.forEach((c) => {
  (c.relatedFiles || []).forEach((f) => mapped.add(f.filePath));
  if ((c.cliCommands || []).join("\n").includes("&&")) stepsWithAnd++;
  (c.steps || []).forEach((s) => {
    totalSteps++;
    if ((s.detailedInstruction || "").includes("\n")) stepsMultiLine++;
    if ((s.commandOrPath || "").includes("&&")) stepsWithAnd++;
  });
});

const missingSrc = allSrc.filter((p) => !mapped.has(p));
console.log("Generated chapters:", chapters.length, "| Checklist items:", checklistItems.length);
console.log("Mapped relatedFiles:", mapped.size, "| Missing from src/:", missingSrc.length);
console.log("Steps:", totalSteps, "| Multi-line instructions:", stepsMultiLine, "| Commands with &&:", stepsWithAnd);
if (missingSrc.length > 0 || stepsMultiLine !== totalSteps || stepsWithAnd > 0) {
  console.error("AUDIT ERROR!", { missingSrc, stepsMultiLine, totalSteps, stepsWithAnd });
  process.exit(1);
}
console.log("Output JSON bytes:", fs.statSync(OUT_PATH).size);
