import axios from 'axios';
import { BudgetSubjectType } from 'config/config';
import { action, observable } from 'mobx';

export default class Subject {
    // tslint:disable-next-line:variable-name
    @observable public _id: string = '';
    @observable public type: BudgetSubjectType;
    @observable public visibleEditor = true; // 显示编辑项目
    constructor(type: BudgetSubjectType) {
        this.type = type;
    }
    @action.bound public showProjectEditor(data: amb.IBudgetSubject) {
        this.visibleEditor = true;
        this.type = data.type!;
    }
    @action.bound public hideProjectEditor() {
        this.visibleEditor = false;
    }
    @action.bound public async save(data: amb.IBudgetSubject) {
        const url = '/subject' + (data._id ? '/' + data._id : '');
        await axios.post(url, data);
    }
}
