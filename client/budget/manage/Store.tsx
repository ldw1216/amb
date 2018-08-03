import { Icon, Input, Select } from 'antd';
import createValidator from 'components/createValidator';
import { SearchDataType, SearchRange } from 'config/config';
import { BudgetProjectType, BudgetType } from 'config/config';
import { action, observable } from 'mobx';
import React from 'react';
import ProjectTitle from './components/ProjectTitle';
import TypeSelector from './components/TypeSelector';

const row = { project: '大数据收入', type: <TypeSelector />, key: '1' } as any;
const row1 = { project: <ProjectTitle><span key="1">收入</span><Icon key="2" onClick={() => subjectStore.showProjectEditor({ subjectType: BudgetProjectType.收入 })} type="plus" /></ProjectTitle>, type: '', key: 0 } as any;
const dataSource = [row1, row];

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
    row[`budget_m${i}`] = <Input />;
    row[`budget/income_m${i}`] = 441;
    row[`real_m${i}`] = 33;
    row[`real/income_m${i}`] = 33;
    row[`real/budget_m${i}`] = 33;

    row1[`budget_m${i}`] = <Input />;
    row1[`budget/income_m${i}`] = 441;
    row1[`real_m${i}`] = 33;
    row1[`real/income_m${i}`] = 33;
    row1[`real/budget_m${i}`] = 33;
}

class Store {
    public validator = createValidator();
    @observable public dataSource = dataSource;
    @observable public columns = columns;
    @observable public condition = {
        year: new Date().getFullYear(),
        range: [SearchRange.二季度, SearchRange.三季度],
        dataTypes: Object.keys(SearchDataType),
    };
}

class SubjectStore {
    @observable public displayEditor = true; // 显示编辑项目
    @observable public visibleProject: amb.IBudgetSubject = { subjectType: BudgetProjectType.收入 };
    @action.bound public showProjectEditor(data: amb.IBudgetSubject) {
        this.displayEditor = true;
        this.visibleProject = data;
    }
    @action.bound public hideProjectEditor() {
        this.displayEditor = false;
        this.visibleProject = {};
    }
    @action.bound public save(data: amb.IBudgetSubject) {
        console.log('保存');
    }
}

const subjectStore = new SubjectStore();

export {
    subjectStore,
    Store,
    Store as default,
};
