class TongHuaShunStockDetailFetch {
    async fetch(args) {
        //
        const {
            code
        } = args;
        //
        const chrome = await this.chromeManager.getChrome({});
        const page = await chrome.newPage();
        await page.gotoUrl(`https://stockpage.10jqka.com.cn/${code}/holder/#flowholder`);
        await page.sleepRandom(1500, 3000);
        //

        const stockBasicInfo = await this.getStockBasicInfo({page, code});
        const tenHolders = await this.getTenHolders({page, code});

        //
        await page.close();
        //
        return {stockBasicInfo, tenHolders};
    }

    async getTenHolders(args) {

        const {
            page, code
        } = args;


        const iframeElement = await page.getEleBySelector('#dataifm'); // 替换为实际的选择器
        if (!iframeElement) {
            console.log('未找到iframe元素');
            return;
        }

        // 获取iframe的框架对象
        const frame = await iframeElement.contentFrame();
        if (!frame) {
            console.log('无法获取iframe的框架对象');
            return;
        }

        // 获取iframe的URL
        const iframeUrl = frame.url();
        console.log('iframe URL:', iframeUrl);

        // 获取iframe中的内容
        const iframeTitle = await frame.title();
        console.log('iframe标题:', iframeTitle);
        //


        const tableData = await frame.evaluate(async () => {
            const tableSelector = '#fher_1 > table';
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

        // this.Sugar.writeFile(this.pathFinder.appGenFolder() + `/holders${code}.gen.json`, JSON.stringify(tableData));

        // 取 tableData.headerTextList 的 8 - 10 条数据
        const holderNames = tableData.headerTextList.slice(8, 18);
        this.log.info(holderNames);
        // 取 tableData.rowList 的前十条数据
        const tenHolders = tableData.rowList.slice(0, 10);

        let index = 0;
        const retHolderList = [];
        for (const holder of tenHolders) {
            const [holdQuantity, holdChange, circulatingShareRatio, changeRatio, shareType, clickToView] = holder;
            const holderMap = {};
            holderMap.holdQuantity = this.numberHelper.convert(holdQuantity, "万");
            holderMap.holdChange = holdChange;
            holderMap.circulatingShareRatio = parseFloat(circulatingShareRatio);
            holderMap.changeRatio = changeRatio;
            holderMap.shareType = shareType;
            holderMap.holderName = holderNames[index++];
            retHolderList.push(holderMap);
        }
        return retHolderList;
    }


    async getStockBasicInfo(args) {

        const {
            page, code
        } = args;

        // 方法1: 通过选择器获取iframe
        const iframeElement = await page.getEleBySelector('#in_squote > div > div > iframe'); // 替换为实际的选择器
        if (!iframeElement) {
            console.log('未找到iframe元素');
            return;
        }

        // 获取iframe的框架对象
        const frame = await iframeElement.contentFrame();
        if (!frame) {
            console.log('无法获取iframe的框架对象');
            return;
        }

        // 获取iframe的URL
        const iframeUrl = frame.url();
        console.log('iframe URL:', iframeUrl);

        // 获取iframe中的内容
        const iframeTitle = await frame.title();
        console.log('iframe标题:', iframeTitle);

        // stock basic information
        // 提取数据
        const stockBasicInfo = await frame.evaluate(() => {
            const data = {};
            // 获取所有相关的span元素
            const spans = document.querySelectorAll('body > div > ul span');

            spans.forEach(span => {
                // 找到strong子元素
                const strong = span.querySelector('strong');
                if (strong) {
                    // 获取值
                    const value = strong.textContent.trim();

                    // 克隆节点以获取名称部分（不包含strong内容）
                    const clone = span.cloneNode(true);
                    const cloneStrong = clone.querySelector('strong');
                    if (cloneStrong) {
                        clone.removeChild(cloneStrong);
                    }

                    // 处理名称，清除空格和特殊字符
                    let name = clone.textContent.trim().replace(/：$/, '');

                    if (name && value) {
                        data[name] = value;
                    }
                }
            });

            return data;
        });


        this.log.info(stockBasicInfo);


        // convert map
        /**
         * 当前的 stockBasicInfo 是下面的格式
         * {
         *         "今开": "9.18",
         *         "成交量": "1166.4万",
         *         "振幅": "1.42%",
         *         "最高": "9.22",
         *         "成交额": "1.07亿",
         *         "换手": "0.45%",
         *         "最低": "9.09",
         *         "总市值：亿": "237.29",
         *         "市净率": "2.35",
         *         "昨收": "9.18",
         *         "流通市值：亿": "236.99",
         *         "市盈率(动)": "35.19",
         *         "表决权差异": "否",
         *         "交易状态": "连续竞价"
         *       }
         *
         *  转化为如下格式
         *  {
         *   "openPrice": "9.18",         // 今开
         *   "tradingVolume": "1166.4万",  // 成交量
         *   "amplitude": "1.42%",         // 振幅
         *   "highestPrice": "9.22",       // 最高
         *   "turnover": "1.07亿",         // 成交额
         *   "turnoverRate": "0.45%",      // 换手
         *   "lowestPrice": "9.09",        // 最低
         *   "totalMarketValue": "237.29亿", // 总市值：亿
         *   "priceToBookRatio": "2.35",   // 市净率
         *   "previousClose": "9.18",      // 昨收
         *   "circulatingMarketValue": "236.99亿", // 流通市值：亿
         *   "priceEarningsRatioDynamic": "35.19", // 市盈率(动)
         *   "votingRightDifference": "否", // 表决权差异
         *   "tradingStatus": "连续竞价"   // 交易状态
         * }
         *
         *
         */

        const stockBasicInfoConverted = {
            code: code,
            openPrice: stockBasicInfo['今开'],
            tradingVolume: this.numberHelper.convert(stockBasicInfo['成交量'], '万'),
            amplitude: parseFloat(stockBasicInfo['振幅']),
            highestPrice: stockBasicInfo['最高'],
            turnover: this.numberHelper.convert(stockBasicInfo['成交额'], '万'),
            turnoverRate: parseFloat(stockBasicInfo['换手']),
            lowestPrice: stockBasicInfo['最低'],
            totalMarketValue: stockBasicInfo['总市值：亿'],
            priceToBookRatio: stockBasicInfo['市净率'],
            previousClose: stockBasicInfo['昨收'],
            circulatingMarketValue: stockBasicInfo['流通市值：亿'],
            priceEarningsRatioDynamic: stockBasicInfo['市盈率(动)'],
            votingRightDifference: stockBasicInfo['表决权差异'],
            tradingStatus: stockBasicInfo['交易状态']
        };
        return stockBasicInfoConverted;
    }
}


module.exports = TongHuaShunStockDetailFetch;