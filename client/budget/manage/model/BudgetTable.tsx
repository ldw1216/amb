import { Icon, Input, InputNumber, Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { BudgetSubjectType, BudgetType, SearchDataType, SearchRange } from 'config/config';
import { action, computed, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { filter, values } from 'ramda';
import React from 'react';
import { render } from 'react-dom';
import rootStore from 'store/index';
import SubjectEditor from '../components/SubjectEditor';
import SubjectTitle from '../components/SubjectTitle';
import Budget from './Budget';
import MonthBudget from './MonthBudget';
import Subject from './Subject';
import SubjectBudget from './SubjectBudget';

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
    // 添加项目
    @action.bound private addProject(subjectType: BudgetSubjectType) {
        const container = document.getElementById('root')!.appendChild(document.createElement('div'));
        const subject = new Subject({ subjectType, budgetType: undefined, year: this.budget.year, group: this.budget.group }, container);
        render(<SubjectEditor subject={subject} budget={this.budget} />, container);
    }

    @computed get expenseSubjects() {
        const expense = rootStore.expenseTypes.find(({ year }) => year === this.budget.year);
        return expense ? expense.options.map((item) => ({ ...item, subjectType: BudgetSubjectType.费用 })) : [];
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
    private getBudgetValue(month: number, subjectSubId: string) {
        const defalut = { budget: 0, reality: 0 };
        const monthBuget = this.budget.monthBudgets.find((item) => item.month === month);
        if (!monthBuget) return defalut;
        const subjectBudget = monthBuget.subjectBudgets.find(({ subjectId }) => subjectSubId === subjectId);
        if (subjectBudget) return { budget: subjectBudget.budget, reality: subjectBudget.reality };
        return defalut;
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
                subjectType: subject.subjectType,
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
        // 添加收入汇总
        for (let i = 0; i < 12; i++) {
            incomeAmount[`预算_${i}月`] = '';
            incomeAmount[`预算占收入比_${i}月`] = '';
            incomeAmount[`实际收入_${i}月`] = '';
            incomeAmount[`实际占收入比_${i}`] = '';
            incomeAmount[`预算完成率_${i}月`] = '';
        }

        // 每个项目一行，添加数据，修改数据 填加完数据以后跟据提报周期确定哪几个季度是可编辑的
        this.budget.subjects.concat(this.expenseSubjects).forEach((subject) => {
            const row = {
                key: subject._id,
                subject: <div style={{ textAlign: 'left', paddingLeft: 18 }}>{subject && subject.name}</div>,
                type: <TypeSelector value={subject.budgetType} />,
            } as any;

            this.budget.monthBudgets.forEach((monthBudget, i) => {
                //
            });

            this.editableMonths.forEach((i) => {
                row[`预算_${i}月`] = <InputNumber value={this.getBudgetValue(i, subject._id!).budget} onChange={(value) => this.setBudgetValue(i, subject, { budget: parseFloat((value || '0').toString()) })} />;
                row[`预算占收入比_${i}月`] = 88;
                row[`实际收入_${i}月`] = <InputNumber value={this.getBudgetValue(i, subject._id!).reality} onChange={(value) => this.setBudgetValue(i, subject, { reality: parseFloat((value || '0').toString()) })} />;
                row[`实际占收入比_${i}月`] = 44;
                row[`预算完成率_${i}月`] = 'a';
            });
            if (subject.subjectType === BudgetSubjectType.收入) incomeRows.push(row);
            if (subject.subjectType === BudgetSubjectType.成本) costRows.push(row);
            if (subject.subjectType === BudgetSubjectType.费用) expenseRows.push(row);
        });
        // this.budget.subjectBudgets.map((subjectBudget, subjectBudgetIndex) => {
        //     const subject = this.budget.subjects.find((item) => item._id === subjectBudget.subjectSubType);
        //     const expense = this.budget.expenseTypes.find((item) => item._id === subjectBudget.subjectSubType);

        //     const row = {
        //         key: subjectBudgetIndex,
        //         subject: <div style={{ textAlign: 'left', paddingLeft: 18 }}>{subject && subject.name || expense && expense.name}</div>,
        //         type: <TypeSelector value={subjectBudget.type} onChange={(type) => subjectBudget.type = type.toString() as BudgetType} />,
        //     } as any;
        //     subjectBudget.monthBudgets.forEach((monthBudget, i) => {
        //         row[`预算_${i}月`] = <InputNumber value={monthBudget.money} onChange={(value) => monthBudget.money = parseFloat(value ? value.toString() : '0') || 0} />;
        //         row[`预算占收入比_${i}月`] = 88;
        //         row[`实际收入_${i}月`] = <InputNumber value={monthBudget.reality} onChange={(value) => monthBudget.reality = parseFloat(value ? value.toString() : '0') || 0} />;
        //         row[`实际占收入比_${i}月`] = 44;
        //         row[`预算完成率_${i}月`] = 'a';
        //     });
        //     if (subjectBudget.subjectType === BudgetSubjectType.收入) incomeRows.push(row);
        //     if (subjectBudget.subjectType === BudgetSubjectType.成本) costRows.push(row);
        //     if (subjectBudget.subjectType === BudgetSubjectType.费用) expenseRows.push(row);
        // });

        const dataSource = [incomeAmount].concat(incomeRows, costAmount, costRows, expenseAmount, expenseRows);
        return dataSource;
    }
    @computed get columns() {
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
