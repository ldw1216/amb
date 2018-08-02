import { Dropdown, Icon, Layout, Menu, message } from "antd";
import axios from "axios";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { Link, Route, RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";
import Budget, { BudgetMenu } from "./budget";
import store from "./store";
import Password from "./UpdatePassword";
import UserComponent, { UserMenu } from "./user";

const user = store.user;
const { Header, Content, Sider } = Layout;

const Logo = styled.div`
    float: left;
    padding-right: 100px;
    font-size: 20px;
    color: #ffffff;
`;

@observer
class MyLayout extends Component<RouteComponentProps<{}>, {}> {
    public state = {
        collapsed: false,
    };
    public componentDidMount() {
        store.user.getMe();
    }
    public render() {
        const curMainMenu = cutout(location.pathname);
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <Password />
                </Menu.Item>
                <Menu.Item key="1">
                    <a target="_blank" onClick={this.logout}>退出</a>
                </Menu.Item>
            </Menu >
        );
        return (
            <Layout style={{ minHeight: "100vh" }}>
                <Header className="header">
                    <Logo>好看阿米巴管理平台</Logo>
                    <div style={{ float: "left" }}>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={[curMainMenu]}
                            style={{ lineHeight: "64px" }}
                        >
                            <Menu.Item key="/budget"><Link to="/budget">预算</Link></Menu.Item>
                            <Menu.Item key="/user"><Link to="/user">系统配置</Link></Menu.Item>
                        </Menu>
                    </div>

                    <div style={{ float: "right", color: "white" }}>
                        <Dropdown overlay={menu}>
                            <span style={{ cursor: "pointer" }} className="ant-dropdown-link">
                                欢迎您: {user.name} ({user.account}) <Icon type="down" />
                            </span>
                        </Dropdown>
                    </div>
                </Header>
                <Layout>
                    <Sider collapsible={true} collapsed={this.state.collapsed} onCollapse={this.onCollapse} width={200}>
                        <Route path="/user" component={UserMenu} />
                        <Route path="/budget" component={BudgetMenu} />
                    </Sider>
                    <Layout style={{ padding: "3px 3px 10px" }}>
                        <Content style={{ padding: 8, margin: 0, minHeight: 280 }}>
                            <div>
                                <Route exact={true} path="/" component={Home} />
                                <Route path="/user" component={UserComponent} />
                                <Route path="/budget" component={Budget} />
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        );
    }

    private onCollapse = (collapsed: any) => {
        this.setState({ collapsed });
    }
    private logout = async (e: any) => {
        e.preventDefault();
        const data = await axios.get("/sign/logout").then((res) => (res.data));
        if (data.msg === "退出成功！") { return this.props.history.push("/login/"); }
        return message.error(<span style={{ color: "red" }}>用户退出失败</span>);
    }
}

export default withRouter(MyLayout);

function Home() {
    return (
        <div>正在加载中...</div>
    );
}

function cutout(pathname: string) {
    return "/" + pathname.split("/")[1];
}
