import axios from 'axios';
import { action, computed, observable, runInAction, toJS } from 'mobx';
import Budget from './Budget';
import BudgetTable from './BudgetTable';
import Condition from './Condition';

export class BudgetList {
    @observable public currentUserBudgetList: Budget[] = []; // 当前用户的预算列表
    @observable public allBudgetList: Budget[] = []; // 所有组的预算列表
    @observable public periods: amb.IPeriod[] = []; // 当前用户的预算周期
    @observable public condition: Condition; // 搜索条件

    constructor(condition?: Condition) {
        this.condition = condition || new Condition();
    }

    @computed get currentUserBudgetTables() {
        return this.currentUserBudgetList.map((item) => new BudgetTable(
            item,
            rootStore.periodStore.list.find(({ _id }) => _id === item.period),
            false,
        ));
    }

    @computed get allBudgetTables() {
        return this.allBudgetList.map((item) => new BudgetTable(
            item,
            rootStore.periodStore.list.find(({ _id }) => _id === item.period),
            false,
        ));
    }

    @action.bound public async getBudget(groupId: string) {
        if (this.currentUserBudgetList.length === 0) await this.fetchCurrentUserBudgetList();
        return this.currentUserBudgetList.find((item) => item.group === groupId);
    }

    // 获取所有组的预算列表
    @action.bound public async fetchAllBudgetList() {
        await rootStore.groupStore.fetch();
        await rootStore.periodStore.fetch();
        // 获取当前用户所属组
        const budgets = await axios.get('/budget/', { params: { year: this.condition.year } }).then((res) => res.data) as amb.IBudget[];
        const budgetList = budgets.map((budget) => new Budget(budget));
        this.allBudgetList = budgetList;
    }

    // 获取当前用户的预算列表
    @action.bound public async fetchCurrentUserBudgetList() {
        await rootStore.groupStore.fetch();
        await rootStore.periodStore.fetch();
        // 获取当前用户所属组
        const groups = rootStore.user.groups;
        const budgets = await axios.get('/budget/currentUser', { params: { year: this.condition.year } }).then((res) => res.data) as amb.IBudget[];

        const currentUserBudgetList = groups.map((group) => {
            const year = this.condition.year;
            const budget = budgets.find((item) => item.group === group._id);
            return new Budget({
                _id: budget && budget._id,
                user: rootStore.user._id,
                group: group._id!,
                period: budget && budget.period,
                year,
                monthBudgets: budget ? budget.monthBudgets : [],
                remark: budget && budget.remark,
            });
        });

        this.currentUserBudgetList = currentUserBudgetList;
    }
}
