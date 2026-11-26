# HƯỚNG DẪN THIẾT LẬP MÔI TRƯỜNG: ENVIRONMENT SETUP
*(SAP Fiori Technical Academy – V4)*

---

## 1. Yêu cầu Tiên quyết (Prerequisites)

Để phát triển và thực hành đầy đủ toàn bộ 9 phòng Lab trên cả 2 chế độ **Standalone Mode** và **SAP Connected Mode**, máy tính của lập trình viên cần được cài đặt các công cụ sau:

| Công Cụ / Phần Mềm | Phiên Bản Khuyến Nghị | Mục Đích Sử Dụng | Nguồn Tải Chính Thức |
| :--- | :--- | :--- | :--- |
| **Node.js Runtime** | Node.js v20.x / v22.x LTS | Chạy UI5 Tooling và Mock Server | nodejs.org |
| **Node Package Manager**| npm v10.x (kèm Node) | Quản lý dependencies dự án | nodejs.org |
| **Visual Studio Code** | Bản mới nhất | Môi trường phát triển Frontend UI5 | code.visualstudio.com |
| **SAP Fiori Tools** | Extension Pack mới nhất | Bộ công cụ sinh mã và preview Fiori | VS Code Marketplace |
| **Eclipse IDE** | 2024-09 hoặc mới hơn (tích hợp sẵn JustJ JRE 21) | IDE viết ABAP/RAP (chạy trên nền Java Runtime; người học KHÔNG code Java) | eclipse.org/downloads |
| **Temurin JDK *(tùy chọn dự phòng)*** | JDK 17 hoặc 21 LTS | Chỉ cần cài nếu dùng gói Eclipse zip rút gọn hoặc gặp lỗi thiếu JVM | adoptium.net |
| **Eclipse ADT Plugin** | ADT 3.44+ | Bộ công cụ ABAP Development Tools | tools.hana.ondemand.com/latest |
| **SAP GUI for Windows** | Bản 8.00 (64-bit) | Quản trị PFCG Roles, SM59, SICF | SAP Support Portal |

---

## 2. Hướng dẫn Thiết lập Môi trường Local Frontend (VS Code)

### Bước 1: Cài đặt UI5 CLI toàn cục
Mở Terminal / PowerShell và thực hiện lệnh:
```bash
npm install --global @ui5/cli
ui5 --version
```

### Bước 2: Cài đặt các Extension bắt buộc trong VS Code
Cài đặt gói **SAP Fiori Tools - Extension Pack**, bao gồm:
- *SAP Fiori tools - Application Generator*
- *SAP Fiori tools - Guided Development*
- *SAP Fiori tools - Service Modeler*
- *XML Tools* (Hỗ trợ format và validate XML Views)

### Bước 3: Cấu hình Bảo mật Kết nối Local (.env)
Tạo file `.env` tại thư mục gốc của frontend (đã được cấu hình trong `.gitignore`) để cấu hình thông số kết nối SAP mà không làm rò rỉ secret lên Git:
```properties
# Cấu hình Kết nối Local Proxy tới SAP S/4HANA 2025
SAP_TARGET_HOST=https://s4hana2025.corp.internal:44300
SAP_CLIENT=100
SAP_USER=DEVELOPER
SAP_PASSWORD=YourSecurePasswordHere
```

---

## 3. Hướng dẫn Thiết lập Môi trường Backend ABAP (Eclipse ADT)

> **Giải đáp nhanh — Tại sao hướng dẫn Eclipse có nhắc tới Java / Temurin JDK?**  
> Bản thân phần mềm **Eclipse IDE** và plugin **SAP ADT** được lập trình trên nền Java nên cần **Java Runtime (JRE/JDK)** để khởi chạy ứng dụng IDE (lập trình viên SAP Fiori & ABAP RAP **không** cần biết hoặc viết mã Java).  
> - **Mặc định không cần cài riêng JDK:** Các bộ cài chuẩn tải từ `https://www.eclipse.org/downloads/` **đã đóng gói sẵn Eclipse JustJ JRE 21** bên trong, cài xong là mở chạy được ngay.  
> - **Trường hợp dự phòng (Fallback):** Chỉ cần cài **Temurin JDK 17 hoặc 21 LTS** tại `https://adoptium.net` nếu bạn dùng bản Eclipse zip rút gọn không kèm JRE hoặc gặp lỗi thiếu JVM (`No Java virtual machine was found`) khi khởi động.

