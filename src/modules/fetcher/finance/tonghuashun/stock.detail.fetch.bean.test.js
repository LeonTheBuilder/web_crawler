const loadContext = require("../../../../loadcontext");

it('tongHuaShunStockDetailFetch.fetch', async () => {
    const a = await loadContext();
    const tongHuaShunStockDetailFetch = a.beans.tongHuaShunStockDetailFetch;
    const result = await tongHuaShunStockDetailFetch.fetch({code: '300340'});
    console.log(result);
    process.exit(0);
}).timeout(100000);

