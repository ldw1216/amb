import { Icon, Input, InputNumber, Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import axios from 'axios';
import { BudgetSubjectType, BudgetType, SearchDataType, SearchRange } from 'config/config';
import { action, computed, observable, toJS } from 'mobx';
import React from 'react';
import { render } from 'react-dom';
import rootStore from 'store/index';
import SubjectEditor from '../components/SubjectEditor';
import SubjectTitle from '../components/SubjectTitle';
import MonthBudget from './MonthBudget';
import Subject from './Subject';
import SubjectBudget from './SubjectBudget';

const SelectOption = Select.Option;
const TypeSelector: React.SFC<SelectProps> = (props) => (
    <Select style={{ width: 100 }} {...props}>
        {Object.keys(BudgetType).map((item) => <SelectOption key={item} value={item}>{item}</SelectOption>)}
    </Select>
);

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
            console.log(option.name);
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

    // 添加项目
    @action.bound private addProject(type: BudgetSubjectType) {
        const container = document.getElementById('root')!.appendChild(document.createElement('div'));
        const subject = new Subject({ type, year: this.year, group: this.group }, container);
        render(<SubjectEditor subject={subject} budget={this} />, container);
    }
    @computed get dataSource() {
        const incomeAmount = {
            key: '收入汇总',
            subject: <SubjectTitle><span>收入</span><Icon onClick={() => this.addProject(BudgetSubjectType.收入)} type="plus" /></SubjectTitle>,
            type: undefined,
        } as any;
        const costAmount = {
            key: '成本汇总',
            subject: <SubjectTitle><span>成本</span><Icon onClick={() => this.addProject(BudgetSubjectType.成本)} type="plus" /></SubjectTitle>,
            type: undefined,
        } as any;
        const expenseAmount = {
            key: '费用汇总',
            subject: <SubjectTitle><span>费用</span></SubjectTitle>,
            type: undefined,
        } as any;
        // 添加收入汇总
        for (let i = 0; i < 12; i++) {
            incomeAmount[`预算_${i}月`] = '';
            incomeAmount[`预算占收入比_${i}月`] = '';
            incomeAmount[`真实收入_${i}月`] = '';
            incomeAmount[`实际占收入比_${i}`] = '';
            incomeAmount[`预算完成率_${i}月`] = '';
        }

        const incomeRows = [] as any[]; // 收入数据
        const costRows = [] as any[]; // 成本数据
        const expenseRows = [] as any[]; // 费用数据

        this.subjectBudgets.map((subjectBudget, subjectBudgetIndex) => {
            const subject = this.subjects.find((item) => item._id === subjectBudget.subjectSubType);
            const expense = this.expenseTypes.find((item) => item._id === subjectBudget.subjectSubType);

            const row = {
                key: subjectBudgetIndex,
                subject: <div style={{ textAlign: 'left', paddingLeft: 18 }}>{subject && subject.name || expense && expense.name}</div>,
                type: <TypeSelector value={subjectBudget.type} onChange={(type) => subjectBudget.type = type.toString() as BudgetType} />,
            } as any;
            subjectBudget.monthBudgets.forEach((monthBudget, i) => { // budget.money = parseFloat(value ? value.toString() : '0')
                row[`预算_${i}月`] = <InputNumber value={monthBudget.money} onChange={(value) => monthBudget.money = parseFloat(value ? value.toString() : '0') || 0} />;
                row[`预算占收入比_${i}月`] = 88;
                row[`真实收入_${i}月`] = <InputNumber value={monthBudget.reality} onChange={(value) => monthBudget.reality = parseFloat(value ? value.toString() : '0') || 0} />;
                row[`实际占收入比_${i}`] = 44;
                row[`预算完成率_${i}月`] = '';
            });
            if (subjectBudget.subjectType === BudgetSubjectType.收入) incomeRows.push(row);
            if (subjectBudget.subjectType === BudgetSubjectType.成本) costRows.push(row);
            if (subjectBudget.subjectType === BudgetSubjectType.费用) expenseRows.push(row);
        });

        const dataSource = [incomeAmount].concat(incomeRows, costAmount, costRows, expenseAmount, expenseRows);
        return dataSource;
    }
    @computed get columns() {
        const columns = [
            {
                title: '2018',
                dataIndex: 'head',
                key: 'head',
                fixed: 'left',
                children: [
                    {
                        title: this.groupName,
                        dataIndex: `subject`,
                        key: `subject`,
                    },
                    {
                        title: `类型`,
                        dataIndex: `type`,
                        key: `type`,
                    },
                ],
            } as any,
        ];
        for (let i = 0; i < 12; i++) {
            columns.push({
                title: `${i + 1}月`,
                dataIndex: `month${i}`,
                key: `month${i}`,
                children: [
                    {
                        title: `预算`,
                        dataIndex: `预算_${i}月`,
                        key: `预算_${i}月`,
                    },
                    {
                        title: `占收入比`,
                        dataIndex: `预算占收入比_${i}月`,
                        key: `预算占收入比_${i}月`,
                    },
                    {
                        title: `实际`,
                        dataIndex: `真实收入_${i}月`,
                        key: `真实收入_${i}月`,
                    },
                    {
                        title: `占收入比`,
                        dataIndex: `实际占收入比_${i}`,
                        key: `实际占收入比_${i}`,
                    },
                    {
                        title: `预算完成率`,
                        dataIndex: `预算完成率_${i}月`,
                        key: `预算完成率_${i}月`,
                    },
                ],
            });
        }
        return columns;
    }
}
