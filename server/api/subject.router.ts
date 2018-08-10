import Router from 'koa-router';
import { getCurrentPeriod, PeriodModel } from 'model/period.model';
import { SubjectModel } from 'model/subject.model';
const router = new Router({ prefix: '/subject' });

router.get('/', async (ctx) => {
    const { year, group } = ctx.query;
    ctx.body = await SubjectModel.find({ year, group, removed: false });
});

router.post('/', async (ctx) => {
    const data = ctx.request.body as amb.IBudgetSubject;
    await new SubjectModel(ctx.request.body).save();
    ctx.body = { msg: '保存成功' };
});

router.post('/:id', async (ctx) => {
    await SubjectModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = { msg: '保存成功' };
});
router.delete('/:id', async (ctx) => {
    await SubjectModel.findByIdAndUpdate(ctx.params.id, { removed: true });
    ctx.body = { msg: '删除成功' };
});

export default router;
