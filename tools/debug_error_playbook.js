const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\edge_debug_temp';

if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
}

const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + userDataDir,
    'http://localhost:8085/index.html'
]);

setTimeout(async () => {
    try {
        const targets = await new Promise((resolve, reject) => {
            http.get('http://127.0.0.1:9222/json', res => {
                let body = '';
                res.on('data', d => body += d);
                res.on('end', () => resolve(JSON.parse(body)));
            }).on('error', reject);
        });
        
        console.log('Targets:', targets.map(t => ({ title: t.title, url: t.url })));
        const pageTarget = targets.find(t => t.type === 'page');
        if (!pageTarget) {
            console.log('No page target found');
            proc.kill();
            return;
        }

        const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
        ws.onopen = () => {
            console.log('WebSocket connected to CDP');
            ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
            ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
            
            // Navigate to #/errors
            setTimeout(() => {
                console.log('Navigating to #/errors ...');
                ws.send(JSON.stringify({
                    id: 3,
                    method: 'Runtime.evaluate',
                    params: {
                        expression: 'window.location.hash = "#/errors";'
                    }
                }));
            }, 1000);

            // After 3s, check DOM and errors
            setTimeout(() => {
                ws.send(JSON.stringify({
                    id: 4,
                    method: 'Runtime.evaluate',
                    params: {
                        expression: '(() => { return { hash: window.location.hash, title: document.title, errorRows: document.querySelectorAll(".errorTableRowItem").length, bodySnippet: document.body.innerText.substring(0, 500) }; })()',
                        returnByValue: true
                    }
                }));
            }, 3000);

            setTimeout(() => {
                ws.close();
                proc.kill();
                process.exit(0);
            }, 5500);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.method === 'Runtime.consoleAPICalled') {
                console.log('PAGE CONSOLE [' + data.params.type + ']:', data.params.args.map(a => a.value || a.description).join(' '));
            } else if (data.method === 'Log.entryAdded') {
                console.log('BROWSER LOG:', data.params.entry);
            } else if (data.id === 4) {
                console.log('EVAL RESULT:', JSON.stringify(data.result, null, 2));
            }
        };

    } catch (e) {
        console.error('CDP Error:', e.message);
        proc.kill();
        process.exit(1);
    }
}, 2000);

