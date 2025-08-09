class TongHuaShunWorker {

    isWorker = true;
    title = '同花顺';
    description = '';


    //
    async startWorkerForFetch() {

    }

    async fetch() {
        // 大宗交易
        const chromeId = 'tonghuashun';
        await this.fetchRunner.runFetch({
            chromeId: chromeId,
            fetch: this.tongHuaShunStockDzjyFetch
        });

        // 大单交易
        
    }

}


module.exports = TongHuaShunWorker;