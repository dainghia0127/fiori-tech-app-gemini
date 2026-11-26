const puppeteer = require('./node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

const outputDir = path.resolve(__dirname, '../src/frontend/webapp/img/guideline/steps');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const mockups = [
    {
        filename: 'step_01_nodejs_install.png',
        title: 'Kiểm Tra Môi Trường Node.js & UI5 CLI',
        tag: 'Terminal PowerShell',
        html: `
        <div style="background:#0f172a; color:#f8fafc; font-family:'Cascadia Code',Consolas,monospace; padding:30px; border-radius:12px; height:100%; box-sizing:border-box; border:1px solid #334155;">
            <div style="display:flex; gap:8px; margin-bottom:20px;">
                <div style="width:12px; height:12px; border-radius:50%; background:#ef4444;"></div>
                <div style="width:12px; height:12px; border-radius:50%; background:#f59e0b;"></div>
                <div style="width:12px; height:12px; border-radius:50%; background:#10b981;"></div>
                <span style="color:#94a3b8; font-size:13px; margin-left:12px;">Windows PowerShell - Administrator</span>
            </div>
            <div style="font-size:15px; line-height:1.8;">
                <p><span style="color:#38bdf8;">PS C:\\Users\\Admin&gt;</span> <span style="color:#facc15;">node -v</span></p>
                <p style="color:#4ade80; margin-left:15px;">v22.18.0 (Active LTS)</p>
                <p><span style="color:#38bdf8;">PS C:\\Users\\Admin&gt;</span> <span style="color:#facc15;">npm -v</span></p>
                <p style="color:#4ade80; margin-left:15px;">10.8.2</p>
                <p><span style="color:#38bdf8;">PS C:\\Users\\Admin&gt;</span> <span style="color:#facc15;">npx @ui5/cli --version</span></p>
                <p style="color:#4ade80; margin-left:15px;">4.0.1 (UI5 Tooling Framework)</p>
                <p><span style="color:#38bdf8;">PS C:\\Users\\Admin&gt;</span> <span style="color:#facc15;">mkdir FIORI_TECH_APP; cd FIORI_TECH_APP</span></p>
                <p style="color:#94a3b8; margin-left:15px;">Thư mục dự án đã sẵn sàng: E:\\AI Code\\Gemini Code\\Fiori\\FIORI_TECH_APP</p>
                <p><span style="color:#38bdf8;">PS E:\\...\\FIORI_TECH_APP&gt;</span> <span class="cursor" style="border-left:2px solid #38bdf8; animation:blink 1s infinite;">&nbsp;</span></p>
            </div>
        </div>`
    },
    {
        filename: 'step_02_vscode_fiori_tools.png',
        title: 'Cài Đặt SAP Fiori Tools Extension Pack trong VS Code',
        tag: 'Visual Studio Code',
        html: `
        <div style="background:#1e1e1e; color:#cccccc; font-family:'Segoe UI',sans-serif; padding:25px; border-radius:12px; height:100%; box-sizing:border-box; border:1px solid #3c3c3c;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333333; padding-bottom:15px; margin-bottom:20px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <span style="font-size:24px;">🧩</span>
                    <div>
                        <div style="font-size:18px; font-weight:700; color:#ffffff;">SAP Fiori Tools - Extension Pack</div>
                        <div style="font-size:13px; color:#858585;">SAP SE | 380,000+ installs | ★★★★★</div>
                    </div>
                </div>
                <div style="background:#0e639c; color:#ffffff; padding:6px 16px; border-radius:4px; font-size:13px; font-weight:600;">Installed (Enabled)</div>
            </div>
            <div style="background:#252526; padding:16px; border-radius:8px; border-left:4px solid #007acc; margin-bottom:16px;">
                <div style="font-size:14px; font-weight:600; color:#ffffff; margin-bottom:6px;">Trọn bộ 5 công cụ chính thức từ SAP SE:</div>
                <ul style="margin:0; padding-left:20px; font-size:13.5px; line-height:1.7; color:#cccccc;">
                    <li><b>SAP Fiori tools - Application Generator:</b> Trình tạo wizard dự án SAPUI5 & Fiori Elements.</li>
                    <li><b>SAP Fiori tools - Guided Development:</b> Hướng dẫn từng bước thêm tính năng Fiori.</li>
                    <li><b>SAP Fiori tools - Service Modeler:</b> Quản lý OData Services và Annotations.</li>
                    <li><b>XML Tools:</b> Hỗ trợ format, kiểm tra cú pháp và tô màu XML Views.</li>
                </ul>
            </div>
            <div style="font-size:13px; color:#858585;">Phím tắt mở trình tạo Fiori: <code>Ctrl + Shift + P</code> &gt; <code>Fiori: Open Application Generator</code></div>
        </div>`
    },
    {
        filename: 'step_03_eclipse_adt_install.png',
        title: 'Cài Đặt ABAP Development Tools (ADT) trong Eclipse 2024',
        tag: 'Eclipse IDE 2024',
        html: `
        <div style="background:#2b2b2b; color:#dfdfdf; font-family:'Segoe UI',sans-serif; padding:25px; border-radius:12px; height:100%; box-sizing:border-box; border:1px solid #444444;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #444444; padding-bottom:12px; margin-bottom:18px;">
                <div style="font-size:16px; font-weight:700; color:#ffffff;">Install Available Software - Eclipse 2024</div>
                <span style="background:#3a3d41; padding:4px 10px; border-radius:4px; font-size:12px;">ADT Plugin 3.44+</span>
            </div>
            <div style="margin-bottom:16px;">
                <span style="font-size:13px; color:#999999;">Work with:</span>
                <div style="background:#1e1e1e; border:1px solid #555555; padding:8px 12px; border-radius:4px; color:#4fc1ff; font-family:monospace; margin-top:4px; font-size:13.5px;">
                    https://tools.hana.ondemand.com/latest
                </div>
            </div>
            <div style="background:#1e1e1e; border:1px solid #3c3c3c; border-radius:6px; padding:12px;">
                <div style="display:flex; align-items:center; gap:8px; padding:6px 0; border-bottom:1px solid #333333;">
                    <span style="color:#4ade80;">☑</span>
                    <span style="font-weight:600; color:#ffffff;">ABAP Development Tools</span>
                    <span style="color:#888888; font-size:12px; margin-left:auto;">Version 3.44.0</span>
                </div>
                <div style="margin-left:26px; font-size:12.5px; line-height:1.6; color:#aaaaaa; padding-top:6px;">
                    <div>• ABAP Core Development (Classes, Programs, Function Groups)</div>
                    <div>• ABAP Core Data Services Tooling (CDS View Entities, DDLS)</div>
                    <div>• ABAP RESTful Application Programming Model (RAP BDEF, BDO)</div>
                </div>
            </div>
            <div style="margin-top:16px; text-align:right;">
                <span style="background:#0e639c; color:#ffffff; padding:6px 20px; border-radius:4px; font-size:13px; font-weight:600;">Next &gt; | Finish (Restart Now)</span>
            </div>
        </div>`
    },
    {
        filename: 'step_04_sap_logon_connection.png',
        title: 'Cấu Hình Kết Nối SAP Logon & ABAP Cloud Project',
        tag: 'SAP Logon 8.00',
        html: `
        <div style="background:#f4f5f7; color:#1d2d3e; font-family:'72',sans-serif; padding:25px; border-radius:12px; height:100%; box-sizing:border-box; border:1px solid #d1d5db;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0a6ed1; padding-bottom:10px; margin-bottom:16px;">
                <div style="font-size:17px; font-weight:700; color:#0a6ed1;">SAP S/4HANA 2025 - Thông Tin Kết Nối Máy Chủ</div>
                <span style="background:#e8f4fd; color:#0a6ed1; padding:4px 10px; border-radius:12px; font-size:12px; font-weight:600;">Client 100</span>
            </div>
            <table style="width:100%; font-size:13.5px; border-collapse:collapse; margin-bottom:16px;">
                <tr style="border-bottom:1px solid #e5e7eb; height:34px;">
                    <td style="color:#64748b; width:160px;">Description:</td>
                    <td style="font-weight:600; color:#1e293b;">SAP S/4HANA 2025 (PQPOC)</td>
                </tr>
                <tr style="border-bottom:1px solid #e5e7eb; height:34px;">
                    <td style="color:#64748b;">Application Server:</td>
                    <td style="font-family:monospace; color:#0369a1; font-weight:600;">s4hana2025.corp.internal</td>
                </tr>
                <tr style="border-bottom:1px solid #e5e7eb; height:34px;">
                    <td style="color:#64748b;">System ID (SID) / Instance:</td>
                    <td style="font-weight:600;">PQP / 00</td>
                </tr>
                <tr style="border-bottom:1px solid #e5e7eb; height:34px;">
                    <td style="color:#64748b;">Developer User ID:</td>
                    <td style="font-weight:600; color:#047857;">NGS.NGHIANDD</td>
                </tr>
                <tr style="height:34px;">
                    <td style="color:#64748b;">Target Package / TR:</td>
                    <td style="font-weight:700; color:#b45309;">ZNGHIANDD_TEST / S4DK911884</td>
                </tr>
            </table>
            <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:10px 14px; font-size:12.5px; color:#065f46;">
                ℹ️ [Minh họa mô phỏng giao diện] Thông số cấu hình tham chiếu SAP S/4HANA PQPOC Client 100.
            </div>
        </div>`
    },
    {
        filename: 'step_06_fiori_generator_wizard.png',
        title: 'Màn Hình SAP Fiori Application Generator Wizard',
        tag: 'VS Code Wizard',
        html: `
        <div style="background:#252526; color:#dfdfdf; font-family:'Segoe UI',sans-serif; padding:25px; border-radius:12px; height:100%; box-sizing:border-box; border:1px solid #3c3c3c;">
            <div style="font-size:18px; font-weight:700; color:#ffffff; margin-bottom:15px; border-bottom:1px solid #383838; padding-bottom:10px;">
                SAP Fiori Application Generator - Step 1: Template Selection
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:18px;">
                <div style="background:#2d2d2d; border:2px solid #007acc; border-radius:8px; padding:14px;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                        <span style="background:#007acc; color:#fff; border-radius:4px; padding:2px 8px; font-size:11px; font-weight:700;">CHỌN MẪU NÀY</span>
                        <span style="font-weight:700; color:#ffffff;">SAPUI5 Freestyle</span>
                    </div>
                    <div style="font-size:12.5px; color:#aaaaaa; line-height:1.5;">Mẫu SAPUI5 Application: Tự do tùy biến MVC views, controllers, custom controls theo yêu cầu đặc thù.</div>
                </div>
                <div style="background:#2d2d2d; border:1px solid #444444; border-radius:8px; padding:14px;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                        <span style="background:#555555; color:#fff; border-radius:4px; padding:2px 8px; font-size:11px;">MẪU ODATA V4</span>
                        <span style="font-weight:700; color:#ffffff;">SAP Fiori Elements</span>
                    </div>
                    <div style="font-size:12.5px; color:#aaaaaa; line-height:1.5;">Mẫu List Report Page: Giao diện chuẩn OData V4 tự động sinh từ CDS View Annotations.</div>
                </div>
            </div>
            <div style="background:#1e1e1e; padding:12px 16px; border-radius:6px; font-size:12.5px; color:#9cdcfe;">
                <div>Project Name: <b>sap-fiori-technical-academy</b></div>
                <div>Namespace: <b>sap.fiori.tech.academy</b> | Min UI5 Version: <b>1.136.0 (Morning Horizon)</b></div>
            </div>
        </div>`
    },
    {
        filename: 'step_14_eclipse_db_table.png',
        title: 'Tạo Database Table ZDEMO_HEADER trong Eclipse ADT',
        tag: 'Eclipse ADT (TABL/DT)',
        html: `
        <div style="background:#1e1e1e; color:#d4d4d4; font-family:Consolas,monospace; padding:22px; border-radius:12px; height:100%; box-sizing:border-box; border:1px solid #3c3c3c;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #333333; padding-bottom:8px; margin-bottom:14px; font-family:'Segoe UI',sans-serif;">
                <span style="color:#4ec9b0; font-weight:600;">🗃️ ZDEMO_HEADER.tabl [Package: ZNGHIANDD_TEST | TR: S4DK911884]</span>
                <span style="background:#15803d; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:11px;">Active (Ctrl+F3)</span>
            </div>
            <div style="font-size:13.5px; line-height:1.65;">
                <span style="color:#569cd6;">@EndUserText.label</span> : <span style="color:#ce9178;">'Demo Header Database Table'</span><br>
                <span style="color:#569cd6;">@AbapCatalog.enhancement.category</span> : <span style="color:#4fc1ff;">#NOT_EXTENSIBLE</span><br>
                <span style="color:#569cd6;">@AbapCatalog.tableCategory</span> : <span style="color:#4fc1ff;">#TRANSPARENT</span><br>
                <span style="color:#569cd6;">define table</span> <span style="color:#4ec9b0; font-weight:700;">zdemo_header</span> {<br>
                &nbsp;&nbsp;<span style="color:#569cd6;">key client</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span style="color:#4ec9b0;">abap.clnt</span> <span style="color:#569cd6;">not null</span>;<br>
                &nbsp;&nbsp;<span style="color:#569cd6;">key header_uuid</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span style="color:#4ec9b0;">sysuuid_x16</span> <span style="color:#569cd6;">not null</span>;<br>
                &nbsp;&nbsp;demo_code&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span style="color:#4ec9b0;">abap.char(10)</span>;<br>
                &nbsp;&nbsp;status_code&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span style="color:#4ec9b0;">abap.char(2)</span>;<br>
                &nbsp;&nbsp;total_amount&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span style="color:#4ec9b0;">abap.curr(15,2)</span>;<br>
                &nbsp;&nbsp;currency_code&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span style="color:#4ec9b0;">abap.cuky</span>;<br>
                &nbsp;&nbsp;config_key&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span style="color:#4ec9b0;">abap.char(10)</span>;<br>
                &nbsp;&nbsp;local_last_changed_at : <span style="color:#4ec9b0;">abp_locinst_lastchange_tstmpl</span>;<br>
                &nbsp;&nbsp;last_changed_at&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span style="color:#4ec9b0;">abp_lastchange_tstmpl</span>;<br>
                }
            </div>
        </div>`
    },
    {
        filename: 'step_15_eclipse_cds_view.png',
        title: 'Tạo Root CDS View Entity ZI_DemoHeaderTP trong Eclipse ADT',
        tag: 'Eclipse ADT (DDLS/DF)',
        html: `
        <div style="background:#1e1e1e; color:#d4d4d4; font-family:Consolas,monospace; padding:22px; border-radius:12px; height:100%; box-sizing:border-box; border:1px solid #3c3c3c;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #333333; padding-bottom:8px; margin-bottom:14px; font-family:'Segoe UI',sans-serif;">
                <span style="color:#4ec9b0; font-weight:600;">💎 ZI_DemoHeaderTP.ddls [Root CDS View Entity]</span>
                <span style="background:#15803d; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:11px;">Active | Data Preview (F8)</span>
            </div>
            <div style="font-size:13.5px; line-height:1.65;">
                <span style="color:#569cd6;">@AccessControl.authorizationCheck</span>: <span style="color:#4fc1ff;">#NOT_REQUIRED</span><br>
                <span style="color:#569cd6;">@EndUserText.label</span>: <span style="color:#ce9178;">'Root CDS View Entity Demo Header'</span><br>
                <span style="color:#569cd6;">define root view entity</span> <span style="color:#4ec9b0; font-weight:700;">ZI_DemoHeaderTP</span><br>
                &nbsp;&nbsp;<span style="color:#569cd6;">as select from</span> <span style="color:#4ec9b0;">zdemo_header</span><br>
                &nbsp;&nbsp;<span style="color:#569cd6; font-weight:700;">composition [0..*] of</span> <span style="color:#4ec9b0;">ZI_DemoItemTP</span> <span style="color:#569cd6;">as</span> <span style="color:#9cdcfe;">_Items</span><br>
                {<br>
                &nbsp;&nbsp;<span style="color:#569cd6;">key header_uuid</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#569cd6;">as</span> HeaderUUID,<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;demo_code&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#569cd6;">as</span> DemoCode,<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status_code&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#569cd6;">as</span> StatusCode,<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#569cd6;">@Semantics.amount.currencyCode</span>: <span style="color:#ce9178;">'CurrencyCode'</span><br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;total_amount&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#569cd6;">as</span> TotalAmount,<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;currency_code&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#569cd6;">as</span> CurrencyCode,<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;config_key&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#569cd6;">as</span> ConfigKey,<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#9cdcfe;">_Items</span><br>
                }
            </div>
        </div>`
    },
    {
        filename: 'step_16_eclipse_bdef_managed.png',
        title: 'Tạo Behavior Definition BDEF & Quick Assist Ctrl+1',
        tag: 'Eclipse ADT (BDEF/BDO)',
        html: `
        <div style="background:#1e1e1e; color:#d4d4d4; font-family:Consolas,monospace; padding:22px; border-radius:12px; height:100%; box-sizing:border-box; border:1px solid #3c3c3c;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #333333; padding-bottom:8px; margin-bottom:14px; font-family:'Segoe UI',sans-serif;">
                <span style="color:#dcdcaa; font-weight:600;">⚡ ZI_DEMOHEADERTP.bdef [Managed strict(2) with draft]</span>
                <span style="background:#d97706; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:600;">Phím tắt vàng: Ctrl + 1</span>
            </div>
            <div style="font-size:13.5px; line-height:1.65;">
                <span style="color:#569cd6;">managed implementation in class</span> <span style="color:#4ec9b0; border-bottom:1px dashed #facc15;">zbp_i_demoheadertp</span> <span style="color:#569cd6;">unique</span>;<br>
                <span style="color:#569cd6; font-weight:700;">strict ( 2 );</span><br>
                <span style="color:#569cd6; font-weight:700;">with draft;</span><br><br>
                <span style="color:#569cd6;">define behavior for</span> <span style="color:#4ec9b0;">ZI_DemoHeaderTP</span> <span style="color:#569cd6;">alias</span> DemoHeader<br>
                <span style="color:#569cd6;">persistent table</span> <span style="color:#4ec9b0;">zdemo_header</span><br>
                <span style="color:#569cd6;">draft table</span> <span style="color:#4ec9b0;">zdemo_header_d</span><br>
                <span style="color:#569cd6;">lock master</span> | <span style="color:#569cd6;">etag master</span> LocalLastChangedAt<br>
                {<br>
                &nbsp;&nbsp;<span style="color:#569cd6;">create; update; delete;</span><br>
                &nbsp;&nbsp;<span style="color:#569cd6;">association</span> _Items { <span style="color:#569cd6;">create; with draft;</span> }<br>
                &nbsp;&nbsp;<span style="color:#569cd6;">draft action</span> Edit; <span style="color:#569cd6;">draft action</span> Activate <span style="color:#569cd6;">optimized</span>;<br>
                &nbsp;&nbsp;<span style="color:#569cd6;">action</span> ( features : instance ) approve <span style="color:#569cd6;">result [1] $self</span>;<br>
                } <span style="color:#6a9955;">// Child DemoItem: side effects { field Quantity affects field LineTotal, entity _Header; }</span>
            </div>
            <div style="background:#2d2d2d; border:1px solid #555; padding:8px 12px; border-radius:6px; margin-top:10px; font-family:'Segoe UI',sans-serif; font-size:12px; color:#facc15;">
                💡 <b>Quick Assist (Ctrl + 1):</b> Đặt chuột tại ZBP_I_DEMOHEADERTP nhấn Ctrl+1 để Eclipse tự sinh Class và Local Handler!
            </div>
        </div>`
    },
    {
        filename: 'step_18_eclipse_service_binding_publish.png',
        title: 'Publish Service Binding OData V4 & Preview Fiori Elements',
        tag: 'Eclipse ADT (SRVB/SB)',
        html: `
        <div style="background:#ffffff; color:#1d2d3e; font-family:'72',sans-serif; padding:22px; border-radius:12px; height:100%; box-sizing:border-box; border:1px solid #d1d5db;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:16px;">
                <div>
                    <span style="font-size:16px; font-weight:700; color:#0a6ed1;">ZUI_DEMO_HEADER_O4_SB (Service Binding)</span>
                    <span style="background:#dcfce7; color:#15803d; border:1px solid #86efac; border-radius:12px; padding:2px 10px; font-size:11px; font-weight:700; margin-left:10px;">PUBLISHED (Active)</span>
                </div>
                <div style="display:flex; gap:8px;">
                    <button style="background:#0a6ed1; color:#fff; border:none; padding:6px 14px; border-radius:4px; font-size:12.5px; font-weight:600;">Publish</button>
                    <button style="background:#047857; color:#fff; border:none; padding:6px 14px; border-radius:4px; font-size:12.5px; font-weight:700;">▶ Preview</button>
                </div>
            </div>
            <div style="font-size:13px; line-height:1.6; color:#475569; margin-bottom:14px;">
                <div>Binding Type: <b>ODATA V4 - UI</b> | Service: <b>ZUI_DEMO_HEADER_O4 (0001)</b></div>
            </div>
            <table style="width:100%; font-size:13px; border-collapse:collapse; border:1px solid #e2e8f0;">
                <tr style="background:#f8fafc; border-bottom:1px solid #cbd5e1; height:32px; font-weight:700; color:#334155;">
                    <th style="text-align:left; padding-left:12px;">EntitySet / Association</th>
                    <th style="text-align:left;">Entity Type</th>
                    <th style="text-align:center;">Thao Tác</th>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9; height:36px; background:#eff6ff;">
                    <td style="padding-left:12px; font-weight:700; color:#0369a1;">DemoHeader</td>
                    <td>DemoHeaderType</td>
                    <td style="text-align:center;"><span style="background:#0284c7; color:#fff; padding:3px 10px; border-radius:4px; font-size:11.5px; font-weight:600;">Preview</span></td>
                </tr>
                <tr style="height:36px;">
                    <td style="padding-left:12px; color:#475569;">DemoItem</td>
                    <td>DemoItemType</td>
                    <td style="text-align:center;"><span style="color:#64748b; font-size:11.5px;">Preview</span></td>
                </tr>
            </table>
            <div style="margin-top:12px; font-size:12px; color:#047857; font-weight:600;">
                ✓ Bấm 'Preview' trên DemoHeader để tự động mở ứng dụng SAP Fiori Elements với dữ liệu thật trên S/4HANA 2025!
            </div>
        </div>`
    }
];

const EDGE_PATHS = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];
const edgeExe = EDGE_PATHS.find((p) => fs.existsSync(p));
if (!edgeExe) {
    console.error('Khong tim thay Microsoft Edge (msedge.exe)');
    process.exit(1);
}

(async () => {
    console.log("=== Bắt đầu sinh các ảnh chụp minh họa thực tế cho từng bước ===");
    const browser = await puppeteer.launch({
        executablePath: edgeExe,
        headless: 'new',
        defaultViewport: { width: 900, height: 480 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    for (let i = 0; i < mockups.length; i++) {
        const item = mockups[i];
        const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {
                    margin: 0;
                    padding: 16px;
                    background: #0b0f19;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    box-sizing: border-box;
                }
                .frame {
                    width: 100%;
                    height: 100%;
                }
            </style>
        </head>
        <body>
            <div class="frame">
                ${item.html}
            </div>
        </body>
        </html>`;

        await page.setContent(fullHtml, { waitUntil: 'load' });
        const filePath = path.join(outputDir, item.filename);
        await page.screenshot({ path: filePath });
        console.log(`📸 Đã tạo thành công: ${item.filename}`);
    }

    await browser.close();
    console.log("=== Sinh toàn bộ ảnh minh họa thành công 100%! ===");
})();

