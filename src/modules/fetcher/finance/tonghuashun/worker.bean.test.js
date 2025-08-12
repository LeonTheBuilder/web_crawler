const loadContext = require("../../../../loadcontext");

it('tongHuaShunWorker.fetch', async () => {
    const a = await loadContext();
    // ----------------------------------------------------------------
    const tongHuaShunWorker = a.beans.tongHuaShunWorker;
    await tongHuaShunWorker.fetch();
    // ----------------------------------------------------------------
    process.exit(0);
}).timeout(100000);

it('tongHuaShunWorker.stockDzjyFetch', async () => {
    const a = await loadContext();
    // ----------------------------------------------------------------
    const tongHuaShunWorker = a.beans.tongHuaShunWorker;
    const res = await tongHuaShunWorker.stockDzjyFetch();
    a.models.Sugar.writeFile(a.beans.pathFinder.appGenFolder() + "/dzjy.json", JSON.stringify(res));
    // ----------------------------------------------------------------
    process.exit(0);
}).timeout(10000000);



