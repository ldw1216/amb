import axios from 'axios';
import createValidator from 'components/createValidator';
import { BudgetSubjectType, SearchDataType, SearchRange } from 'config/config';
import { observable } from 'mobx';
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
        // 获取每个组最新的预算数据，如果没有则获取预算周期信息，预算周期信息也没有，则获取当前年份
        const year = new Date().getFullYear();
        this.currentUserBudgetList = groups.map((group) => new Budget(year, group));
    }
}

const store = new Store();

export default store;
