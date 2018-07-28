import { Document, model, Schema, SchemaTypes } from "mongoose";
const collectionName = "Group";

const schema = new Schema({
    sector: { type: SchemaTypes.ObjectId, ref: 'Sector', required: true, cn: '大部门' },
    name: { type: String, required: true, cn: "名称" },
    rewardRate: { type: Number, required: true, cn: "奖金比例" },
    admin: { type: String, required: true, cn: "负责人" },
    available: { type: Boolean, default: true, cn: "状态" },
    removed: { type: Boolean, default: false },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const GroupModel = model<Document & amb.IGroup>(collectionName, schema);

export {
    GroupModel,
};
