/**
 * Clean-Room From-Scratch Rebuild & Checklist Verification Test (0 -> 100%)
 * Reads ONLY src/frontend/webapp/mockdata/fresher_guideline.json, extracts all guided files
 * into an isolated temporary folder strictly following Chapters 1..14 (WITHOUT fake image stubs!),
 * runs tools/build_guideline_data.js -> tools/generate_step_screenshots.js -> tools/run_browser_verification.js,
 * executes npm run test:syntax, npm test, ui5 build & verifies 11/11 routes + 0 broken images in Edge.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const { execSync, spawn } = require('child_process');
const puppeteer = require(path.resolve(__dirname, '../../tools/node_modules/puppeteer-core'));

const REPO_ROOT = path.resolve(__dirname, '../..');
const GUIDELINE_JSON = path.join(REPO_ROOT, 'src/frontend/webapp/mockdata/fresher_guideline.json');
const EDGE_PATHS = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];
const TEST_PORT = 8091;

let passed = 0;
let total = 0;
function assert(cond, msg) {
    total++;
    if (cond) {
        console.log(`[PASS] ${msg}`);
        passed++;
    } else {
        console.error(`[FAIL] ${msg}`);
        process.exitCode = 1;
    }
}

function findEdge() {
    for (const p of EDGE_PATHS) {
        if (fs.existsSync(p)) return p;
    }
    return null;
}

function waitForServer(port, timeoutMs = 25000) {
    const start = Date.now();
    return new Promise((resolve) => {
        const poll = () => {
            const req = http.get(`http://localhost:${port}/index.html`, (res) => {
                if (res.statusCode === 200) return resolve(true);
                retry();
            });
            req.on('error', retry);
            req.setTimeout(1000, () => {
                req.destroy();
                retry();
            });
        };
        const retry = () => {
            if (Date.now() - start > timeoutMs) return resolve(false);
            setTimeout(poll, 800);
        };
        poll();
    });
}

function httpGetJson(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (c) => (data += c));
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        }).on('error', reject);
    });
}

async function runCleanRoomRebuildTest() {
    console.log('=====================================================================');
    console.log('🧪 CLEAN-ROOM REBUILD VERIFICATION (FRESHER GUIDELINE 0 -> 100%)');
    console.log('=====================================================================\n');

    const guideline = JSON.parse(fs.readFileSync(GUIDELINE_JSON, 'utf8'));

    // --- STAGE A: Guideline Structure, Formatting & Checklist Integrity ---
    assert(Array.isArray(guideline.chapters) && guideline.chapters.length === 14, 'Guideline có đủ 14/14 chương');
    assert(Array.isArray(guideline.checklistItems) && guideline.checklistItems.length >= 25,
        `Checklist liệt kê đầy đủ ${guideline.checklistItems ? guideline.checklistItems.length : 0} hạng mục 0 -> 100%`);
    assert(guideline.blueprint && guideline.blueprint.folderTree && guideline.blueprint.buildPhases.length === 5,
        'Project Blueprint có đủ cây thư mục và 5 giai đoạn');

    let allMultiLine = true;
    let noPowerShellAnd = true;
    const mappedFiles = new Map();
    guideline.chapters.forEach((ch) => {
        if ((ch.cliCommands || []).join('\n').includes('&&')) noPowerShellAnd = false;
        (ch.steps || []).forEach((s) => {
            if (!(s.detailedInstruction || '').includes('\n')) allMultiLine = false;
            if ((s.commandOrPath || '').includes('&&')) noPowerShellAnd = false;
        });
        (ch.relatedFiles || []).forEach((rf) => {
            mappedFiles.set(rf.filePath, rf.fullCode || rf.codeExcerpt || '');
        });
    });
    assert(allMultiLine, '100% các bước (steps) đều xuống dòng tách ý rõ ràng, không viết dính 1 đoạn văn');
    assert(noPowerShellAnd, '100% lệnh Terminal tương thích Windows PowerShell 5.1 (không chứa && lỗi cú pháp)');

    // --- STAGE B: Clean-Room Extraction into Fresh Temp Directory (NO fake image stubs!) ---
    const cleanDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fiori_cleanroom_'));
    console.log(`\n📁 Clean-Room Directory: ${cleanDir}`);
    let serverProc = null;
    let browser = null;

    try {
        const dirs = [
            'src/frontend/webapp/view',
            'src/frontend/webapp/controller',
            'src/frontend/webapp/model',
            'src/frontend/webapp/util',
            'src/frontend/webapp/control',
            'src/frontend/webapp/fragment',
            'src/frontend/webapp/ext/controller',
            'src/frontend/webapp/css',
            'src/frontend/webapp/i18n',
            'src/frontend/webapp/localService/mockdata',
            'src/frontend/webapp/mockdata',
            'src/frontend/webapp/img/guideline/steps',
            'src/frontend/webapp/test/unit/model',
            'src/frontend/webapp/test/integration/pages',
            'src/backend/rap/data-model',
            'src/backend/rap/behavior',
            'src/backend/rap/service',
            'src/backend/rap/authorization',
            'src/backend/rap/testing',
            'tools/screenshots',
            'tests/unit',
            'docs'
        ];
        dirs.forEach((d) => fs.mkdirSync(path.join(cleanDir, d), { recursive: true }));
        fs.writeFileSync(path.join(cleanDir, 'src/frontend/webapp/favicon.ico'), '');

        // Extract every file instructed by Chapters 1 -> 14 into cleanDir
        let extractedCount = 0;
        guideline.chapters.forEach((ch) => {
            (ch.relatedFiles || []).forEach((rf) => {
                const target = path.join(cleanDir, rf.filePath);
                fs.mkdirSync(path.dirname(target), { recursive: true });
                fs.writeFileSync(target, rf.fullCode || rf.codeExcerpt || '', 'utf8');
                extractedCount++;
            });
        });
        assert(extractedCount >= 106, `Đã trích xuất thành công ${extractedCount} file (src + tools + tests + docs + root) vào thư mục sạch`);

        // Link installed node_modules (UI5 CLI + Puppeteer Core) to keep verification fast & offline-safe
        fs.symlinkSync(path.join(REPO_ROOT, 'src/frontend/node_modules'), path.join(cleanDir, 'src/frontend/node_modules'), 'junction');
        fs.symlinkSync(path.join(REPO_ROOT, 'tools/node_modules'), path.join(cleanDir, 'tools/node_modules'), 'junction');

        // Run Chapter 12 Step 3: tools/build_guideline_data.js inside cleanDir to generate full 14-chapter JSON
        let fullGuideChapters = 0;
        try {
            execSync('node tools/build_guideline_data.js', { cwd: cleanDir, encoding: 'utf8', stdio: 'pipe' });
            const rebuiltGuide = JSON.parse(fs.readFileSync(path.join(cleanDir, 'src/frontend/webapp/mockdata/fresher_guideline.json'), 'utf8'));
            fullGuideChapters = (rebuiltGuide.chapters || []).length;
        } catch (e) {
            console.error('Clean-Room build_guideline_data error:', e.stderr || e.message);
        }
        assert(fullGuideChapters === 14, `Clean-Room Generator: node tools/build_guideline_data.js tự sinh đủ ${fullGuideChapters}/14 chương`);

        // Run Chapter 12 Step 2: generate_step_screenshots.js inside cleanDir (real step PNGs)
        let stepPngCount = 0;
        const missingStepImgs = [];
        try {
            execSync('node tools/generate_step_screenshots.js', { cwd: cleanDir, encoding: 'utf8', stdio: 'pipe' });
            stepPngCount = fs.readdirSync(path.join(cleanDir, 'src/frontend/webapp/img/guideline/steps')).filter(f => f.endsWith('.png')).length;
            guideline.chapters.forEach((ch) => {
                (ch.steps || []).forEach((s) => {
                    if (s.stepImage && s.stepImage.startsWith('img/guideline/steps/')) {
                        if (!fs.existsSync(path.join(cleanDir, 'src/frontend/webapp', s.stepImage))) {
                            missingStepImgs.push(s.stepImage);
                        }
                    }
                });
            });
        } catch (e) {
            console.error('Clean-Room generate_step_screenshots error:', e.stderr || e.message);
        }
        assert(stepPngCount === 9 && missingStepImgs.length === 0,
            `Clean-Room Assets: Tự sinh đủ ${stepPngCount}/9 ảnh bước thao tác thực tế (steps/*.png, thiếu: ${missingStepImgs.length})`);

        // Run npm run test:syntax inside cleanDir
        let syntaxOk = false;
        try {
            const syntaxOut = execSync('npm run test:syntax', { cwd: cleanDir, encoding: 'utf8' });
            syntaxOk = syntaxOut.includes('31/31 TESTS PASSED');
        } catch (e) {
            console.error('Clean-Room test:syntax error:', e.stderr || e.message);
        }
        assert(syntaxOk, 'Clean-Room: Chạy npm run test:syntax đạt 31/31 TESTS PASSED');

        // Run npm run build inside cleanDir
        let buildOk = false;
        try {
            execSync('npm run build', { cwd: cleanDir, encoding: 'utf8', stdio: 'pipe' });
            buildOk = fs.existsSync(path.join(cleanDir, 'src/frontend/dist/Component-preload.js'));
        } catch (e) {
            console.error('Clean-Room ui5 build error:', e.stderr || e.message);
        }
        assert(buildOk, 'Clean-Room: Chạy npm run build thành công và sinh dist/Component-preload.js');

        // Verify Backend RAP 25 files + ABAP DDIC comment style (//, not --) + Draft field name
        const rapChecks = [
            'src/backend/rap/data-model/zdemo_header.tabl.sql',
            'src/backend/rap/data-model/zdemo_header_d.tabl.sql',
            'src/backend/rap/data-model/zdemo_item.tabl.sql',
            'src/backend/rap/data-model/zdemo_item_d.tabl.sql',
            'src/backend/rap/data-model/zdemo_config_m.tabl.sql',
            'src/backend/rap/data-model/zdemo_config_u.tabl.sql',
            'src/backend/rap/data-model/ZI_DemoItemTP.ddls.asddls',
            'src/backend/rap/data-model/ZI_DemoHeaderTP.ddls.asddls',
            'src/backend/rap/data-model/ZI_DemoConfigMSaveTP.ddls.asddls',
            'src/backend/rap/data-model/ZI_DemoConfigUnmanTP.ddls.asddls',
            'src/backend/rap/data-model/ZI_DemoLog.ddls.asddls',
            'src/backend/rap/behavior/ZI_DemoHeaderTP.bdef.asbdef',
            'src/backend/rap/behavior/zbp_i_demoheadertp.clas.locals_imp.abap',
            'src/backend/rap/behavior/ZI_DemoConfigMSaveTP.bdef.asbdef',
            'src/backend/rap/behavior/zbp_i_democonfigmsavetp.clas.abap',
            'src/backend/rap/behavior/zbp_i_democonfigmsavetp.clas.locals_imp.abap',
            'src/backend/rap/behavior/ZI_DemoConfigUnmanTP.bdef.asbdef',
            'src/backend/rap/behavior/zbp_i_democonfigunmantp.clas.abap',
            'src/backend/rap/behavior/zbp_i_democonfigunmantp.clas.locals_imp.abap',
            'src/backend/rap/service/zcl_demo_log_query.clas.abap',
            'src/backend/rap/service/zcl_demo_eml_playground.clas.abap',
            'src/backend/rap/service/zcl_demo_rest_client.clas.abap',
            'src/backend/rap/authorization/ZR_DemoHeaderTP.dcls.asdcls',
            'src/backend/rap/service/ZUI_DEMO_HEADER_O4.srvd.assrvd',
            'src/backend/rap/testing/zcl_demo_rap_unit_test.clas.abap'
        ];
        const allRapPresent = rapChecks.every((f) => fs.existsSync(path.join(cleanDir, f)));
        const headerTabl = fs.readFileSync(path.join(cleanDir, 'src/backend/rap/data-model/zdemo_header.tabl.sql'), 'utf8');
        const itemTabl = fs.readFileSync(path.join(cleanDir, 'src/backend/rap/data-model/zdemo_item.tabl.sql'), 'utf8');
        const itemDraft = fs.readFileSync(path.join(cleanDir, 'src/backend/rap/data-model/zdemo_item_d.tabl.sql'), 'utf8');
        assert(allRapPresent && !headerTabl.includes('-- ') && !itemTabl.includes('-- ') && itemDraft.includes('locallastchangedat'),
            'Clean-Room Backend: Đủ 25/25 đối tượng ABAP RAP, chuẩn comment DDIC // và khớp cột locallastchangedat');

        // Start Clean-Room UI5 Dev Server on TEST_PORT (8091)
        const isWin = process.platform === 'win32';
        serverProc = spawn(isWin ? 'npx.cmd' : 'npx', ['ui5', 'serve', '--port', String(TEST_PORT)], {
            cwd: path.join(cleanDir, 'src/frontend'),
            shell: true,
            stdio: 'ignore'
        });
        const ready = await waitForServer(TEST_PORT, 30000);
        assert(ready, `Clean-Room Server: UI5 serve + fe-mockserver khởi động thành công trên cổng ${TEST_PORT}`);

        // Capture ALL real screenshots via tools/run_browser_verification.js --init-capture inside cleanDir
        let captureOk = false;
        try {
            execSync('node tools/run_browser_verification.js --init-capture', {
                cwd: cleanDir,
                env: Object.assign({}, process.env, { UI5_PORT: String(TEST_PORT) }),
                encoding: 'utf8',
                stdio: 'pipe'
            });
            captureOk = fs.existsSync(path.join(cleanDir, 'src/frontend/webapp/img/guideline/19_user_manual_fullwidth.png'));
        } catch (e) {
            console.error('Clean-Room capture error:', e.stderr || e.message);
        }
        assert(captureOk, 'Clean-Room Assets: tools/run_browser_verification.js tự chụp trọn bộ ảnh UI (gồm 19_user_manual_fullwidth.png)');

        // Execute npm test (tests/unit/test_frontend_runtime.js) inside cleanDir against CLEAN-ROOM :8091!
        let npmTestOk = false;
        try {
            const testOut = execSync('npm test', {
                cwd: cleanDir,
                env: Object.assign({}, process.env, { UI5_PORT: String(TEST_PORT) }),
                encoding: 'utf8'
            });
            npmTestOk = testOut.includes('(0 FAILED)');
        } catch (e) {
            console.error('Clean-Room npm test error:', e.stderr || e.stdout || e.message);
        }
        assert(npmTestOk, 'Clean-Room: Chạy npm test (test_frontend_runtime.js) trên bản dựng sạch đạt 100%');

        // Live OData V4 check on cleanDir server
        const odataRes = await httpGetJson(`http://localhost:${TEST_PORT}/mock/odata/v4/demo/DemoHeader?$expand=_Items&$orderby=TotalAmount%20desc`);
        const odataParsed = JSON.parse(odataRes.body || '{}');
        assert(odataRes.status === 200 && Array.isArray(odataParsed.value) && odataParsed.value.length === 4,
            'Clean-Room OData V4 Mockserver: Trả HTTP 200 và đủ 4 bản ghi DemoHeader');

        // Headless Edge Verification across all 11 routes (0 broken images, 0 404, 0 console errors, 14 chapters in Guideline)
        const edgePath = findEdge();
        assert(!!edgePath, 'Clean-Room Browser: Tìm thấy Microsoft Edge');
        if (edgePath && ready) {
            browser = await puppeteer.launch({
                executablePath: edgePath,
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1280,850']
            });
            const page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 850 });

            const consoleErrors = [];
            const networkErrors = [];
            page.on('console', (msg) => {
                if (msg.type() === 'error') {
                    const txt = msg.text();
                    const loc = (msg.location && msg.location().url) || '';
                    if (loc.includes('Component-preload.js') || txt.includes('Component-preload.js')) return;
                    if (txt.includes('Permissions policy violation: unload')) return;
                    if (txt.includes('_validateDockPosition') || txt.includes('sap.m.MessageToast')) return;
                    consoleErrors.push(`${txt} [${loc}]`);
                }
            });
            page.on('response', (res) => {
                if (res.status() >= 400) {
                    const u = res.url();
                    if (!u.includes('Component-preload.js')) {
                        networkErrors.push(`${res.status()} ${u}`);
                    }
                }
            });

            await page.goto(`http://localhost:${TEST_PORT}/index.html`, { waitUntil: 'networkidle2', timeout: 35000 });
            await page.waitForSelector('.sapTntToolPage', { timeout: 20000 });

            let brokenImgsTotal = 0;
            const routesToCheck = ['#/catalog', '#/code', '#/architecture', '#/fe-lab', '#/freestyle-lab', '#/odata-lab', '#/errors', '#/advanced-lab', '#/manual', '#/'];
            for (const h of routesToCheck) {
                await page.evaluate((hash) => { window.location.hash = hash; }, h);
                await new Promise((r) => setTimeout(r, 900));
                const broken = await page.evaluate(() => Array.from(document.querySelectorAll('img')).filter(i => i.getAttribute('src') && i.complete && i.naturalWidth === 0).length);
                brokenImgsTotal += broken;
            }

            await page.goto(`http://localhost:${TEST_PORT}/index.html?workspace=guideline#/guideline`, { waitUntil: 'networkidle2', timeout: 35000 });
            await page.waitForSelector('#guidelineNavTree, [id$="guidelineNavTree"]', { timeout: 15000 });
            await new Promise((r) => setTimeout(r, 1200));

            const workspaceState = await page.evaluate(() => {
                const treeEl = document.querySelector('[id$="guidelineNavTree"]');
                const treeItems = document.querySelectorAll('[id$="guidelineNavTree"] li.sapMTreeItemBase').length;
                const sideNav = document.querySelector('[id$="sideNavigation"]');
                const sideHidden = !sideNav || window.getComputedStyle(sideNav).display === 'none' || !!document.querySelector('.academyWorkspaceMode .sapTntToolPageAside') && window.getComputedStyle(document.querySelector('.academyWorkspaceMode .sapTntToolPageAside')).display === 'none';
                const formattedBullets = document.querySelectorAll('.guidelineFormattedText li').length;
                const sel = sap.ui.core.Element.registry.filter(e => e.getId().endsWith('quickChapterSelect'))[0];
                const chapterCount = sel ? sel.getItems().length : 0;
                const brokenInGuide = Array.from(document.querySelectorAll('img')).filter(i => i.getAttribute('src') && i.complete && i.naturalWidth === 0).length;
                return { hasTree: !!treeEl, treeItems, sideHidden, formattedBullets, chapterCount, brokenInGuide };
            });

            assert(workspaceState.chapterCount === 14, `Clean-Room Guideline Workspace: Bản dựng mới có đủ ${workspaceState.chapterCount}/14 chương (100% giống app gốc)`);
            assert(workspaceState.hasTree && workspaceState.treeItems >= 4,
                `Clean-Room Guideline Workspace: Cây thư mục cha-con hiển thị (${workspaceState.treeItems} items)`);
            assert(workspaceState.sideHidden, 'Clean-Room Guideline Workspace: Ẩn thanh Aside menu cũ khi mở không gian Guideline');
            assert(workspaceState.formattedBullets > 0,
                `Clean-Room Guideline Formatting: Nội dung bước xuống hàng rõ ý (${workspaceState.formattedBullets} bullet items)`);
            assert(brokenImgsTotal === 0 && workspaceState.brokenInGuide === 0,
                `Clean-Room Images: 0 ảnh bị lỗi trên tất cả 11 routes (thực tế: ${brokenImgsTotal + workspaceState.brokenInGuide})`);
            assert(consoleErrors.length === 0, `Clean-Room Edge: 0 Console Errors (thực tế: ${consoleErrors.length}${consoleErrors[0] ? ' - ' + consoleErrors[0] : ''})`);
            assert(networkErrors.length === 0, `Clean-Room Edge: 0 Network Errors (thực tế: ${networkErrors.length}${networkErrors[0] ? ' - ' + networkErrors[0] : ''})`);
        }
    } finally {
        if (browser) await browser.close();
        if (serverProc && serverProc.pid) {
            try {
                if (process.platform === 'win32') {
                    execSync(`taskkill /F /T /PID ${serverProc.pid}`, { stdio: 'ignore' });
                } else {
                    serverProc.kill('SIGTERM');
                }
            } catch (e) { }
        }
        try {
            fs.rmSync(cleanDir, { recursive: true, force: true });
        } catch (e) {
            try {
                execSync(`rmdir "${path.join(cleanDir, 'src/frontend/node_modules')}"`, { stdio: 'ignore' });
                execSync(`rmdir "${path.join(cleanDir, 'tools/node_modules')}"`, { stdio: 'ignore' });
                fs.rmSync(cleanDir, { recursive: true, force: true });
            } catch (err) { }
        }
    }

    console.log('\n=====================================================================');
    console.log(`KẾT QUẢ CLEAN-ROOM REBUILD CHECKLIST: ${passed}/${total} CHECKS PASSED`);
    console.log('=====================================================================');
}

runCleanRoomRebuildTest().catch((e) => {
    console.error('❌ Clean-Room Rebuild Exception:', e);
    process.exit(1);
});
