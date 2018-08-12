import { Affix, Button, Input, Select, Table } from 'antd';
import Checkbox from 'components/Checkbox';
import excellentexport from 'components/excellentexport';
import { SearchBar, ToolBar } from 'components/SearchBar';
import Section, { TableSection } from 'components/Section';
import { action, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AdvancedSearch from '../components/AdvancedSearch';
import { ListState } from './ListState';

const CheckboxItem = Checkbox.CheckboxItem;
const Option = Select.Option;
const store = rootStore.budgetStore;
store.fetchAllBudgetList();

const Title = styled.span`
    font-size: 16px;
    line-height: 2;
    margin-right: 15px;
`;

@observer
export default class extends Component {
    private pageState = new ListState();
    public exportExcel = () => {
        const table = document.getElementsByTagName('table')[0];
        excellentexport.excel(table, '工作簿1', '阿米巴');
    }
    public render() {
        return (
            <div>
                <Section>
                    <span>预算状态：</span>
                    <Checkbox value={['待审核']} onChange={console.log}>
                        {['待审核', '已通过', '未通过', '未提报'].map((item) => <CheckboxItem key={item} value={item}>{item}</CheckboxItem>)}
                    </Checkbox>
                    <span style={{ paddingLeft: 50, paddingRight: 30 }}>阿米巴组:</span>
                    <Select style={{ width: 100 }}>
                        {['全部'].map((item) => <Option key={item} value={item}>{item}</Option>)}
                    </Select>
                </Section>
                <Section>
                    <SearchBar style={{ marginBottom: 0 }}>
                        <Button onClick={this.pageState.showAdvancedSearch} type="primary">自定义指标</Button>
                        <Button type="primary" onClick={this.exportExcel}>全部导出</Button>
                    </SearchBar>
                    {this.pageState.advancedSearchDisplay && <AdvancedSearch store={store} />}
                </Section>
                {store.allBudgetTables && store.allBudgetTables.map((item) => (
                    <TableSection key={item.budget.year + item.budget.group}>
                        <ToolBar>
                            <Title>待审核</Title>
                            <Link to={`/budget/edit/${item.budget.group}`}><Button>审核</Button></Link>
                            <Link to={`/budget/edit/${item.budget.group}`}><Button>填写实际</Button></Link>
                            <Link to={`/budget/edit/${item.budget.group}`}><Button>修改类型</Button></Link>
                        </ToolBar>
                        <Table pagination={false} scroll={{ x: 'auto' }} bordered size="small" dataSource={item.dataSource} columns={item.columns} />
                    </TableSection>
                ))}
            </div>
        );
    }
}
