class PageWrapper {

    _page = null;

    // page helper
    async log() {
        console.log(...arguments);
    }

    curPageUrl() {
        return page.url();
    }

    async gotoUrl(url, options = {}) {
        await log('gotoUrl', url);
        await page.goto(url, {waitUntil: 'networkidle2', ...options});
    }

    async pageGoBack() {
        await log('pageGoBack');
        await page.goBack();
    }

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    sleepRandom(msMin, msMax) {
        // 随机休眠，范围在 [msMin, msMax]
        return new Promise((resolve) => {
            const randomMs = Math.floor(Math.random() * (msMax - msMin + 1)) + msMin;
            setTimeout(resolve, randomMs);
        });
    }

    async idle() {
        await log('idle');
        await sleepRandom();
    }

    async moveMouse(x, y) {
        await log('moveMouse', x, y);
        await page.mouse.move(x, y, {steps: 10});
    }

    async waitForSelector(selector, options = {}) {
        await log('waitForSelector', selector);
        if (!options.timeout) options.timeout = 10000;
        await page.waitForSelector(selector, options);
    }

    async getEleById(id) {
        await log('getEleById', id);
        const ele = await page.$(`#${id}`);
        await log('ele', ele);
        return ele;
    }

    async getEleBySelector(selector) {
        await log('getEleBySelector', selector);
        const ele = await page.$(selector);
        await log('ele', ele);
        return ele;
    }

    async getElesBySelector(selector) {
        await log('getElesBySelector', selector);
        const eles = await page.$$(selector);
        await log('eles', eles);
        return eles;
    }

    async getScreenWidthHeight() {
        await log('getScreenWidthHeight');
        const result = await page.evaluate(() => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            return {width, height};
        });
        await log('result', result);
        return result;
    }

    async getScreenCenterXY() {
        await log('getScreenCenterXY');
        const center = await page.evaluate(() => {
            const x = window.innerWidth / 2;
            const y = window.innerHeight / 2;
            return {x, y};
        });
        await log('center', center);
        return center;
    }

    async getElementBoundingBox(element) {
        await log('getElementBoundingBox', element);
        // 在 page.evaluate 中调用 getBoundingClientRect
        const boundingBox = await page.evaluate((ele) => {
            const rect = ele.getBoundingClientRect();
            return {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                left: rect.left
            };
        }, element);
        await log('boundingBox', boundingBox);
        return boundingBox;
    }

    async getElementBoundingBoxBySelector(selector) {
        await log('getElementBoundingBoxBySelector', selector);
        return await getElementBoundingBox(await getEleBySelector(selector));
    }

    async getEleCenterXY(element) {
        await log('getEleCenterXY', element);
        const boundingBox = await getElementBoundingBox(element);
        const x = boundingBox.x + boundingBox.width / 2;
        const y = boundingBox.y + boundingBox.height / 2;
        const ret = {x, y};
        await log('ret', ret);
        return ret;
    }

    async getEleCenterXYBySelector(selector) {
        await log('getElementCenterXYBySelector', selector);
        const boundingBox = await getElementBoundingBoxBySelector(selector);
        const x = boundingBox.x + boundingBox.width / 2;
        const y = boundingBox.y + boundingBox.height / 2;
        const ret = {x, y};
        await log('ret', ret);
        return ret;
    }

    async getElementVisibleCenter(targetElement) {
        await log('getElementVisibleCenter', targetElement);
        // 获取元素的 bounding box
        const boundingBox = await getElementBoundingBox(targetElement);

        // 获取视窗尺寸
        const viewport = await getScreenWidthHeight();

        // 计算可视区域的边界
        const visibleLeft = Math.max(0, boundingBox.left);
        const visibleRight = Math.min(viewport.width, boundingBox.right);
        const visibleTop = Math.max(0, boundingBox.top);
        const visibleBottom = Math.min(viewport.height, boundingBox.bottom);

        // 计算可视区域的中心点
        const centerX = (visibleLeft + visibleRight) / 2;
        const centerY = (visibleTop + visibleBottom) / 2;

        // 确保中心点在视窗内
        const isVisible = visibleRight > visibleLeft && visibleBottom > visibleTop;

        const ret = {
            x: isVisible ? centerX : null, y: isVisible ? centerY : null, isVisible: isVisible
        };
        await log('ret', ret);
        return ret;
    }

    async getElementVisibleCenterBySelector(selector) {
        await log('getElementVisibleCenterBySelector', selector);
        const ret = await getElementVisibleCenter(await getEleBySelector(selector));
        await log('ret', ret);
        return ret;
    }

    async moveMouse2Ele(element) {
        await log('moveMouse2Ele', element);
        const result = await getElementVisibleCenter(element);
        if (result.isVisible) {
            await moveMouse(result.x, result.y);
        }
    }

    async moveMouse2EleBySelector(selector) {
        await log('moveMouse2EleBySelector', selector);
        const element = await getEleBySelector(selector);
        await moveMouse2Ele(element);
    }

    async moveMouse2ScreenCenter() {
        await log('moveMouse2ScreenCenter');
        const center = await getScreenCenterXY();
        await moveMouse(center.x, center.y);
    }

    async focus(selector) {
        await log('focus', selector);
        await moveMouse2EleBySelector(selector);
        await page.focus(selector);
    }

    async copyText(text) {
        await page.evaluate((t) => {
            const textToCopy = t;
            navigator.clipboard.writeText(textToCopy);
        }, text);
    }


    async inputBySelector(inputSelector, inputText) {
        await log('inputBySelector', inputSelector, inputText);
        await moveMouse2EleBySelector(inputSelector);
        await focus(inputSelector);
        await idle();
        await page.type(inputSelector, inputText, {delay: Math.random() * 100 + 50});
    }

    async click(element) {
        await log('click', element);
        await moveMouse2Ele(element);
        await element.click();
    }

    async clickAtXY(x, y) {
        await log('clickAtXY', x, y);
        await page.mouse.click(x, y);
    }

    async clickBySelector(selector) {
        await log('clickBySelector', selector);
        const element = await getEleBySelector(selector);
        await click(element);
    }

    async evaluate(fn) {
        await log('evaluate');
        return await page.evaluate(fn);
    }

    async innerHtml(selector) {
        await log('innerHtml', selector);
        const html = await page.evaluate((selector) => {
            const ele = document.querySelector(selector);
            return ele ? ele.innerHTML : null;
        }, selector);

        return html;
    }

    async isElementInView(element) {
        await log('isElementInView', element);
        const isInView = await page.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= viewportHeight && rect.right <= viewportWidth);
        }, element);
        await log('isInView', isInView);
        return isInView;
    }

    async isElementInViewBySelector(selector) {
        await log('isElementInViewBySelector', selector);
        return await isElementInView(await getEleBySelector(selector));
    }

