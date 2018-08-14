import { BudgetSubjectType } from 'config/config';
import { computed, observable } from 'mobx';
import { Group } from 'store/Group';
import SubjectBudget from './SubjectBudget';

// 预算金额 某个项目，某个月份的预算
export default class MonthBudget implements amb.IMonthBudget {
    @observable public _id?: string;
    @observable public index: number;
    @observable public subjectBudgets: SubjectBudget[];
    @observable public rewardRate: number;
    @observable public name: string;
    public isDirty = false; // 已经被修改改

    private budget_?: amb.IMonthBudgetColumn;
    private reality_?: amb.IMonthBudgetColumn;
    // 获取某个项目的预算
    public getSubjectBudget(subject: amb.IBudgetSubject) {
        const subjectBudget = this.subjectBudgets.find(({ subjectId }) => subject._id === subjectId);
        if (subjectBudget) return subjectBudget;
    }

    // 本月预算 收入、成本、费用 毛利合计
    @computed get budget() {
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
            income: this.budget.income ? 1 : undefined,
            cost: this.budget.income ? this.budget.cost / this.budget.income : undefined,
            expense: this.budget.income ? this.budget.expense / this.budget.income : undefined,
            profit: this.budget.income ? this.budget.profit / this.budget.income : undefined,
            reward: this.budget.income ? this.budget.reward / this.budget.income : undefined,
            purProfit: this.budget.income ? this.budget.purProfit / this.budget.income : undefined,
        };
    }

    // 本月实际 收入、成本、费用合计
    @computed get reality() {
        const income = this.subjectBudgets.filter(({ subjectType }) => subjectType === BudgetSubjectType.收入)
            .reduce((x, y) => x + (y.reality || 0), 0);
        const cost = this.subjectBudgets.filter(({ subjectType }) => subjectType === BudgetSubjectType.成本)
            .reduce((x, y) => x + (y.reality || 0), 0);
        const profit = income - cost;
        const reward = profit < 0 ? 0 : profit * this.rewardRate / 100;
        const expense = this.subjectBudgets.filter(({ subjectType }) => subjectType === BudgetSubjectType.费用)
            .reduce((x, y) => x + (y.reality || 0), 0) + reward;
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
            income: this.reality.income ? 1 : undefined,
            cost: this.reality.income ? this.reality.cost / this.reality.income : undefined,
            expense: this.reality.income ? this.reality.expense / this.reality.income : undefined,
            profit: this.reality.income ? this.reality.profit / this.reality.income : undefined,
            reward: this.reality.income ? this.reality.reward / this.reality.income : undefined,
            purProfit: this.reality.income ? this.reality.purProfit / this.reality.income : undefined,
        };
    }

    // 预算完成率
    @computed get completeRate() {
        const profit = (() => {
            if (this.budget.profit > 0) return this.reality.profit / this.budget.profit;
            if (this.budget.profit < 0) return 2 - this.reality.profit / this.budget.profit;
            if (this.budget.profit === 0 && this.reality.profit >= 0) return 1;
            return -1;
        })();
        const purProfit = (() => {
            if (this.budget.purProfit > 0) return this.reality.purProfit / this.budget.purProfit;
            if (this.budget.purProfit < 0) return 2 - this.reality.purProfit / this.budget.purProfit;
            if (this.budget.purProfit === 0 && this.reality.purProfit >= 0) return 1;
            return -1;
        })();
        return {
            income: this.budget.income ? this.reality.income / this.budget.income : undefined,
            cost: this.budget.cost ? this.reality.cost / this.budget.cost : undefined,
            expense: this.budget.expense ? this.reality.expense / this.budget.expense : undefined,
            profit,
            reward: this.budget.reward ? this.reality.reward / this.budget.reward : undefined,
            purProfit,
        };
    }

    constructor(data: amb.IMonthBudget, group: Group) {
        this._id = data._id;
        this.index = data.index;
        this.name = data.name;
        this.subjectBudgets = (data.subjectBudgets || []).map((item) => new SubjectBudget(item, this));

        this.budget_ = data.budget;
        this.reality_ = data.reality;  // 预算总收入

        this.rewardRate = data.rewardRate || group.rewardRate;
        ['isDirty', 'budget_', 'reality_'].forEach((item) => Object.defineProperties(this, {
            [item]: { enumerable: false },
        }));
    }

    public toJSON() {
        return Object.assign({}, this, { budget: this.budget, reality: this.reality });
    }
}
