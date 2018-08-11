import axios from 'axios';
import { computed, observable } from 'mobx';
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
