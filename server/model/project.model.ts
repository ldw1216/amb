import { BudgetProjectType } from 'config/config';
import { Document, model, Schema, SchemaTypes } from 'mongoose';
const collectionName = 'Project';

const schema = new Schema({
    name: { type: String, required: true, cn: '名称' },
    year: { type: Number, required: true, cn: '年份' },
    ambGroup: { type: SchemaTypes.ObjectId, ref: 'Group', required: true, cn: '阿米巴组' },
    subjectType: { type: String, enum: Object.keys(BudgetProjectType), required: true, cn: '收入主类型' },
    removed: { type: Boolean, default: false },
    sort: { type: Number, default: 0, cn: '排序' },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const ProjectModel = model<Document & amb.IBudgetSubject>(collectionName, schema);

export {
    ProjectModel,
};
