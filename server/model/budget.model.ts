import { BudgetSubjectType, BudgetType } from 'config/config';
import { Document, model, Schema, SchemaTypes } from 'mongoose';
import { values } from 'ramda';
const collectionName = 'Budget';

const MonthBudget = new Schema({
    month: { type: Number, required: true, cn: '月份-从0开始' },
    money: { type: Number, cn: '预算金额' },
    reality: { type: Number, cn: '实际费用' },
}, { timestamps: true, toJSON: { virtuals: true } });

const SubjectBudget = new Schema({
    subjectType: { type: String, enum: values(BudgetSubjectType), required: true, cn: '类型' },
    subjectSubType: { type: SchemaTypes.ObjectId, required: true, cn: '项目子类型' }, // ref: 'Subject' , 'ExpenseType',
    type: { type: String, enum: values(BudgetType), required: true, cn: '项目子类型' },
    monthBudgets: { type: [MonthBudget], required: true, cn: '每月预算' },
}, { timestamps: true, toJSON: { virtuals: true } });

const schema = new Schema({
    user: { type: SchemaTypes.ObjectId, ref: 'User', required: true, cn: '用户' },
    group: { type: SchemaTypes.ObjectId, ref: 'Group', required: true, cn: '阿米巴组' },
    period: { type: SchemaTypes.ObjectId, ref: 'Period', required: true, cn: '预算周期' },
    year: { type: Number, required: true, cn: '年份' },
    subjectBudgets: { type: [SubjectBudget], required: true, default: [], cn: '预算数据' },
    removed: { type: Boolean, default: false },
    sort: { type: Number, default: 0, cn: '排序' },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const BudgetModel = model<Document & amb.IBudget>(collectionName, schema);

export {
    BudgetModel,
};
