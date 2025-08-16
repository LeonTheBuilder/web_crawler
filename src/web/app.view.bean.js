class UserViewController {
    index = async (ctx) => {
        await this.vr.render(ctx, __dirname, "./views/index.ejs")
    };
    mappings = [
        ['', 'GET', this.index],
        ['/', 'GET', this.index],
    ];
}

module.exports = UserViewController;
