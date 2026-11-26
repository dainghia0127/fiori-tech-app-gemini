# DANH MỤC KỸ THUẬT: TECHNICAL CATALOG & LAB MAPPING
*(SAP Fiori Technical Academy – V4)*

---

## 1. Tổng quan 10 Nhóm Kỹ thuật (Technical Categories)

Dự án phân chia toàn bộ kiến thức và kỹ năng thực hành vào **10 Nhóm Kỹ thuật Cốt lõi**, sắp xếp theo trình tự phụ thuộc hợp lý từ nền tảng giao diện đến tầng kiến trúc sâu:

1. **CAT-01: SAP Fiori Fundamentals** `[P0 – Core]` — Kiến trúc Fiori tổng thể, Design Guidelines, FLP Spaces & Pages, Theming, i18n, Accessibility.
2. **CAT-02: SAP Fiori Elements OData V4** `[P0 – Core]` — List Report, Object Page, Building Blocks V4 (`Table`, `FilterBar`, `Field`, `Chart`), Extensions, Side Effects.
3. **CAT-03: SAPUI5 Freestyle** `[P0 – Core]` — Kiến trúc MVC, Data Binding (Property, List, Expression), Routing, Custom Controls, Fragments, EventBus.
4. **CAT-04: CDS & Annotations** `[P0 – Core]` — View Entities, Compositions, Associations, UI Annotations vs Metadata Extension (`.ddlx`), Semantics.
5. **CAT-05: OData V4 Protocol** `[P0 – Core]` — Giao thức OData V4, Metadata, Query Options (`$filter`, `$expand`), Batch requests, Actions, Functions, ETag.
6. **CAT-06: ABAP RAP (RESTful Application Programming)** `[P0 – Core]` — Managed/Unmanaged scenarios, Draft handling, BDEF, Behavior Pool, Determinations, Validations, EML.
7. **CAT-07: Security & Authorization** `[P1 – Advanced]` — DCL Row-level Security, PFCG Business Roles, Instance Authorization, CSRF Token, CORS.
8. **CAT-08: Advanced SAPUI5 & Fiori Components** `[P1 – Advanced]` — DynamicPage, MicroCharts, UploadSet, SmartControls vs V4 Building Blocks, ValueHelpDialog.
9. **CAT-09: Integration & Connectivity** `[P1 – Advanced]` — SM59 Outbound Destinations, BTP Connectivity, CORS Proxy, REST/RFC Integration, Event Mesh.
10. **CAT-10: Testing, Debugging, Performance & Deployment** `[P1 – Advanced]` — QUnit, OPA5, ABAP Unit for RAP, Fiori Tools Deploy, FLP Content Activation.

---

## 2. Bảng Ma trận Ánh xạ (Mapping Matrix): 10 Categories ↔ 9 Technical Labs

Mỗi phòng thực hành (**Technical Lab**) được thiết kế để giải quyết một hoặc nhiều nhóm kỹ thuật tương ứng:

| Mã Phòng Lab | Tên Phòng Thực Hành (Technical Lab) | Mức Ưu Tiên | Các Nhóm Kỹ Thuật Được Phục Vụ (Categories) | Mục Tiêu Thực Hành Cụ Thể |
| :--- | :--- | :---: | :--- | :--- |
| **LAB-01** | **Fiori Elements Lab** | **P0** | CAT-01, CAT-02, CAT-08 | Trực quan hóa List Report, Object Page, Building Blocks V4, Controller Extensions và Side Effects. |
| **LAB-02** | **SAPUI5 Playground** | **P0** | CAT-01, CAT-03, CAT-08 | Thử nghiệm MVC, các kiểu Binding phức tạp, Custom Controls, Fragments và Dynamic Routing. |
| **LAB-03** | **OData V4 Explorer** | **P0** | CAT-05 | Soi chiếu `$metadata`, tự dựng request builder, test Query Options, Actions/Functions và Batch requests. |
| **LAB-04** | **ABAP RAP Lab** | **P0** | CAT-06 | Nghiên cứu BDEF, Behavior Pool, kịch bản Managed w/ Draft, Unmanaged Save, Pure Unmanaged và cú pháp EML. |
| **LAB-05** | **CDS & Annotation Lab** | **P0** | CAT-04 | So sánh trực quan giữa CDS View Annotation và Metadata Extension (MDE), kiểm chứng kế thừa annotation. |
| **LAB-06** | **Architecture & Integration Lab**| **P1** | CAT-01, CAT-09 | Phân tích luồng FES (Embedded vs Hub), cấu hình SM59, UI5 Proxy middleware, BTP Destinations. |
| **LAB-07** | **Security Lab** | **P1** | CAT-07 | Kiểm chứng phân quyền DCL cấp dòng, cấu hình PFCG Role, bảo vệ CSRF handshake và CORS policy. |
| **LAB-08** | **Testing & Quality Lab** | **P1** | CAT-10 | Viết và chạy tự động QUnit (Client logic), OPA5 (UI Journey), và ABAP Unit Test (RAP BO test-driven). |
| **LAB-09** | **Deployment & Admin Lab** | **P1** | CAT-01, CAT-10 | Đóng gói `@sap/ux-ui5-tooling` deploy vào BSP/CTS và thiết lập Fiori Launchpad Spaces & Pages. |

