const loadContext = require("../../loadcontext");

it('traceService.setget', async () => {
    const a = await loadContext();
    const traceService = a.beans.traceService;

    //
    await traceService.set({
        key: 'test',
        value: {test: 'test'}
    });

    //
    const value = await traceService.get({
        key: 'test'
    });

    console.log(value);


    process.exit(0);
}).timeout(100000);

