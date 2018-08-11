import axios from 'axios';
import { action, observable, toJS, when } from 'mobx';
import User from 'store/User';
import { ExpenseTypeList } from '../budget/model/ExpenceType';
import Period from '../budget/model/Period';
import { BudgetStore } from '../budget/store';

export class Store {
    @observable public user = new User();
    @observable public expenseTypeStore = new ExpenseTypeList();
    @observable public budgetStore = new BudgetStore();
}

export default new Store();
