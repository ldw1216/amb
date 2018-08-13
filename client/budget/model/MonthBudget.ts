import { BudgetSubjectType } from 'config/config';
import { computed, observable } from 'mobx';
import SubjectBudget from './SubjectBudget';

// 预算金额 某个项目，某个月份的预算
export default class MonthBudget implements amb.IMonthBudget {
    @observable public _id?: string;
    @observable public month: number;
    @observable public subjectBudgets: SubjectBudget[];

    // 获取某个项目的预算
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

    // 预算收入占比
    @computed get budgetRate() {
        return {
            income: this.budgetSum.income ? '100%' : '--',
            cost: this.budgetSum.income ? (this.budgetSum.cost / this.budgetSum.income * 100).toFixed(2) + '%' : '--',
            expense: this.budgetSum.income ? (this.budgetSum.expense / this.budgetSum.income * 100).toFixed(2) + '%' : '--',
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

    // 实际占收入占比
    @computed get realityRate() {
        return {
            income: this.realitySum.income ? '100%' : '--',
            cost: this.realitySum.income ? (this.realitySum.cost / this.realitySum.income * 100).toFixed(2) + '%' : '--',
            expense: this.realitySum.income ? (this.realitySum.expense / this.realitySum.income * 100).toFixed(2) + '%' : '--',
        };
    }

    // 预算完成率
    @computed get rate() {
        return {
            income: this.budgetSum.income ? (this.realitySum.income / this.budgetSum.income * 100).toFixed(2) + '%' : '--',
            cost: this.budgetSum.cost ? (this.realitySum.cost / this.budgetSum.cost * 100).toFixed(2) + '%' : '--',
            expense: this.budgetSum.expense ? (this.realitySum.expense / this.budgetSum.expense * 100).toFixed(2) + '%' : '--',
        };
    }

    constructor(data: amb.IMonthBudget) {
        this._id = data._id;
        this.month = data.month;
        this.subjectBudgets = (data.subjectBudgets || []).map((item) => new SubjectBudget(item, this));
    }
}
