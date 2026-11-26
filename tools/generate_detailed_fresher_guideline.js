const fs = require('fs');
const path = require('path');

const guidelineData = {
  title: "Cẩm Nang Lập Trình SAP Fiori & ABAP RAP Cho Fresher (Từ Số 0 Đến 100%)",
  subtitle: "Hướng dẫn thực chiến từng bước một (cầm tay chỉ việc): Từ cài đặt môi trường dev, VS Code, Eclipse ADT, tạo project Fiori, xây dựng RAP Backend trên SAP S/4HANA 2025 đến Preview OData V4",
  version: "2.0.0",
  author: "SAP Fiori Technical Academy Team",
  fastTrackTools: [
    { name: "Node.js v22 LTS", desc: "Runtime JavaScript chạy UI5 Tooling & Mockserver", link: "https://nodejs.org" },
    { name: "Visual Studio Code", desc: "IDE Frontend kèm SAP Fiori Tools Extension Pack", link: "https://code.visualstudio.com" },
    { name: "Eclipse ADT 2024", desc: "IDE Backend lập trình ABAP Cloud & RAP trên S/4HANA", link: "https://tools.hana.ondemand.com/latest" },
    { name: "SAP GUI 8.00", desc: "Quản trị SAP Logon, SICF, /IWFND/V4_ADMIN & SM59", link: "SAP Support Portal" }
  ],
  goldenShortcuts: [
    { key: "Ctrl + Shift + P", app: "VS Code", desc: "Mở Command Palette (gõ Fiori: Open Application Generator)" },
    { key: "Ctrl + ~", app: "VS Code", desc: "Bật/Tắt Terminal tích hợp sẵn trong VS Code" },
    { key: "Ctrl + F3", app: "Eclipse ADT", desc: "Kích hoạt đối tượng ABAP (Activate Table, CDS, BDEF, Class)" },
    { key: "Ctrl + 1", app: "Eclipse ADT", desc: "Quick Assist: Tự động sinh Behavior Pool Class từ BDEF" },
    { key: "F9", app: "Eclipse ADT", desc: "Thực thi ABAP Console Runner (if_oo_adt_classrun)" }
  ],
  chapters: [
    // -------------------------------------------------------------------------------------------------
    // CHƯƠNG 1
    // -------------------------------------------------------------------------------------------------
    {
      id: "chap1",
      step: 1,
      title: "Chương 1: Chuẩn Bị Môi Trường Dev Toàn Diện (VSCode, Eclipse ADT, Node.js & SAP GUI)",
      summary: "Hướng dẫn cài đặt chi tiết 4 công cụ bắt buộc: Node.js 22 LTS, VS Code + Fiori Tools, Java JDK + Eclipse ADT và cấu hình kết nối SAP Logon / ABAP Cloud Project.",
      image: "img/guideline/01_dashboard_view.png",
      imageCaption: "Mục tiêu Chương 1: Hoàn thiện toàn bộ môi trường phát triển Full-Stack Fiori & RAP sẵn sàng thực thi.",
      prerequisites: [
        "Máy tính Windows 10/11 (64-bit), tối thiểu 8GB RAM (khuyến nghị 16GB).",
        "Quyền Administrator trên máy tính để cài đặt phần mềm.",
        "Thông tin kết nối máy chủ SAP S/4HANA 2025: IP/Host, System ID, Client 100, Username NGS.NGHIANDD, Password."
      ],
      cliCommands: [
        "node -v",
        "npm -v",
        "npm install --global @ui5/cli",
        "ui5 --version"
      ],
      primaryFile: "docs/ENVIRONMENT_SETUP.md",
      primaryFilePath: "docs/ENVIRONMENT_SETUP.md",
      codeSnippet: "# HƯỚNG DẪN THIẾT LẬP MÔI TRƯỜNG DEV: ENVIRONMENT SETUP\n# SAP Fiori Technical Academy - Full-Stack Prerequisites\n\n1. Node.js LTS: v20.x hoặc v22.x LTS (Tải từ https://nodejs.org)\n2. VS Code: Bản mới nhất (Tải từ https://code.visualstudio.com)\n   - Extensions bắt buộc: SAP Fiori Tools - Extension Pack, XML Tools\n3. Java JDK: Temurin JDK 17 hoặc 21 LTS (Tải từ https://adoptium.net)\n4. Eclipse IDE: 2024 for Java Developers (Tải từ https://www.eclipse.org)\n   - ADT Plugin: https://tools.hana.ondemand.com/latest\n5. SAP GUI for Windows: 8.00 64-bit\n   - System: SAP S/4HANA 2025 (PQPOC Client 100)\n   - Package: ZNGHIANDD_TEST | Transport Request: S4DK911884",
      annotatedLines: [
        {
          line: 4,
          code: "1. Node.js LTS: v20.x hoặc v22.x LTS (Tải từ https://nodejs.org)",
          role: "Môi trường thực thi JavaScript (Node.js)",
          explanation: "Nền tảng để chạy UI5 Tooling, NPM Package Manager và OData V4 Mockserver phía Frontend.",
          tips: "Khuyến nghị cài đặt phiên bản Node 22 LTS để tương thích tốt nhất với UI5 CLI v4."
        },
        {
          line: 5,
          code: "2. VS Code: Bản mới nhất (Tải từ https://code.visualstudio.com)",
          role: "Môi trường phát triển Frontend (VS Code)",
          explanation: "IDE tiêu chuẩn của SAP để phát triển ứng dụng SAPUI5 và Fiori Elements.",
          tips: "Cài gói SAP Fiori Tools - Extension Pack để có trình Wizard Application Generator."
        },
        {
          line: 7,
          code: "3. Java JDK: Temurin JDK 17 hoặc 21 LTS (Tải từ https://adoptium.net)",
          role: "Java Development Kit (JDK 17/21)",
          explanation: "Yêu cầu bắt buộc để chạy Eclipse IDE và bộ công cụ ABAP Development Tools (ADT).",
          tips: "Không dùng JDK 8 hay JDK 11 cũ vì Eclipse 2024 yêu cầu tối thiểu Java 17."
        },
        {
          line: 8,
          code: "4. Eclipse IDE: 2024 for Java Developers (Tải từ https://www.eclipse.org)",
          role: "IDE Backend ABAP Platform (Eclipse ADT)",
          explanation: "Môi trường duy nhất hỗ trợ lập trình ABAP Cloud, Core Data Services (CDS) và RESTful Application Programming (RAP).",
          tips: "Cài đặt plugin ADT qua menu Help -> Install New Software với URL https://tools.hana.ondemand.com/latest."
        },
        {
          line: 12,
          code: "   - Package: ZNGHIANDD_TEST | Transport Request: S4DK911884",
          role: "Package & Transport Request chính thức",
          explanation: "Toàn bộ bảng, CDS Views, BDEF và Classes của dự án được lưu trong Package cô lập ZNGHIANDD_TEST và gắn vào TR S4DK911884.",
          tips: "Tuyệt đối không lưu vào package của người khác để đảm bảo an toàn hệ thống."
        }
      ],
      steps: [
        {
          stepNumber: 1,
          ideOrTool: "Windows / macOS",
          actionTitle: "Tải & Cài đặt Node.js v22 LTS",
          detailedInstruction: "Truy cập https://nodejs.org, tải bản cài đặt Windows Installer (.msi) của bản Node.js v22 LTS (Active LTS). Chạy file .msi, bấm 'Next' giữ nguyên toàn bộ tùy chọn mặc định, tích chọn 'Automatically install the necessary tools' và bấm 'Finish'. Mở PowerShell hoặc Command Prompt mới, gõ: 'node -v' (kết quả ra v22.x.x) và 'npm -v' (kết quả ra 10.x.x).",
          commandOrPath: "node -v && npm -v",
          expectedResult: "In ra phiên bản Node.js v22.x và npm v10.x thành công.",
          fresherGotcha: "Nếu terminal báo lệnh không tồn tại ('not recognized'), hãy khởi động lại máy tính hoặc VS Code để Windows cập nhật biến môi trường PATH."
        },
        {
          stepNumber: 2,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Cài đặt VS Code & Bộ Extensions SAP Fiori Tools",
          detailedInstruction: "Truy cập https://code.visualstudio.com, tải và cài đặt VS Code. Mở VS Code, nhấn tổ hợp phím 'Ctrl+Shift+X' (hoặc bấm biểu tượng 4 khối vuông bên thanh trái) để mở Extensions Marketplace. Tìm kiếm từ khóa 'SAP Fiori Tools - Extension Pack' (do SAP SE phát hành), bấm nút 'Install'. Extension này tự động cài trọn bộ: Application Generator, Guided Development, Service Modeler. Tìm và cài thêm extension 'XML Tools' để tự động định dạng và format XML Views.",
          commandOrPath: "Ctrl + Shift + X -> Tìm 'SAP Fiori Tools - Extension Pack' -> Install",
          expectedResult: "Extension Pack cài đặt thành công và hiển thị biểu tượng SAP Fiori trên Activity Bar.",
          fresherGotcha: "Đảm bảo đã cài đúng extension chính thức của 'SAP SE', không cài các extension không rõ nguồn gốc."
        },
        {
          stepNumber: 3,
          ideOrTool: "Windows / Eclipse",
          actionTitle: "Cài đặt Java JDK 17/21 & Eclipse IDE 2024",
          detailedInstruction: "Truy cập https://adoptium.net, tải Eclipse Temurin JDK 17 hoặc 21 (LTS) và cài đặt vào máy. Tiếp theo, truy cập https://www.eclipse.org/downloads/packages/, tải gói 'Eclipse IDE for Java Developers' (bản 2024). Giải nén file zip vào ổ đĩa C:\\eclipse hoặc D:\\eclipse và chạy file 'eclipse.exe'.",
          commandOrPath: "C:\\eclipse\\eclipse.exe",
          expectedResult: "Eclipse khởi động thành công và mở màn hình Welcome.",
          fresherGotcha: "Eclipse 2024 yêu cầu tối thiểu Java 17 64-bit; nếu gặp lỗi 'Java was started but returned exit code=13', kiểm tra lại phiên bản JDK đã cài đúng 64-bit chưa."
        },
        {
          stepNumber: 4,
          ideOrTool: "Eclipse ADT",
          actionTitle: "Cài đặt Plugin ABAP Development Tools (ADT) trong Eclipse",
          detailedInstruction: "Trong cửa sổ Eclipse, chọn menu 'Help' -> 'Install New Software...'. Tại ô 'Work with', dán URL chính thức của SAP: https://tools.hana.ondemand.com/latest và nhấn Enter. Chờ vài giây để danh sách plugin hiện ra. Tích chọn toàn bộ mục 'ABAP Development Tools'. Bấm 'Next' -> 'Next' -> tích chọn 'I accept the terms of the license agreements' -> bấm 'Finish'. Chờ tải và bấm 'Restart Now' khi có thông báo để hoàn tất.",
          commandOrPath: "Help -> Install New Software -> https://tools.hana.ondemand.com/latest",
          expectedResult: "Eclipse khởi động lại với biểu tượng ABAP Perspective xuất hiện ở góc trên bên phải.",
          fresherGotcha: "Nếu mạng công ty có Proxy chặn tải plugin, vào menu Window -> Preferences -> General -> Network Connections để cấu hình Proxy."
        },
        {
          stepNumber: 5,
          ideOrTool: "SAP GUI Logon",
          actionTitle: "Cài đặt SAP GUI for Windows 8.00 & Thêm Kết Nối",
          detailedInstruction: "Cài đặt SAP GUI for Windows 8.00 (64-bit) từ bộ cài chuẩn. Mở ứng dụng 'SAP Logon', nhấp nút 'New Item' (hoặc nhấn Ctrl+N) để thêm kết nối mới. Chọn 'User Specified System'. Điền Description: 'SAP S/4HANA 2025 PQPOC', Application Server: <IP hoặc Host máy chủ SAP>, Instance Number: 00, System ID: PQP. Nhấp 'Finish' để lưu.",
          commandOrPath: "SAP Logon -> New Item -> Nhập IP/Host, System ID, Instance Number",
          expectedResult: "Hệ thống SAP xuất hiện trong danh sách kết nối của SAP Logon.",
          fresherGotcha: "Đảm bảo đã mở VPN nội bộ công ty trước khi thử kết nối tới Application Server SAP."
        },
        {
          stepNumber: 6,
          ideOrTool: "Eclipse ADT",
          actionTitle: "Tạo ABAP Cloud Project Kết Nối SAP S/4HANA 2025",
          detailedInstruction: "Trong Eclipse, chuyển sang góc nhìn ABAP Perspective bằng cách vào menu: Window -> Perspective -> Open Perspective -> Other... -> chọn 'ABAP' và bấm 'Open'. Chọn menu File -> New -> ABAP Cloud Project. Tích chọn 'Use connection from SAP Logon', chọn hệ thống 'SAP S/4HANA 2025 PQPOC' vừa tạo ở Bước 5, bấm 'Next'. Nhập Client: 100, User: NGS.NGHIANDD, Mật khẩu. Bấm 'Finish'.",
          commandOrPath: "File -> New -> ABAP Cloud Project -> Chọn kết nối SAP Logon -> Nhập Client 100, User, Pass",
          expectedResult: "Cây thư mục hệ thống SAP xuất hiện trong cửa sổ Project Explorer của Eclipse.",
          fresherGotcha: "Nếu Eclipse báo lỗi 'Logon failed', kiểm tra xem Client đã nhập đúng 100 chưa và tài khoản có bị khóa mật khẩu trong SAP GUI không."
        }
      ]
    },

    // -------------------------------------------------------------------------------------------------
    // CHƯƠNG 2
    // -------------------------------------------------------------------------------------------------
    {
      id: "chap2",
      step: 2,
      title: "Chương 2: Khởi Tạo Dự Án SAP Fiori Bằng Fiori Generator Wizard & Terminal UI5 CLI",
      summary: "Hướng dẫn 2 phương pháp khởi tạo ứng dụng: Dùng Wizard Fiori Application Generator trong VS Code và Khởi tạo bằng dòng lệnh UI5 CLI từ số 0.",
      image: "img/guideline/02_catalog_view.png",
      imageCaption: "Mục tiêu Chương 2: Tạo cấu trúc khung dự án chuẩn MVC và kiểm tra ứng dụng chạy lần đầu tiên.",
      prerequisites: [
        "Hoàn thành Chương 1 (đã cài đặt Node.js, VS Code và SAP Fiori Tools Extension Pack)."
      ],
      cliCommands: [
        "mkdir FIORI_TECH_APP && cd FIORI_TECH_APP",
        "npm init -y",
        "npm install --save-dev @ui5/cli@^4.0.0 @sap-ux/ui5-middleware-fe-mockserver@^2.0.0",
        "npm start"
      ],
      primaryFile: "package.json",
      primaryFilePath: "src/frontend/package.json",
      codeSnippet: "{\n  \"name\": \"sap-fiori-technical-academy\",\n  \"version\": \"1.0.0\",\n  \"description\": \"SAP Fiori Technical Academy - Comprehensive Platform\",\n  \"scripts\": {\n    \"start\": \"ui5 serve --port 8085 --open index.html\",\n    \"build\": \"ui5 build --clean-dest --dest dist\"\n  },\n  \"devDependencies\": {\n    \"@ui5/cli\": \"^4.0.0\",\n    \"@sap-ux/ui5-middleware-fe-mockserver\": \"^2.0.0\"\n  }\n}",
      annotatedLines: [
        {
          line: 2,
          code: "  \"name\": \"sap-fiori-technical-academy\",",
          role: "Tên định danh dự án (Package Name)",
          explanation: "Tên kỹ thuật định danh của gói ứng dụng theo quy ước npm. Phải viết thường và dùng dấu gạch ngang phân cách.",
          tips: "Khớp với trường ID trong manifest.json và component namespace."
        },
        {
          line: 5,
          code: "  \"start\": \"ui5 serve --port 8085 --open index.html\",",
          role: "Lệnh khởi động máy chủ cục bộ",
          explanation: "Sử dụng UI5 Tooling để khởi chạy web server tại cổng 8085 và tự động mở trình duyệt với index.html.",
          tips: "Nếu cổng 8085 bị chiếm dụng bởi tiến trình khác, bạn có thể đổi sang cổng 8086 hoặc 8087."
        },
        {
          line: 6,
          code: "  \"build\": \"ui5 build --clean-dest --dest dist\",",
          role: "Lệnh đóng gói ứng dụng (Build)",
          explanation: "Biên dịch toàn bộ XML views, controllers và tài nguyên tĩnh thành Component-preload.js trong thư mục dist/.",
          tips: "Lệnh này bắt buộc phải vượt qua trước khi triển khai lên SAP NetWeaver / SAP BTP."
        },
        {
          line: 9,
          code: "  \"@ui5/cli\": \"^4.0.0\",",
          role: "Công cụ dòng lệnh UI5 CLI v4",
          explanation: "Framework chính thức của SAP để quản lý vòng đời phát triển ứng dụng SAPUI5/OpenUI5.",
          tips: "Phiên bản v4 hỗ trợ ESM, tối ưu hóa tốc độ build và tích hợp middleware hiện đại."
        },
        {
          line: 10,
          code: "  \"@sap-ux/ui5-middleware-fe-mockserver\": \"^2.0.0\"",
          role: "Mock Server Fiori Elements Middleware",
          explanation: "Middleware chuyên dụng của SAP Fiori Tools để giả lập OData V4 service và Side Effects ngay tại local.",
          tips: "Giúp fresher phát triển frontend hoàn chỉnh mà không cần kết nối tới máy chủ SAP thật."
        }
      ],
      steps: [
        {
          stepNumber: 1,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Mở Fiori Application Generator (Cách 1 - Khuyến Nghị)",
          detailedInstruction: "Mở VS Code, nhấn phím tắt 'Ctrl+Shift+P' (hoặc F1) để mở Command Palette. Gõ 'Fiori: Open Application Generator' và nhấn Enter. Một tab đồ họa trực quan của Fiori Tools sẽ xuất hiện để hướng dẫn từng bước tạo dự án.",
          commandOrPath: "Ctrl + Shift + P -> Fiori: Open Application Generator",
          expectedResult: "Trình hướng dẫn SAP Fiori Application Generator mở ra với các ô chọn mẫu template.",
          fresherGotcha: "Nếu không tìm thấy lệnh này, kiểm tra lại Extension 'SAP Fiori Tools - Extension Pack' đã được cài đặt và kích hoạt (Enable) chưa."
        },
        {
          stepNumber: 2,
          ideOrTool: "VS Code Wizard",
          actionTitle: "Chọn Loại Mẫu Ứng Dụng (Template Selection)",
          detailedInstruction: "Tại màn hình Template Selection: Nếu muốn xây dựng giao diện tùy biến linh hoạt, chọn 'SAPUI5 freestyle' -> chọn tiếp thẻ 'SAPUI5 Application'. Nếu muốn xây dựng giao diện Fiori Elements chuẩn OData V4 tự động sinh từ annotations, chọn 'SAP Fiori elements' -> chọn thẻ 'List Report Page'. Nhấp nút 'Next' ở góc dưới.",
          commandOrPath: "Chọn Template: SAPUI5 freestyle -> SAPUI5 Application -> Bấm Next",
          expectedResult: "Chuyển sang màn hình cấu hình Nguồn Dữ Liệu (Data Source).",
          fresherGotcha: "Đối với dự án học tập kết hợp cả Freestyle và Fiori Elements, việc nắm vững cấu trúc của Freestyle Application là nền tảng cốt lõi nhất."
        },
        {
          stepNumber: 3,
          ideOrTool: "VS Code Wizard",
          actionTitle: "Chọn Nguồn Dữ Liệu (Data Source Configuration)",
          detailedInstruction: "Tại bước Data Source: Để chạy thử nghiệm độc lập ở chế độ Standalone không cần máy chủ SAP, chọn 'None'. Nếu có sẵn máy chủ SAP S/4HANA đang hoạt động, chọn 'Connect to an OData Service' và dán URL dịch vụ OData V4 (ví dụ: /sap/opu/odata4/sap/zui_demo_o4/srvd/sap/zsd_demo/0001/). Bấm 'Next'.",
          commandOrPath: "Data Source: Chọn 'None' (Standalone Mode) -> Bấm Next",
          expectedResult: "Chuyển sang màn hình cấu hình View ban đầu và thông tin dự án.",
          fresherGotcha: "Chọn 'None' giúp bạn bắt đầu phát triển giao diện ngay lập tức mà không bị phụ thuộc vào trạng thái mạng hay quyền truy cập SAP backend."
        },
        {
          stepNumber: 4,
          ideOrTool: "VS Code Wizard",
          actionTitle: "Điền Thuộc Tính Dự Án (Project Attributes)",
          detailedInstruction: "Điền các thông tin định danh chính xác: Module name: 'sap-fiori-technical-academy', Application title: 'SAP Fiori Technical Academy', Application namespace: 'sap.fiori.tech.academy', Description: 'Technical Academy Platform', Minimum SAPUI5 Version: '1.136.0', Add deployment configuration: chọn 'No', Add FLP configuration: chọn 'No'. Bấm nút 'Finish' và đợi công cụ sinh toàn bộ mã nguồn.",
          commandOrPath: "Module: sap-fiori-technical-academy | Namespace: sap.fiori.tech.academy | Bấm Finish",
          expectedResult: "Toàn bộ thư mục dự án và file cấu hình manifest.json, Component.js được tạo hoàn chỉnh.",
          fresherGotcha: "Namespace phải tuân thủ chữ thường viết liền phân cách bằng dấu chấm (ví dụ: sap.fiori.tech.academy) để tránh lỗi routing sau này."
        },
        {
          stepNumber: 5,
          ideOrTool: "Terminal CLI",
          actionTitle: "Khởi Tạo Bằng Dòng Lệnh UI5 Tooling (Cách 2 - Dành Cho CLI)",
          detailedInstruction: "Nhấn tổ hợp phím 'Ctrl+~' trong VS Code để mở Terminal tích hợp. Chạy tuần tự các lệnh: tạo thư mục dự án 'mkdir FIORI_TECH_APP && cd FIORI_TECH_APP', khởi tạo file cấu hình 'npm init -y', sau đó cài đặt UI5 CLI và mockserver: 'npm install --save-dev @ui5/cli@^4.0.0 @sap-ux/ui5-middleware-fe-mockserver@^2.0.0'.",
          commandOrPath: "npm init -y && npm install --save-dev @ui5/cli@^4.0.0 @sap-ux/ui5-middleware-fe-mockserver@^2.0.0",
          expectedResult: "File package.json được cập nhật với các devDependencies đã cài đặt thành công.",
          fresherGotcha: "Dùng cờ --save-dev để các gói công cụ chỉ phục vụ môi trường phát triển local, không bị đóng gói thừa vào bản deploy production."
        },
        {
          stepNumber: 6,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Khám Phá Cây Thư Mục Dự Án & Chạy Lần Đầu",
          detailedInstruction: "Mở cây thư mục src/frontend/webapp trong VS Code: kiểm tra sự tồn tại của manifest.json (bộ não cấu hình app), Component.js (khởi tạo app), index.html (cổng vào trình duyệt). Chạy lệnh 'npm start' trong terminal. Máy chủ UI5 Tooling sẽ khởi động và tự động mở trình duyệt tại địa chỉ http://localhost:8085/index.html.",
          commandOrPath: "npm start (hoặc npx ui5 serve --port 8085 --open index.html)",
          expectedResult: "Trình duyệt tự động mở lên giao diện khởi đầu của ứng dụng SAPUI5 trên cổng 8085.",
          fresherGotcha: "Nếu trình duyệt báo lỗi cổng 8085 bị chiếm dụng, hãy kiểm tra tiến trình node cũ và đổi port trong scripts package.json sang 8086."
        }
      ]
    },

    // -------------------------------------------------------------------------------------------------
    // CHƯƠNG 3
    // -------------------------------------------------------------------------------------------------
    {
      id: "chap3",
      step: 3,
      title: "Chương 3: Cấu Hình UI5 Tooling & OData V4 Mock Server (ui5.yaml & localService)",
      summary: "Thiết lập cấu hình phân giải thư viện SAPUI5 1.136.0, tích hợp fe-mockserver và chuẩn bị metadata EDMX cùng mockdata JSON.",
      image: "img/guideline/04_architecture_view.png",
      imageCaption: "Mô hình kiến trúc Dual Execution (Standalone Mock vs SAP S/4HANA Connected).",
      prerequisites: [
        "Hoàn thành Chương 2.",
        "Hiểu khái niệm custom middleware trong UI5 Tooling."
      ],
      cliCommands: [
        "npx ui5 serve --port 8085"
      ],
      primaryFile: "ui5.yaml",
      primaryFilePath: "src/frontend/ui5.yaml",
      codeSnippet: "specVersion: '4.0'\nmetadata:\n  name: sap.fiori.tech.academy\ntype: application\nframework:\n  name: SAPUI5\n  version: '1.136.0'\n  libraries:\n    - name: sap.m\n    - name: sap.ui.core\n    - name: sap.tnt\n    - name: sap.f\n    - name: sap.ui.layout\n    - name: sap.fe.core\n    - name: sap.fe.macros\nserver:\n  customMiddleware:\n    - name: sap-fe-mockserver\n      mountPath: /mock/odata/v4/demo\n      afterMiddleware: compression\n      configuration:\n        services:\n          - urlPath: /mock/odata/v4/demo\n            metadataPath: ./webapp/localService/metadata.xml\n            mockdataPath: ./webapp/localService/mockdata\n            generateMockData: false",
      annotatedLines: [
        {
          line: 1,
          code: "specVersion: '4.0'",
          role: "Phiên bản đặc tả UI5 Tooling",
          explanation: "Định nghĩa phiên bản quy chuẩn cấu hình của UI5 CLI. Chuẩn 4.0 là chuẩn hiện đại nhất.",
          tips: "Luôn dùng '4.0' khi làm việc với UI5 Tooling v4."
        },
        {
          line: 6,
          code: "  version: '1.136.0'",
          role: "Phiên bản SAPUI5 mục tiêu",
          explanation: "Phiên bản SAPUI5 runtime tương ứng với hệ thống SAP S/4HANA 2025 (SAP_UI 8.16).",
          tips: "Đảm bảo version này tương thích với các control hiện đại như sap.fe.macros."
        },
        {
          line: 13,
          code: "    - name: sap.fe.macros",
          role: "Thư viện Building Blocks V4",
          explanation: "Chứa các building blocks FPM như Table, FilterBar, Field, Chart kế thừa trực tiếp từ annotations.",
          tips: "Khai báo thư viện này là điều kiện tiên quyết để dùng được Fiori Elements Flexible Programming Model."
        },
        {
          line: 16,
          code: "      mountPath: /mock/odata/v4/demo",
          role: "Đường dẫn gốc của Mock Service",
          explanation: "Tất cả các OData request gửi tới URL này sẽ được mock server chặn lại và phản hồi giả lập.",
          tips: "Khớp chính xác với cấu hình dataSource trong manifest.json."
        },
        {
          line: 21,
          code: "            metadataPath: ./webapp/localService/metadata.xml",
          role: "Đường dẫn tới file EDMX Metadata",
          explanation: "Nơi chứa định nghĩa các EntityTypes, Keys, Properties, và Actions theo chuẩn EDMX OData V4.",
          tips: "Phải dùng từ khóa 'metadataPath', không được nhầm thành 'metadataXmlPath'."
        },
        {
          line: 25,
          code: "            mockdataPath: ./webapp/localService/mockdata",
          role: "Thư mục chứa Mock Data JSON",
          explanation: "Nơi lưu trữ các file dữ liệu mẫu DemoHeader.json và DemoItem.json để mockserver nạp vào bộ nhớ.",
          tips: "Tên file JSON phải khớp chính xác với tên EntitySet được khai báo trong metadata.xml."
        },
        {
          line: 26,
          code: "            generateMockData: false",
          role: "Cờ tự động sinh dữ liệu mẫu",
          explanation: "Đặt false để ngăn mock server tự sinh dữ liệu ngẫu nhiên, giúp kiểm soát 100% dữ liệu thử nghiệm chuẩn.",
          tips: "Nên giữ false để các kịch bản kiểm thử Side Effects và ETag luôn ổn định."
        }
      ],
      steps: [
        {
          stepNumber: 1,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tạo File Cấu Hình Máy Chủ ui5.yaml",
          detailedInstruction: "Tại thư mục gốc của frontend (src/frontend), nhấp chuột phải chọn 'New File', đặt tên chính xác là 'ui5.yaml'. Khai báo specVersion: '4.0', type: application và metadata name trùng với namespace dự án.",
          commandOrPath: "src/frontend/ui5.yaml",
          expectedResult: "File ui5.yaml xuất hiện và được nhận diện đúng định dạng cấu hình YAML.",
          fresherGotcha: "YAML rất nhạy cảm với thụt đầu dòng (indentation); luôn dùng 2 dấu cách (spaces), tuyệt đối không dùng phím Tab."
        },
        {
          stepNumber: 2,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Khai Báo Phiên Bản SAPUI5 & Thư Viện Cần Thiết",
          detailedInstruction: "Trong khối framework của ui5.yaml, khai báo version: '1.136.0' (tương thích SAP S/4HANA 2025). Khai báo mảng libraries bao gồm các thư viện cốt lõi: sap.m, sap.ui.core, sap.tnt, sap.f, sap.ui.layout, sap.fe.core và sap.fe.macros.",
          commandOrPath: "libraries: sap.m, sap.fe.core, sap.fe.macros...",
          expectedResult: "UI5 Tooling tự động tải các thư viện này từ SAP CDN khi khởi động dev server.",
          fresherGotcha: "Khai báo thiếu sap.fe.macros sẽ dẫn đến lỗi không render được Building Blocks trên Fiori Elements Lab."
        },
        {
          stepNumber: 3,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Cấu Hình Middleware Mockserver OData V4",
          detailedInstruction: "Thêm khối customMiddleware với tên 'sap-fe-mockserver', mountPath: '/mock/odata/v4/demo'. Cấu hình dịch vụ trỏ metadataPath tới './webapp/localService/metadata.xml' và mockdataPath tới './webapp/localService/mockdata'.",
          commandOrPath: "customMiddleware: - name: sap-fe-mockserver",
          expectedResult: "Middleware được đăng ký thành công vào pipeline xử lý HTTP request của máy chủ.",
          fresherGotcha: "Luôn đặt afterMiddleware: compression để mockserver chạy sau lớp nén dữ liệu."
        },
        {
          stepNumber: 4,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tạo File Metadata EDMX & Dữ Liệu Mẫu JSON",
          detailedInstruction: "Tạo thư mục 'src/frontend/webapp/localService'. Trong đó tạo file 'metadata.xml' chứa định nghĩa EDMX OData V4 cho 2 EntitySet: DemoHeader và DemoItem. Tạo tiếp thư mục con 'mockdata' và tạo 2 file 'DemoHeader.json' và 'DemoItem.json' chứa các bản ghi mẫu kỹ thuật.",
          commandOrPath: "src/frontend/webapp/localService/metadata.xml & mockdata/DemoHeader.json",
          expectedResult: "Mock server nạp thành công 10 bản ghi DemoHeader và 12 bản ghi DemoItem vào bộ nhớ.",
          fresherGotcha: "Tên file JSON trong thư mục mockdata phải khớp chính xác 100% từng chữ hoa/thường với tên EntitySet trong metadata.xml."
        },
        {
          stepNumber: 5,
          ideOrTool: "Terminal CLI",
          actionTitle: "Khởi Chạy Kiểm Thử Mock Server",
          detailedInstruction: "Chạy lệnh 'npx ui5 serve --port 8085' trong terminal. Mở trình duyệt và truy cập URL metadata: http://localhost:8085/mock/odata/v4/demo/$metadata để xác nhận mock server đã hoạt động và trả về mã HTTP 200 OK.",
          commandOrPath: "npx ui5 serve --port 8085 -> Truy cập http://localhost:8085/mock/odata/v4/demo/$metadata",
          expectedResult: "Trình duyệt hiển thị file XML định nghĩa OData V4 EDMX hoàn chỉnh.",
          fresherGotcha: "Nếu truy cập URL $metadata mà trả về 404, kiểm tra lại đường dẫn metadataPath trong ui5.yaml đã đúng './webapp/localService/metadata.xml' chưa."
        }
      ]
    },

    // -------------------------------------------------------------------------------------------------
    // CHƯƠNG 4
    // -------------------------------------------------------------------------------------------------
    {
      id: "chap4",
      step: 4,
      title: "Chương 4: Khung Ứng Dụng Fiori Horizon & Điều Hướng (manifest.json & App Shell)",
      summary: "Xây dựng cấu hình Application Descriptor manifest.json chuẩn theme Horizon, thiết lập bộ định tuyến Hash-based Routing và App Shell ToolHeader.",
      image: "img/guideline/01_dashboard_view.png",
      imageCaption: "Giao diện Fiori Horizon Shell với ToolHeader và thanh điều hướng SideNavigation.",
      prerequisites: [
        "Hoàn thành Chương 3.",
        "Nắm vững nguyên lý điều hướng URL Hash trong SPA."
      ],
      cliCommands: [
        "npm start"
      ],
      primaryFile: "manifest.json",
      primaryFilePath: "src/frontend/webapp/manifest.json",
      codeSnippet: "{\n  \"_version\": \"1.65.0\",\n  \"sap.app\": {\n    \"id\": \"sap.fiori.tech.academy\",\n    \"type\": \"application\",\n    \"title\": \"{{appTitle}}\",\n    \"dataSources\": {\n      \"mainService\": {\n        \"uri\": \"/mock/odata/v4/demo/\",\n        \"type\": \"OData\",\n        \"settings\": { \"odataVersion\": \"4.0\" }\n      }\n    }\n  },\n  \"sap.ui5\": {\n    \"rootView\": {\n      \"viewName\": \"sap.fiori.tech.academy.view.App\",\n      \"type\": \"XML\",\n      \"async\": true,\n      \"id\": \"appRootView\"\n    },\n    \"routing\": {\n      \"config\": {\n        \"routerClass\": \"sap.m.routing.Router\",\n        \"viewType\": \"XML\",\n        \"viewPath\": \"sap.fiori.tech.academy.view\",\n        \"controlId\": \"appContainer\",\n        \"controlAggregation\": \"pages\",\n        \"async\": true\n      }\n    }\n  }\n}",
      annotatedLines: [
        {
          line: 3,
          code: "  \"sap.app\": {",
          role: "Khối sap.app (Định danh Ứng Dụng)",
          explanation: "Chứa thông tin định danh toàn cục, title đa ngôn ngữ và danh sách nguồn dữ liệu OData dataSources.",
          tips: "ID phải là duy nhất trên toàn hệ thống SAP Fiori Launchpad."
        },
        {
          line: 8,
          code: "        \"settings\": { \"odataVersion\": \"4.0\" }",
          role: "Chỉ định Phiên Bản OData V4",
          explanation: "Khai báo OData model hoạt động theo đặc tả OData V4 hiện đại, kích hoạt các tính năng batch và draft.",
          tips: "Tránh nhầm lẫn với OData V2 cũ có cú pháp binding khác biệt."
        },
        {
          line: 16,
          code: "    \"routing\": {",
          role: "Hệ Thống Định Tuyến Fiori (Routing)",
          explanation: "Cấu hình routerClass, viewPath và vùng chứa target pagesContainer để điều hướng qua lại giữa các view.",
          tips: "Luôn đặt async: true trong config routing để đạt hiệu năng tối đa."
        }
      ],
      steps: [
        {
          stepNumber: 1,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tạo File Cổng Vào webapp/index.html",
          detailedInstruction: "Tạo file 'src/frontend/webapp/index.html'. Nhúng thẻ script bootstrap thư viện SAPUI5 từ CDN hoặc local resources. Thiết lập data-sap-ui-theme='sap_horizon' và data-sap-ui-compatVersion='edge' để áp dụng ngôn ngữ thiết kế Morning Horizon mới nhất.",
          commandOrPath: "src/frontend/webapp/index.html",
          expectedResult: "Trang web HTML chuẩn có khả năng tự động nạp SAPUI5 Core và Component.",
          fresherGotcha: "Không quên thuộc tính data-sap-ui-onInit='module:sap/ui/core/ComponentSupport' để UI5 tự kích hoạt Component."
        },
        {
          stepNumber: 2,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tạo File Khởi Tạo webapp/Component.js",
          detailedInstruction: "Tạo file 'src/frontend/webapp/Component.js' kế thừa 'sap/ui/core/UIComponent'. Trong hàm init, gọi BaseComponent.prototype.init.apply(this, arguments) và khởi động router bằng lệnh: this.getRouter().initialize().",
          commandOrPath: "src/frontend/webapp/Component.js",
          expectedResult: "UIComponent sẵn sàng quản lý vòng đời ứng dụng và nạp manifest.json.",
          fresherGotcha: "Quên gọi this.getRouter().initialize() là nguyên nhân số 1 khiến màn hình bị trắng tinh khi truy cập URL có hash."
        },
        {
          stepNumber: 3,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Cấu Hình Application Descriptor (manifest.json)",
          detailedInstruction: "Tạo file 'src/frontend/webapp/manifest.json'. Cấu hình khối sap.app (ID, dataSources), khối sap.ui5 (rootView, dependencies, models) và khối routing (các routes: dashboard, catalog, code, feLab, guideline... và targets tương ứng).",
          commandOrPath: "src/frontend/webapp/manifest.json",
          expectedResult: "Mọi màn hình view trong ứng dụng được định tuyến qua lại thông qua URL hash (#/dashboard, #/guideline).",
          fresherGotcha: "Luôn đảm bảo thuộc tính async: true trong cả rootView và routing config."
        },
        {
          stepNumber: 4,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tạo View Gốc App.view.xml Với Fiori Horizon ToolHeader",
          detailedInstruction: "Tạo file 'src/frontend/webapp/view/App.view.xml' sử dụng control sap.tnt.ToolPage. Thanh ToolHeader phía trên chứa Logo Fiori, tiêu đề ứng dụng, Runtime Mode Selector (Standalone/Connected) và các nút chức năng ghim góc phải (NeverOverflow).",
          commandOrPath: "src/frontend/webapp/view/App.view.xml",
          expectedResult: "Khung bố cục App Shell chuẩn Fiori Horizon sẵn sàng chứa các trang con.",
          fresherGotcha: "Đặt priority='NeverOverflow' cho các nút quan trọng ở ToolHeader để tránh bị thu vào menu '...' khi xem trên màn hình nhỏ."
        },
        {
          stepNumber: 5,
          ideOrTool: "Trình duyệt Web",
          actionTitle: "Kiểm Tra App Shell Trên Trình Duyệt",
          detailedInstruction: "Mở trình duyệt truy cập http://localhost:8085/index.html. Bấm thử vào các liên kết trên thanh điều hướng để kiểm tra URL hash thay đổi và các view tương ứng được nạp bất đồng bộ mượt mà.",
          commandOrPath: "Truy cập http://localhost:8085/index.html",
          expectedResult: "Giao diện Shell chuẩn Fiori Morning Horizon xuất hiện, chuyển trang mượt mà không bị reload lại trang.",
          fresherGotcha: "Mở F12 Console để chắc chắn không có lỗi đỏ 404 về việc thiếu file view hay controller nào."
        }
      ]
    },

    // -------------------------------------------------------------------------------------------------
    // CHƯƠNG 5
    // -------------------------------------------------------------------------------------------------
    {
      id: "chap5",
      step: 5,
      title: "Chương 5: Xây Dựng Dashboard & Technical Catalog (Giao Diện Freestyle Chuẩn Horizon)",
      summary: "Triển khai Dashboard với KPI Cards, Learning Tracks và Technical Catalog với FilterBar đa tiêu chí và Responsive Table chuẩn Morning Horizon.",
      image: "img/guideline/02_catalog_view.png",
      imageCaption: "Giao diện Technical Catalog với FilterBar lọc theo danh mục, độ khó và tìm kiếm live.",
      prerequisites: [
        "Hoàn thành Chương 4.",
        "Hiểu cơ chế Data Binding JSON Model và sap.ui.model.Filter."
      ],
      cliCommands: [
        "npm test"
      ],
      primaryFile: "Catalog.view.xml",
      primaryFilePath: "src/frontend/webapp/view/Catalog.view.xml",
      codeSnippet: "<mvc:View\n    controllerName=\"sap.fiori.tech.academy.controller.Catalog\"\n    xmlns:mvc=\"sap.ui.core.mvc\"\n    xmlns=\"sap.m\"\n    xmlns:f=\"sap.f\">\n    <Page title=\"Technical Catalog Explorer\" showNavButton=\"true\" navButtonPress=\".onNavBack\">\n        <content>\n            <Table\n                id=\"topicsTable\"\n                items=\"{catalog>/topics}\"\n                mode=\"SingleSelectMaster\"\n                selectionChange=\".onTopicSelect\"\n                growing=\"true\"\n                growingThreshold=\"15\">\n                <headerToolbar>\n                    <OverflowToolbar>\n                        <Title text=\"Danh Sách Chuyên Đề Kỹ Thuật\" level=\"H3\" />\n                        <ToolbarSpacer />\n                        <SearchField width=\"300px\" search=\".onSearch\" liveChange=\".onSearch\" />\n                    </OverflowToolbar>\n                </headerToolbar>\n                <columns>\n                    <Column width=\"14rem\"><Text text=\"Chuyên Đề (Topic)\" /></Column>\n                    <Column minScreenWidth=\"Tablet\" demandPopin=\"true\"><Text text=\"Phân Loại\" /></Column>\n                    <Column minScreenWidth=\"Desktop\" demandPopin=\"true\"><Text text=\"Độ Khó\" /></Column>\n                </columns>\n            </Table>\n        </content>\n    </Page>\n</mvc:View>",
      annotatedLines: [
        {
          line: 7,
          code: "            <Table",
          role: "Bảng Dữ Liệu Responsive (sap.m.Table)",
          explanation: "Hiển thị danh sách 80+ topics kỹ thuật với khả năng co giãn cột thông minh theo màn hình.",
          tips: "Đặt growing='true' và growingThreshold='15' để phân trang cuộn mượt mà."
        },
        {
          line: 16,
          code: "                        <SearchField width=\"300px\" search=\".onSearch\" liveChange=\".onSearch\" />",
          role: "Tìm Kiếm Tức Thì (Live Search)",
          explanation: "Bắt sự kiện liveChange để lọc dữ liệu ngay khi người dùng gõ từng ký tự mà không cần nhấn Enter.",
          tips: "Sử dụng FilterOperator.Contains để tìm kiếm không phân biệt hoa thường."
        },
        {
          line: 20,
          code: "                    <Column minScreenWidth=\"Tablet\" demandPopin=\"true\"><Text text=\"Phân Loại\" /></Column>",
          role: "Cột Co Giãn Thông Minh (demandPopin)",
          explanation: "Khi màn hình thu nhỏ xuống kích thước Tablet, cột này tự động gập xuống dòng phụ (Pop-in) để không làm vỡ giao diện bảng.",
          tips: "Quy tắc vàng cho thiết kế Responsive Fiori trên thiết bị di động."
        }
      ],
      steps: [
        {
          stepNumber: 1,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tạo File Dữ Liệu Từ Điển technical_catalog.json",
          detailedInstruction: "Tạo file 'src/frontend/webapp/mockdata/technical_catalog.json' chứa 10 Categories kỹ thuật (Architecture, UI5 Core, Fiori Elements, Freestyle, OData V4, RAP Basics, RAP Advanced, Security, Integration, Testing) và 80+ topics chi tiết.",
          commandOrPath: "src/frontend/webapp/mockdata/technical_catalog.json",
          expectedResult: "Tập dữ liệu từ điển kỹ thuật hoàn chỉnh sẵn sàng phục vụ tra cứu.",
          fresherGotcha: "Đảm bảo mỗi topic đều có id, title, category, difficulty (Beginner, Intermediate, Advanced) để phục vụ bộ lọc."
        },
        {
          stepNumber: 2,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Khai Báo Model Catalog Trong manifest.json",
          detailedInstruction: "Trong khối models của manifest.json, khai báo model có tên 'catalog' trỏ tới file mockdata/technical_catalog.json với type: 'sap.ui.model.json.JSONModel'.",
          commandOrPath: "\"catalog\": { \"type\": \"sap.ui.model.json.JSONModel\", \"uri\": \"mockdata/technical_catalog.json\" }",
          expectedResult: "Model catalog được tự động khởi tạo và chia sẻ toàn cục cho mọi view.",
          fresherGotcha: "Đặt tên model ngắn gọn, dễ nhớ để tiện gọi trong biểu thức binding dạng {catalog>/topics}."
        },
        {
          stepNumber: 3,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tạo Catalog.view.xml Với Table & Bộ Lọc Đa Tiêu Chí",
          detailedInstruction: "Tạo file 'src/frontend/webapp/view/Catalog.view.xml'. Bố trí một FilterBar chứa Select chọn danh mục, Select chọn độ khó và SearchField tìm kiếm theo từ khóa. Phía dưới là sap.m.Table bind tới items='{catalog>/topics}'.",
          commandOrPath: "src/frontend/webapp/view/Catalog.view.xml",
          expectedResult: "Giao diện tra cứu chuyên nghiệp hiển thị đầy đủ thông tin chuyên đề, độ khó và trạng thái.",
          fresherGotcha: "Sử dụng thuộc tính wrapping='true' trên các Text cell để câu chữ hiển thị trọn vẹn, không bị cắt thành dấu '...'."
        },
        {
          stepNumber: 4,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Viết Controller Catalog.controller.js Xử Lý Lọc Live",
          detailedInstruction: "Tạo file 'src/frontend/webapp/controller/Catalog.controller.js'. Viết hàm onSearch và onFilterChange: kết hợp các điều kiện lọc thành mảng aFilters sử dụng FilterOperator.Contains và FilterOperator.EQ, sau đó áp dụng vào binding của Table bằng oBinding.filter(aFilters).",
          commandOrPath: "src/frontend/webapp/controller/Catalog.controller.js",
          expectedResult: "Bảng dữ liệu lọc tức thì và mượt mà khi người dùng thao tác trên thanh bộ lọc.",
          fresherGotcha: "Nhớ dùng toán tử and: true khi kết hợp nhiều filter khác loại (danh mục VÀ độ khó VÀ từ khóa)."
        },
        {
          stepNumber: 5,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tạo CodeExplorer.view.xml Hiển Thị Full Mã Nguồn",
          detailedInstruction: "Tạo file 'src/frontend/webapp/view/CodeExplorer.view.xml' để khi người dùng click vào một topic thì chuyển sang xem toàn bộ mã nguồn liên quan. Áp dụng class 'academyFullCodeView' để code hiển thị 100% full trang mà không bị thanh cuộn con giới hạn chiều cao.",
          commandOrPath: "src/frontend/webapp/view/CodeExplorer.view.xml",
          expectedResult: "Người học cuộn cả trang đọc mã nguồn CDS, BDEF, ABAP, XML, JS liền mạch tự nhiên.",
          fresherGotcha: "Tránh đặt thuộc tính height cố định (như 400px hay 500px) trên khối hiển thị code."
        }
      ]
    },

    // -------------------------------------------------------------------------------------------------
    // CHƯƠNG 6
    // -------------------------------------------------------------------------------------------------
    {
      id: "chap6",
      step: 6,
      title: "Chương 6: Fiori Elements V4 Lab & Live Side Effects (Building Blocks & Annotations)",
      summary: "Thực hành Fiori Elements Flexible Programming Model (FPM), tích hợp Building Blocks Table/FilterBar và kiểm chứng cơ chế Side Effects tính tổng tiền tự động.",
      image: "img/guideline/05_fiori_elements_lab_view.png",
      imageCaption: "Phòng Lab Fiori Elements V4 kiểm chứng Live Side Effects và ETag OCC.",
      prerequisites: [
        "Hoàn thành Chương 5.",
        "Hiểu cú pháp OData Vocabularies và Flexible Programming Model."
      ],
      cliCommands: [
        "npm start"
      ],
      primaryFile: "annotations.xml",
      primaryFilePath: "src/frontend/webapp/localService/annotations.xml",
      codeSnippet: "<!-- Khai báo Side Effects trong OData V4 Annotations -->\n<Annotation Term=\"Common.SideEffects\" Qualifier=\"ItemPriceChanged\">\n  <Record Type=\"Common.SideEffectsType\">\n    <PropertyValue Property=\"SourceProperties\">\n      <Collection>\n        <PropertyPath>Quantity</PropertyPath>\n        <PropertyPath>UnitPrice</PropertyPath>\n      </Collection>\n    </PropertyValue>\n    <PropertyValue Property=\"TargetProperties\">\n      <Collection>\n        <PropertyPath>LineTotal</PropertyPath>\n        <PropertyPath>_Header/TotalAmount</PropertyPath>\n      </Collection>\n    </PropertyValue>\n  </Record>\n</Annotation>",
      annotatedLines: [
        {
          line: 2,
          code: "<Annotation Term=\"Common.SideEffects\" Qualifier=\"ItemPriceChanged\">",
          role: "Khai Báo Side Effects Annotation",
          explanation: "Định nghĩa quy tắc phản xạ dữ liệu: khi thuộc tính nguồn thay đổi, frontend tự động yêu cầu backend tính lại thuộc tính đích.",
          tips: "Là cơ chế cốt lõi để tự động cập nhật tổng tiền mà không cần bấm nút reload."
        },
        {
          line: 6,
          code: "        <PropertyPath>Quantity</PropertyPath>",
          role: "Thuộc Tính Nguồn (Source Properties)",
          explanation: "Trường dữ liệu mà người dùng chỉnh sửa trên giao diện (Số lượng và Đơn giá).",
          tips: "Khi người dùng rời con trỏ khỏi ô này, sự kiện Side Effects lập tức được kích hoạt."
        },
        {
          line: 13,
          code: "        <PropertyPath>_Header/TotalAmount</PropertyPath>",
          role: "Thuộc Tính Đích (Target Properties)",
          explanation: "Trường dữ liệu được làm mới tự động từ server (Tổng tiền dòng con và Tổng tiền trên Header cha).",
          tips: "Có thể trỏ xuyên navigation qua liên kết _Header/TotalAmount."
        }
      ],
      steps: [
        {
          stepNumber: 1,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tạo Vocabularies Annotations (annotations.xml)",
          detailedInstruction: "Tạo file 'src/frontend/webapp/localService/annotations.xml'. Khai báo các vocabularies chuẩn: @UI.LineItem (các cột bảng), @UI.HeaderInfo (tiêu đề trang), @UI.SelectionFields (bộ lọc tìm kiếm) và @Common.SideEffects (phản xạ tính toán).",
          commandOrPath: "src/frontend/webapp/localService/annotations.xml",
          expectedResult: "File annotations chuẩn OData V4 định nghĩa toàn bộ hành vi giao diện mà không cần viết code JS thủ công.",
          fresherGotcha: "Kiểm tra đúng namespace EDMX: xmlns:edmx='http://docs.oasis-open.org/odata/ns/edmx'."
        },
        {
          stepNumber: 2,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tạo View Phòng Lab FioriElementsLab.view.xml",
          detailedInstruction: "Tạo file 'src/frontend/webapp/view/FioriElementsLab.view.xml'. Sử dụng các FPM Building Blocks: <macros:FilterBar id='feFilterBar' metaPath='@UI.SelectionFields' /> và <macros:Table id='feTable' metaPath='@UI.LineItem' />.",
          commandOrPath: "src/frontend/webapp/view/FioriElementsLab.view.xml",
          expectedResult: "Building Blocks tự động sinh giao diện bảng và bộ lọc dựa trên metadata và annotations.",
          fresherGotcha: "Đảm bảo đã khai báo namespace xmlns:macros='sap.fe.macros' ở thẻ mvc:View."
        },
        {
          stepNumber: 3,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Cấu Hình Side Effects Tự Động Tính Toán Tổng Tiền",
          detailedInstruction: "Trong annotations.xml, định nghĩa Common.SideEffects: SourceProperties gồm Quantity và UnitPrice; TargetProperties gồm LineTotal và _Header/TotalAmount. Cấu hình mockserver xử lý tự động nhân Quantity * UnitPrice và cộng dồn TotalAmount.",
          commandOrPath: "Common.SideEffects -> Source: Quantity, UnitPrice -> Target: TotalAmount",
          expectedResult: "Khi sửa giá trị ô Quantity hoặc UnitPrice, trường LineTotal và Tổng Tiền trên Header tự nhảy số mới ngay lập tức.",
          fresherGotcha: "Mockserver phải được kích hoạt middleware fe-mockserver để giả lập phản hồi Side Effects local."
        },
        {
          stepNumber: 4,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tạo Controller Extension Cho Fiori Elements",
          detailedInstruction: "Tạo file 'src/frontend/webapp/ext/controller/ListReportExtension.controller.js' kế thừa 'sap/ui/core/mvc/ControllerExtension'. Override hook 'onPageReady' để log trạng thái trang và thêm Custom Action 'onCustomHeaderAction'.",
          commandOrPath: "src/frontend/webapp/ext/controller/ListReportExtension.controller.js",
          expectedResult: "Controller Extension mở rộng tính năng của template chuẩn mà không can thiệp vào mã nguồn gốc của SAP.",
          fresherGotcha: "Khai báo extension trong manifest.json tại khối sap.ui5 -> extends -> extensions."
        },
        {
          stepNumber: 5,
          ideOrTool: "Trình duyệt Web",
          actionTitle: "Kiểm Thử Thực Tế Kịch Bản Side Effects",
          detailedInstruction: "Mở menu 'Fiori Elements Lab' trên ứng dụng. Chọn một dòng trên bảng, chỉnh sửa ô 'Số Lượng' từ 2 thành 5 và nhấn Enter hoặc Tab ra ngoài. Quan sát tổng tiền tức thì cập nhật tự động với hiệu ứng làm mới mượt mà.",
          commandOrPath: "Truy cập http://localhost:8085/index.html#/fe-lab -> Sửa Quantity -> Quan sát TotalAmount",
          expectedResult: "Side Effects hoạt động hoàn hảo 100%, kiểm chứng trực quan cơ chế phản xạ OData V4.",
          fresherGotcha: "Mở F12 Network tab để quan sát request PATCH và response trả về giá trị TotalAmount mới."
        }
      ]
    },

    // -------------------------------------------------------------------------------------------------
    // CHƯƠNG 7
    // -------------------------------------------------------------------------------------------------
    {
      id: "chap7",
      step: 7,
      title: "Chương 7: Freestyle SAPUI5 MVC Lab, Custom Control & MessageManager",
      summary: "Xây dựng Custom Control kế thừa sap.ui.core.Control với RenderManager và quản lý lỗi tập trung qua SAPUI5 Core MessageManager.",
      image: "img/guideline/10_freestyle_lab_view.png",
      imageCaption: "Phòng Lab Freestyle SAPUI5 với Custom Control đồng hồ Gauge và MessageManager Popover.",
      prerequisites: [
        "Hoàn thành Chương 6.",
        "Hiểu kiến trúc Control Metadata, Properties, Events và RenderManager."
      ],
      cliCommands: [
        "npm start"
      ],
      primaryFile: "TechnicalHealthGauge.js",
      primaryFilePath: "src/frontend/webapp/control/TechnicalHealthGauge.js",
      codeSnippet: "sap.ui.define([\n    \"sap/ui/core/Control\"\n], function (Control) {\n    \"use strict\";\n    return Control.extend(\"sap.fiori.tech.academy.control.TechnicalHealthGauge\", {\n        metadata: {\n            properties: {\n                value: { type: \"float\", defaultValue: 0 },\n                title: { type: \"string\", defaultValue: \"Health Index\" },\n                status: { type: \"string\", defaultValue: \"None\" }\n            },\n            events: {\n                press: {}\n            }\n        },\n        renderer: function (oRm, oControl) {\n            oRm.openStart(\"div\", oControl);\n            oRm.class(\"technicalHealthGaugeContainer\");\n            oRm.openEnd();\n            oRm.openStart(\"div\");\n            oRm.class(\"gaugeBarFill\");\n            oRm.style(\"width\", oControl.getValue() + \"%\");\n            oRm.openEnd();\n            oRm.close(\"div\");\n            oRm.close(\"div\");\n        }\n    });\n});",
      annotatedLines: [
        {
          line: 5,
          code: "    return Control.extend(\"sap.fiori.tech.academy.control.TechnicalHealthGauge\", {",
          role: "Kế Thừa sap.ui.core.Control",
          explanation: "Khởi tạo lớp điều khiển giao diện UI5 tùy biến hoàn toàn (Custom Control).",
          tips: "Namespace control phải khớp chính xác với thư mục vật lý src/frontend/webapp/control/."
        },
        {
          line: 16,
          code: "        renderer: function (oRm, oControl) {",
          role: "Hàm Vẽ Giao Diện (RenderManager)",
          explanation: "Sử dụng API oRm (openStart, class, style, openEnd, close) để sinh HTML DOM trực tiếp cho trình duyệt.",
          tips: "Luôn truyền tham số oControl vào openStart của thẻ gốc để UI5 gắn định danh DOM."
        },
        {
          line: 21,
          code: "            oRm.style(\"width\", oControl.getValue() + \"%\");",
          role: "Dynamic CSS Binding",
          explanation: "Điều khiển độ rộng của thanh tiến trình động dựa trên giá trị thuộc tính value của control.",
          tips: "Tránh gọi thao tác DOM trực tiếp qua jQuery, luôn dùng RenderManager để đảm bảo tương thích đa nền tảng."
        }
      ],
      steps: [
        {
          stepNumber: 1,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tạo Custom Control TechnicalHealthGauge.js",
          detailedInstruction: "Tạo thư mục 'src/frontend/webapp/control' và tạo file 'TechnicalHealthGauge.js'. Kế thừa sap/ui/core/Control, khai báo metadata properties (value, title, status) và events (press). Hiện thực hàm renderer với RenderManager.",
          commandOrPath: "src/frontend/webapp/control/TechnicalHealthGauge.js",
          expectedResult: "Custom Control thanh đo chỉ số kỹ thuật sẵn sàng nhúng vào bất kỳ XML View nào.",
          fresherGotcha: "Đảm bảo số lần gọi oRm.close khớp chính xác với số lần gọi oRm.openStart để thẻ HTML không bị vỡ cấu trúc."
        },
        {
          stepNumber: 2,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tạo Giao Diện FreestyleLab.view.xml",
          detailedInstruction: "Tạo file 'src/frontend/webapp/view/FreestyleLab.view.xml'. Khai báo namespace xmlns:custom='sap.fiori.tech.academy.control' và nhúng control <custom:TechnicalHealthGauge value='{freestyle>/healthIndex}' />.",
          commandOrPath: "src/frontend/webapp/view/FreestyleLab.view.xml",
          expectedResult: "Thanh đo tiến trình Gauge hiển thị mượt mà với hoạt họa chuyển màu trạng thái chuẩn Fiori.",
          fresherGotcha: "Thêm CSS định kiểu trong style.css cho các class .technicalHealthGaugeContainer và .gaugeBarFill."
        },
        {
          stepNumber: 3,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tích Hợp sap.ui.core.message.MessageManager",
          detailedInstruction: "Trong FreestyleLab.controller.js, lấy đối tượng Core MessageManager bằng sap.ui.getCore().getMessageManager(). Đăng ký đối tượng Input vào messageManager bằng lệnh: oMessageManager.registerObject(this.byId('inputEmail'), true).",
          commandOrPath: "sap.ui.getCore().getMessageManager().registerObject(oInput, true)",
          expectedResult: "Mọi vi phạm validation định dạng email hay số điện thoại tự động được thu thập vào MessageManager.",
          fresherGotcha: "MessageManager là cơ chế chuẩn duy nhất của SAPUI5 để quản lý thông báo lỗi tập trung trên form."
        },
        {
          stepNumber: 4,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tạo XML Fragment QuickInspectDialog.fragment.xml",
          detailedInstruction: "Tạo file 'src/frontend/webapp/fragment/QuickInspectDialog.fragment.xml' chứa Dialog tra cứu nhanh. Controller nạp fragment bất đồng bộ qua Fragment.load và mở dialog khi người dùng click vào Gauge.",
          commandOrPath: "src/frontend/webapp/fragment/QuickInspectDialog.fragment.xml",
          expectedResult: "Hộp thoại Dialog xuất hiện hiển thị chi tiết các chỉ số phân tích chuyên sâu.",
          fresherGotcha: "Luôn truyền this.getView().addDependent(oDialog) để Dialog kế thừa trọn vẹn toàn bộ models của View."
        },
        {
          stepNumber: 5,
          ideOrTool: "Trình duyệt Web",
          actionTitle: "Thử Nghiệm Form Nhập Liệu & MessagePopover",
          detailedInstruction: "Mở menu 'Freestyle Lab' trên ứng dụng. Thử nhập một địa chỉ email sai định dạng (ví dụ: 'abc@@xyz') và nhấn nút 'Kiểm Tra Hợp Lệ'. Quan sát viền đỏ cảnh báo và nút MessagePopover nhấp nháy ở góc dưới bên trái.",
          commandOrPath: "Truy cập http://localhost:8085/index.html#/freestyle-lab -> Nhập sai email -> Bấm Kiểm Tra",
          expectedResult: "MessagePopover bật lên hiển thị thông báo lỗi chi tiết theo chuẩn Fiori Message Handling.",
          fresherGotcha: "Nhấp vào dòng lỗi trên Popover sẽ tự động focus con trỏ chuột về đúng ô nhập liệu bị sai."
        }
      ]
    },

    // -------------------------------------------------------------------------------------------------
    // CHƯƠNG 8
    // -------------------------------------------------------------------------------------------------
    {
      id: "chap8",
      step: 8,
      title: "Chương 8: OData V4 Deep Dive, Batch Processing & Concurrency ETag (OCC)",
      summary: "Khám phá chuyên sâu giao thức OData V4: Gom nhóm multipart $batch, thực thi Bound Action approveHeader và kiểm soát xung đột đồng thời ETag OCC.",
      image: "img/guideline/14_odata_v4_lab_view.png",
      imageCaption: "Phòng Lab OData V4 mô phỏng cơ chế Batch Processing, Bound Actions và ETag Concurrency.",
      prerequisites: [
        "Hoàn thành Chương 7.",
        "Hiểu kiến trúc HTTP Headers (If-Match, ETag) và chuẩn OData V4 Batch specification."
      ],
      cliCommands: [
        "npm start"
      ],
      primaryFile: "ODataV4Lab.controller.js",
      primaryFilePath: "src/frontend/webapp/controller/ODataV4Lab.controller.js",
      codeSnippet: "// Mô phỏng kiểm tra Optimistic Concurrency Control (ETag)\nfunction executeOptimisticConcurrencyCheck(sCurrentETag, sIncomingETag) {\n    if (sCurrentETag !== sIncomingETag) {\n        return {\n            status: 412,\n            statusText: \"Precondition Failed\",\n            error: \"Lost Update Detected: Resource was modified by another transaction!\"\n        };\n    }\n    return {\n        status: 200,\n        statusText: \"OK\",\n        newETag: \"W/\\\"\" + Date.now() + \"\\\"\"\n    };\n}",
      annotatedLines: [
        {
          line: 2,
          code: "function executeOptimisticConcurrencyCheck(sCurrentETag, sIncomingETag) {",
          role: "Thuật Toán Thẩm Định ETag OCC",
          explanation: "So sánh giá trị ETag của client gửi lên với ETag hiện tại trên máy chủ SAP để phát hiện xung đột dữ liệu.",
          tips: "Là nền tảng ngăn chặn tình trạng ghi đè mất mát dữ liệu (Lost Update) khi 2 người cùng sửa 1 bản ghi."
        },
        {
          line: 4,
          code: "            status: 412,",
          role: "Mã Lỗi HTTP 412 Precondition Failed",
          explanation: "Mã chuẩn quốc tế được máy chủ trả về khi giá trị If-Match không khớp với ETag hiện tại của bản ghi.",
          tips: "Fiori UI tự động bắt mã này để hiện thông báo: 'Dữ liệu đã bị người khác thay đổi, vui lòng tải lại trang'."
        },
        {
          line: 12,
          code: "        newETag: \"W/\\\"\" + Date.now() + \"\\\"\"",
          role: "Sinh ETag Mới Sau Khi Cập Nhật",
          explanation: "Khi cập nhật thành công, server tự động cập nhật trường thời gian LastChangedAt để tạo ETag mới.",
          tips: "ETag trong RAP thường bắt đầu bằng ký hiệu Weak ETag W/\"...\"."
        }
      ],
      steps: [
        {
          stepNumber: 1,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Tạo Giao Diện ODataV4Lab.view.xml",
          detailedInstruction: "Tạo file 'src/frontend/webapp/view/ODataV4Lab.view.xml'. Thiết kế 4 tab chuyên sâu: Tab 1 Query Execution ($expand, $filter), Tab 2 Batch Processing ($batch ChangeSet), Tab 3 Bound Actions (approveHeader), Tab 4 Concurrency Control (ETag OCC).",
          commandOrPath: "src/frontend/webapp/view/ODataV4Lab.view.xml",
          expectedResult: "Giao diện phòng lab OData V4 trực quan với bảng điều khiển mô phỏng từng cơ chế mạng.",
          fresherGotcha: "Chia tab bằng sap.m.IconTabBar giúp người học dễ dàng tập trung vào từng kịch bản kỹ thuật."
        },
        {
          stepNumber: 2,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Mô Phỏng Cơ Chế Gom Nhóm Multipart $batch",
          detailedInstruction: "Trong ODataV4Lab.controller.js, xây dựng payload multipart MIME mô phỏng request POST tới endpoint /$batch. Gom 2 thao tác tạo mới Item vào một ChangeSet duy nhất có ranh giới boundary.",
          commandOrPath: "POST /mock/odata/v4/demo/$batch (Content-Type: multipart/mixed)",
          expectedResult: "Toàn bộ các thao tác được gửi đi trong 1 HTTP request duy nhất, tối ưu 80% thời gian roundtrip mạng.",
          fresherGotcha: "Trong OData V4, các thao tác trong cùng ChangeSet là một Transaction: một thao tác lỗi thì toàn bộ bị rollback."
        },
        {
          stepNumber: 3,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Thực Thi Bound Action approveHeader",
          detailedInstruction: "Tạo hàm onExecuteBoundAction gọi action 'com.sap.gateway.srvd.zui_demo_o4.v0001.approveHeader'. Gửi request POST tới URL thực thể và cập nhật trạng thái StatusCode từ 'IP' (In Process) thành 'AP' (Approved).",
          commandOrPath: "POST /mock/odata/v4/demo/DemoHeader(guid'...')/approveHeader",
          expectedResult: "Trạng thái bản ghi chuyển sang màu xanh Approved và trường StatusCode đổi thành AP.",
          fresherGotcha: "Bound Action gắn liền với 1 instance cụ thể, khác với Unbound Action gọi trực tiếp từ Service Root."
        },
        {
          stepNumber: 4,
          ideOrTool: "Visual Studio Code",
          actionTitle: "Thực Nghiệm Cơ Chế If-Match ETag OCC",
          detailedInstruction: "Xây dựng kịch bản mô phỏng xung đột: Giao dịch A đọc bản ghi có ETag 'v1'. Giao dịch B cập nhật bản ghi thành 'v2'. Khi Giao dịch A gửi request UPDATE kèm header If-Match: 'v1', server lập tức chặn lại và trả về mã lỗi 412 Precondition Failed.",
          commandOrPath: "Request Header: If-Match: \"v1\" -> Server ETag: \"v2\" -> 412 Precondition Failed",
          expectedResult: "Thông báo lỗi Lost Update xuất hiện rõ ràng, bảo vệ tính toàn vẹn của cơ sở dữ liệu.",
          fresherGotcha: "Nếu không gửi header If-Match, request sẽ bị coi là ép ghi (Blind Overwrite) và gây mất mát dữ liệu."
        },
        {
          stepNumber: 5,
          ideOrTool: "Trình duyệt Web",
          actionTitle: "Kiểm Tra Hoạt Động Toàn Diện Tại OData Lab",
          detailedInstruction: "Mở menu 'OData V4 Lab' trên ứng dụng, bấm thử các nút: 'Chạy Query $expand', 'Gửi Batch Request', 'Thực Thi Bound Action', 'Thử Nghiệm ETag Conflict' và quan sát log JSON phản hồi chi tiết ngay bên dưới.",
          commandOrPath: "Truy cập http://localhost:8085/index.html#/odata-lab",
          expectedResult: "Hiển thị đầy đủ Payload gửi đi, HTTP Headers và Response trả về của từng kịch bản.",
          fresherGotcha: "Đây là công cụ trực quan tốt nhất để fresher hiểu rõ bản chất luồng dữ liệu OData V4 dưới tầng giao vận."
        }
      ]
    },

    // -------------------------------------------------------------------------------------------------
    // CHƯƠNG 9
    // -------------------------------------------------------------------------------------------------
    {
      id: "chap9",
      step: 9,
      title: "Chương 9: Xây Dựng ABAP RAP Backend Trong Eclipse ADT: Từ Database Table Đến CDS View Entity",
      summary: "Hướng dẫn thực chiến từng click chuột trong Eclipse ADT: Tạo Database Table, CDS View Entity Gốc và CDS View Con trên SAP S/4HANA 2025.",
      image: "img/guideline/03_code_explorer_view.png",
      imageCaption: "Mã nguồn CDS View Entity gốc ZI_DemoHeaderTP định nghĩa cấu trúc Data Model và Composition.",
      prerequisites: [
        "Hoàn thành Chương 1 (Eclipse ADT đã kết nối thành công tới SAP S/4HANA 2025 Client 100).",
        "Đã được phân bổ Package ZNGHIANDD_TEST và Transport Request S4DK911884."
      ],
      cliCommands: [
        "Eclipse ADT: Ctrl + F3 (Activate)",
        "Eclipse ADT: F8 (Data Preview on CDS View)"
      ],
      primaryFile: "zr_demoheadertp.ddls.asddls",
      primaryFilePath: "src/backend/rap/cds-views/zr_demoheadertp.ddls.asddls",
      codeSnippet: "@AccessControl.authorizationCheck: #NOT_REQUIRED\n@EndUserText.label: 'Root CDS View Entity Demo Header'\ndefine root view entity ZI_DemoHeaderTP\n  as select from zdemo_header\n  composition [0..*] of ZI_DemoItemTP as _Items\n{\n  key header_uuid           as HeaderUUID,\n      header_id             as HeaderId,\n      category              as Category,\n      status_code           as StatusCode,\n      @Semantics.amount.currencyCode: 'CurrencyCode'\n      total_amount          as TotalAmount,\n      currency_code         as CurrencyCode,\n      @Semantics.systemDateTime.localInstanceLastChangedAt: true\n      local_last_changed_at as LocalLastChangedAt,\n      @Semantics.systemDateTime.lastChangedAt: true\n      last_changed_at       as LastChangedAt,\n      _Items\n}",
      annotatedLines: [
        {
          line: 1,
          code: "@AccessControl.authorizationCheck: #NOT_REQUIRED",
          role: "Kiểm Quyền Truy Cập CDS (DCL)",
          explanation: "Chỉ định xem CDS View Entity có bắt buộc phải kiểm tra phân quyền qua DCL hay không.",
          tips: "Dùng #NOT_REQUIRED cho giai đoạn test; khi triển khai production đổi thành #CHECK."
        },
        {
          line: 3,
          code: "define root view entity ZI_DemoHeaderTP",
          role: "Định Nghĩa Root CDS View Entity",
          explanation: "Khai báo ZI_DemoHeaderTP là thực thể Gốc (Root) của Business Object trong mô hình RAP.",
          tips: "Từ khóa 'root' là bắt buộc để entity có thể sở hữu Behavior Definition."
        },
        {
          line: 5,
          code: "  composition [0..*] of ZI_DemoItemTP as _Items",
          role: "Quan Hệ Cha - Con (Composition)",
          explanation: "Định nghĩa quan hệ cha - con khăng khít: vòng đời của con ZI_DemoItemTP hoàn toàn phụ thuộc vào cha.",
          tips: "Khi cha bị xóa, toàn bộ các bản ghi con sẽ tự động bị xóa theo."
        },
        {
          line: 7,
          code: "  key header_uuid           as HeaderUUID,",
          role: "Khóa Chính Kỹ Thuật GUID",
          explanation: "Sử dụng trường GUID 16 bytes làm khóa chính đại diện (Surrogate Key) theo chuẩn Clean Core.",
          tips: "Trường khóa kỹ thuật giúp việc tái cấu trúc dữ liệu không ảnh hưởng tới logic hệ thống."
        },
        {
          line: 13,
          code: "      @Semantics.systemDateTime.localInstanceLastChangedAt: true",
          role: "ETag Master Phục Vụ Concurrency Control",
          explanation: "Trường thời gian lưu mốc sửa đổi cuối cùng của riêng instance này, dùng làm ETag Master.",
          tips: "Bắt buộc phải có để kích hoạt cơ chế Optimistic Concurrency Control trong RAP."
        }
      ],
      steps: [
        {
          stepNumber: 1,
          ideOrTool: "Eclipse ADT",
          actionTitle: "Ghim Package ZNGHIANDD_TEST Vào Favorite Packages",
          detailedInstruction: "Mở Eclipse ADT, trong cửa sổ Project Explorer, mở ABAP Cloud Project của hệ thống S/4HANA 2025. Nhấp chuột phải vào mục 'Favorite Packages' -> chọn 'Add Package...'. Nhập tên package chính thức: 'ZNGHIANDD_TEST' và bấm 'OK'. Package làm việc của bạn sẽ được ghim ngay ở vị trí đầu tiên dễ dàng thao tác.",
          commandOrPath: "Project Explorer -> Favorite Packages -> Add Package -> ZNGHIANDD_TEST",
          expectedResult: "Package ZNGHIANDD_TEST xuất hiện trong Favorite Packages, sẵn sàng tạo mới đối tượng.",
          fresherGotcha: "Mọi đối tượng của bạn phải nằm trong package này để tuân thủ quy tắc an toàn bảo vệ object của dự án."
        },
        {
          stepNumber: 2,
          ideOrTool: "Eclipse ADT",
          actionTitle: "Tạo Database Table Gốc: ZDEMO_HEADER",
          detailedInstruction: "Nhấp chuột phải vào Package ZNGHIANDD_TEST -> chọn 'New' -> chọn 'Other ABAP Repository Object...'. Tại ô tìm kiếm gõ 'Database Table' (loại TABL/DT) -> bấm 'Next'. Đặt tên Name: 'ZDEMO_HEADER', Description: 'Demo Header Database Table'. Bấm 'Next', chọn Transport Request: 'S4DK911884' -> bấm 'Finish'. Dán mã DDL định nghĩa các trường dữ liệu. Nhấn phím tắt 'Ctrl+F3' để kích hoạt bảng.",
          commandOrPath: "New -> Database Table -> Name: ZDEMO_HEADER -> TR: S4DK911884 -> Nhấn Ctrl+F3",
          expectedResult: "Bảng vật lý ZDEMO_HEADER được tạo thành công và kích hoạt Active 100% trên SAP HANA Database.",
          fresherGotcha: "Luôn nhấn phím tắt Ctrl+F3 (Activate) sau khi sửa code; nếu chỉ bấm Ctrl+S (Save) thì code vẫn ở trạng thái Inactive và không dùng được."
        },
        {
          stepNumber: 3,
          ideOrTool: "Eclipse ADT",
          actionTitle: "Tạo Database Table Con: ZDEMO_ITEM",
          detailedInstruction: "Tương tự Bước 2, nhấp chuột phải vào Package ZNGHIANDD_TEST -> 'New' -> 'Other ABAP Repository Object...' -> 'Database Table'. Đặt tên Name: 'ZDEMO_ITEM', Description: 'Demo Item Composition Table'. Gán TR: 'S4DK911884' -> bấm 'Finish'. Khai báo các trường: item_uuid (key), header_uuid (foreign key), item_id, product_name, quantity, unit_price, line_total. Nhấn 'Ctrl+F3' để kích hoạt.",
          commandOrPath: "New -> Database Table -> Name: ZDEMO_ITEM -> TR: S4DK911884 -> Nhấn Ctrl+F3",
          expectedResult: "Bảng con ZDEMO_ITEM được kích hoạt Active trên database.",
          fresherGotcha: "Trường header_uuid trong bảng con phải có cùng kiểu dữ liệu sysuuid_x16 với header_uuid của bảng cha."
        },
        {
          stepNumber: 4,
          ideOrTool: "Eclipse ADT",
          actionTitle: "Tạo Root CDS View Entity: ZI_DemoHeaderTP",
          detailedInstruction: "Nhấp chuột phải vào Package ZNGHIANDD_TEST -> 'New' -> 'Other ABAP Repository Object...' -> chọn 'Core Data Services' -> chọn 'Data Definition' (loại DDLS/DF) -> bấm 'Next'. Đặt tên Name: 'ZI_DemoHeaderTP', Description: 'Root View Entity Demo Header'. Bấm 'Next', chọn TR 'S4DK911884', bấm 'Next' đến màn hình Templates: chọn template 'Define Root View Entity' -> bấm 'Finish'. Viết mã CDS Entity kèm composition tới ZI_DemoItemTP. Nhấn 'Ctrl+F3' để kích hoạt.",
          commandOrPath: "New -> Data Definition -> Name: ZI_DemoHeaderTP -> Template: Define Root View Entity -> Ctrl+F3",
          expectedResult: "Root CDS View Entity ZI_DemoHeaderTP được kích hoạt Active 100%.",
          fresherGotcha: "Trong S/4HANA 2025, luôn dùng 'define root view entity', tuyệt đối không dùng cú pháp cũ 'define root view' (DDIC-based CDS view)."
        },
        {
          stepNumber: 5,
          ideOrTool: "Eclipse ADT",
          actionTitle: "Tạo Child CDS View Entity: ZI_DemoItemTP",
          detailedInstruction: "Nhấp chuột phải vào Package -> 'New' -> 'Data Definition'. Tên Name: 'ZI_DemoItemTP', Description: 'Child View Entity Demo Item'. Chọn template 'Define View Entity'. Viết mã khai báo association to parent ZI_DemoHeaderTP as _Header. Nhấn 'Ctrl+F3' để kích hoạt.",
          commandOrPath: "New -> Data Definition -> Name: ZI_DemoItemTP -> Template: Define View Entity -> Ctrl+F3",
          expectedResult: "Child CDS View Entity ZI_DemoItemTP được kích hoạt Active.",
          fresherGotcha: "Khóa chính của CDS con bắt buộc phải chứa trường khóa cha (_Header.HeaderUUID) để RAP duy trì cây phân cấp."
        },
        {
          stepNumber: 6,
          ideOrTool: "Eclipse ADT",
          actionTitle: "Xem Thử Dữ Liệu CDS Bằng Phím Tắt F8 (Data Preview)",
          detailedInstruction: "Mở file CDS View ZI_DemoHeaderTP vừa tạo, nhấn phím 'F8' trên bàn phím (hoặc chuột phải chọn 'Open Data Preview'). Cửa sổ Data Preview sẽ mở ra hiển thị các cột dữ liệu trực quan ngay trong Eclipse.",
          commandOrPath: "Nhấn phím F8 trên CDS View (Open Data Preview)",
          expectedResult: "Cửa sổ Data Preview mở ra không có lỗi cú pháp, xác nhận tầng Data Model đã sẵn sàng 100%.",
          fresherGotcha: "F8 là phím tắt vàng trong Eclipse ADT để kiểm tra nhanh kết quả query của bất kỳ CDS View Entity nào."
        }
      ]
    },

    // -------------------------------------------------------------------------------------------------
    // CHƯƠNG 10
    // -------------------------------------------------------------------------------------------------
    {
      id: "chap10",
      step: 10,
      title: "Chương 10: Hoàn Thiện RAP Business Object: Behavior Definition, Class Handler & OData V4 Service Binding",
      summary: "Xây dựng Behavior Definition Managed strict(2), sinh code Handler Class bằng phím tắt Ctrl+1, tạo Service Definition và kích hoạt OData V4 Service Binding xem Fiori Elements Preview.",
      image: "img/guideline/08_fresher_guideline_view.png",
      imageCaption: "Mã nguồn Behavior Definition BDEF định nghĩa Managed Architecture, Draft Semantics và Actions.",
      prerequisites: [
        "Hoàn thành Chương 9 (đã kích hoạt thành công CDS View Entities trên hệ thống SAP S/4HANA 2025)."
      ],
      cliCommands: [
        "Eclipse ADT: Ctrl + 1 (Quick Assist -> Create Behavior Implementation Class)",
        "Eclipse ADT: Ctrl + F3 (Activate Object)",
        "Service Binding: Bấm nút Publish -> Bấm Preview"
      ],
      primaryFile: "zr_demoheadertp.bdef.asbdef",
      primaryFilePath: "src/backend/rap/behavior/zr_demoheadertp.bdef.asbdef",
      codeSnippet: "managed implementation in class ZBP_I_DEMOHEADERTP unique;\nstrict ( 2 );\nwith draft;\n\ndefine behavior for ZI_DemoHeaderTP alias DemoHeader\npersistent table zdemo_header\ndraft table zdemo_header_d\nlock master\ntotal etag LastChangedAt\netag master LocalLastChangedAt\n{\n  create;\n  update;\n  delete;\n  association _Items { create; with draft; }\n\n  field ( readonly, numbering : managed ) HeaderUUID;\n  field ( readonly ) StatusCode, TotalAmount, LocalLastChangedAt, LastChangedAt;\n\n  draft action Edit;\n  draft action Activate optimized;\n  draft action Discard;\n  draft action Resume;\n  draft determine action Prepare {\n    validation validateStatusCode;\n  }\n\n  action calculateTotals result [1] $self;\n  determination calculateTotalAmount on modify { create; field CurrencyCode; }\n  validation validateStatusCode on save { create; update; field StatusCode; }\n\n  side effects {\n    field CurrencyCode affects field TotalAmount;\n  }\n}",
      annotatedLines: [
        {
          line: 1,
          code: "managed implementation in class ZBP_I_DEMOHEADERTP unique;",
          role: "Managed RAP Architecture",
          explanation: "Khung kiến trúc Managed: RAP Framework tự động đảm nhiệm Create, Update, Delete, Draft và Transaction Buffer. Code tùy biến đặt trong behavior pool ZBP_I_DEMOHEADERTP.",
          tips: "Mô hình khuyến nghị cho Clean Core trên SAP S/4HANA 2025."
        },
        {
          line: 2,
          code: "strict ( 2 );",
          role: "Chế Độ Kiểm Tra Nghiêm Ngặt Strict(2)",
          explanation: "Bắt buộc mã nguồn BDEF phải tuân thủ các quy tắc hiện đại nhất của RAP, loại bỏ hoàn toàn cú pháp cũ lỗi thời.",
          tips: "Chuẩn mới nhất trên S/4HANA 2025 là strict(2)."
        },
        {
          line: 3,
          code: "with draft;",
          role: "Kích Hoạt Cơ Chế Bản Nháp (Draft)",
          explanation: "Cho phép người dùng chỉnh sửa dữ liệu dở dang mà không ảnh hưởng tới bảng Active chính. Dữ liệu nháp lưu ở Draft Table.",
          tips: "Cần có các draft action Edit, Activate, Discard, Resume."
        },
        {
          line: 16,
          code: "  field ( readonly, numbering : managed ) HeaderUUID;",
          role: "Tự Động Sinh GUID Khóa Chính (Managed Numbering)",
          explanation: "RAP Framework tự động sinh khóa chính GUID 16 bytes ngẫu nhiên duy nhất cho trường HeaderUUID khi tạo mới.",
          tips: "Không cần viết code logic sinh số trong behavior pool."
        },
        {
          line: 29,
          code: "  side effects {",
          role: "Khai Báo RAP Side Effects Trong BDEF",
          explanation: "Quy định mối quan hệ phản xạ dữ liệu: khi một trường thay đổi trên UI thì những trường nào khác phải được tự động làm mới từ server.",
          tips: "Cú pháp chuẩn trong strict(2) trên SAP S/4HANA 2025, thay thế việc cấu hình annotation thủ công."
        }
      ],
      steps: [
        {
          stepNumber: 1,
          ideOrTool: "Eclipse ADT",
          actionTitle: "Tạo Behavior Definition (BDEF Managed strict 2)",
          detailedInstruction: "Trong Eclipse ADT, tìm đến file CDS View ZI_DemoHeaderTP trong Project Explorer. Nhấp chuột phải vào file ZI_DemoHeaderTP -> chọn 'New Behavior Definition' (loại BDEF/BDO). Bấm 'Next', chọn TR 'S4DK911884', Implementation Type chọn 'Managed'. Bấm 'Finish'. Dán toàn bộ mã nguồn BDEF khai báo: managed, strict (2), with draft, persistent table zdemo_header, draft table zdemo_header_d, lock master, etag master.",
          commandOrPath: "Chuột phải ZI_DemoHeaderTP -> New Behavior Definition -> Managed -> Ctrl+F3",
          expectedResult: "Behavior Definition được tạo thành công và liên kết chặt chẽ với Root CDS View Entity.",
          fresherGotcha: "Tên draft table zdemo_header_d sẽ được RAP Framework tự động sinh ra khi bạn kích hoạt BDEF."
        },
        {
          stepNumber: 2,
          ideOrTool: "Eclipse ADT",
          actionTitle: "Khai Báo Determinations, Validations & RAP Side Effects",
          detailedInstruction: "Trong file BDEF, khai báo determination calculateTotalAmount on modify để tự động tính tiền khi đổi CurrencyCode. Khai báo validation validateStatusCode on save để kiểm tra trạng thái trước khi lưu. Khai báo khối 'side effects { field CurrencyCode affects field TotalAmount; }'. Nhấn phím 'Ctrl+F3' để kích hoạt BDEF.",
          commandOrPath: "BDEF: determination calculateTotalAmount | validation validateStatusCode | side effects",
          expectedResult: "BDEF compile thành công, cú pháp strict(2) được SAP Kernel chấp thuận không có cảnh báo lỗi.",
          fresherGotcha: "Trong draft application, bắt buộc phải đưa tên validation vào draft determine action Prepare."
        },
        {
          stepNumber: 3,
          ideOrTool: "Eclipse ADT",
          actionTitle: "Tự Động Sinh Behavior Pool Class Bằng Phím Tắt Ctrl+1",
          detailedInstruction: "Trong file BDEF, bạn sẽ thấy tên class 'ZBP_I_DEMOHEADERTP' có gạch chân màu vàng báo chưa tồn tại. Đặt con trỏ chuột tại tên class 'ZBP_I_DEMOHEADERTP', nhấn tổ hợp phím 'Ctrl+1' (Quick Assist) -> chọn dòng 'Create behavior implementation class for ZI_DemoHeaderTP'. Hộp thoại hiện ra, bấm 'Next', chọn TR 'S4DK911884' và bấm 'Finish'. Eclipse sẽ tự động sinh Class và tab Local Types!",
          commandOrPath: "Đặt con trỏ tại ZBP_I_DEMOHEADERTP -> Nhấn Ctrl + 1 -> Create behavior implementation class",
          expectedResult: "Class ZBP_I_DEMOHEADERTP được tự động sinh ra kèm khung sườn các method handler.",
          fresherGotcha: "Ctrl+1 là phím tắt thần thánh trong Eclipse ADT giúp bạn sinh code tự động 100% mà không phải gõ tay class vỏ bọc."
        },
        {
          stepNumber: 4,
          ideOrTool: "Eclipse ADT",
          actionTitle: "Viết Mã Nghiệp Vụ Bằng ABAP EML Trong Local Handler",
          detailedInstruction: "Mở file Class ZBP_I_DEMOHEADERTP vừa tạo, chuyển sang tab 'Local Types'. Tìm đến method 'calculateTotalAmount'. Sử dụng câu lệnh EML 'READ ENTITIES OF ZI_DemoHeaderTP IN LOCAL MODE' để đọc dữ liệu và 'MODIFY ENTITIES OF ZI_DemoHeaderTP IN LOCAL MODE' để cập nhật trường TotalAmount. Nhấn 'Ctrl+F3' để kích hoạt Class.",
          commandOrPath: "READ ENTITIES OF ZI_DemoHeaderTP IN LOCAL MODE ... MODIFY ENTITIES ... -> Nhấn Ctrl+F3",
          expectedResult: "Behavior Pool Class được kích hoạt Active 100% và sẵn sàng xử lý các thao tác tương tác.",
          fresherGotcha: "Luôn dùng từ khóa IN LOCAL MODE trong Behavior Handler để bỏ qua kiểm tra quyền và feature control nội bộ."
        },
        {
          stepNumber: 5,
          ideOrTool: "Eclipse ADT",
          actionTitle: "Tạo Service Definition (SRVD): ZUI_DEMO_HEADER_O4",
          detailedInstruction: "Nhấp chuột phải vào CDS View ZI_DemoHeaderTP -> chọn 'New Service Definition' (loại SRVD/SD) -> bấm 'Next'. Đặt tên Name: 'ZUI_DEMO_HEADER_O4', Description: 'Service Definition for Demo Header OData V4'. Bấm 'Next', chọn TR 'S4DK911884' -> bấm 'Finish'. Trong file, khai báo: 'expose ZI_DemoHeaderTP as DemoHeader;' và 'expose ZI_DemoItemTP as DemoItem;'. Nhấn 'Ctrl+F3' để kích hoạt.",
          commandOrPath: "New -> Service Definition -> Name: ZUI_DEMO_HEADER_O4 -> expose ZI_DemoHeaderTP -> Ctrl+F3",
          expectedResult: "Service Definition phơi bày 2 thực thể DemoHeader và DemoItem thành công.",
          fresherGotcha: "Dùng từ khóa 'as Alias' để đặt tên EntitySet thân thiện và dễ đọc hơn khi chuyển thành endpoint OData."
        },
        {
          stepNumber: 6,
          ideOrTool: "Eclipse ADT",
          actionTitle: "Tạo & Publish Service Binding: Trải Nghiệm Ứng Dụng",
          detailedInstruction: "Nhấp chuột phải vào Service Definition ZUI_DEMO_HEADER_O4 vừa tạo -> chọn 'New Service Binding' (loại SRVB/SB). Đặt tên Name: 'ZUI_DEMO_HEADER_O4_SB', Binding Type: chọn chính xác 'OData V4 - UI'. Bấm 'Next', chọn TR 'S4DK911884' -> bấm 'Finish'. Màn hình Service Binding mở ra, nhấp nút 'Publish' trên thanh công cụ. Chờ khoảng 10-15 giây đến khi cột Status hiện màu xanh 'Published'. Tại danh sách EntitySet, nhấp đúp vào 'DemoHeader' và bấm nút 'Preview'.",
          commandOrPath: "New -> Service Binding -> Type: OData V4 - UI -> Bấm Publish -> Chọn DemoHeader -> Bấm Preview",
          expectedResult: "Trình duyệt tự động mở ra ứng dụng Fiori Elements List Report hoàn chỉnh, tương tác trực tiếp với dữ liệu thật trên SAP S/4HANA 2025!",
          fresherGotcha: "Bấm Preview trong Service Binding là cách nhanh nhất và chuẩn xác nhất để lập trình viên ABAP kiểm tra giao diện Fiori mà không cần mở VS Code."
        }
      ]
    }
  ]
};

const outputPath = path.resolve(__dirname, '../src/frontend/webapp/mockdata/fresher_guideline.json');
fs.writeFileSync(outputPath, JSON.stringify(guidelineData, null, 2), 'utf8');
console.log('✅ Đã ghi thành công fresher_guideline.json siêu chi tiết tại:', outputPath);
console.log('Số chương:', guidelineData.chapters.length);
guidelineData.chapters.forEach(c => {
  console.log(`  - ${c.id}: ${c.title} (${c.steps.length} steps, ${c.annotatedLines.length} annotated lines)`);
});

