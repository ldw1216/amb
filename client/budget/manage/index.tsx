import { Affix, Button, Input, Table } from 'antd';
import excellentexport from 'components/excellentexport';
import { SearchBar, ToolBar } from 'components/SearchBar';
import Section, { TableSection } from 'components/Section';
import { ApprovalState } from 'config/config';
import { action, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AdvancedSearch from '../components/AdvancedSearch';
import ApprovalTtitle from '../components/ApprovalTtitle';
import { BudgetList } from '../model/BudgetList';
import BudgetTable from '../model/BudgetTable';
import { ListState } from './ListState';

@observer
export default class extends Component {
    private pageState = new ListState();
    @observable private budgetTables: BudgetTable[] = [];
    @observable private budgetList: BudgetList[] = [];
    private exportExcel = () => {
        const table = document.getElementsByTagName('table')[0];
        excellentexport.excel(table, '工作簿1', '阿米巴');
    }
    public componentDidMount() {
        rootStore.budgetStore.fetchCurrentUserBudgetList()
            .then((list) => list.map((item) => new BudgetTable(item, false)))
            .then((list) => this.budgetTables = list);
    }

    public render() {
        return (
            <div>
                <Section>
                    <SearchBar style={{ marginBottom: 0 }}>
                        <Button onClick={this.pageState.showAdvancedSearch} type="primary">自定义指标</Button>
                        <Button type="primary" onClick={this.exportExcel}>全部导出</Button>
                    </SearchBar>
                    {this.pageState.advancedSearchDisplay && <AdvancedSearch store={rootStore.budgetStore} />}
                </Section>
                {this.budgetTables.map((item) => (
                    <TableSection key={item.budget.year + item.budget.group}>
                        <ToolBar>
                            <ApprovalTtitle>{ApprovalState[item.approvalState]}</ApprovalTtitle>
                            {(item.approvalState === ApprovalState.没有提报周期 || item.approvalState === ApprovalState.已通过审核) ? '' :
                                <Link to={`/budget/edit/${item.budget.group}`}>
                                    <Button>修改预算</Button>
                                </Link>
                            }
                        </ToolBar>
                        <Table pagination={false} scroll={{ x: 'auto' }} bordered size="small" dataSource={item.dataSource} columns={item.columns} />
                    </TableSection>
                ))}
            </div>
        );
    }
}
