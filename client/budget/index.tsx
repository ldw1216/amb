import { Icon, Menu } from "antd";
import { Component } from "react";
import { Link, Route, Switch } from "react-router-dom";
import Config from "./config";
import Manage from "./manage";
class Index extends Component {
    public render() {
        return (
            <Switch>
                <Route path="/budget/config" component={Config} />
                <Route path="/budget/manage" component={Manage} />
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
                defaultOpenKeys={[pathname.replace(/\/[^/]+$/, "")]}
            >
                <Menu.Item key="/budget/config"><Link to="/budget/config"><Icon type="pie-chart" /> <span>预算配置</span></Link></Menu.Item>
                <Menu.Item key="/budget/manage"><Link to="/budget/manage"><Icon type="pie-chart" /> <span>预算管理</span></Link></Menu.Item>
            </Menu>
        );
    }
}
