import Router from 'koa-router';
import { ProjectModel } from 'model/project.model';
const router = new Router({ prefix: '/project' });

router.get('/', async (ctx) => {
    ctx.body = await ProjectModel.find().populate('sector', ['name', '_id']);
});

router.post('/', async (ctx) => {
    await new ProjectModel(ctx.request.body).save();
    ctx.body = { msg: '保存成功' };
});

router.post('/:id', async (ctx) => {
    await ProjectModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = { msg: '保存成功' };
});

export default router;
