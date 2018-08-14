import { BudgetSubjectType } from 'config/config';
import { computed, observable } from 'mobx';
import { Group } from 'store/Group';
import SubjectBudget from './SubjectBudget';

// 预算金额 某个项目，某个月份的预算
export default class MonthBudget implements amb.IMonthBudget {
    @observable public _id?: string;
    @observable public month: number;
    @observable public subjectBudgets: SubjectBudget[];
    @observable public rewardRate: number;
    public isDirty = false; // 已经被修改改

    private budgetSum_?: amb.IMonthBudgetSum;
    private realitySum_?: amb.IMonthBudgetSum;
    // 获取某个项目的预算
    public getSubjectBudget(subject: amb.IBudgetSubject) {
        const subjectBudget = this.subjectBudgets.find(({ subjectId }) => subject._id === subjectId);
        if (subjectBudget) return subjectBudget;
    }

    // 本月预算 收入、成本、费用 毛利合计
    @computed get budgetSum() {
        const income = this.subjectBudgets.filter(({ subjectType }) => subjectType === BudgetSubjectType.收入)
            .reduce((x, y) => x + (y.budget || 0), 0);
        const cost = this.subjectBudgets.filter(({ subjectType }) => subjectType === BudgetSubjectType.成本)
            .reduce((x, y) => x + (y.budget || 0), 0);
        const profit = income - cost;
        const reward = profit < 0 ? 0 : profit * this.rewardRate / 100;
        const expense = this.subjectBudgets.filter(({ subjectType }) => subjectType === BudgetSubjectType.费用)
            .reduce((x, y) => x + (y.budget || 0), 0) + reward;
        const purProfit = profit - reward - expense;
        return {
            income,
            cost,
            expense,
            profit,
            reward,
            purProfit,
        };
    }

    // 预算收入占比
    @computed get budgetRate() {
        return {
            income: this.budgetSum.income ? '100%' : '--',
            cost: this.budgetSum.income ? (this.budgetSum.cost / this.budgetSum.income * 100).toFixed(2) + '%' : '--',
            expense: this.budgetSum.income ? (this.budgetSum.expense / this.budgetSum.income * 100).toFixed(2) + '%' : '--',
            profit: this.budgetSum.income ? (this.budgetSum.profit / this.budgetSum.income * 100).toFixed(2) + '%' : '--',
            reward: this.budgetSum.income ? (this.budgetSum.reward / this.budgetSum.income * 100).toFixed(2) + '%' : '--',
            purProfit: this.budgetSum.income ? (this.budgetSum.purProfit / this.budgetSum.income * 100).toFixed(2) + '%' : '--',
        };
    }

    // 本月实际 收入、成本、费用合计
    @computed get realitySum() {
        const income = this.subjectBudgets.filter(({ subjectType }) => subjectType === BudgetSubjectType.收入)
            .reduce((x, y) => x + (y.reality || 0), 0);
        const cost = this.subjectBudgets.filter(({ subjectType }) => subjectType === BudgetSubjectType.成本)
            .reduce((x, y) => x + (y.reality || 0), 0);
        const profit = income - cost;
        const expense = this.subjectBudgets.filter(({ subjectType }) => subjectType === BudgetSubjectType.费用)
            .reduce((x, y) => x + (y.reality || 0), 0) + profit;
        const reward = profit < 0 ? 0 : profit * this.rewardRate / 100;
        const purProfit = profit - reward - expense;
        return {
            income,
            cost,
            expense,
            profit,
            reward,
            purProfit,
        };
    }

    // 实际占收入占比
    @computed get realityRate() {
        return {
            income: this.realitySum.income ? '100%' : '--',
            cost: this.realitySum.income ? (this.realitySum.cost / this.realitySum.income * 100).toFixed(2) + '%' : '--',
            expense: this.realitySum.income ? (this.realitySum.expense / this.realitySum.income * 100).toFixed(2) + '%' : '--',
            profit: this.realitySum.income ? (this.realitySum.profit / this.realitySum.income * 100).toFixed(2) + '%' : '--',
            reward: this.realitySum.income ? (this.realitySum.reward / this.realitySum.income * 100).toFixed(2) + '%' : '--',
            purProfit: this.realitySum.income ? (this.realitySum.purProfit / this.realitySum.income * 100).toFixed(2) + '%' : '--',
        };
    }

    // 预算完成率
    @computed get rate() {
        return {
            income: this.budgetSum.income ? (this.realitySum.income / this.budgetSum.income * 100).toFixed(2) + '%' : '--',
            cost: this.budgetSum.cost ? (this.realitySum.cost / this.budgetSum.cost * 100).toFixed(2) + '%' : '--',
            expense: this.budgetSum.expense ? (this.realitySum.expense / this.budgetSum.expense * 100).toFixed(2) + '%' : '--',
            profit: this.budgetSum.income ? (this.realitySum.profit / this.budgetSum.profit * 100).toFixed(2) + '%' : '--',
            reward: this.budgetSum.reward ? (this.realitySum.reward / this.budgetSum.reward * 100).toFixed(2) + '%' : '--',
            purProfit: this.budgetSum.purProfit ? (this.realitySum.purProfit / this.budgetSum.purProfit * 100).toFixed(2) + '%' : '--',
        };
    }

    constructor(data: amb.IMonthBudget, group: Group) {
        this._id = data._id;
        this.month = data.month;
        this.subjectBudgets = (data.subjectBudgets || []).map((item) => new SubjectBudget(item, this));

        this.budgetSum_ = data.budgetSum;
        this.realitySum_ = data.realitySum;  // 预算总收入

        this.rewardRate = data.rewardRate || group.rewardRate;
        ['isDirty', 'budgetSum_', 'realitySum_'].forEach((item) => Object.defineProperties(this, {
            [item]: { enumerable: false },
        }));
    }

    public toJSON() {
        return Object.assign({}, this, { budgetSum: this.budgetSum, realitySum: this.realitySum });
    }
}
