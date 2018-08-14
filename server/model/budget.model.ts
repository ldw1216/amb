import { ApprovalState, BudgetSubjectType, BudgetType } from 'config/config';
import { Document, model, Schema, SchemaTypes } from 'mongoose';
import { values } from 'ramda';
const collectionName = 'Budget';

// 预算合计
const MothBudgetSum = new Schema({
    income: Number, // 预算总收入
    cost: Number, // 预算总成本
    expense: Number, // 预算总费用
    profit: Number, // 毛利
    reward: Number, // 奖金
    purProfit: Number, // 利润
});

const SubjectBudget = new Schema({
    budget: { type: Number, cn: '预算金额' },
    reality: { type: Number, cn: '实际费用' },
    subjectId: String,
    subjectType: { type: String, enum: values(BudgetSubjectType), required: true, cn: '类型' },
    subjectName: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const MonthBudget = new Schema({
    index: { type: Number, required: true, cn: '月份-从0开始' },
    name: String,
    rewardRate: Number,
    budget: { type: MothBudgetSum, cn: '预算合计' },
    reality: { type: MothBudgetSum, cn: '实际合计' },
    subjectBudgets: { type: [SubjectBudget], required: true, default: [], cn: '各项目的预算' },
}, { timestamps: true, toJSON: { virtuals: true } });

const schema = new Schema({
    approvalState: { type: Number, enum: Object.keys(ApprovalState), default: ApprovalState.草稿, required: true, cn: '审核状态' },
    user: { type: SchemaTypes.ObjectId, ref: 'User', required: true, cn: '用户' },
    group: { type: SchemaTypes.ObjectId, ref: 'Group', required: true, cn: '阿米巴组' },
    period: { type: SchemaTypes.ObjectId, ref: 'Period', required: true, cn: '预算周期' },
    year: { type: Number, required: true, cn: '年份' },
    monthBudgets: { type: [MonthBudget], required: true, default: [], cn: '各月的预算数据' },
    removed: { type: Boolean, default: false },
    sort: { type: Number, default: 0, cn: '排序' },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const BudgetModel = model<Document & amb.IBudget>(collectionName, schema);

export {
    BudgetModel,
};
