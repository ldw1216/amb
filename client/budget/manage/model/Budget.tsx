import { Icon, Input, Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import axios from 'axios';
import createValidator from 'components/createValidator';
import { BudgetSubjectType, BudgetType, SearchDataType, SearchRange } from 'config/config';
import { action, computed, observable } from 'mobx';
import React from 'react';
import { render } from 'react-dom';
import rootStore from 'store/index';
import SubjectEditor from '../components/SubjectEditor';
import SubjectTitle from '../components/SubjectTitle';
import Subject from './Subject';

const SelectOption = Select.Option;
const TypeSelector: React.SFC<SelectProps> = (props) => (
    <Select style={{ width: 80 }} {...props}>
        {Object.keys(BudgetType).map((item) => <SelectOption key={item} value={item}>{item}</SelectOption>)}
    </Select>
);

// 预算金额 某个项目，某个月份的预算
class BudgetItem {
    public month: number;
    public projectType?: BudgetSubjectType;
    public projectSubType?: string;
    public type?: BudgetType;
    public money?: number;
    constructor(month: number, money?: number) {
        this.month = month;
        this.money = money;
    }
}

// 预算行（某个项目的预算，比如人工成本预算）
export class SubjectBudget {
    // tslint:disable-next-line:variable-name
    @observable public _id?: string;
    @observable public subjectName?: string;
    @observable public type?: string;
    @observable public user?: string;
    @observable public ambGroup?: string;
    @observable public period?: string;
    @observable public year?: number;
    @observable public budgets: BudgetItem[] = [];
}

// 从哪里知道 预算周期 , 通过数据库查询当前用户属于几个group，查询完成后初始化BudgetPeriodList

// 预算数据
export default class Budget {
    @observable public year: number; // 预算周期
    @observable public group: amb.IGroup; // 预算周期
    @observable public budgetList: SubjectBudget[] = []; // 预算数据
    @observable public subjects: Subject[] = [];
    @observable public period?: amb.IPeriod;

    constructor(year: number, group: amb.IGroup, period?: amb.IPeriod, list?: amb.IBudget[]) {
        this.year = year;
        this.group = group;
        this.period = period;
        this.fetch();
    }

    @action.bound public fetch() {
        // 从数据库拉取项目
        axios.get(`/subject`, { params: { year: this.year, ambGroup: this.group._id || this.group } }).then((res) => {
            this.subjects = res.data.map((item: amb.IBudgetSubject) => new Subject(item));
            this.budgetList = this.subjects.map((subject) => {
                // 生成收入预算数据
                const budgets: BudgetItem[] = [];
                for (let i = 0; i < 12; i++) {
                    const budgetItem = new BudgetItem(i, undefined);
                    budgets.push(budgetItem);
                }
                // 每一行预算的数据
                return {
                    _id: '', // 从数据库中获取
                    subjectName: subject.name,
                    type: undefined,
                    user: rootStore.user._id,
                    ambGroup: this.group._id,
                    period: this.period && this.period!._id,
                    year: this.year,
                    budgets,
                };
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
        const subject = new Subject({ type, year: this.year, ambGroup: this.group._id }, container);
        render(<SubjectEditor subject={subject} budget={this} />, container);
    }
    @computed get dataSource() {
        // const row = { project: '大数据收入', type: <TypeSelector />, key: '1' } as any;
        const 收入汇总标题 = <SubjectTitle><span>收入</span><Icon onClick={() => this.addProject(BudgetSubjectType.收入)} type="plus" /></SubjectTitle>;
        const 收入汇总 = {
            key: '收入汇总',
            project: 收入汇总标题,
            type: '',
        } as any;
        // 添加收入 、 成本 、 费用 、 毛利
        for (let i = 1; i < 13; i++) {
            收入汇总[`budget_m${i}`] = <Input />;
            收入汇总[`budget/income_m${i}`] = 441;
            收入汇总[`real_m${i}`] = 33;
            收入汇总[`real/income_m${i}`] = 33;
            收入汇总[`real/budget_m${i}`] = 33;

            收入汇总[`budget_m${i}`] = <Input />;
            收入汇总[`budget/income_m${i}`] = 441;
            收入汇总[`real_m${i}`] = 33;
            收入汇总[`real/income_m${i}`] = 33;
            收入汇总[`real/budget_m${i}`] = 33;
        }

        // 增加收入项目
        const 收入项目s = this.budgetList.map((budgetRow, index) => {
            const 收入项目标题 = budgetRow.subjectName;
            const row = {} as any;
            budgetRow.budgets.forEach((budget, i) => {
                row[`budget_money${i}`] = <Input value={budget.money} onChange={(e) => budget.money = parseInt(e.target.value, 10)} />;
                row[`budget/income_m${i}`] = 88; // 收入占比
                row[`real_money${i}`] = 33; // 真实收入
                row[`real/income_m${i}`] = 44; // 真实收入
                row[`finishRate${i}`] = 33; // 预算完成率
            });
            return {
                key: '收入' + index,
                project: 收入项目标题,
                type: <TypeSelector onChange={console.log} />,
                ...row,
            };
        });

        const dataSource = [收入汇总].concat(收入项目s);
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
                        dataIndex: `project`,
                        key: `project`,
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
                        dataIndex: `budget_money${i}`,
                        key: `budget_money${i}`,
                    },
                    {
                        title: `占收入比`,
                        dataIndex: `budget/income_m${i}`,
                        key: `budget/income_m${i}`,
                    },
                    {
                        title: `实际`,
                        dataIndex: `real_m${i}`,
                        key: `real_m${i}`,
                    },
                    {
                        title: `占收入比`,
                        dataIndex: `real/income_m${i}`,
                        key: `real/income_m${i}`,
                    },
                    {
                        title: `预算完成率`,
                        dataIndex: `finishRate${i}`,
                        key: `finishRate${i}`,
                    },
                ],
            });
        }
        return columns;
    }
}
