class PageWrapper {

    _page = null;

    // page helper
    async log() {
        console.log(...arguments);
    }

    curPageUrl() {
        return this._page.url();
    }

    async gotoUrl(url, options = {}) {
        await this.log('gotoUrl', url);
        await this._page.goto(url, {waitUntil: 'networkidle2', ...options});
    }

    async pageGoBack() {
        await this.log('pageGoBack');
        await this._page.goBack();
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
        await this.log('idle');
        await this.sleepRandom();
    }

    async moveMouse(x, y) {
        await this.log('moveMouse', x, y);
        await this._page.mouse.move(x, y, {steps: 10});
    }

    async waitForSelector(selector, options = {}) {
        await this.log('waitForSelector', selector);
        if (!options.timeout) options.timeout = 10000;
        await this._page.waitForSelector(selector, options);
    }

    async getEleById(id) {
        await this.log('getEleById', id);
        const ele = await this._page.$(`#${id}`);
        await this.log('ele', ele);
        return ele;
    }

    async getEleBySelector(selector) {
        await this.log('getEleBySelector', selector);
        const ele = await this._page.$(selector);
        await this.log('ele', ele);
        return ele;
    }

    async getElesBySelector(selector) {
        await this.log('getElesBySelector', selector);
        const eles = await this._page.$$(selector);
        await this.log('eles', eles);
        return eles;
    }

    async getScreenWidthHeight() {
        await this.log('getScreenWidthHeight');
        const result = await this._page.evaluate(() => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            return {width, height};
        });
        await this.log('result', result);
        return result;
    }

    async getScreenCenterXY() {
        await this.log('getScreenCenterXY');
        const center = await this._page.evaluate(() => {
            const x = window.innerWidth / 2;
            const y = window.innerHeight / 2;
            return {x, y};
        });
        await this.log('center', center);
        return center;
    }

    async getElementBoundingBox(element) {
        await this.log('getElementBoundingBox', element);
        // 在 this._page.evaluate 中调用 getBoundingClientRect
        const boundingBox = await this._page.evaluate((ele) => {
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
        await this.log('boundingBox', boundingBox);
        return boundingBox;
    }

    async getElementBoundingBoxBySelector(selector) {
        await this.log('getElementBoundingBoxBySelector', selector);
        return await this.getElementBoundingBox(await getEleBySelector(selector));
    }

    async getEleCenterXY(element) {
        await this.log('getEleCenterXY', element);
        const boundingBox = await this.getElementBoundingBox(element);
        const x = boundingBox.x + boundingBox.width / 2;
        const y = boundingBox.y + boundingBox.height / 2;
        const ret = {x, y};
        await this.log('ret', ret);
        return ret;
    }

    async getEleCenterXYBySelector(selector) {
        await this.log('getElementCenterXYBySelector', selector);
        const boundingBox = await this.getElementBoundingBoxBySelector(selector);
        const x = boundingBox.x + boundingBox.width / 2;
        const y = boundingBox.y + boundingBox.height / 2;
        const ret = {x, y};
        await this.log('ret', ret);
        return ret;
    }

    async getElementVisibleCenter(targetElement) {
        await this.log('getElementVisibleCenter', targetElement);
        // 获取元素的 bounding box
        const boundingBox = await this.getElementBoundingBox(targetElement);

        // 获取视窗尺寸
        const viewport = await this.getScreenWidthHeight();

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
        await this.log('ret', ret);
        return ret;
    }

    async getElementVisibleCenterBySelector(selector) {
        await this.log('getElementVisibleCenterBySelector', selector);
        const ret = await this.getElementVisibleCenter(await this.getEleBySelector(selector));
        await this.log('ret', ret);
        return ret;
    }

    async moveMouse2Ele(element) {
        await this.log('moveMouse2Ele', element);
        const result = await this.getElementVisibleCenter(element);
        if (result.isVisible) {
            await this.moveMouse(result.x, result.y);
        }
    }

    async moveMouse2EleBySelector(selector) {
        await this.log('moveMouse2EleBySelector', selector);
        const element = await this.getEleBySelector(selector);
        await this.moveMouse2Ele(element);
    }

    async moveMouse2ScreenCenter() {
        await this.log('moveMouse2ScreenCenter');
        const center = await this.getScreenCenterXY();
        await this.moveMouse(center.x, center.y);
    }

    async focus(selector) {
        await this.log('focus', selector);
        await this.moveMouse2EleBySelector(selector);
        await this._page.focus(selector);
    }

    async copyText(text) {
        await this._page.evaluate((t) => {
            const textToCopy = t;
            navigator.clipboard.writeText(textToCopy);
        }, text);
    }


    async inputBySelector(inputSelector, inputText) {
        await this.log('inputBySelector', inputSelector, inputText);
        await this.moveMouse2EleBySelector(inputSelector);
        await this.focus(inputSelector);
        await this.idle();
        await this._page.type(inputSelector, inputText, {delay: Math.random() * 100 + 50});
    }

    async click(element) {
        await this.log('click', element);
        await this.moveMouse2Ele(element);
        await element.click();
    }

    async clickAtXY(x, y) {
        await this.log('clickAtXY', x, y);
        await this._page.mouse.click(x, y);
    }

    async clickBySelector(selector) {
        await this.log('clickBySelector', selector);
        const element = await this.getEleBySelector(selector);
        await this.click(element);
    }

    async evaluate(fn) {
        await this.log('evaluate');
        return await this._page.evaluate(fn);
    }

    async innerHtml(selector) {
        await this.log('innerHtml', selector);
        const html = await this._page.evaluate((selector) => {
            const ele = document.querySelector(selector);
            return ele ? ele.innerHTML : null;
        }, selector);

        return html;
    }

    async isElementInView(element) {
        await this.log('isElementInView', element);
        const isInView = await this._page.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= viewportHeight && rect.right <= viewportWidth);
        }, element);
        await this.log('isInView', isInView);
        return isInView;
    }

    async isElementInViewBySelector(selector) {
        await this.log('isElementInViewBySelector', selector);
        return await this.isElementInView(await this.getEleBySelector(selector));
    }

