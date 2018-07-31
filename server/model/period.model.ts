import { Document, model, Schema, SchemaTypes } from "mongoose";
const collectionName = "Period";

const schema = new Schema({
    duration: { type: [Date], required: true, cn: "时间" },
    year: { type: Number, required: true, cn: "年度" },
    quarters: { type: [{ type: String, enum: ["一季度", "二季度", "三季度", "四季度"] }], required: true, cn: "季度" },
    groups: { type: [{ type: SchemaTypes.ObjectId, ref: "Group" }], default: [], required: true, cn: "阿米巴组" },
    allGroup: { type: Boolean, default: true, required: true, cn: "全部组" },
    removed: { type: Boolean, default: false },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const PeriodModel = model<Document & amb.IPeriod>(collectionName, schema);

export {
    PeriodModel,
};

// new PeriodModel({
//     duration: [new Date(), new Date()],
//     year: 2018,
//     quarters: "一季度",
//     groups: "5b5da558f97e81209d5cfcbd",
// }).save().then(console.log);
