import Router from 'koa-router';
import { BudgetModel } from 'model/budget.model';
const router = new Router({ prefix: '/budget' });

router.get('/totalTable', async (ctx) => {
    const list = await BudgetModel.aggregate([
        { $match: { year: 2018 } },
        { $project: { monthBudgets: 1 } },
        { $unwind: '$monthBudgets' },
    ])
    console.log(list)
    ctx.body = [{ total: '收入-阿米巴' }, { total: '成本费用-阿米巴' }, { total: '利润-阿米巴' }, { total: '收入-财务' }, { total: '成本费用-财务' }, { total: '利润-财务' }]
});

export default router;
