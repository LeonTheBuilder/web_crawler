class NumberHelper {
    convert(str, uom, decimalPlaces = 5) {
        /**
         * 将字符串转化为指定单位的数字，并控制精度
         * @param {string} str - 带有单位的数字字符串，如"10亿"、"3.5万"
         * @param {string|null} uom - 目标单位，如"万"、"亿"，为null时返回基本单位数值
         * @param {number} decimalPlaces - 保留的小数位数，默认5位
         * @returns {number} 转换后的数字
         */

            // 定义单位与基数的映射关系
        const unitMap = {
                '': 1,         // 无单位
                '个': 1,       // 基本单位
                '十': 10,
                '百': 100,
                '千': 1000,
                'k': 1000,     // 千（英文）
                '万': 10000,
                '十万': 100000,
                '百万': 1000000,
                '千万': 10000000,
                'm': 1000000,  // 百万（英文）
                '亿': 100000000,
                '十亿': 1000000000,
                '百亿': 10000000000,
                '千亿': 100000000000,
                'b': 1000000000 // 十亿（英文）
            };

        // 提取数字部分和单位部分（支持整数和小数）
        const matchResult = str.match(/^(\d+(?:\.\d+)?)(.*)$/);
        if (!matchResult) {
            return NaN; // 格式不正确时返回NaN
        }

        // 解析数字和原始单位
        const [, numStr, originalUnit] = matchResult;
        const number = parseFloat(numStr);
        const trimmedUnit = originalUnit.trim();

        // 处理无效数字的情况
        if (isNaN(number)) {
            return NaN;
        }

        // 获取原始单位和目标单位的基数
        const originalBase = unitMap[trimmedUnit] ?? 1;
        const targetBase = uom === null ? 1 : (unitMap[uom] ?? 1);

        // 计算转换结果
        let result = number * originalBase / targetBase;

        // 处理精度问题：四舍五入到指定小数位数
        // 使用toFixed处理后转换回数字类型，避免科学计数法
        result = Number(result.toFixed(decimalPlaces));


        // 打印输入和输出
        console.log(`输入：${str}，目标单位：${uom}，结果：${result}`);


        return result;
    }
}

module.exports = NumberHelper;