### Bước 1: Cài đặt Plugin ADT trong Eclipse
1. Mở Eclipse, chọn menu `Help` -> `Install New Software`.
2. Tại ô **Work with**, dán URL chính thức: `https://tools.hana.ondemand.com/latest`.
3. Tích chọn toàn bộ mục **ABAP Development Tools**.
4. Nhấn **Next**, chấp nhận điều khoản bản quyền và nhấn **Finish** để hoàn tất cài đặt.

### Bước 2: Tạo ABAP Cloud Project kết nối SAP S/4HANA 2025
1. Trong Eclipse, chuyển sang góc nhìn **ABAP Perspective** (`Window` -> `Perspective` -> `Open Perspective` -> `Other` -> `ABAP`).
2. Chọn menu `File` -> `New` -> `ABAP Cloud Project`.
3. Chọn kết nối từ SAP Logon System Description hoặc nhập trực tiếp Application Server IP, Instance Number và System ID.
4. Nhập Client (`100`), Username và Password.
5. Kiểm tra kết nối thành công: Cây thư mục hệ thống xuất hiện trong cửa sổ **Project Explorer**.

### Bước 3: Cấu hình Package & Transport Request Chính thức của Dự án
1. **Package Phát triển:** **`ZNGHIANDD_TEST`**
   - Đã được khởi tạo trên máy chủ SAP PQPOC Client 100.
   - Trạng thái: Sạch sẽ, cô lập, là không gian riêng dành cho dự án Fiori Technical Academy.
2. **Transport Request (TR):** **`S4DK911884`**
   - Mọi đối tượng thay đổi hoặc lưu trên hệ thống sẽ được gắn cố định vào số hiệu TR này.
3. **Định danh Tác giả (User):** `NGS.NGHIANDD`
   - **Chỉ áp dụng khi sửa object của người khác:** Bắt buộc gắn thẻ chú thích: `"START NGS.NGHIANDD DD.MM.YYYY` và `"END NGS.NGHIANDD DD.MM.YYYY`.
   - **Với object tạo mới trong package `ZNGHIANDD_TEST`:** Không bắt buộc gắn thẻ comment này để giữ mã nguồn Clean ABAP sạch sẽ.

---

## 4. Hướng dẫn Kiểm tra Kết nối OData V4 Gateway (Healthcheck)

Để xác nhận dịch vụ OData V4 trên S/4HANA 2025 đã sẵn sàng phục vụ Connected Mode:

1. **Kiểm tra ICF Node:**
   - Vào SAP GUI, giao dịch `SICF`.
   - Tìm kiếm path: `/sap/opu/odata4`.
   - Đảm bảo node dịch vụ `odata4` và các sub-nodes đều ở trạng thái kích hoạt (**Active** - không bị xám).
2. **Kiểm tra Dịch vụ Đã Đăng ký:**
   - Vào giao dịch `/IWFND/V4_ADMIN`.
   - Đảm bảo Service Group của dự án (`ZSD_DEMO`) đã được Publish thành công ở chế độ Local hoặc Remote.
3. **Thử nghiệm qua Trình duyệt / Postman:**
   - Truy cập URL Metadata:
     `https://<sap-host>:<port>/sap/opu/odata4/sap/zui_demo_o4/srvd/sap/zsd_demo/0001/$metadata`
   - Đăng nhập tài khoản SAP. Nếu trình duyệt trả về file XML định nghĩa OData V4 EDMX hợp lệ với HTTP Status `200 OK`, kết nối đã hoàn toàn sẵn sàng.

