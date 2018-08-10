/**
 * 项目 （收入、成本、费用 的子项目）
 */

import axios from 'axios';
import { BudgetSubjectType, BudgetType } from 'config/config';
import { action, observable } from 'mobx';

export default class Subject implements amb.IBudgetSubject {
    // tslint:disable-next-line:variable-name
    @observable public _id?: string = '';
    @observable public name: string = '';
    @observable public subjectType?: BudgetSubjectType;
    @observable public budgetType: BudgetType;
    @observable public year: number;
    @observable public group: string;
    @observable public sort?: number;

    @observable public visibleEditor = true; // 显示编辑项目
    constructor(data: amb.IBudgetSubject, public container?: HTMLElement) {
        this._id = data._id;
        this.name = data.name || '';
        this.subjectType = data.subjectType;
        this.budgetType = data.budgetType!;
        this.year = data.year!;
        this.group = data.group!;
        this.sort = data.sort;
        this.container = container;
        Object.defineProperties(this, { container: { enumerable: false } });
    }
    @action.bound public showProjectEditor(data: amb.IBudgetSubject) {
        this.visibleEditor = true;
        this.subjectType = data.subjectType!;
    }
    @action.bound public hideProjectEditor() {
        this.visibleEditor = false;
        this.container && this.container.remove();
    }
    @action.bound public async save(data: amb.IBudgetSubject) {
        const url = '/subject' + (data._id ? '/' + data._id : '/' + this._id || '');
        await axios.post(url, Object.assign(this, data));
        this.hideProjectEditor();
    }
    @action.bound public async remove() {
        const url = '/subject/' + this._id;
        // await axios.delete(url);
    }
}
