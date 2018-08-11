import { action, observable, toJS, when } from 'mobx';
import User from 'store/User';
import { ExpenseTypeList } from '../budget/model/ExpenceType';
import { BudgetStore } from '../budget/store';

export class RootStore {
    @observable public user = new User();
    @observable public expenseTypeStore = new ExpenseTypeList();
    @observable public budgetStore = new BudgetStore();
    constructor() {
        when(() => !!this.user._id, () => {
            this.expenseTypeStore.fetch();
        });
    }
}

const rootStore = new RootStore();
window.rootStore = rootStore;
export default rootStore;