---

## 3. Danh mục Chi tiết Toàn bộ 80+ Topics & Learning Execution Matrix

Mỗi chủ đề kỹ thuật được gán định danh chuẩn (`TOPIC-ID`) kèm theo **Hình thức Thực thi (Execution Mode)** bắt buộc:
- **`Standalone`**: Thực hành 100% trên môi trường local (FE-Mockserver hoặc CAP Node.js).
- **`SAP Connected`**: Bắt buộc kết nối hệ thống SAP S/4HANA 2025 thực tế để chạy và kiểm chứng.
- **`Code Walkthrough`**: Học qua việc mổ xẻ mã nguồn chi tiết từng dòng trong Code Explorer / ADT.
- **`Concept Only`**: Học qua sơ đồ kiến trúc, nguyên lý và tài liệu đặc tả chuẩn SAP.

---

### NHÓM 01: SAP FIORI FUNDAMENTALS (P0)

| Topic ID | Tên Kỹ Thuật | Độ Khó | Hình Thức Thực Thi | Môi Trường Khả Dụng | Mô Tả Tóm Tắt |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **TOPIC-01-01** | SAP Fiori Design Principles | Cơ bản | `Concept Only` | Documentation | Nguyên lý thiết kế: Role-based, Adaptive, Coherent, Simple, Delightful. |
| **TOPIC-01-02** | Fiori Launchpad Architecture | Cơ bản | `Concept Only` | Documentation | Cấu trúc FLP Shell, Tile types, Services, Plugin architecture. |
| **TOPIC-01-03** | Fiori Spaces & Pages | Cơ bản | `SAP Connected` | S/4HANA Launchpad | Cấu hình Spaces & Pages hiện đại thay thế Classic Groups trên S/4HANA 2025. |
| **TOPIC-01-04** | Business Catalog & Target Mapping| Trung bình | `SAP Connected` | S/4HANA FES | Cấu hình Semantic Object, Action, và Target Mapping điều hướng. |
| **TOPIC-01-05** | Fiori Themes (Horizon & Quartz) | Cơ bản | `Standalone` | FE Mock / UI5 | Áp dụng theme chuẩn `sap_horizon`, hỗ trợ Dark Mode (`sap_horizon_dark`). |
| **TOPIC-01-06** | Internationalization (i18n) | Cơ bản | `Standalone` | FE Mock / UI5 | Quản lý đa ngôn ngữ qua resource bundle `i18n.properties`. |
| **TOPIC-01-07** | UI Adaptation at Runtime | Trung bình | `SAP Connected` | S/4HANA Launchpad | Tùy biến giao diện trực tiếp tại runtime qua Key User Adaptation. |
| **TOPIC-01-08** | Cache Buster Mechanism | Nâng cao | `Concept Only` | Documentation | Cơ chế chống lưu cache trình duyệt cũ khi triển khai bản cập nhật mới. |

---

### NHÓM 02: SAP FIORI ELEMENTS ODATA V4 (P0)

