class WorkerManager {

    listWorkers() {

        const beans = this.getBeans({isWorker: true});
        return beans.map(bean => {
            return {
                name: bean.name,
                category: bean.category,
                title: bean.title,
                description: bean.description,
            }
        });
    }

    async runWorker(args) {
        this.log.info(args);
        const bean = this.getBean({
            name: args.name,
        });
        return await bean.work(args);
    }

    async upsertWorkerState(args) {
        const {
            workerName,
            sifStatus
        } = args;

        await this.WorkerState.upsert({
            id: workerName,
            sifStatus
        });

    }

    async listWorkerStates() {
        const list = await this.WorkerState.findAll();
        return list;
    }

    apis = [
        [this.listWorkers, async (ctx) => {
            const args = await this.ah.ctx2args(ctx, false, false);
            ctx.body = await this.listWorkers(args);
        }],
        [this.runWorker, async (ctx) => {
            const args = await this.ah.ctx2args(ctx, false, false);
            ctx.body = await this.runWorker(args);
        }],
        [this.listWorkerStates, async (ctx) => {
            const args = await this.ah.ctx2args(ctx, false, false);
            ctx.body = await this.listWorkerStates(args);
        }],
    ];
}

module.exports = WorkerManager;