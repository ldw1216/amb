import Router from 'koa-router';
import { getCurrentPeriod, PeriodModel } from 'model/period.model';
const router = new Router({ prefix: '/period' });

router.get('/', async (ctx) => {
    ctx.body = await PeriodModel.find({}).populate('groups', ['name', '_id']);
});

// 获取每个组的当前排期
router.post('/groups', async (ctx) => {
    ctx.body = await getCurrentPeriod((ctx.request.body as any).groups);
});

router.post('/', async (ctx) => {
    await new PeriodModel(ctx.request.body).save();
    ctx.body = { msg: '保存成功' };
});

router.post('/:id', async (ctx) => {
    await PeriodModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = { msg: '保存成功' };
});

export default router;