| Topic ID | Tên Kỹ Thuật | Độ Khó | Hình Thức Thực Thi | Môi Trường Khả Dụng | Mô Tả Tóm Tắt |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **TOPIC-02-01** | List Report Floorplan V4 | Cơ bản | `Standalone` | FE Mock / SAP | Tạo trang danh sách và bộ lọc tự động bằng metadata OData V4. |
| **TOPIC-02-02** | Object Page Floorplan V4 | Cơ bản | `Standalone` | FE Mock / SAP | Tạo trang chi tiết đối tượng với Header Facets và Sub-sections. |
| **TOPIC-02-03** | Building Block: Table V4 | Trung bình | `Standalone` | FE Mock / SAP | Sử dụng `sap.fe.macros.Table` tùy biến bảng trên XML View. |
| **TOPIC-02-04** | Building Block: FilterBar V4 | Trung bình | `Standalone` | FE Mock / SAP | Sử dụng `sap.fe.macros.FilterBar` nhúng bộ lọc linh hoạt. |
| **TOPIC-02-05** | Building Block: Field V4 | Cơ bản | `Standalone` | FE Mock / SAP | Sử dụng `sap.fe.macros.Field` tự động hiển thị kiểu dữ liệu và Text Arrangement. |
| **TOPIC-02-06** | Building Block: Chart V4 | Nâng cao | `Standalone` | FE Mock / SAP | Nhúng biểu đồ trực quan hóa dữ liệu qua `sap.fe.macros.Chart`. |
| **TOPIC-02-07** | Controller Extension Points | Nâng cao | `Standalone` | FE Mock / SAP | Mở rộng logic Fiori Elements bằng Page Controller Extension. |
| **TOPIC-02-08** | Custom Action in Table/Toolbar | Trung bình | `Standalone` | FE Mock / SAP | Thêm nút bấm tùy biến trên thanh công cụ và hàng của bảng. |
| **TOPIC-02-09** | Custom Section in Object Page | Trung bình | `Standalone` | FE Mock / SAP | Nhúng XML Fragment tùy biến vào bên trong Object Page. |
| **TOPIC-02-10** | Fiori Elements Side Effects | Nâng cao | **`SAP Connected`** | **Bắt buộc SAP 2025** | Tự động làm tươi dữ liệu phụ thuộc (1:N) khi thay đổi trường hoặc kích hoạt action. |
| **TOPIC-02-11** | Flexible Column Layout (FCL) | Nâng cao | `Standalone` | FE Mock / SAP | Điều hướng đa cột (Master-Detail song song) trên Fiori Elements V4. |
| **TOPIC-02-12** | Draft Integration in UI V4 | Nâng cao | **`SAP Connected`** | **Bắt buộc SAP 2025** | Tương tác hoàn chỉnh với vòng đời Draft: Edit, Save, Discard, Lock. |

---

### NHÓM 03: SAPUI5 FREESTYLE (P0)

| Topic ID | Tên Kỹ Thuật | Độ Khó | Hình Thức Thực Thi | Môi Trường Khả Dụng | Mô Tả Tóm Tắt |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **TOPIC-03-01** | Core MVC Architecture | Cơ bản | `Standalone` | Local UI5 | Mô hình Model-View-Controller chuẩn hóa trong UI5. |
| **TOPIC-03-02** | Property & Expression Binding | Cơ bản | `Standalone` | Local UI5 | Gán dữ liệu thuộc tính và sử dụng biểu thức tính toán trực tiếp trên XML View. |
| **TOPIC-03-03** | Aggregation Binding & Factories | Trung bình | `Standalone` | Local UI5 | Đổ dữ liệu mảng vào Table/List kèm hàm Factory tự sinh control. |
| **TOPIC-03-04** | Context / Element Binding | Trung bình | `Standalone` | Local UI5 | Điều hướng dữ liệu Master-Detail qua Context Path Binding. |
| **TOPIC-03-05** | UI5 Dynamic Routing & Targets | Trung bình | `Standalone` | Local UI5 | Cấu hình Route, Target, Nested Targets và tham số URL trong manifest.json. |
| **TOPIC-03-06** | Custom Formatters & Types | Cơ bản | `Standalone` | Local UI5 | Xây dựng hàm định dạng dữ liệu và validate kiểu dữ liệu tùy biến. |
| **TOPIC-03-07** | XML Fragments & Dialogs | Cơ bản | `Standalone` | Local UI5 | Tái sử dụng giao diện nhỏ và tạo Popup Dialog không cần Controller riêng. |
| **TOPIC-03-08** | Custom Controls Development | Nâng cao | `Standalone` | Local UI5 | Tự tạo Control mới thừa kế `sap.ui.core.Control` kèm hàm renderer. |
| **TOPIC-03-09** | MessageManager & Popover | Trung bình | `Standalone` | Local UI5 | Thu thập và hiển thị thông báo lỗi hệ thống qua MessagePopover. |
| **TOPIC-03-10** | EventBus & Cross-Component Com| Nâng cao | `Standalone` | Local UI5 | Giao tiếp lỏng lẻo giữa các Controller qua Publish/Subscribe EventBus. |

