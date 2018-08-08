import { Icon, Input, InputNumber, Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import axios from 'axios';
import { BudgetSubjectType, BudgetType, SearchDataType, SearchRange } from 'config/config';
import { action, computed, observable, toJS } from 'mobx';
import React from 'react';
import { render } from 'react-dom';
import rootStore from '../../../store';
import SubjectEditor from '../components/SubjectEditor';
import SubjectTitle from '../components/SubjectTitle';
import MonthBudget from './MonthBudget';
import Subject from './Subject';
import SubjectBudget from './SubjectBudget';

// 预算数据
export default class Budget implements amb.IBudget {
    // tslint:disable-next-line:variable-name
    public _id?: string;
    @observable public user: string;
    @observable public group: string;
    @observable public groupName: string;
    @observable public period?: string;
    @observable public year: number;
    @observable public subjectBudgets: SubjectBudget[] = [];
    @observable public subjects: amb.IBudgetSubject[] = [];

    constructor(data: amb.IBudget & { groupName: string }) {
        this._id = data._id;
        this.user = data.user; // 预算周期
        this.group = data.group; // 预算周期
        this.groupName = data.groupName;
        this.period = data.period;
        this.year = data.year; // 预算周期
        this.subjectBudgets = data.subjectBudgets || [];

        Object.defineProperties(this, {
            groupName: { enumerable: false },
            subjects: { enumerable: false },
        });
        this.fetch();
    }

    @computed get expenseTypes(): amb.IExpenseTypeOption[] {
        const data = rootStore.expenseTypes.find((item) => item.year === this.year);
        return data ? data.options : [];
    }

    @action.bound public async fetch() {
        // 从数据库拉取项目
        this.subjects = await axios.get(`/subject`, { params: { year: this.year, group: this.group } }).then((res) => res.data.map((item: amb.IBudgetSubject) => new Subject(item)));
        const subjectBudgets = this.subjects.map((subject) => {
            // 生成收入预算数据
            const monthBudgets: MonthBudget[] = [];
            for (let i = 0; i < 12; i++) {
                const budgetItem = new MonthBudget(i);
                monthBudgets.push(budgetItem);
            }
            // 每一行预算的数据
            return new SubjectBudget({
                _id: '', // 从数据库中获取
                subjectType: subject.type,
                subjectSubType: subject._id,
                type: undefined, // 从数据库中获取
                monthBudgets,
            });
        });
        this.expenseTypes.forEach((option, optionIndex) => {
            // 生成收入预算数据
            const monthBudgets: MonthBudget[] = [];
            for (let i = 0; i < 12; i++) {
                const budgetItem = new MonthBudget(i);
                monthBudgets.push(budgetItem);
            }
            // 每一行预算的数据
            subjectBudgets.push(new SubjectBudget({
                _id: '', // 从数据库中获取
                subjectType: BudgetSubjectType.费用,
                subjectSubType: option._id,
                type: option.type, // 从数据库中获取
                monthBudgets,
            }));
        });
        this.subjectBudgets = subjectBudgets;
    }
    // 增加一个预算
    @action.bound public addBudgetRow() {
        //
    }

    // 删除预算行 - 同时删除预算类型
    @action.bound public removeBudgetRow(id: string) {
        //
    }
}
