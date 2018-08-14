import Router from 'koa-router';
import { BudgetModel } from 'model/budget.model';
import { SubjectModel } from 'model/subject.model'
const router = new Router({ prefix: '/budget' });

router.get('/totalTable', async (ctx) => {
    const year = +ctx.query.year
    const list = await BudgetModel.aggregate([
        { $match: { year: year } },
        { $project: { monthBudgets: 1 } },
        { $unwind: '$monthBudgets' },
        // { $unwind: '$monthBudgets.subjectBudgets' },
        // { $project: { subjectBudgets: '$monthBudgets.subjectBudgets', month: '$monthBudgets.month', subjectId: '$monthBudgets.subjectBudgets.subjectId' } },
    ])
    console.log(list)
    const data = []
    let SubjectIds = await SubjectModel.find({ budgetType: '财务' }, { _id: 1 }) // 财务ID
    SubjectIds = SubjectIds.map(item => item._id.toJSON())

    for (let i = 0; i < 12; i++) {
        let obj = { subjectBudgets: [] } as any
        obj.month = i
        let monthBudgets = list.filter((item: any) => item.monthBudgets.month === i)
        for (let j of monthBudgets) {
            j.monthBudgets.subjectBudgets.map((n: any) => obj.subjectBudgets.push(n))
        }
        data.push(obj)
    }
    const ambList = []
    let amb = ['收入-阿米巴', '成本费用-阿米巴', '利润-阿米巴', '收入-财务', '成本费用-财务', '利润-财务']
    for (let k of amb) {
        ambList.push(calculate(k, data, SubjectIds))
    }
    // console.log(ambList)
    ctx.body = ambList
});

