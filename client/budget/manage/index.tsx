import { Affix, Button, Input, Table } from 'antd';
import { SearchBar, ToolBar } from 'components/SearchBar';
import Section from 'components/Section';
import { action, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import rootStore from '../../store';
import AdvancedSearch from './components/AdvancedSearch';
import SubjectEditor from './components/SubjectEditor';
import store from './store';
store.fetchCurrentUserBudgetList();

const { TextArea } = Input;

const Title = styled.span`
    font-size: 16px;
    line-height: 2;
    margin-right: 15px;
`;

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
    public render() {
        return (
            <Root>
                <Section>
                    <SearchBar style={{ marginBottom: 0 }}>
                        <Button onClick={this.showAdvancedSearch} type="primary">自定义指标</Button>
                        <Button type="primary">全部导出</Button>
                    </SearchBar>
                    {this.advancedSearchDisplay && <AdvancedSearch store={store} />}
                </Section>
                {store.currentUserBudgetTables.map((item) => (
                    <Section key={item.budget.year + item.budget.group}>
                        <ToolBar>
                            <Title>待审核</Title>
                            <Link to={`/budget/edit/${item.budget.group}`}><Button>修改预算</Button></Link>
                        </ToolBar>
                        <Table pagination={false} scroll={{ x: 'auto' }} bordered size="small" dataSource={item.dataSource} columns={item.columns} />
                    </Section>
                ))}
                <Section>
                    <div><Title>预算说明:</Title></div>
                    <div>
                        <TextArea />
                    </div>
                </Section>
                <Section>
                    <SearchBar>
                        <Button>取消</Button>
                        <Button onClick={() => console.log(toJS(store.currentUserBudgetList))} type="primary">暂存草稿</Button>
                        <Button>预算提报</Button>
                    </SearchBar>
                </Section>
                <Section>
                    <SearchBar>
                        <span style={{ marginRight: 28 }}>待审核</span><Button type="primary">修改预算</Button>
                    </SearchBar>
                </Section>
            </Root>
        );
    }
}