// 获得 selector 可以选择到的元素其中在可视区域内的元素。
    async getElesInViewBySelector(selector) {
        await log('getElesInViewBySelector', selector)
        const elements = await getElesBySelector(selector);
        const ret = [];
        for (const element of elements) {
            if (await isElementInView(element)) {
                ret.push(element);
            }
        }
        return ret;
    }

    async pressKey(keyStr) {
        await log('pressKey', keyStr);
        await page.keyboard.press(keyStr);
    }

    async pressKeyDown() {
        await log('pressKeyDown');
        await pressKey('ArrowDown');
    }

    async pressKeyEnter() {
        await log('pressKeyEnter');
        await pressKey('Enter');
    }

    async wheelScrollUp(height) {
        await log('wheelScrollUp', height);
        await wheelScroll(-height);
    }

    async wheelScrollDown(height) {
        await log('wheelScrollDown', height);
        await wheelScroll(height);
    }

    async wheelScroll(height) {
        await log('wheelScroll', height);
        // 随机化滚动次数（3到6次之间）
        const scrollSteps = Math.floor(Math.random() * 3) + 3;
        // 模拟平滑随机滚动
        for (let i = 0; i < scrollSteps; i++) {
            // 随机化每次滚动的距离（在 viewportHeight/10 的 ±20% 范围内）
            const randomDeltaY = (height / 10) * (0.8 + Math.random() * 0.4);
            await page.mouse.wheel({deltaY: randomDeltaY});
            // 随机化间隔时间（500ms 到 2000ms 之间）
            await sleepRandom(500, 1000);
        }
    }

    async wheelScrollUpEle(element) {
        await log('wheelScrollUpEle', element);
        await wheelScrollEle(element, -1);
    }

    async wheelScrollUpEleBySelector(selector) {
        await log('wheelScrollUpEleBySelector', selector);
        const element = await getEleBySelector(selector);
        await wheelScrollEle(element, -1);
    }

    async wheelScrollDownEle(element) {
        await log('wheelScrollDownEle', element);
        await wheelScrollEle(element, 1);
    }

    async wheelScrollDownEleBySelector(selector) {
        await log('wheelScrollDownEleBySelector', selector);
        const element = await getEleBySelector(selector);
        await wheelScrollEle(element, 1);
    }

    async wheelScrollEle(element, direction) { // direction >0 向下，<0 向上
        await log('wheelScrollEle', element, direction);
        const screenWH = await getScreenWidthHeight();
        const boundingBox = await getElementBoundingBox(element);
        const height = Math.min(screenWH.height, boundingBox.height);
        await moveMouse2Ele(element);
        if (direction > 0) {
            await wheelScroll(height);
        } else {
            await wheelScroll(-height);
        }
    }

    async type(text) {
        await page.keyboard.type(text, {delay: 50});
    }
}

module.exports = PageWrapper;

