const loadContext = require("../../../../loadcontext");

it('tongHuaShunStockDzjyFetch.fetch', async () => {
    const a = await loadContext();
    // ----------------------------------------------------------------

    const tongHuaShunStockDzjyFetch = a.beans.tongHuaShunStockDzjyFetch;
    const result = await tongHuaShunStockDzjyFetch.fetch({pageSize: 3});
    a.models.Sugar.writeFile(a.beans.pathFinder.appGenFolder() + "/dzjy.json", JSON.stringify(result));
    // ----------------------------------------------------------------

    process.exit(0);
}).timeout(100000);

