import axios from 'axios';
import { action, computed, observable, runInAction, toJS } from 'mobx';
import Budget from './Budget';

export class BudgetList {
    @observable public list: Budget[] = [];

    // 获取当前用的某个阿米巴组的预算
    @action.bound public async getBudget(groupId: string, year: number) {
        return this.list.find((item) => item.group === groupId);
    }

    // 获取所有组的预算列表
    @action.bound public async fetchAllBudgetList(year: number) {
        await rootStore.groupStore.fetch();
        await rootStore.periodStore.fetch();

        const budgets = await axios.get('/budget/', { params: { year } }).then((res) => res.data) as amb.IBudget[];
        const budgetList = budgets.map((budget) => {
            const group = rootStore.groupStore.list.find((item) => item._id === budget.group)!;
            return new Budget(budget, group);
        });
        this.list = budgetList;
        return budgetList;
    }

    // 获取当前用户的预算列表
    @action.bound public async fetchCurrentUserBudgetList(year: number) {
        await rootStore.groupStore.fetch();
        await rootStore.periodStore.fetch();
        // 获取当前用户所属组
        const groups = rootStore.user.groups;
        const budgets = await axios.get('/budget/currentUser', { params: { year } }).then((res) => res.data) as amb.IBudget[];

        const currentUserBudgetList = groups.map((group) => {
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
            }, rootStore.groupStore.list.find((item) => item._id === groupId)!);
        });
        this.list = currentUserBudgetList;
        return currentUserBudgetList;
    }
}
