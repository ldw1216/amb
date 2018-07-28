import { Icon, Menu } from "antd";
import { Component } from "react";
import { Link, Route, Switch } from "react-router-dom";
import Sector from "./sector";
import User from "./user";

class Index extends Component {
    public render() {
        return (
            <Switch>
                <Route path="/user/sector" component={Sector} />
                <Route path="/user/user" component={User} />
            </Switch>
        );
    }
}

export default Index;

// 菜单
export class UserMenu extends Component<any, {}> {
    public render() {
        const pathname = this.props.location.pathname;
        return (
            <Menu
                mode="inline"
                theme="dark"
                defaultSelectedKeys={[pathname]}
                defaultOpenKeys={[pathname.replace(/\/[^/]+$/, "")]}
            >
                <Menu.Item key="/user/sector"><Link to="/user/sector"><Icon type="pie-chart" /> <span>部门设置</span></Link></Menu.Item>
                <Menu.Item key="/user/user"><Link to="/user/user"><Icon type="pie-chart" /> <span>用户管理</span></Link></Menu.Item>
            </Menu>
        );
    }
}
