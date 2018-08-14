import Router from 'koa-router';
import { BudgetModel } from 'model/budget.model';
import { SubjectModel } from 'model/subject.model';
const router = new Router({ prefix: '/budget' });

router.get('/totalTable', async (ctx) => {
    const year = +ctx.query.year;
    const list = await BudgetModel.aggregate([
        { $match: { year } },
        { $project: { monthBudgets: 1 } },
        { $unwind: '$monthBudgets' },
        // { $unwind: '$monthBudgets.subjectBudgets' },
        // { $project: { subjectBudgets: '$monthBudgets.subjectBudgets', month: '$monthBudgets.month', subjectId: '$monthBudgets.subjectBudgets.subjectId' } },
    ]);
    console.log(list);
    const data = [];
    let SubjectIds = await SubjectModel.find({ budgetType: '财务' }, { _id: 1 }); // 财务ID
    SubjectIds = SubjectIds.map((item) => item._id.toJSON());

    for (let i = 0; i < 12; i++) {
        const obj = { subjectBudgets: [] } as any;
        obj.month = i;
        const monthBudgets = list.filter((item: any) => item.monthBudgets.month === i);
        for (const j of monthBudgets) {
            j.monthBudgets.subjectBudgets.map((n: any) => obj.subjectBudgets.push(n));
        }
        data.push(obj);
    }
    const ambList = [];
    const amb = ['收入-阿米巴', '成本费用-阿米巴', '利润-阿米巴', '收入-财务', '成本费用-财务', '利润-财务'];
    for (const k of amb) {
        ambList.push(calculate(k, data, SubjectIds));
    }
    // console.log(ambList)
    ctx.body = ambList;
});

function structure(obj: any, i: number) {  // 计算返回
    if (!obj['ys_' + i]) obj['yszb_' + i] = undefined;
    else {
        obj['yszb_' + i] = '100.00%';
    }
    if (!obj['sj_' + i]) obj['sjzb_' + i] = 0;
    else {
        obj['sjzb_' + i] = '100.00%';
    }
    if (obj['ys_' + i] === 0) {
        obj['yswcl_' + i] = '--';
    } else {
        if (obj['ys_' + i] === 0 && obj['sj_' + i] === 0) {
            obj['yswcl_' + i] = '--';
        } else if (obj['ys_' + i] === 0 && obj['sj_' + i] > 0) {
            obj['yswcl_' + i] = '100.00%';
        } else if (obj['ys_' + i] === 0 && obj['sj_' + i] < 0) {
            obj['yswcl_' + i] = '-100.00%';
        } else if (obj['ys_' + i] > 0 && obj['sj_' + i] === 0) {
            obj['yswcl_' + i] = '0.00%';
        } else if (obj['ys_' + i] < 0 && obj['sj_' + i] === 0) {
            obj['yswcl_' + i] = '-100.00%';
        } else {
            obj['yswcl_' + i] = (obj['ys_' + i] / obj['sj_' + i] * 100).toFixed(2) + '%';
        }
    }
}

// if (!obj['ys_' + i] && obj['ys_' + i] !== 0) obj['yszb_' + i] = '--';
// else {
//     obj['yszb_' + i] = (obj['ys_' + i] / ys * 100).toFixed(2) + '%';
// }
// if (!obj['sj_' + i] && obj['sj_' + i] !== 0) obj['sjzb_' + i] = '--';
// else {
//     obj['sjzb_' + i] = (obj['sj_' + i] / sj * 100).toFixed(2) + '%';
// }
// if ((!obj['ys_' + i] && obj['ys_' + i] !== 0) || (!obj['sj_' + i] && obj['sj_' + i] !== 0)) {
//     obj['yswcl_' + i] = '--';
// } else {
//     if (obj['ys_' + i] === 0 && obj['sj_' + i] === 0) {
//         obj['yswcl_' + i] = '100.00%';
//     } else if (obj['ys_' + i] === 0 && obj['sj_' + i] > 0) {
//         obj['yswcl_' + i] = '100.00%';
//     } else if (obj['ys_' + i] === 0 && obj['sj_' + i] < 0) {
//         obj['yswcl_' + i] = '-100.00%';
//     } else if (obj['ys_' + i] > 0 && obj['sj_' + i] === 0) {
//         obj['yswcl_' + i] = '0.00%';
//     } else if (obj['sj_' + i] < 0) {
//         obj['yswcl_' + i] = ((2 - obj['sj_' + i] / obj['ys_' + i]) * 100).toFixed(2) + '%';
//     } else {
//         obj['yswcl_' + i] = (obj['ys_' + i] / obj['sj_' + i] * 100).toFixed(2) + '%';
//     }
// }
// if (!obj['ys_' + i] && obj['ys_' + i] !== 0) obj['ys_' + i] = '--';
// if (!obj['sj_' + i] && obj['sj_' + i] !== 0) obj['sj_' + i] = '--';

