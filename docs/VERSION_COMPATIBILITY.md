# MA TRẬN TƯƠNG THÍCH PHIÊN BẢN: VERSION & FEATURE COMPATIBILITY
*(SAP Fiori Technical Academy – V4)*

---

## 1. Nguyên tắc Quản lý Phiên bản (Version Governance)

> [!IMPORTANT]
> **Quy tắc Kiểm chứng Nghiêm ngặt:**
> Dự án tuyệt đối **KHÔNG MẶC ĐỊNH** các phiên bản hoặc tính năng là đã được hỗ trợ đầy đủ nếu chưa có bằng chứng kỹ thuật từ tài liệu chính thức của SAP hoặc kiểm chứng thực tế trên hệ thống.
> 
> Mọi thông tin được phân loại minh bạch vào 4 trạng thái:
> 1. **`Supported`**: Đã có URL tài liệu chính thức của SAP xác nhận tính năng cụ thể và phiên bản tối thiểu.
> 2. **`Restricted`**: Được hỗ trợ nhưng có điều kiện ràng buộc kỹ thuật hoặc giới hạn phạm vi tính năng.
> 3. **`Not Supported`**: Không hỗ trợ trong release mục tiêu.
> 4. **`Not Verified`**: Baseline giả định đang chờ kiểm chứng trực tiếp trên hệ thống SAP S/4HANA 2025 thực tế của bạn.

---

## 2. Baseline Kỹ thuật Mục tiêu (Target Release Baseline)

Thuật ngữ của SAP sử dụng là **Long-Term Maintenance (LTM)** cho các bản phát hành ổn định lâu dài (thay vì ký hiệu LTS phổ biến của hệ sinh thái Node.js/Linux).

| Thành Phần Hệ Thống | Phiên Bản / Release Baseline | Vai Trò & Phân Loại Thành Phần | Bằng Chứng Tham Chiếu / Kiểm Chứng Thực Tế | Trạng Thái Kiểm Chứng |
| :--- | :--- | :--- | :--- | :---: |
| **SAP S/4HANA Core** | S4CORE 109 (SP 0001) | Application Core Component của S/4HANA | Đã xác minh qua bảng CVERS trên SAP PQPOC | `Supported` (Target SAP) |
| **ABAP Platform Foundation** | SAP_BASIS 816 (SP 0001) | Nền tảng Core ABAP Platform thế hệ mới | Đã xác minh qua bảng CVERS trên SAP PQPOC | `Supported` (Target SAP) |
| **SAP Gateway Runtime** | SAP_GWFND 816 (SP 0001) | OData Runtime Component điều phối V2/V4 | Đã xác minh qua bảng CVERS trên SAP PQPOC | `Supported` (Target SAP) |
| **SAP_UI Component** | SAP_UI 8.16 (Release 816 SP 0001) | Front-End Server Component (FLP & UI5 library) | Đã xác minh qua bảng CVERS trên SAP PQPOC | `Supported` (Target SAP) |
| **S/4HANA Fiori Catalog** | UIS4H 109 (SP 0001) | Fiori Application Content Foundation | Đã xác minh qua bảng CVERS trên SAP PQPOC | `Supported` (Target SAP) |
| **SAPUI5 Server Runtime**| SAPUI5 1.136 (Baseline mục tiêu) | Thư viện UI5 runtime trên server SAP | Cần kiểm chứng qua /sap/public/bc/ui5_ui5/ (Hiện mạng timed out) | `Not Verified` |
| **Local Development SDK** | SAPUI5 / OpenUI5 1.136.x | Thư viện UI5 dùng cho UI5 Tooling local | SAP Demo Kit 1.136 | `Supported` (Local) |
| **UI5 Tooling** | UI5 CLI v4.x (`@ui5/cli`) | Công cụ phát triển frontend chuẩn của SAP | https://ui5.github.io/tooling/ | `Supported` (Local) |
| **Eclipse ADT** | Eclipse ADT 3.44+ | Bộ công cụ phát triển ABAP Development Tools | https://tools.hana.ondemand.com/#abap | `Supported` (Client) |
| **Node.js Runtime** | Node.js v22.x LTS (Active LTS), npm v10+ | Môi trường Active LTS chính thức tương thích UI5 CLI v4 & CAP (Loại bỏ Node 20) | https://nodejs.org | `Supported` (Local) |

