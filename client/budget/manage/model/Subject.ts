import axios from 'axios';
import { BudgetSubjectType } from 'config/config';
import { action, observable } from 'mobx';

export default class Subject {
    // tslint:disable-next-line:variable-name
    @observable public _id: string = '';
    @observable public name: string = '';
    @observable public type: BudgetSubjectType;
    @observable public year: number;
    @observable public group: string;

    @observable public visibleEditor = true; // 显示编辑项目
    constructor(data: amb.IBudgetSubject, public container?: HTMLElement) {
        this._id = data._id || '';
        this.type = data.type!;
        this.name = data.name || '';
        this.year = data.year!;
        this.group = data.group!;
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
        data.group = this.group;
        await axios.post(url, data);
        console.log(this.container);
        this.hideProjectEditor();
    }
}
