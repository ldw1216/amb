import Router from 'koa-router';
import { flatten } from 'ramda';
const { readdirRecursivelySync } = require('readdir-recursively-sync');
const router = new Router();
router.get('/', async (ctx) => {
    ctx.body = 'index';
});

// 加载所有路由
flatten(readdirRecursivelySync(__dirname))
    .map((item: any) => item.replace(__dirname, '.'))
    .filter((item: string) => item.includes('.router.') && !item.includes('.js.map'))
    .map((routeFile: string) => {
        const api = require(routeFile).default;
        if (api && api.routes) {
            router.use('/api', api.routes());
        }
    });

export default router;

router.post('/api/aa', async (ctx) => {
    console.log(ctx.request.body);
    ctx.body = ctx.request.body;
});