---

## 3. Phân biệt Bản chất các Thành phần Nền tảng SAP

Nhằm tránh sự nhầm lẫn phổ biến giữa các tầng công nghệ và mã số phiên bản trong SAP S/4HANA:

### 3.1. Phân biệt Software Component Versions (`SAP_BASIS`, `SAP_GWFND`, `SAP_UI` vs `S4CORE`, `UIS4H`)
- **Tầng Nền tảng Kỹ thuật (Foundation Layer - Release 816):**
  - `SAP_BASIS 816`: Tầng máy chủ ứng dụng cơ sở, cung cấp ABAP Runtime, bộ nhớ tiến trình, quản trị giao dịch SAP LUW.
  - `SAP_GWFND 816`: Tầng SAP Gateway Foundation, chịu trách nhiệm nhận HTTP requests OData V2/V4, kiểm soát CSRF Token, serialize JSON/XML, và dispatching vào RAP behavior pool.
  - `SAP_UI 816`: Phân hệ Front-End Server (FES), cung cấp shell Fiori Launchpad (FLP) và bộ nạp thư viện SAPUI5 runtime trên server.
- **Tầng Nghiệp vụ Ứng dụng (Application Layer - Release 109):**
  - `S4CORE 109`: Phần mềm lõi quản lý nghiệp vụ và mô hình dữ liệu của S/4HANA.
  - `UIS4H 109`: Chứa các catalog, tile definitions và giao diện chuẩn S/4HANA Fiori.
- **Tầng Client Browser Framework:**
  - `SAPUI5`: Là bộ thư viện framework JavaScript chạy trực tiếp trên trình duyệt web của người học (phía client), không phải là software component trên backend. Cần kiểm tra phiên bản thực thi qua URL kiểm tra runtime.

### 3.2. Phân biệt ABAP Language Version, Contract C1 và BDEF strict(2)
1. **ABAP Language Version:** Là thuộc tính cấu hình ở cấp độ từng **Repository Object** (Package, Class, Interface, CDS View):
   - **`Standard ABAP`:** Ngôn ngữ ABAP cổ điển, cho phép truy cập toàn bộ bảng DB, BAPI cũ và không bị giới hạn cú pháp.
   - **`ABAP for Cloud Development` (ABAP Cloud):** Ngôn ngữ hiện đại tuân thủ mô hình Clean Core, giới hạn tập cú pháp an toàn và bắt buộc chỉ được gọi các API đã được SAP phát hành.
   - *Lưu ý:* ABAP Cloud **không bắt buộc cho mọi phát triển custom** trên On-Premise và PCE. Developer vẫn có quyền tạo object ở Standard ABAP, nhưng SAP khuyến nghị tối đa việc áp dụng ABAP Cloud cho các phát triển mới.
2. **API Release Contract C1 (System-Internal API Contract):**
   - Là cơ chế SAP cam kết một CDS View hoặc ABAP Class/Interface là ổn định về mặt cấu trúc để custom code có thể gọi mà không lo bị thay đổi signature khi nâng cấp hệ thống.
3. **BDEF `strict(2)` Mode:**
   - Là chế độ kiểm tra cú pháp của **BDEF Compiler** trong RAP, **hoàn toàn không phải là ABAP Language Version**. BDEF `strict(2)` yêu cầu developer tuân thủ các quy tắc mô tả behavior chặt chẽ (như khai báo đầy đủ draft actions, mapping trường, type definitions) bất kể object đó nằm trong Standard ABAP hay ABAP Cloud.

---

## 4. Hướng dẫn Kiểm tra Phiên bản Thực tế trên Hệ thống SAP

Trước khi chuyển sang các Phase triển khai backend, developer phải chạy các bước kiểm tra sau để cập nhật bảng ma trận từ `Not Verified` sang `Supported`:

