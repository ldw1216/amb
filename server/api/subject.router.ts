import Router from 'koa-router';
import { BudgetModel } from 'model/budget.model';
import { SubjectModel } from 'model/subject.model';
const router = new Router({ prefix: '/subject' });

router.get('/', async (ctx) => {
    const { year, group } = ctx.query;
    ctx.body = await SubjectModel.find({ year, group, removed: false });
});

router.post('/', async (ctx) => {
    await new SubjectModel(ctx.request.body).save();
    ctx.body = { msg: '保存成功' };
});

router.post('/:id', async (ctx) => {
    await SubjectModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = { msg: '保存成功' };
});
router.delete('/:id', async (ctx) => {
    await SubjectModel.findByIdAndUpdate(ctx.params.id, { removed: true });
    // 删除预算的数据
    const budget = await BudgetModel.findOne({ 'monthBudgets.subjectBudgets.subjectId': ctx.params.id });
    if (budget) {
        budget.monthBudgets.forEach((month) => {
            month.subjectBudgets = month.subjectBudgets.filter((item) => item.subjectId !== ctx.params.id);
        });
        await budget.save();
    }
    ctx.body = { msg: '删除成功' };
});

export default router;
