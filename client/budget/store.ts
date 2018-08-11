import axios from 'axios';
import { action, computed, observable, runInAction, toJS } from 'mobx';
import Budget from './model/Budget';
import BudgetTable from './model/BudgetTable';
import Condition from './model/Condition';

export class BudgetStore {
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
            this.periods.find(({ _id }) => _id === item.period),
            false,
        ));
    }
    @action.bound public async getBudget(groupId: string) {
        if (this.currentUserBudgetList.length === 0) await this.fetchCurrentUserBudgetList();
        return this.currentUserBudgetList.find((item) => item.group === groupId);
    }

    // 获取所有组的预算
    @action.bound public async fetchAllBudgetList() {
        // 获取所有阿米巴组列表

        // 对第个阿米巴组生成预算
    }

    // 获取当前用户的预算周期列表
    @action.bound public async fetchCurrentUserBudgetList() {

        // 获取当前用户所属组
        const groups = rootStore.user.groups;
        // 获取预算周期信息，如果没有预算周期信息，则获取当前年份
        const periods = await axios.post('/period/groups', { groups: groups.map((item: any) => item._id) }).then((res) => res.data) as Array<[string, amb.IPeriod | undefined]>;

        // 获取当前用户的每个组最新的预算数据，
        const budgets: amb.IBudget[] = await Promise.all(periods.map(([groupId, period]) => {
            if (period) return axios.get(`/budget/group/${groupId}/year/${period.year}`).then((res) => res.data);
            else return Promise.resolve(undefined);
        })).then((list) => list.filter((item) => item));

        const currentUserBudgetList = groups.map((group) => {
            const period = periods.find(([groupId]) => groupId === group._id)![1];
            const year = period ? period.year : new Date().getFullYear();
            const budget = budgets.find((item) => item.group === group._id);
            const monthBudgets = budget ? budget.monthBudgets : [];
            return new Budget({
                _id: budget && budget._id,
                user: rootStore.user._id,
                group: group._id,
                groupName: group.name,
                period: period && period._id,
                year,
                monthBudgets,
                remark: budget && budget.remark,
            });
        });

        runInAction(() => {
            this.periods = periods.map(([, period]) => period).filter((item) => item) as any[];
            this.currentUserBudgetList = currentUserBudgetList;
        });

    }
}
