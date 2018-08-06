import Router from 'koa-router';
import { getCurrentPeriod, PeriodModel } from 'model/period.model';
import { SubjectModel } from 'model/subject.model';
const router = new Router({ prefix: '/subject' });

router.get('/', async (ctx) => {
    ctx.body = await SubjectModel.find().populate('sector', ['name', '_id']);
});

// year?: number;
// ambGroup?: string; // 阿米巴组
// type?: BudgetProjectType;  // 收入主类型

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
