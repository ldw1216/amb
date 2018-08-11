import { Affix, Button, Input, Table } from 'antd';
import { SearchBar, ToolBar } from 'components/SearchBar';
import Section, { TableSection } from 'components/Section';
import { action, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import rootStore from 'store/index';
import styled from 'styled-components';
import excellentexport from '../../components/excellentexport';
import AdvancedSearch from '../components/AdvancedSearch';

const store = rootStore.budgetStore;
store.fetchCurrentUserBudgetList();

const { TextArea } = Input;

const Title = styled.span`
    font-size: 16px;
    line-height: 2;
    margin-right: 15px;
`;

@observer
export default class extends Component {
    @observable private advancedSearchDisplay = false;
    @action.bound private showAdvancedSearch() {
        this.advancedSearchDisplay = true;
        document.addEventListener('click', this.hideAdvancedSearch);
    }
    @action.bound private hideAdvancedSearch() {
        this.advancedSearchDisplay = false;
        document.removeEventListener('click', this.hideAdvancedSearch);
    }
    public state = {
        columns: [] as any,
    };
    public componentDidMount() {
        const columns = [
            {
                title: 2018,
                width: 100,
                dataIndex: 'head',
                key: 'head',
                fixed: 'left',
                children: [
                    {
                        title: '总表',
                        dataIndex: `total`,
                        key: `total`,
                    },
                ],
            } as any,
        ];
        for (let i = 0; i < 12; i++) {
            const children = [{ key: 1, value: '预算' }, { key: 3, value: '占收入比例' }, { key: 5, value: '实际' }, { key: 7, value: '占收入比例' }, { key: 9, value: '预算完成率' }].map((key) => ({
                id: key.key,
                title: key.value,
                dataIndex: `${key.key}_${i}月`,
                key: `${key.key}_${i}月`,
            }));
            columns.push({
                title: `${i + 1}月`,
                dataIndex: `month${i}`,
                key: `month${i}`,
                children,
            });
        }
        this.setState({ columns });
    }
    public exportExcel = () => {
        const table = document.getElementsByTagName('table')[0];
        excellentexport.excel(table, '工作簿1', '阿米巴');
    }

    public render() {
        return (
            <div>
                <Section>
                    <SearchBar style={{ marginBottom: 0 }}>
                        <Button onClick={this.showAdvancedSearch} type="primary">自定义指标</Button>
                        <Button type="primary" onClick={this.exportExcel}>全部导出</Button>
                        {this.advancedSearchDisplay && <AdvancedSearch store={store} />}
                    </SearchBar>
                </Section>

                <TableSection>
                    <Table pagination={false} scroll={{ x: 'auto' }} rowKey="total" bordered size="small" dataSource={[{ total: '收入-阿米巴' }, { total: '成本费用-阿米巴' }, { total: '利润-阿米巴' }, { total: '收入-财务' }, { total: '成本费用-财务' }, { total: '利润-财务' }]} columns={this.state.columns} />
                </TableSection>
            </div>
        );
    }
}
