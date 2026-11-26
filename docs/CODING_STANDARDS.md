# QUY CHUẨN LẬP TRÌNH: CODING STANDARDS & CLEAN CODE
*(SAP Fiori Technical Academy – V4)*

---

## 1. Chuyên đề Cốt lõi: ABAP Language Versions & Clean Core

> [!IMPORTANT]
> **Làm rõ Khái niệm Kỹ thuật Chuẩn mực:**
> 1. **ABAP Language Version:** Là thuộc tính của từng Repository Object (Package, Class, CDS...). S/4HANA 2025 hỗ trợ song song hai phiên bản ngôn ngữ:
>    - **Standard ABAP:** Ngôn ngữ ABAP truyền thống (Classic), cho phép gọi toàn bộ câu lệnh, bảng SAP nội bộ và BAPI cũ.
>    - **ABAP for Cloud Development (ABAP Cloud):** Ngôn ngữ hiện đại tuân thủ mô hình Clean Core, giới hạn trong tập cú pháp an toàn và chỉ được gọi các API đã được SAP phát hành.
> 2. **API Release Contract C1 (System-Internal API):** Là hợp đồng đảm bảo tính ổn định của API nội bộ giữa SAP và mã custom, hoặc giữa các Software Components với nhau.
> 3. **Quy định về Open SQL / ABAP SQL:** Trong ABAP Cloud, developer **VẪN ĐƯỢC PHÉP** sử dụng các lệnh `SELECT`, `INSERT`, `UPDATE`, `MODIFY`, `DELETE` trên **chính các bảng custom do mình tạo ra**. Điều bị cấm là: *Truy cập trực tiếp vào các bảng chuẩn của SAP (như BKPF, VBAK, MARA) hoặc gọi các Function Module/Class chưa được SAP release qua Contract C1*.
> 4. **Phạm vi Bắt buộc:** ABAP Cloud **không bắt buộc cho mọi đối tượng custom** trên S/4HANA On-Premise và Private Cloud Edition (PCE). Developer vẫn có quyền tạo object ở Standard ABAP, nhưng SAP khuyến nghị tối đa việc áp dụng ABAP Cloud cho các phát triển mới nhằm đảm bảo khả năng nâng cấp mượt mà (Upgrade-stable).

---

### So sánh Mã nguồn Thực tế: Standard ABAP vs ABAP for Cloud Development

#### A. Đoạn mã Standard ABAP (Classic Model — Không khuyến nghị cho Clean Core)
```abap
" Standard ABAP: Truy cập trực tiếp bảng SAP và hàm cổ điển chưa release
REPORT z_classic_demo.

DATA: lt_vbak TYPE TABLE OF vbak,
      ls_vbak TYPE vbak.

" 1. Direct SELECT vào bảng nội bộ SAP (Không qua Released View)
SELECT * FROM vbak INTO TABLE lt_vbak UP TO 10 ROWS.

" 2. Sử dụng lệnh Native / Obsolete
LOOP AT lt_vbak INTO ls_vbak.
  WRITE: / ls_vbak-vbeln, ls_vbak-erdat.
ENDLOOP.

" 3. Gọi Function Module chưa release
CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
  EXPORTING
    wait = 'X'.
```

#### B. Đoạn mã ABAP for Cloud Development (Clean Core Model — Chuẩn hóa Dự án)
```abap
" ABAP for Cloud Development: Tuân thủ Clean Core, chỉ dùng Released APIs
CLASS zcl_cloud_demo DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
ENDCLASS.

CLASS zcl_cloud_demo IMPLEMENTATION.
  METHOD if_oo_adt_classrun~main.
    " 1. Chỉ đọc dữ liệu qua Released CDS View Entity (Contract C1)
    SELECT SalesOrder, CreationDate
      FROM I_SalesOrderTP
      INTO TABLE @DATA(lt_orders)
      UP TO 10 ROWS.

    " 2. Sử dụng cú pháp hiện đại, in kết quả qua ADT console
    out->write( lt_orders ).

    " 3. Thao tác trên BẢNG CUSTOM của chính mình bằng ABAP SQL (HOÀN TOÀN HỢP LỆ)
    DATA ls_custom TYPE zdemo_config.
    ls_custom-config_key   = 'THEME'.
    ls_custom-config_value = 'SAP_HORIZON'.
    
    MODIFY zdemo_config FROM @ls_custom. " Được phép thao tác trên custom table!

    " 4. Mọi tương tác Business Object phải dùng EML thay vì gọi BAPI cổ điển
    COMMIT ENTITIES.
  ENDMETHOD.
ENDCLASS.
```