---

### NHÓM 04: CDS & ANNOTATIONS (P0)

| Topic ID | Tên Kỹ Thuật | Độ Khó | Hình Thức Thực Thi | Môi Trường Khả Dụng | Mô Tả Tóm Tắt |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **TOPIC-04-01** | CDS View Entity Fundamentals | Cơ bản | `Code Walkthrough` | ADT / Eclipse | Định nghĩa View Entity hiện đại thay thế cho CDS DDIC-based Views cũ. |
| **TOPIC-04-02** | CDS Associations vs Compositions| Trung bình | `Code Walkthrough` | ADT / Eclipse | Phân biệt liên kết lỏng (Association) và liên kết sở hữu chặt chẽ (Composition). |
| **TOPIC-04-03** | UI LineItem & Identification | Cơ bản | `Code Walkthrough` | ADT / Eclipse | Khai báo cột hiển thị trên bảng (`@UI.lineItem`) và tiêu đề form. |
| **TOPIC-04-04** | UI Facets (FieldGroup, Collection)| Trung bình | `Code Walkthrough` | ADT / Eclipse | Phân nhóm bố cục màn hình Object Page thành Facets, Sections, Groups. |
| **TOPIC-04-05** | SelectionField & Presentation | Cơ bản | `Code Walkthrough` | ADT / Eclipse | Đưa trường vào thanh lọc tìm kiếm (`@UI.selectionField`) và sắp xếp mặc định. |
| **TOPIC-04-06** | Metadata Extensions (MDE) | Trung bình | `Code Walkthrough` | ADT / Eclipse | Tách biệt UI annotations ra file `.ddlx` để giữ CDS data model trong sạch. |
| **TOPIC-04-07** | Semantics (Amount & Currency) | Cơ bản | `Code Walkthrough` | ADT / Eclipse | Khai báo liên kết số tiền và đồng tiền (`@Semantics.amount.currencyCode`). |
| **TOPIC-04-08** | Virtual Elements in CDS | Nâng cao | **`SAP Connected`** | **Bắt buộc SAP 2025** | Tính toán trường ảo tại runtime qua ABAP calculation class. |

---

### NHÓM 05: ODATA V4 PROTOCOL (P0)

| Topic ID | Tên Kỹ Thuật | Độ Khó | Hình Thức Thực Thi | Môi Trường Khả Dụng | Mô Tả Tóm Tắt |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **TOPIC-05-01** | OData V4 Metadata Inspection | Cơ bản | `Standalone` | CAP / SAP Gateway | Bóc tách tài liệu `$metadata`, EntitySets, EntityTypes, ComplexTypes. |
| **TOPIC-05-02** | Query Options: $filter, $select | Cơ bản | `Standalone` | CAP / SAP Gateway | Cú pháp lọc dữ liệu, chọn trường trong OData V4 (`eq`, `contains`, `in`). |
| **TOPIC-05-03** | Query Options: $expand (Nested) | Trung bình | `Standalone` | CAP / SAP Gateway | Mở rộng nạp dữ liệu quan hệ cha-con lồng nhau chỉ bằng một request. |
| **TOPIC-05-04** | Bound Actions vs Unbound Actions | Trung bình | `Standalone` | CAP / SAP Gateway | Thực thi nghiệp vụ gắn liền với 1 instance hoặc độc lập ở cấp dịch vụ. |
| **TOPIC-05-05** | OData V4 Functions (Read-only) | Trung bình | `Standalone` | CAP / SAP Gateway | Hàm đọc tính toán dữ liệu không làm biến đổi trạng thái hệ thống. |
| **TOPIC-05-06** | Multipart $batch Requests | Nâng cao | `Standalone` | CAP / SAP Gateway | Đóng gói nhiều thao tác đọc/ghi vào một HTTP payload duy nhất. |
| **TOPIC-05-07** | ETag Optimistic Concurrency | Nâng cao | `Standalone` | CAP / SAP Gateway | Kiểm soát xung đột ghi đè bằng `If-Match` header và ETag tokens. |

