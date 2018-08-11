import axios from 'axios';
import { BudgetSubjectType } from 'config/config';
import { action, computed, observable, toJS } from 'mobx';

export class ExpenseType implements amb.IExpenseType {
    public _id?: string;
    public id?: string;
    @observable public year?: number;
    @observable public options: amb.IExpenseTypeOption[];
    constructor(data: amb.IExpenseType) {
        this._id = data._id;
        this.id = data.id;
        this.year = data.year;
        this.options = data.options || [];
    }

    @computed get expenseSubjects() {
        return [];
    }
}

export class ExpenseTypeList {
    @observable public list: ExpenseType[] = [];

    @action.bound
    public async save(values: any, id?: string) {
        const url = '/expense-type/' + (id || '');
        await axios.post(url, values);
        await this.fetch();
    }

    // 新增
    @action.bound
    public addNew() {
        this.list.push(new ExpenseType({ id: Math.random().toString(), options: [] }));
    }

    // 拉取数据
    @action.bound
    public async fetch() {
        this.list = await axios.get('/expense-type').then((res) => res.data.map((item: any) => new ExpenseType(item)));
    }

    // 费用项目
    @action.bound
    public getExpenseSubject(year: number) {
        const expenseType = this.list.find((item) => item.year === year);
        return expenseType ? expenseType.options.filter((item) => item._id).map((item) => ({ ...item, subjectType: BudgetSubjectType.费用 })) : [];
    }
}
