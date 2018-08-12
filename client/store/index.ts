import { action, observable, toJS, when } from 'mobx';
import { GroupList } from 'store/Group';
import User from 'store/User';
import { ExpenseTypeList } from '../budget/model/ExpenceType';
import { PeriodList } from '../budget/model/Period';
import { BudgetStore } from '../budget/store';

export class RootStore {
    @observable public user = new User();
    @observable public expenseTypeStore = new ExpenseTypeList();
    @observable public budgetStore = new BudgetStore();
    @observable public periodStore = new PeriodList();
    @observable public groupStore = new GroupList();
    constructor() {
        when(() => !!this.user._id, () => {
            this.expenseTypeStore.fetch();
        });
    }
}

window.rootStore = new RootStore();
export default window.rootStore;

declare global {
    // tslint:disable-next-line:interface-name
    interface Window {
        rootStore: RootStore;
    }
    const rootStore: RootStore;
}
