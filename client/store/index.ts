import axios from 'axios';
import { action, observable, toJS, when } from 'mobx';
import User from 'store/User';

export class Store {
    public user = new User();
    @observable public expenseTypes: amb.IExpenseType[] = [];
    constructor() {
        axios.get('/expense-type').then((res) => {
            this.expenseTypes = res.data;
        });
    }
}

export default new Store();
