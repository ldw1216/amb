import Router from "koa-router";
import { SectorModel } from "../model/Sector";
const router = new Router({ prefix: "/sector" });

router.get("/", async (ctx) => {
    ctx.body = await SectorModel.find();
});

router.get("/string", async (ctx) => {
    ctx.body = "koa2 string";
});

router.get("/json", async (ctx) => {
    ctx.body = {
        title: "koa2 json",
    };
});

export default router;
