createApp({
    data: {
        siteId: params.get('siteId'),
        pages: []
    },
    methods: {
        init: async function () {
            let self = this;
            self.initListeners();
            EventOp.pub(CommonEventsDef.page_ready);
        },
        initListeners: function () {
            let self = this;
            EventOp.sub(CommonEventsDef.page_ready, [
                self.getPages,
            ]);
        },
        getPages: async function () {
            let self = this;
            const res = await docService.getPages({
                siteId: self.siteId
            });
            errMsgIf(res);
            self.pages = res.data;
        },
    }
});