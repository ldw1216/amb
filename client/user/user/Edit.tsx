import { Form, Icon, Input, Modal, Select, Switch, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import axios from 'axios';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import store from './store';
const FormItem = Form.Item;
const Option = Select.Option;

@observer
class Edit extends Component<FormComponentProps> {
    private reaction: any;
    public componentDidMount() {
        this.reaction = reaction(() => store.editModelVisible, () => {
            if (!store.editModelVisible) return;
            const data = store.data[store.selectedIndex] || {};
            this.props.form.setFieldsValue({
                name: data.name,
                account: data.account,
                password: data.password || '111111',
                role: data.role,
                groups: data.groups && data.groups.map((item: any) => item._id),
                available: data.available === undefined ? true : data.available,
            });
        });
    }
    public componentWillUnmount() {
        this.reaction();
    }
    public render() {
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
        const { getFieldDecorator, getFieldValue } = this.props.form;
        return (
            <Modal
                title={store.selectedIndex > -1 ? '编辑用户' : '添加用户'}
                visible={store.editModelVisible}
                onOk={this.handelSubmit}
                okText="保存"
                onCancel={store.hideEditModel}
            >
                <Form>
                    <FormItem label="账号" {...formItemLayout} >
                        {getFieldDecorator('account', { rules: [{ required: true, message: '此字段必填' }] })(
                            <Input placeholder="请输入账号" />,
                        )}
                    </FormItem>
                    <FormItem label="姓名" {...formItemLayout} >
                        {getFieldDecorator('name', { rules: [{ required: true, message: '此字段必填' }] })(
                            <Input placeholder="请输入账号" />,
                        )}
                    </FormItem>
                    <FormItem label={<span>密码 <Tooltip title="默认密码：111111"><Icon type="question-circle" /> </Tooltip></span>} {...formItemLayout} >
                        {getFieldDecorator('password', { rules: [{ required: true, message: '此字段必填' }] })(
                            <Input type="password" placeholder="请输入密码" />,
                        )}
                    </FormItem>
                    <FormItem label="账号角色" {...formItemLayout} >
                        {getFieldDecorator('role', { rules: [{ required: true, message: '此字段必填' }] })(
                            <Select placeholder="请选择角色">
                                <Option value="general">普通用户</Option>
                                <Option value="admin">管理员</Option>
                            </Select>,
                        )}
                    </FormItem>
                    <FormItem label="阿米巴组" {...formItemLayout} >
                        {getFieldDecorator('groups', { rules: [{ required: true, message: '此字段必填' }] })(
                            <Select mode="multiple" filterOption={(input, option) => option.props.children!.toString().includes(input)} placeholder="请选择阿米巴组">
                                {store.groups.map((item) => <Option key={item._id} value={item._id}>{item.name}</Option>)}
                            </Select>,
                        )}
                    </FormItem>
                    <FormItem label="状态" {...formItemLayout} >
                        {getFieldDecorator('available', { rules: [{ required: true, message: '此字段必填' }], initialValue: true })(
                            <Switch checked={getFieldValue('available')} checkedChildren="有效" unCheckedChildren="无效" />,
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
    private handelSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                store.save(values).then(() => this.props.form.resetFields());
            }
        });
    }
}

export default Form.create()(Edit);
