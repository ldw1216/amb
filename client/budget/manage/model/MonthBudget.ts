import { observable } from 'mobx';
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
    constructor(data: amb.IMonthBudget) {
        this._id = data._id;
        this.month = data.month;
        this.subjectBudgets = (data.subjectBudgets || []).map((item) => new SubjectBudget(item));
    }
}
