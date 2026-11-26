const fs = require('fs');
const path = require('path');

const guidelinePath = path.resolve(__dirname, '../src/frontend/webapp/mockdata/fresher_guideline.json');
const data = JSON.parse(fs.readFileSync(guidelinePath, 'utf8'));

// Ánh xạ ảnh cho từng bước cụ thể
const stepImagesMapping = {
    "chap1": {
        1: { img: "img/guideline/steps/step_01_nodejs_install.png", caption: "Màn hình kiểm tra phiên bản Node.js v22 LTS và npm trong Terminal" },
        2: { img: "img/guideline/steps/step_02_vscode_fiori_tools.png", caption: "Giao diện Extensions Marketplace cài đặt SAP Fiori Tools trong VS Code" },
        3: { img: "img/guideline/steps/step_03_eclipse_adt_install.png", caption: "Cài đặt Java JDK và chuẩn bị bộ cài Eclipse IDE 2024" },
        4: { img: "img/guideline/steps/step_03_eclipse_adt_install.png", caption: "Màn hình cài đặt ADT Plugin qua URL chính thức trong Eclipse 2024" },
        5: { img: "img/guideline/steps/step_04_sap_logon_connection.png", caption: "Cấu hình kết nối hệ thống SAP S/4HANA 2025 Client 100 trong SAP Logon" },
        6: { img: "img/guideline/steps/step_04_sap_logon_connection.png", caption: "Tạo ABAP Cloud Project kết nối SAP S/4HANA 2025 trong Eclipse ADT" }
    },
    "chap2": {
        1: { img: "img/guideline/steps/step_06_fiori_generator_wizard.png", caption: "Mở Fiori Application Generator bằng phím tắt Ctrl+Shift+P trong VS Code" },
        2: { img: "img/guideline/steps/step_06_fiori_generator_wizard.png", caption: "Lựa chọn mẫu Template: SAPUI5 Freestyle hoặc Fiori Elements" },
        4: { img: "img/guideline/steps/step_06_fiori_generator_wizard.png", caption: "Cấu hình Project Name, Namespace và Minimum SAPUI5 Version" },
        6: { img: "img/guideline/01_dashboard_view.png", caption: "Cấu trúc thư mục MVC webapp/ và ứng dụng chạy thành công trên cổng 8085" }
    },
    "chap3": {
        1: { img: "img/guideline/04_architecture_view.png", caption: "Cấu hình file ui5.yaml và mô hình Dual Execution (Mock vs S/4HANA)" },
        4: { img: "img/guideline/04_architecture_view.png", caption: "Cấu trúc thư mục localService chứa metadata.xml và mockdata JSON" }
    },
    "chap4": {
        4: { img: "img/guideline/01_dashboard_view.png", caption: "Bố cục Fiori Horizon ToolHeader với Mode Selector và nút chức năng ghim cố định" },
        5: { img: "img/guideline/01_dashboard_view.png", caption: "Giao diện Fiori Horizon Shell hiển thị đầy đủ trên trình duyệt" }
    },
    "chap5": {
        3: { img: "img/guideline/02_catalog_view.png", caption: "Giao diện Technical Catalog Explorer với FilterBar đa tiêu chí và Responsive Table" },
        5: { img: "img/guideline/03_code_explorer_view.png", caption: "Giao diện Code Explorer hiển thị full 100% mã nguồn không bị cuộn con" }
    },
    "chap6": {
        2: { img: "img/guideline/05_fiori_elements_lab_view.png", caption: "Giao diện Fiori Elements Lab với Building Blocks Table và FilterBar V4" },
        3: { img: "img/guideline/06_side_effects_simulation.png", caption: "Cơ chế Side Effects tự động tính lại tổng tiền khi thay đổi số lượng" },
        5: { img: "img/guideline/07_fpm_building_blocks.png", caption: "Thực nghiệm live Side Effects và Custom Controller Extensions" }
    },
    "chap7": {
        2: { img: "img/guideline/12_custom_controls_gauge.png", caption: "Custom Control Technical Health Gauge dựng bằng RenderManager" },
        4: { img: "img/guideline/13_xml_fragment_dialog.png", caption: "Hộp thoại tra cứu nhanh XML Fragment QuickInspectDialog" },
        5: { img: "img/guideline/11_message_manager_popover.png", caption: "MessagePopover hiển thị danh sách lỗi form validation chuẩn Fiori" }
    },
    "chap8": {
        2: { img: "img/guideline/17_odata_v4_batch_changeset.png", caption: "Mô phỏng cơ chế gom nhóm Multipart $batch ChangeSet trong OData V4" },
        3: { img: "img/guideline/16_odata_v4_bound_action.png", caption: "Thực thi Bound Action approveHeader thay đổi trạng thái sang Approved" },
        4: { img: "img/guideline/18_odata_v4_etag_concurrency.png", caption: "Thử nghiệm cơ chế If-Match ETag OCC chống xung đột Lost Update" }
    },
    "chap9": {
        1: { img: "img/guideline/steps/step_04_sap_logon_connection.png", caption: "Ghim Package ZNGHIANDD_TEST vào Favorite Packages trong Eclipse ADT" },
        2: { img: "img/guideline/steps/step_14_eclipse_db_table.png", caption: "Tạo Database Table ZDEMO_HEADER trong Eclipse ADT gán TR S4DK911884" },
        3: { img: "img/guideline/steps/step_14_eclipse_db_table.png", caption: "Tạo Database Table con ZDEMO_ITEM với khóa ngoại header_uuid" },
        4: { img: "img/guideline/steps/step_15_eclipse_cds_view.png", caption: "Root CDS View Entity ZI_DemoHeaderTP với composition tới _Items" },
        6: { img: "img/guideline/steps/step_15_eclipse_cds_view.png", caption: "Xem trước dữ liệu CDS View bằng phím tắt vàng F8 (Open Data Preview)" }
    },
    "chap10": {
        1: { img: "img/guideline/steps/step_16_eclipse_bdef_managed.png", caption: "Tạo Behavior Definition BDEF Managed strict(2) với draft table" },
        3: { img: "img/guideline/steps/step_16_eclipse_bdef_managed.png", caption: "Tự động sinh Behavior Pool Class bằng phím tắt thần thánh Ctrl + 1" },
        5: { img: "img/guideline/steps/step_18_eclipse_service_binding_publish.png", caption: "Tạo Service Definition ZUI_DEMO_HEADER_O4 phơi bày CDS entities" },
        6: { img: "img/guideline/steps/step_18_eclipse_service_binding_publish.png", caption: "Bấm nút Publish trên Service Binding và nhấp đúp EntitySet để Preview Fiori Elements" }
    }
};

let updatedCount = 0;
data.chapters.forEach(chap => {
    const chapMapping = stepImagesMapping[chap.id];
    if (chapMapping && chap.steps) {
        chap.steps.forEach(step => {
            const imgInfo = chapMapping[step.stepNumber];
            if (imgInfo) {
                step.stepImage = imgInfo.img;
                step.stepImageCaption = imgInfo.caption;
                updatedCount++;
            }
        });
    }
});

fs.writeFileSync(guidelinePath, JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ Đã cập nhật thành công ${updatedCount} bước có hình ảnh minh họa thực tế vào fresher_guideline.json!`);

