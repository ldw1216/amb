import { Affix, Button, Input, Table } from 'antd';
import excellentexport from 'components/excellentexport';
import { SearchBar, ToolBar } from 'components/SearchBar';
import Section, { TableSection } from 'components/Section';
import { ApprovalState } from 'config/config';
import { reaction, toJS } from 'mobx';
import { observer } from 'mobx-react';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AdvancedSearch from '../components/AdvancedSearch';
import ApprovalTtitle from '../components/ApprovalTtitle';
import { ListState } from './ListState';

@observer
export default class extends Component {
    private pageState = new ListState();
    private reaction = reaction(() => this.pageState.condition.year, (year) => {
        this.pageState.fetchCurrentUserBudgetTables({});
    });
    private exportExcel = () => {
        const table = document.getElementsByTagName('table')[0];
        excellentexport.excel(table, '工作簿1', rootStore.user.name + '-阿米巴');
    }
    public componentDidMount() {
        this.pageState.fetchCurrentUserBudgetTables({});
    }

    public componentWillUnmount() {
        this.reaction();
    }
    public render() {
        const { budgetTables, condition } = this.pageState;
        // console.log(toJS(rootStore))
        return (
            <div>
                <Section>
                    <SearchBar style={{ marginBottom: 0 }}>
                        <Button onClick={this.pageState.showAdvancedSearch} type="primary">自定义指标</Button>
                        <Button type="primary" onClick={this.exportExcel}>全部导出</Button>
                    </SearchBar>
                    {this.pageState.advancedSearchDisplay && <AdvancedSearch condition={condition} />}
                </Section>
                {budgetTables.map((item) => (
                    <TableSection key={item.budget.year + item.budget.group}>
                        <ToolBar>
                            <ApprovalTtitle>{ApprovalState[item.approvalState]}</ApprovalTtitle>
                            {(item.approvalState >= ApprovalState.已通过审核) ? '' :
                                <Link to={`/budget/edit/${item.budget.group}`}>
                                    <Button>修改预算</Button>
                                </Link>
                            }
                        </ToolBar>
                        <Table
                            rowClassName={(record: any) => record.key === '毛利' ? 'profitRow' : ''}
                            className={item.approvalState > ApprovalState.已通过审核 ? 'disabled' : ''}
                            pagination={false} scroll={{ x: item.columns.length > 1 ? item.columns.length * item.columns[1].children.length * 150 + 200 : 200 }}
                            bordered={true}
                            size="small"
                            dataSource={item.columns.length > 1 ? item.dataSource : []}
                            columns={item.columns}
                        />
                    </TableSection>
                ))}
            </div>
        );
    }
}
