import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { ComponentDecorator, FormComponentProps } from 'antd/lib/form/Form';
import { BudgetSubjectType, BudgetType } from 'config/config';
import { observer } from 'mobx-react';
import { Component } from 'react';
import Budget from '../model/Budget';
import Subject from '../model/Subject';

const FormItem = Form.Item;

@observer
class EditModal extends Component<FormComponentProps & { subject: Subject, budget: Budget }> {
    private handelSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.subject.save({ ...values }).then(() => this.props.form.resetFields());
                this.props.budget.fetch();
            }
        });
    }
    public render() {
        const { form: { getFieldDecorator }, subject } = this.props;
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
        const subjectTypeText = subject.type === BudgetSubjectType.收入 ? '收入' : '成本';
        return (
            <Modal
                title={subject._id ? `编辑预算项目-${subjectTypeText}` : `新增预算项目-${subjectTypeText}`}
                visible={subject.visibleEditor}
                onOk={this.handelSubmit}
                onCancel={subject.hideProjectEditor}
                destroyOnClose={true}
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

export default Form.create<{ subject: Subject, budget: Budget }>()(EditModal);
