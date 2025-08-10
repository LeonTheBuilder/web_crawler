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

        const stockBasicInfo = await this.getStockBasicInfo(page);
        const tenHolders = await this.getTenHolders(page);

        //
        await page.close();
        //
        return {stockBasicInfo, tenHolders};
    }

    async getTenHolders(page) {


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
        this.log.info(tableData);

        return tableData;
    }


    async getStockBasicInfo(page) {

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
        return stockBasicInfo;
    }
}


module.exports = TongHuaShunStockDetailFetch;