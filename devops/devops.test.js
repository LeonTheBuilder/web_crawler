const loadContext = require('../src/loadcontext');

it('update_table_schema', async () => {

    const a = await loadContext();

    try {
        await a.db.sync({alter: true});
    } catch (e) {
        console.log(e);
    }
    console.log('done');
    process.exit(0);
}).timeout(3600000);





