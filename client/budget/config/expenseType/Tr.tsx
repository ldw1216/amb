import { Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import axios from 'axios';
import LinkGroup from 'components/LinkGroup';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import styled from 'styled-components';
import store from './store';

const OptionItem = styled.div`
    display: flex;
    >* {
        margin-right: 10px;
        width: 40%;
        flex: none;
    }
`;

const FormItem = Form.Item;
const Option = Select.Option;

@observer
class Tr extends Component<FormComponentProps & { data: amb.IExpenseType }> {
    public componentDidMount() {
        const { data } = this.props;
        const values = {
            year: data.year,
        } as any;
        data.options!.map((item, index) => {
            this.props.form.getFieldDecorator(`options[${index}].name`);
            this.props.form.getFieldDecorator(`options[${index}].type`);
            values[`options[${index}].name`] = item.name;
            values[`options[${index}].type`] = item.type;
        });
        this.props.form.setFieldsValue(values);
    }
    public render() {
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
        const { getFieldDecorator, getFieldValue } = this.props.form;
        return (
            <tr>
                <td>
                    <FormItem label="">
                        {getFieldDecorator('year', { rules: [{ required: true, message: '此字段必填' }] })(
                            <Select style={{ width: '100%' }}>
                                {[2018, 2019, 2010, 2011, 2012, 2013, 2014].map((item) => <Option key={item} value={item}>{item}</Option>)}
                            </Select>,
                        )}
                    </FormItem>
                </td>
                <td>
                    {this.props.data.options!.map((item, index) => <OptionItem key={item.id}>
                        <FormItem {...formItemLayout} label="名称">
                            {getFieldDecorator(`options[${index}].name`, { rules: [{ required: true, message: '此字段必填' }] })(
                                <Input />,
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="类型">
                            {getFieldDecorator(`options[${index}].type`, { rules: [{ required: true, message: '此字段必填' }] })(
                                <Select style={{ width: 100 }}>
                                    {['财务', '阿米巴'].map((type) => <Option key={type} value={type}>{type}</Option>)}
                                </Select>,
                            )}
                        </FormItem>
                    </OptionItem>)}
                </td>
                <td>
                    <LinkGroup>
                        <a onClick={() => this.props.data.options!.push({ id: Math.random().toString() })}>添加费用项</a>
                        <a onClick={this.handelSubmit}>保存</a>
                    </LinkGroup>
                </td>
            </tr>
        );
    }
    private handelSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                store.save(values, this.props.data._id);
            }
        });
    }
}

export default Form.create<{ data: amb.IExpenseType }>()(Tr);
