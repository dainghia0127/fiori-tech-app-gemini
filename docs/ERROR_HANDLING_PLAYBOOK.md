# CẨM NANG XỬ LÝ LỖI & SỰ CỐ KỸ THUẬT (ERROR HANDLING PLAYBOOK)
## SAP Fiori Technical Academy – V4 (S/4HANA 2025 & SAPUI5 V4)

> **Tài liệu đúc kết thực chiến:** Ghi nhận toàn bộ 15 sự cố, lỗi biên dịch, xung đột runtime và bài học kinh nghiệm phát sinh từ khi khởi tạo dự án (Phase 0) đến khi hoàn tất kiểm thử live trên SAP S/4HANA 2025 (Phase 5).

---

## MỤC LỤC TỔNG HỢP CÁC SỰ CỐ

### Nhóm 1: Sự cố Frontend & SAPUI5 Tooling
- [ERR-01: Lỗi Trùng Port và Xung đột Dev Server 8085](#err-01-lỗi-trùng-port-và-xung-đột-dev-server-8085)
- [ERR-02: Lỗi Thư mục Gốc khi Build UI5 CLI (`Unable to find source directory 'webapp'`)](#err-02-lỗi-thư-mục-gốc-khi-build-ui5-cli)
- [ERR-03: Lỗi Assertion Unit Test Guideline khi Mở Rộng 10 Chương](#err-03-lỗi-assertion-unit-test-guideline-khi-mở-rộng-10-chương)

### Nhóm 2: Sự cố OData V4, Fiori Elements & Mock Server
- [ERR-04: Cú pháp Điều hướng Annotation Side Effects (`_Header/TotalAmount` vs `_Header.TotalAmount`)](#err-04-cú-pháp-điều-hướng-annotation-side-effects)
- [ERR-05: Lỗi HTTP 412 Precondition Failed khi Mô phỏng ETag Concurrency](#err-05-lỗi-http-412-precondition-failed-khi-mô-phỏng-etag-concurrency)

### Nhóm 3: Sự cố ADT Tools API & SAP Connectivity
- [ERR-06: ADT REST `createObject` Thiếu Tham số Parent Package Path](#err-06-adt-rest-createobject-thiếu-tham-số-parent-package-path)
- [ERR-07: Không thể Tạo Behavior Definition (`BDEF/BDO`) qua `createObject`](#err-07-không-thể-tạo-behavior-definition-bdefbdo-qua-createobject)
- [ERR-08: Lỗi Session ADT Timeout (`Session timed out or not found`)](#err-08-lỗi-session-adt-timeout)

### Nhóm 4: Sự cố ABAP RAP & Kernel Backend Engine (S/4HANA 2025)
- [ERR-09: Lỗi Cú pháp ABAP String Template Chứa Ký Tự `{` Không Có Dấu Cách](#err-09-lỗi-cú-pháp-abap-string-template-chứa-ký-tự--không-có-dấu-cách)
- [ERR-10: Kiểu Dữ liệu `timestampl` Bất Tương Thích với Hàm `utclong_current()`](#err-10-kiểu-dữ-liệu-timestampl-bất-tương-thích-với-hàm-utclong_current)
- [ERR-11: Lỗi `Class does not implement if_oo_adt_classrun~main method!` khi Chạy `runClass`](#err-11-lỗi-class-does-not-implement-if_oo_adt_classrunmain-method-khi-chạy-runclass)
- [ERR-12: Lỗi BDL Compiler `+BDL(003)`: `"draft" was expected, not "save"`](#err-12-lỗi-bdl-compiler-bdl003-draft-was-expected-not-save)
- [ERR-13: Lỗi BDL Compiler `+BDL(201)`: `strict ( 2 )` Bắt buộc Khai báo `authorization master`](#err-13-lỗi-bdl-compiler-bdl201-strict--2--bắt-buộc-khai-báo-authorization-master)
- [ERR-14: Lỗi Biên Dịch `SELECT(353)`: Mismatch Giữa Snake_Case DB và CamelCase BDEF Derived Type](#err-14-lỗi-biên-dịch-select353-mismatch-giữa-snake_case-db-và-camelcase-bdef-derived-type)
- [ERR-15: Lỗi Duplicate Primary Key (`DBSQL_DUPLICATE_KEY_ERROR`) khi Chạy Lại EML Playground](#err-15-lỗi-duplicate-primary-key-dbsql_duplicate_key_error-khi-chạy-lại-eml-playground)

---

## CHI TIẾT TỪNG SỰ CỐ & GIẢI PHÁP

### ERR-01: Lỗi Trùng Port và Xung đột Dev Server 8085
- **Ngữ cảnh (Action Context):** Khi khởi động server phát triển bằng lệnh `ui5 serve --port 8085` hoặc khi chạy test script nền nhiều lần.
- **Hiện tượng (Symptom):** Báo lỗi `EADDRINUSE: address already in use :::8085`.
- **Nguyên nhân gốc rễ (Root Cause):** Phiên làm việc trước đó hoặc tiến trình Node.js ngầm chưa được giải phóng tài nguyên cổng.
- **Tư duy phân tích (Thought Process):** Không đổi cổng tùy tiện để tránh làm sai lệch cấu hình trong test runner và reverse proxy; cần tìm PID đang chiếm dụng port và giải phóng triệt để.
- **Cách giải quyết (Resolution):**
  Chạy lệnh PowerShell tìm và dừng tiến trình giữ cổng:
  ```powershell
  Get-NetTCPConnection -LocalPort 8085 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
  ```
- **Fresher Gotcha:** Luôn cấu hình kill handler trong `beforeExit` hoặc `SIGINT` của Node.js test script để tự động dọn tiến trình con.

---

### ERR-02: Lỗi Thư mục Gốc khi Build UI5 CLI
- **Ngữ cảnh (Action Context):** Đứng tại thư mục gốc của dự án `e:\AI Code\Gemini Code\Fiori\FIORI_TECH_APP` và chạy `npm run build`.
- **Hiện tượng (Symptom):**
  `Unable to find source directory 'webapp' in application project sap.fiori.tech.academy`
- **Nguyên nhân gốc rễ (Root Cause):** Cấu hình `ui5.yaml` nằm trong `src/frontend/` và file descriptor `manifest.json` nằm tại `src/frontend/webapp/`. Khi đứng tại thư mục root thì UI5 CLI không tìm thấy thư mục `webapp` cục bộ.
- **Tư duy phân tích (Thought Process):** Kiểm tra cấu trúc phân tầng: Frontend được cô lập trong `src/frontend` để tách biệt với `src/backend`. Mọi lệnh build frontend phải trỏ đúng working directory.
- **Cách giải quyết (Resolution):**
  Chuyển vào thư mục `src/frontend` trước khi chạy lệnh:
  ```bash
  cd src/frontend && npm run build
  ```
- **Fresher Gotcha:** Nhận diện rõ cấu trúc Multi-module repository giữa Frontend UI5 và Backend ABAP.

---

### ERR-03: Lỗi Assertion Unit Test Guideline khi Mở Rộng 10 Chương
- **Ngữ cảnh (Action Context):** Sau khi nâng cấp cẩm nang Fresher Guideline từ 7 chương lên 10 chương toàn diện, chạy bộ test `test_frontend_runtime.js`.
- **Hiện tượng (Symptom):** Test suite báo lỗi: `[FAIL] Guideline chứa đầy đủ 7/7 chương (expected 7, received 10)`.
- **Nguyên nhân gốc rễ (Root Cause):** Hard-coded assertion `assert.strictEqual(data.chapters.length, 7)` chưa được đồng bộ với yêu cầu mở rộng 10 chương.
- **Tư duy phân tích (Thought Process):** Cập nhật test assertion để phản ánh đúng quy mô mới của cẩm nang đào tạo (10 chương từ Node.js đến S/4HANA 2025).
- **Cách giải quyết (Resolution):**
  Sửa assertion trong file kiểm thử thành `assert.strictEqual(data.chapters.length, 10)`.
- **Fresher Gotcha:** Khi mở rộng nghiệp vụ hoặc mock data, kiểm tra và cập nhật Unit Test suite tương ứng.

---

### ERR-04: Cú pháp Điều hướng Annotation Side Effects
- **Ngữ cảnh (Action Context):** Khai báo Side Effects trên Fiori Elements V4 để khi Item thay đổi `Quantity` hoặc `UnitPrice` thì tự động tính lại `_Header/TotalAmount`.
- **Hiện tượng (Symptom):** Fiori Elements không trigger cập nhật tổng tiền Header, hoặc báo lỗi cú pháp metadata OData V4.
- **Nguyên nhân gốc rễ (Root Cause):** Dùng cú pháp dấu chấm `_Header.TotalAmount` thay vì dấu gạch chéo `_Header/TotalAmount` trong OData V4 navigation path.
- **Tư duy phân tích (Thought Process):** Trong OData V4, đường dẫn navigation từ entity này sang entity khác bắt buộc dùng ký tự `/`.
- **Cách giải quyết (Resolution):**
  Khai báo chính xác trong `annotations.xml`:
  ```xml
  <Property Path="_Header/TotalAmount"/>
  ```
  Và trong BDEF BDL của RAP:
  ```abap
  side effects {
    field Quantity affects field LineTotal, entity _Header;
    field UnitPrice affects field LineTotal, entity _Header;
  }
  ```
- **Fresher Gotcha:** Phân biệt cú pháp OData V4 (`/` cho navigation) với cú pháp Object attribute của JavaScript/ABAP.

---

### ERR-05: Lỗi HTTP 412 Precondition Failed khi Mô phỏng ETag Concurrency
- **Ngữ cảnh (Action Context):** Gửi request `PUT / PATCH` cập nhật dữ liệu với header `If-Match` không đúng định dạng.
- **Hiện tượng (Symptom):** Server trả về mã lỗi HTTP `412 Precondition Failed` ngay cả khi người dùng không cố ý chỉnh sửa đồng thời.
- **Nguyên nhân gốc rễ (Root Cause):** OData V4 sử dụng Weak ETag với tiền tố `W/"..."` (có dấu nháy kép bên trong). Nếu client gửi thiếu prefix `W/` hoặc dấu ngoặc kép, Gateway sẽ từ chối.
- **Tư duy phân tích (Thought Process):** ETag trên SAP NetWeaver / S/4HANA luôn được định dạng dạng Weak ETag biểu thị bằng chuỗi timestamp hoặc hash bọc trong `W/"..."`.
- **Cách giải quyết (Resolution):**
  Chuẩn hóa chuỗi ETag trước khi gửi vào header `If-Match`:
  ```javascript
  const sETag = `W/"${oData.LocalLastChangedAt}"`;
  ```
- **Fresher Gotcha:** Luôn đọc ETag từ response header `ETag` hoặc `@odata.etag` do framework cung cấp, không tự ghép chuỗi thô.

---

### ERR-06: ADT REST `createObject` Thiếu Tham số Parent Package Path
- **Ngữ cảnh (Action Context):** Gọi tool ADT `createObject` để tạo transparent table `ZDEMO_CONFIG_M`.
- **Hiện tượng (Symptom):** ADT trả về lỗi HTTP 400 Bad Request hoặc báo thiếu thông tin schema container.
- **Nguyên nhân gốc rễ (Root Cause):** Schema của ADT endpoint `/sap/bc/adt/ddic/tables` đòi hỏi bắt buộc phải truyền cả `parentName: "ZNGHIANDD_TEST"` và `parentPath: "/sap/bc/adt/packages/znghiandd_test"`.
- **Tư duy phân tích (Thought Process):** ADT là một RESTful API phân cấp cây đối tượng (hierarchical URI). Khi tạo mới bất kỳ DDIC object nào, ADT cần URI cha của package để thiết lập quan hệ TADIR.
- **Cách giải quyết (Resolution):**
  Cung cấp đầy đủ cả 2 thuộc tính khi gọi `createObject`:
  ```json
  {
    "name": "ZDEMO_CONFIG_M",
    "objtype": "TABL/DT",
    "parentName": "ZNGHIANDD_TEST",
    "parentPath": "/sap/bc/adt/packages/znghiandd_test",
    "transport": "S4DK911884"
  }
  ```
- **Fresher Gotcha:** Luôn kiểm tra schema của ADT MCP tool trước khi gọi.

---

### ERR-07: Không thể Tạo Behavior Definition (`BDEF/BDO`) qua `createObject`
- **Ngữ cảnh (Action Context):** Cố gắng tạo Behavior Definition `ZI_DemoHeaderTP` hoặc `ZI_DemoConfigMSaveTP` bằng công cụ `createObject`.
- **Hiện tượng (Symptom):** Báo lỗi validation: `BDEF/BDO` không nằm trong danh sách các loại object được hỗ trợ bởi API `createObject`.
- **Nguyên nhân gốc rễ (Root Cause):** ADT API phía client chỉ expose các loại DDIC cơ bản (`TABL/DT`, `CLAS/OC`, `PROG/P`, `SRVD/SRV`, `DDLS/DF`). Behavior Definition là loại Business Object RAP đặc thù, cần tạo thông qua transaction hoặc Function Module backend.
- **Tư duy phân tích (Thought Process):** Hệ thống SAP backend có các API nội bộ phục vụ migration và tạo RAP objects. Sử dụng ABAP Console Class gọi function module `/BOBF/RAP_MIG_BDEF_CREATE` để sinh BDEF từ xa.
- **Cách giải quyết (Resolution):**
  Sử dụng Function Module chuẩn của SAP RAP Framework:
  ```abap
  CALL FUNCTION '/BOBF/RAP_MIG_BDEF_CREATE'
    EXPORTING
      iv_bdef_src_name = 'ZI_DEMOCONFIGMSAVETP'
      iv_transport     = 'S4DK911884'
      iv_package       = 'ZNGHIANDD_TEST'
      iv_bdef_string   = lv_bdef_source.
  ```
- **Fresher Gotcha:** Khi một công cụ client bị giới hạn, hãy tìm kiếm các Function Module hoặc ABAP Class nội bộ của SAP để giải quyết bài toán.

---

### ERR-08: Lỗi Session ADT Timeout (`Session timed out or not found`)
- **Ngữ cảnh (Action Context):** Gọi các lệnh MCP inspect/run trên SAP sau một khoảng thời gian chờ.
- **Hiện tượng (Symptom):** `{"error":"Session timed out or not found; type: ","code":-32603}`.
- **Nguyên nhân gốc rễ (Root Cause):** SAP Gateway / ICF có timeout quy định cho stateful HTTP session (thường là 300–600 giây không hoạt động).
- **Tư duy phân tích (Thought Process):** Không coi timeout là lỗi chết người; đây là cơ chế bảo vệ tài nguyên tiêu chuẩn của SAP. Chỉ cần refresh lại session bằng lệnh `login`.
- **Cách giải quyết (Resolution):**
  Chủ động gọi tool `login` để tạo session mới ngay khi nhận được mã lỗi này.
- **Fresher Gotcha:** Thiết kế các script tương tác SAP luôn có cơ chế retry-on-session-timeout tự động.

---

### ERR-09: Lỗi Cú pháp ABAP String Template Chứa Ký Tự `{` Không Có Dấu Cách
- **Ngữ cảnh (Action Context):** Viết mã nguồn BDEF bên trong ABAP string template: `lv_code = |define behavior ... { ... }|`.
- **Hiện tượng (Symptom):** ABAP Syntax Check báo lỗi:
  `Expression limiter '{' in string template not followed by space.`
- **Nguyên nhân gốc rễ (Root Cause):** Trong ABAP String Template `|...|`, cặp dấu `{ }` được coi là biểu thức nhúng (embedded expression). Theo luật cú pháp ABAP, sau dấu `{` và trước dấu `}` **bắt buộc phải có khoảng trắng**. Nếu BDEF chứa dấu ngoặc nhọn `{` sát dòng thì trình biên dịch ABAP sẽ hiểu sai.
- **Tư duy phân tích (Thought Process):** Không dùng string template cho các đoạn mã BDL chứa dấu ngoặc nhọn `{` và `}`. Sử dụng phép nối chuỗi ký tự thường `&&` với hằng số `cl_abap_char_utilities=>newline`.
- **Cách giải quyết (Resolution):**
  ```abap
  DATA(nl) = cl_abap_char_utilities=>newline.
  lv_src = 'define behavior for ...' && nl &&
           '{' && nl &&
           '  create;' && nl &&
           '}'.
  ```
- **Fresher Gotcha:** Tránh lạm dụng String Template `|...|` khi chuỗi chứa mã nguồn hoặc JSON/XML có dấu ngoặc nhọn.

---

### ERR-10: Kiểu Dữ liệu `timestampl` Bất Tương Thích với Hàm `utclong_current()`
- **Ngữ cảnh (Action Context):** Ghi nhận dấu thời gian thay đổi trong Behavior Pool Saver (`save_modified`).
- **Hiện tượng (Symptom):** Báo lỗi biên dịch: Kiểu dữ liệu `timestampl` (Packed Decimal) không tương thích với kiểu `utclong`.
- **Nguyên nhân gốc rễ (Root Cause):** Bảng DDIC định nghĩa trường kiểu `timestampl` (DEC 21,7), thuộc hệ thống timestamp cũ của SAP. Trong khi đó, `utclong_current()` trả về kiểu `utclong` mới của ABAP Cloud.
- **Tư duy phân tích (Thought Process):** Kiểm tra kiểu dữ liệu của transparent table: Do trường là `timestampl`, cần dùng lệnh chuẩn ABAP tương ứng với kiểu Packed Decimal.
- **Cách giải quyết (Resolution):**
  Sử dụng câu lệnh ABAP chuẩn:
  ```abap
  DATA lv_ts TYPE timestampl.
  GET TIME STAMP FIELD lv_ts.
  ```
- **Fresher Gotcha:** Phân biệt rõ `timestampl` (DEC) và `utclong` (Built-in Timestamp 64-bit mới).

---

### ERR-11: Lỗi `Class does not implement if_oo_adt_classrun~main method!` khi Chạy `runClass`
- **Ngữ cảnh (Action Context):** Tạo mới một class bằng ADT và thực thi ngay bằng lệnh `runClass`.
- **Hiện tượng (Symptom):**
  `Error: Class does not implement if_oo_adt_classrun~main method!`
- **Nguyên nhân gốc rễ (Root Cause):**
  Khi đọc mã nguồn của handler SAP `CL_OO_ADT_RES_CLASSRUN`, ta thấy SAP kiểm tra 2 điều kiện:
  1. `SEO_CLASS_ALL_IMPLEMENTG_GET`: Kiểm tra bảng quan hệ interface trong DDIC.
  2. `cl_abap_docu_class_pool=>check_adt_classrun()`: Sử dụng RTTI (`cl_abap_classdescr=>describe_by_name`). RTTI đọc **Generated Load** trong bộ nhớ đệm `REPOLOAD`.
  Nếu class mới tạo chỉ có text source mà chưa được kích hoạt đầy đủ với Class Pool include (`ZCL_...=======CP`), RTTI sẽ không thấy interface `IF_OO_ADT_CLASSRUN`.
- **Tư duy phân tích (Thought Process):** Không chỉ upload mã nguồn text, phải thực hiện kích hoạt toàn diện đối tượng bằng `activateObjects` hoặc `activateByName` với đúng tên include `CP`.
- **Cách giải quyết (Resolution):**
  Thực hiện kích hoạt đối tượng đầy đủ trước khi gọi `runClass`:
  ```json
  {
    "objects": [
      {
        "adtcore:name": "ZCL_DEMO_EML_PLAYGROUND",
        "adtcore:parentUri": "/sap/bc/adt/packages/znghiandd_test",
        "adtcore:type": "CLAS/OC",
        "adtcore:uri": "/sap/bc/adt/oo/classes/zcl_demo_eml_playground"
      }
    ]
  }
  ```
- **Fresher Gotcha:** Một class có mã nguồn hợp lệ trên text editor chưa chắc đã có compiled load trong runtime memory (`REPOLOAD`).

---

### ERR-12: Lỗi BDL Compiler `+BDL(003)`: `"draft" was expected, not "save"`
- **Ngữ cảnh (Action Context):** Khai báo BDEF cho kịch bản Scenario 2A: Managed with Unmanaged Save.
- **Hiện tượng (Symptom):** Trình biên dịch RAP BDL báo lỗi:
  `"draft" was expected, not "save". "after" was expected, not ";".`
- **Nguyên nhân gốc rễ (Root Cause):** Viết lệnh `with unmanaged save;` thành một câu lệnh độc lập ở đầu file BDEF. Ở cấp độ file root, sau `strict ( 2 );`, RAP chỉ chấp nhận `with draft;`.
- **Tư duy phân tích (Thought Process):** Tra cứu cheat sheet chính thức của SAP (`references/abap-cheat-sheets/08_EML_ABAP_for_RAP.md`): Cú pháp chuẩn của unmanaged save ở cấp độ root phải được viết gắn liền trên cùng một dòng với từ khóa `managed`.
- **Cách giải quyết (Resolution):**
  Sửa dòng khai báo đầu tiên của BDEF thành:
  ```abap
  managed with unmanaged save implementation in class zbp_i_democonfigmsavetp unique;
  strict ( 2 );
  ```
- **Fresher Gotcha:** RAP BDL có ngữ pháp khai báo rất nghiêm ngặt. Từ khóa cấu hình lưu trữ (`with unmanaged save` / `with additional save`) phải đặt ngay sau từ khóa `managed`.

---

### ERR-13: Lỗi BDL Compiler `+BDL(201)`: `strict ( 2 )` Bắt buộc Khai báo `authorization master`
- **Ngữ cảnh (Action Context):** Kích hoạt BDEF `ZI_DemoConfigUnmanTP` và `ZI_DemoConfigMSaveTP` với chế độ `strict ( 2 );`.
- **Hiện tượng (Symptom):** Trình biên dịch báo lỗi:
  `The behavior definition is "strict", which means that every entity must be flagged as "authorization master" or as "authorization dependent".`
- **Nguyên nhân gốc rễ (Root Cause):** Chế độ `strict ( 2 )` là chuẩn bảo mật cao nhất của SAP RAP. Nó cấm tuyệt đối việc bỏ qua kiểm tra quyền Authorization.
- **Tư duy phân tích (Thought Process):** Không hạ chuẩn strict xuống phiên bản cũ. Bổ sung khai báo phân quyền `authorization master ( instance )` vào entity root và định nghĩa phương thức `get_instance_authorizations` trong Behavior Pool.
- **Cách giải quyết (Resolution):**
  Trong BDEF:
  ```abap
  define behavior for ZI_DemoConfigUnmanTP alias DemoConfigUnman
  lock master
  authorization master ( instance )
  etag master LastChangedAt
  ```
  Và trong Behavior Pool Local Handler:
  ```abap
  METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION
    IMPORTING keys REQUEST requested_authorizations FOR DemoConfigUnman RESULT result.
  ```
- **Fresher Gotcha:** Luôn đón đầu các chuẩn `strict ( 2 )` trong ABAP Cloud và S/4HANA để code có tính tương thích lâu dài.

---

### ERR-14: Lỗi Biên Dịch `SELECT(353)`: Mismatch Giữa Snake_Case DB và CamelCase BDEF Derived Type
- **Ngữ cảnh (Action Context):** Viết method `read` trong Behavior Pool của Unmanaged RAP (`ZBP_I_DEMOCONFIGUNMANTP`):
  `SELECT * FROM zdemo_config_u INTO CORRESPONDING FIELDS OF TABLE @result.`
- **Hiện tượng (Symptom):** Trình biên dịch ABAP báo lỗi:
  `The work area RESULT does not contain any corresponding components.`
- **Nguyên nhân gốc rễ (Root Cause):**
  Biến `result` trong RAP Read Handler có kiểu dữ liệu nội sinh (BDEF Derived Type) `TABLE FOR READ RESULT zi_democonfigunmantp\\democonfigunman`. Kiểu này có các trường đặt tên dạng CamelCase (`ConfigKey`, `ConfigName`, `ConfigValue`, `%tky`, `%cid`...).
  Trong khi đó, bảng database `zdemo_config_u` có các cột dạng snake_case (`config_key`, `config_name`).
  Câu lệnh `INTO CORRESPONDING FIELDS` của Open SQL so khớp tên chính xác (case-sensitive) nên không tìm thấy cột tương ứng nào.
- **Tư duy phân tích (Thought Process):** Phân định ranh giới giữa tầng lưu trữ DB (snake_case) và tầng Transactional Buffer RAP (CamelCase). Đọc dữ liệu thô vào bảng đệm trung gian của DB, sau đó loop và map tường minh sang cấu trúc `result`.
- **Cách giải quyết (Resolution):**
  ```abap
  METHOD read.
    SELECT * FROM zdemo_config_u
      FOR ALL ENTRIES IN @keys
      WHERE config_key = @keys-ConfigKey
      INTO TABLE @DATA(lt_db).

    LOOP AT lt_db INTO DATA(ls_db).
      APPEND VALUE #(
        ConfigKey     = ls_db-config_key
        ConfigName    = ls_db-config_name
        ConfigValue   = ls_db-config_value
        IsActive      = ls_db-is_active
        LastChangedAt = ls_db-last_changed_at
      ) TO result.
    ENDLOOP.
  ENDMETHOD.
  ```
- **Fresher Gotcha:** Không bao giờ dùng `CORRESPONDING FIELDS` trực tiếp giữa bảng DDIC database và RAP Derived Types.

---

### ERR-15: Lỗi Duplicate Primary Key (`DBSQL_DUPLICATE_KEY_ERROR`) khi Chạy Lại EML Playground
- **Ngữ cảnh (Action Context):** Chạy lại console app `ZCL_DEMO_EML_PLAYGROUND` nhiều lần để kiểm tra tự động.
- **Hiện tượng (Symptom):** Lệnh EML báo lỗi `DemoConfigMSave create failed!` hoặc văng exception `DBSQL_DUPLICATE_KEY_ERROR`.
- **Nguyên nhân gốc rễ (Root Cause):**
  1. Trong Behavior Pool Saver, lệnh `INSERT <dbtab>` gây dump nếu bản ghi đã tồn tại trong DB.
  2. Trong EML, việc tạo một bản ghi với khóa cố định (`CFG_DEMO01`) khi bản ghi đó đã tồn tại trong cơ sở dữ liệu sẽ khiến Transactional Buffer của Managed BO từ chối vì vi phạm ràng buộc unique key.
- **Tư duy phân tích (Thought Process):**
  - Trong Saver: Chuyển `INSERT` thành `MODIFY` (Open SQL Upsert) để nếu bản ghi đã có thì cập nhật, chưa có thì thêm mới.
  - Trong Test Harness / EML: Sử dụng khóa động dựa trên dấu thời gian thực tế `sy-uzeit` (`|CFG_{ sy-uzeit }|`, `|UNM_{ sy-uzeit }|`). Điều này giúp kiểm thử mang tính Idempotent (chạy vô số lần không sợ xung đột khóa).
- **Cách giải quyết (Resolution):**
  1. Trong Saver:
     ```abap
     MODIFY zdemo_config_m FROM TABLE @lt_insert.
     ```
  2. Trong EML Playground:
     ```abap
     DATA(lv_cfg_m_key) = CONV char10( |CFG_{ sy-uzeit }| ).
     MODIFY ENTITIES OF zi_democonfigmsavetp
       ENTITY DemoConfig
       CREATE FIELDS ( ConfigKey ConfigName ... )
       WITH VALUE #( ( %cid = 'CID_01' ConfigKey = lv_cfg_m_key ... ) )
     ```
- **Fresher Gotcha:** Bộ test tự động phải luôn có tính lặp lại (Idempotent). Luôn kết hợp Open SQL `MODIFY` và dynamic keys khi viết kịch bản test dữ liệu.

---

## TỔNG KẾT & QUY TẮC PHÒNG TRÁNH CHO FRESHER

| Giai đoạn | Thói quen xấu gây lỗi | Thói quen tốt nên duy trì |
| :--- | :--- | :--- |
| **Frontend UI5** | Sửa code không kiểm tra console errors | Luôn mở F12 DevTools và chạy test suite tự động |
| **OData V4** | Nhầm lẫn dấu `.` và `/` trong đường dẫn annotation | Ghi nhớ `/` cho Navigation và `.` cho Metadata namespace |
| **SAP ADT** | Chỉnh sửa code text mà quên kích hoạt | Luôn kích hoạt Class Pool (`CP`) và BDEF đồng thời |
| **RAP BDL** | Đặt cú pháp lưu trữ tùy tiện | Nhớ quy tắc: `managed with unmanaged save ... strict ( 2 );` |
| **ABAP Backend** | Dùng `INSERT` cố định khóa trong test | Sử dụng `MODIFY` và dynamic timestamp key (`sy-uzeit`) |

