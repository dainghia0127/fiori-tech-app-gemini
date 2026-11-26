const fs = require('fs');
const filePath = 'src/frontend/webapp/mockdata/fresher_guideline.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const chapterSteps = {
  chap1: [
    {
      stepNumber: 1,
      actionTitle: "Tạo thư mục gốc cho dự án",
      detailedInstruction: "Mở PowerShell hoặc Command Prompt trên máy tính, di chuyển tới thư mục làm việc và chạy lệnh tạo thư mục dự án mới.",
      commandOrPath: "mkdir FIORI_TECH_APP; cd FIORI_TECH_APP",
      expectedResult: "Thư mục FIORI_TECH_APP được tạo và con trỏ terminal nằm trong thư mục này."
    },
    {
      stepNumber: 2,
      actionTitle: "Khởi tạo file cấu hình package.json",
      detailedInstruction: "Chạy lệnh npm init với cờ -y để tự động tạo file package.json chuẩn mà không cần nhập từng câu hỏi thủ công.",
      commandOrPath: "npm init -y",
      expectedResult: "File package.json xuất hiện trong thư mục với các trường name, version cơ bản."
    },
    {
      stepNumber: 3,
      actionTitle: "Cài đặt công cụ UI5 Tooling CLI và Mockserver",
      detailedInstruction: "Chạy lệnh npm install để tải về công cụ phát triển chính thức của SAP cho môi trường local.",
      commandOrPath: "npm install --save-dev @ui5/cli@^4.0.0 @sap-ux/ui5-middleware-fe-mockserver@^2.4.19",
      expectedResult: "Thư mục node_modules xuất hiện và các dependencies được ghi vào package.json."
    },
    {
      stepNumber: 4,
      actionTitle: "Tạo cấu trúc thư mục phân tầng cho ứng dụng",
      detailedInstruction: "Tạo cây thư mục src/frontend/webapp để chứa toàn bộ mã nguồn giao diện UI5.",
      commandOrPath: "mkdir -p src/frontend/webapp/controller src/frontend/webapp/view src/frontend/webapp/model",
      expectedResult: "Cấu trúc thư mục MVC chuẩn được sẵn sàng."
    },
    {
      stepNumber: 5,
      actionTitle: "Kiểm tra phiên bản UI5 CLI hoạt động",
      detailedInstruction: "Chạy lệnh kiểm tra phiên bản để đảm bảo UI5 Tooling đã sẵn sàng.",
      commandOrPath: "npx ui5 --version",
      expectedResult: "In ra màn hình phiên bản UI5 CLI (ví dụ: 4.0.x)."
    }
  ],
  chap2: [
    {
      stepNumber: 1,
      actionTitle: "Tạo file cấu hình máy chủ ui5.yaml",
      detailedInstruction: "Tại thư mục src/frontend, tạo một file mới có tên chính xác là ui5.yaml.",
      commandOrPath: "src/frontend/ui5.yaml",
      expectedResult: "File ui5.yaml được tạo thành công."
    },
    {
      stepNumber: 2,
      actionTitle: "Khai báo phiên bản SAPUI5 và các thư viện cần thiết",
      detailedInstruction: "Sao chép đoạn mã cấu hình ui5.yaml ở Mục 3 bên dưới, dán vào file. Chú ý khai báo các thư viện sap.m, sap.ui.core, sap.tnt, sap.fe.core.",
      commandOrPath: "framework.version: 1.136.0",
      expectedResult: "UI5 Tooling nhận diện được phiên bản SAPUI5 1.136.0 tương thích với S/4HANA 2025."
    },
    {
      stepNumber: 3,
      actionTitle: "Cấu hình Middleware Mockserver OData V4",
      detailedInstruction: "Thêm khối customMiddleware sap-fe-mockserver vào ui5.yaml để tự động giả lập API OData V4.",
      commandOrPath: "mountPath: /mock/odata/v4/demo",
      expectedResult: "Mockserver sẵn sàng chặn các request gửi tới URL này."
    },
    {
      stepNumber: 4,
      actionTitle: "Tạo file định nghĩa metadata.xml và dữ liệu mẫu",
      detailedInstruction: "Tạo file webapp/localService/metadata.xml và các file JSON dữ liệu mẫu trong webapp/localService/mockdata/.",
      commandOrPath: "webapp/localService/metadata.xml",
      expectedResult: "Định nghĩa đầy đủ EntityType DemoHeader và DemoItem."
    },
    {
      stepNumber: 5,
      actionTitle: "Khởi chạy thử nghiệm dev server",
      detailedInstruction: "Gõ lệnh npx ui5 serve --port 8085 và truy cập đường link để xem mock metadata.",
      commandOrPath: "npx ui5 serve --port 8085",
      expectedResult: "Truy cập http://localhost:8085/mock/odata/v4/demo/$metadata trả về mã XML 200 OK."
    }
  ],
  chap3: [
    {
      stepNumber: 1,
      actionTitle: "Tạo file cổng vào index.html",
      detailedInstruction: "Tạo file webapp/index.html chứa thẻ script nạp SAPUI5 bootstrap với theme sap_horizon.",
      commandOrPath: "src/frontend/webapp/index.html",
      expectedResult: "index.html chứa thẻ data-sap-ui-theme=\"sap_horizon\"."
    },
    {
      stepNumber: 2,
      actionTitle: "Tạo file khởi tạo UIComponent (Component.js)",
      detailedInstruction: "Tạo webapp/Component.js kế thừa UIComponent, khởi tạo router tự động bằng this.getRouter().initialize().",
      commandOrPath: "src/frontend/webapp/Component.js",
      expectedResult: "Component.js sẵn sàng làm gốc điều hướng cho toàn bộ app."
    },
    {
      stepNumber: 3,
      actionTitle: "Tạo Application Descriptor (manifest.json)",
      detailedInstruction: "Tạo webapp/manifest.json khai báo namespace sap.fiori.tech.academy, các dataSources, models và bảng routing.",
      commandOrPath: "src/frontend/webapp/manifest.json",
      expectedResult: "Định nghĩa đủ routes và targets cho Dashboard, Catalog, Labs."
    },
    {
      stepNumber: 4,
      actionTitle: "Tạo View gốc App.view.xml với Fiori Horizon ToolPage",
      detailedInstruction: "Tạo webapp/view/App.view.xml dùng sap.tnt.ToolPage gồm ToolHeader ở trên và SideNavigation ở bên trái.",
      commandOrPath: "src/frontend/webapp/view/App.view.xml",
      expectedResult: "Khung ứng dụng hiển thị logo, tiêu đề, các nút chức năng và thanh menu."
    },
    {
      stepNumber: 5,
      actionTitle: "Kiểm tra App Shell trên trình duyệt",
      detailedInstruction: "Mở trình duyệt tại http://localhost:8085/index.html để ngắm khung Fiori Horizon đầu tiên của bạn!",
      commandOrPath: "http://localhost:8085/index.html",
      expectedResult: "Giao diện Fiori Shell xuất hiện mượt mà, không có lỗi console."
    }
  ],
  chap4: [
    {
      stepNumber: 1,
      actionTitle: "Tạo file dữ liệu từ điển kỹ thuật technical_catalog.json",
      detailedInstruction: "Tạo webapp/mockdata/technical_catalog.json chứa danh mục 10 phân hệ và các topics.",
      commandOrPath: "src/frontend/webapp/mockdata/technical_catalog.json",
      expectedResult: "File chứa đủ thông tin phân hệ từ Fiori Elements đến ABAP RAP."
    },
    {
      stepNumber: 2,
      actionTitle: "Khai báo model catalog trong manifest.json",
      detailedInstruction: "Mở manifest.json, thêm dataSource catalogSource và model catalog.",
      commandOrPath: "manifest.json -> models -> catalog",
      expectedResult: "View có thể bind trực tiếp {catalog>/topics}."
    },
    {
      stepNumber: 3,
      actionTitle: "Tạo Catalog.view.xml với bảng dữ liệu và bộ lọc",
      detailedInstruction: "Thiết kế giao diện bảng với SearchField, Select phân hệ và các cột tiêu đề, cấp độ, hành động.",
      commandOrPath: "src/frontend/webapp/view/Catalog.view.xml",
      expectedResult: "Bảng chuyên đề hiển thị danh sách rõ ràng, các thẻ tag không có dấu #."
    },
    {
      stepNumber: 4,
      actionTitle: "Tạo Catalog.controller.js xử lý tìm kiếm live",
      detailedInstruction: "Viết controller xử lý sự kiện search, lọc đa tiêu chí bằng sap.ui.model.Filter.",
      commandOrPath: "src/frontend/webapp/controller/Catalog.controller.js",
      expectedResult: "Gõ từ khóa vào thanh tìm kiếm, bảng lập tức lọc kết quả tức thì."
    },
    {
      stepNumber: 5,
      actionTitle: "Tạo CodeExplorer.view.xml hiển thị full mã nguồn",
      detailedInstruction: "Thiết kế màn hình xem mã nguồn mẫu không giới hạn chiều cao, hỗ trợ copy nhanh.",
      commandOrPath: "src/frontend/webapp/view/CodeExplorer.view.xml",
      expectedResult: "Nhấn 'Xem Code' từ Catalog chuyển sang Code Explorer xem toàn bộ file."
    }
  ],
  chap5: [
    {
      stepNumber: 1,
      actionTitle: "Tạo Vocabularies Annotations (annotations.xml)",
      detailedInstruction: "Tạo file webapp/localService/annotations.xml định nghĩa UI.LineItem, UI.SelectionFields và UI.HeaderInfo.",
      commandOrPath: "src/frontend/webapp/localService/annotations.xml",
      expectedResult: "File annotations OData V4 chuẩn được nạp vào ứng dụng."
    },
    {
      stepNumber: 2,
      actionTitle: "Tạo View phòng lab FioriElementsLab.view.xml",
      detailedInstruction: "Tạo giao diện mô phỏng Header và Items có thể chỉnh sửa số lượng và đơn giá.",
      commandOrPath: "src/frontend/webapp/view/FioriElementsLab.view.xml",
      expectedResult: "Hiển thị danh sách Header và bảng Items liên kết."
    },
    {
      stepNumber: 3,
      actionTitle: "Cấu hình Side Effects tự động tính toán tổng tiền",
      detailedInstruction: "Khai báo SideEffects trong controller/annotations để khi sửa NetPrice hoặc Quantity ở Item, Header TotalAmount tự động cập nhật.",
      commandOrPath: "requestSideEffects([\"_Header/TotalAmount\"])",
      expectedResult: "Sửa giá từ 100 thành 200, tổng tiền lập tức nhảy lên mà không cần reload trang."
    },
    {
      stepNumber: 4,
      actionTitle: "Tích hợp ETag OCC (Optimistic Concurrency Control)",
      detailedInstruction: "Mô phỏng cơ chế kiểm tra If-Match Weak ETag W/\"...\" ngăn chặn lỗi ghi đè dữ liệu.",
      commandOrPath: "ETag: W/\"S4-2025-...\"",
      expectedResult: "Nếu sửa trên dữ liệu cũ, hệ thống báo lỗi HTTP 412 Precondition Failed an toàn."
    },
    {
      stepNumber: 5,
      actionTitle: "Kiểm thử thực tế kịch bản Side Effects",
      detailedInstruction: "Mở Fiori Elements Lab trên menu, nhấn chỉnh sửa một dòng hàng hóa để quan sát tổng tiền tự thay đổi.",
      commandOrPath: "http://localhost:8085/index.html#/fe-lab",
      expectedResult: "Tổng tiền cập nhật chính xác theo công thức Số lượng x Đơn giá."
    }
  ],
  chap6: [
    {
      stepNumber: 1,
      actionTitle: "Tạo thư mục ext/controller chứa Extension Controllers",
      detailedInstruction: "Tạo thư mục src/frontend/webapp/ext/controller để chứa mã nguồn mở rộng chuẩn FPM.",
      commandOrPath: "mkdir -p src/frontend/webapp/ext/controller",
      expectedResult: "Thư mục mở rộng FPM sẵn sàng."
    },
    {
      stepNumber: 2,
      actionTitle: "Tạo ListReportExtension.controller.js",
      detailedInstruction: "Viết controller extension kế thừa sap.ui.core.mvc.ControllerExtension để thêm Custom Actions.",
      commandOrPath: "src/frontend/webapp/ext/controller/ListReportExtension.controller.js",
      expectedResult: "Controller Extension can thiệp an toàn vào vòng đời của List Report."
    },
    {
      stepNumber: 3,
      actionTitle: "Tạo ObjectPageExtension.controller.js",
      detailedInstruction: "Viết extension bổ sung kiểm tra nghiệp vụ trước khi lưu dữ liệu trên Object Page.",
      commandOrPath: "src/frontend/webapp/ext/controller/ObjectPageExtension.controller.js",
      expectedResult: "Đón chặn sự kiện Save và thực thi kiểm tra tùy biến."
    },
    {
      stepNumber: 4,
      actionTitle: "Khai báo Controller Extensions trong manifest.json",
      detailedInstruction: "Mở manifest.json phần sap.ui5 -> extends -> extensions để đăng ký 2 controller trên.",
      commandOrPath: "manifest.json -> extends",
      expectedResult: "Framework tự động gắn extension vào trang mà không cần sửa code gốc."
    },
    {
      stepNumber: 5,
      actionTitle: "Kiểm tra hoạt động Custom Action trên giao diện",
      detailedInstruction: "Truy cập phòng lab và nhấn nút Action tùy biến để xem thông báo kích hoạt thành công.",
      commandOrPath: "MessageToast.show(\"Custom Action kích hoạt thành công!\")",
      expectedResult: "Thông báo xuất hiện xác nhận extension hoạt động trơn tru."
    }
  ],
  chap7: [
    {
      stepNumber: 1,
      actionTitle: "Tạo bộ kiểm thử đơn vị QUnit (unitTests.qunit.html)",
      detailedInstruction: "Tạo thư mục webapp/test/unit và file runner unitTests.qunit.html.",
      commandOrPath: "src/frontend/webapp/test/unit/unitTests.qunit.html",
      expectedResult: "QUnit Runner sẵn sàng thực thi các bài test formatter và models."
    },
    {
      stepNumber: 2,
      actionTitle: "Tạo bộ kiểm thử tương tác OPA5 (opaTests.qunit.html)",
      detailedInstruction: "Tạo webapp/test/integration/opaTests.qunit.html và các file Journeys mô phỏng hành vi người dùng.",
      commandOrPath: "src/frontend/webapp/test/integration/opaTests.qunit.html",
      expectedResult: "OPA5 có thể tự động click nút, điền input và assert kết quả."
    },
    {
      stepNumber: 3,
      actionTitle: "Tạo suite kiểm tra tự động Node.js test_frontend_runtime.js",
      detailedInstruction: "Tạo file tests/unit/test_frontend_runtime.js kiểm tra toàn bộ HTTP endpoints và cú pháp XML.",
      commandOrPath: "tests/unit/test_frontend_runtime.js",
      expectedResult: "Script kiểm tra tự động 271 tiêu chí kỹ thuật."
    },
    {
      stepNumber: 4,
      actionTitle: "Chạy lệnh kiểm thử tự động",
      detailedInstruction: "Mở terminal tại thư mục gốc và chạy lệnh node để chạy test suite.",
      commandOrPath: "node tests/unit/test_frontend_runtime.js",
      expectedResult: "In ra 271/271 TESTS PASSED (0 FAILED) màu xanh lá."
    },
    {
      stepNumber: 5,
      actionTitle: "Chạy đóng gói kiểm tra với UI5 CLI Build",
      detailedInstruction: "Chạy lệnh npm run build để kiểm tra toàn bộ mã nguồn có build thành công không.",
      commandOrPath: "npm run build",
      expectedResult: "Build succeeded trong dưới 500 ms, sinh dist/Component-preload.js 0 error."
    }
  ],
  chap8: [
    {
      stepNumber: 1,
      actionTitle: "Tạo Custom Control TechnicalHealthGauge.js",
      detailedInstruction: "Tạo thư mục webapp/control và viết control TechnicalHealthGauge kế thừa sap.ui.core.Control.",
      commandOrPath: "src/frontend/webapp/control/TechnicalHealthGauge.js",
      expectedResult: "Custom Control vẽ thanh Gauge KPI bằng hàm renderer HTML5."
    },
    {
      stepNumber: 2,
      actionTitle: "Tạo FreestyleLab.view.xml tích hợp MessageManager",
      detailedInstruction: "Thiết kế form nhập liệu có Input validation và MessagePopover hiển thị lỗi real-time.",
      commandOrPath: "src/frontend/webapp/view/FreestyleLab.view.xml",
      expectedResult: "Giao diện form chuẩn Enterprise với nút Message Indicator nhấp nháy khi có lỗi."
    },
    {
      stepNumber: 3,
      actionTitle: "Tạo FreestyleLab.controller.js kết nối Core MessageManager",
      detailedInstruction: "Đăng ký view vào sap.ui.getCore().getMessageManager().registerObject(oView, true).",
      commandOrPath: "sap.ui.getCore().getMessageManager()",
      expectedResult: "Các lỗi validate email, trường bắt buộc tự động đổ về MessageManager."
    },
    {
      stepNumber: 4,
      actionTitle: "Tạo XML Fragment QuickInspectDialog.fragment.xml",
      detailedInstruction: "Tạo fragment pop-up xem nhanh thông số kỹ thuật có thể tái sử dụng ở nhiều nơi.",
      commandOrPath: "src/frontend/webapp/fragment/QuickInspectDialog.fragment.xml",
      expectedResult: "Fragment dialog nhẹ nhàng, tải động bằng Fragment.load()."
    },
    {
      stepNumber: 5,
      actionTitle: "Thử nghiệm form nhập liệu trên Freestyle Lab",
      detailedInstruction: "Vào menu Freestyle Lab, nhập sai định dạng email để thấy popover báo lỗi đỏ ngay lập tức.",
      commandOrPath: "http://localhost:8085/index.html#/freestyle-lab",
      expectedResult: "Hệ thống hiển thị lỗi chuẩn SAP Fiori không cho submit khi dữ liệu chưa hợp lệ."
    }
  ],
  chap9: [
    {
      stepNumber: 1,
      actionTitle: "Tạo giao diện ODataV4Lab.view.xml",
      detailedInstruction: "Thiết kế phòng lab trực quan hóa các request ngầm của OData V4: $batch, $expand và Bound Actions.",
      commandOrPath: "src/frontend/webapp/view/ODataV4Lab.view.xml",
      expectedResult: "Giao diện OData V4 Deep Dive sẵn sàng."
    },
    {
      stepNumber: 2,
      actionTitle: "Mô phỏng cơ chế gom nhóm Multipart $batch",
      detailedInstruction: "Viết logic minh họa cách gom 5 thao tác cập nhật vào 1 request HTTP POST duy nhất.",
      commandOrPath: "Content-Type: multipart/mixed; boundary=batch_123",
      expectedResult: "Tiết kiệm 80% thời gian round-trip mạng so với OData V2 cũ."
    },
    {
      stepNumber: 3,
      actionTitle: "Thực thi Bound Action approveHeader",
      detailedInstruction: "Mô phỏng gọi action phê duyệt trên Root Entity làm đổi trạng thái Header từ In Progress sang Approved.",
      commandOrPath: "POST /DemoHeader(HeaderUUID=...)/demo.approveHeader",
      expectedResult: "Trạng thái chuyển sang màu xanh lá thành công."
    },
    {
      stepNumber: 4,
      actionTitle: "Thực nghiệm cơ chế If-Match ETag",
      detailedInstruction: "Thử nghiệm tình huống 2 người dùng cùng sửa 1 bản ghi để thấy hệ thống bảo vệ dữ liệu.",
      commandOrPath: "If-Match: W/\"20261107...\"",
      expectedResult: "Phát hiện Lost Update và cảnh báo người dùng an toàn."
    },
    {
      stepNumber: 5,
      actionTitle: "Kiểm tra hoạt động toàn diện tại phòng Lab OData V4",
      detailedInstruction: "Truy cập menu OData V4 Lab và nhấn nút chạy thử nghiệm các kịch bản $batch.",
      commandOrPath: "http://localhost:8085/index.html#/odata-lab",
      expectedResult: "Màn hình trực quan hóa sơ đồ request và payload JSON chi tiết."
    }
  ],
  chap10: [
    {
      stepNumber: 1,
      actionTitle: "Tạo Database Table trên SAP S/4HANA (ZDEMO_HEADER)",
      detailedInstruction: "Mở Eclipse ADT, kết nối hệ thống S/4HANA 2025 (PQPOC 100), tạo bảng trong Package ZNGHIANDD_TEST.",
      commandOrPath: "src/backend/rap/data-model/zdemo_header.tabl.sql",
      expectedResult: "Bảng vật lý ZDEMO_HEADER được kích hoạt trên SAP HANA DB."
    },
    {
      stepNumber: 2,
      actionTitle: "Tạo CDS View Entity Gốc (ZR_DEMOHEADERTP)",
      detailedInstruction: "Tạo CDS Data Definition định nghĩa Root View Entity với đầy đủ trường, association và ETag.",
      commandOrPath: "src/backend/rap/cds-views/zr_demoheadertp.ddls.asddls",
      expectedResult: "CDS View Entity kích hoạt Active 100% trên ABAP Repository."
    },
    {
      stepNumber: 3,
      actionTitle: "Tạo Behavior Definition BDEF strict(2)",
      detailedInstruction: "Tạo BDEF cho Root Entity với managed implementation, draft table, determinations và validations.",
      commandOrPath: "src/backend/rap/behavior/zr_demoheadertp.bdef.asbdef",
      expectedResult: "BDEF compile thành công, sinh cấu trúc Behavior Pool."
    },
    {
      stepNumber: 4,
      actionTitle: "Viết mã nguồn Behavior Pool Class (ZBP_R_DEMOHEADERTP)",
      detailedInstruction: "Hiện thực hóa các method determination tính tổng tiền và validation kiểm tra dữ liệu bằng Clean ABAP.",
      commandOrPath: "src/backend/rap/behavior-impl/zbp_r_demoheadertp.clas.abap",
      expectedResult: "Class pool kích hoạt Active và sẵn sàng phục vụ runtime."
    },
    {
      stepNumber: 5,
      actionTitle: "Tạo Service Definition và kích hoạt OData V4 Service Binding",
      detailedInstruction: "Expose CDS Consumption View ra OData V4 qua Service Definition ZUI_DEMO_HEADER_O4 và kiểm tra qua Fiori Elements Preview.",
      commandOrPath: "src/backend/rap/service/zui_demo_header_o4.srvd.assrvds",
      expectedResult: "Ứng dụng chạy trực tiếp trên SAP S/4HANA 2025, hoàn thành 100% ứng dụng từ số 0!"
    }
  ]
};

data.chapters.forEach(ch => {
  if (chapterSteps[ch.id]) {
    ch.steps = chapterSteps[ch.id];
  }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated fresher_guideline.json with detailed step-by-step instructions for all 10 chapters!');

