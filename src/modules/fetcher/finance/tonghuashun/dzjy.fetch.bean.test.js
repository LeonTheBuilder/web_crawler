const loadContext = require("../../../../loadcontext");

it('tongHuaShunStockDzjyFetch.fetch', async () => {
    const a = await loadContext();
    // ----------------------------------------------------------------
    const tongHuaShunStockDzjyFetch = a.beans.tongHuaShunStockDzjyFetch;
    const result = await tongHuaShunStockDzjyFetch.fetch({pageSize: 2});
    a.models.Sugar.writeFile(a.beans.pathFinder.appGenFolder() + "/dzjy.gen.json", JSON.stringify(result));
    // ----------------------------------------------------------------
    process.exit(0);
}).timeout(100000);

