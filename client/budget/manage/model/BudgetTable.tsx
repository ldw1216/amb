import { Icon, Input, InputNumber, Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import axios from 'axios';
import { BudgetSubjectType, BudgetType, SearchDataType, SearchRange } from 'config/config';
import { action, computed, observable, toJS } from 'mobx';
import React from 'react';
import { render } from 'react-dom';
import SubjectEditor from '../components/SubjectEditor';
import SubjectTitle from '../components/SubjectTitle';
import Budget from './Budget';
import Subject from './Subject';

const SelectOption = Select.Option;
const TypeSelector: React.SFC<SelectProps> = (props) => (
    <Select style={{ width: 100 }} {...props}>
        {Object.keys(BudgetType).map((item) => <SelectOption key={item} value={item}>{item}</SelectOption>)}
    </Select>
);

export default class BudgetTable {
    @observable public budget: Budget;
    constructor(budget: Budget) {
        this.budget = budget;
    }
     // 添加项目
     @action.bound private addProject(type: BudgetSubjectType) {
        const container = document.getElementById('root')!.appendChild(document.createElement('div'));
        const subject = new Subject({ type, year: this.budget.year, group: this.budget.group }, container);
        render(<SubjectEditor subject={subject} budget={this.budget} />, container);
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

        this.budget.subjectBudgets.map((subjectBudget, subjectBudgetIndex) => {
            const subject = this.budget.subjects.find((item) => item._id === subjectBudget.subjectSubType);
            const expense = this.budget.expenseTypes.find((item) => item._id === subjectBudget.subjectSubType);

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
                        title: this.budget.groupName,
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