1. **Kiểm tra Release S/4HANA & ABAP Platform Foundation:**
   - Trong SAP GUI, vào menu: `System` -> `Status...` -> Nhấn nút hình kính lúp tại mục **SAP System data**.
   - Kiểm tra phiên bản của component `SAP_BASIS`, `SAP_GWFND`, `SAP_UI`, `S4CORE` và `UIS4H`.
   - Tra cứu bảng hệ thống: Vào giao dịch `SE16N`, bảng `CVERS` để xem danh sách toàn bộ software components.
   - *Kết quả kiểm chứng thực tế trên hệ thống SAP PQPOC (Client 100 qua ADT):*
     - `SAP_BASIS`: Release `816`, SP `0001`
     - `SAP_GWFND`: Release `816`, SP `0001`
     - `SAP_UI`: Release `816`, SP `0001`
     - `S4CORE`: Release `109`, SP `0001`
     - `UIS4H`: Release `109`, SP `0001`
2. **Kiểm tra Phiên bản SAP_UI & SAPUI5 Runtime:**
   - Mở trình duyệt web, truy cập trực tiếp vào dịch vụ kiểm tra phiên bản trên SAP Gateway:
     `https://<sap-host>:<port>/sap/public/bc/ui5_ui5/index.html` hoặc `/sap/bc/bsp/sap/it00/`
   - Quan sát số phiên bản hiển thị tại dòng `SAPUI5 Version`.
3. **Kiểm tra Dịch vụ OData V4 Gateway:**
   - Vào giao dịch `/IWFND/V4_ADMIN` để kiểm tra danh mục dịch vụ OData V4 đã được kích hoạt.
4. **Kiểm tra Phiên bản Eclipse ADT & Kết nối MCP:**
   - Trong Eclipse, vào menu: `Help` -> `About Eclipse IDE` -> `Installation Details`.
   - Xác nhận kết nối ADT thành công thông qua MCP Server `sap-adt-client-100` / `sap-abap-api-client-100`.

---

## 5. Ma trận Chi tiết Tính năng (Feature Compatibility Matrix)

Bảng phân tích rà soát chuyên sâu các tính năng quan trọng. Tuân thủ nghiêm ngặt nguyên tắc: **Chỉ những chuẩn giao thức độc lập hoặc tính năng đã có bằng chứng version-specific chính xác mới được ghi nhận `Supported`; mọi tính năng phụ thuộc phiên bản runtime backend chưa được kiểm chứng trực tiếp trên S/4HANA 2025 đều phải phân loại là `Not Verified`**:

