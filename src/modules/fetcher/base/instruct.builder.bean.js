class InstructsBuilder {
    //
    _pageHelperCode = null;

    async func2instructs(args) {
        //
        const {func} = args;
        //
        const functionString = func.toString();
        // Remove first and last lines, then join back
        const lines = functionString.split('\n');
        const instructs = lines.slice(1, -1).join('\n');
        if (!this._pageHelperCode) {
            this._pageHelperCode = this.Sugar.readFileContent(this.path.join(__dirname, 'page.helper.js'));
        }
        //
        const ret = `
        async function run() { 
            ${this._pageHelperCode} 
            try{
                ${instructs}
            }catch(_e){
                self.log.error(_e);
            }
        } 
        run();
        `;
        return ret;
    }
}


module.exports = InstructsBuilder;