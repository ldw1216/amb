import axios from 'axios';
import createValidator from 'components/createValidator';
import { BudgetSubjectType, SearchDataType, SearchRange } from 'config/config';
import { action, computed, observable, runInAction, toJS } from 'mobx';
import rootStore from '../../store';
import Budget from './model/Budget';
import BudgetTable from './model/BudgetTable';

export class Store {
    @observable public currentUserBudgetList: Budget[] = []; // 当前用户的预算列表
    @observable public periods: amb.IPeriod[] = []; // 当前用户的预算列表

    @observable public condition = {
        year: new Date().getFullYear(),
        range: [SearchRange.二季度, SearchRange.三季度],
        dataTypes: Object.keys(SearchDataType),
    };

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

    // 获取当前用户的预算周期列表
    @action.bound public async fetchCurrentUserBudgetList() {
        // 获取当前用户所属组
        const groups = rootStore.user.groups;
        // 获取预算周期信息，如果没有预算周期信息，则获取当前年份
        const periods = await axios.post('/period/groups', { groups: groups.map((item: any) => item._id) }).then((res) => res.data) as Array<[string, amb.IPeriod | undefined]>;
        // 获取每个组最新的预算数据，
        const budgets: amb.IBudget[] = await Promise.all(periods.map(([groupId, period]) => {
            if (period) return axios.get(`/budget/group/${groupId}/year/${period.year}`).then((res) => res.data);
            else return Promise.resolve(undefined);
        })).then((list) => list.filter((item) => item));

        const currentUserBudgetList = groups.map((group) => {
            const period = periods.find(([groupId]) => groupId === group._id)![1];
            const year = period ? period.year : new Date().getFullYear();
            const budget = budgets.find((item) => item.group === group._id);
            const monthBudgets = budget ? budget.monthBudgets : [];
            // 如果预算周期不一致，则不生成_id (还未实现)
            return new Budget({
                _id: budget && budget._id,
                user: rootStore.user._id,
                group: group._id,
                groupName: group.name,
                period: period && period._id,
                year,
                monthBudgets, // 从数据库中获取
                remark: budget && budget.remark, // 从数据库中读取
            });
        });

        runInAction(() => {
            this.periods = periods.map(([, period]) => period).filter((item) => item) as any[];
            this.currentUserBudgetList = currentUserBudgetList;
        });

    }
}

const store = new Store();

export default store;
