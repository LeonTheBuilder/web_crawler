const loadContext = async function () {
    const a = require('aframework');
    const path = require("path");
    a.initEnv(path.join(__dirname, 'dev.env'));
    const cfg = require('./cfg');
    await a.loadContext(cfg);
    return a;
}
module.exports = loadContext;

