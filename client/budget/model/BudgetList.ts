import axios from 'axios';
import { reaction } from 'mobx';
import { observe } from 'mobx';
import { action, computed, observable, runInAction, toJS } from 'mobx';
import Budget from './Budget';
import Condition from './Condition';

export class BudgetList {
    @observable public currentUserBudgetList: Budget[] = []; // 当前用户的预算列表
    @observable public allBudgetList: Budget[] = []; // 所有组的预算列表
    @observable public condition: Condition; // 搜索条件

    constructor(condition?: Condition) {
        this.condition = condition || new Condition();
    }

    // 获取当前用的某个阿米巴组的预算
    @action.bound public async getCurrentUserBudget(groupId: string) {
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
        return budgetList;
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
            const groupId = typeof group === 'string' ? group : group._id;
            const budget = budgets.find((item) => item.group === groupId);
            return new Budget({
                _id: budget && budget._id,
                user: rootStore.user._id,
                group: groupId!,
                period: budget && budget.period,
                year,
                approvalState: budget && budget.approvalState,
                monthBudgets: budget ? budget.monthBudgets : [],
                remark: budget && budget.remark,
            });
        });
        this.currentUserBudgetList = currentUserBudgetList;
        return currentUserBudgetList;
    }
}
