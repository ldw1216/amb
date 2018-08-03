import axios from 'axios';
import { action, observable, observe, toJS } from 'mobx';

class Store {
    @observable public data = [] as amb.IExpense[];

    @action.bound
    public async save(values: any, id?: string) {
        if (id) {
            await axios.post('/expense-type/' + id, values);
        } else {
            await axios.post('/expense-type', values);
        }
        await this.fetch();
    }

    @action.bound
    public async fetch() {
        this.data = await axios.get('/expense-type').then((res) => res.data);
    }
}

export default new Store();
