import { Affix, Button, Checkbox, Input, Table } from 'antd';
import { SearchBar } from 'components/SearchBar';
import Section, { TableSection } from 'components/Section';
import { action, autorun, computed, observable, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import Budget from './model/Budget';
import BudgetTable from './model/BudgetTable';
import store from './store';

const { TextArea } = Input;

@observer
export default class extends Component<RouteComponentProps<{ groupId: string }>> {
    @observable private budget?: Budget;
    @observable private budgetTable?: BudgetTable;
    public componentDidMount() {
        const groupId = this.props.match.params.groupId;
        store.getBudget(groupId).then((res) => {
            if (!res) return;
            runInAction(() => {
                const budgetTable = new BudgetTable(res);
                budgetTable.allTitles = budgetTable.visibleTitles = budgetTable.allTitles
                    .filter(([key]) => !['实际收入', '预算完成率', '实际占收入比'].includes(key));
                this.budget = res;
                this.budgetTable = budgetTable;
            });
        });
    }
    private handleRemarkChange = (e: any) => {
        if (this.budget) this.budget.remark = e.target.value;
    }
    @computed get 显示收入占比() {
        if (!this.budgetTable) return false;
        return !!this.budgetTable.visibleTitles.find(([key]) => key === '预算占收入比');
    }
    @action private 处理收入占比是否显示 = () => {
        if (!this.budgetTable) return;
        if (this.显示收入占比) {
            this.budgetTable.visibleTitles = this.budgetTable.visibleTitles.filter(([key]) => key !== '预算占收入比');
        } else {
            this.budgetTable.visibleTitles = this.budgetTable.allTitles;
        }
    }

    public render() {
        return (
            <div>
                <Section>
                    <SearchBar style={{ marginBottom: 0 }}>
                        <Checkbox checked={this.显示收入占比} onChange={this.处理收入占比是否显示} >显示预算占比</Checkbox>
                    </SearchBar>
                </Section>
                <TableSection>
                    {this.budgetTable && <Table pagination={false} scroll={{ x: 'auto' }} bordered size="small" dataSource={this.budgetTable.dataSource} columns={this.budgetTable.columns} />}
                </TableSection>
                <Section>
                    <div style={{ fontSize: 15, marginBottom: 10 }}>预算说明:</div>
                    <div>
                        <TextArea
                            defaultValue={this.budget && this.budget.remark}
                            autosize={{ minRows: 3, maxRows: 9 }}
                            onBlur={this.handleRemarkChange}
                        />
                    </div>
                </Section>
                <Section>
                    <SearchBar>
                        <Button onClick={console.log}>取消</Button>
                        <Button onClick={() => console.log(toJS(store.currentUserBudgetList))} type="primary">暂存草稿</Button>
                        <Button>预算提报</Button>
                    </SearchBar>
                </Section>
            </div>
        );
    }
}