// 获得 selector 可以选择到的元素其中在可视区域内的元素。
    async getElesInViewBySelector(selector) {
        await this.log('getElesInViewBySelector', selector)
        const elements = await this.getElesBySelector(selector);
        const ret = [];
        for (const element of elements) {
            if (await this.isElementInView(element)) {
                ret.push(element);
            }
        }
        return ret;
    }

    async pressKey(keyStr) {
        await this.log('pressKey', keyStr);
        await this._page.keyboard.press(keyStr);
    }

    async pressKeyDown() {
        await this.log('pressKeyDown');
        await this.pressKey('ArrowDown');
    }

    async pressKeyEnter() {
        await this.log('pressKeyEnter');
        await this.pressKey('Enter');
    }

    async wheelScrollUp(height) {
        await this.log('wheelScrollUp', height);
        await this.wheelScroll(-height);
    }

    async wheelScrollDown(height) {
        await this.log('wheelScrollDown', height);
        await this.wheelScroll(height);
    }

    async wheelScroll(height) {
        await this.log('wheelScroll', height);
        // 随机化滚动次数（3到6次之间）
        const scrollSteps = Math.floor(Math.random() * 3) + 3;
        // 模拟平滑随机滚动
        for (let i = 0; i < scrollSteps; i++) {
            // 随机化每次滚动的距离（在 viewportHeight/10 的 ±20% 范围内）
            const randomDeltaY = (height / 10) * (0.8 + Math.random() * 0.4);
            await this._page.mouse.wheel({deltaY: randomDeltaY});
            // 随机化间隔时间（500ms 到 2000ms 之间）
            await this.sleepRandom(500, 1000);
        }
    }

    async wheelScrollUpEle(element) {
        await this.log('wheelScrollUpEle', element);
        await this.wheelScrollEle(element, -1);
    }

    async wheelScrollUpEleBySelector(selector) {
        await this.log('wheelScrollUpEleBySelector', selector);
        const element = await this.getEleBySelector(selector);
        await this.wheelScrollEle(element, -1);
    }

    async wheelScrollDownEle(element) {
        await this.log('wheelScrollDownEle', element);
        await this.wheelScrollEle(element, 1);
    }

    async wheelScrollDownEleBySelector(selector) {
        await this.log('wheelScrollDownEleBySelector', selector);
        const element = await this.getEleBySelector(selector);
        await this.wheelScrollEle(element, 1);
    }

    async wheelScrollEle(element, direction) { // direction >0 向下，<0 向上
        await this.log('wheelScrollEle', element, direction);
        const screenWH = await this.getScreenWidthHeight();
        const boundingBox = await this.getElementBoundingBox(element);
        const height = Math.min(screenWH.height, boundingBox.height);
        await this.moveMouse2Ele(element);
        if (direction > 0) {
            await this.wheelScroll(height);
        } else {
            await this.wheelScroll(-height);
        }
    }

    async type(text) {
        await this._page.keyboard.type(text, {delay: 50});
    }

    async close() {
        await this._page.close();
    }
}

module.exports = PageWrapper;

