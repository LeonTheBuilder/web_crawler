const loadContext = require("../../../loadcontext");

it('tongHuaShunWorker.stockZdfphFetch', async () => {
    const a = await loadContext();
    const tongHuaShunWorker = a.beans.tongHuaShunWorker;
    await tongHuaShunWorker.stockZdfphFetch();
    process.exit(0);
}).timeout(100000);


it('tongHuaShunWorker.stockGgzjlFetch', async () => {
    const a = await loadContext();
    const tongHuaShunWorker = a.beans.tongHuaShunWorker;
    await tongHuaShunWorker.stockGgzjlFetch();
    process.exit(0);
}).timeout(100000);

it('tongHuaShunWorker.stockDzjyFetch', async () => {
    const a = await loadContext();
    const tongHuaShunWorker = a.beans.tongHuaShunWorker;
    await tongHuaShunWorker.stockDzjyFetch();
    process.exit(0);
}).timeout(100000);