---

## 2. Quy chuẩn BDEF strict(1) và strict(2)

Trong ABAP RAP, từ khóa `strict` kích hoạt các quy tắc kiểm tra cú pháp và thực hành chuẩn:
- `strict(1)`: Đảm bảo mọi trường được ánh xạ (mapping), kiểm tra kiểu dữ liệu và ngăn chặn các hành vi lỗi thời.
- `strict(2)`: Yêu cầu cao nhất của RAP 2025:
  - Bắt buộc khai báo đầy đủ các thao tác draft.
  - Bắt buộc khai báo rõ ràng các association và projection behavior.
  - Kiểm soát chặt chẽ việc đặt tên alias và quyền truy cập trường.

---

## 3. Quy chuẩn Đặt tên Đối tượng Kỹ thuật (Naming Conventions)

### 3.1. Tầng Cơ sở Dữ liệu & CDS (Backend)

| Loại Đối Tượng | Quy Tắc Đặt Tên | Ví Dụ Cụ Thể | Ý Nghĩa / Mục Đích |
| :--- | :--- | :--- | :--- |
| **Bảng Database (Active)** | `ZDEMO_<ENTITY>` | `ZDEMO_HEADER`, `ZDEMO_ITEM` | Bảng Transparent vật lý trên SAP HANA |
| **Bảng Database (Draft)** | `ZDEMO_<ENTITY>_D` | `ZDEMO_HEADER_D`, `ZDEMO_ITEM_D` | Bảng lưu dữ liệu nháp (sinh bởi BDEF) |
| **CDS Interface View Entity** | `ZI_<Entity>TP` | `ZI_DemoHeaderTP`, `ZI_DemoItemTP` | Cung cấp Data Model gốc (Transactional Processing) |
| **CDS Projection View Entity**| `ZC_<Entity>TP` | `ZC_DemoHeaderTP` | Mô hình dữ liệu chiếu (Consumption View cho UI) |
| **Metadata Extension (MDE)** | `ZC_<Entity>TP.ddlx` | `ZC_DemoHeaderTP.ddlx` | Tách biệt toàn bộ `@UI.*` annotations |
| **CDS Custom Entity** | `ZI_<Entity>` | `ZI_DemoLog` | Thực thể ảo không bảng, dùng query provider |
| **Behavior Pool Class** | `BP_I_<ENTITY>` | `BP_I_DEMOHEADERTP` | Lớp ABAP chứa logic Behavior Implementation |
| **Query Provider Class** | `ZCL_<ENTITY>_QUERY`| `ZCL_DEMO_LOG_QUERY` | Triển khai interface `IF_RAP_QUERY_PROVIDER` |
| **Service Definition** | `ZSD_<SERVICE>` | `ZSD_DEMO` | Định nghĩa phạm vi Entity phơi bày ra ngoài |
| **Service Binding (OData V4)**| `ZUI_<NAME>_O4` | `ZUI_DEMO_O4` | Kích hoạt dịch vụ OData V4 UI |
| **Service Binding (Web API)** | `ZAPI_<NAME>_O4` | `ZAPI_DEMO_O4` | Kích hoạt dịch vụ OData V4 Web API |

---

### 3.2. Tầng Giao diện SAPUI5 (Frontend)

