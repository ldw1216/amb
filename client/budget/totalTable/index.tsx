import { Affix, Button, Input, Table } from 'antd';
import axios from 'axios';
import { SearchBar, ToolBar } from 'components/SearchBar';
import Section, { TableSection } from 'components/Section';
import { action, computed, IReactionDisposer, observable, reaction, toJS } from 'mobx';
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
    public reaction?: IReactionDisposer;
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
        const list = ['一季度', '二季度', '三季度', '四季度', '半年报', '全年报', '上一年'];

        console.log(toJS(this.condition));

        // 过滤显示季度
        const visibleList = [];
        const range = this.condition.range as string[];

        if (range.includes('一季度')) visibleList.push('0', '1', '2', '一季度');
        if (range.includes('二季度')) visibleList.push('3', '4', '5', '二季度');
        if (range.includes('半年报')) visibleList.push('半年报');
        if (range.includes('三季度')) visibleList.push('6', '7', '8', '三季度');
        if (range.includes('四季度')) visibleList.push('9', '10', '11', '四季度');
        if (range.includes('全年报')) visibleList.push('全年报');
        if (range.includes('上一年')) visibleList.push('上一年');

        // 过滤显示表头
        const dataTypes = this.condition.dataTypes as string[];
        const data = [{ key: 'ys', value: '预算' }];
        if (dataTypes.includes('预算占比')) data.push({ key: 'yszb', value: '占收入比例' });
        if (dataTypes.includes('实际完成')) data.push({ key: 'sj', value: '实际' });
        if (dataTypes.includes('实际占比')) data.push({ key: 'sjzb', value: '占收入比例' });
        if (dataTypes.includes('预算完成率')) data.push({ key: 'yswcl', value: '预算完成率' });

        for (const i of visibleList) {
            let children;
            if (list.includes(i)) {
                const jdi = list.findIndex((item) => item === i);
                children = data.map((key) => ({
                    id: key.key,
                    title: key.value,
                    dataIndex: `jd_${key.key}_${jdi}`,
                    key: `jd_${key.key}_${jdi}`,
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
                title: !list.includes(i) ? `${+i + 1}月` : i,
                dataIndex: `month${i}`,
                key: `month${i}`,
                children,
            });
        }
        return columns;
    }
    public async componentDidMount() {
        this.fetch();
        this.reaction = reaction(() => this.condition.year, (year) => {
            this.fetch(year);
        });
    }
    public componentWillUnmount() {
        this.reaction && this.reaction();
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
                    <Table pagination={false} scroll={{ x: 1960 }} rowKey="total" bordered size="small" dataSource={this.state.list} columns={this.columns} />
                </TableSection>
            </div>
        );
    }
}
