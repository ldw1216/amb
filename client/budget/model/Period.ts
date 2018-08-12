import axios from 'axios';
import { action, computed, observable, runInAction } from 'mobx';
import moment from 'moment';

/**
 * 预算周期
 */

export default class Period implements amb.IPeriod {
    public _id?: string;
    @observable public duration: [Date, Date]; // 状态 提报中、结束、未开始
    @observable public year: number; // 年度
    @observable public quarters: Array<'一季度' | '二季度' | '三季度' | '四季度'>; // 季度
    @observable public groups: string[]; // 阿米巴组
    @observable public allGroup: boolean; // 全部阿米巴组
    constructor(data: amb.IPeriod) {
        this._id = data._id;
        this.duration = data.duration; // 状态 提报中、结束、未开始
        this.year = data.year; // 年度
        this.quarters = data.quarters;
        this.groups = data.groups; // 阿米巴组
        this.allGroup = data.allGroup; // 全部阿米巴组
    }

    // 状态 提报中、结束、未开始 get
    @computed get state() {
        const start = moment(this.duration[0]).startOf('day');
        const end = moment(this.duration[1]).endOf('day');
        if (moment().isBefore(start)) return '未开始';
        if (moment().isAfter(end)) return '已结束';
        return '提报中';
    }

    // 格式化后的提报时间范围
    @computed get durationFormat() {
        return moment(this.duration[0]).format('YYYY-MM-DD') + ' —— ' + moment(this.duration[1]).format('YYYY-MM-DD');
    }

    public save() {
        return axios.post('/period/' + this._id, this);
    }
}

export class PeriodList {
    @observable public list = [] as Period[];
    @observable public selectedIndex = -1;
    @observable public editModelVisible = false;

    @action.bound
    public showEditModel(index: number) {
        this.selectedIndex = index;
        this.editModelVisible = true;
    }

    @action.bound
    public async save(values: any) {
        values.duration = [moment(values.duration[0]).startOf('day'), moment(values.duration[1]).endOf('day')];
        const edit = this.list[this.selectedIndex];
        await axios.post('/period/' + (edit ? edit._id : ''), values);
        this.hideEditModel();
        await this.fetch();
    }

    @action.bound
    public hideEditModel() {
        this.editModelVisible = false;
    }

    @action.bound
    public async fetch() {
        const list = await axios.get('/period').then((res) => res.data).then((list_) => list_.map((item: amb.IPeriod) => new Period(item)));
        this.list = list.map((item: any) => new Period(item));
    }
}
