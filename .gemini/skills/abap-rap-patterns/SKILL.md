---
name: abap-rap-patterns
description: >-
  Mẫu thiết kế và quy chuẩn lập trình ABAP RESTful Application Programming Model (RAP) trên SAP S/4HANA (BDEF strict 2, Draft, Determinations, Validations, EML).
---

# Kỹ Năng Thiết Kế & Lập Trình ABAP RAP (SAP S/4HANA 2025)

Kỹ năng này quy định toàn bộ các mẫu thiết kế (Design Patterns) và quy tắc bất biến khi triển khai mã nguồn ABAP RAP.

---

## 1. Thông Tin Cấu Hình Triển Khai Của Dự Án

- **Package Phát Triển:** `ZNGHIANDD_TEST` (đã xác minh trên hệ thống)
- **Transport Request (TR):** `S4DK911884`
- **Tác giả / User định danh:** `NGS.NGHIANDD`
- **Quy tắc Comment (CHỈ KHI SỬA OBJECT CỦA NGƯỜI KHÁC):**
  - **Chỉ áp dụng khi sửa object của người khác:** Bắt buộc bọc trong khối comment:
    ```abap
    "START NGS.NGHIANDD DD.MM.YYYY
    ... code sửa đổi/thêm mới ...
    "END NGS.NGHIANDD DD.MM.YYYY
    ```
  - **Với object tạo mới trong package `ZNGHIANDD_TEST`:** Viết Clean ABAP chuẩn mực, không bắt buộc bọc comment này trên từng khối code.

---

## 2. Quy Tắc Bất Biến Của RAP Contract

1. **Strict Mode 2 & Draft:** Luôn sử dụng `strict ( 2 ); with draft;` cho Managed BOs.
2. **Draft Admin Include:** Bắt buộc dùng `include sych_bdl_draft_admin_inc;` cho mọi bảng Draft trong DDIC.
3. **Draft Actions:** BDEF Projection bắt buộc phải khai báo tường minh:
   ```abap
   use action Edit;
   use action Activate;
   use action Discard;
   use action Resume;
   use action Prepare;
   ```
4. **Save Sequence & Point of No Return:**
   - Điểm không thể quay đầu (Point of No Return) diễn ra ngay sau khi `check_before_save` kết thúc mà không có lỗi (`failed` rỗng).
   - Trong `save_modified`: Tuyệt đối **KHÔNG** sử dụng `failed`/`reported` cho business validation; tuyệt đối **KHÔNG** gọi `COMMIT WORK` hoặc `ROLLBACK WORK`.
   - Lỗi kỹ thuật bất khả kháng trong `save_modified` phải ném Technical Exception để SAP LUW tự động rollback.
5. **Determination Idempotency:**
   - Mọi determination cập nhật Header từ Item (`determination calculateHeaderTotal on modify { create; delete; field Quantity, UnitPrice; }`) phải kiểm tra tính toán trên transactional buffer (`BY \_Items`) và chống vòng lặp đệ quy.

---

## 3. Mẫu Cú Pháp BDEF Gốc Chuẩn Mực

```abap
managed implementation in class BP_I_DEMOHEADERTP unique;
strict ( 2 );
with draft;

define behavior for ZI_DemoHeaderTP alias DemoHeader
persistent table zdemo_header
draft table zdemo_header_d
etag master LocalLastChangedAt
lock master total etag LastChangedAt
authorization master ( global )
late numbering
{
  field ( readonly ) HeaderId, CreatedAt, CreatedBy, LastChangedAt, LocalLastChangedAt;
  field ( mandatory ) Title, Category;

  create;
  update;
  delete;

  association _Items { create; with draft; }

  draft action Edit;
  draft action Activate optimized;
  draft action Discard;
  draft action Resume;
  draft determine action Prepare
  {
    validation validateCategory;
  }

  determination setInitialStatus on modify { create; }
  validation validateCategory on save { field Category; }
}
```

