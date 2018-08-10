import Router from 'koa-router';
import { BudgetModel } from 'model/budget.model';
const router = new Router({ prefix: '/budget' });

router.get('/', async (ctx) => {
    ctx.body = await BudgetModel.find({});
});

router.get('/group/:groupId/year/:year', async (ctx) => {
    ctx.body = await BudgetModel.find({ group: ctx.params.groupId, year: parseInt(ctx.params.year, 10) })
        .sort({ _id: -1 })
        .limit(1)
        .then((list) => list[0]);
});

router.post('/', async (ctx) => {
    const budget = ctx.request.body as amb.IBudget;
    console.log(budget.monthBudgets[0].subjectBudgets);
    if (!budget._id) {
        await new BudgetModel(ctx.request.body).save();
    } else {
        await BudgetModel.findByIdAndUpdate(budget._id, budget);
    }
    ctx.body = { msg: '保存成功' };
});

export default router;
