import Router from "koa-router";
import { PeriodModel } from "model/period.model";
const router = new Router({ prefix: "/period" });

router.get("/", async (ctx) => {
    ctx.body = await PeriodModel.find({}).populate("groups", ["name", "_id"]);
});

router.post("/", async (ctx) => {
    await new PeriodModel(ctx.request.body).save();
    ctx.body = { msg: "保存成功" };
});

router.post("/:id", async (ctx) => {
    await PeriodModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = { msg: "保存成功" };
});

export default router;
