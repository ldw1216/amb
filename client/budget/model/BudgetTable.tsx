import { Icon, InputNumber, Popconfirm, Popover, Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { ApprovalState, BudgetSubjectType, BudgetType } from 'config/config';
import { action, computed, observable, reaction, toJS } from 'mobx';
import React from 'react';
import { render } from 'react-dom';

import styled from 'styled-components';
import SubjectEditor from '../components/SubjectEditor';
import SubjectTitle from '../components/SubjectTitle';
import Budget from './Budget';
import Condition from './Condition';
import MonthBudget from './MonthBudget';
import Subject from './Subject';
import SubjectBudget from './SubjectBudget';

const SubjectSubTitle = styled.div`
    text-align: left;
    margin-left: 20px;
    i{
        position: absolute;
        margin-left: -14px;
        margin-top: 3px;
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

const allTitleMap = {
    预算占比: ['预算占收入比', '占收入比'],
    实际完成: ['实际收入', '实际收入'],
    实际占比: ['实际占收入比', '占收入比'],
    预算完成率: ['预算完成率', '预算完成率'],
} as any;
export default class BudgetTable {
    // private allTitles = [['预算', '预算'], ['预算占收入比', '占收入比'], ['实际收入', '实际收入'], ['实际占收入比', '占收入比'], ['预算完成率', '预算完成率']];
    @observable public visibleType = true;
    @observable public budget: Budget;
    @observable public editableOption: amb.ITableEditableOptiont;
    @observable public condition: Condition;
    constructor(budget: Budget, condition: Condition, editableOption: amb.ITableEditableOptiont) {
        this.budget = budget;
        this.editableOption = editableOption || {};
        this.condition = condition;
        reaction(() => this.condition.year, (year) => {
            console.log(year);
        });
    }
    @computed get canEdit() {
        return this.approvalState < ApprovalState.已通过审核 && this.budget.groupIsAvailable;
    }
    @computed get approvalState() {
        if (!this.budget.groupIsAvailable) {
            return ApprovalState.阿米巴组已失效;
        }
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

    @computed get visibleRanges() {
        return this.condition.range;
    }
    @computed get visibleTitles() {
        if (this.condition.budgetRatioVisible) {
            return [['预算', '预算'], ...this.condition.dataTypes.map((d: string) => allTitleMap[d])];
        } else {
            return [['预算', '预算'], ...this.condition.dataTypes.map((d: string) => allTitleMap[d])].filter((i) => i[0] !== '预算占收入比' && i[0] !== '实际占收入比');
        }
    }
    @computed get expenseSubjects() {
        return rootStore.expenseTypeStore.getExpenseSubject(this.budget.year);
    }

    // 可提报的月份
    @computed get editableMonths() {
        // 跟据当前用户阿米巴组的排期，计算可提报月份
        const months: number[] = [];
        const group = this.budget.fullGroup;
        const period = group && group.period;
        if (!this.editableOption.budget && !this.editableOption.reality || !group || !period) return months;
        if (period.quarters.includes('一季度')) months.push(0, 1, 2);
        if (period.quarters.includes('二季度')) months.push(3, 4, 5);
        if (period.quarters.includes('三季度')) months.push(6, 7, 8);
        if (period.quarters.includes('四季度')) months.push(9, 10, 11);
        return months;
    }

    // 获取具体预算
    private getBudgetValue(monthBudget: MonthBudget, subject: amb.IRowSubject) {
        const subjectBudget = monthBudget.getSubjectBudget(subject);
        if (subjectBudget) return subjectBudget;
        return new SubjectBudget({
            subjectId: subject.subjectId!,
            subjectType: subject.subjectType,
            subjectName: subject.name!,
            budget: undefined,
            reality: undefined,
        }, monthBudget);
    }

    // 设置预算值
    @action.bound private setBudgetValue(monthIndex: number, subject: amb.IRowSubject, value: { budget?: number, reality?: number }) {
        let monthBuget = this.budget.monthBudgets.find((item) => item.index === monthIndex);

        if (!monthBuget) {
            monthBuget = new MonthBudget({
                index: monthIndex,
                name: `${monthIndex + 1}月份`,
                subjectBudgets: [],
            }, this.budget.fullGroup);
            this.budget.monthBudgets.push(monthBuget);
        }
        let subjectBudget = monthBuget.subjectBudgets.find(({ subjectId }) => subject.subjectId === subjectId);
        if (!subjectBudget) {
            subjectBudget = new SubjectBudget({
                subjectId: subject.subjectId!,
                subjectType: subject.subjectType!,
                subjectName: subject.name!, // 子类型id
            }, monthBuget);
            monthBuget.subjectBudgets.push(subjectBudget);
        }
        if (value.budget) subjectBudget!.budget = value.budget;
        if (value.reality) subjectBudget!.reality = value.reality;
        if (!monthBuget.isDirty) { // 标记被修改过
            monthBuget.isDirty = true;
            monthBuget.rewardRate = this.budget.fullGroup.rewardRate;
        }
    }

    @computed get dataSource() {
        const incomeRows = [] as any[]; // 收入数据
        const costRows = [] as any[]; // 成本数据
        const expenseRows = [] as any[]; // 费用数据
        const sumRowMap = {
            profit: { key: '毛利', subject: <SubjectSubTitle>毛利</SubjectSubTitle> } as any,
            reward: { key: '奖金', subject: <SubjectSubTitle>奖金</SubjectSubTitle> } as any,
            pureProfit: { key: '利润', subject: <SubjectSubTitle>利润</SubjectSubTitle> } as any,
            expense: { key: '费用汇总', subject: <SubjectTitle><span>费用</span></SubjectTitle>, type: undefined } as any,
            income: {
                key: '收入汇总',
                subject: <SubjectTitle><span>收入</span>
                    {this.canEdit && this.editableOption.addSubject ? <Icon onClick={() => this.addProject(BudgetSubjectType.收入)} type="plus" /> : ''}
                </SubjectTitle>,
            } as any,
            cost: {
                key: '成本汇总',
                subject: <SubjectTitle><span>成本</span>
                    {this.canEdit && this.editableOption.addSubject ? <Icon onClick={() => this.addProject(BudgetSubjectType.成本)} type="plus" /> : ''}</SubjectTitle>,
                type: undefined,
            } as any,
        } as any;
        console.log(toJS(this.budget.quarterBudgets));
        ['income', 'cost', 'expense', 'profit', 'reward', 'pureProfit'].forEach((col) => {
            this.budget.monthBudgets.concat(this.budget.quarterBudgets).forEach(({ index, budget, reality, realityRate, completeRate, budgetRate }) => {
                sumRowMap[col][`预算_${index}月`] = (budget as any)[col] && (budget as any)[col].toFixed(2);
                sumRowMap[col][`预算占收入比_${index}月`] = formatRate((budgetRate as any)[col]);
                sumRowMap[col][`实际收入_${index}月`] = (reality as any)[col];
                sumRowMap[col][`实际占收入比_${index}月`] = formatRate((realityRate as any)[col]);
                sumRowMap[col][`预算完成率_${index}月`] = formatRate((completeRate as any)[col]);
            });
        });
        // 每个项目一行，添加数据，修改数据 填加完数据以后跟据提报周期确定哪几个季度是可编辑的
        const rowSubjects: amb.IRowSubject[] = this.budget.subjects.map((item) => ({
            subjectId: item._id!,
            budgetType: item.budgetType,
            subjectType: item.subjectType,
            name: item.name!,
        })).concat(this.expenseSubjects.map((item) => ({
            subjectId: item._id!,
            budgetType: item.budgetType!,
            subjectType: item.subjectType,
            name: item.name!,
        })));
        rowSubjects.forEach((rowSubject) => {
            const subject = this.budget.subjects.find((item) => item._id === rowSubject.subjectId)!;
            const row = {
                key: rowSubject.subjectId,
                subject: <SubjectSubTitle>
                    {this.canEdit && this.editableOption.removeSubject ?
                        <Popconfirm placement="topLeft" title="确认删除？" onConfirm={() => this.removeProject(subject)} okText="确认" cancelText="取消">
                            <Icon type="close" />
                        </Popconfirm> : ''}
                    {rowSubject && rowSubject.name}</SubjectSubTitle >,
                // type: ,
            } as any;
            if (subject) {
                row.type = this.editableOption.budgetType ? <TypeSelector onChange={(e) => subject.save && subject.save({ budgetType: e as any })} value={subject.budgetType} /> : subject.budgetType;
            } else {
                row.type = rowSubject.budgetType;
            }
            this.budget.monthBudgets.forEach((monthBudget) => {
                const data = this.getBudgetValue(monthBudget, rowSubject);
                row[`预算_${monthBudget.index}月`] = data.budget;
                row[`预算占收入比_${monthBudget.index}月`] = formatRate(data.budgetRate);
                row[`实际收入_${monthBudget.index}月`] = data.reality;
                row[`实际占收入比_${monthBudget.index}月`] = formatRate(data.realityRate);
                row[`预算完成率_${monthBudget.index}月`] = formatRate(data.completeRate);
            });
            this.editableMonths.forEach((i) => {
                const monthBudget = this.budget.monthBudgets.find((item) => item.index === i) || new MonthBudget({ index: i, name: `${i + 1}月份`, subjectBudgets: [] }, this.budget.fullGroup);
                row[`预算_${i}月`] = this.editableOption.budget ? <InputNumber value={this.getBudgetValue(monthBudget, rowSubject).budget} onChange={(value) => this.setBudgetValue(i, rowSubject, { budget: +(value || 0) })} /> : this.getBudgetValue(monthBudget, rowSubject).budget;
                row[`实际收入_${i}月`] = this.editableOption.reality ? <InputNumber value={this.getBudgetValue(monthBudget, rowSubject).reality} onChange={(value) => this.setBudgetValue(i, rowSubject, { reality: +(value || 0) })} /> : this.getBudgetValue(monthBudget, rowSubject).reality;
            });
            if (rowSubject.subjectType === BudgetSubjectType.收入) incomeRows.push(row);
            if (rowSubject.subjectType === BudgetSubjectType.成本) costRows.push(row);
            if (rowSubject.subjectType === BudgetSubjectType.费用) expenseRows.push(row);
        });

        // 汇总数据
        const dataSource = [sumRowMap.income].concat(incomeRows, sumRowMap.cost, costRows, sumRowMap.profit, sumRowMap.expense, sumRowMap.reward, expenseRows, sumRowMap.pureProfit);
        return dataSource;
    }
    @computed public get columns() {
        const remark = (
            <pre style={{ whiteSpace: 'pre-wrap', maxWidth: '400px', maxHeight: '200px' }}>
                {this.budget.remark}
            </pre>
        );
        const columns = [
            {
                title: this.budget.year,
                dataIndex: 'head',
                key: 'head',
                fixed: 'left',
                children: [
                    {
                        title: <div style={{ textAlign: 'right' }}>
                            <span style={{ float: 'left' }}>{this.budget.groupName}</span>
                            <Popover content={remark}>
                                <Icon type="exclamation-circle-o" />
                            </Popover></div>,
                        dataIndex: `subject`,
                        key: `subject`,
                        width: 180,
                    },
                ],
            } as any,
        ];
        if (this.visibleType) {
            columns[0].children.push({
                title: `类型`,
                dataIndex: `type`,
                key: `type`,
                width: 100,
            });
        }
        const visibleList: Array<{ index: number, title: string }> = [];
        const range = this.condition.range as string[];
        if (range.includes('一季度')) visibleList.push({ index: 0, title: '1月' }, { index: 1, title: '2月' }, { index: 2, title: '3月' }, { index: 100, title: '一季度' });
        if (range.includes('二季度')) visibleList.push({ index: 3, title: '4月' }, { index: 4, title: '5月' }, { index: 5, title: '6月' }, { index: 200, title: '二季度' });
        if (range.includes('半年报')) visibleList.push({ index: 500, title: '半年报' });
        if (range.includes('三季度')) visibleList.push({ index: 6, title: '7月' }, { index: 7, title: '8月' }, { index: 8, title: '9月' }, { index: 300, title: '三季度' });
        if (range.includes('四季度')) visibleList.push({ index: 9, title: '10月' }, { index: 10, title: '11月' }, { index: 11, title: '12月' }, { index: 400, title: '半年报' });
        if (range.includes('全年报')) visibleList.push({ index: 600, title: '全年报' });

        visibleList.forEach(({ index, title }) => {
            const children = this.visibleTitles.map(([key, value]) => ({
                id: key,
                title: value,
                dataIndex: `${key}_${index}月`,
                key: `${key}_${index}`,
            }));
            columns.push({
                title,
                dataIndex: `month${index}`,
                key: `month${index}`,
                children,
            });
        });
        return columns;
    }
}

function formatRate(val: number | undefined) {
    return val === undefined ? '-' : (val * 100).toFixed(2) + '%';
}
