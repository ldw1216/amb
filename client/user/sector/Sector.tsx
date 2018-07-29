import { Button, Form, Input, Modal, Switch, Table, Tag } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import axios from "axios";
import { action, observable, reaction } from "mobx";
import { observer } from "mobx-react";
import { Component } from "react";

const { Column } = Table;
const FormItem = Form.Item;

class Store {
    @observable public data = [] as Array<{ name: string, admin: string, available: boolean, _id: string }>;
    @observable public selectedIndex = -1;
    @observable public editModelVisible = false;
    @action.bound
    public showEditModel(index: number) {
        this.selectedIndex = index;
        this.editModelVisible = true;
    }

    @action.bound
    public async save(values: any) {
        const edit = this.data[this.selectedIndex];
        if (edit) {
            await axios.post("/sector/" + edit._id, values);
        } else {
            await axios.post("/sector", values);
        }
        this.hideEditModel();
        await this.fetch();
    }

    @action.bound
    public hideEditModel() {
        this.editModelVisible = false;
    }

    @action.bound
    public async fetch() {
        this.data = await axios.get("/sector").then((res) => res.data);
    }
}

const store = new Store();

@observer
export default class extends Component {
    public componentDidMount() {
        store.fetch();
    }
    public render() {
        return (
            <div>
                <div className="searchBox">
                    <Button onClick={() => store.showEditModel(-1)} type="primary">添加大部门</Button>
                    <Edit />
                </div>
                <Table pagination={false} rowKey="_id" dataSource={store.data}>
                    <Column title="ID" dataIndex="key" render={(_, __, index) => index + 1} />
                    <Column title="大部门" dataIndex="name" />
                    <Column title="负责人" dataIndex="admin" />
                    <Column title="状态" dataIndex="available" render={(text) => text ? <Tag color="green">有效</Tag> : <Tag>无效</Tag>} />
                    <Column title="操作" render={(_, __, selectedIndex) => <a onClick={() => { store.showEditModel(selectedIndex); }}>编辑</a>} />
                </Table>
            </div>
        );
    }
}

const Edit = Form.create()(
    observer(class extends Component<{ form: WrappedFormUtils }> {
        public reaction: any;
        private handelSubmit = () => {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    store.save(values);
                }
            });
        }
        public componentDidMount() {
            this.reaction = reaction(() => store.editModelVisible, () => {
                if (!store.editModelVisible) return;
                const data = store.data[store.selectedIndex] || {};
                this.props.form.setFieldsValue({
                    name: data.name,
                    admin: data.admin,
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
                    title="添加部门"
                    visible={store.editModelVisible}
                    onOk={this.handelSubmit}
                    okText="保存"
                    onCancel={store.hideEditModel}
                >
                    <Form>
                        <FormItem label="大部门" {...formItemLayout} >
                            {getFieldDecorator("name", { rules: [{ required: true, message: "此字段必填" }] })(
                                <Input />,
                            )}
                        </FormItem>
                        <FormItem label="负责人" {...formItemLayout} >
                            {getFieldDecorator("admin", { rules: [{ required: true, message: "此字段必填" }] })(
                                <Input />,
                            )}
                        </FormItem>
                        <FormItem label="状态" {...formItemLayout} >
                            {getFieldDecorator("available", { rules: [{ required: true, message: "此字段必填" }], initialValue: true })(
                                <Switch checked={getFieldValue("available")} checkedChildren="有效" unCheckedChildren="无效" />,
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }),
);
