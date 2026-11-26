const puppeteer = require('./node_modules/puppeteer-core');
const path = require('path');

(async () => {
    console.log("=== Bắt đầu chụp ảnh kiểm chứng Giao Diện Fresher Guideline Nâng Cấp ===");
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        headless: 'new',
        defaultViewport: { width: 1440, height: 1100 }
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:8085/index.html#/guideline', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));

    // Mở Panel Bộ công cụ nền tảng & phím tắt
    await page.evaluate(() => {
        const panels = Array.from(document.querySelectorAll('.sapMPanelExpandable'));
        const toolPanel = panels.find(p => (p.innerText || '').includes('Bộ Công Cụ Nền Tảng'));
        if (toolPanel) {
            const btn = toolPanel.querySelector('.sapMPanelExpandableIcon');
            if (btn) btn.click();
        }
    });
    await new Promise(r => setTimeout(r, 800));

    const shot1 = path.resolve(__dirname, 'screenshots/26_guideline_step_by_step_enhanced.png');
    await page.screenshot({ path: shot1, fullPage: false });
    console.log("📸 Đã lưu ảnh kiểm chứng giao diện mới:", shot1);

    // Chuyển sang Chương 9 (ABAP RAP Backend)
    await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('.sapMITBItem'));
        const chap9Tab = tabs.find(t => (t.innerText || '').includes('9. RAP Data Model') || (t.innerText || '').includes('Chương 9'));
        if (chap9Tab) chap9Tab.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    const shot2 = path.resolve(__dirname, 'screenshots/27_guideline_chap9_eclipse_steps.png');
    await page.screenshot({ path: shot2, fullPage: false });
    console.log("📸 Đã lưu ảnh kiểm chứng Chương 9 (Eclipse ADT Steps):", shot2);

    await browser.close();
    console.log("=== Kiểm thử hoàn tất thành công! ===");
})();

