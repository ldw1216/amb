import axios from 'axios';
import createValidator from 'components/createValidator';
import { BudgetSubjectType, SearchDataType, SearchRange } from 'config/config';
import { action, computed, observable, toJS } from 'mobx';
import rootStore from '../../store';
import Budget from './model/Budget';
import BudgetTable from './model/BudgetTable';

export class Store {
    @observable public currentUserBudgetList: Budget[] = []; // 当前用户的预算列表
    @observable public periodMap = new Map();

    @observable public condition = {
        year: new Date().getFullYear(),
        range: [SearchRange.二季度, SearchRange.三季度],
        dataTypes: Object.keys(SearchDataType),
    };

    @action.bound public async getBudget(groupId: string) {
        if (this.currentUserBudgetList.length === 0) await this.fetchCurrentUserBudgetList();
        return this.currentUserBudgetList.find((item) => item.group === groupId);
    }

    @action.bound public async getBudgetTable(groupId: string) {
        if (this.currentUserBudgetList.length === 0) await this.fetchCurrentUserBudgetList();
        const budget = this.currentUserBudgetList.find((item) => item.group === groupId);
        if (budget) return new BudgetTable(budget);
    }

    @computed get currentUserBudgetTables() {
        return this.currentUserBudgetList.map((item) => new BudgetTable(item));
    }

    // 获取当前用户的预算周期列表
    public async fetchCurrentUserBudgetList() {
        // 获取当前用户所属组
        const groups = rootStore.user.groups;
        // 获取每个组最新的预算数据，
        // 获取预算周期信息，如果没有预算周期信息，则获取当前年份
        const periods = await axios.post('/period/groups', { groups: groups.map((item: any) => item._id) }).then((res) => res.data) as Array<[string, amb.IPeriod | undefined]>;
        this.periodMap = new Map(periods); // 当前所有的排期
        this.currentUserBudgetList = groups.map((group) => {
            const period = this.periodMap.get(group._id);
            const year = period ? period.year : new Date().getFullYear();
            return new Budget({
                user: rootStore.user._id,
                group: group._id,
                groupName: group.name,
                period: period && period._id,
                year,
                subjectBudgets: [], // 从数据库中获取
            });
        });
    }
}

const store = new Store();

export default store;
