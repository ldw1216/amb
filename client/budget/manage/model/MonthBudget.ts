import { observable } from 'mobx';

// 预算金额 某个项目，某个月份的预算
export default class MonthBudget implements amb.IMonthBudget {
    @observable public month: number;
    @observable public money?: number;
    @observable public reality?: number; // 真实金额
    constructor(month: number, money?: number, reality?: number) {
        this.month = month;
        this.money = money;
        this.reality = reality;
    }
}
