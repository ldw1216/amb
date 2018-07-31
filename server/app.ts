import Koa from "koa";
import session from "koa-session";
import koaStatic from "koa-static";
import path from "path";

import tracer from "model/log.model";
import sourceMapSupport from "source-map-support";
import router from "./api";

const app = new Koa();
const json = require("koa-json");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const onError = require("koa-onerror");

if (process.env.NODE_ENV === "development") { sourceMapSupport.install(); }
import "./model";

onError(app);
app.use(koaStatic(path.resolve("dist")));
// 前端项目路由
if (process.env.NODE_ENV === "production") {
    const template = require("fs").readFileSync(path.resolve("dist/client/index.html"), "utf-8");
    app.use(async (ctx, next) => {
        if (
            ctx.accepts("html", "json") === "json" ||
            ctx.headers && ctx.headers["content-type"] &&
            ctx.headers["content-type"].includes("form-data")) {
            return await next();
        }
        return ctx.body = template;
    });
}

// 健康检查
app.use(async (ctx, next) => {
    if (ctx.url === "/checkup" || ctx.url === "/favicon.ico") {
        ctx.body = "ok";
    } else { await next(); }
});
app.keys = ["some secret li amb"];

app.use(session({
    key: "koa:sess33", /** (string) cookie key (default is koa:sess) */
    maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
} as any, app));
// middlewares

app.use(bodyparser({
    enableTypes: ["json", "form", "text"],
}));
app.use(json());
app.use(logger());

// logger
app.use(async (ctx: any, next: any) => {
    const start = new Date().valueOf();
    await next();
    const ms = new Date().valueOf() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(router.routes());

// error-handling
app.on("error", (err: Error, ctx: any) => {
    console.error("server error url: " + ctx.url, "\n", err.message, "\n", err.stack);
});

module.exports = app;

process.on("uncaughtException", (err) => {
    tracer.error("有未捕获的错误 uncaughtException：", err);
    console.log(err);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.log("reason:", reason);
    tracer.error("有未捕获的错误 unhandledRejection", reason);
});
