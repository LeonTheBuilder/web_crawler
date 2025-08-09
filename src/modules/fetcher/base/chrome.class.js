const puppeteer = require('puppeteer');
const {VM} = require('vm2');

//
class Chrome {

    _userDataPath = null;
    self = null;

    constructor(args) {
        const {
            userDataPath,
            self
        } = args;
        //
        this._userDataPath = userDataPath;
        this.self = self;
    }

    async start() {
        const self = this.self;
        this.browser = await puppeteer.launch({
            headless: false,
            executablePath: self.cfg.app.chromeExecutablePath,
            userDataDir: this._userDataPath, // 保留用户数据
            defaultViewport: null,
            args: [
                '--start-maximized', // 启动时最大化窗口
                '--disable-blink-features=AutomationControlled', // 隐藏自动化痕迹
                '--no-sandbox', // 可选：提高兼容性
                '--disable-setuid-sandbox', // 可选：提高兼容性
                '--disable-features=IsolateOrigins,site-per-process',
                '--disable-web-security',
                '--enable-features=ClipboardAPI'
            ],
            env: {
                PATH: `${process.env.PATH}:${self.path.dirname(self.cfg.app.chromeDriverPath)}`
            }
        });


        this.page = await this.browser.newPage();

        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');


        // 隐藏WebDriver属性
        await this.page.evaluateOnNewDocument(() => {
            // 装 navigator.webdriver
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
            // 伪装 WebRTC 和插件：
            Object.defineProperty(navigator, 'plugins', {
                get: () => [{name: 'Chrome PDF Plugin'}, {name: 'Chrome PDF Viewer'}],
            });
            Object.defineProperty(navigator, 'webRTC', {get: () => undefined});

            // 覆盖 Canvas 和 WebGL 指纹
            const getContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function (contextType) {
                if (contextType === 'webgl' || contextType === 'webgl2') {
                    const context = getContext.apply(this, arguments);
                    const getParameter = context.getParameter;
                    context.getParameter = function () {
                        return 'Mock WebGL'; // 模拟真实 WebGL 参数
                    };
                    return context;
                }
                return getContext.apply(this, arguments);
            };
        });
    }

    async stop() {
        if (this.browser) {
            await this.browser.close();
            await this.browser.disconnect();
        }
    }


}


module.exports = Chrome;