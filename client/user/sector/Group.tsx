import { AutoComplete, Button, Checkbox, Col, Form, Icon, Input, Modal, Row, Select, Table, Tooltip } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { PureComponent } from "react";
import "../../style.less";

const { Column } = Table;
const FormItem = Form.Item;
const Option = Select.Option;

const data = [{
    key: "1",
    firstName: "John",
    lastName: "Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
}, {
    key: "2",
    firstName: "Jim",
    lastName: "Green",
    age: 42,
    address: "London No. 1 Lake Park",
}, {
    key: "3",
    firstName: "Joe",
    lastName: "Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
}];

export default class extends PureComponent {
    public render() {
        return (
            <div>
                <div className="searchBox">
                    <Button type="primary">添加阿米巴组</Button>
                    <Edit />
                </div>
                <Table rowKey="key" dataSource={data}>
                    <Column
                        title="ID"
                        dataIndex="key"
                    />
                    <Column
                        title="大部门"
                        dataIndex="firstName"
                    />
                    <Column
                        title="阿米巴组"
                        dataIndex="lastName"
                    />
                    <Column title="奖金比例" dataIndex="age" />
                    <Column title="负责人" dataIndex="address" />
                    <Column title="状态" dataIndex="address3" />
                    <Column
                        title="操作"
                        render={() => (
                            <span>
                                <a href="javascript:;">编辑</a>
                            </span>
                        )}
                    />
                </Table>
            </div>
        );
    }
}

const Edit = Form.create()(
    class extends PureComponent<{ form: WrappedFormUtils }> {
        public state = {
            visible: true,
        };

        public render() {
            const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

            const { getFieldDecorator } = this.props.form;

            return (
                <Modal
                    title="添加部门"
                    visible={this.state.visible}
                    onOk={console.log}
                    onCancel={() => this.setState({ visible: false })}
                >
                    <Form onSubmit={console.log}>
                        <FormItem label="阿米巴组" {...formItemLayout} >
                            {getFieldDecorator("email", {
                                rules: [{ required: true, message: "此字段必填" }],
                            })(
                                <Input placeholder="请输入阿米巴组名称" />,
                            )}
                        </FormItem>
                        <FormItem label="大部门" {...formItemLayout} >
                            {getFieldDecorator("email", {
                                rules: [{ required: true, message: "此字段必填" }],
                            })(
                                <Input />,
                            )}
                        </FormItem>
                        <FormItem label="奖金比例" {...formItemLayout} >
                            {getFieldDecorator("email", {
                                rules: [{ required: true, message: "此字段必填" }],
                            })(
                                <Input />,
                            )}
                        </FormItem>
                        <FormItem label="负责人" {...formItemLayout} >
                            {getFieldDecorator("email", {
                                rules: [{ required: true, message: "此字段必填" }],
                            })(
                                <Input />,
                            )}
                        </FormItem>
                        <FormItem label="状态" {...formItemLayout} >
                            {getFieldDecorator("email", {
                                rules: [{ required: true, message: "此字段必填" }],
                            })(
                                <Input />,
                            )}
                        </FormItem>
                        <FormItem colon={false} label=" " {...formItemLayout} >
                            <Button style={{ marginRight: 30 }}>取消</Button>
                            <Button type="primary">保存</Button>
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    },
);
