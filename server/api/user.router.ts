import Router from "koa-router";
import { GroupModel } from "model/group.model";
import { UserModel } from "model/user.model";
const router = new Router({ prefix: "/user" });

router.get("/", async (ctx) => {
    const condition = JSON.parse(ctx.query.condition) || {};
    if (condition.admin) {
        const groups = await GroupModel.find({ admin: condition.admin }, { _id: 1 });
        delete condition.admin;
        condition.groups = { $in: condition.groups ? groups.concat(condition.groups) : groups };
    }
    ctx.body = await UserModel.find(condition, { password: 0, removed: 0, extranet: 0 }).populate("groups", ["name", "_id"]);
});

router.post("/", async (ctx) => {
    await new UserModel(ctx.request.body).save();
    ctx.body = { msg: "保存成功" };
});

router.post("/:id", async (ctx) => {
    await UserModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = { msg: "保存成功" };
});

router.get("/resetPassword/:id", async (ctx) => {
    await UserModel.findOneAndUpdate(ctx.params.id, { password: "111111" });
    ctx.body = { msg: "修改密码成功!" };
});

export default router;
