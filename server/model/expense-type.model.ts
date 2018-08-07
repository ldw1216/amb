import { Document, model, Schema, SchemaTypes } from 'mongoose';
const collectionName = 'ExpenseType';

const optionSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['财务', '阿米巴'], default: '财务' },
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
