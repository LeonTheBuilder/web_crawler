class TongHuaShunWorker {

    isWorker = true;
    title = '同花顺';
    description = '';


    //
    async startWorkerForFetch() {

    }

    async fetch() {
        // 大宗交易 fetch and send
        const dzjyData = await this.stockDzjyFetch();
        await this.httpSender.send({
            dataType: 'dzjyData',
            data: dzjyData
        });
        // await this.tongHuaShunStockDdzzFetch.fetch();
    }


    // 大宗交易 fetch
    async stockDzjyFetch() {
        //
        const dzjyData = await this.tongHuaShunStockDzjyFetch.fetch();
        return dzjyData;
    }

}


module.exports = TongHuaShunWorker;