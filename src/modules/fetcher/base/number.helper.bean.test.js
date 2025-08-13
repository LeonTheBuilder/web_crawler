const loadContext = require('../../../loadcontext');

it('numberHelper.yi2wan', async () => {
    const a = await loadContext();
    // ----------------------------------------------------
    const helper = a.beans.numberHelper;
    console.log(helper.convert("10亿", "万"));    // 输出：100000
    console.log(helper.convert("100亿", "万"));   // 输出：1000000
    console.log(helper.convert("100万", "亿"));   // 输出：0.01
    console.log(helper.convert("100万", null));   // 输出：1000000
    console.log(helper.convert("3.5k", "个"));    // 输出：3500
    console.log(helper.convert("2.5m", "万"));    // 输出：250
    console.log(helper.convert("1166.4万", "万"));    // 输出：1166.4
    // ----------------------------------------------------
    process.exit(0);
}).timeout(100000);








