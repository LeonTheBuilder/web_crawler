const loadContext = require("../../../loadcontext");

it('tongHuaShunWorker.fetch', async () => {
    const a = await loadContext();
    const tongHuaShunWorker = a.beans.tongHuaShunWorker;
    await tongHuaShunWorker.fetch();
    process.exit(0);
}).timeout(100000);

