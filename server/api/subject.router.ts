import Router from 'koa-router';
import { getCurrentPeriod, PeriodModel } from 'model/period.model';
import { SubjectModel } from 'model/subject.model';
const router = new Router({ prefix: '/subject' });

router.get('/', async (ctx) => {
    ctx.body = await SubjectModel.find().populate('sector', ['name', '_id']);
});

// year?: number;
// ambGroup?: string; // 阿米巴组
// subjectType?: BudgetProjectType;  // 收入主类型

router.post('/', async (ctx) => {
    const data = ctx.request.body as amb.IBudgetSubject;
    const period = await getCurrentPeriod(ctx.session!.user.groups.map((item: any) => item._id)) as amb.IPeriod;
    if (period === undefined) ctx.throw(400, '没有可用预算周期！');
    // 获取用户id等信息
    console.log({ ...data, year: period.year, ambGroup: ctx.session!.user }, period, ctx.session!.user.groups.map((item: any) => item._id));
    return;
    await new SubjectModel(ctx.request.body).save();
    ctx.body = { msg: '保存成功' };
});

router.post('/:id', async (ctx) => {
    await SubjectModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = { msg: '保存成功' };
});

export default router;
