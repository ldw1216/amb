import Router from "koa-router";
import { CostModel } from "model/cost.model";
const router = new Router({ prefix: "/cost" });

router.get("/", async (ctx) => {
    ctx.body = await CostModel.find();
});

router.post("/", async (ctx) => {
    await new CostModel(ctx.request.body).save();
    ctx.body = { msg: "保存成功" };
});

router.post("/:id", async (ctx) => {
    await CostModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = { msg: "保存成功" };
});

export default router;
