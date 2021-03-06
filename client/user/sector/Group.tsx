import { Button, Form, Input, InputNumber, Modal, Select, Switch, Table, Tag } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import SearchBox from 'components/SearchBar';
import { action, isComputed, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';

const { Column } = Table;
const FormItem = Form.Item;
const Option = Select.Option;

const store = rootStore.groupStore;

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
                <Table pagination={false} rowKey="_id" dataSource={store.list}>
                    <Column title="ID" dataIndex="key" render={(_, __, index) => index + 1} />
                    <Column title="大部门" dataIndex="sector.name" />
                    <Column title="阿米巴组" dataIndex="name" />
                    <Column title="奖金比例" dataIndex="rewardRate" render={(text) => text + '%'} />
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
                const data = store.list[store.selectedIndex] || {};
                this.props.form.setFieldsValue({
                    name: data.name,
                    sector: data.sector && (data.sector as any)._id,
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
                    title={store.selectedIndex > -1 ? '编辑阿米巴组' : '添加阿米巴组'}
                    visible={store.editModelVisible}
                    onOk={this.handelSubmit}
                    okText="保存"
                    onCancel={store.hideEditModel}
                >
                    <Form>
                        <FormItem label="阿米巴组" {...formItemLayout} >
                            {getFieldDecorator('name', { rules: [{ required: true, message: '此字段必填' }] })(
                                <Input placeholder="请输入阿米巴组名称" />,
                            )}
                        </FormItem>
                        <FormItem label="大部门" {...formItemLayout} >
                            {getFieldDecorator('sector', { rules: [{ required: true, message: '此字段必填' }] })(
                                <Select placeholder="请选择大部门">
                                    {store.sectors.map((item) => <Option key={item._id} value={item._id}>{item.name}</Option>)}
                                </Select>,
                            )}
                        </FormItem>
                        <FormItem label="奖金比例" {...formItemLayout} >
                            {getFieldDecorator('rewardRate', {
                                rules: [{ required: true, message: '此字段必填' }],
                            })(
                                <Input type="number" min={0} max={100} step={0.01} addonAfter="%" />,
                                // <InputNumber style={{ width: '100%' }} formatter={(value) => `${value || 0}%`} parser={(value) => value ? +value.replace(/%/g, '') / 100 : 0} min={0} max={1} step={0.01} />,
                            )}
                        </FormItem>
                        <FormItem label="负责人" {...formItemLayout} >
                            {getFieldDecorator('admin', { rules: [{ required: true, message: '此字段必填' }] })(
                                <Input placeholder="请输入负责人名称" />,
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
    }),
);
