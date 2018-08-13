import Router from 'koa-router';
import { BudgetModel } from 'model/budget.model';
const router = new Router({ prefix: '/budget' });

router.get('/totalTable', async (ctx) => {
    const list = await BudgetModel.aggregate([
        { $match: { year: 2018 } },
        { $project: { monthBudgets: 1 } },
        { $unwind: '$monthBudgets' },
    ])
    const data = []
    for (let i = 0; i < 1; i++) {
        let obj = { subjectBudgets: [] } as any
        obj.month = i
        let monthBudgets = list.filter((item: any) => item.monthBudgets.month === i)
        for (let j of monthBudgets) {
            j.monthBudgets.subjectBudgets.map((n: any) => obj.subjectBudgets.push(n))
        }
        data.push(obj)
    }
    ctx.body = [{ total: '收入-阿米巴' }, { total: '成本费用-阿米巴' }, { total: '利润-阿米巴' }, { total: '收入-财务' }, { total: '成本费用-财务' }, { total: '利润-财务' }]
});

export default router;
