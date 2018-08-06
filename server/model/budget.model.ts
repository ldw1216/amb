import { BudgetSubjectType, BudgetType } from 'config/config';
import { Document, model, Schema, SchemaTypes } from 'mongoose';
import { values } from 'ramda';
const collectionName = 'Budget';

const budget = new Schema({
    month: { type: Number, required: true, cn: '月份-从0开始' },
    projectType: { type: String, enum: values(BudgetSubjectType), required: true, cn: '类型' },
    projectSubType: { type: SchemaTypes.ObjectId, ref: 'Subject', required: true, cn: '项目子类型' },
    type: { type: String, enum: values(BudgetType), required: true, cn: '项目子类型' },
    money: { type: Number, required: true, cn: '预算金额' },
}, { timestamps: true, toJSON: { virtuals: true } });

const schema = new Schema({
    user: { type: SchemaTypes.ObjectId, ref: 'User', required: true, cn: '用户' },
    ambGroup: { type: SchemaTypes.ObjectId, ref: 'Group', required: true, cn: '阿米巴组' },
    period: { type: SchemaTypes.ObjectId, ref: 'Period', required: true, cn: '预算周期' },
    year: { type: Number, required: true, cn: '年份' },
    budgets: { type: [budget], required: true, default: [], cn: '预算数据' },
    removed: { type: Boolean, default: false },
    sort: { type: Number, default: 0, cn: '排序' },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const SubjectModel = model<Document & amb.IBudget>(collectionName, schema);

export {
    SubjectModel,
};
