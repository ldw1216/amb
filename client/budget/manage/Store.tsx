import axios from 'axios';
import createValidator from 'components/createValidator';
import { BudgetSubjectType, SearchDataType, SearchRange } from 'config/config';
import { observable, toJS } from 'mobx';
import rootStore from 'store/index';
import Budget from './model/Budget';

export class Store {
    @observable public currentUserBudgetList: Budget[] = []; // 当前用户的预算列表
    @observable public condition = {
        year: new Date().getFullYear(),
        range: [SearchRange.二季度, SearchRange.三季度],
        dataTypes: Object.keys(SearchDataType),
    };

    // 获取当前用户的预算周期列表
    public async fetchCurrentUserBudgetList() {
        // 获取当前用户所属组
        const groups = rootStore.user.groups;
        // 获取每个组最新的预算数据，
        // 获取预算周期信息，如果没有预算周期信息，则获取当前年份
        const periods = await axios.post('/period/groups', { groups: groups.map((item: any) => item._id) }).then((res) => res.data) as Array<[string, amb.IPeriod | undefined]>;
        const periodMap = new Map(periods);
        this.currentUserBudgetList = groups.map((group) => {
            const period = periodMap.get(group._id);
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
