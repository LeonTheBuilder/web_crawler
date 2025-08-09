class UserViewController {
    index = async (ctx) => {
        await ctx.render('index');
    };
    mappings = [
        ['', 'GET', this.index],
        ['/', 'GET', this.index],
        ['/pages', 'GET', async (ctx) => {
            await ctx.render('pages');
        }],
    ];
}

module.exports = UserViewController;
