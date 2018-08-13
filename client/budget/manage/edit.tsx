import { Affix, Button, Checkbox, Input, message, Table } from 'antd';
import { SearchBar } from 'components/SearchBar';
import Section, { TableSection } from 'components/Section';
import { ApprovalState } from 'config/config';
import { action, autorun, computed, observable, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import BudgetRemark from '../components/BudgetRemark';
import Budget from '../model/Budget';
import BudgetTable from '../model/BudgetTable';
import Condition from '../model/Condition';

@observer
export default class extends Component<RouteComponentProps<{ groupId: string }>> {
    @observable private budget?: Budget;
    @observable private budgetTable?: BudgetTable;
    @observable private condition = new Condition();
    @observable private isApproval = false;
    @observable private isReality = false;
    @observable private isBudgetType = false;
    @observable private opt: amb.ITableEditableOptiont = {};
    public componentDidMount() {
        const groupId = this.props.match.params.groupId;
        this.isApproval = this.props.match.path.endsWith('approval');
        this.isReality = this.props.match.path.endsWith('reality');
        this.isBudgetType = this.props.match.path.endsWith('type');
        //  = {
        //     budgetType: this.isApproval,
        //     budget: this.isApproval,
        //     addSubject: this.isApproval,
        //     removeSubject: this.isApproval,
        //     reality: this.isReality,
        // };
        if (this.isReality) {
            this.opt = {
                reality: true,
            };
        } else if (this.isBudgetType) {
            this.opt = {
                budgetType: true,
            };
        } else if (this.isApproval) {
            this.opt = {};
        } else {
            this.opt = {
                budgetType: true,
                budget: true,
                addSubject: true,
                removeSubject: true,
            };
        }
        rootStore.budgetStore.getCurrentUserBudget(groupId).then((res) => {
            if (!res) return;
            const budgetTable = new BudgetTable(res, this.condition, this.opt);
            runInAction(() => {
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
            // this.budgetTable.visibleTitles = this.budgetTable.visibleTitles.filter(([key]) => key !== '预算占收入比');
        } else {
            // this.budgetTable.visibleTitles = this.budgetTable.allTitles;
        }
    }
    private save = async (approvalState: ApprovalState) => {
        if (!this.budget) return;
        this.budget.approvalState = approvalState;
        await this.budget.save();
        this.reset();
    }
    // 审核
    private approval = async (approvalState: ApprovalState) => {
        if (!this.budget) return;
        await this.budget.put(approvalState);
        this.reset();
        message.info(approvalState === ApprovalState.审核拒绝 ? '审核拒绝' : '审核通过');
    }
    // 审核
    private putReal = async () => {
        if (!this.budget) return;
        await this.budget.putReal();
        this.reset();
    }
    private reset = async () => {
        await rootStore.budgetStore.fetchCurrentUserBudgetList();
        history.back();
        // this.componentDidMount();
    }
    public render() {
        if (!this.budget || !this.budget.fullGroup) return null;
        let buttons = (
            <React.Fragment>
                <Button onClick={() => this.save(ApprovalState.草稿)} type="primary">暂存草稿</Button>
                <Button onClick={() => this.save(ApprovalState.已提报未审核)}>预算提报</Button>
            </React.Fragment>
        );
        if (this.isApproval) {
            buttons = (
                <React.Fragment >
                    <Button onClick={() => this.approval(ApprovalState.审核拒绝)} type="danger" >拒绝</Button>
                    <Button onClick={() => this.approval(ApprovalState.已通过审核)} type="primary">通过</Button>
                </React.Fragment >
            );
        } else if (this.isBudgetType || this.isReality) {
            buttons = (
                <Button onClick={() => this.putReal()} type="primary" >保存</Button>
            );
        }

        return (
            <div>
                <Section>
                    <SearchBar style={{ marginBottom: 0 }}>
                        <Checkbox checked={this.condition.budgetRatioVisible} onChange={(e) => this.condition.budgetRatioVisible = e.target.checked} >显示预算占比</Checkbox>
                    </SearchBar>
                </Section>
                <TableSection>
                    {this.budgetTable &&
                        <Table
                            rowClassName={(record) => record.key === '毛利' ? 'profitRow' : ''}
                            pagination={false}
                            scroll={{ x: 'auto' }}
                            bordered size="small"
                            dataSource={this.budgetTable.dataSource}
                            columns={this.budgetTable.columns} />
                    }
                </TableSection>
                <BudgetRemark budget={this.budget} />
                <Section>
                    <SearchBar>
                        <Button onClick={this.reset}>取消</Button>
                        {buttons}
                    </SearchBar>
                </Section>
            </div>
        );
    }
}
