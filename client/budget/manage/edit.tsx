import { Affix, Button, Checkbox, Input, Table } from 'antd';
import { SearchBar } from 'components/SearchBar';
import Section, { TableSection } from 'components/Section';
import { ApprovalState } from 'config/config';
import { action, autorun, computed, observable, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import rootStore from 'store/index';
import BudgetRemark from '../components/BudgetRemark';
import Budget from '../model/Budget';
import BudgetTable from '../model/BudgetTable';

const store = rootStore.budgetStore;

@observer
export default class extends Component<RouteComponentProps<{ groupId: string }>> {
    @observable private budget?: Budget;
    @observable private budgetTable?: BudgetTable;
    public componentDidMount() {
        console.log('aaas');
        const groupId = this.props.match.params.groupId;
        store.getBudget(groupId).then((res) => {
            if (!res) return;
            runInAction(() => {
                const budgetTable = new BudgetTable(res, store.periods.find(({ _id }) => _id === res.period), true);
                budgetTable.allTitles = budgetTable.visibleTitles = budgetTable.allTitles
                    .filter(([key]) => !['实际收入', '预算完成率', '实际占收入比'].includes(key));
                this.budget = res;
                this.budgetTable = budgetTable;
            });
        });
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
    private save = async (approvalState: ApprovalState) => {
        if (!this.budget) return;
        this.budget.approvalState = approvalState;
        await this.budget.save();
        this.reset();
    }

    private reset = async () => {
        await store.fetchCurrentUserBudgetList();
        this.componentDidMount();
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
                <BudgetRemark budget={this.budget} />
                <Section>
                    <SearchBar>
                        <Button onClick={this.reset}>取消</Button>
                        <Button onClick={() => this.save(ApprovalState.草稿)} type="primary">暂存草稿</Button>
                        <Button onClick={() => this.save(ApprovalState.已提报未审核)}>预算提报</Button>
                    </SearchBar>
                </Section>
            </div>
        );
    }
}
