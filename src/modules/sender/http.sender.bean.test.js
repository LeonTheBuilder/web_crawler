const loadContext = require("../../loadcontext");

it('httpSender.send', async () => {
    const a = await loadContext();
    // ---------------------------------------------------
    const httpSender = a.beans.httpSender;


    const thsDzjyData = a.models.Sugar.readFileContent(a.beans.pathFinder.appGenFolder() + "/dzjy.20250814.gen.json");
    const dataJson = JSON.parse(thsDzjyData);

    const result = await httpSender.send({
        dataType: 'dzjy',
        data: dataJson
    });
    console.log(result);
    // ---------------------------------------------------
    process.exit(0);
}).timeout(100000);

