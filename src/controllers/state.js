// states:

module.exports = {
    'GET /state': async (ctx, next) => {
        var state = ctx.params.state || '';
        ctx.render('state.html', {
            title: `State information`
        });
    }
};
