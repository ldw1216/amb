import Router from 'koa-router';
import { BudgetModel } from 'model/budget.model';
const router = new Router({ prefix: '/period' });

router.get('/', async (ctx) => {
    ctx.body = await BudgetModel.find({});
});

router.post('/', async (ctx) => {
    return console.log(ctx.request.body);
    await new BudgetModel(ctx.request.body).save();
    ctx.body = { msg: '保存成功' };
});

export default router;
