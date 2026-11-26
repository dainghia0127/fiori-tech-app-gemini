const http = require('http');

(async () => {
    try {
        const targets = await new Promise((res, rej) => {
            http.get('http://127.0.0.1:9222/json', r => {
                let b = ''; r.on('data', d => b += d); r.on('end', () => res(JSON.parse(b)));
            }).on('error', rej);
        });
        const pageTarget = targets.find(t => t.type === 'page' && t.url.includes('localhost:8085'));
        if (!pageTarget) {
            console.log('No localhost page found');
            process.exit(1);
        }
        const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
        ws.onopen = () => {
            ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
            ws.send(JSON.stringify({
                id: 2,
                method: 'Runtime.evaluate',
                params: {
                    expression: `(() => {
                        const btn = document.getElementById("appRootView--btnHandleError");
                        const overflowBtn = document.querySelector(".sapTntToolHeaderOverflowButton");
                        const allBtns = Array.from(document.querySelectorAll("#appRootView--toolHeader button")).map(b => ({
                            id: b.id,
                            text: b.innerText,
                            visible: b.offsetWidth > 0 && b.offsetHeight > 0,
                            className: b.className
                        }));
                        return {
                            btnExists: !!btn,
                            btnVisible: btn ? (btn.offsetWidth > 0 && btn.offsetHeight > 0) : false,
                            overflowExists: !!overflowBtn,
                            overflowVisible: overflowBtn ? (overflowBtn.offsetWidth > 0) : false,
                            allBtns
                        };
                    })()`,
                    returnByValue: true
                }
            }));
        };
        ws.onmessage = (e) => {
            const d = JSON.parse(e.data);
            if (d.id === 2) {
                console.log('BTN CHECK:', JSON.stringify(d.result.value, null, 2));
                ws.close();
                process.exit(0);
            }
        };
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
})();

