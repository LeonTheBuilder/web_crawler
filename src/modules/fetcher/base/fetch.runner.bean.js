const {VM} = require("vm2");

class FetchRunner {
    async runFetch(args) {
        //
        const {
            fetch,
            chromeId = 'default'
        } = args;
        //
        const chrome = await this.chromeManager.getChrome({
            id: chromeId
        });
        const func = fetch.instructs;
        const instructs = await this.instructsBuilder.func2instructs({func});

        //
        try {
            //
            const vm = new VM({
                timeout: 100000, // 设置超时 10 秒
                sandbox: {
                    self: this,
                    chrome: chrome,
                }, // 注入 chrome 对象
                allowAsync: true // 启用异步支持
            });
            await vm.run(instructs);
            self.log.info('instructs executed');
            //
        } catch (e) {
            self.log.error(e);
            throw e;
        }
    }


}

module.exports = FetchRunner;