import Router from 'koa-router';
import { ExpenseTypeModel } from 'model/expense-type.model';
const router = new Router({ prefix: '/expense-type' });

router.get('/', async (ctx) => {
    ctx.body = await ExpenseTypeModel.find();
});

router.post('/', async (ctx) => {
    await new ExpenseTypeModel(ctx.request.body).save();
    ctx.body = { msg: '保存成功' };
});

router.post('/:id', async (ctx) => {
    await ExpenseTypeModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = { msg: '保存成功' };
});

export default router;
