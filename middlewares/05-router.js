const Router = require('koa-router');
const fs = require('mz/fs');
const path = require('path');

const INDEX = '../public/index.html';

const router = new Router();

const clients = [];

router
    .get('/', async ctx => {
        ctx.body = await fs.readFile(
          path.join(__dirname, INDEX),
          'utf-8'
        );
    })
    .get('/subscribe', async ctx => {
        let message = '';

        const polling = () => new Promise((resolve, reject) => {
            console.log('New client has arrived');
            clients.push(resolve);

            ctx.res.on('close', () => {
                clients.splice(clients.indexOf(resolve), 1);

                const error = new Error('Connection closed');
                error.code = 'ECONNRESET';
                reject(error);
            });
        });

        try {
            message = await polling();
        } catch (err) {
            if (err.code === 'ECONNRESET') {
                console.error('One of the clients was disconnected');
                return;
            }

            console.log(err);
        }

        ctx.body = message;
    })
    .post('/publish', ctx => {
        const message = ctx.request.body.message;

        if (!message) {
            console.error('Received invalid message');
            ctx.throw(400, 'Invalid message');
        }

        clients.forEach(breakPolling => {
            breakPolling(message);
        });

        clients.length = 0;
        ctx.body = message;
    });

module.exports.init = app => app.use(router.routes());
