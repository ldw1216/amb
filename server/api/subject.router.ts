import Router from 'koa-router';
import { getCurrentPeriod, PeriodModel } from 'model/period.model';
import { SubjectModel } from 'model/subject.model';
const router = new Router({ prefix: '/subject' });

router.get('/', async (ctx) => {
    const { year, ambGroup } = ctx.query;
    ctx.body = await SubjectModel.find({ year, ambGroup });
});

router.post('/', async (ctx) => {
    const data = ctx.request.body as amb.IBudgetSubject;
    // 获取用户id等信息
    await new SubjectModel(ctx.request.body).save();
    ctx.body = { msg: '保存成功' };
});

router.post('/:id', async (ctx) => {
    await SubjectModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = { msg: '保存成功' };
});

export default router;
