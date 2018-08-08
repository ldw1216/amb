import { Document, model, Schema, SchemaTypes } from 'mongoose';
const collectionName = 'Period';

const schema = new Schema({
    duration: { type: [Date], required: true, cn: '时间' },
    year: { type: Number, required: true, cn: '年度' },
    quarters: { type: [{ type: String, enum: ['一季度', '二季度', '三季度', '四季度'] }], required: true, cn: '季度' },
    groups: { type: [{ type: SchemaTypes.ObjectId, ref: 'Group' }], default: [], required: true, cn: '阿米巴组' },
    allGroup: { type: Boolean, default: true, required: true, cn: '全部组' },
    removed: { type: Boolean, default: false },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const PeriodModel = model<Document & amb.IPeriod>(collectionName, schema);

/**
 *
 * @param groupIds 获取每个组的当前排期
 */
async function getCurrentPeriod(groupIds: string[]) {
    const periods = await PeriodModel.find({
        'duration.0': { $lte: new Date() },
        'duration.1': { $gte: new Date() },
        '$or': [{ groups: { $in: groupIds } }, { allGroup: true }],
    }).sort({ _id: -1 }).then((list) => list.map((item) => item.toJSON()));
    return groupIds.map((item) => {
        return [
            item,
            periods.find((period) => period.allGroup === true || period.groups.some((groupId: any) => groupId.toString() === item)),
        ];
    });
}
// getCurrentPeriod(['5b5da558f97e81209d5cfcbd', '5b5da575f97e81209d5cfcbe']).then(console.log);
export {
    PeriodModel,
    getCurrentPeriod,
};

// new PeriodModel({
//     duration: [new Date(), new Date()],
//     year: 2018,
//     quarters: "一季度",
//     groups: "5b5da558f97e81209d5cfcbd",
// }).save().then(console.log);
