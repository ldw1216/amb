import Router from 'koa-router';
import { UserModel } from 'model/user.model';
const router = new Router({ prefix: '/sign' });

router.post('/login', async (ctx) => {
    const { account, password } = ctx.request.body as any;
    const user = await UserModel.findOne({ available: true, account, password, removed: false }, { password: 0 }).populate('groups').then((doc) => doc && doc.toJSON()) as any;
    if (user) {
        ctx.session!.user = user;
        return ctx.body = { msg: '登录成功！' };
    } else {
        return ctx.throw(400, '用户名或密码错误！');
    }
});

router.get('/logout', async (ctx: any) => {
    ctx.session.user = null;
    ctx.body = { msg: '退出成功！' };
});
export default router;
