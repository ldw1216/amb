import Router from "koa-router";
import { SectorModel } from "../model/sector.model";
const router = new Router({ prefix: "/sector" });

router.get("/", async (ctx) => {
    ctx.body = await SectorModel.find();
});

router.post("/", async (ctx) => {
    await new SectorModel(ctx.request.body).save();
    ctx.body = { msg: "保存成功" };
});

router.post("/:id", async (ctx) => {
    await SectorModel.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    ctx.body = { msg: "保存成功" };
});


router.delete("/:id", async (ctx) => {
    await SectorModel.findByIdAndRemove(ctx.query.id);
    ctx.body = { msg: "删除成功" };
});

export default router;
