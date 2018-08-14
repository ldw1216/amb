import axios from 'axios';
import { ApprovalState } from 'config/config';
import { action, computed, observable, runInAction, toJS, values } from 'mobx';
import * as R from 'ramda';
import { Group } from 'store/Group';
import MonthBudget from './MonthBudget';
import Subject from './Subject';
import SubjectBudget from './SubjectBudget';

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

    @computed get quarters() {
        const titles = [
            { name: '第一季度', index: 100, months: [0, 1, 2] },
            { name: '第二季度', index: 200, months: [3, 4, 5] },
            { name: '第三季度', index: 300, months: [6, 7, 8] },
            { name: '第四季度', index: 400, months: [9, 10, 11] },
            { name: '半年报', index: 500, months: [0, 1, 2, 3, 4, 5] },
            { name: '全年报', index: 600, months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
        ];
        return titles.map((title) => {
            const monthBudget = new MonthBudget({ index: title.index, name: title.name, subjectBudgets: [] }, this.fullGroup);
            const monthBudgets = title.months.map((item) => this.monthBudgets.find(({ index }) => index === item)).filter((item) => item);
            monthBudget.subjectBudgets = monthBudgets.reduce((value, month) => {
                const subjectBudgets = month!.subjectBudgets.map((subjectBudget) => {
                    const val = value.find((item) => item.subjectId === subjectBudget.subjectId);
                    return new SubjectBudget({
                        subjectId: subjectBudget.subjectId,
                        subjectType: subjectBudget.subjectType,
                        subjectName: subjectBudget.subjectName,
                        budget: (subjectBudget.budget || 0) + (val && val.budget || 0),
                        reality: (subjectBudget.reality || 0) + (val && val.reality || 0),
                    } as any, monthBudget);
                });
                return R.unionWith(R.eqBy(R.prop('subjectId')), subjectBudgets, value);
            }, [] as SubjectBudget[]);
            return monthBudget;
        }).filter(({ subjectBudgets }) => subjectBudgets.length);
    }
}
