import { observable } from 'mobx';

// 预算金额 某个项目，某个月份的预算
export default class MonthBudget implements amb.IMonthBudget {
    @observable public _id?: string;
    @observable public month: number;
    @observable public money?: number;
    @observable public reality?: number; // 真实金额
    constructor(month: number, money?: number, reality?: number, _id?: string) {
        this._id = _id;
        this.month = month;
        this.money = money;
        this.reality = reality;
    }
}
