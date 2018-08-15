import { Button, Checkbox, Input, message, Table } from 'antd';
import { SearchBar } from 'components/SearchBar';
import Section, { TableSection } from 'components/Section';
import { ApprovalState } from 'config/config';
import { observable, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import AdvancedSearch from '../components/AdvancedSearch';
import BudgetRemark from '../components/BudgetRemark';
import Budget from '../model/Budget';
import BudgetTable from '../model/BudgetTable';
import Condition from '../model/Condition';
import { ListState } from './ListState';

@observer
export default class extends Component<RouteComponentProps<{ groupId: string }>> {
    @observable private budget?: Budget;
    @observable private budgetTable?: BudgetTable;
    @observable private condition = new Condition();
    @observable private isApproval = false;
    @observable private isReality = false;
    @observable private isBudgetType = false;
    @observable private opt: amb.ITableEditableOptiont = {};
    @observable private pageState = new ListState();
    constructor(props: any, context: any) {
        super(props, context);
        this.condition.dataTypes = ['预算占比'];
    }
    public async componentDidMount() {
        const groupId = this.props.match.params.groupId;
        this.isApproval = this.props.match.path.endsWith('approval');
        this.isReality = this.props.match.path.endsWith('reality');
        this.isBudgetType = this.props.match.path.endsWith('type');
        const isMe = rootStore.user.groups.some((item) => (item as any)._id === groupId); // 是否是本用户自己的预算

        // 如果没有预算数据则初始化预算数据
        if (rootStore.budgetStore.list.length === 0) {
            isMe ? await rootStore.budgetStore.fetchCurrentUserBudgetList(this.condition.year) :
                await rootStore.budgetStore.fetchAllBudgetList(this.condition.year);
        }

        if (this.isReality) {
            this.opt = {
                reality: true,
            };
        } else if (this.isBudgetType) {
            this.opt = {
                budgetType: true,
            };
        } else if (this.isApproval) { // 审核预算
            this.opt = {};
        } else { // 提报预算 编辑预算
            this.opt = {
                budgetType: true,
                budget: true,
                addSubject: true,
                removeSubject: true,
            };
        }
        rootStore.budgetStore.getBudget(groupId, this.condition.year).then((res) => {
            if (!res) return;
            const budgetTable = new BudgetTable(res, this.condition, this.opt);
            runInAction(() => {
                this.budget = res;
                this.budgetTable = budgetTable;
            });
        });
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
    // 修改实际
    private putReal = async () => {
        if (!this.budget) return;
        await this.budget.putReal();
        this.reset();
    }

    // 重置
    private reset = async () => {
        await rootStore.budgetStore.fetchCurrentUserBudgetList(this.condition.year);
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
                        <Button onClick={this.pageState.showAdvancedSearch} type="primary">自定义指标</Button>
                    </SearchBar>
                    {this.pageState.advancedSearchDisplay && <AdvancedSearch condition={this.condition} />}
                </Section>
                <TableSection>
                    {this.budgetTable &&
                        <Table
                            rowClassName={(record) => record.key === '毛利' ? 'profitRow' : ''}
                            pagination={false}
                            scroll={{ x: this.budgetTable.columns.length > 1 ? this.budgetTable.columns.length * this.budgetTable.columns[1].children.length * 150 + 200 : 200 }}
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
