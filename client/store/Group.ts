import axios from 'axios';
import { action, observable } from 'mobx';

export class Group implements amb.IGroup {
    public _id?: string;
    @observable public sector: string | { name: string }; // 大部门
    @observable public name: string; // 阿米巴组
    @observable public rewardRate: number; // 奖金比例
    @observable public admin: string; // 负责人
    @observable public available: boolean; // 状态
    constructor(data: amb.IGroup) {
        this._id = data._id;
        this.sector = data.sector;
        this.name = data.name;
        this.rewardRate = data.rewardRate;
        this.admin = data.admin;
        this.available = data.available;
    }
}

export class GroupList {
    @observable public list = [] as amb.IGroup[];
    @observable public sectors = [] as Array<{ _id: string, name: string }>;
    @observable public selectedIndex = -1;
    @observable public editModelVisible = false;

    @action.bound
    public async showEditModel(index: number) {
        this.selectedIndex = index;
        this.editModelVisible = true;
        this.sectors = await axios.get('/sector').then((res) => res.data);
    }

    @action.bound
    public async save(values: any) {
        const edit = this.list[this.selectedIndex];
        await axios.post('/group/' + (edit ? edit._id : ''), values);
        this.hideEditModel();
        await this.fetch();
    }

    @action.bound
    public hideEditModel() {
        this.editModelVisible = false;
    }

    @action.bound
    public async fetch() {
        this.list = await axios.get('/group').then((res) => res.data.map((item: any) => new Group(item)));
    }
}
