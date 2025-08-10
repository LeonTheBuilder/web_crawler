/**
 * 股票交易日处理类
 * 用于获取符合要求的股票交易日字符串（YYYY-MM-DD）
 * 规则：如果当前时间是16点之后且今天是交易日，则返回今天；如果是16点之前，则返回上一个交易日
 */
class StockTradingDay {

    holidays = [];

    /**
     * 更新节假日列表
     * @param {string[]} holidays - 新的节假日列表
     */
    updateHolidays(holidays) {
        this.holidays = holidays;
    }

    /**
     * 获取股票交易日
     * @param {Date} [date] - 可选参数，指定日期，默认使用当前时间
     * @returns {string} 股票交易日，格式YYYY-MM-DD
     */
    getTradingDay(date = new Date()) {
        // 复制日期对象，避免修改原对象
        const currentDate = new Date(date);
        const hours = currentDate.getHours();

        // 确定基础日期：16点前取昨天，16点后取今天
        const baseDate = new Date(currentDate);
        if (hours < 16) {
            baseDate.setDate(baseDate.getDate() - 1);
        }

        // 寻找基础日期之前最近的一个交易日
        let tradingDate = new Date(baseDate);

        // 向前查找最近的交易日
        while (!this.isTradingDay(tradingDate)) {
            tradingDate.setDate(tradingDate.getDate() - 1);
        }

        return this.formatDate(tradingDate);
    }

    /**
     * 检查是否为交易日
     * @param {Date} date - 日期对象
     * @returns {boolean} 是否为交易日
     */
    isTradingDay(date) {
        const day = date.getDay();
        // 周末不是交易日（0是周日，6是周六）
        if (day === 0 || day === 6) {
            return false;
        }

        // 检查是否为节假日
        const dateStr = this.formatDate(date);
        return !this.holidays.includes(dateStr);
    }

    /**
     * 格式化日期为YYYY-MM-DD
     * @param {Date} date - 日期对象
     * @returns {string} 格式化后的日期字符串
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

// 示例用法
if (require.main === module) {
    // 节假日列表
    const holidays = [
        '2023-01-01', '2023-01-22', '2023-01-23',
        '2023-01-24', '2023-01-25', '2023-01-26',
        // 可以添加更多节假日
    ];

    // 创建实例
    const tradingDayProcessor = new StockTradingDay(holidays);

    // 获取当前交易日
    const todayTradingDay = tradingDayProcessor.getTradingDay();
    console.log('当前股票交易日:', todayTradingDay);

    // 测试一个特定日期（例如2023年10月1日，周日）
    const testDate = new Date('2023-10-01');
    const testTradingDay = tradingDayProcessor.getTradingDay(testDate);
    console.log('2023-10-01对应的股票交易日:', testTradingDay);
}

module.exports = StockTradingDay;
