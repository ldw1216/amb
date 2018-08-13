import Router from 'koa-router';
import { BudgetModel } from 'model/budget.model';
const router = new Router({ prefix: '/budget' });

router.get('/', async (ctx) => {
    const year = parseInt(ctx.query.year, 10);
    const condition: any = year ? { year } : {};
    let approvalState = ctx.query.approvalState;
    const groupId = ctx.query.groupId || '';
    if (approvalState) {
        approvalState = Array.isArray(approvalState) ? approvalState : [approvalState];
        approvalState = approvalState.map((a: string) => +a);
        condition.approvalState = { $in: approvalState };
    }
    if (groupId) {
        condition.condition = groupId;
    }
    ctx.body = await BudgetModel.find(condition);
});

// 获取当前用的所有预算信息  /budget/currentUser
router.get('/currentUser', async (ctx) => {
    const year = parseInt(ctx.query.year, 10);
    if (!year) ctx.throw(400, '缺少年份');
    const groups = ctx.session!.user.groups.map((item: any) => item._id);
    ctx.body = await BudgetModel.find({ group: { $in: groups }, year }).sort({ _id: -1 });
});

router.post('/', async (ctx) => {
    const budget = ctx.request.body as amb.IBudget;
    if (!budget._id) {
        await new BudgetModel(ctx.request.body).save();
    } else {
        await BudgetModel.findByIdAndUpdate(budget._id, budget);
    }
    ctx.body = { msg: '保存成功' };
});

export default router;
