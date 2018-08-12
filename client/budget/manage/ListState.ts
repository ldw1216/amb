import { action, observable } from 'mobx';
import BudgetTable from '../model/BudgetTable';

/**
 * 预算列表页状态
 */

export class ListState {
    @observable public budgetTables: BudgetTable[] = [];
    @observable public advancedSearchDisplay = false; // 是否显示高级搜索
    @action.bound public showAdvancedSearch() {
        this.advancedSearchDisplay = true;
        document.addEventListener('click', this.hideAdvancedSearch);
    }
    @action.bound public hideAdvancedSearch() {
        this.advancedSearchDisplay = false;
        document.removeEventListener('click', this.hideAdvancedSearch);
    }
    @action.bound public fetchAllBudgetTables(editable: boolean) {
        rootStore.budgetStore.fetchAllBudgetList().then((list) => {
            this.budgetTables = list.map((item) => new BudgetTable(item, editable));
        });
    }
}
