import Router from "koa-router";
import { UserModel } from "model/user.model";
const router = new Router({ prefix: "/user" });

router.get("/", async (ctx) => {
    ctx.body = await UserModel.find({}, { password: 0, removed: 0, extranet: 0 }).populate("group", ["name", "_id"]);
});

router.post("/", async (ctx) => {
    await new UserModel(ctx.request.body).save();
    ctx.body = { msg: "保存成功" };
});

router.post("/:id", async (ctx) => {
    await UserModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = { msg: "保存成功" };
});

export default router;
