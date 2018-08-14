import { Affix, Button, Input, Table } from 'antd';
import axios from 'axios';
import { SearchBar, ToolBar } from 'components/SearchBar';
import Section, { TableSection } from 'components/Section';
import { action, computed, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import excellentexport from '../../components/excellentexport';
import AdvancedSearch from '../components/AdvancedSearch';
import Condition from '../model/Condition';

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
    public condition = new Condition();
    public state = {
        list: [] as any,
    };
    @computed get columns() {
        if (!this.condition) return [];
        const columns = [
            {
                title: this.condition.year,
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
        const data = [{ key: 'ys', value: '预算' }, { key: 'yszb', value: '占收入比例' }, { key: 'sj', value: '实际' }, { key: 'sjzb', value: '占收入比例' }, { key: 'yswcl', value: '预算完成率' }];
        const data1 = [{ key: 'jd_ys', value: '预算' }, { key: 'jd_yszb', value: '预算占比' }, { key: 'jd_sj', value: '实际' }, { key: 'jd_srzb', value: '收入占比' }, { key: 'jd_yswcl', value: '预算完成率' }];
        const list = ['0', '1', '2', '一季度', '3', '4', '5', '二季度', '半年', '6', '7', '8', '三季度', '9', '10', '11', '四季度', '全年'];
        const list1 = ['一季度', '二季度', '三季度', '四季度', '半年', '全年'];
        for (const i of list) {
            let children;
            if (list1.includes(i)) {
                const jdi = list1.findIndex((item) => item === i);
                children = data1.map((key) => ({
                    id: key.key,
                    title: key.value,
                    dataIndex: `${key.key}_${jdi}`,
                    key: `${key.key}_${jdi}`,
                }));
            } else {
                children = data.map((key) => ({
                    id: key.key,
                    title: key.value,
                    dataIndex: `${key.key}_${i}`,
                    key: `${key.key}_${i}`,
                }));
            }
            columns.push({
                title: !list1.includes(i) ? `${+i + 1}月` : i,
                dataIndex: `month${i}`,
                key: `month${i}`,
                children,
            });
        }
        return columns;
    }
    public async componentDidMount() {
        this.fetch();
    }
    public fetch = async (year?: number) => {
        year = year || 2018;
        const list = await axios.get('/budget/totalTable?year=' + year).then((data) => data.data);
        this.setState({ list });
    }
    public exportExcel = () => {
        const table = document.getElementsByTagName('table')[0];
        excellentexport.excel(table, '工作簿1', '阿米巴总表');
    }

    public render() {
        console.log(toJS(this.condition));
        return (
            <div>
                <Section>
                    <SearchBar style={{ marginBottom: 0 }}>
                        <Button onClick={this.showAdvancedSearch} type="primary">自定义指标</Button>
                        <Button type="primary" onClick={this.exportExcel}>全部导出</Button>
                        {this.advancedSearchDisplay && <AdvancedSearch condition={this.condition} />}
                    </SearchBar>
                </Section>

                <TableSection>
                    <Table pagination={false} scroll={{ x: 7350 }} rowKey="total" bordered size="small" dataSource={this.state.list} columns={this.columns} />
                </TableSection>
            </div>
        );
    }
}
