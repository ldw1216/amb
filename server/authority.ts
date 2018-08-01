import Koa from "koa";

export default async (ctx: Koa.Context, next: () => Promise<any>) => {
    if (ctx.path.includes("/sign")) return await next();
    if (!ctx.session!.user) {
        ctx.body = { ...ctx.body, name: "NOT LOGIN" };
        return ctx.throw(401, "需要登录！");
    } else await next();
};
