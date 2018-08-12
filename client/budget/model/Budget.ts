import axios from 'axios';
import { ApprovalState } from 'config/config';
import { action, computed, observable, runInAction, toJS } from 'mobx';
import MonthBudget from './MonthBudget';
import Subject from './Subject';

// 预算数据
export default class Budget implements amb.IBudget {
    // tslint:disable-next-line:variable-name
    public _id?: string;
    @observable public approvalState?: ApprovalState;
    @observable public user: string;
    @observable public group: string;
    @observable public period?: string;
    @observable public year: number;
    @observable public monthBudgets: MonthBudget[] = [];
    @observable public subjects: Subject[] = [];
    @observable public remark?: string;

    constructor(data: amb.IBudget) {
        const monthBudgets = (data.monthBudgets || []).map((monthBudget) => {
            if (monthBudget instanceof MonthBudget) return monthBudget;
            return new MonthBudget(monthBudget);
        });

        this._id = data._id;
        this.user = data.user; // 预算周期
        this.group = data.group; // 预算周期
        this.period = data.period;
        this.year = data.year; // 预算周期
        this.monthBudgets = monthBudgets;
        this.remark = data.remark;
        this.approvalState = data.approvalState;
        Object.defineProperties(this, {
            subjects: { enumerable: false },
        });
        this.fetchSubjects();
    }

    @computed get groupName() {
        const group = rootStore.groupStore.list.find((item) => item._id === this.group);
        return group ? group.name : '';
    }

    @computed get expenseTypes(): amb.IExpenseTypeOption[] {
        const data = rootStore.expenseTypeStore.list.find((item) => item.year === this.year);
        return data ? data.options : [];
    }

    @action.bound public async fetchSubjects() {
        this.subjects = await axios.get(`/subject`, { params: { year: this.year, group: this.group } }).then((res) => res.data.map((item: amb.IBudgetSubject) => new Subject(item)));
    }

    // 保存预算
    @action.bound public async save() {
        const group = rootStore.groupStore.list.find((item) => item._id === this.group)!;
        const period = group.period!._id;
        return axios.post('/budget', Object.assign({}, this, { period }));
    }
}
