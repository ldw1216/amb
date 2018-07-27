import { readdirSync } from "fs";
import { connect, set } from "mongoose";

connect(process.env.MONGOOSE_URI || "mongodb://localhost:27017/amb", { useNewUrlParser: true }, (err) => {
    if (err) { console.log("mongoose链接失败：", err); }
});

if (process.env.MONGOOSE_DEBUG) { set("debug", true); }
// mongoose.set('debug', true)
// 加载所有模型（本目录下所有文件）
const files = readdirSync(__dirname);
files.forEach((item) => {
    if (item.includes(".model.")) {  // 数据model都是大写字母开头
        require("./" + item);
    }
});
