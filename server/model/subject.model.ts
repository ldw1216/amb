import { BudgetSubjectType, BudgetType } from 'config/config';
import { Document, model, Schema, SchemaTypes } from 'mongoose';
import { values } from 'ramda';
const collectionName = 'Subject';

const schema = new Schema({
    name: { type: String, required: true, cn: '名称' }, // subjectSubType
    year: { type: Number, required: true, cn: '年份' },
    group: { type: SchemaTypes.ObjectId, ref: 'Group', required: true, cn: '阿米巴组' },
    subjectType: { type: String, enum: values(BudgetSubjectType), required: true, cn: '项目类型： 收入 成本 费用' },
    budgetType: { type: String, enum: values(BudgetType), required: true, cn: '预算类型：财务 阿米巴' },
    removed: { type: Boolean, default: false },
    sort: { type: Number, default: 0, cn: '排序' },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const SubjectModel = model<Document & amb.IBudgetSubject>(collectionName, schema);

export {
    SubjectModel,
};
