class ChromeManager {

    _chromeMap = {};

    async getChrome(args) {
        //
        const {
            id
        } = args;
        //

        const chrome = this._chromeMap[id];
        if (chrome) {
            return chrome;
        }

        const newChrome = new this.Chrome({
            userDataPath: this.path.join(this.cfg.app.storageRoot, id),
            self: this
        });
        await chrome.start();
        this._chromeMap[id] = newChrome;
        return newChrome;
    }

    async releaseChrome(args) {
        //
        const {
            id
        } = args;
        //
        const chrome = this._chromeMap[id];
        await chrome.stop();
        delete this._chromeMap[id];
    }
}


module.exports = ChromeManager;