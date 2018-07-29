import { Button, Form, Input, message, Modal } from "antd";

import axios from "axios";
import { Component } from "react";
// import { user } from '../authority/authStore'

const user = { _id: 33 };

const FormItem = Form.Item;
class Password extends Component<{ match: any, form: any }>  {
    public state = {
        loading: false,
        visible: false,
        select: false,
    };

    public showModal = (e: any) => {
        e.preventDefault();
        this.setState({
            visible: true,
        });
        console.log("showModal", this.state);
    }

    // 提交新密码
    public submit = () => {
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                const val = { ...values, _id: user._id };
                axios.post("/authority/user/update", val)
                    .then((res) => {
                        if (res.data.errcode) { return message.error(res.data.msg); }
                        this.setState({ loading: false, visible: false });
                        return message.success("密码修改成功");
                    })
                    .catch((res) => message.error("密码修改失败"));
            }
            this.setState({
                loading: false,
                // visible: true
            });
        });
    }

    public handleOk = (value: any) => {
        this.setState({ loading: true });
        this.submit();
    }
    public handleCancel = () => {
        this.setState({ visible: false });
    }
    public render() {
        const { visible, loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        console.log(this.state);
        return (
            <span>
                <span style={{ display: "block" }} onClick={this.showModal}>修改密码</span>
                <div>
                    <Modal
                        visible={visible}
                        title="修改密码"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" size="small" onClick={this.handleCancel}>返回</Button>,
                            <Button key="submit" type="primary" size="small" loading={loading} onClick={this.handleOk}>
                                提交
            </Button>,
                        ]}
                    >   <br />
                        <FormItem label="原密码:" className="flex">
                            {getFieldDecorator("password", {
                                rules: [{ required: true, message: "必须填写此字字段" }],
                            })(
                                <Input type="password" style={{ width: "55%" }} placeholder="原密码" />,
                            )}
                        </FormItem>
                        <FormItem label="新密码:" className="flex">
                            {getFieldDecorator("xpassword", {
                                rules: [{ required: true, message: "必须填写此字字段" }],
                            })(
                                <Input type="password" style={{ width: "55%" }} placeholder="新密码" />,
                            )}
                        </FormItem>
                        <FormItem label="确认密码:" className="flex">
                            {getFieldDecorator("spassword", {
                                rules: [{ required: true, message: "必须填写此字字段" }],
                            })(
                                <Input type="password" style={{ width: "55%" }} placeholder="确认密码" />,
                            )}
                        </FormItem>
                    </Modal>
                </div>
            </span>
        );
    }
}

export default Form.create<{}>()(Password as any);
