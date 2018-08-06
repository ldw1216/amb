import axios from 'axios';
import { BudgetSubjectType } from 'config/config';
import { action, observable } from 'mobx';

export default class Subject {
    // tslint:disable-next-line:variable-name
    @observable public _id: string = '';
    @observable public type: BudgetSubjectType;
    @observable public year: number;
    @observable public ambGroup: string;

    @observable public visibleEditor = true; // 显示编辑项目
    constructor(type: BudgetSubjectType, year: number, ambGroup: string, public container?: HTMLElement) {
        this.type = type;
        this.year = year;
        this.ambGroup = ambGroup;
        this.container = container;
    }
    @action.bound public showProjectEditor(data: amb.IBudgetSubject) {
        this.visibleEditor = true;
        this.type = data.type!;
    }
    @action.bound public hideProjectEditor() {
        this.visibleEditor = false;
        this.container && this.container.remove();
    }
    @action.bound public async save(data: amb.IBudgetSubject) {
        const url = '/subject' + (data._id ? '/' + data._id : '');
        data.type = this.type;
        data.year = this.year;
        data.ambGroup = this.ambGroup;
        await axios.post(url, data);
        console.log(this.container);
        this.hideProjectEditor();
    }
}
