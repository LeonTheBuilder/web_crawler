const path = require('path');
const cfgdef = require('aframework/cfgdef');

//----------------------------------------------------------------
const cfg = cfgdef();
const nodeModulesPath = path.join(__dirname, "..", 'node_modules');
cfg.nodeModulesPath = nodeModulesPath; // ejs 页面里面使用了这个路径
//----------------------------------------------------------------
cfg.app.name = 'capofpro';
cfg.loadContextFilePath = path.join(__dirname, 'loadcontext.js');
cfg.genFolder = path.join(__dirname, 'gen');
cfg.typeJsFolder = __dirname;
cfg.autowire.folders = [
    __dirname,
    path.join(nodeModulesPath, "user_service"),
    path.join(nodeModulesPath, "ai_service"),
];
//----------------------------------------------------------------
cfg.web.port = 3015;
cfg.web.view.viewFolder = require('./web/views/viewfolder');
//----------------------------------------------------------------
cfg.mysql.database = 'capofpro';
cfg.mysql.serverTimezone = 'Asia/Shanghai';
//----------------------------------------------------------------
cfg.app.storageRoot = process.env.APP_STORAGE_ROOT || '/Users/chence/dev/tmp';
cfg.app.chromeExecutablePath = process.env.APP_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
cfg.app.defaultLlmModel = process.env.APP_DEFAULT_LLM_MODEL || 'qwen-plus';
cfg.app.chromeDriverPath = process.env.APP_CHROME_DRIVER_PATH || '/Users/chence/dev/chromedriver';
cfg.app.tempFolderRoot = process.env.APP_TEMP_FOLDER_ROOT || '/Users/chence/dev/tmp';
//----------------------------------------------------------------
module.exports = cfg;
