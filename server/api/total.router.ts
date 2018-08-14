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
    ]);
    console.log(list);
    const data = [];
    let SubjectIds = await SubjectModel.find({ budgetType: '财务' }, { _id: 1 }); // 财务ID
    SubjectIds = SubjectIds.map((item) => item._id.toJSON());

    for (let i = 0; i < 12; i++) {
        const obj = { subjectBudgets: [] } as any;
        obj.index = i;
        const monthBudgets = list.filter((item: any) => item.monthBudgets.index === i);
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
    quarterIncome(ambList);
    // console.log(ambList)
    ctx.body = ambList;
});

function structure(obj: any, i: number, ys?: any, sj?: any, lr?: boolean) {  // 计算返回
    if (obj['ys_' + i] === 0) obj['yszb_' + i] = '-';
    else {
        if (ys) {
            obj['yszb_' + i] = (obj['ys_' + i] / ys * 100).toFixed(2) + '%';
        } else {
            obj['yszb_' + i] = '100.00%';
        }
    }
    if (obj['sj_' + i] === 0) obj['sjzb_' + i] = '-';
    else {
        if (sj) {
            obj['sjzb_' + i] = (obj['sj_' + i] / sj * 100).toFixed(2) + '%';
        } else {
            obj['sjzb_' + i] = '100.00%';
        }
    }
    if (obj['ys_' + i] === 0) {
        if (obj['sj_' + i] >= 0) {
            obj['yswcl_' + i] = '100.00%';
        } else {
            obj['yswcl_' + i] = '-100.00%';
        }
    } else {
        if (lr && obj['ys_' + i] < 0) {
            obj['yswcl_' + i] = ((2 - obj['sj_' + i] / obj['ys_' + i]) * 100).toFixed(2) + '%';
        } else {
            obj['yswcl_' + i] = (obj['sj_' + i] / obj['ys_' + i] * 100).toFixed(2) + '%';
        }

    }
}

function calculate(key: string, data: any, SubjectIds: any) {
    const obj = { total: key } as any;
    for (let i = 0; i < 12; i++) {
        const ambData = data.find((n: any) => n.index === i).subjectBudgets;
        if (key === '收入-阿米巴') {
            obj['ys_' + i] = ambData.filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0);
            obj['sj_' + i] = ambData.filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0);
            structure(obj, i);
        } else if (key === '成本费用-阿米巴') {
            const ys = ambData.filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0);
            const sj = ambData.filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0);
            obj['ys_' + i] = ambData.filter((n: any) => n.subjectType !== 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0);
            obj['sj_' + i] = ambData.filter((n: any) => n.subjectType !== 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0);
            structure(obj, i, ys, sj);
        } else if (key === '利润-阿米巴') {
            const ys = ambData.filter((m: any) => m.subjectType === 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0);
            const sj = ambData.filter((m: any) => m.subjectType === 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0);
            obj['ys_' + i] = ys - ambData.filter((m: any) => m.subjectType !== 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0);
            obj['sj_' + i] = sj - ambData.filter((m: any) => m.subjectType !== 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0);
            structure(obj, i, 0, 0, true);
        } else if (key === '收入-财务') {
            obj['ys_' + i] = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0);
            obj['sj_' + i] = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0);
            structure(obj, i);
        } else if (key === '成本费用-财务') {
            const ys = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0);
            const sj = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType === 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0);
            obj['ys_' + i] = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType !== 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0);
            obj['sj_' + i] = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType !== 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0);
            structure(obj, i, ys, sj);
        } else if (key === '利润-财务') {
            const ys = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((m: any) => m.subjectType === 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0);
            const sj = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((m: any) => m.subjectType === 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0);
            obj['ys_' + i] = ys - ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((m: any) => m.subjectType !== 'income').reduce((a: any, b: any) => a + (b.budget || 0), 0);
            obj['sj_' + i] = sj - ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((m: any) => m.subjectType !== 'income').reduce((a: any, b: any) => a + (b.reality || 0), 0);
            structure(obj, i, 0, 0, true);
        }
    }
    return obj;
}

