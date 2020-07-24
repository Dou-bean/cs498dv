// states:

module.exports = {
    'GET /time': async (ctx, next) => {
        var time = ctx.params.state || '';
        ctx.render('time.html', {
            title: `Time Series`
        });
    }
};
