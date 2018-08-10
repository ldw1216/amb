import { BudgetSubjectType } from 'config/config';
import { computed, observable } from 'mobx';
import SubjectBudget from './SubjectBudget';

// 预算金额 某个项目，某个月份的预算
export default class MonthBudget implements amb.IMonthBudget {
    @observable public _id?: string;
    @observable public month: number;
    @observable public subjectBudgets: SubjectBudget[];
    public getSubjectBudget(subject: amb.IBudgetSubject) {
        const subjectBudget = this.subjectBudgets.find(({ subjectId }) => subject._id === subjectId);
        if (subjectBudget) return subjectBudget;
    }

    // 本月预算 收入、成本、费用合计
    @computed get budgetSum() {
        const income = this.subjectBudgets.filter(({ subjectType }) => subjectType === BudgetSubjectType.收入)
            .reduce((x, y) => x + (y.budget || 0), 0);
        const cost = this.subjectBudgets.filter(({ subjectType }) => subjectType === BudgetSubjectType.成本)
            .reduce((x, y) => x + (y.budget || 0), 0);
        const expense = this.subjectBudgets.filter(({ subjectType }) => subjectType === BudgetSubjectType.费用)
            .reduce((x, y) => x + (y.budget || 0), 0);
        return {
            income,
            cost,
            expense,
        };
    }

    // 本月实际 收入、成本、费用合计
    @computed get realitySum() {
        const income = this.subjectBudgets.filter(({ subjectType }) => subjectType === BudgetSubjectType.收入)
            .reduce((x, y) => x + (y.reality || 0), 0);
        const cost = this.subjectBudgets.filter(({ subjectType }) => subjectType === BudgetSubjectType.成本)
            .reduce((x, y) => x + (y.reality || 0), 0);
        const expense = this.subjectBudgets.filter(({ subjectType }) => subjectType === BudgetSubjectType.费用)
            .reduce((x, y) => x + (y.reality || 0), 0);
        return {
            income,
            cost,
            expense,
        };
    }
    constructor(data: amb.IMonthBudget) {
        this._id = data._id;
        this.month = data.month;
        this.subjectBudgets = (data.subjectBudgets || []).map((item) => new SubjectBudget(item));
    }
}
