import { Affix, Button, Input, Table } from 'antd';
import { SearchBar, ToolBar } from 'components/SearchBar';
import Section, { TableSection } from 'components/Section';
import { action, observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import rootStore from '../../store';
import AdvancedSearch from '../manage/components/AdvancedSearch';
import excellentexport from '../../components/excellentexport';
import store from '../manage/store';
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
    exportExcel = () => {
        const table = document.getElementsByTagName('table')[0]
        excellentexport.excel(table, '工作簿1', '阿米巴')
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
            </div>
        );
    }
}
