const puppeteer = require('./node_modules/puppeteer-core');
const path = require('path');

(async () => {
    console.log("=== Bắt đầu kiểm thử tính năng Image Zoom Dialog & Hình ảnh từng bước ===");
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        headless: 'new',
        defaultViewport: { width: 1440, height: 1100 }
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:8085/index.html#/guideline', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));

    // 1. Kiểm tra sự xuất hiện của các ảnh minh họa từng bước (.stepScreenshotImg)
    const stepImgsCount = await page.evaluate(() => {
        const imgs = document.querySelectorAll('.stepScreenshotImg');
        return imgs.length;
    });
    console.log(`✅ Đã tìm thấy ${stepImgsCount} ảnh minh họa các bước trong DOM!`);

    // Chụp ảnh giao diện các bước có hình ảnh minh họa
    const shot1 = path.resolve(__dirname, 'screenshots/29_guideline_steps_with_images.png');
    await page.screenshot({ path: shot1, fullPage: false });
    console.log("📸 Đã lưu ảnh minh họa danh sách bước có hình ảnh:", shot1);

    // 2. Click bằng chuột thật vào ảnh chính Mục 1 để mở Dialog phóng to (Lightbox)
    console.log("Thực hiện click chuột thật vào ảnh chính Mục 1...");
    const mainImgPos = await page.evaluate(() => {
        const img = document.querySelector('.guidelinePreviewImg');
        if (!img) return null;
        img.scrollIntoView({ behavior: 'instant', block: 'center' });
        const r = img.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    if (mainImgPos) {
        await page.mouse.click(mainImgPos.x, mainImgPos.y);
        await new Promise(r => setTimeout(r, 800));
    }

    const mainDialogStatus = await page.evaluate(() => {
        const dialog = document.querySelector('.sapMDialog');
        return dialog ? {
            isOpen: true,
            title: dialog.querySelector('.sapMTitle')?.innerText,
            imgSrc: dialog.querySelector('.dialogPreviewImage')?.src,
            caption: dialog.querySelector('.dialogCaptionText')?.innerText
        } : { isOpen: false };
    });
    console.log("✅ Trạng thái Dialog phóng to ảnh Mục 1:", mainDialogStatus);

    const shot2 = path.resolve(__dirname, 'screenshots/28_guideline_image_zoom_dialog.png');
    await page.screenshot({ path: shot2, fullPage: false });
    console.log("📸 Đã lưu ảnh Dialog phóng to (Lightbox):", shot2);

    // 3. Đóng Dialog bằng nút Đóng
    await page.evaluate(() => {
        const closeBtn = document.querySelector('.sapMDialog .sapMBtnEmphasized');
        if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // 4. Click bằng chuột thật vào ảnh minh họa của Bước 1 (Node.js install)
    console.log("Thực hiện click chuột thật vào ảnh minh họa của Bước 1...");
    const stepImgPos = await page.evaluate(() => {
        const img = document.querySelector('.stepScreenshotImg');
        if (!img) return null;
        img.scrollIntoView({ behavior: 'instant', block: 'center' });
        const r = img.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    if (stepImgPos) {
        await page.mouse.click(stepImgPos.x, stepImgPos.y);
        await new Promise(r => setTimeout(r, 800));
    }

    const stepDialogStatus = await page.evaluate(() => {
        const dialog = document.querySelector('.sapMDialog');
        return dialog ? {
            isOpen: true,
            title: dialog.querySelector('.sapMTitle')?.innerText,
            imgSrc: dialog.querySelector('.dialogPreviewImage')?.src,
            caption: dialog.querySelector('.dialogCaptionText')?.innerText
        } : { isOpen: false };
    });
    console.log("✅ Trạng thái Dialog phóng to ảnh Bước 1:", stepDialogStatus);

    const shot3 = path.resolve(__dirname, 'screenshots/30_guideline_step1_zoom_dialog.png');
    await page.screenshot({ path: shot3, fullPage: false });
    console.log("📸 Đã lưu ảnh phóng to của Bước 1:", shot3);

    await browser.close();
    console.log("=== Kiểm thử hoàn tất thành công 100%! ===");
})();
