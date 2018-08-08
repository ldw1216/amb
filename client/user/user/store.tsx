import axios from 'axios';
import { action, observable, observe, toJS } from 'mobx';

class Store {
    @observable public data = [] as amb.IUser[];
    @observable public selectedIndex = -1;
    @observable public editModelVisible = false;
    @observable public groups = [] as Array<{ _id: string, name: string, admin: string }>;
    @observable public condition = {} as any;

    constructor() {
        observe(this.condition, () => {
            console.log(toJS(this.condition));
            this.fetch();
        });
    }
    @action.bound
    public showEditModel(index: number) {
        this.selectedIndex = index;
        this.editModelVisible = true;
    }

    @action.bound
    public async save(values: any) {
        const edit = this.data[this.selectedIndex];
        if (edit) {
            await axios.post('/user/' + edit._id, values);
        } else {
            await axios.post('/user', values);
        }
        this.hideEditModel();
        await this.fetch();
    }

    @action.bound
    public hideEditModel() {
        this.editModelVisible = false;
    }

    @action.bound
    public async fetch() {
        this.data = await axios.get('/user', { params: { condition: this.condition } }).then((res) => res.data);
        this.groups = await axios.get('/group').then((res) => res.data);
    }

    @action.bound
    public async resetPassword(id: string) {
        await axios.get('/user/resetPassword/' + id);
    }
}

export default new Store();
