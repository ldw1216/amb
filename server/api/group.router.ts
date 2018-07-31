import Router from "koa-router";
import { GroupModel } from "model/group.model";
const router = new Router({ prefix: "/group" });

router.get("/", async (ctx) => {
    ctx.body = await GroupModel.find().populate("sector", ["name", "_id"]);
});

router.post("/", async (ctx) => {
    await new GroupModel(ctx.request.body).save();
    ctx.body = { msg: "保存成功" };
});

router.post("/:id", async (ctx) => {
    await GroupModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = { msg: "保存成功" };
});

export default router;
