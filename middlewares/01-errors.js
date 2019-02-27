module.exports.init = app => app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err.status) {
            if (err.status === 413) {
                ctx.set('Connection', 'close');
            }

            ctx.body = err.message;
            ctx.status = err.status;
        } else {
            ctx.body = 'Server processing error.';
            ctx.status = 500;
            console.error(err.message, err.stack);
        }
    }
});
