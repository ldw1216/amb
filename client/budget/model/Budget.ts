import axios from 'axios';
import { ApprovalState } from 'config/config';
import { action, computed, observable, runInAction, toJS } from 'mobx';
import { Group } from 'store/Group';
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
    @observable public fullGroup: Group;

    constructor(data: amb.IBudget, group: Group) {
        const monthBudgets = (data.monthBudgets || []).map((monthBudget) => {
            if (monthBudget instanceof MonthBudget) return monthBudget;
            return new MonthBudget(monthBudget, group);
        });
        this.fullGroup = group;
        this._id = data._id;
        this.user = data.user; // 预算周期
        this.group = data.group; // 预算周期
        this.period = data.period;
        this.year = data.year; // 预算周期
        this.remark = data.remark;
        this.approvalState = data.approvalState;
        this.monthBudgets = monthBudgets;
        Object.defineProperties(this, {
            subjects: { enumerable: false },
            fullGroup: { enumerable: false },
        });
        this.fetchSubjects();
    }

    // 本预算的组是否失效
    @computed get groupIsAvailable() {
        if (!this.fullGroup || this.fullGroup.available) return true;
        return this.fullGroup.available;
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

    // 修改
    @action.bound public async put(approvalState: ApprovalState) {
        await axios.post('/budget', { _id: this._id, approvalState, remark: this.remark });
        this.approvalState = approvalState;
    }

    // 修改实际
    @action.bound public async putReal() {
        return axios.post('/budget', this);
    }

    @computed get quarter_1() {
        const monthBudgets = [0, 1, 2].map((item) => this.monthBudgets.find(({ month }) => month === item)).filter((item) => item);
        return monthBudgets.reduce((data, month) => {
            return {
                budget: {
                    income: month!.budget.income + (data.budget && data.budget.income || 0),
                    cost: month!.budget.cost + (data.budget && data.budget.cost || 0),
                    expense: month!.budget.expense + (data.budget && data.budget.expense || 0),
                    profit: month!.budget.profit + (data.budget && data.budget.profit || 0),
                    reward: month!.budget.reward + (data.budget && data.budget.reward || 0),
                    purProfit: month!.budget.purProfit + (data.budget && data.budget.purProfit || 0),
                },
            };
        }, {} as any);

        return new MonthBudget({
            month: 100,
            subjectBudgets: [],
        }, this.fullGroup);
    }
}
