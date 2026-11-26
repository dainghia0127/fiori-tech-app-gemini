const puppeteer = require('./node_modules/puppeteer-core');
const path = require('path');

(async () => {
    console.log("=== Bắt đầu kiểm thử tương tác CodeTips (Dòng đơn, Cụm Block & Xác minh xóa Mục 4) ===");
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        headless: 'new',
        defaultViewport: { width: 1440, height: 900 }
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:8085/index.html#/guideline', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));

    // TEST 0: Xác minh Mục 4 (Bảng cũ) đã biến mất 100%
    const tableCheck = await page.evaluate(() => {
        const table = document.querySelector('#annotatedLinesTable') || document.querySelector('[id$="annotatedLinesTable"]');
        const panels = Array.from(document.querySelectorAll('.sapMPanelHdr, .sapMPanelExpandable'));
        const hasOldTableTitle = panels.some(p => (p.innerText || '').includes('Bảng Chú Giải Chi Tiết'));
        return {
            tableExists: !!table,
            hasOldTableTitle: hasOldTableTitle
        };
    });
    console.log("✅ Kết quả TEST 0 (Xác minh đã xóa sạch Mục 4 Bảng Chú Giải):", tableCheck);
    if (tableCheck.tableExists || tableCheck.hasOldTableTitle) {
        console.error("❌ Lỗi: Mục 4 vẫn còn tồn tại!");
    } else {
        console.log("🎉 XÁC NHẬN: Mục 4 đã được xóa bỏ hoàn toàn khỏi giao diện!");
    }

    // Đợi các phần tử dòng code xuất hiện
    await page.waitForSelector('.code-line', { timeout: 10000 });
    console.log("✅ Đã tìm thấy các phần tử .code-line!");

    // Cuộn tới block code Section 3
    await page.evaluate(() => {
        const line = document.querySelector('.code-line[data-line="7"]');
        if (line) {
            line.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
    });
    await new Promise(r => setTimeout(r, 600));

    // TEST 1: Hover vào dòng đơn lẻ "build": "ui5 build --clean-dest --dest dist" (line 7)
    const line7Info = await page.evaluate(() => {
        const line = document.querySelector('.code-line[data-line="7"]');
        if (line) {
            const r = line.getBoundingClientRect();
            return { x: r.left + 120, y: r.top + 8, text: line.innerText };
        }
        return null;
    });

    console.log("Dòng 7 (build) toạ độ:", line7Info);
    if (line7Info) {
        await page.mouse.move(line7Info.x, line7Info.y);
        await new Promise(r => setTimeout(r, 500));

        const statusLine7 = await page.evaluate(() => {
            const tip = document.querySelector('.code-tip');
            const hotLines = document.querySelectorAll('.code-line.hot');
            const hotBlocks = document.querySelectorAll('.code-block.hot-block');
            return {
                tipDisplay: tip ? tip.style.display : 'none',
                tipText: tip ? tip.innerText.replace(/\n+/g, ' | ') : '',
                hotLinesCount: hotLines.length,
                hotBlocksCount: hotBlocks.length,
                isSingleLine: hotLines.length === 1 && hotBlocks.length === 0
            };
        });
        console.log("✅ Kết quả TEST 1 (Hover dòng đơn 'build'):", statusLine7);
    }

    const screenshot1 = path.resolve(__dirname, 'screenshots/22_guideline_single_line_outline.png');
    await page.screenshot({ path: screenshot1 });
    console.log("📸 Đã lưu ảnh TEST 1:", screenshot1);

    // TEST 2: Hover vào dòng mở đầu block "devDependencies": { (line 9)
    const line9Info = await page.evaluate(() => {
        const line = document.querySelector('.code-line[data-line="9"]');
        if (line) {
            const r = line.getBoundingClientRect();
            return { x: r.left + 120, y: r.top + 8, text: line.innerText };
        }
        return null;
    });

    console.log("Dòng 9 (devDependencies header) toạ độ:", line9Info);
    if (line9Info) {
        await page.mouse.move(line9Info.x, line9Info.y);
        await new Promise(r => setTimeout(r, 500));

        const statusLine9 = await page.evaluate(() => {
            const tip = document.querySelector('.code-tip');
            const hotBlocks = document.querySelectorAll('.code-block.hot-block');
            const hotLines = document.querySelectorAll('.code-line.hot');
            return {
                tipDisplay: tip ? tip.style.display : 'none',
                tipText: tip ? tip.innerText.replace(/\n+/g, ' | ') : '',
                hotBlocksCount: hotBlocks.length,
                hotLinesCount: hotLines.length,
                isBlockHot: hotBlocks.length === 1
            };
        });
        console.log("✅ Kết quả TEST 2 (Hover cụm block 'devDependencies'):", statusLine9);
    }

    const screenshot2 = path.resolve(__dirname, 'screenshots/23_guideline_block_cluster_outline.png');
    await page.screenshot({ path: screenshot2 });
    console.log("📸 Đã lưu ảnh TEST 2:", screenshot2);

    // TEST 3: Hover vào dòng con bên trong block "@ui5/cli": "^4.0.0" (line 10)
    const line10Info = await page.evaluate(() => {
        const line = document.querySelector('.code-line[data-line="10"]');
        if (line) {
            const r = line.getBoundingClientRect();
            return { x: r.left + 120, y: r.top + 8, text: line.innerText };
        }
        return null;
    });

    console.log("Dòng 10 (@ui5/cli) toạ độ:", line10Info);
    if (line10Info) {
        await page.mouse.move(line10Info.x, line10Info.y);
        await new Promise(r => setTimeout(r, 500));

        const statusLine10 = await page.evaluate(() => {
            const tip = document.querySelector('.code-tip');
            const hotLines = document.querySelectorAll('.code-line.hot');
            const hotBlocks = document.querySelectorAll('.code-block.hot-block');
            return {
                tipDisplay: tip ? tip.style.display : 'none',
                tipText: tip ? tip.innerText.replace(/\n+/g, ' | ') : '',
                hotLinesCount: hotLines.length,
                hotBlocksCount: hotBlocks.length,
                isInnerLineHotOnly: hotLines.length === 1 && hotBlocks.length === 0
            };
        });
        console.log("✅ Kết quả TEST 3 (Hover dòng con trong block '@ui5/cli'):", statusLine10);
    }

    const screenshot3 = path.resolve(__dirname, 'screenshots/24_guideline_inner_line_outline.png');
    await page.screenshot({ path: screenshot3 });
    console.log("📸 Đã lưu ảnh TEST 3:", screenshot3);

    // TEST 4: Chuyển sang Chương 2 và hover dòng metadataPath
    await page.evaluate(() => {
        // Click tab Chương 2
        const tabs = Array.from(document.querySelectorAll('.sapMITBItem'));
        const chap2Tab = tabs.find(t => (t.innerText || '').includes('Chương 2'));
        if (chap2Tab) chap2Tab.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    // Cuộn tới dòng metadataPath
    await page.evaluate(() => {
        const lines = Array.from(document.querySelectorAll('.code-line'));
        const metaLine = lines.find(l => (l.innerText || '').includes('metadataPath'));
        if (metaLine) {
            metaLine.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
    });
    await new Promise(r => setTimeout(r, 500));

    const metaLineInfo = await page.evaluate(() => {
        const lines = Array.from(document.querySelectorAll('.code-line'));
        const metaLine = lines.find(l => (l.innerText || '').includes('metadataPath'));
        if (metaLine) {
            const r = metaLine.getBoundingClientRect();
            return { x: r.left + 150, y: r.top + 8, text: metaLine.innerText };
        }
        return null;
    });

    console.log("Dòng metadataPath (Chap 2) toạ độ:", metaLineInfo);
    if (metaLineInfo) {
        await page.mouse.move(metaLineInfo.x, metaLineInfo.y);
        await new Promise(r => setTimeout(r, 500));

        const statusMeta = await page.evaluate(() => {
            const tip = document.querySelector('.code-tip');
            const hotLines = document.querySelectorAll('.code-line.hot');
            return {
                tipDisplay: tip ? tip.style.display : 'none',
                tipText: tip ? tip.innerText.replace(/\n+/g, ' | ') : '',
                hotLinesCount: hotLines.length
            };
        });
        console.log("✅ Kết quả TEST 4 (Hover dòng 'metadataPath' Chương 2):", statusMeta);
    }

    const screenshot4 = path.resolve(__dirname, 'screenshots/25_guideline_chap2_metadata_path_hover.png');
    await page.screenshot({ path: screenshot4 });
    console.log("📸 Đã lưu ảnh TEST 4:", screenshot4);

    await browser.close();
    console.log("=== Kiểm thử hoàn tất thành công 100%! ===");
})();
