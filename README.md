# SAP Fiori Technical Academy – V4
*(Nền tảng Thực hành & Trình diễn Kỹ thuật Chuyên sâu SAP S/4HANA 2025)*

---

## 1. Giới thiệu Dự án

**SAP Fiori Technical Academy – V4** là dự án chuyên sâu phục vụ học tập, nghiên cứu và thực hành kiến trúc kỹ thuật hiện đại của hệ sinh thái SAP:
- **SAP Fiori Elements OData V4** (Metadata-driven Applications)
- **Freestyle SAPUI5** (MVC, Custom Controls, Responsive Layouts)
- **OData V4 Protocol** (Metadata, Batch, Concurrency, Actions/Functions)
- **ABAP RESTful Application Programming Model (ABAP RAP)** trên **SAP S/4HANA 2025**

> [!IMPORTANT]
> **Phạm vi Dự án:** Dự án **tuyệt đối không xây dựng ứng dụng nghiệp vụ** (Sales Order, Purchase Order, Maintenance, HR...). Toàn bộ tài nguyên tập trung vào **Generic Technical Domain** (`DemoHeader`, `DemoItem`, `DemoConfig`, `DemoLog`) để minh họa trọn vẹn bản chất kỹ thuật sâu nhất của framework.

---

## 2. Bản đồ Điều hướng Toàn bộ Tài liệu (Documentation Sitemap)

Mọi khía cạnh kiến trúc, thiết kế và kế hoạch phát triển được tài liệu hóa minh bạch trong thư mục [`docs/`](./docs/):

| STT | Tài Liệu | Mục Đích & Nội Dung Chính |
| :---: | :--- | :--- |
| **01** | [`docs/AI_TASK_PLAN.md`](./docs/AI_TASK_PLAN.md) | **Single Source of Truth** quản lý tiến độ, checklist 7 Phase và trạng thái kiểm chứng. |
| **02** | [`docs/PROJECT_OVERVIEW.md`](./docs/PROJECT_OVERVIEW.md) | Tầm nhìn, 5 nguyên tắc cốt lõi, 3 cấp độ học tập (*Fundamental, Implementation, Advanced*). |
| **03** | [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Kiến trúc đa tầng, FES Topology (Embedded vs Hub), Dual Mode (Standalone vs Connected). |
| **04** | [`docs/TECHNICAL_CATALOG.md`](./docs/TECHNICAL_CATALOG.md) | Danh mục 10 Nhóm kỹ thuật (80+ topics), Ma trận mapping 9 Labs, Learning Execution Matrix. |
| **05** | [`docs/VERSION_COMPATIBILITY.md`](./docs/VERSION_COMPATIBILITY.md) | Baseline S/4HANA 2025, SAPUI5 1.136 LTM, Feature Compatibility Matrix 4 mức. |
| **06** | [`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md) | Thiết kế 3 BOs: DemoHeader (Draft), DemoConfig (Unmanaged Scenarios), DemoLog (Custom Entity). |
| **07** | [`docs/ROADMAP.md`](./docs/ROADMAP.md) | Lộ trình chi tiết 14 tuần từ Phase 0 đến Phase 7, ma trận phụ thuộc nghiêm ngặt giữa các Phase. |
| **08** | [`docs/CODING_STANDARDS.md`](./docs/CODING_STANDARDS.md) | Chuẩn ABAP Cloud vs Standard ABAP, Clean Code, strict(2), quy tắc đặt tên Backend/Frontend. |
| **09** | [`docs/ENVIRONMENT_SETUP.md`](./docs/ENVIRONMENT_SETUP.md) | Hướng dẫn cài đặt VS Code, UI5 CLI, FE-Mockserver, Eclipse ADT và cấu hình an toàn. |
| **10** | [`docs/TEST_STRATEGY.md`](./docs/TEST_STRATEGY.md) | Chiến lược kiểm thử tự động đa tầng: QUnit, OPA5 và ABAP Unit for RAP BO. |

---

## 3. Kiến trúc Thực thi Kép (Dual Execution Architecture)

Hệ thống hỗ trợ chuyển đổi linh hoạt giữa 2 chế độ:
- **`Standalone Mode` (Offline):** Chạy trên máy tính cá nhân qua `@sap-ux/ui5-middleware-fe-mockserver` và `CAP Node.js`, phục vụ học tập Fiori Elements UI và giao thức OData V4 mà không cần kết nối SAP.
- **`SAP Connected Mode` (Online):** Kết nối trực tiếp vào SAP S/4HANA 2025 Backend để chạy và kiểm chứng toàn bộ RAP Runtime, EML, Transactional Buffer, Draft table và DCL Authorization thật.

---

## 4. Trạng thái Dự án Hiện tại

- **Giai đoạn:** **Phase 0 – Architecture & Compatibility**
- **Trạng thái:** Đã hoàn thiện toàn bộ cấu trúc thư mục và 11 tài liệu kiến trúc kỹ thuật.
- **Quy tắc:** Tuyệt đối không sinh mã ứng dụng (UI/ABAP) trong Phase 0. Đang dừng lại chờ nghiệm thu trước khi bước sang Phase 1.

