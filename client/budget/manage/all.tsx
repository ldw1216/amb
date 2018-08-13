import { Affix, Button, Input, Select, Table } from 'antd';
import Checkbox from 'components/Checkbox';
import excellentexport from 'components/excellentexport';
import { SearchBar, ToolBar } from 'components/SearchBar';
import Section, { TableSection } from 'components/Section';
import { ApprovalState } from 'config/config';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { computed, observable } from '../../../node_modules/mobx';
import AdvancedSearch from '../components/AdvancedSearch';
import ApprovalTtitle from '../components/ApprovalTtitle';
import { ListState } from './ListState';

const CheckboxItem = Checkbox.CheckboxItem;
const Option = Select.Option;
const stateMap = {
    待审核: ApprovalState.已提报未审核,
    已通过: ApprovalState.已通过审核,
    未通过: ApprovalState.审核拒绝,
    未提报: ApprovalState.草稿,
} as any;
@observer
export default class extends Component {
    private pageState = new ListState();
    private exportExcel = () => {
        const table = document.getElementsByTagName('table')[0];
        excellentexport.excel(table, '工作簿1', '阿米巴');
    }
    public componentDidMount() {
        this.pageState.fetchAllBudgetTables({});
    }
    public render() {
        const { budgetTables, condition } = this.pageState;
        const budgetTables2 = budgetTables.filter((b) => {
            if (condition.approvalState.length && !condition.approvalState.includes(b.approvalState)) {
                return false;
            }
            if (condition.groupId !== '0' && condition.groupId !== b.budget.group) {
                return false;
            }
            return true;
        });
        return (
            <div>
                <Section>
                    <span>预算状态：</span>
                    <Checkbox value={condition.approvalState} onChange={(val: any) => condition.approvalState = val}>
                        {Object.keys(stateMap).map((item) => <CheckboxItem key={item} value={stateMap[item]}>{item}</CheckboxItem>)}
                    </Checkbox>
                    <span style={{ paddingLeft: 50, paddingRight: 30 }}>阿米巴组:</span>
                    <Select value={condition.groupId} onChange={(value: any) => condition.groupId = value} style={{ width: 100 }}>
                        <Option value="0">全部</Option>
                        {rootStore.groupStore.list.map((item) => <Option key={item._id} value={item._id}>{item.name}</Option>)}
                    </Select>
                </Section>
                <Section>
                    <SearchBar style={{ marginBottom: 0 }}>
                        <Button onClick={this.pageState.showAdvancedSearch} type="primary">自定义指标</Button>
                        <Button type="primary" onClick={this.exportExcel}>全部导出</Button>
                    </SearchBar>
                    {this.pageState.advancedSearchDisplay && <AdvancedSearch condition={condition} />}
                </Section>
                {budgetTables2.map((item) => (
                    <TableSection key={item.budget.year + item.budget.group}>
                        <ToolBar>
                            <ApprovalTtitle>{ApprovalState[item.approvalState]}</ApprovalTtitle>
                            {item.approvalState === ApprovalState.已提报未审核 ?
                                <Link to={`/budget/edit/${item.budget.group}/approval`}>
                                    <Button>审核预算</Button>
                                </Link> : ''
                            }
                            {item.approvalState === ApprovalState.已通过审核 ?
                                <React.Fragment>
                                    <Link style={{ marginLeft: '10px' }} to={`/budget/edit/${item.budget.group}/reality`}>
                                        <Button>填写实际</Button>
                                    </Link>
                                    <Link to={`/budget/edit/${item.budget.group}/type`}>
                                        <Button>修改类型</Button>
                                    </Link>
                                </React.Fragment> : ''
                            }
                        </ToolBar>
                        <Table className={item.budget.groupIsAvailable ? '' : 'disabled'} pagination={false} scroll={{ x: 'auto' }} bordered size="small" dataSource={item.dataSource} columns={item.columns} />
                    </TableSection>
                ))}
            </div>
        );
    }
}
