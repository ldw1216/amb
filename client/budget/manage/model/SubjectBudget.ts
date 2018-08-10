import { BudgetSubjectType, BudgetType, SearchDataType, SearchRange } from 'config/config';
import { observable } from 'mobx';

export default class SubjectBudget implements amb.ISubjectBudget {
    // tslint:disable-next-line:variable-name
    @observable public _id?: string;
    @observable public subjectId: string;
    @observable public subjectType: BudgetSubjectType;
    @observable public subjectSubType: string; // 子类型id
    @observable public subjectName: string;
    @observable public budget?: number;
    @observable public reality?: number;
    constructor(data: amb.ISubjectBudget) {
        this._id = data._id;
        this.subjectId = data.subjectId;
        this.subjectType = data.subjectType;
        this.subjectSubType = data.subjectSubType; // 子类型id
        this.subjectName = data.subjectName; // 子类型id
        this.budget = data.budget;
        this.reality = data.reality;
    }
}
