import { Icon, Input, InputNumber, Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import axios from 'axios';
import { BudgetSubjectType, BudgetType, SearchDataType, SearchRange } from 'config/config';
import { action, computed, observable, toJS } from 'mobx';
import React from 'react';
import { render } from 'react-dom';
import SubjectEditor from '../components/SubjectEditor';
import SubjectTitle from '../components/SubjectTitle';
import Subject from './Subject';

const SelectOption = Select.Option;
const TypeSelector: React.SFC<SelectProps> = (props) => (
    <Select style={{ width: 100 }} {...props}>
        {Object.keys(BudgetType).map((item) => <SelectOption key={item} value={item}>{item}</SelectOption>)}
    </Select>
);

// 预算金额 某个项目，某个月份的预算
class MonthBudget implements amb.IMonthBudget {
    @observable public month: number;
    @observable public money?: number;
    @observable public reality?: number; // 真实金额
    constructor(month: number, money?: number, reality?: number) {
        this.month = month;
        this.money = money;
        this.reality = reality;
    }
}

// 预算行（某个项目的预算，比如人工成本预算）
export class SubjectBudget implements amb.ISubjectBudget {
    // tslint:disable-next-line:variable-name
    @observable public _id?: string;
    @observable public subjectType: BudgetSubjectType;
    @observable public subjectSubType?: string; // 子类型id
    @observable public type?: BudgetType;
    @observable public monthBudgets: MonthBudget[] = [];
    constructor(data: amb.ISubjectBudget) {
        this._id = data._id;
        this.subjectType = data.subjectType;
        this.subjectSubType = data.subjectSubType; // 子类型id
        this.type = data.type;
        this.monthBudgets = data.monthBudgets || [];
    }
}

// 预算数据
export default class Budget implements amb.IBudget {
    // tslint:disable-next-line:variable-name
    public _id?: string;
    @observable public user: string;
    @observable public group: string;
    @observable public period?: string;
    @observable public year: number;
    @observable public budgetList: SubjectBudget[] = []; // 预算数据 每行为一个元素
    @observable public subjectBudgets: SubjectBudget[] = [];
    @observable public subjects: amb.IBudgetSubject[] = [];

    constructor(data: amb.IBudget) {
        this._id = data._id;
        this.user = data.user; // 预算周期
        this.group = data.group; // 预算周期
        this.period = data.period;
        this.year = data.year; // 预算周期
        this.subjectBudgets = data.subjectBudgets || [];

        this.fetch();
    }

    @action.bound public fetch() {
        // 从数据库拉取项目
        axios.get(`/subject`, { params: { year: this.year, group: this.group } }).then((res) => {
            this.subjects = res.data.map((item: amb.IBudgetSubject) => new Subject(item));
            this.subjectBudgets = this.subjects.map((subject) => {
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
        });
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
        // const row = { project: '大数据收入', type: <TypeSelector />, key: '1' } as any;
        const 收入汇总标题 = <SubjectTitle><span>收入</span><Icon onClick={() => this.addProject(BudgetSubjectType.收入)} type="plus" /></SubjectTitle>;
        const 成本汇总标题 = <SubjectTitle><span>成本</span><Icon onClick={() => this.addProject(BudgetSubjectType.成本)} type="plus" /></SubjectTitle>;
        const 收入汇总 = {
            key: '收入汇总',
            subject: 收入汇总标题,
            type: '',
        } as any;
        const 成本汇总 = {
            key: '成本汇总',
            subject: 成本汇总标题,
            type: '',
        } as any;
        // 添加收入 、 成本 、 费用 、 毛利
        for (let i = 0; i < 12; i++) {
            收入汇总[`预算_${i}月`] = '';
            收入汇总[`预算占收入比_${i}月`] = '';
            收入汇总[`真实收入_${i}月`] = '';
            收入汇总[`实际占收入比_${i}`] = '';
            收入汇总[`预算完成率_${i}月`] = '';
        }

        // 增加收入项目
        const 收入项目s = this.subjectBudgets.map((subjectBudget, subjectBudgetIndex) => {
            const subject = this.subjects.find((item) => item._id === subjectBudget.subjectSubType) ;
            const 收入项目标题 = subject && subject.name;
            const row = {} as any;
            subjectBudget.monthBudgets.forEach((monthBudget, i) => { // budget.money = parseFloat(value ? value.toString() : '0')
                row[`预算_${i}月`] = <InputNumber value={monthBudget.money} onChange={(value) => monthBudget.money = parseFloat(value ? value.toString() : '0')} />;
                row[`预算占收入比_${i}月`] = 88;
                row[`真实收入_${i}月`] = <InputNumber value={monthBudget.reality} onChange={(value) => monthBudget.reality = parseFloat(value ? value.toString() : '0')} />;
                row[`实际占收入比_${i}`] = 44;
                row[`预算完成率_${i}月`] = '';
            });
            return {
                key: '收入' + subjectBudgetIndex,
                subject: 收入项目标题,
                type: <TypeSelector onChange={(type) => subjectBudget.type = type.toString() as BudgetType} />,
                ...row,
            };
        });

        const dataSource = [收入汇总].concat(收入项目s).concat(成本汇总);
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
                        title: `财务`,
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
