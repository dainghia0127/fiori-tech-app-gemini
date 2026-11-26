# TÀI LIỆU HƯỚNG DẪN SỬ DỤNG & VẬN HÀNH ỨNG DỤNG
## SAP FIORI TECHNICAL ACADEMY – V4
*(Sổ tay Vận hành, Kiểm thử Từng Chức năng & Chỉ Mục Tra cứu Trực quan)*

---

## MỤC LỤC (TABLE OF CONTENTS)

- [1. Giới Thiệu Tổng Quan Ứng Dụng](#1-giới-thiệu-tổng-quan-ứng-dụng)
- [2. Bộ Chuyển Đổi Chế Độ Thực Thi (Runtime Mode Selector)](#2-bộ-chuyển-đổi-chế-độ-thực-thi-runtime-mode-selector)
- [3. Hướng Dẫn Từng Chức Năng & Kịch Bản Kiểm Thử (Feature & Test Guide)](#3-hướng-dẫn-từng-chức-năng--kịch-bản-kiểm-thử-feature--test-guide)
  - [3.1. Tổng Quan Kỹ Thuật (Dashboard)](#31-tổng-quan-kỹ-thuật-dashboard)
  - [3.2. Danh Mục Chuyên Đề Kỹ Thuật (Technical Catalog)](#32-danh-mục-chuyên-đề-kỹ-thuật-technical-catalog)
  - [3.3. Trình Khám Phá Mã Nguồn (Code Explorer)](#33-trình-khám-phá-mã-nguồn-code-explorer)
  - [3.4. Phòng Lab Fiori Elements V4 (FE Lab)](#34-phòng-lab-fiori-elements-v4-fe-lab)
  - [3.5. Phòng Lab Freestyle SAPUI5 (Freestyle Lab)](#35-phòng-lab-freestyle-sapui5-freestyle-lab)
  - [3.6. Phòng Lab OData V4 Deep Dive (OData Lab)](#36-phòng-lab-odata-v4-deep-dive-odata-lab)
  - [3.7. Phòng Lab Kỹ Thuật Nâng Cao (Advanced Labs - Phase 6)](#37-phòng-lab-kỹ-thuật-nâng-cao-advanced-labs---phase-6)
  - [3.8. Cẩm Nang Fresher Từ Số 0 (Fresher Guideline)](#38-cẩm-nang-fresher-từ-số-0-fresher-guideline)
  - [3.9. Sổ Tay Xử Lý Sự Cố Kỹ Thuật (Error Playbook - 15 Lỗi)](#39-sổ-tay-xử-lý-sự-cố-kỹ-thuật-error-playbook---15-lỗi)
  - [3.10. Kiến Trúc Hệ Thống & Generic Data Model (Architecture Viewer)](#310-kiến-trúc-hệ-thống--generic-data-model-architecture-viewer)
- [4. Hướng Dẫn Chạy Bộ Kiểm Thử Tự Động (Automated Test Execution)](#4-hướng-dẫn-chạy-bộ-kiểm-thử-tự-động-automated-test-execution)
- [5. Hướng Dẫn Đóng Gói & Triển Khai Vào SAP ABAP BSP Repository (Deployment)](#5-hướng-dẫn-đóng-gói--triển-khai-vào-sap-abap-bsp-repository-deployment)

---

## 1. GIỚI THIỆU TỔNG QUAN ỨNG DỤNG

Ứng dụng **SAP Fiori Technical Academy – V4** là nền tảng thực hành và đào tạo chuyên sâu về kỹ thuật **SAPUI5, OData V4, CDS View Entities và ABAP RESTful Application Programming Model (RAP)** trên nền tảng máy chủ hiện đại **SAP S/4HANA 2025**.

### Đặc Điểm Cốt Lõi:
1. **Generic Technical Domain (100% Kỹ Thuật):** Loại bỏ hoàn toàn các thực thể nghiệp vụ cũ (Sales Order, Purchase Order). Ứng dụng hoạt động trên mô hình thực thể kỹ thuật thuần túy: `DemoHeader`, `DemoItem`, `DemoConfig`, `DemoLog`.
2. **Kiến Trúc Kép (Dual Execution Architecture):** Hoạt động linh hoạt ở cả 2 chế độ:
   - **Standalone Mock Mode:** Chạy hoàn toàn độc lập trên trình duyệt qua `@sap-ux/ui5-middleware-fe-mockserver` và mock data JSON.
   - **SAP Connected Mode:** Kết nối trực tiếp tới máy chủ SAP S/4HANA 2025 (PQPOC Client 100), gọi OData V4 Service `ZUI_DEMO_HEADER_O4`.
3. **Bộ Công Cụ Hỗ Trợ Đào Tạo Chuyên Biệt:**
   - **Fresher Guideline:** 10 chương hướng dẫn tái tạo app 100% từ số 0 kèm tính năng rê chuột giải nghĩa từng dòng code.
   - **Error Playbook:** 15 sự cố kỹ thuật thực tế gặp phải và cách giải quyết kèm Pop-Up trực quan khi rê chuột.

---

## 2. BỘ CHUYỂN ĐỔI CHẾ ĐỘ THỰC THI (RUNTIME MODE SELECTOR)

### Vị Trí:
Nút bấm trạng thái đặt trên thanh tiêu đề `ToolHeader` góc trên bên phải màn hình:
- Trạng thái Standalone: Nút màu xám nhạt với icon `sap-icon://laptop` và nhãn `Standalone Mock`.
- Trạng thái SAP Connected: Nút màu xanh lá với icon `sap-icon://connected` và nhãn `SAP S/4HANA (PQPOC)`.

### Cách Sử Dụng & Kiểm Thử:
1. Nhấp chuột vào nút **Runtime Mode** trên `ToolHeader`.
2. Hộp thoại **Bộ chuyển đổi Chế độ Thực thi (Runtime Mode Selector)** xuất hiện.
3. Chọn một trong hai chế độ:
   - *Standalone Mode (Mock Engine)*: Dành cho lập trình viên làm việc offline hoặc kiểm thử chức năng không cần SAP.
   - *SAP Connected Mode (S/4HANA 2025)*: Kết nối tới máy chủ thật để thao tác với dữ liệu database và Behavior Pool.
4. Nhấn **"Xác nhận & Tải lại Trang"**: Hệ thống sẽ lưu thiết lập vào `localStorage` và tự động tải lại ứng dụng.

---

## 3. HƯỚNG DẪN TỪNG CHỨC NĂNG & KỊCH BẢN KIỂM THỬ

```
                             BẢN ĐỒ PHÂN HỆ CHỨC NĂNG
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           SAP Fiori Technical Academy                             │
├───────────────┬───────────────────┬──────────────────────┬────────────────────────┤
│  1. Dashboard │    2. Catalog     │   3. Code Explorer   │ 4. Fiori Elements Lab  │
├───────────────┼───────────────────┼──────────────────────┼────────────────────────┤
│5.Freestyle Lab│ 6. OData V4 Lab   │  7. Advanced Labs    │ 8. Fresher Guideline   │
├───────────────┴───────────────────┴──────────────────────┴────────────────────────┤
│  9. Error Playbook (15 Lỗi)       │ 10. Architecture & Generic Data Model         │
└───────────────────────────────────┴───────────────────────────────────────────────┘
```

---

### 3.1. Tổng Quan Kỹ Thuật (Dashboard)

![Dashboard Overview](file:///e:/AI%20Code/Gemini%20Code/Fiori/FIORI_TECH_APP/src/frontend/webapp/img/guideline/01_dashboard_view.png)

- **Nội dung & Thông tin:**
  - **KPI Summary Tiles:** 4 thẻ đo lường chính (10 Phân hệ kỹ thuật, 80 Chuyên đề, 9 Phòng Lab, Release Foundation SAP 816).
  - **Quick Action Banners:** Các banner điều hướng nhanh tới *Fresher Guideline*, *Error Playbook (15 Lỗi)*, và *Phòng Lab Kỹ Thuật Nâng Cao*.
  - **Learning Tracks:** 3 lộ trình đào tạo theo cấp độ (Cơ bản, Trung cấp, Chuyên gia) kèm thanh tiến độ hoàn thành.
  - **10 Phân Hệ Kỹ Thuật:** Lưới các thẻ phân hệ dẫn thẳng vào danh mục lọc.
- **Kịch bản Kiểm thử (Test Steps):**
  1. Mở ứng dụng tại URL gốc `http://localhost:8085/index.html`.
  2. Xác minh 4 thẻ KPI hiển thị đúng số liệu: 10 Phân hệ, 80 Topics, 9 Labs, Release 816.
  3. Nhấp vào liên kết **"Khám phá Cẩm Nang Fresher Ngay..."** -> Kiểm tra ứng dụng điều hướng chính xác sang route `#/guideline`.
  4. Nhấp vào liên kết **"Mở Sổ Tay Xử Lý Lỗi (Error Playbook)..."** -> Kiểm tra ứng dụng điều hướng sang route `#/errors`.
  5. Nhấp vào nút **"Khám phá Danh mục"** trên một Card phân hệ -> Kiểm tra mở Catalog và tự động kích hoạt bộ lọc của phân hệ đó.

---

### 3.2. Danh Mục Chuyên Đề Kỹ Thuật (Technical Catalog)

![Technical Catalog](file:///e:/AI%20Code/Gemini%20Code/Fiori/FIORI_TECH_APP/src/frontend/webapp/img/guideline/02_catalog_view.png)

- **Nội dung & Thông tin:**
  - Thư viện 80 chuyên đề kỹ thuật chuyên sâu về SAPUI5, Fiori Elements, OData V4 và ABAP RAP.
  - Bộ lọc đa năng (FilterBar): Lọc theo Phân hệ (10 phân hệ), Cấp độ (Cơ bản, Trung bình, Nâng cao), và ô tìm kiếm từ khóa trực tiếp.
  - Danh sách bảng (Table) hiển thị mã chuyên đề, tên kỹ thuật, phân hệ, độ khó và nút mở mã nguồn.
- **Kịch bản Kiểm thử (Test Steps):**
  1. Chọn mục **"Danh mục Kỹ thuật"** trên thanh điều hướng bên trái hoặc gõ `#/catalog`.
  2. Tại ô tìm kiếm, nhập từ khóa `SideEffects` -> Bảng tự động lọc còn các chuyên đề liên quan đến Side Effects.
  3. Chọn phân hệ `ABAP RAP` từ danh sách thả xuống -> Bảng chỉ hiển thị các chuyên đề về RAP BDL, EML và Behavior Pool.
  4. Nhấn nút biểu tượng mã nguồn `sap-icon://source-code` ở dòng đầu tiên -> Kiểm tra ứng dụng điều hướng sang màn hình **Code Explorer** với snippet tương ứng được chọn.

---

### 3.3. Trình Khám Phá Mã Nguồn (Code Explorer)

![Code Explorer](file:///e:/AI%20Code/Gemini%20Code/Fiori/FIORI_TECH_APP/src/frontend/webapp/img/guideline/03_code_explorer_view.png)

- **Nội dung & Thông tin:**
  - Bộ đọc mã nguồn đa ngôn ngữ: Core Data Services (`CDS`), Behavior Definition (`BDL`), ABAP OO, JavaScript, XML Views.
  - Cột bên trái: Danh sách các mẫu code phân loại theo công nghệ.
  - Cột bên phải: Trình xem mã nguồn với phông chữ monospace chuyên dụng, nút sao chép 1-click, bảng ghi chú phân tích kỹ thuật chuyên sâu (Deep Technical Notes).
- **Kịch bản Kiểm thử (Test Steps):**
  1. Truy cập vào mục **"Trình xem Mã nguồn"** (`#/code`).
  2. Chọn snippet `ZI_DemoHeaderTP.bdef` từ danh sách bên trái.
  3. Kiểm tra khung code bên phải hiển thị cú pháp BDL với `managed with unmanaged save` hoặc `with draft`.
  4. Nhấn nút **"Sao chép Snippet"** -> Kiểm tra thông báo `MessageToast` xuất hiện báo sao chép thành công và nội dung được đưa vào Clipboard của máy tính.

---

### 3.4. Phòng Lab Fiori Elements V4 (FE Lab)

![Fiori Elements Lab](file:///e:/AI%20Code/Gemini%20Code/Fiori/FIORI_TECH_APP/src/frontend/webapp/img/guideline/05_fiori_elements_lab_view.png)

- **Nội dung & Thông tin:**
  - Mô phỏng ứng dụng Fiori Elements V4 List Report và Object Page cho thực thể `DemoHeader` và `DemoItem`.
  - **Live Side Effects Sandbox:** Mô phỏng tương tác tính toán tức thời: Khi thay đổi `Quantity` hoặc `UnitPrice` ở Item, hệ thống tự động tính lại `LineTotal` và `_Header/TotalAmount` mà không cần tải lại trang.
  - **FPM & Building Blocks Tabs:** Trực quan hóa các khối Building Blocks (`<macros:Table>`, `<macros:FilterBar>`, `<macros:Field>`) của Flexible Programming Model.
- **Kịch bản Kiểm thử (Test Steps):**
  1. Truy cập vào mục **"Phòng Lab Fiori Elements V4"** (`#/fe-lab`).
  2. Chọn tab **"2. Live Side Effects Simulation"**.
  3. Thay đổi số lượng tại trường `Quantity` từ `2` thành `5` -> Quan sát ô `LineTotal` và `Header TotalAmount` tự động cập nhật ngay lập tức.
  4. Chọn tab **"3. Building Blocks & FPM"** -> Xem mã nguồn khai báo XML của các Building Blocks.

---

### 3.5. Phòng Lab Freestyle SAPUI5 (Freestyle Lab)

![Freestyle Lab](file:///e:/AI%20Code/Gemini%20Code/Fiori/FIORI_TECH_APP/src/frontend/webapp/img/guideline/10_freestyle_lab_view.png)

- **Nội dung & Thông tin:**
  - **Data Binding Playground:** Trực quan hóa Two-Way Binding (Slider/Switch), Context Binding Master-Detail, và Expression Binding.
  - **Enterprise MessageManager:** Kiểm tra hợp lệ dữ liệu biểu mẫu (Form Validation RFC 5322), tự động gom thông báo lỗi vào `MessagePopover` góc dưới màn hình.
  - **Custom Control TechnicalHealthGauge:** Điều khiển tùy biến vẽ bằng HTML5 RenderManager, tự đổi màu theo ngưỡng cảnh báo.
  - **XML Fragment Dialog:** Hộp thoại `QuickInspectDialog` nạp bất đồng bộ qua `Fragment.load(...)`.
- **Kịch bản Kiểm thử (Test Steps):**
  1. Truy cập vào **"Phòng Lab Freestyle SAPUI5"** (`#/freestyle-lab`).
  2. Nhập một email sai định dạng (ví dụ: `abc@`) vào ô nhập liệu -> Nhấn **"Kiểm Tra Hợp Lệ"**.
  3. Quan sát nút đỏ `MessagePopover` xuất hiện ở góc dưới bên trái, nhấp vào để xem chi tiết lỗi validation.
  4. Nhấn nút **"Mở Hộp Thoại Soát Nhanh (XML Fragment)"** -> Hộp thoại dialog xuất hiện, nhấn **"Đóng"** để kiểm tra việc đóng fragment.

---

### 3.6. Phòng Lab OData V4 Deep Dive (OData Lab)

![OData V4 Lab](file:///e:/AI%20Code/Gemini%20Code/Fiori/FIORI_TECH_APP/src/frontend/webapp/img/guideline/14_odata_v4_lab_view.png)

- **Nội dung & Thông tin:**
  - **Request Builder & URL Generator:** Tự động sinh URL OData V4 với `$select`, `$expand`, `$filter`, `$orderby`, `$top`, `$skip`.
  - **Bound & Unbound Actions:** Mô phỏng thực thi Bound Action `markAsVerified` kèm kiểm tra ETag và Side Effects.
  - **Multipart $batch Request:** Trực quan hóa payload MIME multipart với boundary phân tách các ChangeSets nguyên tử (Atomic ChangeSet).
  - **ETag Optimistic Concurrency Control (OCC):** Thử nghiệm cơ chế chống xung đột ghi đè đồng thời Lost Update với header `If-Match`.
- **Kịch bản Kiểm thử (Test Steps):**
  1. Truy cập vào **"Phòng Lab OData V4 Deep Dive"** (`#/odata-lab`).
  2. Tại tab Request Builder, chọn mẫu `$select & $expand (Header + Items)` -> Nhấn **"Thực Thi Truy Vấn OData V4"**.
  3. Xem khung JSON Response trả về cấu trúc phân cấp Header lồng Items.
  4. Chuyển sang tab **"3. Multipart $batch Requests"** -> Nhấn **"Thực Thi Batch Payload"** -> Quan sát kết quả xử lý thành công từng phần của batch.
  5. Chuyển sang tab **"4. ETag OCC"** -> Thử mô phỏng xung đột giữa User A và User B -> Bắt mã lỗi `HTTP 412 Precondition Failed`.

---

### 3.7. Phòng Lab Kỹ Thuật Nâng Cao (Advanced Labs - Phase 6)

- **Nội dung & Thông tin:**
  - **1. Bảo Mật DCL (Lab 07):** Mã nguồn CDS Access Control [`ZR_DemoHeaderTP`](file:///e:/AI%20Code/Gemini%20Code/Fiori/FIORI_TECH_APP/src/backend/rap/authorization/ZR_DemoHeaderTP.dcls.asdcls) phân quyền tầng dòng qua `pfcg_auth`; Trình mô phỏng vai trò PFCG (Admin, Approver, Viewer); Bộ mô phỏng bắt tay CSRF Token.
  - **2. Tích Hợp SM59 (Lab 06):** Danh sách kết nối RFC, HTTP và BTP Reverse Proxy; Nút **Ping Connection** kiểm tra kết nối; Cấu hình Proxy Middleware `ui5.yaml`.
  - **3. Tự Động Hóa Kiểm Thử (Lab 08):** Báo cáo QUnit, OPA5, và mã nguồn ABAP Unit Test for RAP Business Object (`cl_cds_test_environment`).
  - **4. Đóng Gói Triển Khai FLP (Lab 09):** File cấu hình `ui5-deploy.yaml` (Deployer Plugin vào Package `ZNGHIANDD_TEST`, TR `S4DK911884`); Live Preview Fiori Launchpad Tile.
- **Kịch bản Kiểm thử (Test Steps):**
  1. Truy cập vào **"Phòng Lab Kỹ Thuật Nâng Cao"** (`#/advanced-lab`).
  2. Tại Tab Security, thay đổi vai trò từ `Z_DEMO_ADMIN` sang `Z_DEMO_VIEWER` -> Quan sát số lượng bản ghi hiển thị giảm từ 10 xuống 4 (chỉ bản ghi status `AP`).
  3. Nhấn nút **"1. Gửi Request Bắt Tay (Fetch CSRF Token)"** -> Kết quả trả về mã token `A9B2C4D8...` và Session Cookie.
  4. Chuyển sang Tab Integration -> Nhấn nút **"Ping Test"** trên dòng `S4H_PQPOC_100` -> Xem thông báo thời gian phản hồi (18 ms).
  5. Chuyển sang Tab Deployment -> Nhấn nút **"Tải File Cấu Hình ui5-deploy.yaml"** -> Kiểm tra file cấu hình được tải về máy.

---

### 3.8. Cẩm Nang Fresher Từ Số 0 (Fresher Guideline)

![Fresher Guideline](file:///e:/AI%20Code/Gemini%20Code/Fiori/FIORI_TECH_APP/src/frontend/webapp/img/guideline/08_fresher_guideline_view.png)

- **Nội dung & Thông tin:**
  - 10 chương hướng dẫn toàn diện từ con số 0 giúp lập trình viên fresher có thể tự tay tạo lại 100% ứng dụng này.
  - Tích hợp lệnh CLI Terminal, mã nguồn đầy đủ của từng file kèm nút sao chép 1-click.
  - **Interactive Annotated Code Lines:** Bảng giải thích chi tiết từng dòng code. Khi **rê chuột (hover)** vào bất kỳ dòng nào, Pop-Up sẽ bung ra giải thích vai trò kỹ thuật, ý nghĩa chuyên sâu và lỗi thường gặp.
- **Kịch bản Kiểm thử (Test Steps):**
  1. Nhấn nút **"Guideline (Fresher từ 0)"** màu xanh dương trên `ToolHeader` (`#/guideline`).
  2. Chọn một chương (ví dụ: Chương 5 - Fiori Elements Lab).
  3. Nhấn nút **"Sao chép các lệnh Terminal"** -> Toàn bộ lệnh CLI được copy vào clipboard.
  4. Di chuyển chuột (hover) qua các dòng code trong bảng chú thích -> Pop-Up giải nghĩa chi tiết lập tức xuất hiện.

---

### 3.9. Sổ Tay Xử Lý Sự Cố Kỹ Thuật (Error Playbook - 15 Lỗi)

- **Nội dung & Thông tin:**
  - Tổng hợp đầy đủ **15 lỗi kỹ thuật thực tế** phát sinh từ Phase 0 đến Phase 5.
  - 6 thẻ KPI tổng quan số lượng lỗi theo từng phân hệ.
  - Thanh tìm kiếm và bộ lọc đa chiều (Category, Phase, Severity).
  - Bảng danh sách sự cố. Khi **rê chuột (hover)** vào dòng bất kỳ, Pop-Up tự động hiển thị: *Thao tác gây lỗi, Triệu chứng, Nguyên nhân gốc rễ, Tư duy giải quyết, Cách sửa và Gotchas Fresher*.
  - Nút **"Code Diff"** mở hộp thoại so sánh 2 cột trực quan giữa mã nguồn trước khi sửa (màu đỏ) và sau khi sửa (màu xanh).
- **Kịch bản Kiểm thử (Test Steps):**
  1. Nhấn nút màu cam **"Handle Error (15 Lỗi)"** trên `ToolHeader` (`#/errors`).
  2. Rê chuột vào dòng `ERR_001` (Lỗi trùng port 8085) -> Pop-Up phân tích xuất hiện.
  3. Nhấn nút **"Xem Code Diff"** trên Pop-Up hoặc trên dòng -> Hộp thoại so sánh code Before vs After xuất hiện.
  4. Thử nhập từ khóa `BDEF` vào ô tìm kiếm -> Bảng lọc ra 3 lỗi liên quan đến RAP BDL.
  5. Nhấn nút **"Tải File Tài Liệu Markdown (ERROR_HANDLING_PLAYBOOK.md)"** -> Kiểm tra tải file markdown về máy.

---

### 3.10. Kiến Trúc Hệ Thống & Generic Data Model (Architecture Viewer)

![Architecture Viewer](file:///e:/AI%20Code/Gemini%20Code/Fiori/FIORI_TECH_APP/src/frontend/webapp/img/guideline/04_architecture_view.png)

- **Nội dung & Thông tin:**
  - Sơ đồ tương tác 3 tầng: Tầng Trình Duyệt Fiori -> Tầng Gateway / SAP FES -> Tầng Backend ABAP RAP S/4HANA 2025.
  - Chi tiết mô hình thực thể Generic Technical Domain (`DemoHeader`, `DemoItem`, `DemoConfig_M`, `DemoConfig_U`, `DemoLog`).
- **Kịch bản Kiểm thử (Test Steps):**
  1. Nhấn vào biểu tượng trợ giúp `sap-icon://sys-help` trên `ToolHeader` hoặc chọn mục **"Kiến trúc Hệ thống"** (`#/architecture`).
  2. Kiểm tra sơ đồ khối kiến trúc hiển thị rõ ràng các phân tầng.
  3. Kiểm tra bảng đặc tả kiểu dữ liệu của các trường trong thực thể `DemoHeader` và `DemoItem`.

---

## 4. HƯỚNG DẪN CHẠY BỘ KIỂM THỬ TỰ ĐỘNG (AUTOMATED TEST EXECUTION)

Dự án tích hợp bộ kiểm thử tự động toàn diện bao quát 11 tầng kiểm tra, tự động khởi tạo server UI5, kiểm tra HTTP endpoints, cú pháp XML, logic nghiệp vụ, và đóng gói.

### Lệnh Thực Thi:
Mở terminal tại thư mục gốc của dự án và chạy:

```bash
node tests/unit/test_frontend_runtime.js
```

### Kết Quả Tiêu Chuẩn:
```text
===============================================================
   SAP FIORI TECHNICAL ACADEMY - RUNTIME & UNIT VERIFICATION   
===============================================================

--- 1. RUNTIME TESTS (HTTP Requests to UI5 Tooling Server on :8085) ---
... 52/52 Endpoints HTTP 200 OK ...

--- 2. STATIC CHECKS: XML VIEW PARSING & MANIFEST TARGET INTEGRITY ---
... 12/12 Views Valid XML ...

--- 3. FORMATTER UNIT TESTS ---
... All Formatter Tests Passed ...

--- 4. MOCK DATA INTEGRITY & SCHEMA VALIDATION ---
... All Mock Schemas Valid ...

--- 5. INTERACTION & CONTROLLER LOGIC SIMULATION ---
... All Controllers Passed ...

--- 6. PHASE 2 VERIFICATION: FIORI ELEMENTS V4 & SIDE EFFECTS ---
... Side Effects & Annotations Passed ...

--- 7. PHASE 3 VERIFICATION: FREESTYLE MVC, CUSTOM CONTROLS & FRAGMENTS ---
... Validation & HealthGauge Passed ...

--- 8. PHASE 4 VERIFICATION: ODATA V4 EXPLORER, $BATCH & ETAG OCC ---
... Batch & OCC Passed ...

--- 9. ERROR PLAYBOOK VERIFICATION: 15 LỖI KỸ THUẬT & POPOVER ---
... 15 Errors Validated ...

--- 10. PHASE 6 VERIFICATION: DCL SECURITY, SM59, OPA5/QUNIT & FLP DEPLOYMENT ---
... Advanced Labs Validated ...

===============================================================
KẾT QUẢ KIỂM THỬ TỔNG HỢP: 234/234 TESTS PASSED (0 FAILED)
===============================================================
```

---

## 5. HƯỚNG DẪN ĐÓNG GÓI & TRIỂN KHAI VÀO SAP ABAP BSP REPOSITORY

### 5.1. Đóng Gói Ứng Dụng (Build):
Chạy lệnh đóng gói tại thư mục `src/frontend`:

```powershell
cd src/frontend
npm run build
```

Kết quả: Toàn bộ mã nguồn được minify, bundle vào `dist/Component-preload.js` và sinh file manifest tối ưu trong thư mục `dist/`.

### 5.2. Triển Khai Lên Máy Chủ SAP S/4HANA (Deploy):
Sử dụng công cụ `@sap/ux-ui5-tooling` với cấu hình trong `ui5-deploy.yaml`:

```powershell
cd src/frontend
npx ui5-deploy --config ui5-deploy.yaml
```

- **BSP Application:** `ZFIORI_TECH_APP`
- **Package:** `ZNGHIANDD_TEST`
- **Transport Request:** `S4DK911884`
- **Target System:** SAP S/4HANA 2025 (PQPOC Client 100)

