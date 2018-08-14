import { BudgetSubjectType } from 'config/config';
import { computed, observable } from 'mobx';
import MonthBudget from './MonthBudget';

export default class SubjectBudget implements amb.ISubjectBudget {
    // tslint:disable-next-line:variable-name
    @observable public _id?: string;
    @observable public subjectId: string;
    @observable public subjectType: BudgetSubjectType;
    @observable public subjectName: string;
    @observable public budget?: number;
    @observable public reality?: number;
    @observable private monthBudget: MonthBudget;
    constructor(data: amb.ISubjectBudget, monthBudget: MonthBudget) {
        this._id = data._id;
        this.subjectId = data.subjectId;
        this.subjectType = data.subjectType;
        this.subjectName = data.subjectName; // 子类型id
        this.budget = data.budget;
        this.reality = data.reality;
        this.monthBudget = monthBudget;
        Object.defineProperties(this, {
            monthBudget: { enumerable: false },
        });
    }

    // 预算占收入比
    @computed get budgetRate() {
        return this.monthBudget.budgetSum.income && (this.budget !== undefined) ? this.budget / this.monthBudget.budgetSum.income : undefined;
    }

    // 实际占收入比
    @computed get realityRate() {
        return this.monthBudget.realitySum.income && (this.reality !== undefined) ? this.reality / this.monthBudget.realitySum.income : undefined;
    }

    // 预算完成率
    @computed get completeRate() {
        return (this.budget !== undefined && this.reality !== undefined) ? this.reality / this.budget : undefined;
    }
}
