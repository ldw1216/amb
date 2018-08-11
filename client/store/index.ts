import { action, observable, toJS, when } from 'mobx';
import User from 'store/User';
import { ExpenseTypeList } from '../budget/model/ExpenceType';
import { BudgetStore } from '../budget/store';

export class Store {
    @observable public user = new User();
    @observable public expenseTypeStore = new ExpenseTypeList();
    @observable public budgetStore = new BudgetStore();
    constructor() {
        when(() => !!this.user._id, () => {
            console.log('aaa');
            this.expenseTypeStore.fetch();
        });
    }
}

console.log('root store');
const rootStore = new Store();
export default rootStore;
