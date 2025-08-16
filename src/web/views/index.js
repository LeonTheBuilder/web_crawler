createApp({
    data: {
        workers: [],
        workerStatusMap: {},
    },
    methods: {
        init: async function () {
            let self = this;
            self.initListeners();
            EventOp.pub(CommonEventsDef.page_ready);
        },
        initListeners: function () {
            let self = this;
            EventOp.sub(CommonEventsDef.page_ready, [
                //
                self.listWorkers,
                self.syncWorkerStatus
            ]);
        },
        listWorkers: async function () {
            let self = this;
            const res = await workerManager.listWorkers();
            errMsgIf(res);
            self.workers = res.data;
        },
        runWorker: async function (worker) {
            let self = this;
            const res = await workerManager.runWorker(worker);
            errMsgIf(res);
            self.workers = res.data;
        },
        syncWorkerStatus: async function () {
            let self = this;
            // 每2秒钟
            setInterval(async function () {
                const res = await workerManager.listWorkerStates();
                errMsgIf(res);
                const workerStateList = res.data;
                workerStateList.forEach(function (workerState) {
                    self.workerStatusMap[workerState.id] = workerState;
                });
                await self.$forceUpdate();
            }, 2000);

        }
    }
});