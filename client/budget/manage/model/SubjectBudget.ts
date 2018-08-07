import { BudgetSubjectType, BudgetType, SearchDataType, SearchRange } from 'config/config';
import { observable } from 'mobx';
import MonthBudget from './MonthBudget';

// 预算行（某个项目的预算，比如人工成本预算）
export default class SubjectBudget implements amb.ISubjectBudget {
    // tslint:disable-next-line:variable-name
    @observable public _id?: string;
    @observable public subjectType: BudgetSubjectType;
    @observable public subjectSubType?: string; // 子类型id
    @observable public type?: BudgetType;
    @observable public monthBudgets: MonthBudget[] = [];
    constructor(data: amb.ISubjectBudget) {
        this._id = data._id;
        this.subjectType = data.subjectType;
        this.subjectSubType = data.subjectSubType; // 子类型id
        this.type = data.type;
        this.monthBudgets = data.monthBudgets || [];
    }
}
