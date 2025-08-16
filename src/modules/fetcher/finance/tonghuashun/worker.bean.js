class TongHuaShunWorker {

    isWorker = true;
    category = '金融';
    title = '同花顺大宗交易获取器';
    description = '从同花顺获取最近一个交易日的大宗交易数据并发送';


    //
    async startWorkerForFetch() {

    }

    // 大宗交易 fetch
    async work() {

        await this.workerManager.upsertWorkerState(
            {
                workerName: this.name,
                sifStatus: this.SifStatus.i
            }
        );

        try {
            // 大宗交易 fetch and send
            const dzjyData = await this.tongHuaShunStockDzjyFetch.fetch({});
            await this.httpSender.send({
                dataType: 'dzjy',
                data: dzjyData
            });
        } catch (e) {
            this.log.error(e);
            await this.workerManager.upsertWorkerState(
                {
                    workerName: this.name,
                    sifStatus: this.SifStatus.f
                }
            );
            throw e;
        }
        await this.workerManager.upsertWorkerState(
            {
                workerName: this.name,
                sifStatus: this.SifStatus.s
            }
        );

    }


    apis = [
        [this.work, async (ctx) => {
            const args = await this.ah.ctx2args(ctx, false, false);
            ctx.body = await this.work(args);
        }],
    ];

}


module.exports = TongHuaShunWorker;