const loadContext = require('./loadcontext');
(async () => {
    const a = await loadContext();
    await a.start();
})();
