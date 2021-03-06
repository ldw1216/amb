import { action, observable, reaction } from 'mobx';
import BudgetTable from '../model/BudgetTable';
import Condition from '../model/Condition';

/**
 * 预算列表页状态
 */

export class ListState {
    @observable public budgetTables: BudgetTable[] = [];
    @observable public advancedSearchDisplay = false; // 是否显示高级搜索
    constructor(public condition = new Condition()) {
    }
    @action.bound public showAdvancedSearch() {
        this.advancedSearchDisplay = true;
        document.addEventListener('click', this.hideAdvancedSearch);
    }
    @action.bound public hideAdvancedSearch() {
        this.advancedSearchDisplay = false;
        document.removeEventListener('click', this.hideAdvancedSearch);
    }
    @action.bound public fetchAllBudgetTables(editableOptiont: amb.ITableEditableOptiont) {
        rootStore.budgetStore.fetchAllBudgetList(this.condition.year).then((list) => {
            this.budgetTables = list.map((item) => new BudgetTable(item, this.condition, editableOptiont));
        });
    }
    @action.bound public fetchCurrentUserBudgetTables(editableOptiont: amb.ITableEditableOptiont) {
        rootStore.budgetStore.fetchCurrentUserBudgetList(this.condition.year)
            .then((list) => list.map((item) => new BudgetTable(item, this.condition, editableOptiont)))
            .then((list) => this.budgetTables = list);
    }
}
