import { Affix, Button, Checkbox, Input, Table } from 'antd';
import { SearchBar } from 'components/SearchBar';
import Section from 'components/Section';
import { action, computed, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import rootStore from '../../store';
import AdvancedSearch from './components/AdvancedSearch';
import SubjectEditor from './components/SubjectEditor';
import Budget from './model/Budget';
import BudgetTable from './model/BudgetTable';
import store from './store';

const { TextArea } = Input;

const Root = styled.div`
    &&&&&&&& table {
        thead th{
            background: #f8f8f8;
        }
        th{
            white-space: nowrap;
            padding: 10px 20px
        }
        td{
            text-align: center;
        }
    }
`;

@observer
export default class extends Component<RouteComponentProps<{ groupId: string }>> {
    @observable private budgetTable?: BudgetTable;
    @observable private 是否显示预算占比: boolean = true;
    public componentDidMount() {
        const groupId = this.props.match.params.groupId;
        store.getBudgetTable(groupId).then((res) => this.budgetTable = res);
    }
    public render() {
        return (
            <Root>
                <Section>
                    <SearchBar style={{ marginBottom: 0 }}>
                        <Checkbox checked={this.是否显示预算占比} onChange={(e) => this.是否显示预算占比 = e.target.checked} >显示预算占比</Checkbox>
                    </SearchBar>
                </Section>
                <Section>
                    {this.budgetTable && <Table pagination={false} scroll={{ x: 'auto' }} bordered size="small" dataSource={this.budgetTable.dataSource} columns={this.budgetTable.columns} />}
                </Section>
                <Section>
                    <div style={{ fontSize: 15, marginBottom: 10 }}>预算说明:</div>
                    <div>
                        <TextArea />
                    </div>
                </Section>
                <Section>
                    <SearchBar>
                        <Button onClick={console.log}>取消</Button>
                        <Button onClick={() => console.log(toJS(store.currentUserBudgetList))} type="primary">暂存草稿</Button>
                        <Button>预算提报</Button>
                    </SearchBar>
                </Section>
            </Root>
        );
    }
}
