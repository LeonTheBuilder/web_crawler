class TraceService {
    async set(args) {
        //
        const {
            key, value // value is json
        } = args;
        await this.Trace.upsert({
            id: key,
            value: value
        });
    }

    async get(args) {
        //
        const {
            key
        } = args;
        //
        const trace = await this.Trace.findByPk(key);
        return trace?.value || {};
    }
}

module.exports = TraceService;