---

### NHÓM 06: ABAP RAP (RESTFUL APPLICATION PROGRAMMING) (P0)

| Topic ID | Tên Kỹ Thuật | Độ Khó | Hình Thức Thực Thi | Môi Trường Khả Dụng | Mô Tả Tóm Tắt |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **TOPIC-06-01** | BDEF Syntax & strict(2) Mode | Cơ bản | `Code Walkthrough` | ADT / Eclipse | Khai báo Behavior Definition tuân thủ chuẩn Clean Core nghiêm ngặt. |
| **TOPIC-06-02** | Managed Scenario CRUD Engine | Trung bình | **`SAP Connected`** | **Bắt buộc SAP 2025** | Framework tự động hóa hoàn toàn việc đọc/ghi DB và transactional buffer. |
| **TOPIC-06-03** | Draft Architecture (Active/Draft)| Nâng cao | **`SAP Connected`** | **Bắt buộc SAP 2025** | Cơ chế lưu nháp tự động trên bảng Draft và kiểm soát khóa Lock Master. |
| **TOPIC-06-04** | Total ETag vs ETag Master | Nâng cao | **`SAP Connected`** | **Bắt buộc SAP 2025** | Phân biệt Total ETag ở Root và ETag Master ở từng thực thể con. |
| **TOPIC-06-05** | Determinations on Modify/Save | Trung bình | **`SAP Connected`** | **Bắt buộc SAP 2025** | Tự động tính toán giá trị khi sửa đổi trường hoặc trước khi lưu. |
| **TOPIC-06-06** | Validations on Save | Trung bình | **`SAP Connected`** | **Bắt buộc SAP 2025** | Kiểm tra tính hợp lệ dữ liệu, trả về FAILED và REPORTED thông báo. |
| **TOPIC-06-07** | Instance & Static Actions | Trung bình | **`SAP Connected`** | **Bắt buộc SAP 2025** | Xử lý logic nút bấm nghiệp vụ trong Behavior Pool qua EML. |
| **TOPIC-06-08** | Dynamic Feature Control | Nâng cao | **`SAP Connected`** | **Bắt buộc SAP 2025** | Đóng/mở quyền sửa trường hoặc bấm nút dựa trên trạng thái bản ghi (`%features`). |
| **TOPIC-06-09** | Managed with Unmanaged Save | Nâng cao | **`SAP Connected`** | **Bắt buộc SAP 2025** | Kịch bản 2A: Tự kiểm soát pha lưu dữ liệu trong saver method `save_modified`. |
| **TOPIC-06-10** | Pure Unmanaged RAP Scenario | Nâng cao | **`SAP Connected`** | **Bắt buộc SAP 2025** | Kịch bản 2B: Tự viết 100% CRUD và buffer tuân thủ RAP contract. |
| **TOPIC-06-11** | CDS Custom Entity & Query Prov | Nâng cao | **`SAP Connected`** | **Bắt buộc SAP 2025** | Kịch bản 3: Xây dựng thực thể ảo trả dữ liệu qua `IF_RAP_QUERY_PROVIDER`. |
| **TOPIC-06-12** | EML (Read, Modify, Commit) | Nâng cao | `Code Walkthrough` | ADT / Console | Lập trình tương tác Business Object bằng cú pháp EML chuẩn hóa. |

---

### NHÓM 07: SECURITY & AUTHORIZATION (P1)

| Topic ID | Tên Kỹ Thuật | Độ Khó | Hình Thức Thực Thi | Môi Trường Khả Dụng | Mô Tả Tóm Tắt |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **TOPIC-07-01** | DCL Row-level Access Control | Trung bình | **`SAP Connected`** | **Bắt buộc SAP 2025** | Giới hạn dòng dữ liệu người dùng được xem bằng Data Control Language. |
| **TOPIC-07-02** | Instance Authorization in RAP | Nâng cao | **`SAP Connected`** | **Bắt buộc SAP 2025** | Phân quyền động cho từng hành động cụ thể trên từng bản ghi. |
| **TOPIC-07-03** | CSRF Protection & Handshake | Trung bình | `Standalone` | FE Mock / Gateway | Cơ chế bắt tay lấy token và bảo vệ chống tấn công CSRF. |
| **TOPIC-07-04** | PFCG Roles & Authorizations | Trung bình | `SAP Connected` | SAP GUI (PFCG) | Thiết lập vai trò người dùng và phân quyền Catalog / Space. |
| **TOPIC-07-05** | ABAP Language Versions (Cloud) | Nâng cao | `Code Walkthrough` | Documentation / ADT | Phân biệt Standard ABAP và ABAP for Cloud Development (Clean Core). |

