sap.ui.define([], function () {
    "use strict";

    // ---------- KHO TRI THỨC QUY TẮC PHÂN TÍCH (REGEX RULES DICTIONARY) ----------
    var R = {};

    R.abap = [
        [/^CLASS\s+(\S+)\s+DEFINITION.*FOR BEHAVIOR OF\s+(\S+)/i, "Behavior pool (Vỏ hành vi BO)", "Khai báo class <b>$1</b> chứa logic hành vi của Business Object <b>$2</b>. Class chỉ là vỏ bọc abstract final, logic thật sự nằm ở các Local Handler Class trong tab Local Types.", "Viết trong ADT Eclipse, không viết trực tiếp trong SAP GUI SE24."],
        [/^CLASS\s+(\S+)\s+DEFINITION\s+INHERITING FROM\s+cl_abap_behavior_handler/i, "Handler class (Xử lý nghiệp vụ)", "Local class <b>$1</b> kế thừa <code>CL_ABAP_BEHAVIOR_HANDLER</code>: nơi hiện thực hóa toàn bộ actions, determinations, validations và feature controls của entity.", "Mọi thao tác đọc/ghi trong handler nên dùng EML LOCAL MODE."],
        [/^CLASS\s+(\S+)\s+DEFINITION\s+INHERITING FROM\s+cl_abap_behavior_saver/i, "Saver class (Giai đoạn lưu DB)", "Local class <b>$1</b> kế thừa <code>CL_ABAP_BEHAVIOR_SAVER</code>: chạy ở pha Save của SAP LUW, sau khi mọi validation đã hợp lệ. Dùng để ghi log, cập nhật bảng ngoài BO hoặc gửi message tích hợp.", "Tuyệt đối không gọi COMMIT WORK hoặc ROLLBACK WORK trong saver."],
        [/^INTERFACES\s+if_oo_adt_classrun/i, "Console Runner Interface", "Cài đặt interface <code>IF_OO_ADT_CLASSRUN</code>: cho phép thực thi method <code>main</code> trực tiếp bằng phím F9 trong ADT và in kết quả ra Console.", "Rất hữu ích để tạo các script nạp dữ liệu mẫu hoặc chạy test EML độc lập."],
        [/^METHODS\s+(\w+)\s+FOR\s+MODIFY/i, "Action Handler (Thao tác ghi)", "Khai báo method <b>$1</b> xử lý Action hoặc Custom Operation. Tham số <code>keys</code> chứa danh sách các bản ghi được chọn và <code>%param</code> chứa dữ liệu đầu vào.", "Luôn điền kết quả vào tham số result và báo lỗi vào failed/reported."],
        [/^METHODS\s+(\w+)\s+FOR\s+DETERMINE/i, "Determination Method", "Khai báo <b>determination</b> <b>$1</b>: tự động kích hoạt tính toán giá trị khi dữ liệu thay đổi (ON MODIFY) hoặc trước khi lưu (ON SAVE).", "Thường dùng để tự động tính tổng tiền, gán ngày giờ tạo, hoặc sinh số thứ tự."],
        [/^METHODS\s+(\w+)\s+FOR\s+VALIDATE/i, "Validation Method", "Khai báo <b>validation</b> <b>$1</b>: kiểm tra tính hợp lệ của dữ liệu trước khi lưu; nếu vi phạm sẽ chặn Save và trả lỗi về reported.", "Bắt buộc phải khai báo validation trong draft determine action Prepare."],
        [/^METHODS\s+(\w+)\s+FOR\s+INSTANCE\s+FEATURES/i, "Dynamic Feature Control", "Khai báo <b>$1</b>: điều khiển động trạng thái của từng trường (Read-only, Mandatory) hoặc bật/tắt nút Action trên từng dòng dữ liệu.", "Kết quả trả về qua tham số result với các hằng số if_abap_behv=>fc-o-enabled."],
        [/^READ ENTITIES OF\s+(\S+)(\s+IN LOCAL MODE)?/i, "Đọc dữ liệu EML (READ ENTITIES)", "Lệnh Entity Manipulation Language để đọc thực thể <b>$1</b> theo khóa chính. Tự động đọc xuyên suốt qua cả bảng Active và bảng Draft.", "IN LOCAL MODE giúp bỏ qua kiểm tra quyền và feature control nội bộ."],
        [/^MODIFY ENTITIES OF\s+(\S+)(\s+IN LOCAL MODE)?/i, "Ghi dữ liệu EML (MODIFY ENTITIES)", "Thực hiện tạo, cập nhật, xóa hoặc kích hoạt action trên BO <b>$1</b>. Dữ liệu được đưa vào Transactional Buffer của RAP.", "Dữ liệu chưa ghi vĩnh viễn vào DB cho đến khi pha COMMIT diễn ra."],
        [/^COMMIT ENTITIES/i, "Lưu giao dịch EML (COMMIT ENTITIES)", "Kích hoạt toàn bộ validation, determination on save, saver và ghi dữ liệu xuống database vật lý.", "Chỉ dùng trong standalone test runner hoặc controller bên ngoài RAP BO."]
    ];

    R.cds = [
        [/^@AccessControl\.authorizationCheck/i, "Kiểm quyền truy cập CDS (DCL)", "Chỉ định xem CDS View Entity có bắt buộc phải kiểm tra phân quyền qua Data Control Language (DCL) hay không.", "Dùng #CHECK cho môi trường sản xuất; #NOT_REQUIRED cho các view tra cứu công khai."],
        [/^@EndUserText\.label/i, "Nhãn hiển thị người dùng", "Định nghĩa nhãn hiển thị đa ngôn ngữ cho View hoặc trường dữ liệu trên giao diện Fiori.", "Nên dùng chuỗi ngắn gọn, mang tính nghiệp vụ rõ ràng thay vì tên kỹ thuật."],
        [/^@UI\.headerInfo/i, "Cấu hình Tiêu đề Object Page", "Xác định tên đại diện của thực thể (typeName) và trường hiển thị làm tiêu đề/mô tả ở đầu trang Object Page.", "Thường gán title.value trỏ tới Mã Chứng Từ hoặc Tiêu đề chính."],
        [/^@UI\.lineItem/i, "Cột hiển thị trên Bảng (@UI.LineItem)", "Định nghĩa trường này là một cột trong bảng List Report hoặc bảng con. Tham số position quyết định thứ tự từ trái qua phải.", "importance: #HIGH giúp cột không bị ẩn khi xem trên màn hình nhỏ."],
        [/^@UI\.selectionField/i, "Trường lọc tìm kiếm (FilterBar)", "Đưa trường này lên thanh bộ lọc tìm kiếm phía trên bảng List Report.", "Nên đặt cho các trường thường xuyên tra cứu như Mã, Trạng thái, Ngày tạo."],
        [/^@UI\.facet/i, "Bố cục khối Object Page (@UI.Facet)", "Phân chia cấu trúc Object Page thành các Header Facets, Sections (Tabs), FieldGroups hoặc Table References.", "Dùng #COLLECTION để nhóm các tab; dùng #LINEITEM_REFERENCE để nhúng bảng con."],
        [/^define\s+root\s+view\s+entity\s+(\w+)/i, "Định nghĩa Root CDS View Entity", "Khai báo <b>$1</b> là thực thể Gốc (Root) của Business Object. Là điểm neo duy nhất kết nối toàn bộ các entity con.", "Bắt buộc có composition trỏ tới các entity con."],
        [/^composition\s+\[([^\]]*)\]\s+of\s+(\w+)\s+as\s+(\w+)/i, "Quan hệ Cha - Con (Composition)", "Định nghĩa quan hệ cha - con khăng khít: vòng đời của con <b>$2</b> hoàn toàn phụ thuộc vào cha. Khi xóa cha, con sẽ tự động bị xóa theo.", "Entity con bắt buộc phải có association to parent trỏ ngược lại cha."],
        [/^association\s+to\s+parent\s+(\w+)\s+as\s+(\w+)/i, "Liên kết ngược về Cha", "Entity con định nghĩa đường dẫn trỏ ngược về entity cha <b>$1</b> theo điều kiện khóa chính.", "Khóa chính của con bắt buộc chứa khóa chính của cha."]
    ];

    R.bdef = [
        [/^managed\s+implementation in class\s+(\w+)\s+unique/i, "Managed RAP Architecture", "Khung kiến trúc Managed: RAP Framework tự động đảm nhiệm Create, Update, Delete, Draft và Transaction Buffer. Code tùy biến đặt trong behavior pool <b>$1</b>.", "Mô hình khuyến nghị cho Clean Core trên SAP S/4HANA."],
        [/^strict\s*\(\s*(\d)\s*\)/i, "Chế độ kiểm tra nghiêm ngặt (Strict Mode)", "Bắt buộc mã nguồn BDEF phải tuân thủ các quy tắc hiện đại nhất của RAP, loại bỏ hoàn toàn cú pháp cũ lỗi thời.", "Chuẩn mới nhất trên S/4HANA 2025 là strict(2)."],
        [/^with draft/i, "Kích hoạt cơ chế Bản Nháp (Draft)", "Cho phép người dùng chỉnh sửa dữ liệu dở dang mà không ảnh hưởng tới bảng Active chính. Dữ liệu nháp lưu ở Draft Table.", "Cần có các draft action Edit, Activate, Discard, Resume."],
        [/^lock master/i, "Cơ chế Khóa đối tượng (Lock Master)", "Xác định entity nắm giữ khóa LUW cho toàn bộ cây phân cấp của Business Object.", "Thường được đặt tại Root Entity."],
        [/^etag master\s+(\w+)/i, "Kiểm soát xung đột đồng thời (ETag OCC)", "Sử dụng trường thời gian <b>$1</b> làm ETag để ngăn ngừa hai người dùng ghi đè dữ liệu của nhau (Optimistic Concurrency Control).", "Fiori tự động gửi If-Match header chứa ETag khi update."],
        [/^draft action\s+(\w+)/i, "Thao tác Bản Nháp (Draft Action)", "Khai báo các action vòng đời của draft: Edit (tạo nháp từ active), Activate (lưu nháp thành active), Discard (hủy nháp).", "Phải khai báo trong BDEF projection nếu muốn lộ ra UI."],
        [/^persistent\s+table\s+(\w+)/i, "Bảng Active Database ($1)", "Bảng cơ sở dữ liệu vật lý lưu trữ dữ liệu chính thức đã qua commit. Ánh xạ trực tiếp với CDS Entity.", "Phải khai báo đủ trường khóa chính tương ứng với root view."],
        [/^draft\s+table\s+(\w+)/i, "Bảng Bản Nháp ($1)", "Bảng cơ sở dữ liệu tạm thời do RAP Framework quản lý, lưu trữ các thay đổi đang dở dang của người dùng.", "Bắt buộc phải chứa include sych_bdl_draft_admin_inc."],
        [/^association\s+_(\w+)\s*\{\s*create;\s*with draft;\s*\}/i, "Quan hệ Composition tạo con ($1)", "Cho phép tạo mới các bản ghi thực thể con <b>_$1</b> trực tiếp từ thực thể cha trong môi trường Bản Nháp.", "with draft đảm bảo thực thể con cũng được lưu vào bảng nháp tương ứng."],
        [/^field\s*\(\s*readonly,\s*numbering\s*:\s*managed\s*\)\s*(\w+)/i, "Tự động sinh UUID (Managed Numbering)", "RAP Framework tự động sinh khóa chính GUID 16 bytes ngẫu nhiên duy nhất cho trường <b>$1</b> khi tạo mới.", "Không cần viết code logic sinh số trong behavior pool."],
        [/^field\s*\(\s*readonly\s*\)/i, "Khai báo trường chỉ đọc (Read-only)", "Các trường dữ liệu này chỉ được hiển thị, người dùng trên giao diện Fiori không thể chỉnh sửa trực tiếp.", "Thường dùng cho các trường tính toán tự động, người sửa cuối, ngày giờ cập nhật."],
        [/^determination\s+(\w+)\s+on\s+modify/i, "Determination tự động khi sửa (on modify)", "Tự động kích hoạt phương thức <b>$1</b> trong Behavior Handler ngay khi người dùng thay đổi giá trị trường được chỉ định.", "Thích hợp cho việc tự động tính lại tổng tiền, tỷ giá khi số lượng thay đổi."],
        [/^validation\s+(\w+)\s+on\s+save/i, "Validation kiểm tra trước khi lưu (on save)", "Kích hoạt phương thức <b>$1</b> để kiểm tra tính hợp lệ của toàn bộ bản ghi trước khi chuyển sang pha Save.", "Nếu không đạt, đẩy message vào reported và khóa vào failed để chặn commit."],
        [/^side\s+effects\s*\{/i, "Khai báo RAP Side Effects trong BDEF", "Quy định mối quan hệ phản xạ dữ liệu: khi một trường thay đổi trên UI thì những trường nào khác phải được tự động làm mới từ server.", "Cú pháp chuẩn trong strict(2) trên SAP S/4HANA 2025, thay thế việc cấu hình annotation thủ công."]
    ];

    R.json = [
        [/^"name":\s*"([^"]+)"/i, "Tên định danh dự án (Package Name)", "Tên kỹ thuật định danh của ứng dụng theo quy ước npm: <b>$1</b>. Phải viết thường, dùng dấu gạch ngang phân cách.", "Không dùng ký tự đặc biệt hoặc chữ in hoa; khớp với định danh trong manifest.json."],
        [/^"version":\s*"([^"]+)"/i, "Phiên bản ứng dụng (SemVer)", "Phiên bản hiện tại của phần mềm: <b>$1</b> theo chuẩn Semantic Versioning (MAJOR.MINOR.PATCH).", "Quy ước chuẩn: 1.0.0 (phát hành đầu tiên), 1.1.0 (thêm tính năng mới), 1.0.1 (sửa lỗi)."],
        [/^"description":\s*"([^"]+)"/i, "Mô tả dự án (Description)", "Giới thiệu tóm tắt mục tiêu kỹ thuật và phạm vi giải pháp: <b>$1</b>.", "Nên ghi rõ nền tảng kỹ thuật và phiên bản SAP tương thích."],
        [/^"sap\.app"/, "Khối sap.app (Thông tin ứng dụng)", "Khai báo ID namespace, tiêu đề, loại ứng dụng và danh sách các nguồn dữ liệu dataSources (OData services).", "Bắt buộc phải có trong mọi ứng dụng SAPUI5."],
        [/^"sap\.ui5"/, "Khối sap.ui5 (Cấu hình UI5 Runtime)", "Cấu hình view gốc rootView, các thư viện dependencies, định tuyến màn hình routing và các controller extensions.", "Nơi khai báo models mặc định và cấu hình bất đồng bộ async: true."],
        [/^"dataSources"/, "Khai báo Nguồn dữ liệu (dataSources)", "Định nghĩa URL của OData V4 service và file Annotation EDMX.", "Khớp với mountPath của mockserver khi chạy local."],
        [/^"models"/, "Khai báo Mô hình Dữ liệu (models)", "Cấu hình OData model (trống tên là model mặc định), i18n model, JSON model dùng trong app.", "Nên đặt settings: { synchronizationMode: 'None', operationMode: 'Server' } cho OData V4."],
        [/^"routing"/, "Định tuyến Màn hình (Routing)", "Cấu hình routerClass, viewPath và vùng chứa target pagesContainer để điều hướng qua lại giữa các view.", "Luôn đặt async: true trong config routing."],
        [/^"devDependencies"/, "Khối devDependencies (Công cụ phát triển cục bộ)", "Khai báo các thư viện và CLI chỉ sử dụng trong môi trường phát triển và kiểm thử local (UI5 CLI, Mockserver), không bị đóng gói vào bundle triển khai.", "Cài đặt bằng lệnh: npm install --save-dev <tên_gói>."],
        [/^"scripts"/, "Khối scripts (Các lệnh tự động hóa NPM)", "Định nghĩa các lệnh tiện ích ngắn gọn để khởi động dev server (start) hoặc đóng gói ứng dụng (build).", "Thực thi trong terminal bằng: npm run <tên_lệnh> (hoặc npm start)."],
        [/^"start":/i, "Lệnh khởi động máy chủ cục bộ (start)", "Sử dụng UI5 Tooling để khởi chạy web server tại cổng 8085 và tự động mở trình duyệt với index.html.", "Chạy bằng lệnh: npm start."],
        [/^"build":/i, "Lệnh đóng gói ứng dụng (build)", "Biên dịch toàn bộ XML views, controllers và tài nguyên tĩnh thành file Component-preload.js trong thư mục dist/.", "Lệnh này bắt buộc phải chạy thành công trước khi deploy lên SAP NetWeaver/BTP."],
        [/^"@ui5\/cli":/i, "Công cụ dòng lệnh UI5 CLI", "Framework chính thức của SAP quản lý toàn bộ vòng đời phát triển ứng dụng SAPUI5/OpenUI5.", "Phiên bản v4 hỗ trợ ESM, tối ưu hóa tốc độ build và tích hợp middleware hiện đại."],
        [/^"@sap-ux\/ui5-middleware-fe-mockserver":/i, "Middleware Mock Server Fiori Elements", "Middleware chuyên dụng của SAP Fiori Tools để giả lập OData V4 service và Side Effects ngay tại local không cần backend thật.", "Giúp fresher phát triển frontend hoàn chỉnh mà không cần phụ thuộc máy chủ SAP."]
    ];

    R.js = [
        [/^sap\.ui\.define/i, "Khai báo AMD Module (sap.ui.define)", "Cơ chế nạp module bất đồng bộ Asynchronous Module Definition (AMD) chuẩn của SAPUI5. Khai báo dependencies mảng đầu tiên và hàm factory nhận các đối tượng tương ứng.", "Luôn dùng sap.ui.define thay cho cú pháp toàn cục cũ; đặt 'use strict' ngay đầu hàm factory."],
        [/^"use strict"/i, "Chế độ kiểm tra nghiêm ngặt (Strict Mode)", "Kích hoạt ECMAScript strict mode nhằm ngăn ngừa các lỗi tiềm ẩn như biến chưa khai báo, ghi đè thuộc tính chỉ đọc.", "Luôn đặt ở dòng đầu tiên của hàm factory trong SAPUI5."],
        [/^return\s+(\w+)\.extend\(\s*"([^"]+)"/i, "Định nghĩa Lớp Kế Thừa ($2)", "Khởi tạo lớp đối tượng mới <b>$2</b> kế thừa từ Base Class <b>$1</b> (BaseController, ControllerExtension hoặc Control), hiện thực hóa các phương thức vòng đời và sự kiện người dùng.", "Quy ước đặt tên Class phải khớp chính xác với namespace và đường dẫn thư mục vật lý."],
        [/^onInit:\s*function/i, "Lifecycle Hook khởi tạo (onInit)", "Hàm vòng đời được SAPUI5 tự động gọi MỘT LẦN DUY NHẤT khi View/Controller được khởi tạo vào bộ nhớ. Nơi lý tưởng để khởi tạo JSONModel, gắn routing listeners hoặc nạp dữ liệu ban đầu.", "Tránh gọi các thao tác DOM trực tiếp trong onInit vì giao diện chưa được render hoàn tất."],
        [/^onPageReady:\s*function/i, "FPM Lifecycle Hook (onPageReady)", "Lifecycle hook đặc thù của Fiori Elements Flexible Programming Model: được kích hoạt khi trang List Report hoặc Object Page đã sẵn sàng hiển thị dữ liệu.", "Dùng để kích hoạt các logic tự động hóa hoặc đo lường hiệu năng khi trang đã nạp xong."],
        [/^override:\s*\{/i, "Khối ghi đè Controller Extension (override)", "Khai báo ghi đè các hàm chuẩn hoặc extension points của Fiori Elements template mà không cần sửa code gốc của SAP.", "Có thể chỉ định OverrideExecution.After hoặc OverrideExecution.Before để kiểm soát thứ tự chạy."],
        [/^MessageToast\.show\(/i, "Thông báo phản hồi nhanh (MessageToast)", "Hiển thị thông báo dạng mờ dần ở đáy màn hình trong vài giây, cung cấp phản hồi tức thì cho người dùng mà không làm gián đoạn luồng làm việc.", "Chỉ dùng cho thông báo thành công hoặc trạng thái ngắn; nếu là lỗi cần dùng MessageBox."],
        [/^new\s+JSONModel/i, "Khởi tạo JSON Model Client-side", "Tạo mô hình dữ liệu JSONModel lưu trữ trạng thái giao diện UI State, danh sách dữ liệu client-side độc lập với backend.", "Gắn model vào View bằng this.getView().setModel(oModel, 'tênModel')."],
        [/^this\.byId\(/i, "Truy xuất Control an toàn (this.byId)", "Hàm chuẩn của Controller để tìm kiếm đối tượng UI5 Control theo ID đã khai báo trong XML View, tự động tiền tố ID theo View Prefix để tránh xung đột.", "Tuyệt đối không dùng document.getElementById vì sẽ làm hỏng tính cô lập của View."],
        [/^oRm\.openStart\(\s*"(\w+)"/i, "RenderManager: Mở thẻ DOM (<$1>)", "Phương thức của RenderManager trong SAPUI5 Custom Control để bắt đầu tạo một phần tử DOM HTML <b>$1</b> mới và đăng ký liên kết với Control.", "Luôn truyền tham số oControl vào openStart của thẻ gốc để UI5 gắn định danh DOM."],
        [/^oRm\.class\(\s*"([^"]+)"\)/i, "RenderManager: Thêm CSS Class ($1)", "Gắn thêm class định kiểu CSS <b>$1</b> vào phần tử DOM đang được khởi tạo.", "Nên sử dụng class có tiền tố riêng biệt để tránh ghi đè giao diện chuẩn của SAPUI5."],
        [/^oRm\.openEnd\(\)/i, "RenderManager: Hoàn tất mở thẻ DOM", "Đóng dấu mở ngoặc nhọn của thẻ DOM và sẵn sàng để ghi các phần tử con bên trong.", "Bắt buộc phải gọi sau khi đã thiết lập xong các thuộc tính và class của thẻ."],
        [/^oRm\.close\(\s*"(\w+)"\)/i, "RenderManager: Đóng thẻ HTML (</$1>)", "Ghi mã đóng thẻ HTML <b>&lt;/$1&gt;</b> vào luồng render của trình duyệt.", "Đảm bảo số lần gọi close khớp chính xác với số lần gọi openStart để HTML không bị vỡ cấu trúc."],
        [/^function\s+executeOptimisticConcurrencyCheck/i, "Kiểm tra xung đột đồng thời (ETag OCC)", "Thuật toán thẩm định ETag: so sánh giá trị ETag của client gửi lên với ETag hiện tại trên server. Nếu lệch nhau, trả về mã HTTP 412 Precondition Failed để bảo vệ dữ liệu.", "Cơ chế cốt lõi trong OData V4 để phòng chống hiện tượng Lost Update khi nhiều người cùng sửa 1 bản ghi."]
    ];

    R.xml = [
        [/^<mvc:View/i, "Thẻ gốc XML View (mvc:View)", "Gốc của giao diện người dùng theo mô hình MVC trong SAPUI5, định nghĩa controller liên kết và các XML namespaces.", "Luôn khai báo displayBlock=\"true\" và height=\"100%\"."],
        [/^<Page/i, "Trang Fiori tiêu chuẩn (sap.m.Page)", "Khung bố cục trang chuẩn với thanh HeaderContent, vùng nội dung Content có responsive padding và thanh Footer.", "Sử dụng class sapUiResponsiveContentPadding để căn lề chuẩn Horizon."],
        [/^<Table/i, "Bảng dữ liệu Responsive (sap.m.Table)", "Hiển thị danh sách dữ liệu dạng bảng với khả năng co giãn cột thông minh theo kích thước màn hình (demandPopin).", "Bind dữ liệu qua aggregation items=\"{...}\"."],
        [/^<Column/i, "Cột của Bảng (Column)", "Định nghĩa thuộc tính của cột: độ rộng (width), căn lề (hAlign), mức độ ưu tiên hiển thị (importance).", "Đặt minScreenWidth=\"Desktop\" và demandPopin=\"true\" cho các cột phụ."],
        [/^<Button/i, "Nút bấm tương tác (Button)", "Nút kích hoạt hành động; thuộc tính type thể hiện ngữ nghĩa: Emphasized (xanh nổi bật), Ghost, Transparent, Critical.", "Sự kiện press=\".onHandler\" gọi tới hàm tương ứng trong Controller."],
        [/^<IconTabBar/i, "Thanh chuyển đổi Tab (IconTabBar)", "Tổ chức màn hình thành nhiều tab nội dung riêng biệt với icon và nhãn tương ứng.", "Sử dụng select=\".onTabSelect\" để bắt sự kiện chuyển tab."],
        [/^<OverflowToolbar/i, "Thanh công cụ linh hoạt (OverflowToolbar)", "Thanh chứa các nút bấm và tiêu đề; tự động đưa các nút bị tràn màn hình vào menu xổ xuống khi xem trên màn hình nhỏ.", "Sử dụng ToolbarSpacer để đẩy các nút hành động sang góc phải."],
        [/^<ToolbarSpacer/i, "Khoảng đệm giãn cách (ToolbarSpacer)", "Thành phần vô hình chiếm toàn bộ khoảng trống còn lại trên thanh công cụ để căn đều các thành phần sang hai bên.", "Đặt giữa tiêu đề và các nút bấm để tạo bố cục chuẩn Fiori Horizon."],
        [/^<core:HTML/i, "Control nhúng HTML nguyên bản (core:HTML)", "Cho phép render HTML tùy biến hoàn toàn vào giao diện UI5 mà không bị bộ lọc sanitize làm mất các thuộc tính DOM cần thiết.", "Thuộc tính preferDOM=\"true\" giúp tối ưu hiệu năng render."],
        [/Type="Common\.SideEffectsType"/i, "Khai báo OData V4 Side Effects", "Chỉ định cơ chế tự động làm mới dữ liệu phía frontend: khi các trường SourceProperties thay đổi, Fiori Elements sẽ tự động gửi request đọc lại TargetProperties từ server.", "Cốt lõi để tự động cập nhật tổng tiền mà không cần người dùng bấm nút reload."],
        [/<PropertyPath>([^<]+)<\/PropertyPath>/i, "Đường dẫn trường dữ liệu ($1)", "Xác định trường thuộc tính tham gia vào luồng xử lý hoặc hiển thị trên giao diện Fiori.", "Có thể trỏ xuyên navigation qua liên kết (ví dụ _Header/TotalAmount)."],
        [/<PropertyValue\s+Property="([^"]+)"/i, "Thuộc tính cấu hình Annotation ($1)", "Gán giá trị cho tham số cấu hình <b>$1</b> của Fiori Annotation.", "Thường là SourceProperties, TargetProperties, TargetEntities."],
        [/<Collection>/i, "Tập hợp danh sách phần tử (Collection)", "Chứa danh sách nhiều đối tượng hoặc trường thuộc tính trong khai báo Annotation EDMX.", "Dùng để nhóm nhiều trường bị ảnh hưởng bởi Side Effects."]
    ];

    R.yaml = [
        [/^specVersion:/i, "Phiên bản đặc tả UI5 Tooling", "Định nghĩa phiên bản quy chuẩn cấu hình của UI5 CLI. Chuẩn 4.0 là chuẩn hiện đại nhất.", "Luôn dùng '4.0' khi làm việc với UI5 Tooling v4."],
        [/^metadata:/i, "Khối Metadata của UI5 Tooling", "Khai báo tên định danh của module dự án theo tiêu chuẩn UI5 CLI.", "Tên này thường trùng với namespace ứng dụng."],
        [/^framework:/i, "Khung thư viện SAPUI5", "Khai báo phiên bản runtime SAPUI5 mục tiêu và danh sách các thư viện UI5 cần nạp (sap.m, sap.ui.core, sap.fe.core...).", "Phiên bản 1.136.0 tương thích với SAP S/4HANA 2025."],
        [/^libraries:/i, "Danh sách thư viện UI5 phụ thuộc", "Khai báo các thư viện giao diện như sap.m, sap.ui.core, sap.fe.core, sap.fe.macros để UI5 Tooling tự động tải về khi chạy local.", "Chỉ khai báo các thư viện thực sự có sử dụng trong dự án."],
        [/^server:/i, "Khối server (Cấu hình Dev Server trong ui5.yaml)", "Thiết lập cấu hình cổng mạng, máy chủ phát triển cục bộ và các middleware trung gian xử lý request.", "Nơi tích hợp proxy chuyển tiếp request về máy chủ SAP hoặc mockserver."],
        [/^customMiddleware:/i, "Khối Middleware mở rộng", "Các lớp trung gian xử lý request của dev server cục bộ: mockserver, proxy chuyển tiếp request, tự động reload trang.", "Chạy tuần tự theo cấu hình afterMiddleware."],
        [/^-\s*name:\s*sap-fe-mockserver|^-\s*name:\s*@sap-ux\/ui5-middleware-fe-mockserver/i, "Cấu hình Mock Server Fiori Elements", "Giả lập toàn diện OData V4 service, Side Effects, ETag OCC ngay tại local không cần máy chủ SAP.", "Định cấu hình metadataPath và mockdataPath trong configuration."],
        [/^services:/i, "Danh sách OData Services giả lập", "Khai báo các dịch vụ OData V4 mà mockserver sẽ quản lý và phản hồi dữ liệu.", "Mỗi service có urlPath, metadataPath và mockdataPath riêng."],
        [/^urlPath:\s*(\S+)/i, "Đường dẫn URL của Mock Service ($1)", "Địa chỉ URL ảo mà ứng dụng frontend sẽ gửi các request OData tới.", "Phải khớp chính xác với uri của dataSource trong manifest.json."],
        [/^metadataPath:\s*(\S+)/i, "Đường dẫn file EDMX Metadata", "Nơi chứa định nghĩa các EntityTypes, Keys, Properties, và Actions theo chuẩn EDMX OData V4.", "Phải dùng từ khóa 'metadataPath', không được nhầm thành 'metadataXmlPath'."],
        [/^mockdataPath:\s*(\S+)/i, "Thư mục chứa dữ liệu mẫu JSON", "Thư mục chứa các file JSON (ví dụ DemoHeader.json, DemoItem.json) để mockserver nạp vào bộ nhớ.", "Tên file JSON phải khớp chính xác với tên EntitySet trong metadata.xml."],
        [/^generateMockData:\s*(\S+)/i, "Tự động sinh dữ liệu giả lập", "Cờ cấu hình cho phép mockserver tự động sinh dữ liệu ngẫu nhiên nếu không tìm thấy file JSON mẫu.", "Nên đặt false để kiểm soát chính xác 100% dữ liệu thử nghiệm."],
        [/^-\s*name:\s*(\S+)/i, "Thư viện giao diện SAPUI5 ($1)", "Nạp bộ thư viện <b>$1</b> vào dự án để sử dụng các control tương ứng trên giao diện.", "sap.m là thư viện điều khiển giao diện chính cho ứng dụng di động và máy tính."]
    ];

    R.shell = [
        [/^npm install\b|^npm i\b/i, "Cài đặt thư viện Node.js", "Tải và cài đặt các dependencies từ npm registry vào thư mục node_modules.", "Dùng cờ --save-dev cho các công cụ chỉ dùng khi dev."],
        [/^npx ui5 serve/i, "Khởi chạy máy chủ phát triển UI5", "Khởi động dev server UI5 Tooling trên cổng mạng chỉ định và bắt đầu lắng nghe request.", "Thêm cờ --open index.html để tự động bật trình duyệt."],
        [/^npm run build/i, "Đóng gói ứng dụng (Build)", "Thực thi script build tạo ra thư mục dist/ chứa Component-preload.js hoàn chỉnh.", "Kiểm tra 0 lỗi trước khi bàn giao."]
    ];

    R.md = [
        [/^#/, "Tiêu đề / Ghi chú tài liệu", "Dòng tiêu đề hoặc chú thích mô tả cấu trúc cài đặt môi trường và tài liệu hướng dẫn.", "Dùng để giải thích ngữ cảnh cho Fresher trước khi thực hiện lệnh."],
        [/^\d+\./, "Mục kiểm tra môi trường", "Danh mục phần mềm hoặc công cụ bắt buộc cần cài đặt ở Chương 1.", "Kiểm tra kỹ phiên bản tương thích trước khi cài đặt."]
    ];

    R.text = [];

    // ---------- TỪ ĐIỂN KHỐI BLOCK CODE CHUYÊN DỤNG ----------
    var BLOCK_DEFINITIONS = {
        devDependencies: {
            role: "Khối devDependencies (Công cụ phát triển cục bộ)",
            explanation: "Khai báo các công cụ và middleware chỉ sử dụng trong môi trường phát triển và kiểm thử local (như UI5 CLI, Fiori Elements Mockserver). Các gói này KHÔNG bị đóng gói vào bundle triển khai production.",
            tips: "Cài đặt gói mới vào khối này bằng cú pháp: npm install --save-dev <tên_gói>."
        },
        dependencies: {
            role: "Khối dependencies (Thư viện chạy thực tế)",
            explanation: "Khai báo các gói thư viện bắt buộc phải có khi ứng dụng chạy ở môi trường thực tế (runtime dependencies).",
            tips: "Chỉ đưa vào các gói thực sự cần thiết khi app chạy trên client."
        },
        scripts: {
            role: "Khối scripts (Lệnh tự động hóa NPM)",
            explanation: "Định nghĩa các phím tắt dòng lệnh để khởi động dev server (start), đóng gói ứng dụng (build) hoặc chạy kiểm thử tự động (test).",
            tips: "Chạy trong terminal qua cú pháp: npm run <tên_script> (hoặc npm start)."
        },
        "sap.app": {
            role: "Khối sap.app (Định danh & Dịch vụ của App)",
            explanation: "Chứa thông tin định danh toàn cục của ứng dụng: ID namespace (duy nhất), loại app (application), phiên bản và danh mục các nguồn dữ liệu dataSources.",
            tips: "Khớp ID với Component.js và namespace của toàn bộ controllers/views."
        },
        "sap.ui5": {
            role: "Khối sap.ui5 (Cấu hình UI5 Framework)",
            explanation: "Thiết lập môi trường thực thi cho SAPUI5: view khởi đầu (rootView), bộ định tuyến điều hướng (routing) và danh sách các thư viện phụ thuộc (dependencies).",
            tips: "Luôn đặt async: true trong rootView và routing để đạt hiệu năng tối đa."
        },
        routing: {
            role: "Khối routing (Hệ thống điều hướng Fiori)",
            explanation: "Định nghĩa cơ chế điều hướng URL dạng Hash (#/route) tương ứng với từng màn hình View cụ thể trong ứng dụng.",
            tips: "Giúp người dùng có thể bookmark hoặc bấm nút Back/Forward trên trình duyệt bình thường."
        },
        server: {
            role: "Khối server (Cấu hình Dev Server trong ui5.yaml)",
            explanation: "Thiết lập cấu hình cổng mạng, máy chủ phát triển cục bộ và các middleware trung gian xử lý request.",
            tips: "Nơi tích hợp proxy chuyển tiếp request về máy chủ SAP hoặc mockserver."
        },
        customMiddleware: {
            role: "Khối customMiddleware (Các lớp trung gian xử lý request)",
            explanation: "Liệt kê các middleware mở rộng can thiệp vào luồng request/response của UI5 dev server: mock dữ liệu, xác thực chứng chỉ, tự động tải lại trang.",
            tips: "Thứ tự middleware được điều khiển qua thuộc tính afterMiddleware."
        }
    };

    function escapeHtml(s) {
        return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function detectKind(sText) {
        var raw = (sText || "").trim();
        if (/^#\s+/m.test(raw) && !/^specVersion:/m.test(raw)) return "md";
        if (/^(\{|\[\s*[{"\n]|"[^"\n]+"\s*:)/.test(raw) && !/^"!/.test(raw)) return "json";
        if (/^specVersion:/m.test(raw)) return "yaml";
        if (/^<mvc:View|^<Page|^<Table|^<core:FragmentDefinition/m.test(raw)) return "xml";
        if (/^sap\.ui\.define|function\s*\(|=>|\bvar\b|\bconst\b/m.test(raw)) return "js";
        if (/^\s*(managed|projection)\b|^\s*define behavior for/im.test(raw)) return "bdef";
        if (/^\s*(define\s+(root\s+)?(view|custom|abstract|table|structure|service)|annotate\s+(entity|view))|^\s*@\w+\.\w+/im.test(raw)) return "cds";
        if (/^\s*(CLASS|METHOD|METHODS|DATA|INTERFACES|READ ENTITIES|MODIFY ENTITIES|SELECT|LOOP AT|APPEND|IF|AUTHORITY-CHECK)\b/m.test(raw)) return "abap";
        if (/^npm\b|^npx\b|^node\b|^mkdir\b|^cd\b|^git\b/m.test(raw)) return "shell";
        return "text";
    }

    function matchRule(aRules, sLine) {
        var l = sLine.trim();
        for (var i = 0; i < aRules.length; i++) {
            var m = aRules[i][0].exec(l);
            if (m) {
                var d = aRules[i][2].replace(/\$(\d)/g, function (_, n) {
                    return escapeHtml(m[+n] || "");
                });
                return {
                    role: aRules[i][1],
                    explanation: d,
                    tips: aRules[i][3] || "Thao tác tuân thủ chuẩn SAP Fiori Horizon."
                };
            }
        }
        return null;
    }

    function buildSmartFallback(sLine, k) {
        var t = sLine.trim();
        if (!t) {
            return {
                role: "Dòng trống phân tách khối",
                explanation: "Giúp phân chia các khối logic hoặc thuộc tính cho mã nguồn sạch sẽ, dễ đọc.",
                tips: "Giữ khoảng trống nhất quán giữa các hàm và khối khai báo."
            };
        }
        if (/^(\/\/|#|\/\*|\*|--|<!--|")/.test(t)) {
            return {
                role: "Ghi chú giải thích (Comment)",
                explanation: "Mô tả mục đích nghiệp vụ hoặc kỹ thuật của đoạn code ngay bên dưới, không ảnh hưởng tới luồng chạy.",
                tips: "Đọc kỹ comment để hiểu lý do thiết kế trước khi sửa code."
            };
        }
        var mJson = /^"([^"]+)"\s*:\s*(.+)$/.exec(t);
        if (mJson) {
            return {
                role: "Thuộc tính JSON: " + mJson[1],
                explanation: "Gán giá trị cấu hình <code>" + escapeHtml(mJson[2].replace(/,$/, "")) + "</code> cho khóa <b>" + escapeHtml(mJson[1]) + "</b>.",
                tips: "Kiểm tra dấu phẩy ngăn cách giữa các thuộc tính JSON (dòng cuối cùng của block không có dấu phẩy)."
            };
        }
        var mYaml = /^([a-zA-Z0-9_-]+):\s*(.*)$/.exec(t);
        if (mYaml && k === "yaml") {
            return {
                role: "Khóa cấu hình YAML: " + mYaml[1],
                explanation: mYaml[2]
                    ? "Thiết lập tham số <b>" + escapeHtml(mYaml[1]) + "</b> bằng giá trị <code>" + escapeHtml(mYaml[2]) + "</code>."
                    : "Khai báo nhóm cấu hình con <b>" + escapeHtml(mYaml[1]) + "</b>.",
                tips: "YAML phân cấp bằng đúng 2 dấu cách (spaces), không dùng phím Tab."
            };
        }
        var mXmlTag = /^<\/?([a-zA-Z0-9_:]+)/.exec(t);
        if (mXmlTag) {
            var isClose = t.startsWith("</");
            return {
                role: (isClose ? "Đóng thẻ XML: " : "Thẻ điều khiển / khai báo XML: ") + mXmlTag[1],
                explanation: isClose
                    ? "Kết thúc phạm vi của control hoặc thẻ <code>&lt;" + escapeHtml(mXmlTag[1]) + "&gt;</code>."
                    : "Khai báo phần tử UI5 / Annotation <code>&lt;" + escapeHtml(mXmlTag[1]) + "&gt;</code> trong cây giao diện hoặc EDMX.",
                tips: "Đảm bảo mọi thẻ mở đều có thẻ đóng hoặc tự đóng <code>/&gt;</code> tương ứng."
            };
        }
        var mXmlAttr = /^([a-zA-Z0-9_:]+)\s*=\s*"([^"]*)"/.exec(t);
        if (mXmlAttr) {
            return {
                role: "Thuộc tính XML: " + mXmlAttr[1],
                explanation: "Truyền giá trị hoặc biểu thức binding <code>" + escapeHtml(mXmlAttr[2]) + "</code> vào thuộc tính <b>" + escapeHtml(mXmlAttr[1]) + "</b>.",
                tips: "Nếu giá trị bắt đầu bằng dấu chấm (<code>.on...</code>), đó là hàm xử lý sự kiện trong Controller."
            };
        }
        var mCdsAlias = /^key\s+(\w+)\s+as\s+(\w+)|^(\w+)\s+as\s+(\w+)/i.exec(t);
        if (mCdsAlias && (k === "cds" || k === "abap")) {
            var fDb = mCdsAlias[1] || mCdsAlias[3];
            var fAlias = mCdsAlias[2] || mCdsAlias[4];
            return {
                role: "Ánh xạ trường CDS: " + fAlias,
                explanation: "Đọc cột bảng DB <code>" + escapeHtml(fDb) + "</code> và đặt tên PascalCase chuẩn OData là <b>" + escapeHtml(fAlias) + "</b>.",
                tips: "Fiori và RAP Behavior luôn tham chiếu bằng tên Alias (CamelCase/PascalCase)."
            };
        }
        var mJsAssign = /^(?:var|let|const)\s+(\w+)\s*=|^(\w+)\s*:\s*function/.exec(t);
        if (mJsAssign) {
            var sSym = mJsAssign[1] || mJsAssign[2];
            return {
                role: mJsAssign[2] ? "Phương thức Controller/Control: " + sSym : "Khai báo biến: " + sSym,
                explanation: mJsAssign[2]
                    ? "Định nghĩa hàm xử lý sự kiện hoặc helper <b>" + escapeHtml(sSym) + "</b>."
                    : "Khởi tạo biến cục bộ <b>" + escapeHtml(sSym) + "</b> để lưu tham chiếu model, control hoặc kết quả xử lý.",
                tips: "Luôn dùng <code>this.byId(...)</code> hoặc <code>this.getModel(...)</code> để truy xuất đúng phạm vi View."
            };
        }
        var mBatch = /^@(?:echo|SET|if|else|\w+)/i.exec(t);
        if (mBatch) {
            return {
                role: "Chỉ thị / Annotation: " + t.split(/\s+/)[0],
                explanation: "Cấu hình metadata bổ sung hoặc lệnh điều khiển thực thi cho dòng kế tiếp.",
                tips: "Kiểm tra đúng tên namespace/annotation theo tài liệu SAP."
            };
        }
        return {
            role: "Câu lệnh thực thi (" + k.toUpperCase() + ")",
            explanation: "Thực thi biểu thức: <code>" + escapeHtml(t.length > 90 ? t.slice(0, 90) + "..." : t) + "</code>.",
            tips: "Xem thêm sơ đồ luồng và mô tả vai trò file ở mục Bản Đồ File phía trên để biết ngữ cảnh đầy đủ."
        };
    }

    /**
     * Thuật toán so khớp thông minh: Tìm kiếm chú giải trong annotatedLines cho 1 dòng code
     */
    function findAnnotation(sLine, iLineNum, aAnnotatedLines) {
        if (!Array.isArray(aAnnotatedLines) || aAnnotatedLines.length === 0) {
            return null;
        }

        var sCleanLine = sLine.trim().replace(/^[,\s;"]+|[,\s;"]+$/g, "");
        if (!sCleanLine) return null;

        // 1. Khớp chính xác nội dung chuỗi mã lệnh
        for (var i = 0; i < aAnnotatedLines.length; i++) {
            var ann = aAnnotatedLines[i];
            if (ann.code) {
                var sCleanAnn = ann.code.trim().replace(/^[,\s;"]+|[,\s;"]+$/g, "");
                if (sCleanLine === sCleanAnn) {
                    return ann;
                }
            }
        }

        // 2. Khớp theo từ khóa đặc thù (Key Phrase Matching)
        for (var j = 0; j < aAnnotatedLines.length; j++) {
            var a = aAnnotatedLines[j];
            if (a.code) {
                var c = a.code.trim().replace(/^[,\s;"]+|[,\s;"]+$/g, "");
                // Bóc tách tên thuộc tính, thư viện hoặc lệnh
                var mKey = /"([^"]+)"|:\s*([^,\s]+)|-\s*name:\s*(\S+)/.exec(c);
                var sKey = mKey ? (mKey[1] || mKey[2] || mKey[3]) : null;
                if (sKey && sKey.length > 3 && sCleanLine.indexOf(sKey) !== -1) {
                    return a;
                }
            }
        }

        // 3. Khớp theo số dòng nếu trùng khớp
        for (var k = 0; k < aAnnotatedLines.length; k++) {
            if (aAnnotatedLines[k].line === iLineNum) {
                return aAnnotatedLines[k];
            }
        }

        return null;
    }

    // ---------- SINGLETON TOOLTIP CHO TOÀN BỘ MÀN HÌNH ----------
    var _oTooltipEl = null;

    function getOrCreateTooltip() {
        if (!_oTooltipEl) {
            _oTooltipEl = document.createElement("div");
            _oTooltipEl.className = "code-tip";
            _oTooltipEl.setAttribute("role", "tooltip");
            document.body.appendChild(_oTooltipEl);
        }
        return _oTooltipEl;
    }

    function renderTooltipContent(oTargetEl, sTypeBadge) {
        var oTip = getOrCreateTooltip();
        var sBadge = sTypeBadge || oTargetEl.getAttribute("data-badge") || "CHI TIẾT MÃ LỆNH";
        var sRole = oTargetEl.getAttribute("data-role") || oTargetEl.getAttribute("data-t") || "Chi tiết mã lệnh";
        var sExp = oTargetEl.getAttribute("data-exp") || oTargetEl.getAttribute("data-d") || "Dòng lệnh thực thi trong module này.";
        var sTips = oTargetEl.getAttribute("data-tips") || oTargetEl.getAttribute("data-n") || "";

        oTip.innerHTML = 
            '<div class="k">' + escapeHtml(sBadge) + '</div>' +
            '<b>' + escapeHtml(sRole) + '</b>' +
            '<div class="code-tip-body">' + sExp + '</div>' +
            (sTips ? '<div class="n">💡 <b>Lưu ý Fresher:</b> ' + escapeHtml(sTips) + '</div>' : '');

        oTip.style.display = "block";
    }

    function positionTooltip(oEv, oTargetEl) {
        var oTip = getOrCreateTooltip();
        var r = oTargetEl.getBoundingClientRect();
        var w = oTip.offsetWidth || 440;
        var h = oTip.offsetHeight || 120;

        var clientX = oEv.clientX || (r.left + 30);
        var clientY = oEv.clientY || (r.top + 20);

        var x = Math.min(Math.max(16, clientX + 20), window.innerWidth - w - 20);
        var y = clientY + 18;
        if (y + h > window.innerHeight - 16) {
            y = Math.max(16, r.top - h - 14);
        }

        oTip.style.left = x + "px";
        oTip.style.top = y + "px";
    }

    function hideTooltip() {
        if (_oTooltipEl) {
            _oTooltipEl.style.display = "none";
        }
        document.querySelectorAll(".code-line.hot").forEach(function (el) {
            el.classList.remove("hot");
        });
        document.querySelectorAll(".code-block.hot-block").forEach(function (el) {
            el.classList.remove("hot-block");
        });
    }

    return {
        /**
         * Chuyển mã nguồn thành cấu trúc dòng và block có chú giải chi tiết 3 tầng
         */
        parseToHtml: function (sCode, sForcedKind, aAnnotatedLines) {
            var k = sForcedKind || detectKind(sCode);
            var aRules = R[k] || R.json;
            var aLines = (sCode || "").split("\n");

            var sHtml = '<div class="code academyCodeBox"><pre class="code-editor-view"><code>';
            var aBlockStack = [];

            for (var i = 0; i < aLines.length; i++) {
                var iLineNum = i + 1;
                var sLine = aLines[i];
                var sTrimmed = sLine.trim();

                // Kiểm tra xem dòng này có mở một Block mới không
                var sBlockKey = null;
                var oBlockDef = null;

                // 1. Nhận diện Block trong JSON / YAML
                var mBlock = /"([\w.-]+)"\s*:\s*[{[]|^([\w.-]+):\s*$/.exec(sTrimmed);
                if (mBlock) {
                    sBlockKey = mBlock[1] || mBlock[2];
                    oBlockDef = BLOCK_DEFINITIONS[sBlockKey] || {
                        role: "Khối đối tượng " + sBlockKey,
                        explanation: "Tập hợp các thuộc tính cấu hình logic thuộc phân nhóm " + sBlockKey + ".",
                        tips: "Đảm bảo đóng ngoặc đầy đủ và phân cách các thuộc tính bằng dấu phẩy."
                    };
                }

                // 2. Tra cứu chú giải chi tiết bằng thuật toán so khớp thông minh findAnnotation
                var oAnn = findAnnotation(sLine, iLineNum, aAnnotatedLines);
                var sRole = "";
                var sExplanation = "";
                var sTips = "";

                if (oAnn) {
                    sRole = oAnn.role || "";
                    sExplanation = oAnn.explanation || "";
                    sTips = oAnn.tips || "";
                } else if (oBlockDef) {
                    sRole = oBlockDef.role;
                    sExplanation = oBlockDef.explanation;
                    sTips = oBlockDef.tips;
                } else {
                    // Tra cứu qua bộ regex
                    var oMatch = matchRule(aRules, sLine);
                    if (oMatch) {
                        sRole = oMatch.role;
                        sExplanation = oMatch.explanation;
                        sTips = oMatch.tips;
                    } else if (sTrimmed === "{" || sTrimmed === "}" || sTrimmed === "}," || sTrimmed === "];") {
                        sRole = sTrimmed.startsWith("{") ? "Mở khối cấu trúc" : "Đóng khối cấu trúc";
                        sExplanation = "Xác định phạm vi bắt đầu hoặc kết thúc của đối tượng dữ liệu.";
                        sTips = "Luôn kiểm tra tính cân bằng giữa dấu mở ngoặc và đóng ngoặc.";
                    } else {
                        var oFb = buildSmartFallback(sLine, k);
                        sRole = oFb.role;
                        sExplanation = oFb.explanation;
                        sTips = oFb.tips;
                    }
                }

                // Nếu là dòng mở đầu Block, bắt đầu thẻ container .code-block
                if (sBlockKey && oBlockDef) {
                    sHtml += '<div class="code-block" data-block-name="' + escapeHtml(sBlockKey) + '" ' +
                        'data-role="' + escapeHtml(oBlockDef.role) + '" ' +
                        'data-exp="' + escapeHtml(oBlockDef.explanation) + '" ' +
                        'data-tips="' + escapeHtml(oBlockDef.tips) + '" ' +
                        'data-badge="CỤM BLOCK CODE">';
                    aBlockStack.push(sBlockKey);
                }

                // Render dòng code đơn lẻ (MỖI DÒNG LÀ MỘT KHỐI RIÊNG, KHÔNG GỘP BẬY BẠ)
                var sLineClass = "code-line";
                if (sBlockKey) {
                    sLineClass += " is-block-header";
                }

                sHtml += '<div class="' + sLineClass + '" ' +
                    'data-line="' + iLineNum + '" ' +
                    'data-role="' + escapeHtml(sRole) + '" ' +
                    'data-exp="' + escapeHtml(sExplanation) + '" ' +
                    'data-tips="' + escapeHtml(sTips) + '" ' +
                    'data-badge="DÒNG ' + iLineNum + ' (' + k.toUpperCase() + ')">' +
                    '<span class="line-number">' + iLineNum + '</span>' +
                    '<span class="line-content">' + escapeHtml(sLine) + '</span>' +
                    '</div>';

                // Kiểm tra đóng Block nếu gặp dấu đóng ngoặc tương ứng
                if (aBlockStack.length > 0) {
                    if (sTrimmed === "}" || sTrimmed === "}," || sTrimmed === "]" || sTrimmed === "],") {
                        sHtml += '</div>'; // Đóng .code-block
                        aBlockStack.pop();
                    }
                }
            }

            // Đóng các thẻ block còn sót nếu có
            while (aBlockStack.length > 0) {
                sHtml += '</div>';
                aBlockStack.pop();
            }

            sHtml += '</code></pre></div>';
            return sHtml;
        },

        /**
         * Gắn sự kiện hover và click thông minh theo dòng và theo block
         */
        attach: function (oDomRef) {
            if (!oDomRef) return;
            getOrCreateTooltip();

            // 1. Xử lý hover trên từng dòng đơn lẻ (.code-line)
            var aLines = oDomRef.querySelectorAll(".code-line");
            aLines.forEach(function (lineEl) {
                if (lineEl._tipAttached) return;
                lineEl._tipAttached = true;

                lineEl.addEventListener("mouseenter", function (ev) {
                    hideTooltip();

                    // Nếu là dòng mở đầu Block (ví dụ "devDependencies": {), cho phép sáng toàn bộ cụm Block
                    if (lineEl.classList.contains("is-block-header")) {
                        var oParentBlock = lineEl.closest(".code-block");
                        if (oParentBlock) {
                            oParentBlock.classList.add("hot-block");
                            renderTooltipContent(oParentBlock, "CỤM BLOCK CODE");
                            positionTooltip(ev, oParentBlock);
                            return;
                        }
                    }

                    // Nếu là dòng đơn bình thường (ví dụ dòng "build": ... hoặc "@ui5/cli")
                    lineEl.classList.add("hot");
                    renderTooltipContent(lineEl);
                    positionTooltip(ev, lineEl);
                });

                lineEl.addEventListener("mousemove", function (ev) {
                    if (lineEl.classList.contains("is-block-header")) {
                        var oParentBlock = lineEl.closest(".code-block");
                        if (oParentBlock) {
                            positionTooltip(ev, oParentBlock);
                            return;
                        }
                    }
                    positionTooltip(ev, lineEl);
                });

                lineEl.addEventListener("mouseleave", function () {
                    hideTooltip();
                });

                lineEl.addEventListener("click", function (ev) {
                    hideTooltip();
                    lineEl.classList.add("hot");
                    renderTooltipContent(lineEl);
                    positionTooltip(ev, lineEl);
                });
            });

            // 2. Global listener để ẩn khi cuộn trang hoặc rời chuột
            if (!window._codeTipsGlobalAttached) {
                window._codeTipsGlobalAttached = true;
                window.addEventListener("scroll", hideTooltip, { passive: true });
                document.addEventListener("mouseleave", hideTooltip);
            }
        },

        hide: hideTooltip
    };
});
