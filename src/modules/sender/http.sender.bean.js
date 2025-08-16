class HttpSender {


    async send(args) {
        //
        const {
            dataType,
            data
        } = args;
        //

        const endpoints = await this.getEndpoints(args);
        for (const endpoint of endpoints) {
            //
            const response = await this.http.call({
                method: 'post',
                url: endpoint,
                headers: {'Content-Type': 'application/json'},
                data: {dataType, data}
            });
        }

    }


    async getEndpoints(args) {
        const {
            dataType
        } = args;
        //
        return ["http://localhost:3015/api/outerDataService.onData"];
    }


}

module.exports = HttpSender;