---

### NHÓM 08: ADVANCED SAPUI5 COMPONENTS (P1)

| Topic ID | Tên Kỹ Thuật | Độ Khó | Hình Thức Thực Thi | Môi Trường Khả Dụng | Mô Tả Tóm Tắt |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **TOPIC-08-01** | DynamicPage Layout | Trung bình | `Standalone` | Local UI5 | Thiết kế trang bố cục co giãn hiện đại với Snapping Header. |
| **TOPIC-08-02** | MicroCharts in Tables/Lists | Trung bình | `Standalone` | Local UI5 | Nhúng biểu đồ thu nhỏ (Bullet, Radial, Harvey) ngay trên dòng bảng. |
| **TOPIC-08-03** | UploadSet File Management | Trung bình | `Standalone` | Local UI5 | Quản lý tải lên, đính kèm và xem trước tệp tin trong UI5. |
| **TOPIC-08-04** | SmartControls vs V4 Building Blk| Nâng cao | `Code Walkthrough` | Documentation | So sánh SmartControls (V2 legacy) với Building Blocks (V4 hiện đại). |
| **TOPIC-08-05** | Custom Value Help Dialog | Trung bình | `Standalone` | Local UI5 | Tự xây dựng hộp thoại tìm kiếm giá trị phức tạp đa trường lọc. |

---

### NHÓM 09: INTEGRATION & CONNECTIVITY (P1)

| Topic ID | Tên Kỹ Thuật | Độ Khó | Hình Thức Thực Thi | Môi Trường Khả Dụng | Mô Tả Tóm Tắt |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **TOPIC-09-01** | UI5 Tooling Proxy Middleware | Trung bình | `Standalone` | Local Node.js | Cấu hình proxy cục bộ để vượt rào cản CORS khi kết nối SAP. |
| **TOPIC-09-02** | SM59 Outbound Destinations | Trung bình | `Code Walkthrough` | SAP GUI (SM59) | Phân biệt cấu hình RFC/HTTP backend-to-backend trong hệ thống SAP. |
| **TOPIC-09-03** | SAP BTP Connectivity Architecture| Nâng cao | `Concept Only` | Documentation | Luồng kết nối từ Cloud về On-Premise qua Cloud Connector và Destination. |
| **TOPIC-09-04** | REST / External API in ABAP | Nâng cao | **`SAP Connected`** | **Bắt buộc SAP 2025** | Tiêu thụ REST API bên ngoài từ bên trong ABAP RAP runtime. |

---

### NHÓM 10: TESTING, DEBUGGING & DEPLOYMENT (P1)

| Topic ID | Tên Kỹ Thuật | Độ Khó | Hình Thức Thực Thi | Môi Trường Khả Dụng | Mô Tả Tóm Tắt |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **TOPIC-10-01** | QUnit Unit Testing in UI5 | Trung bình | `Standalone` | Local Browser / CLI | Viết test case kiểm tra hàm logic, formatter và helper độc lập. |
| **TOPIC-10-02** | OPA5 End-to-End Journey Testing | Nâng cao | `Standalone` | Local Browser / CLI | Tự động hóa kiểm thử hành trình người dùng trên giao diện UI5. |
| **TOPIC-10-03** | ABAP Unit Testing for RAP BO | Nâng cao | **`SAP Connected`** | **Bắt buộc Eclipse ADT** | Viết class test tự động kiểm tra Determinations, Validations qua EML. |
| **TOPIC-10-04** | Fiori Tools Deployment to ABAP | Trung bình | `SAP Connected` | VS Code / CLI | Đóng gói và deploy ứng dụng vào ABAP Repository/BSP qua CTS. |
| **TOPIC-10-05** | FLP Content Activation (Spaces) | Trung bình | `SAP Connected` | S/4HANA Launchpad | Kích hoạt Tiles, Catalogs, Spaces và Pages trên Launchpad thực tế. |

