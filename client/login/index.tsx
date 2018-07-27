import { message } from "antd";
import { Button, Input } from "antd";
import axios from "axios";
import { observable, toJS } from "mobx";
import { observer } from "mobx-react";
import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
// import { login } from "../authority/authStore";

@observer
export default class extends Component<RouteComponentProps<{}>> {
    public data = observable({
        phone: "",
        password: "",
    });
    public submit = async (e: any) => {
        e.preventDefault();
        const { phone, password } = toJS(this.data);
        if (!phone || !password) { return message.error(<span style={{ color: "red" }}>账号密码必填！</span>); }
        const data = await axios.post("/sign/login", { phone, password }).then((res) => (res.data));
        if (data.msg === "登录成功！") {
            // login();
            return this.props.history.push("/indent/particulars/list");
        }
        message.error(<span style={{ color: "red" }}>{data.msg || "账号密码错误！"}</span>);
    }
    public handelChange = (key: string, value: string) => {
        this.setState({ [key]: value });
    }
    public render() {
        return (
            <div style={{ background: "#f5f7f9", position: "absolute", height: "100%", width: "100%", display: "flex" }}>
                <div style={{ width: 320, margin: "auto" }}>
                    <header style={{ background: "#324157", height: 60, padding: 12, textAlign: "center" }}><img style={{ height: 36 }} src="//m-res.levect.com/img/192x192.png" /></header>
                    <div style={{ padding: 15, background: "white" }}>
                        <h4 style={{ textAlign: "center", color: "#656565" }}>欢迎登录好看阿米巴系统</h4>
                        <div style={{ margin: "20px 0" }}>
                            <Input value={this.data.phone} onChange={(e) => this.data.phone = e.target.value} placeholder="用户名" />
                        </div>
                        <div style={{ margin: "20px 0" }}>
                            <Input value={this.data.password} type="password" onChange={(e) => this.data.password = e.target.value} placeholder="密码" />
                        </div>
                        <div style={{ margin: "20px 0" }}>
                            <Button onClick={this.submit} style={{ width: "100%" }} type="primary" >登录</Button>
                        </div>
                        <div style={{ textAlign: "center", padding: 10 }}>
                            created by levect.com
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
