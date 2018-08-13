import { Icon, Menu } from 'antd';
import { Component } from 'react';
import importedComponent from 'react-imported-component';
import { Link, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

const Root = styled.div`
    .profitRow.profitRow{
        background: #f3b084;
    }
`;
class Index extends Component {
    public render() {
        return (
            <Switch>
                <Route exact path="/budget/config" component={importedComponent(() => import('./config'))} />
                <Route exact path="/budget/submit" component={importedComponent(() => import('./manage/index'))} />
                <Route exact path="/budget/all" component={importedComponent(() => import('./manage/all'))} />
                <Route exact path="/budget/edit/:groupId/approval" component={importedComponent(() => import('./manage/edit'))} />
                <Route exact path="/budget/edit/:groupId/reality" component={importedComponent(() => import('./manage/edit'))} />
                <Route exact path="/budget/edit/:groupId/type" component={importedComponent(() => import('./manage/edit'))} />
                <Route exact path="/budget/edit/:groupId" component={importedComponent(() => import('./manage/edit'))} />
                <Route exact path="/budget/totalTable" component={importedComponent(() => import('./totalTable'))} />
            </Switch>
        );
    }
}

export default Index;

// 菜单
export class BudgetMenu extends Component<any, {}> {
    public render() {
        const pathname = this.props.location.pathname;
        return (
            <Menu
                mode="inline"
                theme="dark"
                defaultSelectedKeys={[pathname]}
                defaultOpenKeys={[pathname.replace(/\/[^/]+$/, '')]}
            >
                <Menu.Item key="/budget/totalTable"><Link to="/budget/totalTable"><Icon type="pie-chart" /> <span>预算总表</span></Link></Menu.Item>
                <Menu.Item key="/budget/config"><Link to="/budget/config"><Icon type="pie-chart" /> <span>预算配置</span></Link></Menu.Item>
                <Menu.Item key="/budget/submit"><Link to="/budget/submit"><Icon type="pie-chart" /> <span>预算提报</span></Link></Menu.Item>
                <Menu.Item key="/budget/all"><Link to="/budget/all"><Icon type="pie-chart" /> <span>预算审核</span></Link></Menu.Item>
            </Menu>
        );
    }
}
