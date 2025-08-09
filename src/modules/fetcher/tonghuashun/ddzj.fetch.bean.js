// 大单追踪
class TongHuaShunStockDdzzFetch {
    async instructs() {
        await gotoUrl('https://data.10jqka.com.cn/funds/ddzz/');
        await sleepRandom(3000, 4000);
        // 等待加载完成
        await idle();

        const tableData = await page.evaluate(() => {

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

        await self.tongHuaShunStockDzjyFetch.onTableData({tableData});
    }
}