| Loại Đối Tượng | Quy Tắc Đặt Tên | Ví Dụ Cụ Thể | Ý Nghĩa / Mục Đích |
| :--- | :--- | :--- | :--- |
| **View XML** | `<Name>.view.xml` | `Main.view.xml`, `LabDetail.view.xml` | Giao diện khai báo cấu trúc XML |
| **Controller JS** | `<Name>.controller.js` | `Main.controller.js` | Logic điều khiển sự kiện màn hình |
| **XML Fragment** | `<Name>.fragment.xml` | `SettingsDialog.fragment.xml` | Giao diện con tái sử dụng / Popups |
| **Formatter Module** | `formatter.js` | `webapp/model/formatter.js` | Chứa các hàm chuyển đổi hiển thị |
| **Custom Control** | `webapp/control/<Name>.js`| `webapp/control/CodeHighlighter.js`| Lớp điều khiển tự xây dựng |
| **Mã i18n Resource** | `<context>_<entity>_<field>`| `lbl_header_demoCode`, `btn_action_save` | Định danh khóa bản dịch đa ngôn ngữ |

---

## 4. Nguyên tắc Lập trình Sạch (Clean Code Principles)

1. **Tuân thủ RAP Contract:** Tuyệt đối không gọi `COMMIT WORK` hoặc `ROLLBACK WORK` trong Behavior Implementation Class.
2. **Quản lý Thông báo Lỗi:** Mọi lỗi nghiệp vụ trong Behavior Pool phải được đưa vào bảng `FAILED` và `REPORTED` thông qua lớp thông báo `CM_RAP_GEN_MESSAGE` hoặc tin nhắn thừa kế `IF_ABAP_BEHV_MESSAGE`.
3. **Phân tách Rạch ròi Giao diện và Dữ liệu:** Không viết logic xử lý dữ liệu phức tạp trên XML View; sử dụng Expression Binding một cách chừng mực, đẩy các phép biến đổi nặng vào Custom Formatter.
4. **Không Hard-code Thông tin Nhạy cảm:** Nghiêm cấm ghi cứng mật khẩu, tài khoản hệ thống, hoặc IP máy chủ trực tiếp vào mã nguồn JavaScript hoặc ABAP.

---

## 5. Quy Tắc An Toàn Hệ Thống SAP & Bảo Vệ Object Của Người Khác (Bắt buộc Phê duyệt)

1. **Bảo vệ Object Sở hữu Riêng & Dùng chung:**
   - Tuyệt đối không tự ý sửa đổi, ghi đè, xóa, đổi tên hoặc khóa (`lock`) bất kỳ object nào trên hệ thống SAP không thuộc phạm vi task hiện tại hoặc do người khác/hệ thống sở hữu (ví dụ: các object `ZNNDD_*`, các bảng/view chuẩn).
   - Mọi thao tác kiểm thử cú pháp phải thực hiện in-memory hoặc trên package tạm `$TMP` độc lập.
2. **Bắt buộc Xin Phê duyệt Trước khi Tác động:**
   - Khi chuẩn bị thực hiện bất kỳ hành động nào có thể làm thay đổi trạng thái hệ thống SAP, cấu hình package, hoặc dữ liệu database (`createObject`, `setObjectSource`, `deleteObject`, `MODIFY ENTITIES`, `UPDATE/DELETE`), AI bắt buộc phải:
     - Nêu rõ tên và chủ sở hữu của object.
     - Trình bày chi tiết diff thay đổi và phân tích rủi ro.
     - Chờ người dùng xác nhận đồng ý rõ ràng trước khi chạy lệnh.
3. **Quy tắc Comment khi Thao tác Code ABAP:**
   - **Chỉ áp dụng khi sửa object của người khác / object dùng chung:** Bắt buộc bọc đoạn mã thay đổi trong khối comment:
     ```abap
     "START NGS.NGHIANDD DD.MM.YYYY
     ... code sửa đổi/thêm mới ...
     "END NGS.NGHIANDD DD.MM.YYYY
     ```
   - **Với object tạo mới trong package riêng của dự án (`ZNGHIANDD_TEST`):** Tuân thủ Clean ABAP thông thường, không bắt buộc bọc khối comment này để giữ mã nguồn sạch sẽ.


