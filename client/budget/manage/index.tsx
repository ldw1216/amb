import { Affix, Button, Input, Table } from 'antd';
import { SearchBar } from 'components/SearchBar';
import Section from 'components/Section';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import styled from 'styled-components';
import rootStore from '../../store';
import AdvancedSearch from './components/AdvancedSearch';
import SubjectEditor from './components/SubjectEditor';
import store from './store';
store.fetchCurrentUserBudgetList();

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
        console.log(rootStore);
        return (
            <Root>
                <Section>
                    <SearchBar style={{ marginBottom: 0 }}>
                        <Button onClick={this.showAdvancedSearch} type="primary">自定义指标</Button>
                        <Button type="primary">全部导出</Button>
                    </SearchBar>
                    {this.advancedSearchDisplay && <AdvancedSearch store={store} />}
                </Section>
                {store.currentUserBudgetList.map((item) => (
                    <Section key={item.year + item.group._id}>
                        <Table pagination={false} scroll={{ x: 'auto' }} bordered size="small" dataSource={item.dataSource} columns={item.columns} />
                    </Section>
                ))}

                <Section>
                    <SearchBar>
                        <span style={{ marginRight: 28 }}>待审核</span><Button type="primary">修改预算</Button>
                    </SearchBar>
                </Section>
            </Root>
        );
    }
}
