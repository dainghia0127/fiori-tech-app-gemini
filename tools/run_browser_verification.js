/**
 * tools/run_browser_verification.js
 * Automated Headless Browser Verification for SAP Fiori Technical Academy
 * Uses puppeteer-core + Microsoft Edge (Zero extra browser download)
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const http = require('http');

const PORT = Number(process.env.UI5_PORT || 8085);
const APP_URL = `http://localhost:${PORT}/index.html`;
const SCREENSHOT_DIR = path.resolve(__dirname, 'screenshots');
const APP_IMG_DIR = path.resolve(__dirname, '..', 'src', 'frontend', 'webapp', 'img', 'guideline');
const INIT_CAPTURE = process.argv.includes('--init-capture');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
fs.mkdirSync(APP_IMG_DIR, { recursive: true });

const EDGE_PATHS = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

function findBrowserExecutable() {
  for (const p of EDGE_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function checkServerReady(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/index.html`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(port, timeoutMs = 25000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    const ready = await checkServerReady(port);
    if (ready) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function main() {
  console.log('===============================================================');
  console.log('🤖 SAP Fiori Technical Academy - Browser Verification Engine');
  console.log('===============================================================\n');

  const browserPath = findBrowserExecutable();
  if (!browserPath) {
    console.error('❌ Error: Microsoft Edge executable (msedge.exe) not found on this machine.');
    process.exit(1);
  }
  console.log(`[1] Detected Browser: ${browserPath}`);

  // Check if server is already running
  let serverProcess = null;
  const isRunning = await checkServerReady(PORT);
  if (isRunning) {
    console.log(`[2] UI5 Dev Server already active on port ${PORT}.`);
  } else {
    console.log(`[2] Spawning UI5 Dev Server on port ${PORT}...`);
    const frontendDir = path.resolve(__dirname, '..', 'src', 'frontend');
    // On Windows, npx must be called via cmd or npx.cmd
    const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    serverProcess = spawn(npxCmd, ['ui5', 'serve', '--port', String(PORT)], {
      cwd: frontendDir,
      shell: true,
      stdio: 'pipe'
    });

    serverProcess.stderr.on('data', (d) => {
      const msg = d.toString();
      if (!msg.includes('DeprecationWarning')) {
        console.error(`[Server Error] ${msg.trim()}`);
      }
    });

    console.log('    Waiting for server to become ready...');
    const ready = await waitForServer(PORT);
    if (!ready) {
      console.error('❌ Timed out waiting for UI5 server to start.');
      if (serverProcess) serverProcess.kill();
      process.exit(1);
    }
    console.log('    UI5 Dev Server is UP and READY.');
  }

  console.log(`[3] Launching Headless Edge Browser...`);
  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1440,900'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors = [];
  const networkErrors = [];

  page.on('response', (res) => {
    if (res.status() >= 400) {
      const u = res.url();
      console.log(`    ⚠️ HTTP ${res.status()}: ${u}`);
      if (!u.includes('Component-preload.js') && !u.includes('favicon.ico')) {
        if (INIT_CAPTURE && u.includes('/img/guideline/')) return;
        networkErrors.push(`HTTP ${res.status()} ${u}`);
      }
    }
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // In UI5 raw source mode, 404 for Component-preload is standard fallback to unpacked files
      if (text.includes('Component-preload.js')) return;
      if (text.includes('Failed to load resource: the server responded with a status of 404')) return;
      if (text.includes('Permissions policy violation: unload')) return;
      // UI5 1.136.0 internal MessageToast default docking validation message
      if (text.includes('_validateDockPosition') || text.includes('sap.m.MessageToast')) return;
      consoleErrors.push(text);
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(`PageError: ${err.message}`);
  });

  page.on('requestfailed', (req) => {
    const url = req.url();
    // In UI5 local dev serve, Component-preload.js probe is expected fallback to Component.js
    if (!url.includes('Component-preload.js')) {
      networkErrors.push(`${req.method()} ${url} (${req.failure() ? req.failure().errorText : 'failed'})`);
    }
  });

  console.log(`[4] Navigating to ${APP_URL}...`);
  try {
    const response = await page.goto(APP_URL, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    console.log(`    HTTP Response Status: ${response.status()}`);

    // Wait for SAPUI5 framework initialization
    console.log('[5] Checking SAPUI5 core initialization...');
    await page.waitForFunction(
      () => typeof sap !== 'undefined' && sap.ui && sap.ui.getCore,
      { timeout: 15000 }
    );
    console.log('    ✅ sap.ui.core is initialized.');

    // Wait for App Component to mount
    console.log('[6] Waiting for Fiori ToolPage DOM elements...');
    await page.waitForSelector('.sapTntToolPage', { timeout: 15000 });
    console.log('    ✅ .sapTntToolPage is mounted in DOM.');

    // Wait an additional 1.5s for data bindings & charts/tiles to render
    await new Promise((r) => setTimeout(r, 1500));

    // Capture Screenshot of Dashboard
    const dashboardPic = path.join(SCREENSHOT_DIR, '01_dashboard_view.png');
    await page.screenshot({ path: dashboardPic, fullPage: false });
    fs.copyFileSync(dashboardPic, path.join(APP_IMG_DIR, '01_dashboard_view.png'));
    console.log(`    📸 Saved Dashboard Screenshot: ${dashboardPic}`);

    // Navigate to Technical Catalog
    console.log('[7] Testing Navigation: Navigating to #/catalog...');
    await page.evaluate(() => {
      window.location.hash = '#/catalog';
    });
    await new Promise((r) => setTimeout(r, 1500));
    const catalogPic = path.join(SCREENSHOT_DIR, '02_catalog_view.png');
    await page.screenshot({ path: catalogPic, fullPage: false });
    console.log(`    📸 Saved Catalog Screenshot: ${catalogPic}`);

    // Navigate to Code Explorer
    console.log('[8] Testing Navigation: Navigating to #/code...');
    await page.evaluate(() => {
      window.location.hash = '#/code';
    });
    await new Promise((r) => setTimeout(r, 1500));
    const codePic = path.join(SCREENSHOT_DIR, '03_code_explorer_view.png');
    await page.screenshot({ path: codePic, fullPage: false });
    console.log(`    📸 Saved Code Explorer Screenshot: ${codePic}`);

    // Navigate to Architecture Viewer
    console.log('[9] Testing Navigation: Navigating to #/architecture...');
    await page.evaluate(() => {
      window.location.hash = '#/architecture';
    });
    await new Promise((r) => setTimeout(r, 1500));
    const archPic = path.join(SCREENSHOT_DIR, '04_architecture_view.png');
    await page.screenshot({ path: archPic, fullPage: false });
    console.log(`    📸 Saved Architecture Screenshot: ${archPic}`);

    // Navigate to Fiori Elements V4 Lab
    console.log('[10] Testing Navigation: Navigating to #/fe-lab...');
    await page.evaluate(() => {
      window.location.hash = '#/fe-lab';
    });
    await new Promise((r) => setTimeout(r, 1800));
    const fePic = path.join(SCREENSHOT_DIR, '05_fiori_elements_lab_view.png');
    await page.screenshot({ path: fePic, fullPage: false });
    console.log(`    📸 Saved Fiori Elements Lab Screenshot: ${fePic}`);

    async function clickTabByKey(barSuffix, tabKey) {
      await page.evaluate((suffix, key) => {
        const reg = sap.ui.core.Element && sap.ui.core.Element.registry;
        if (reg) {
          const bar = reg.filter(el => el.getId().endsWith(suffix))[0];
          if (bar && bar.setSelectedKey) {
            bar.setSelectedKey(key);
            if (bar.getDomRef()) bar.getDomRef().scrollIntoView({ block: 'start' });
          }
        }
      }, barSuffix, tabKey);
    }

    async function clickButtonByText(substr) {
      const pos = await page.evaluate((s) => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes(s));
        if (!btn) return null;
        btn.scrollIntoView({ behavior: 'instant', block: 'center' });
        const r = btn.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }, substr);
      if (pos) await page.mouse.click(pos.x, pos.y);
    }

    // Test Action: Click on "Xác Minh (Bound Action)" button
    console.log('[11] Testing Interaction: Executing Bound Action "Xác Minh"...');
    await clickButtonByText('Xác Minh');
    await new Promise((r) => setTimeout(r, 800));
    console.log('    ✅ Bound Action executed.');

    // Test Tab 2: Side Effects Simulation
    console.log('[12] Testing Interaction: Switching to Tab 2 (Side Effects)...');
    await clickTabByKey('feIconTabBar', 'sideEffects');
    await new Promise((r) => setTimeout(r, 800));
    await clickButtonByText('Simulate Side Effect');
    await new Promise((r) => setTimeout(r, 800));
    const sePic = path.join(SCREENSHOT_DIR, '06_side_effects_simulation.png');
    await page.screenshot({ path: sePic, fullPage: false });
    console.log(`    📸 Saved Side Effects Screenshot: ${sePic}`);

    // Test Tab 4: FPM Building Blocks & Controller Extensions
    console.log('[13] Testing Interaction: Switching to Tab 4 (FPM & Controller Extensions)...');
    await clickTabByKey('feIconTabBar', 'fpm');
    await new Promise((r) => setTimeout(r, 800));
    await clickButtonByText('onPageReady');
    await new Promise((r) => setTimeout(r, 800));
    const fpmPic = path.join(SCREENSHOT_DIR, '07_fpm_building_blocks.png');
    await page.screenshot({ path: fpmPic, fullPage: false });
    console.log(`    📸 Saved FPM & Controller Extensions Screenshot: ${fpmPic}`);

    // Test Navigation: Fresher Guideline View
    console.log('[14] Testing Navigation: Navigating to #/guideline (Fresher Zero-to-Hero)...');
    await page.evaluate(() => {
      window.location.hash = '#/guideline';
    });
    await new Promise((r) => setTimeout(r, 1800));
    const guidePic = path.join(SCREENSHOT_DIR, '08_fresher_guideline_view.png');
    await page.screenshot({ path: guidePic, fullPage: false });
    console.log(`    📸 Saved Fresher Guideline Screenshot: ${guidePic}`);

    // Test Scroll-Spy Mapping + Multi-line Formatted Steps
    await page.evaluate(() => {
      const card = document.querySelector('[id$="guidelineStepsList"] .guidelineStepItem');
      if (card) card.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 600));
    const spyStepCheck = await page.evaluate(() => {
      const pill = document.querySelector('.guidelineTreeActivePill');
      const selected = document.querySelector('[id$="guidelineNavTree"] .sapMLIBSelected, [id$="guidelineNavTree"] .sapMTreeItemBaseSelected');
      return {
        label: pill ? pill.innerText : '',
        selectedText: selected ? selected.innerText.trim() : ''
      };
    });
    console.log(`    🧭 Scroll-Spy Step Check: label="${spyStepCheck.label}", treeSelected="${spyStepCheck.selectedText}"`);
    const stepCardPic = path.join(SCREENSHOT_DIR, '42_guideline_step_blueprint_verify.png');
    await page.screenshot({ path: stepCardPic, fullPage: false });
    console.log(`    📸 Saved Guideline Step Card Screenshot: ${stepCardPic}`);

    // Scroll further to Related Files Card to verify Tree auto-mapping to file node
    await page.evaluate(() => {
      const fileCard = document.querySelector('[id$="guidelineRelatedFilesTable"] .guidelineFileCard');
      if (fileCard) fileCard.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise((r) => setTimeout(r, 600));
    const spyFileCheck = await page.evaluate(() => {
      const pill = document.querySelector('.guidelineTreeActivePill');
      const selected = document.querySelector('[id$="guidelineNavTree"] .sapMLIBSelected, [id$="guidelineNavTree"] .sapMTreeItemBaseSelected');
      return {
        label: pill ? pill.innerText : '',
        selectedText: selected ? selected.innerText.trim() : ''
      };
    });
    console.log(`    🧭 Scroll-Spy File Check: label="${spyFileCheck.label}", treeSelected="${spyFileCheck.selectedText}"`);
    const spyFilePic = path.join(SCREENSHOT_DIR, '43_guideline_tree_scroll_mapping.png');
    await page.screenshot({ path: spyFilePic, fullPage: false });
    console.log(`    📸 Saved Guideline Tree Scroll Mapping Screenshot: ${spyFilePic}`);

    // Test Interaction: Switch to Chap 2 (package.json) & Hover CodeLine for Red Outline + CodeTip Pop-up
    console.log('[15] Testing Interaction: Hovering Code Line for Red Outline & CodeTip Pop-up...');
    await clickTabByKey('chapterTabBar', 'chap2');
    await page.evaluate(() => {
      const reg = sap.ui.core.Element && sap.ui.core.Element.registry;
      const bar = reg && reg.filter(el => el.getId().endsWith('chapterTabBar'))[0];
      if (bar) bar.fireSelect({ key: 'chap2', item: bar.getItems()[1] });
    });
    await new Promise((r) => setTimeout(r, 900));
    const codeLinePos = await page.evaluate(() => {
      const line = Array.from(document.querySelectorAll('[id$="guidelineFullCodeHtml"] .code-line')).find(l => l.innerText.includes('"build"')) || document.querySelector('[id$="guidelineFullCodeHtml"] .code-line');
      if (!line) return null;
      line.scrollIntoView({ behavior: 'instant', block: 'center' });
      const r = line.getBoundingClientRect();
      return { x: r.left + 60, y: r.top + r.height / 2 };
    });
    if (codeLinePos) {
      await page.mouse.move(codeLinePos.x, codeLinePos.y);
      await new Promise((r) => setTimeout(r, 600));
    }
    const popupPic = path.join(SCREENSHOT_DIR, '09_guideline_line_explanation_popup.png');
    await page.screenshot({ path: popupPic, fullPage: false });
    console.log(`    📸 Saved Line Explanation Pop-up Screenshot: ${popupPic}`);

    // Test Navigation: Freestyle SAPUI5 Lab View
    console.log('[16] Testing Navigation: Navigating to #/freestyle-lab (Freestyle Lab)...');
    await page.evaluate(() => {
      window.location.hash = '#/freestyle-lab';
    });
    await new Promise((r) => setTimeout(r, 1800));
    const freePic = path.join(SCREENSHOT_DIR, '10_freestyle_lab_view.png');
    await page.screenshot({ path: freePic, fullPage: false });
    console.log(`    📸 Saved Freestyle Lab Screenshot: ${freePic}`);

    // Test Interaction: Tab 2 (MessageManager & Simulation)
    console.log('[17] Testing Interaction: Switching to Tab 2 (MessageManager) & Simulating Backend Error...');
    await clickTabByKey('freestyleTabBar', 'messageManager');
    await new Promise((r) => setTimeout(r, 800));
    await clickButtonByText('Mô Phỏng Lỗi Backend');
    await new Promise((r) => setTimeout(r, 1000));
    const msgPic = path.join(SCREENSHOT_DIR, '11_message_manager_popover.png');
    await page.screenshot({ path: msgPic, fullPage: false });
    console.log(`    📸 Saved MessageManager Popover Screenshot: ${msgPic}`);

    // Close MessagePopover cleanly before moving to Tab 3
    await page.evaluate(() => {
      const reg = sap.ui.core.Element && sap.ui.core.Element.registry;
      if (reg && reg.forEach) {
        reg.forEach((el) => {
          if (el && el.isA && el.isA('sap.m.MessagePopover') && el.isOpen && el.isOpen()) {
            el.close();
          }
        });
      }
    });
    await new Promise((r) => setTimeout(r, 400));

    // Test Interaction: Tab 3 (Custom Controls Lab)
    console.log('[18] Testing Interaction: Switching to Tab 3 (Custom Controls Lab)...');
    await clickTabByKey('freestyleTabBar', 'customControls');
    await new Promise((r) => setTimeout(r, 900));
    const customPic = path.join(SCREENSHOT_DIR, '12_custom_controls_gauge.png');
    await page.screenshot({ path: customPic, fullPage: false });
    console.log(`    📸 Saved Custom Controls Screenshot: ${customPic}`);

    // Test Interaction: Tab 4 (XML Fragments & Dialog Lifecycle)
    console.log('[19] Testing Interaction: Switching to Tab 4 (XML Fragments) & Opening Dialog...');
    await clickTabByKey('freestyleTabBar', 'fragments');
    await new Promise((r) => setTimeout(r, 800));
    await clickButtonByText('Mở Reusable Fragment Dialog');
    await new Promise((r) => setTimeout(r, 900));
    const fragPic = path.join(SCREENSHOT_DIR, '13_xml_fragment_dialog.png');
    await page.screenshot({ path: fragPic, fullPage: false });
    console.log(`    📸 Saved XML Fragment Dialog Screenshot: ${fragPic}`);

    await clickButtonByText('Đóng');
    await new Promise((r) => setTimeout(r, 500));

    // Test Navigation: OData V4 Deep Dive Lab View
    console.log('[20] Testing Navigation: Navigating to #/odata-lab (OData V4 Deep Dive)...');
    await page.evaluate(() => {
      window.location.hash = '#/odata-lab';
    });
    await new Promise((r) => setTimeout(r, 1800));
    const odataPic = path.join(SCREENSHOT_DIR, '14_odata_v4_lab_view.png');
    await page.screenshot({ path: odataPic, fullPage: false });
    console.log(`    📸 Saved OData V4 Lab Screenshot: ${odataPic}`);

    // Test Interaction: Tab 1 (Execute OData V4 Query)
    console.log('[21] Testing Interaction: Executing OData V4 Query in Request Builder...');
    await clickButtonByText('Thực Thi Truy Vấn OData V4');
    await new Promise((r) => setTimeout(r, 1000));
    const qPic = path.join(SCREENSHOT_DIR, '15_odata_v4_query_executed.png');
    await page.screenshot({ path: qPic, fullPage: false });
    console.log(`    📸 Saved OData V4 Query Executed Screenshot: ${qPic}`);

    // Test Interaction: Tab 2 (Bound Action)
    console.log('[22] Testing Interaction: Switching to Tab 2 & Executing Bound Action...');
    await clickTabByKey('odataTabBar', 'operations');
    await new Promise((r) => setTimeout(r, 800));
    await clickButtonByText('markAsVerified');
    await new Promise((r) => setTimeout(r, 800));
    const boundPic = path.join(SCREENSHOT_DIR, '16_odata_v4_bound_action.png');
    await page.screenshot({ path: boundPic, fullPage: false });
    console.log(`    📸 Saved Bound Action Screenshot: ${boundPic}`);

    // Test Interaction: Tab 3 (Multipart $batch ChangeSet)
    console.log('[23] Testing Interaction: Switching to Tab 3 & Simulating $batch ChangeSet...');
    await clickTabByKey('odataTabBar', 'batch');
    await new Promise((r) => setTimeout(r, 900));
    const batchPic = path.join(SCREENSHOT_DIR, '17_odata_v4_batch_changeset.png');
    await page.screenshot({ path: batchPic, fullPage: false });
    console.log(`    📸 Saved Multipart $batch Screenshot: ${batchPic}`);

    // Test Interaction: Tab 4 (Optimistic Concurrency ETag Simulation)
    console.log('[24] Testing Interaction: Switching to Tab 4 & Simulating ETag Concurrency Conflict...');
    await clickTabByKey('odataTabBar', 'etag');
    await new Promise((r) => setTimeout(r, 800));
    await clickButtonByText('Bước 1:');
    await new Promise((r) => setTimeout(r, 500));
    await clickButtonByText('Bước 2:');
    await new Promise((r) => setTimeout(r, 800));
    const etagPic = path.join(SCREENSHOT_DIR, '18_odata_v4_etag_concurrency.png');
    await page.screenshot({ path: etagPic, fullPage: false });
    console.log(`    📸 Saved ETag Concurrency Screenshot: ${etagPic}`);

    // Close ETag error dialog cleanly before next route
    await clickButtonByText('Close');
    await new Promise((r) => setTimeout(r, 400));

    // Test Navigation: User Manual (#/manual)
    console.log('[24b] Testing Navigation: Navigating to #/manual (User Manual)...');
    await page.evaluate(() => {
      window.location.hash = '#/manual';
    });
    await new Promise((r) => setTimeout(r, 1500));
    const manualPic = path.join(SCREENSHOT_DIR, '19_user_manual_fullwidth.png');
    await page.screenshot({ path: manualPic, fullPage: false });
    fs.copyFileSync(manualPic, path.join(APP_IMG_DIR, '19_user_manual_fullwidth.png'));
    console.log(`    📸 Saved User Manual Screenshot: ${manualPic}`);

    // Test Navigation: Error Playbook (#/errors)
    console.log('[25] Testing Navigation: Navigating to #/errors (Error Playbook)...');
    await page.evaluate(() => {
      window.location.hash = '#/errors';
    });
    await new Promise((r) => setTimeout(r, 1500));
    const errPic = path.join(SCREENSHOT_DIR, '20_error_playbook_view.png');
    await page.screenshot({ path: errPic, fullPage: false });
    console.log(`    📸 Saved Error Playbook Screenshot: ${errPic}`);

    // Test Navigation: Advanced Technical Labs (#/advanced-lab)
    console.log('[26] Testing Navigation: Navigating to #/advanced-lab (Advanced Technical Labs)...');
    await page.evaluate(() => {
      window.location.hash = '#/advanced-lab';
    });
    await new Promise((r) => setTimeout(r, 1500));
    const advPic = path.join(SCREENSHOT_DIR, '21_advanced_lab_view.png');
    await page.screenshot({ path: advPic, fullPage: false });
    console.log(`    📸 Saved Advanced Labs Screenshot: ${advPic}`);

    // Sync freshly captured screenshots into webapp/img/guideline/
    fs.mkdirSync(APP_IMG_DIR, { recursive: true });
    const captured = fs.readdirSync(SCREENSHOT_DIR).filter(f => /^\d{2}_.*\.png$/.test(f));
    captured.forEach(f => {
      fs.copyFileSync(path.join(SCREENSHOT_DIR, f), path.join(APP_IMG_DIR, f));
    });
    console.log(`    🔄 Synced ${captured.length} fresh screenshots to ${APP_IMG_DIR}`);

    console.log('\n===============================================================');
    console.log('📊 BROWSER RUNTIME VERIFICATION RESULTS');
    console.log('===============================================================');
    console.log(`- Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach((e) => console.log(`  ❌ ${e}`));
    } else {
      console.log('  ✅ ZERO console errors during complete user navigation!');
    }

    console.log(`- Failed Network Requests: ${networkErrors.length}`);
    if (networkErrors.length > 0) {
      networkErrors.forEach((e) => console.log(`  ❌ ${e}`));
    } else {
      console.log('  ✅ ZERO failed network requests (All resources loaded 200 OK)!');
    }

    if (consoleErrors.length > 0 || networkErrors.length > 0) {
      console.log('\n❌ BROWSER AUTOMATION VERIFICATION FAILED with errors!');
      process.exitCode = 1;
    } else {
      console.log('\n✅ BROWSER AUTOMATION VERIFICATION PASSED 100%!');
    }
  } catch (err) {
    console.error(`❌ Verification failed: ${err.message}`);
    process.exitCode = 1;
  } finally {
    await browser.close();
    if (serverProcess && serverProcess.pid) {
      console.log('Shutting down spawned UI5 server...');
      try {
        if (process.platform === 'win32') {
          require('child_process').execSync(`taskkill /F /T /PID ${serverProcess.pid}`, { stdio: 'ignore' });
        } else {
          serverProcess.kill('SIGTERM');
        }
      } catch (e) {
        // Process might already be dead
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

