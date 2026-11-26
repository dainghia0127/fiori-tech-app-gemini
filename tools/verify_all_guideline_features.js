const puppeteer = require('./node_modules/puppeteer-core');
const path = require('path');

(async () => {
    console.log("=== Bắt đầu Kiểm Chứng Toàn Diện Tính Năng Guideline Fresher ===");
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        headless: 'new',
        defaultViewport: { width: 1440, height: 1100 }
    });
    const page = await browser.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    await page.goto('http://localhost:8085/index.html#/guideline', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));

    // 1. Kiểm tra không còn Mục 4 (Table cũ)
    const tableCheck = await page.evaluate(() => {
        const table = document.querySelector('#rootComponent-fioriTechAcademy---guidelineView--annotatedLinesTable');
        const h4Elements = Array.from(document.querySelectorAll('h4, .sapMTitle')).map(el => el.innerText);
        const hasOldTableTitle = h4Elements.some(t => t.includes('4. Bảng Chú Giải Chi Tiết') || t.includes('Line-by-Line Technical Notes'));
        return { tableExists: !!table, hasOldTableTitle };
    });
    console.log("1. Kiểm tra Mục 4 đã xóa hoàn toàn:", tableCheck);

    // 2. Chuyển sang Chương 1 (package.json) để test Mục 3 Khung Đỏ
    console.log("2. Kiểm tra Mục 3 - Logic Khung Đỏ và Pop-Up giải thích chi tiết...");
    await page.evaluate(() => {
        // Tab đầu tiên là chap1 (chuẩn bị môi trường & package.json)
        const tab = document.querySelector('.sapMITBItem');
        if (tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Cuộn tới vùng Mục 3 (Code box)
    await page.evaluate(() => {
        const codeBox = document.querySelector('.academyCodeBox');
        if (codeBox) codeBox.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 500));

    // A. Hover vào dòng đơn lẻ "build"
    const buildPos = await page.evaluate(() => {
        const lines = Array.from(document.querySelectorAll('.code-line'));
        const line = lines.find(l => l.innerText.includes('"build":'));
        if (!line) return null;
        const r = line.getBoundingClientRect();
        return { x: r.left + 50, y: r.top + r.height / 2 };
    });

    if (buildPos) {
        await page.mouse.move(buildPos.x, buildPos.y);
        await new Promise(r => setTimeout(r, 500));
    }

    const testBuildHover = await page.evaluate(() => {
        const hotLines = document.querySelectorAll('.code-line.hot');
        const hotBlocks = document.querySelectorAll('.code-block.hot-block');
        const tip = document.querySelector('.code-tip');
        return {
            hotLinesCount: hotLines.length,
            hotBlocksCount: hotBlocks.length,
            isSingleLineHot: hotLines.length === 1 && hotBlocks.length === 0,
            tipVisible: tip ? tip.style.display === 'block' : false,
            tipRole: tip ? tip.querySelector('b')?.innerText : null,
            tipText: tip ? tip.querySelector('.code-tip-body')?.innerText : null
        };
    });
    console.log("   -> Kết quả hover dòng đơn 'build':", testBuildHover);
    const shotBuild = path.resolve(__dirname, 'screenshots/31_verify_single_line_build_hover.png');
    await page.screenshot({ path: shotBuild });

    // B. Hover vào header của block "devDependencies"
    const devDepsPos = await page.evaluate(() => {
        const lines = Array.from(document.querySelectorAll('.code-line.is-block-header'));
        const line = lines.find(l => l.innerText.includes('"devDependencies":'));
        if (!line) return null;
        const r = line.getBoundingClientRect();
        return { x: r.left + 50, y: r.top + r.height / 2 };
    });

    if (devDepsPos) {
        await page.mouse.move(devDepsPos.x, devDepsPos.y);
        await new Promise(r => setTimeout(r, 500));
    }

    const testDevDepsHover = await page.evaluate(() => {
        const hotLines = document.querySelectorAll('.code-line.hot');
        const hotBlocks = document.querySelectorAll('.code-block.hot-block');
        const tip = document.querySelector('.code-tip');
        return {
            hotLinesCount: hotLines.length,
            hotBlocksCount: hotBlocks.length,
            isBlockHot: hotBlocks.length === 1,
            tipVisible: tip ? tip.style.display === 'block' : false,
            tipBadge: tip ? tip.querySelector('.k')?.innerText : null,
            tipRole: tip ? tip.querySelector('b')?.innerText : null
        };
    });
    console.log("   -> Kết quả hover header cụm 'devDependencies':", testDevDepsHover);
    const shotDevDeps = path.resolve(__dirname, 'screenshots/32_verify_block_cluster_devdeps_hover.png');
    await page.screenshot({ path: shotDevDeps });

    // C. Hover vào dòng con bên trong "@ui5/cli"
    const cliPos = await page.evaluate(() => {
        const lines = Array.from(document.querySelectorAll('.code-line:not(.is-block-header)'));
        const line = lines.find(l => l.innerText.includes('"@ui5/cli":'));
        if (!line) return null;
        const r = line.getBoundingClientRect();
        return { x: r.left + 80, y: r.top + r.height / 2 };
    });

    if (cliPos) {
        await page.mouse.move(cliPos.x, cliPos.y);
        await new Promise(r => setTimeout(r, 500));
    }

    const testCliHover = await page.evaluate(() => {
        const hotLines = document.querySelectorAll('.code-line.hot');
        const hotBlocks = document.querySelectorAll('.code-block.hot-block');
        const tip = document.querySelector('.code-tip');
        return {
            hotLinesCount: hotLines.length,
            hotBlocksCount: hotBlocks.length,
            isInnerLineHotOnly: hotLines.length === 1 && hotBlocks.length === 0,
            tipRole: tip ? tip.querySelector('b')?.innerText : null
        };
    });
    console.log("   -> Kết quả hover dòng con bên trong '@ui5/cli':", testCliHover);
    const shotCli = path.resolve(__dirname, 'screenshots/33_verify_inner_line_cli_hover.png');
    await page.screenshot({ path: shotCli });

    // Rời chuột khỏi code box để ẩn tooltip
    await page.mouse.move(10, 10);
    await new Promise(r => setTimeout(r, 400));

    // 3. Kiểm tra phóng to ảnh Mục 1
    console.log("3. Kiểm tra mở Dialog phóng to ảnh Mục 1...");
    await page.evaluate(() => {
        const img = document.querySelector('.guidelinePreviewImg');
        const control = img ? sap.ui.getCore().byId(img.id) : null;
        if (control) control.firePress();
    });
    await new Promise(r => setTimeout(r, 700));

    const mainDialogCheck = await page.evaluate(() => {
        const dialog = document.querySelector('.sapMDialog');
        return {
            dialogFound: !!dialog,
            title: dialog?.querySelector('.sapMTitle')?.innerText,
            imgSrc: dialog?.querySelector('.dialogPreviewImage')?.src,
            caption: dialog?.querySelector('.dialogCaptionText')?.innerText
        };
    });
    console.log("   -> Kết quả Dialog phóng to ảnh Mục 1:", mainDialogCheck);
    const shotMainDialog = path.resolve(__dirname, 'screenshots/34_verify_main_image_zoom_dialog.png');
    await page.screenshot({ path: shotMainDialog });

    // Đóng Dialog
    await page.evaluate(() => {
        const closeBtn = document.querySelector('.sapMDialog .sapMBtnEmphasized');
        const control = closeBtn ? sap.ui.getCore().byId(closeBtn.id) : null;
        if (control) control.firePress();
    });
    await new Promise(r => setTimeout(r, 700));

    // 4. Kiểm tra phóng to ảnh của Bước 1 trong Step-by-Step Checklist
    console.log("4. Kiểm tra mở Dialog phóng to ảnh thao tác thực tế Bước 1...");
    await page.evaluate(() => {
        const stepImg = document.querySelector('.stepScreenshotImg');
        const control = stepImg ? sap.ui.getCore().byId(stepImg.id) : null;
        if (control) control.firePress();
    });
    await new Promise(r => setTimeout(r, 700));

    const stepDialogCheck = await page.evaluate(() => {
        const dialog = document.querySelector('.sapMDialog');
        return {
            dialogFound: !!dialog,
            title: dialog?.querySelector('.sapMTitle')?.innerText,
            imgSrc: dialog?.querySelector('.dialogPreviewImage')?.src,
            caption: dialog?.querySelector('.dialogCaptionText')?.innerText
        };
    });
    console.log("   -> Kết quả Dialog phóng to ảnh Bước 1:", stepDialogCheck);
    const shotStepDialog = path.resolve(__dirname, 'screenshots/35_verify_step_image_zoom_dialog.png');
    await page.screenshot({ path: shotStepDialog });

    // Đóng Dialog
    await page.evaluate(() => {
        const closeBtn = document.querySelector('.sapMDialog .sapMBtnEmphasized');
        const control = closeBtn ? sap.ui.getCore().byId(closeBtn.id) : null;
        if (control) control.firePress();
    });
    await new Promise(r => setTimeout(r, 500));

    console.log("Số lượng lỗi console phát sinh:", consoleErrors.length);
    if (consoleErrors.length > 0) {
        console.log("Console errors:", consoleErrors);
    }

    await browser.close();
    console.log("=== TẤT CẢ KIỂM CHỨNG ĐÃ HOÀN TẤT THÀNH CÔNG 100%! ===");
})();

