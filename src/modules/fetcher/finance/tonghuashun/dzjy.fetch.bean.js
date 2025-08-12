// 大宗交易
class TongHuaShunStockDzjyFetch {


    async date2fetch() {
        const date = this.stockTradingDay.getTradingDay()
        return date;
    }

    async fetch(args) {

        const {
            pageSize = 10000
        } = args;
        //


        // -----------------------------------------------------------------------
        const chrome = await this.chromeManager.getChrome({});
        const page = await chrome.newPage();
        // 龙虎榜（涨跌幅排行）
        await page.gotoUrl('https://data.10jqka.com.cn/market/dzjy/');
        // -----------------------------------------------------------------------
        const retData = {};
        retData.stockMap = {};
        retData.trades = [];
        // -----------------------------------------------------------------------
        let hasMoreData = true;
        while (hasMoreData) {
            // 等待加载完成
            await page.idle();
            await page.sleepRandom(3000, 4000);
            hasMoreData = await this.processTableData({page, retData, pageSize});
            //
            if (!hasMoreData) {
                this.log.info('没有更多数据了 hasMoreData false');
                break;
            }
            //
            await page.wheelScrollDownScreens(3);
            //
            hasMoreData = await page.evaluate(() => {
                // 先获取所有 class 为 changePage 的 a 标签
                const links = document.querySelectorAll('a.changePage');
                // 筛选出文本内容为 '下一页' 的元素
                for (const link of links) {
                    if (link.textContent.trim() === '下一页') {
                        link.click(); // 返回找到的元素
                        return true;
                    }
                }
                return false; // 未找到时返回 null
            });

            this.log.info('hasMoreData', hasMoreData);
            //
        }
        // -----------------------------------------------------------------------

        //
        await page.close();
        //
        return retData;
    }

    async processTableData(args) {

        //
        const {page, retData, pageSize} = args;
        //
        const dateStr = await this.date2fetch();
        //
        const tableData = await page.evaluate(async () => {

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


        let hasMoreData = true;
        //
        for (const row of tableData.rowList) {
            // 序号|交易日期|股票代码|股票简称|最新价|成交价格|成交量（万股）|溢价率|买方营业部|卖方营业部

            // [
            //     '45',
            //     '2025-08-08',
            //     '300340',
            //     '科恒股份',
            //     '17.74',
            //     '13.81',
            //     '30.00',
            //     '-22.15%',
            //     '国投证券股份有限公司上海樱花路证券营业部',
            //     '华福证券有限责任公司广东分公司'
            // ]

            const [
                index,
                date,
                code,
                name,
                price,
                dealPrice,
                volume,
                premium,
                buyDept,
                sellDept
            ] = row;

            //


            //
            if (date !== dateStr) {
                this.log.info('日期不一致 date !== dateStr', date, dateStr)
                hasMoreData = false;
                break;
            }
            //
            retData.trades.push(row);
            //
            if (!retData.stockMap[code]) {
                // random sleep
                await this.Sugar.sleepRandom(2000, 4000);
                const stockFetchData = await this.tongHuaShunStockDetailFetch.fetch({code});
                retData.stockMap[code] = stockFetchData;
            }
            //
            // 如果 retData.trades 长度大于 pageSize，则停止处理
            if (retData.trades.length >= pageSize) {
                hasMoreData = false;
                break;
            }

        }
        //
        return hasMoreData;
    }

}


module.exports = TongHuaShunStockDzjyFetch;