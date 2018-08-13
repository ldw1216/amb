import { Divider, Icon, InputNumber, Popconfirm, Popover, Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { ApprovalState, BudgetSubjectType, BudgetType, SearchRange } from 'config/config';
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
    private getBudgetValue(monthBudget: MonthBudget, subject: amb.IBudgetSubject) {
        const subjectBudget = monthBudget.getSubjectBudget(subject);
        if (subjectBudget) return subjectBudget;
        return new SubjectBudget({
            subjectId: subject._id!,
            subjectType: subject.subjectType,
            subjectName: subject.name!,
            budget: undefined,
            reality: undefined,
        }, monthBudget);
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
            }, monthBuget);
            monthBuget.subjectBudgets.push(subjectBudget);
        }
        if (value.budget) subjectBudget!.budget = value.budget;
        if (value.reality) subjectBudget!.reality = value.reality;
    }

    @computed get dataSource() {
        const rewardRate = this.budget.fullGroup!.rewardRate; // 奖金比例
        const incomeRows = [] as any[]; // 收入数据
        const costRows = [] as any[]; // 成本数据
        const expenseRows = [] as any[]; // 费用数据
        const profitRow = {
            key: '毛利',
            subject: <SubjectSubTitle>毛利</SubjectSubTitle>,
        } as any; // 毛利
        const rewardRow = {
            key: '奖金',
            subject: <SubjectSubTitle>奖金</SubjectSubTitle>,
        } as any; // 利润
        const pureProfitRow = {
            key: '利润',
            subject: <SubjectSubTitle>利润</SubjectSubTitle>,
        } as any; // 利润
        const incomeAmount = {
            key: '收入汇总',
            subject: <SubjectTitle><span>收入</span>
                {this.canEdit && this.editableOption.addSubject ? <Icon onClick={() => this.addProject(BudgetSubjectType.收入)} type="plus" /> : ''}
            </SubjectTitle>,
        } as any;
        const costAmount = {
            key: '成本汇总',
            subject: <SubjectTitle><span>成本</span>
                {this.canEdit && this.editableOption.addSubject ? <Icon onClick={() => this.addProject(BudgetSubjectType.成本)} type="plus" /> : ''}</SubjectTitle>,
            type: undefined,
        } as any;
        const expenseAmount = {
            key: '费用汇总',
            subject: <SubjectTitle><span>费用</span></SubjectTitle>,
            type: undefined,
        } as any;

        this.budget.monthBudgets.forEach(({ month, budgetSum, realitySum, realityRate, rate, budgetRate }) => {
            incomeAmount[`预算_${month}月`] = budgetSum.income;
            incomeAmount[`预算占收入比_${month}月`] = budgetRate.income;
            incomeAmount[`实际收入_${month}月`] = realitySum.income;
            incomeAmount[`实际占收入比_${month}月`] = realityRate.income;
            incomeAmount[`预算完成率_${month}月`] = rate.income;

            costAmount[`预算_${month}月`] = budgetSum.cost;
            costAmount[`预算占收入比_${month}月`] = budgetRate.cost;
            costAmount[`实际收入_${month}月`] = realitySum.cost;
            costAmount[`实际占收入比_${month}月`] = realityRate.cost;
            costAmount[`预算完成率_${month}月`] = rate.cost;

            expenseAmount[`预算_${month}月`] = budgetSum.expense;
            expenseAmount[`预算占收入比_${month}月`] = budgetRate.expense;
            expenseAmount[`实际收入_${month}月`] = realitySum.expense;
            expenseAmount[`实际占收入比_${month}月`] = realityRate.expense;
            expenseAmount[`预算完成率_${month}月`] = rate.expense;

            profitRow[`预算_${month}月`] = budgetSum.profit;
            profitRow[`预算占收入比_${month}月`] = budgetRate.profit;
            profitRow[`实际收入_${month}月`] = realitySum.profit;
            profitRow[`实际占收入比_${month}月`] = realityRate.profit;
            profitRow[`预算完成率_${month}月`] = rate.profit;

            // 奖金计算
            rewardRow[`预算_${month}月`] = (budgetSum.profit * rewardRate / 100).toFixed(2);
            rewardRow[`实际收入_${month}月`] = (realitySum.profit * rewardRate / 100).toFixed(2);

        });
        // 每个项目一行，添加数据，修改数据 填加完数据以后跟据提报周期确定哪几个季度是可编辑的
        this.budget.subjects.concat(this.expenseSubjects as any).forEach((subject) => {
            const row = {
                key: subject._id,
                subject: <SubjectSubTitle>
                    {this.canEdit && this.editableOption.removeSubject ?
                        <Popconfirm placement="topLeft" title="确认删除？" onConfirm={() => this.removeProject(subject)} okText="确认" cancelText="取消">
                            <Icon type="close" />
                        </Popconfirm> : ''}
                    {subject && subject.name}</SubjectSubTitle >,
                type: this.editableOption.budgetType ? <TypeSelector onChange={(e) => subject.save && subject.save({ budgetType: e as any })} value={subject.budgetType} /> : subject.budgetType,
            } as any;

            this.budget.monthBudgets.forEach((monthBudget) => {
                const data = this.getBudgetValue(monthBudget, subject);
                row[`预算_${monthBudget.month}月`] = data && data.budget;
                row[`预算占收入比_${monthBudget.month}月`] = data.budgetRate;
                row[`实际收入_${monthBudget.month}月`] = data.reality;
                row[`实际占收入比_${monthBudget.month}月`] = data.realityRate;
                row[`预算完成率_${monthBudget.month}月`] = data.completeRate;
            });
            this.editableMonths.forEach((i) => {
                const monthBudget = this.budget.monthBudgets.find((item) => item.month === i) || new MonthBudget({ month: i, subjectBudgets: [] });
                row[`预算_${i}月`] = this.editableOption.budget ? <InputNumber value={this.getBudgetValue(monthBudget, subject).budget} onChange={(value) => this.setBudgetValue(i, subject, { budget: +(value || 0) })} /> : this.getBudgetValue(monthBudget, subject).budget;
                row[`实际收入_${i}月`] = this.editableOption.reality ? <InputNumber value={this.getBudgetValue(monthBudget, subject).reality} onChange={(value) => this.setBudgetValue(i, subject, { reality: +(value || 0) })} /> : this.getBudgetValue(monthBudget, subject).reality;
            });
            if (subject.subjectType === BudgetSubjectType.收入) incomeRows.push(row);
            if (subject.subjectType === BudgetSubjectType.成本) costRows.push(row);
            if (subject.subjectType === BudgetSubjectType.费用) expenseRows.push(row);
        });

        const dataSource = [incomeAmount].concat(incomeRows, costAmount, costRows, profitRow, expenseAmount, rewardRow, expenseRows, pureProfitRow);
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
        const titleList = [0, 1, 2, '一季度', 3, 4, 5, '二季度', '半年报', 6, 7, 8, '三季度', 9, 10, 11, '四季度', '全年报'];
        titleList.forEach((k: string | number) => {
            if (typeof k === 'number') {
                const children = this.visibleTitles.map(([key, value]) => ({
                    id: key,
                    title: value,
                    dataIndex: `${key}_${k}月`,
                    key: `${key}_${k}月`,
                }));
                columns.push({
                    title: `${k + 1}月`,
                    dataIndex: `month${k}`,
                    key: `month${k}`,
                    children,
                });
            } else if (this.visibleRanges.includes(k as any)) {
                const children2 = this.visibleTitles.map(([key, value]) => ({
                    id: key,
                    title: value,
                    dataIndex: `${key}_${k}quarter`,
                    key: `${key}_${k}quarter`,
                }));
                columns.push({
                    title: k,
                    dataIndex: `quarter${k}`,
                    key: `quarter${k}`,
                    children: children2,
                });
            }
        });
        return columns;
    }
}
