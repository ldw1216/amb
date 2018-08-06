import { BudgetSubjectType } from 'config/config';
import { Document, model, Schema, SchemaTypes } from 'mongoose';
import { values } from 'ramda';
const collectionName = 'Subject';

const schema = new Schema({
    name: { type: String, required: true, cn: '名称' },
    year: { type: Number, required: true, cn: '年份' },
    ambGroup: { type: SchemaTypes.ObjectId, ref: 'Group', required: true, cn: '阿米巴组' },
    type: { type: String, enum: values(BudgetSubjectType), required: true, cn: '收入主类型' },
    removed: { type: Boolean, default: false },
    sort: { type: Number, default: 0, cn: '排序' },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const SubjectModel = model<Document & amb.IBudgetSubject>(collectionName, schema);

export {
    SubjectModel,
};
