import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { Omit } from 'antd/lib/_util/type';
import { ComponentDecorator, FormComponentProps } from 'antd/lib/form/Form';
import { BudgetSubjectType, BudgetType } from 'config/config';
import { observer } from 'mobx-react';
import { Component } from 'react';
import rootUser from 'store/index';
import store from '../Store';

const subjectStore = store.subject;

const FormItem = Form.Item;

// _id?: string
//             id?: string;
//             year?: number;
//             ambGroup?: string; // 阿米巴组
//             subjectType?: BudgetProjectType;  // 收入主类型
//             name?: string; // 类型名称
//             sort?: string; // 排序

@observer
class EditModal extends Component<FormComponentProps> {
    private handelSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                subjectStore.save({ ...values, year: rootUser.user.period!.year }).then(() => this.props.form.resetFields());
            }
        });
    }
    public render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
        const subjectTypeText = subjectStore.visibleProject.subjectType === BudgetSubjectType.收入 ? '收入' : '成本';
        return (
            <Modal
                title={subjectStore.visibleProject._id ? `编辑预算项目-${subjectTypeText}` : `新增预算项目-${subjectTypeText}`}
                visible={subjectStore.displayEditor}
                onOk={this.handelSubmit}
                onCancel={subjectStore.hideProjectEditor}
            >
                <Form>
                    <FormItem label="名称" {...formItemLayout} >
                        {getFieldDecorator('name', { rules: [{ required: true, message: '此字段必填' }] })(
                            <Input />,
                        )}
                    </FormItem>
                    <FormItem label="排序" {...formItemLayout} >
                        {getFieldDecorator('sort', { rules: [{ required: true, message: '此字段必填' }] })(
                            <InputNumber />,
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(EditModal);
