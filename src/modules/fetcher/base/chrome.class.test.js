const loadContext = require("../../../loadcontext");
const Chrome = require('./chrome.class');

it('some.main', async () => {


    const a = await loadContext();

    const chrome = new Chrome({
        userDataPath: `/Users/chence/dev/tmp/1`,
        cfg: a.cfg
    });

    await chrome.start();

    const url = "https://developers.binance.com/docs/derivatives";

    await chrome.page.goto(url, {waitUntil: 'networkidle2'});
    const html = await chrome.page.content();
    console.log(html);

    const urls = await chrome.page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).map(a => a.href);
    });

    for (const url of urls) {
        if (url.startsWith("https://developers.binance.com/docs/derivatives")) {
            console.log(url);
        }
    }

}).timeout(100000);