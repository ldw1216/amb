import { Dropdown, Icon, Layout, Menu, message } from 'antd';
import axios from 'axios';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import importedComponent from 'react-imported-component';
import { Link, NavLink, Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import store from './store';
import Password from './UpdatePassword';

const user = store.user;
const { Header, Content, Sider } = Layout;

const Root = styled.div`
    @keyframes animation
    {
    from {opacity: 0;}
    to {opacity: 1;}
    }
    animation: animation 600ms;
`;

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
        if (!store.user._id) return null;
        const curMainMenu = cutout(location.pathname);
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <Password />
                </Menu.Item>
                <Menu.Item key="1">
                    <a target="_blank" onClick={this.logout}>退出</a>
                </Menu.Item>
            </Menu>
        );
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Header className="header">
                    <Logo>好看阿米巴管理平台</Logo>
                    <div style={{ float: 'left' }}>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={[curMainMenu]}
                            style={{ lineHeight: '64px' }}
                        >
                            <Menu.Item key="/budget"><Link to="/budget">预算</Link></Menu.Item>
                            <Menu.Item key="/user"><Link to="/user">系统配置</Link></Menu.Item>
                        </Menu>
                    </div>

                    <div style={{ float: 'right', color: 'white' }}>
                        <Dropdown overlay={menu}>
                            <span style={{ cursor: 'pointer' }} className="ant-dropdown-link">
                                欢迎您: {user.name} ({user.account}) <Icon type="down" />
                            </span>
                        </Dropdown>
                    </div>
                </Header>
                <Layout>
                    <Sider collapsible={true} collapsed={this.state.collapsed} onCollapse={this.onCollapse} width={200}>
                        <Route path="/user" component={importedComponent(() => import('./user').then((mod) => mod.UserMenu))} />
                        <Route path="/budget" component={importedComponent(() => import('./budget').then((mod) => mod.BudgetMenu))} />
                    </Sider>
                    <Layout style={{ padding: '3px 3px 10px' }}>
                        <Content style={{ padding: 8, margin: 0, minHeight: 280 }}>
                            <Root key={location.pathname}>
                                <Route exact={true} path="/" component={Home} />
                                <Route path="/user" component={importedComponent(() => import('./user'))} />
                                <Route path="/budget" component={importedComponent(() => import('./budget'))} />
                                <Route key={location.pathname} path="/test/:id" component={TestComponent} />
                            </Root>
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
        const data = await axios.get('/sign/logout').then((res) => (res.data));
        if (data.msg === '退出成功！') { return this.props.history.push('/login/'); }
        return message.error(<span style={{ color: 'red' }}>用户退出失败</span>);
    }
}

export default withRouter(MyLayout);

function Home() {
    return (
        <div>正在加载中...</div>
    );
}

function cutout(pathname: string) {
    return '/' + pathname.split('/')[1];
}

class TestComponent extends Component {
    public state = { aa: '33' };
    public componentDidMount() {
        console.log('componentDidMount');
    }
    public aa = () => {
        axios.get('/aa').then((res) => {
            document.getElementById('aa')!.innerHTML = res.data;
        });
    }
    public render() {
        console.log('renderrender');
        return (
            <div>
                <div id="aa">aa</div>
                <button onClick={this.aa}>aa</button>
            </div>
        );
    }
}

// const TestComponent = withRouter((props) => {
//     return(
//         <div>
//             <NavLink className="as" to="/test/aa">aa</NavLink> |
//             <Link to="/test/bb">bb</Link>
//             <button onClick={() => props.history.push('/test/bb')}>cc</button>
//         </div>
//     );
// });
