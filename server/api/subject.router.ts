import Router from 'koa-router';
import { getCurrentPeriod, PeriodModel } from 'model/period.model';
import { SubjectModel } from 'model/subject.model';
const router = new Router({ prefix: '/subject' });

router.get('/', async (ctx) => {
    ctx.body = await SubjectModel.find().populate('sector', ['name', '_id']);
});

// _id?: string
// id?: string;
// year?: number;
// ambGroup?: string; // 阿米巴组
// subjectType?: BudgetProjectType;  // 收入主类型
// name?: string; // 类型名称
// sort?: string; // 排序

router.post('/', async (ctx) => {
    const data = ctx.request.body as amb.IBudgetSubject;
    const period = await getCurrentPeriod(['5b5da558f97e81209d5cfcbd']);
    // 获取用户id等信息
    console.log({ ...data }, ctx.session!.user);
    return;
    await new SubjectModel(ctx.request.body).save();
    ctx.body = { msg: '保存成功' };
});

router.post('/:id', async (ctx) => {
    await SubjectModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = { msg: '保存成功' };
});

export default router;