function calculate(key: string, data: any, SubjectIds: any) {
    let obj = { total: key } as any
    for (let i = 0; i < 12; i++) {
        if (key === '收入-阿米巴') {
            let ambData = data.find((n: any) => n.month === i).subjectBudgets
            obj['ys_' + i] = ambData.filter((n: any) => n.subjectType == 'income').reduce((a: any, b: any) => a + b.budget, 0) || undefined
            obj['sj_' + i] = ambData.filter((n: any) => n.subjectType == 'income').reduce((a: any, b: any) => a + b.reality, 0) || undefined
            if (!obj['ys_' + i] && obj['ys_' + i] !== 0) obj['yszb_' + i] = '--'
            else {
                obj['yszb_' + i] = '100.00%'
            }
            if (!obj['sj_' + i] && obj['sj_' + i] !== 0) obj['sjzb_' + i] = '--'
            else {
                obj['sjzb_' + i] = '100.00%'
            }
            if ((!obj['ys_' + i] && obj['ys_' + i] !== 0) || (!obj['sj_' + i] && obj['sj_' + i] !== 0)) {
                obj['yswcl_' + i] = '--'
            } else {
                if (obj['ys_' + i] === 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '100.00%'
                } else if (obj['ys_' + i] === 0 && obj['sj_' + i] > 0) {
                    obj['yswcl_' + i] = '100.00%'
                } else if (obj['ys_' + i] === 0 && obj['sj_' + i] < 0) {
                    obj['yswcl_' + i] = '-100.00%'
                } else if (obj['ys_' + i] > 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '0.00%'
                } else if (obj['ys_' + i] < 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '-100.00%'
                } else {
                    obj['yswcl_' + i] = (obj['ys_' + i] / obj['sj_' + i] * 100).toFixed(2) + '%'
                }
            }
            if (!obj['ys_' + i] && obj['ys_' + i] !== 0) obj['ys_' + i] = '--'
            if (!obj['sj_' + i] && obj['sj_' + i] !== 0) obj['sj_' + i] = '--'
        } else if (key === '成本费用-阿米巴') {
            let ambData = data.find((n: any) => n.month === i).subjectBudgets
            let ys = ambData.filter((n: any) => n.subjectType == 'income').reduce((a: any, b: any) => a + b.budget, 0) || undefined
            let sj = ambData.filter((n: any) => n.subjectType == 'income').reduce((a: any, b: any) => a + b.reality, 0) || undefined
            obj['ys_' + i] = ambData.filter((n: any) => n.subjectType !== 'income').reduce((a: any, b: any) => a + b.budget, 0) || undefined
            obj['sj_' + i] = ambData.filter((n: any) => n.subjectType !== 'income').reduce((a: any, b: any) => a + b.reality, 0) || undefined
            if (!obj['ys_' + i] && obj['ys_' + i] !== 0) obj['yszb_' + i] = '--'
            else {
                obj['yszb_' + i] = (obj['ys_' + i] / ys * 100).toFixed(2) + '%'
            }
            if (!obj['sj_' + i] && obj['sj_' + i] !== 0) obj['sjzb_' + i] = '--'
            else {
                obj['sjzb_' + i] = (obj['sj_' + i] / sj * 100).toFixed(2) + '%'
            }
            if ((!obj['ys_' + i] && obj['ys_' + i] !== 0) || (!obj['sj_' + i] && obj['sj_' + i] !== 0)) {
                obj['yswcl_' + i] = '--'
            } else {
                if (obj['ys_' + i] === 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '100.00%'
                } else if (obj['ys_' + i] === 0 && obj['sj_' + i] > 0) {
                    obj['yswcl_' + i] = '100.00%'
                } else if (obj['ys_' + i] === 0 && obj['sj_' + i] < 0) {
                    obj['yswcl_' + i] = '-100.00%'
                } else if (obj['ys_' + i] > 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '0.00%'
                } else if (obj['ys_' + i] < 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '-100.00%'
                } else {
                    obj['yswcl_' + i] = (obj['ys_' + i] / obj['sj_' + i] * 100).toFixed(2) + '%'
                }
            }
            if (!obj['ys_' + i] && obj['ys_' + i] !== 0) obj['ys_' + i] = '--'
            if (!obj['sj_' + i] && obj['sj_' + i] !== 0) obj['sj_' + i] = '--'
        } else if (key === '利润-阿米巴') {
            let ambData = data.find((n: any) => n.month === i).subjectBudgets
            let ys = ambData.filter((m: any) => m.subjectType === 'income').reduce((a: any, b: any) => a + b.budget, 0) || undefined
            let sj = ambData.filter((m: any) => m.subjectType === 'income').reduce((a: any, b: any) => a + b.reality, 0) || undefined
            obj['ys_' + i] = ys - ambData.filter((m: any) => m.subjectType !== 'income').reduce((a: any, b: any) => a + b.budget, 0)
            obj['sj_' + i] = sj - ambData.filter((m: any) => m.subjectType !== 'income').reduce((a: any, b: any) => a + b.reality, 0)
            if (!obj['ys_' + i] && obj['ys_' + i] !== 0) obj['yszb_' + i] = '--'
            else {
                obj['yszb_' + i] = (obj['ys_' + i] / ys * 100).toFixed(2) + '%'
            }
            if (!obj['sj_' + i] && obj['sj_' + i] !== 0) obj['sjzb_' + i] = '--'
            else {
                obj['sjzb_' + i] = (obj['sj_' + i] / sj * 100).toFixed(2) + '%'
            }
            if ((!obj['ys_' + i] && obj['ys_' + i] !== 0) || (!obj['sj_' + i] && obj['sj_' + i] !== 0)) {
                obj['yswcl_' + i] = '--'
            } else {
                if (obj['ys_' + i] === 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '100.00%'
                } else if (obj['ys_' + i] === 0 && obj['sj_' + i] > 0) {
                    obj['yswcl_' + i] = '100.00%'
                } else if (obj['ys_' + i] === 0 && obj['sj_' + i] < 0) {
                    obj['yswcl_' + i] = '-100.00%'
                } else if (obj['ys_' + i] > 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '0.00%'
                } else if (obj['sj_' + i] < 0) {
                    obj['yswcl_' + i] = ((2 - obj['sj_' + i] / obj['ys_' + i]) * 100).toFixed(2) + '%'
                } else {
                    obj['yswcl_' + i] = (obj['ys_' + i] / obj['sj_' + i] * 100).toFixed(2) + '%'
                }
            }
            if (!obj['ys_' + i] && obj['ys_' + i] !== 0) obj['ys_' + i] = '--'
            if (!obj['sj_' + i] && obj['sj_' + i] !== 0) obj['sj_' + i] = '--'
        } else if (key === '收入-财务') {
            let ambData = data.find((n: any) => n.month === i).subjectBudgets
            obj['ys_' + i] = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType == 'income').reduce((a: any, b: any) => a + b.budget, 0) || undefined
            obj['sj_' + i] = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType == 'income').reduce((a: any, b: any) => a + b.reality, 0) || undefined
            if (!obj['ys_' + i] && obj['ys_' + i] !== 0) obj['yszb_' + i] = '--'
            else {
                obj['yszb_' + i] = '100.00%'
            }
            if (!obj['sj_' + i] && obj['sj_' + i] !== 0) obj['sjzb_' + i] = '--'
            else {
                obj['sjzb_' + i] = '100.00%'
            }
            if ((!obj['ys_' + i] && obj['ys_' + i] !== 0) || (!obj['sj_' + i] && obj['sj_' + i] !== 0)) {
                obj['yswcl_' + i] = '--'
            } else {
                if (obj['ys_' + i] === 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '100.00%'
                } else if (obj['ys_' + i] === 0 && obj['sj_' + i] > 0) {
                    obj['yswcl_' + i] = '100.00%'
                } else if (obj['ys_' + i] === 0 && obj['sj_' + i] < 0) {
                    obj['yswcl_' + i] = '-100.00%'
                } else if (obj['ys_' + i] > 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '0.00%'
                } else if (obj['ys_' + i] < 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '-100.00%'
                } else {
                    obj['yswcl_' + i] = (obj['ys_' + i] / obj['sj_' + i] * 100).toFixed(2) + '%'
                }
            }
            if (!obj['ys_' + i] && obj['ys_' + i] !== 0) obj['ys_' + i] = '--'
            if (!obj['sj_' + i] && obj['sj_' + i] !== 0) obj['sj_' + i] = '--'
        } else if (key === '成本费用-财务') {
            let ambData = data.find((n: any) => n.month === i).subjectBudgets
            let ys = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType == 'income').reduce((a: any, b: any) => a + b.budget, 0) || undefined
            let sj = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType == 'income').reduce((a: any, b: any) => a + b.reality, 0) || undefined
            obj['ys_' + i] = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType !== 'income').reduce((a: any, b: any) => a + b.budget, 0) || undefined
            obj['sj_' + i] = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((n: any) => n.subjectType !== 'income').reduce((a: any, b: any) => a + b.reality, 0) || undefined
            if (!obj['ys_' + i] && obj['ys_' + i] !== 0) obj['yszb_' + i] = '--'
            else {
                obj['yszb_' + i] = (obj['ys_' + i] / ys * 100).toFixed(2) + '%'
            }
            if (!obj['sj_' + i] && obj['sj_' + i] !== 0) obj['sjzb_' + i] = '--'
            else {
                obj['sjzb_' + i] = (obj['sj_' + i] / sj * 100).toFixed(2) + '%'
            }
            if ((!obj['ys_' + i] && obj['ys_' + i] !== 0) || (!obj['sj_' + i] && obj['sj_' + i] !== 0)) {
                obj['yswcl_' + i] = '--'
            } else {
                if (obj['ys_' + i] === 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '100.00%'
                } else if (obj['ys_' + i] === 0 && obj['sj_' + i] > 0) {
                    obj['yswcl_' + i] = '100.00%'
                } else if (obj['ys_' + i] === 0 && obj['sj_' + i] < 0) {
                    obj['yswcl_' + i] = '-100.00%'
                } else if (obj['ys_' + i] > 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '0.00%'
                } else if (obj['ys_' + i] < 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '-100.00%'
                } else {
                    obj['yswcl_' + i] = (obj['ys_' + i] / obj['sj_' + i] * 100).toFixed(2) + '%'
                }
            }
            if (!obj['ys_' + i] && obj['ys_' + i] !== 0) obj['ys_' + i] = '--'
            if (!obj['sj_' + i] && obj['sj_' + i] !== 0) obj['sj_' + i] = '--'
        } else if (key === '利润-财务') {
            let ambData = data.find((n: any) => n.month === i).subjectBudgets
            let ys = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((m: any) => m.subjectType === 'income').reduce((a: any, b: any) => a + b.budget, 0) || undefined
            let sj = ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((m: any) => m.subjectType === 'income').reduce((a: any, b: any) => a + b.reality, 0) || undefined
            obj['ys_' + i] = ys - ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((m: any) => m.subjectType !== 'income').reduce((a: any, b: any) => a + b.budget, 0)
            obj['sj_' + i] = sj - ambData.filter((n: any) => SubjectIds.includes(n.subjectId)).filter((m: any) => m.subjectType !== 'income').reduce((a: any, b: any) => a + b.reality, 0)
            if (!obj['ys_' + i] && obj['ys_' + i] !== 0) obj['yszb_' + i] = '--'
            else {
                obj['yszb_' + i] = (obj['ys_' + i] / ys * 100).toFixed(2) + '%'
            }
            if (!obj['sj_' + i] && obj['sj_' + i] !== 0) obj['sjzb_' + i] = '--'
            else {
                obj['sjzb_' + i] = (obj['sj_' + i] / sj * 100).toFixed(2) + '%'
            }
            if ((!obj['ys_' + i] && obj['ys_' + i] !== 0) || (!obj['sj_' + i] && obj['sj_' + i] !== 0)) {
                obj['yswcl_' + i] = '--'
            } else {
                if (obj['ys_' + i] === 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '100.00%'
                } else if (obj['ys_' + i] === 0 && obj['sj_' + i] > 0) {
                    obj['yswcl_' + i] = '100.00%'
                } else if (obj['ys_' + i] === 0 && obj['sj_' + i] < 0) {
                    obj['yswcl_' + i] = '-100.00%'
                } else if (obj['ys_' + i] > 0 && obj['sj_' + i] === 0) {
                    obj['yswcl_' + i] = '0.00%'
                } else if (obj['sj_' + i] < 0) {
                    obj['yswcl_' + i] = ((2 - obj['sj_' + i] / obj['ys_' + i]) * 100).toFixed(2) + '%'
                } else {
                    obj['yswcl_' + i] = (obj['ys_' + i] / obj['sj_' + i] * 100).toFixed(2) + '%'
                }
            }
            if (!obj['ys_' + i] && obj['ys_' + i] !== 0) obj['ys_' + i] = '--'
            if (!obj['sj_' + i] && obj['sj_' + i] !== 0) obj['sj_' + i] = '--'
        }
    }
    return obj
}

function sum(list: any) {
    if (!list) {
        return { budget: undefined, reality: undefined }
    }
}


export default router;