function calculate(key: string, data: any, SubjectIds: any) {
    let obj = { total: key } as any;
    for (let i = 0; i < 12; i++) {
        const ambData = data.find((n: any) => n.month === i).subjectBudgets;
        if (key === '收入-阿米巴') {
            obj['ys_' + i] = ambData.filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0) || undefined;
            obj['sj_' + i] = ambData.filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0) || undefined;
            structure(obj, i)
        } else if (key === '成本费用-阿米巴') {
            const ys = ambData.filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0) || undefined;
            const sj = ambData.filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0) || undefined;
            obj['ys_' + i] = ambData.filter((n: any) => n.subjectType !== 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0) || undefined;
            obj['sj_' + i] = ambData.filter((n: any) => n.subjectType !== 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0) || undefined;
            structure(obj, i)
        } else if (key === '利润-阿米巴') {
            const ys = ambData.filter((m: any) => m.subjectType === 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0) || undefined;
            const sj = ambData.filter((m: any) => m.subjectType === 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0) || undefined;
            obj['ys_' + i] = ys - ambData.filter((m: any) => m.subjectType !== 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0);
            obj['sj_' + i] = sj - ambData.filter((m: any) => m.subjectType !== 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0);
        } else if (key === '收入-财务') {
            obj['ys_' + i] = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0) || undefined;
            obj['sj_' + i] = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0) || undefined;
            structure(obj, i)
        } else if (key === '成本费用-财务') {
            const ys = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0) || undefined;
            const sj = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0) || undefined;
            obj['ys_' + i] = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType !== 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0) || undefined;
            obj['sj_' + i] = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType !== 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0) || undefined;
            structure(obj, i)
        } else if (key === '利润-财务') {
            const ys = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((m: any) => m.subjectType === 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0) || undefined;
            const sj = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((m: any) => m.subjectType === 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0) || undefined;
            obj['ys_' + i] = ys - ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((m: any) => m.subjectType !== 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0);
            obj['sj_' + i] = sj - ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((m: any) => m.subjectType !== 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0);
            structure(obj, i)
        }
    }
    return obj
    // return quarterIncome(obj);
}

function sum(list: any) {
    if (!list) {
        return { budget: undefined, reality: undefined };
    }
}
function quarterIncome(obj: any) {
    Object.assign(obj, {
        jd_ys_0: 0,
        jd_sj_0: 0,
        jd_yszb_0: '0.00%',
        jd_sjzb_0: '300.00%',
        jd_yswcl_0: '-100.00%',

        jd_ys_1: 0,
        jd_sj_1: 0,
        jd_yszb_1: '0.00%',
        jd_sjzb_1: '300.00%',
        jd_yswcl_1: '-100.00%',

        jd_ys_2: 0,
        jd_sj_2: 0,
        jd_yszb_2: '0.00%',
        jd_sjzb_2: '300.00%',
        jd_yswcl_2: '-100.00%',

        jd_ys_3: 0,
        jd_sj_3: 0,
        jd_yszb_3: '0.00%',
        jd_sjzb_3: '300.00%',
        jd_yswcl_3: '-100.00%',

        jd_ys_4: 0,
        jd_sj_4: 0,
        jd_yszb_4: '0.00%',
        jd_sjzb_4: '300.00%',
        jd_yswcl_4: '-100.00%',

        jd_ys_5: 0,
        jd_sj_5: 0,
        jd_yszb_5: '0.00%',
        jd_sjzb_5: '300.00%',
        jd_yswcl_5: '-100.00%',
    });

    // const n = Math.floor(m / 3); // 季度， 0、1、2、3
    // let
    //     quarterp[n] = quarterp[n] || {
    //         jd_ys_: '--',
    //         jd_sj_: '--',
    //         jd_yszb_: '--',
    //         jd_sjzb_: '--',
    //         jd_yswcl_: '--',
    //     };
    // for (const k in obj) {
    //     const qk = k.split('_')[0];
    // }
    // quarterp[n];
}
export default router;
