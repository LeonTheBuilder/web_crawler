class TongHuaShunStockDetailFetch {
    async fetch(args) {
        //
        const chrome = await this.chromeManager.getChrome({});
        const page = await chrome.newPage();

        await page.gotoUrl('https://www.bing.com');
        await page.sleepRandom(3000, 4000);
        await page.close();
    }
}


module.exports = TongHuaShunStockDetailFetch;