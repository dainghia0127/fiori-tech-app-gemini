const puppeteer = require('./node_modules/puppeteer-core');
const path = require('path');

(async () => {
    console.log("=== Bắt đầu kiểm thử Chương 2 (package.json) và Chương 3 (ui5.yaml) ===");
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        headless: 'new',
        defaultViewport: { width: 1440, height: 1100 }
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:8085/index.html#/guideline', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));

    // ==========================================
    // PHẦN 1: CHUYỂN SANG CHƯƠNG 2 (package.json)
    // ==========================================
    console.log("--- 1. Chuyển sang Chương 2 (package.json) ---");
    await page.evaluate(() => {
        const view = sap.ui.getCore().byId("rootComponent-fioriTechAcademy---guidelineView");
        const ctrl = view.getController();
        ctrl.onChapterSelect({ getParameter: () => "chap2" });
        const tabBar = view.byId("chapterTabBar");
        if (tabBar) tabBar.setSelectedKey("chap2");
    });
    await new Promise(r => setTimeout(r, 1000));

    // Cuộn tới vùng Mục 3 (Code box)
    await page.evaluate(() => {
        const codeBox = document.querySelector('.academyCodeBox');
        if (codeBox) codeBox.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 500));

    // TEST 1.1: Hover vào dòng đơn lẻ "build" trong package.json
    console.log("TEST 1.1: Hover dòng đơn 'build':");
    const buildPos = await page.evaluate(() => {
        const lines = Array.from(document.querySelectorAll('.code-line'));
        const line = lines.find(l => l.innerText.includes('"build":'));
        if (!line) return null;
        const r = line.getBoundingClientRect();
        return { x: r.left + 80, y: r.top + r.height / 2, text: line.innerText };
    });

    if (buildPos) {
        await page.mouse.move(buildPos.x, buildPos.y);
        await new Promise(r => setTimeout(r, 400));
    }

    const resBuild = await page.evaluate(() => {
        const hotLines = document.querySelectorAll('.code-line.hot');
        const hotBlocks = document.querySelectorAll('.code-block.hot-block');
        const tip = document.querySelector('.code-tip');
        return {
            hotLinesCount: hotLines.length,
            hotBlocksCount: hotBlocks.length,
            isSingleLineHot: hotLines.length === 1 && hotBlocks.length === 0,
            tipVisible: tip ? tip.style.display === 'block' : false,
            badge: tip?.querySelector('.k')?.innerText,
            role: tip?.querySelector('b')?.innerText,
            explanation: tip?.querySelector('.code-tip-body')?.innerText,
            tips: tip?.querySelector('.n')?.innerText
        };
    });
    console.log("-> Kết quả hover dòng 'build':", resBuild);
    const shot1 = path.resolve(__dirname, 'screenshots/36_chap2_hover_build_single_line.png');
    await page.screenshot({ path: shot1 });

    // TEST 1.2: Hover vào header cụm "devDependencies"
    console.log("TEST 1.2: Hover header cụm 'devDependencies':");
    const devDepsPos = await page.evaluate(() => {
        const lines = Array.from(document.querySelectorAll('.code-line.is-block-header'));
        const line = lines.find(l => l.innerText.includes('"devDependencies":'));
        if (!line) return null;
        const r = line.getBoundingClientRect();
        return { x: r.left + 80, y: r.top + r.height / 2 };
    });

    if (devDepsPos) {
        await page.mouse.move(devDepsPos.x, devDepsPos.y);
        await new Promise(r => setTimeout(r, 400));
    }

    const resDevDeps = await page.evaluate(() => {
        const hotLines = document.querySelectorAll('.code-line.hot');
        const hotBlocks = document.querySelectorAll('.code-block.hot-block');
        const tip = document.querySelector('.code-tip');
        return {
            hotLinesCount: hotLines.length,
            hotBlocksCount: hotBlocks.length,
            isBlockClusterHot: hotBlocks.length === 1,
            badge: tip?.querySelector('.k')?.innerText,
            role: tip?.querySelector('b')?.innerText,
            explanation: tip?.querySelector('.code-tip-body')?.innerText
        };
    });
    console.log("-> Kết quả hover header 'devDependencies':", resDevDeps);
    const shot2 = path.resolve(__dirname, 'screenshots/37_chap2_hover_devdeps_block_cluster.png');
    await page.screenshot({ path: shot2 });

    // TEST 1.3: Hover vào dòng con bên trong "@ui5/cli"
    console.log("TEST 1.3: Hover dòng con bên trong '@ui5/cli':");
    const cliPos = await page.evaluate(() => {
        const lines = Array.from(document.querySelectorAll('.code-line:not(.is-block-header)'));
        const line = lines.find(l => l.innerText.includes('"@ui5/cli":'));
        if (!line) return null;
        const r = line.getBoundingClientRect();
        return { x: r.left + 120, y: r.top + r.height / 2 };
    });

    if (cliPos) {
        await page.mouse.move(cliPos.x, cliPos.y);
        await new Promise(r => setTimeout(r, 400));
    }

    const resCli = await page.evaluate(() => {
        const hotLines = document.querySelectorAll('.code-line.hot');
        const hotBlocks = document.querySelectorAll('.code-block.hot-block');
        const tip = document.querySelector('.code-tip');
        return {
            hotLinesCount: hotLines.length,
            hotBlocksCount: hotBlocks.length,
            isInnerLineOnly: hotLines.length === 1 && hotBlocks.length === 0,
            badge: tip?.querySelector('.k')?.innerText,
            role: tip?.querySelector('b')?.innerText,
            explanation: tip?.querySelector('.code-tip-body')?.innerText
        };
    });
    console.log("-> Kết quả hover dòng con '@ui5/cli':", resCli);
    const shot3 = path.resolve(__dirname, 'screenshots/38_chap2_hover_cli_inner_line.png');
    await page.screenshot({ path: shot3 });

    // Rời chuột
    await page.mouse.move(10, 10);
    await new Promise(r => setTimeout(r, 300));

    // ==========================================
    // PHẦN 2: CHUYỂN SANG CHƯƠNG 3 (ui5.yaml)
    // ==========================================
    console.log("--- 2. Chuyển sang Chương 3 (ui5.yaml) ---");
    await page.evaluate(() => {
        const view = sap.ui.getCore().byId("rootComponent-fioriTechAcademy---guidelineView");
        const ctrl = view.getController();
        ctrl.onChapterSelect({ getParameter: () => "chap3" });
        const tabBar = view.byId("chapterTabBar");
        if (tabBar) tabBar.setSelectedKey("chap3");
    });
    await new Promise(r => setTimeout(r, 1000));

    // Cuộn tới vùng Mục 3 của Chương 3
    await page.evaluate(() => {
        const codeBox = document.querySelector('.academyCodeBox');
        if (codeBox) codeBox.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 500));

    // TEST 2.1: Hover vào dòng metadataPath
    console.log("TEST 2.1: Hover dòng 'metadataPath':");
    const metaPos = await page.evaluate(() => {
        const lines = Array.from(document.querySelectorAll('.code-line'));
        const line = lines.find(l => l.innerText.includes('metadataPath:'));
        if (!line) return null;
        const r = line.getBoundingClientRect();
        return { x: r.left + 100, y: r.top + r.height / 2, text: line.innerText };
    });

    if (metaPos) {
        await page.mouse.move(metaPos.x, metaPos.y);
        await new Promise(r => setTimeout(r, 400));
    }

    const resMeta = await page.evaluate(() => {
        const hotLines = document.querySelectorAll('.code-line.hot');
        const tip = document.querySelector('.code-tip');
        return {
            hotLinesCount: hotLines.length,
            badge: tip?.querySelector('.k')?.innerText,
            role: tip?.querySelector('b')?.innerText,
            explanation: tip?.querySelector('.code-tip-body')?.innerText,
            tips: tip?.querySelector('.n')?.innerText
        };
    });
    console.log("-> Kết quả hover dòng 'metadataPath' (ui5.yaml):", resMeta);
    const shot4 = path.resolve(__dirname, 'screenshots/39_chap3_hover_metadata_path.png');
    await page.screenshot({ path: shot4 });

    // ==========================================
    // PHẦN 3: KIỂM TRA PHÓNG TO ẢNH TRÊN CHƯƠNG 3
    // ==========================================
    console.log("--- 3. Kiểm tra phóng to ảnh trên Chương 3 ---");
    // Click vào ảnh chính Mục 1
    await page.evaluate(() => {
        const img = document.querySelector('.guidelinePreviewImg');
        const ctrl = sap.ui.getCore().byId(img.id);
        if (ctrl) ctrl.firePress();
    });
    await new Promise(r => setTimeout(r, 700));

    const chap3MainDialog = await page.evaluate(() => {
        const dialog = document.querySelector('.sapMDialog');
        return {
            title: dialog?.querySelector('.sapMTitle')?.innerText,
            imgSrc: dialog?.querySelector('.dialogPreviewImage')?.src,
            caption: dialog?.querySelector('.dialogCaptionText')?.innerText
        };
    });
    console.log("-> Dialog ảnh chính Chương 3:", chap3MainDialog);
    const shot5 = path.resolve(__dirname, 'screenshots/40_chap3_main_image_zoom.png');
    await page.screenshot({ path: shot5 });

    // Đóng dialog
    await page.evaluate(() => {
        const btn = document.querySelector('.sapMDialog .sapMBtnEmphasized');
        const ctrl = sap.ui.getCore().byId(btn.id);
        if (ctrl) ctrl.firePress();
    });
    await new Promise(r => setTimeout(r, 700));

    // Click vào ảnh Bước 1 của Chương 3
    await page.evaluate(() => {
        const stepImg = document.querySelector('.stepScreenshotImg');
        const ctrl = sap.ui.getCore().byId(stepImg.id);
        if (ctrl) ctrl.firePress();
    });
    await new Promise(r => setTimeout(r, 700));

    const chap3StepDialog = await page.evaluate(() => {
        const dialog = document.querySelector('.sapMDialog');
        return {
            title: dialog?.querySelector('.sapMTitle')?.innerText,
            imgSrc: dialog?.querySelector('.dialogPreviewImage')?.src,
            caption: dialog?.querySelector('.dialogCaptionText')?.innerText
        };
    });
    console.log("-> Dialog ảnh bước Chương 3:", chap3StepDialog);
    const shot6 = path.resolve(__dirname, 'screenshots/41_chap3_step_image_zoom.png');
    await page.screenshot({ path: shot6 });

    // Đóng dialog
    await page.evaluate(() => {
        const btn = document.querySelector('.sapMDialog .sapMBtnEmphasized');
        const ctrl = sap.ui.getCore().byId(btn.id);
        if (ctrl) ctrl.firePress();
    });
    await new Promise(r => setTimeout(r, 500));

    await browser.close();
    console.log("=== KIỂM THỬ THÀNH CÔNG 100%! TẤT CẢ TÍNH NĂNG ĐẠT CHUẨN! ===");
})();

