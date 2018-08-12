import { Icon, InputNumber, Popconfirm, Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { ApprovalState, BudgetSubjectType, BudgetType, SearchRange } from 'config/config';
import { action, computed, observable, toJS } from 'mobx';
import { filter, values } from 'ramda';
import React from 'react';
import { render } from 'react-dom';

import styled from 'styled-components';
import ApprovalTtitle from '../components/ApprovalTtitle';
import SubjectEditor from '../components/SubjectEditor';
import SubjectTitle from '../components/SubjectTitle';
import Budget from './Budget';
import MonthBudget from './MonthBudget';
import Subject from './Subject';
import SubjectBudget from './SubjectBudget';

const SubjectSubTitle = styled.div`
    text-align: left;
    i{
        visibility:hidden;
        margin-right:5px;
    }
    &:hover {
       i{
           visibility:visible;
       }
    }
`;

const SelectOption = Select.Option;
const TypeSelector: React.SFC<SelectProps> = (props) => (
    <Select style={{ width: 100 }} {...props}>
        {Object.keys(BudgetType).map((item) => <SelectOption key={item} value={item}>{item}</SelectOption>)}
    </Select>
);

export default class BudgetTable {
    public allTitles = [['预算', '预算'], ['预算占收入比', '占收入比'], ['实际收入', '实际收入'], ['实际占收入比', '占收入比'], ['预算完成率', '预算完成率']];
    @observable public visibleRanges: SearchRange[] = filter((val) => [SearchRange.上一年].includes(val), values(SearchRange)); // 显示的时间范围
    @observable public visibleTitles = this.allTitles;
    @observable public visibleType = true;
    @observable public budget: Budget;
    @observable public period?: amb.IPeriod;
    @observable public editable: boolean = false;
    constructor(budget: Budget, period: amb.IPeriod | undefined, editable = false) {
        this.budget = budget;
        this.period = period;
        this.editable = editable;
    }

    @computed get approvalState() {
        const period = rootStore.periodStore.list.filter((item) => item.state === '提报中').find((item) => item.groups.includes(this.budget.group) || item.allGroup);

        // 还没有提报周期
        if (!period) return ApprovalState.没有提报周期;

        // 新的预算周期
        if (period._id !== this.budget.period) return ApprovalState.未提报;

        // 未提报
        if (!this.budget.approvalState) return ApprovalState.未提报;
        return this.budget.approvalState;
    }
    // 添加项目
    @action.bound private addProject(subjectType: BudgetSubjectType) {
        const container = document.getElementById('root')!.appendChild(document.createElement('div'));
        const subject = new Subject({ subjectType, budgetType: undefined, year: this.budget.year, group: this.budget.group }, container);
        render(<SubjectEditor subject={subject} budget={this.budget} />, container);
    }
    // 删除项目
    @action.bound
    private async removeProject(subject: Subject) {
        await subject.remove();
        this.budget.fetchSubjects();
    }
    @computed get expenseSubjects() {
        return rootStore.expenseTypeStore.getExpenseSubject(this.budget.year);
    }

    // 可提报的月份
    @computed get editableMonths() {
        const months: number[] = [];
        if (!this.period || !this.editable) return months;

        if (this.period.quarters.includes('一季度')) months.push(0, 1, 2);
        if (this.period.quarters.includes('二季度')) months.push(3, 4, 5);
        if (this.period.quarters.includes('三季度')) months.push(6, 7, 8);
        if (this.period.quarters.includes('四季度')) months.push(9, 10, 11);
        return months;
    }
    private getBudgetValue(month: number, subject: amb.IBudgetSubject) {
        const defalut = { budget: 0, reality: 0 };
        const monthBuget = this.budget.monthBudgets.find((item) => item.month === month);
        if (!monthBuget) return defalut;
        const subjectBudget = monthBuget.getSubjectBudget(subject);
        return subjectBudget || defalut;
    }

    // 设置预算值
    @action.bound private setBudgetValue(month: number, subject: amb.IBudgetSubject, value: { budget?: number, reality?: number }) {
        let monthBuget = this.budget.monthBudgets.find((item) => item.month === month);

        if (!monthBuget) {
            monthBuget = new MonthBudget({
                month,
                subjectBudgets: [],
            });
            this.budget.monthBudgets.push(monthBuget);
        }
        let subjectBudget = monthBuget.subjectBudgets.find(({ subjectId }) => subject._id === subjectId);
        if (!subjectBudget) {
            subjectBudget = new SubjectBudget({
                subjectId: subject._id!,
                subjectType: subject.subjectType!,
                subjectName: subject.name!, // 子类型id
            });
            monthBuget.subjectBudgets.push(subjectBudget);
        }
        if (value.budget) subjectBudget!.budget = value.budget;
        if (value.reality) subjectBudget!.reality = value.reality;
    }

    @computed get dataSource() {
        const incomeRows = [] as any[]; // 收入数据
        const costRows = [] as any[]; // 成本数据
        const expenseRows = [] as any[]; // 费用数据

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
        // 添加收入、成本、费用汇总
        this.budget.monthBudgets.forEach((monthBudget, i) => {
            incomeAmount[`预算_${i}月`] = monthBudget.budgetSum.income;
            incomeAmount[`预算占收入比_${i}月`] = '100%';
            incomeAmount[`实际收入_${i}月`] = monthBudget.realitySum.income;
            incomeAmount[`实际占收入比_${i}月`] = '100%';
            incomeAmount[`预算完成率_${i}月`] = monthBudget.budgetSum.income ? (monthBudget.realitySum.income / monthBudget.budgetSum.income * 100).toFixed(2) + '%' : '--';

            costAmount[`预算_${i}月`] = monthBudget.budgetSum.cost;
            costAmount[`预算占收入比_${i}月`] = monthBudget.budgetSum.income ? (monthBudget.budgetSum.cost / monthBudget.budgetSum.income * 100).toFixed(2) + '%' : '--';
            costAmount[`实际收入_${i}月`] = monthBudget.realitySum.cost;
            costAmount[`实际占收入比_${i}月`] = monthBudget.realitySum.income ? (monthBudget.realitySum.cost / monthBudget.realitySum.income * 100).toFixed(2) + '%' : '--';
            costAmount[`预算完成率_${i}月`] = monthBudget.budgetSum.cost ? (monthBudget.realitySum.cost / monthBudget.budgetSum.cost * 100).toFixed(2) + '%' : '--';

            expenseAmount[`预算_${i}月`] = monthBudget.budgetSum.expense;
            expenseAmount[`预算占收入比_${i}月`] = (monthBudget.budgetSum.expense / monthBudget.budgetSum.income * 100).toFixed(2) + '%';
            expenseAmount[`实际收入_${i}月`] = monthBudget.realitySum.expense;
            expenseAmount[`实际占收入比_${i}月`] = monthBudget.realitySum.income ? (monthBudget.realitySum.expense / monthBudget.realitySum.income * 100).toFixed(2) + '%' : '--';
            expenseAmount[`预算完成率_${i}月`] = monthBudget.budgetSum.expense ? (monthBudget.realitySum.expense / monthBudget.budgetSum.expense * 100).toFixed(2) + '%' : '--';
        });
        // 每个项目一行，添加数据，修改数据 填加完数据以后跟据提报周期确定哪几个季度是可编辑的
        this.budget.subjects.concat(this.expenseSubjects as any).forEach((subject) => {
            const row = {
                key: subject._id,
                subject: <SubjectSubTitle>
                    <Popconfirm placement="topLeft" title="确认删除？" onConfirm={() => this.removeProject(subject)} okText="确认" cancelText="取消">
                        <Icon type="close" />
                    </Popconfirm>
                    {subject && subject.name}</SubjectSubTitle >,
                type: <TypeSelector onChange={(e) => subject.save && subject.save({ budgetType: e as any })} value={subject.budgetType} />,
            } as any;

            this.budget.monthBudgets.forEach((monthBudget, i) => {
                const data = this.getBudgetValue(i, subject);
                row[`预算_${i}月`] = data && data.budget;
                row[`预算占收入比_${i}月`] = '--';
                row[`实际收入_${i}月`] = this.getBudgetValue(i, subject).reality;
                row[`实际占收入比_${i}月`] = 44;
                row[`预算完成率_${i}月`] = 'a';
            });

            this.editableMonths.forEach((i) => {
                row[`预算_${i}月`] = <InputNumber value={this.getBudgetValue(i, subject).budget} onChange={(value) => this.setBudgetValue(i, subject, { budget: +(value || 0) })} />;
                row[`实际收入_${i}月`] = <InputNumber value={this.getBudgetValue(i, subject).reality} onChange={(value) => this.setBudgetValue(i, subject, { reality: +(value || 0) })} />;
            });
            if (subject.subjectType === BudgetSubjectType.收入) incomeRows.push(row);
            if (subject.subjectType === BudgetSubjectType.成本) costRows.push(row);
            if (subject.subjectType === BudgetSubjectType.费用) expenseRows.push(row);
        });

        const dataSource = [incomeAmount].concat(incomeRows, costAmount, costRows, expenseAmount, expenseRows);
        return dataSource;
    }
    @computed public get columns() {
        const columns = [
            {
                title: this.budget.year,
                dataIndex: 'head',
                key: 'head',
                fixed: 'left',
                children: [
                    {
                        title: this.budget.groupName,
                        dataIndex: `subject`,
                        key: `subject`,
                    },
                ],
            } as any,
        ];
        if (this.visibleType) {
            columns[0].children.push({
                title: `类型`,
                dataIndex: `type`,
                key: `type`,
            });
        }

        for (let i = 0; i < 12; i++) {
            const children = this.visibleTitles.map(([key, value]) => ({
                id: key,
                title: value,
                dataIndex: `${key}_${i}月`,
                key: `${key}_${i}月`,
            }));
            columns.push({
                title: `${i + 1}月`,
                dataIndex: `month${i}`,
                key: `month${i}`,
                children,
            });
        }
        return columns;
    }
}
