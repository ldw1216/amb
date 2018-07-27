import { Document, model, Schema } from "mongoose";
const collectionName = "Sector";

const schema = new Schema({
    name: { type: String, required: true, unique: true, cn: "名称" },
    admin: { type: String, required: true, unique: true, cn: "备注" },
    removed: { type: Boolean, default: false },
    available: { type: Boolean, default: true, cn: "状态" },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const SectorModel = model<Document>(collectionName, schema);

export {
    SectorModel,
};
