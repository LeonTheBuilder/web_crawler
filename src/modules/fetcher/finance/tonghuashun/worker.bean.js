class TongHuaShunWorker {

    isWorker = true;
    title = '同花顺';
    description = '';


    //
    async startWorkerForFetch() {

    }

    async fetch() {
        const dzjyData = await this.tongHuaShunStockDzjyFetch.fetch();

        await this.httpSender.send({
            dataType: 'dzjyData',
            data: dzjyData
        });

        // await this.tongHuaShunStockDdzzFetch.fetch();
    }

}


module.exports = TongHuaShunWorker;