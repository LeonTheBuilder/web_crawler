const loadContext = require("../../../loadcontext");

it('stockTradingDay.test', async () => {
    const a = await loadContext();
    const stockTradingDay = a.beans.stockTradingDay;
    //

    // 获取当前交易日
    const todayTradingDay = stockTradingDay.getTradingDay();
    console.log('当前股票交易日:', todayTradingDay);

    // 测试一个特定日期（例如2023年10月1日，周日）
    const testDate = new Date('2023-10-01');
    const testTradingDay = stockTradingDay.getTradingDay(testDate);
    console.log('2023-10-01对应的股票交易日:', testTradingDay);

    //
    process.exit(0);
}).timeout(100000);

