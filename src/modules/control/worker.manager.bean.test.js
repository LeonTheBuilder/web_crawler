const loadContext = require("../../loadcontext");

it('workerManager.upsertWorkerState', async () => {
    const a = await loadContext();
    // ---------------------------------------------------
    const workerManager = a.beans.workerManager;
    await workerManager.upsertWorkerState({
        workerName: "someName",
        sifStatus: "i"
    });
    // ---------------------------------------------------
    process.exit(0);
}).timeout(100000);

