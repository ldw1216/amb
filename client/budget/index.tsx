import { Icon, Menu } from 'antd';
import { Component } from 'react';
import importedComponent from 'react-imported-component';
import { Link, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

const Root = styled.div`
    .profitRow.profitRow{
        background: #f3b084;
        &:hover, &tr:hover, &.ant-table-row-hover{
            background: #f3b084;
        }
        &:hover, &:hover td, &tr:hover, &.ant-table-row-hover,&.ant-table-row-hover td{
            background: #f48074;
        }
    }
    tr.ant-table-row-hover.profitRow.profitRow:hover td{
        background: #f48074;
    }
`;
class Index extends Component {
    public render() {
        return (
            <Root>
                <Switch>
                    {rootStore.user.role === 'admin' ? <Route exact path="/budget/config" component={importedComponent(() => import('./config'))} /> : ''}
                    <Route exact path="/budget/submit" component={importedComponent(() => import('./manage/index'))} />
                    {rootStore.user.role === 'admin' ? <Route exact path="/budget/all" component={importedComponent(() => import('./manage/all'))} /> : ''}
                    <Route exact path="/budget/edit/:groupId/approval" component={importedComponent(() => import('./manage/edit'))} />
                    <Route exact path="/budget/edit/:groupId/reality" component={importedComponent(() => import('./manage/edit'))} />
                    <Route exact path="/budget/edit/:groupId/type" component={importedComponent(() => import('./manage/edit'))} />
                    <Route exact path="/budget/edit/:groupId" component={importedComponent(() => import('./manage/edit'))} />
                    {rootStore.user.role === 'admin' ? <Route exact path="/budget/totalTable" component={importedComponent(() => import('./totalTable'))} /> : ''}
                </Switch>
            </Root>
        );
    }
}

export default Index;

// 菜单
export class BudgetMenu extends Component<any, {}> {
    public render() {
        const showTotalTable = rootStore.user.role === 'admin';
        const pathname = this.props.location.pathname;
        return (
            <Menu
                mode="inline"
                theme="dark"
                defaultSelectedKeys={[pathname]}
                defaultOpenKeys={[pathname.replace(/\/[^/]+$/, '')]}
            >
                {showTotalTable ? <Menu.Item key="/budget/totalTable"><Link to="/budget/totalTable"><Icon type="pie-chart" /> <span>预算总表</span></Link></Menu.Item> : ''}
                {showTotalTable ? <Menu.Item key="/budget/config"><Link to="/budget/config"><Icon type="pie-chart" /> <span>预算配置</span></Link></Menu.Item> : ''}
                <Menu.Item key="/budget/submit"><Link to="/budget/submit"><Icon type="pie-chart" /> <span>预算管理</span></Link></Menu.Item>
                {showTotalTable ? <Menu.Item key="/budget/all"><Link to="/budget/all"><Icon type="pie-chart" /> <span>预算审核</span></Link></Menu.Item> : ''}
            </Menu>
        );
    }
}
