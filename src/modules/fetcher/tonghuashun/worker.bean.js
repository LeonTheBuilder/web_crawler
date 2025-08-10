class TongHuaShunWorker {

    isWorker = true;
    title = '同花顺';
    description = '';


    //
    async startWorkerForFetch() {

    }

    async fetch() {
        await this.tongHuaShunStockDzjyFetch.fetch();
        await this.tongHuaShunStockDdzzFetch.fetch();
    }

}


module.exports = TongHuaShunWorker;