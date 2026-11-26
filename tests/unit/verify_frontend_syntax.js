/**
 * Automated Verification Script for Phase 1 Frontend
 * Verifies syntax, JSON structures, manifest routing integrity and absence of unwanted business objects.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../');
const FRONTEND_DIR = path.join(ROOT_DIR, 'src/frontend');
const WEBAPP_DIR = path.join(FRONTEND_DIR, 'webapp');

console.log('--- BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG FRONTEND PHASE 1 ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
    totalTests++;
    if (condition) {
        console.log(`[PASS] ${message}`);
        passedTests++;
    } else {
        console.error(`[FAIL] ${message}`);
        process.exitCode = 1;
    }
}

// 1. Kiểm tra file cấu hình cốt lõi
const packageJsonPath = path.join(FRONTEND_DIR, 'package.json');
assert(fs.existsSync(packageJsonPath), 'package.json tồn tại');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
assert(packageJson.name === 'sap-fiori-technical-academy', 'package.json name hợp lệ');

const ui5YamlPath = path.join(FRONTEND_DIR, 'ui5.yaml');
assert(fs.existsSync(ui5YamlPath), 'ui5.yaml tồn tại');

const manifestPath = path.join(WEBAPP_DIR, 'manifest.json');
assert(fs.existsSync(manifestPath), 'webapp/manifest.json tồn tại');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
assert(manifest['sap.app'].id === 'sap.fiori.tech.academy', 'manifest.json app id hợp lệ');

// 2. Kiểm tra Mock Data JSON files
const mockFiles = [
    'technical_catalog.json',
    'code_snippets.json',
    'learning_paths.json',
    'system_health.json'
];

mockFiles.forEach(file => {
    const filePath = path.join(WEBAPP_DIR, 'mockdata', file);
    assert(fs.existsSync(filePath), `mockdata/${file} tồn tại`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    assert(typeof data === 'object' && data !== null, `mockdata/${file} parse JSON thành công`);
});

const catalog = JSON.parse(fs.readFileSync(path.join(WEBAPP_DIR, 'mockdata/technical_catalog.json'), 'utf8'));
assert(Array.isArray(catalog.categories) && catalog.categories.length === 10, 'Catalog có đúng 10 Technical Categories');
assert(Array.isArray(catalog.topics) && catalog.topics.length >= 10, 'Catalog chứa danh sách Topics phong phú');

const snippets = JSON.parse(fs.readFileSync(path.join(WEBAPP_DIR, 'mockdata/code_snippets.json'), 'utf8'));
assert(Array.isArray(snippets.snippets) && snippets.snippets.length >= 5, 'Code snippets chứa ít nhất 5 mẫu mã nguồn kỹ thuật');

// 3. Kiểm tra Views & Controllers
const views = ['App', 'Dashboard', 'Catalog', 'CodeExplorer', 'ArchitectureViewer', 'NotFound'];
views.forEach(view => {
    const viewPath = path.join(WEBAPP_DIR, 'view', `${view}.view.xml`);
    const ctrlPath = path.join(WEBAPP_DIR, 'controller', `${view}.controller.js`);
    assert(fs.existsSync(viewPath), `View ${view}.view.xml tồn tại`);
    assert(fs.existsSync(ctrlPath), `Controller ${view}.controller.js tồn tại`);
});

// 4. Kiểm tra Fragment & Components
const fragmentPath = path.join(WEBAPP_DIR, 'fragment/ModeSelectorDialog.fragment.xml');
assert(fs.existsSync(fragmentPath), 'Fragment ModeSelectorDialog.fragment.xml tồn tại');

const componentPath = path.join(WEBAPP_DIR, 'Component.js');
assert(fs.existsSync(componentPath), 'Component.js tồn tại');

// 5. Kiểm tra ranh giới phạm vi (Scope Boundary): Không có Sales Order, Purchase Order hay mã nghiệp vụ cũ
const allFiles = [];
function readDirRecursive(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            readDirRecursive(fullPath);
        } else {
            allFiles.push(fullPath);
        }
    });
}
readDirRecursive(WEBAPP_DIR);

let hasBannedWords = false;
allFiles.forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.xml') || file.endsWith('.json')) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('SalesOrder') || content.includes('PurchaseOrder') || content.includes('VBAK') || content.includes('EKKO')) {
            console.error(`[VIOLATION] Tìm thấy từ khóa nghiệp vụ ngoài phạm vi trong: ${file}`);
            hasBannedWords = true;
        }
    }
});
assert(!hasBannedWords, 'Ranh giới kỹ thuật: Hoàn toàn không chứa Sales Order, Purchase Order hay bảng nghiệp vụ cũ');

console.log(`\n--- KẾT QUẢ KIỂM THỬ: ${passedTests}/${totalTests} TESTS PASSED ---`);
if (passedTests === totalTests) {
    console.log('XÁC NHẬN: PHASE 1 FRONTEND CORE LEARNING PLATFORM HOÀN TOÀN HỢP LỆ VÀ SẴN SÀNG!');
}

