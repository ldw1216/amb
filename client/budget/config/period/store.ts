import axios from 'axios';
import { action, observable, observe, runInAction, toJS } from 'mobx';
import moment from 'moment';
import Period from '../../model/Period';

class Store {
    @observable public data = [] as Period[];
    @observable public selectedIndex = -1;
    @observable public editModelVisible = false;
    @observable public groups = [] as Array<{ _id: string, name: string, admin: string }>;

    @action.bound
    public showEditModel(index: number) {
        this.selectedIndex = index;
        this.editModelVisible = true;
    }

    @action.bound
    public async save(values: any) {
        values.duration = [moment(values.duration[0]).startOf('day'), moment(values.duration[1]).endOf('day')];
        const edit = this.data[this.selectedIndex];
        if (edit) {
            await axios.post('/period/' + edit._id, values);
        } else {
            await axios.post('/period', values);
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
        const data = await axios.get('/period').then((res) => res.data).then((list) => list.map((item: amb.IPeriod) => new Period(item)));
        const groups = await axios.get('/group').then((res) => res.data);
        runInAction(() => {
            this.data = data;
            this.groups = groups;
        });
    }
}

export default new Store();