function sum(list: any) {
    if (!list) {
        return { budget: undefined, reality: undefined };
    }
}
/**
 * 计算季度、半年、全年数据
 * @param list
 */
function quarterIncome(list: any) {
    list.forEach((obj: any, i: number) => {
        Object.assign(obj, {
            jd_ys_0: 0,
            jd_sj_0: 0,
            jd_yszb_0: '0.00%',
            jd_sjzb_0: '0.00%',
            jd_yswcl_0: '0.00%',

            jd_ys_1: 0,
            jd_sj_1: 0,
            jd_yszb_1: '0.00%',
            jd_sjzb_1: '0.00%',
            jd_yswcl_1: '0.00%',

            jd_ys_2: 0,
            jd_sj_2: 0,
            jd_yszb_2: '0.00%',
            jd_sjzb_2: '0.00%',
            jd_yswcl_2: '0.00%',

            jd_ys_3: 0,
            jd_sj_3: 0,
            jd_yszb_3: '0.00%',
            jd_sjzb_3: '0.00%',
            jd_yswcl_3: '0.00%',

            jd_ys_4: 0,
            jd_sj_4: 0,
            jd_yszb_4: '0.00%',
            jd_sjzb_4: '0.00%',
            jd_yswcl_4: '0.00%',

            jd_ys_5: 0,
            jd_sj_5: 0,
            jd_yszb_5: '0.00%',
            jd_sjzb_5: '0.00%',
            jd_yswcl_5: '0.00%',
        });
        for (const k of Object.keys(obj)) {
            const ks = k.split('_');
            if (['ys', 'sj'].includes(ks[0])) {
                const m = +ks[1];
                const n = Math.floor(m / 3); // 季度， 0、1、2、3
                const jdk = ['jd', ks[0], n].join('_');
                obj[jdk] = obj[jdk] || 0;
                obj[jdk] += obj[k];
            }
        }
        // 半年
        obj.jd_ys_4 = (obj.jd_ys_0 || 0) + (obj.jd_ys_1 || 0);
        obj.jd_sj_4 = (obj.jd_sj_0 || 0) + (obj.jd_sj_1 || 0);
        // 全年
        obj.jd_ys_5 = obj.jd_ys_4 + (obj.jd_ys_2 || 0) + (obj.jd_ys_3 || 0);
        obj.jd_sj_5 = obj.jd_sj_4 + (obj.jd_sj_2 || 0) + (obj.jd_sj_3 || 0);

        for (const k of Object.keys(obj)) {
            const ks = k.split('_');
            const n = +ks[2]; // 季度， 0、1、2、3
            const byzb = i < 3 ? list[0] : list[3]; //  收入阿米巴 /收入财务
            if ('yszb' === ks[1]) { // 预算占比
                obj[k] = getRatio(obj[`jd_ys_${n}`], byzb[`jd_ys_${n}`]);
            } else if ('sjzb' === ks[1]) { // 实际占比
                obj[k] = getRatio(obj[`jd_sj_${n}`], byzb[`jd_sj_${n}`]);
            } else if ('yswcl' === ks[1]) { // 预算完成率
                obj[k] = getRatio(obj[`jd_sj_${n}`], obj[`jd_ys_${n}`], true, i);
            }
        }
    });
    return list;
}

function getRatio(n1: any, n2: any, isYswcl?: boolean, i?: number) {
    if (isYswcl) {
        if (n2 === 0) {
            if (n1 >= 0) {
                return '100.00%';
            } else {
                return '-100.00%';
            }
        } else {
            if ((i === 3 || i === 6) && n2 < 0) {
                return ((2 - n1 / n2) * 100).toFixed(2) + '%';
            } else {
                return (n1 / n2 * 100).toFixed(2) + '%';
            }
        }
    } else {
        if (n1 === 0) {
            return '-';
        } else if (!n2) {
            return '100.00%';
        } else {
            return (n1 / n2 * 100).toFixed(2) + '%';
        }
    }

}
export default router;
