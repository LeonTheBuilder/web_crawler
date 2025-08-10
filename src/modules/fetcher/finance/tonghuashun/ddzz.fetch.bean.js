// 大单追踪
class TongHuaShunStockDdzzFetch {
    async fetch(args) {
        //
        const chrome = await this.chromeManager.getChrome({});
        const page = await chrome.newPage();
        await page.gotoUrl('https://www.bing.com');
        await page.close();
    }
}


module.exports = TongHuaShunStockDdzzFetch;