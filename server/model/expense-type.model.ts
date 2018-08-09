import { BudgetType } from 'config/config';
import { Document, model, Schema, SchemaTypes } from 'mongoose';
const collectionName = 'ExpenseType';

const optionSchema = new Schema({
    name: { type: String, required: true },
    budgetType: { type: String, enum: Object.keys(BudgetType), default: '财务' },
}, { timestamps: true, toJSON: { virtuals: true } });

const schema = new Schema({
    year: { type: Number, required: true, unique: true, cn: '年度' },
    options: { type: [optionSchema], default: [], cn: '配置项' },
    removed: { type: Boolean, default: false },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const ExpenseTypeModel = model<Document & amb.IExpenseType>(collectionName, schema);

export {
    ExpenseTypeModel,
};
