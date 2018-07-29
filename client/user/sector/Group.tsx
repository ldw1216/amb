import { Button, Form, Input, InputNumber, Modal, Select, Switch, Table, Tag } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import axios from "axios";
import { action, observable, reaction } from "mobx";
import { observer } from "mobx-react";
import { Component } from "react";
import SearchBox from "../../components/SearchBox";

const { Column } = Table;
const FormItem = Form.Item;
const Option = Select.Option;

class Store {
    @observable public data = [] as amb.IGroup[];
    @observable public sectors = [] as Array<{ _id: string, name: string }>;
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
            await axios.post("/group/" + edit._id, values);
        } else {
            await axios.post("/group", values);
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
        this.data = await axios.get("/group").then((res) => res.data);
        this.sectors = await axios.get("/sector").then((res) => res.data);
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
                <SearchBox>
                    <Button onClick={() => store.showEditModel(-1)} type="primary">添加阿米巴组</Button>
                </SearchBox>
                <Edit />
                <Table pagination={false} rowKey="_id" dataSource={store.data}>
                    <Column title="ID" dataIndex="key" render={(_, __, index) => index + 1} />
                    <Column title="大部门" dataIndex="sector.name" />
                    <Column title="阿米巴组" dataIndex="name" />
                    <Column title="奖金比例" dataIndex="rewardRate" />
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
        public componentDidMount() {
            this.reaction = reaction(() => store.editModelVisible, () => {
                if (!store.editModelVisible) return;
                const data = store.data[store.selectedIndex] || {};
                this.props.form.setFieldsValue({
                    name: data.name,
                    sector: (data.sector as any)._id,
                    rewardRate: data.rewardRate,
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
                    title="添加阿米巴组"
                    visible={store.editModelVisible}
                    onOk={this.handelSubmit}
                    okText="保存"
                    onCancel={store.hideEditModel}
                >
                    <Form>
                        <FormItem label="阿米巴组" {...formItemLayout} >
                            {getFieldDecorator("name", { rules: [{ required: true, message: "此字段必填" }] })(
                                <Input placeholder="请输入阿米巴组名称" />,
                            )}
                        </FormItem>
                        <FormItem label="大部门" {...formItemLayout} >
                            {getFieldDecorator("sector", { rules: [{ required: true, message: "此字段必填" }] })(
                                <Select placeholder="请选择大部门">
                                    {store.sectors.map((item) => <Option key={item._id} value={item._id}>{item.name}</Option>)}
                                </Select>,
                            )}
                        </FormItem>
                        <FormItem label="奖金比例" {...formItemLayout} >
                            {getFieldDecorator("rewardRate", { rules: [{ required: true, message: "此字段必填" }] })(
                                <InputNumber style={{ width: "100%" }} formatter={(value) => `${parseFloat(value as any || "0") * 100}%`} parser={(value) => value ? parseFloat(value.replace("%", "")) / 100 : 0} min={0} max={1} placeholder="请输入将金比例" />,
                            )}
                        </FormItem>
                        <FormItem label="负责人" {...formItemLayout} >
                            {getFieldDecorator("admin", { rules: [{ required: true, message: "此字段必填" }] })(
                                <Input placeholder="请输入负责人名称" />,
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
        private handelSubmit = () => {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    store.save(values).then(() => this.props.form.resetFields());
                }
            });
        }
    }),
);