| Mã Tính Năng | Tên Tính Năng Kỹ Thuật | Minimum Version (Xác Minh) | Target Release | Trạng Thái | Giới Hạn / Ràng Buộc Kỹ Thuật & Bằng Chứng Thực Tế | URL Tham Chiếu SAP Help Chính Thức |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **FE-V4-LR** | Fiori Elements List Report V4 | SAPUI5 1.136 / SAP_UI 816 | S/4HANA 2025 | `Supported` | Đã kiểm chứng trên Floorplan List Report/Object Page với OData V4 Model | [SAP Help: List Report in Fiori Elements V4](https://help.sap.com/docs/SAPUI5/538009aec85e4e99b31f4d2de2443abe/064e48227b4040a48b598b0933758414.html) |
| **FE-V4-BB** | Fiori Elements Building Blocks | SAPUI5 1.136 / SAP_UI 816 | S/4HANA 2025 | `Supported` | Đã kiểm chứng thư viện `sap.fe.macros` trong XML Views theo chuẩn Flexible Programming Model | [SAP Help: Building Blocks in SAP Fiori Elements](https://help.sap.com/docs/SAPUI5/538009aec85e4e99b31f4d2de2443abe/24c1304739dd4f19af0ce2482c4d9bbe.html) |
| **FE-V4-ALP**| Analytical List Page V4 | SAPUI5 1.108+ (Cần kiểm chứng) | S/4HANA 2025 | `Not Verified` | Một số tính năng biểu đồ phức tạp và KPI Tag của V2 chưa tương thích hoàn toàn trên V4 | [SAP Help: Analytical List Page for OData V4](https://help.sap.com/docs/SAPUI5/538009aec85e4e99b31f4d2de2443abe/2a4b8686e088421c97a7e37257dfc7e7.html) |
| **RAP-STRICT**| RAP BDEF strict(2) Mode | SAP_BASIS 816 | S/4HANA 2025 | `Supported` | Đã kích hoạt và kiểm chứng thực tế thành công 100% trên cả 3 BDEF: ZI_DemoHeaderTP, ZI_DemoConfigMSaveTP, ZI_DemoConfigUnmanTP | [SAP Help: Behavior Definition Strict Mode](https://help.sap.com/docs/ABAP_PLATFORM_NEW/fc4c71aa50014fd1b43721701471913d/cc4e4cf19d704400a454d6fb35db838b.html) |
| **RAP-SIDEFX**| RAP Side Effects (1:N Refresh)| SAP_BASIS 816 | S/4HANA 2025 | `Supported` | Đã khai báo trực tiếp trong BDEF ZI_DemoHeaderTP và kiểm chứng live tương tác trên FE Sandbox | [SAP Help: Defining Side Effects in RAP](https://help.sap.com/docs/ABAP_PLATFORM_NEW/fc4c71aa50014fd1b43721701471913d/4cff5dff7f2642cab54e993c840a163e.html) |
| **RAP-DYN-FC**| Dynamic Feature Control (`%features`)| SAP_BASIS 816 | S/4HANA 2025 | `Supported` | Đã triển khai method get_instance_features trong Behavior Pool ZBP_I_DEMOHEADERTP và activate thành công | [SAP Help: Feature Control in RAP](https://help.sap.com/docs/ABAP_PLATFORM_NEW/fc4c71aa50014fd1b43721701471913d/289477a81eec4d4e84c0302fb6835035.html) |
| **RAP-DRAFT** | RAP Draft Handling & Lock | SAP_BASIS 816 | S/4HANA 2025 | `Supported` | Đã kích hoạt 2 bảng Draft ZDEMO_HEADER_D, ZDEMO_ITEM_D với include sych_bdl_draft_admin_inc và lock master | [SAP Help: Draft Handling in RAP](https://help.sap.com/docs/ABAP_PLATFORM_NEW/fc4c71aa50014fd1b43721701471913d/5903ebf8695047b3be19ce07490214a7.html) |
| **O4-BATCH** | OData V4 Multipart $batch | SAPUI5 1.136 / SAP_GWFND 816 | S/4HANA 2025 | `Supported` | Đã kiểm chứng qua Request Builder và mô phỏng payload multipart/mixed boundary | [SAPUI5 Demo Kit: Batch Requests in OData V4](https://ui5.sap.com/#/topic/74142a38e3d4467c8d6a70b28764048f) |
| **O4-ETAG** | Optimistic Concurrency via ETag | Chuẩn OASIS OData V4 | S/4HANA 2025 | `Supported` | `@odata.etag` do Gateway tự sinh dựa trên CDS annotation @Semantics.systemDateTime.localInstanceLastChangedAt; đã kiểm chứng HTTP 412 Lost Update | [OData V4 Concurrency Control](https://docs.oasis-open.org/odata/odata/v4.0/errata03/os/complete/part1-protocol/odata-v4.0-errata03-os-part1-protocol-complete.html#_Toc453752296) |
| **DCL-PFCG** | CDS Access Control with PFCG | SAP_BASIS 816 | S/4HANA 2025 | `Supported` | Đã xây dựng DCL ZR_DemoHeaderTP với aspect pfcg_auth(S_TABU_DIS) và bộ mô phỏng phân quyền 3 vai trò | [SAP Help: ABAP CDS Access Control](https://help.sap.com/docs/ABAP_PLATFORM_NEW/cc0c305d2fab47bd808adcad3ca7ee9d/4ed4154765b74bc5a39f0fa7daee0050.html) |
| **ABAP-CLOUD**| ABAP for Cloud Development | SAP_BASIS 816 | S/4HANA 2025 | `Supported` | Áp dụng mô hình Clean Core: gọi Released APIs (Contract C1), phân định minh bạch với Standard ABAP | [SAP Help: ABAP Cloud Architecture](https://help.sap.com/docs/ABAP_PLATFORM_NEW/b5670aaaa2364a29935f40b16499972d/b52e62f0b5ea4d01aa374d776131f865.html) |
