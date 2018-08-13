import { BudgetSubjectType } from 'config/config';
import { observable } from 'mobx';
import MonthBudget from './MonthBudget';

export default class SubjectBudget implements amb.ISubjectBudget {
    // tslint:disable-next-line:variable-name
    @observable public _id?: string;
    @observable public subjectId: string;
    @observable public subjectType: BudgetSubjectType;
    @observable public subjectName: string;
    @observable public budget?: number;
    @observable public reality?: number;
    @observable public monthBudget: MonthBudget;
    constructor(data: amb.ISubjectBudget, monthBudget: MonthBudget) {
        this._id = data._id;
        this.subjectId = data.subjectId;
        this.subjectType = data.subjectType;
        this.subjectName = data.subjectName; // 子类型id
        this.budget = data.budget;
        this.reality = data.reality;
        this.monthBudget = monthBudget;
    }
}
