---
description: "Quy tắc bắt buộc: Phải xin ý kiến người dùng trước khi tác động đến object của người khác hoặc hệ thống SAP"
globs: ["**/*"]
alwaysApply: true
---

# QUY TẮC BẢO VỆ OBJECT CỦA NGƯỜI KHÁC VÀ HỆ THỐNG SAP (BẮT BUỘC XIN Ý KIẾN TRƯỚC)

Khi chuẩn bị thực hiện bất kỳ hành động nào có khả năng **ảnh hưởng đến object của người khác, object dùng chung, hoặc trạng thái hệ thống SAP / cơ sở dữ liệu**, AI **BẮT BUỘC PHẢI DỪNG LẠI VÀ XIN Ý KIẾN PHÊ DUYỆT CỦA NGƯỜI DÙNG**:

## 1. Đối tượng và Phạm vi áp dụng

1. **Object của người khác & Object hệ thống:**
   - Tuyệt đối KHÔNG tự ý chỉnh sửa, ghi đè, xóa, đổi tên, khóa (`lock`) bất kỳ object nào (Programs, Classes, CDS Views, BDEF, Tables, Functions, Data Elements...) không thuộc quyền sở hữu riêng của task hoặc do người khác/hệ thống tạo ra (ví dụ: các object `ZNNDD_*`, các object trong package khác `$TMP`).
   - Mọi thao tác kiểm thử cú pháp phải sử dụng object riêng biệt hoặc kiểm thử in-memory an toàn (như `syntaxCheckCode` không lưu đè).

2. **Thao tác ghi lên Hệ thống SAP:**
   - Mọi thao tác ghi/sửa/xóa qua MCP (`createObject`, `setObjectSource`, `deleteObject`, `lock`, `unLock`, `createTransport`, `publishServiceBinding`, `git*`) bắt buộc phải có sự phê duyệt rõ ràng từ người dùng.
   - Tuyệt đối không tự động kích hoạt (`activateByName`, `activateObjects`) khi chưa có lệnh.

3. **Thao tác thay đổi Dữ liệu Cơ sở dữ liệu:**
   - Mọi lệnh hoặc script chạy code làm biến đổi dữ liệu thật (`MODIFY ENTITIES`, `UPDATE`, `DELETE`, `INSERT` trong các bảng SAP) đều phải xin phép trước.

## 2. Quy trình xin phê duyệt 3 bước

1. **Xác định đối tượng:** Nêu rõ tên object, loại object, package chứa, và chủ sở hữu (Owner/Author).
2. **Trình bày thay đổi & Rủi ro:** Cung cấp diff chi tiết, lý do cần làm, các rủi ro có thể phát sinh đối với người khác hoặc hệ thống, và phương án thay thế an toàn hơn.
3. **Chờ phê duyệt rõ ràng:** Chỉ tiến hành khi người dùng phản hồi đồng ý rõ ràng. Tuyệt đối không suy diễn sự im lặng là đồng ý.

## 3. Quy tắc Comment định danh

- **Bắt buộc bọc mã nguồn trong khối comment CHỈ KHI SỬA OBJECT CỦA NGƯỜI KHÁC / object dùng chung:**
  ```abap
  "START NGS.NGHIANDD DD.MM.YYYY
  ... code sửa đổi hoặc thêm mới vào object của người khác ...
  "END NGS.NGHIANDD DD.MM.YYYY
  ```
- **Với object tạo mới của dự án trong package `ZNGHIANDD_TEST`:** Tuân thủ chuẩn Clean ABAP thông thường, **không** bắt buộc bọc comment này trên từng khối để giữ mã nguồn sạch sẽ.


