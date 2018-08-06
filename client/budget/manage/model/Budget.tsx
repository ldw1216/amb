import { Icon, Input } from 'antd';
import axios from 'axios';
import createValidator from 'components/createValidator';
import { BudgetSubjectType, BudgetType, SearchDataType, SearchRange } from 'config/config';
import { action, computed, observable } from 'mobx';
import { render } from 'react-dom';
import SubjectEditor from '../components/SubjectEditor';
import SubjectTitle from '../components/SubjectTitle';
import TypeSelector from '../components/TypeSelector';
import Subject from './Subject';

// 预算金额 某个项目，某个月份的预算
class BudgetItem {
    public month?: number;
    public projectType?: BudgetSubjectType;
    public projectSubType?: string;
    public type?: BudgetType;
    public money?: number;
}

// 预算行（某个项目的预算，比如人工成本预算）
export class SubjectBudget {
    @observable public user?: string;
    @observable public ambGroup?: string;
    @observable public period?: string;
    @observable public year?: number;
    @observable public budgets?: BudgetItem;
}

// 从哪里知道 预算周期 , 通过数据库查询当前用户属于几个group，查询完成后初始化BudgetPeriodList

// 预算数据
export default class Budget {
    @observable public year: number; // 预算周期
    @observable public group: amb.IGroup; // 预算周期
    @observable public BudgetList: SubjectBudget[] = []; // 预算数据
    @observable public subjects: Subject[] = [];

    constructor(year: number, group: amb.IGroup, list?: amb.IBudget[]) {
        this.year = year;
        this.group = group;
        this.fetchSubjects();
    }
    // 从数据库初始化数据 - 通过接口从数据库拉取数据
    @action.bound public async importByMongo() {
        const data: amb.IBudget = await axios.get('/').then((res) => res.data);
        return data;
        // 通过接口从数据库拉取数据
    }

    @action.bound public fetchSubjects() {
        // 从数据库拉取项目
        axios.get(`/subject`, { params: { year: this.year, ambGroup: this.group._id || this.group } }).then((res) => {
            this.subjects = res.data.map((item: amb.IBudgetSubject) => new Subject(item));
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
            key: 0,
            project: 收入汇总标题,
            type: '3',
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
        const 收入项目s = this.subjects.map((item, index) => {
            const 收入项目标题 = item.name;
            const row = {} as any;
            for (let i = 1; i < 13; i++) {
                row[`budget_m${i}`] = <Input />;
                row[`budget/income_m${i}`] = 441;
                row[`real_m${i}`] = 33;
                row[`real/income_m${i}`] = 33;
                row[`real/budget_m${i}`] = 33;

                row[`budget_m${i}`] = <Input />;
                row[`budget/income_m${i}`] = 441;
                row[`real_m${i}`] = 33;
                row[`real/income_m${i}`] = 33;
                row[`real/budget_m${i}`] = 33;
            }
            return {
                key: '收入' + index,
                project: 收入项目标题,
                type: 4,
                ...row,
            };
        });
        console.log(收入项目s);
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
        for (let i = 1; i < 13; i++) {
            columns.push({
                title: `${i}月`,
                dataIndex: `month${i}`,
                key: `month${i}`,
                children: [
                    {
                        title: `预算`,
                        dataIndex: `budget_m${i}`,
                        key: `budget_m${i}`,
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
                        dataIndex: `real/budget_m${i}`,
                        key: `real/budget_m${i}`,
                    },
                ],
            });
        }
        return columns;
    }
}
