// 大宗交易
class TongHuaShunStockDzjyFetch {

    async fetch(args) {

        //
        const chrome = await this.chromeManager.getChrome({});
        const page = await chrome.newPage();
        // 龙虎榜（涨跌幅排行）
        await page.gotoUrl('https://data.10jqka.com.cn/market/dzjy/');
        await page.sleepRandom(3000, 4000);
        // 等待加载完成
        await page.idle();
        //
        const tableData = await page._page.evaluate(async () => {

            const tableSelector = '#J-ajax-main > table';

            //
            const table = document.querySelector(tableSelector);
            const headers = table.querySelectorAll('th');

            const headerTextList = [];
            for (const header of headers) {
                const text = header.textContent.trim();
                headerTextList.push(text);
            }
            //
            const rows = Array.from(table.querySelectorAll('tr'));
            let isFirst = true;
            const rowList = [];
            for (const row of rows) {
                if (isFirst) {
                    isFirst = false;
                    continue;
                }
                const cells = Array.from(row.querySelectorAll('td'));
                const cellTextList = [];
                for (const cell of cells) {
                    const text = cell.textContent.trim();
                    cellTextList.push(text);
                }
                rowList.push(cellTextList);
            }

            return {
                headerTextList,
                rowList
            };
        });


        for (const row of tableData.rowList) {
            await this.tongHuaShunStockDetailFetch.fetch();
        }


        await page.close();
    }

}


module.exports = TongHuaShunStockDzjyFetch;