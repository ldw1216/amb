import { DatePicker, Form, Icon, Input, Modal, Radio, Select, Switch, Tooltip } from "antd";
import { FormComponentProps } from "antd/lib/form";
import axios from "axios";
import Checkbox from "components/Checkbox";
import { observable, reaction } from "mobx";
import { observer } from "mobx-react";
import moment from "moment";
import { Component } from "react";
import styled from "styled-components";
import store from "./store";

const CheckboxItem = Checkbox.CheckboxItem;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@observer
class Edit extends Component<FormComponentProps> {
    private reaction: any;
    public componentDidMount() {
        this.reaction = reaction(() => store.editModelVisible, () => {
            if (!store.editModelVisible) return;
            this.props.form.getFieldDecorator("groups");
            const data = store.data[store.selectedIndex] || {};
            this.props.form.setFieldsValue({
                duration: data.duration ? data.duration.map((item) => moment(item)) : [],
                year: data.year || new Date().getFullYear(),
                quarters: data.quarters || [],
                groups: data.groups && data.groups.map((item: any) => item._id),
                allGroup: data.allGroup,
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
                title={store.selectedIndex > -1 ? "编辑" : "添加"}
                visible={store.editModelVisible}
                onOk={this.handelSubmit}
                okText="保存"
                onCancel={store.hideEditModel}
                width={600}
            >
                <Form>
                    <FormItem label="提报时间" {...formItemLayout} >
                        {getFieldDecorator("duration", { rules: [{ required: true, message: "此字段必填" }] })(
                            <RangePicker />,
                        )}
                    </FormItem>

                    <FormItem label="预算年份" {...formItemLayout} >
                        {getFieldDecorator("year", { rules: [{ required: true, message: "此字段必填" }] })(
                            <Select style={{ width: 80 }}>
                                <Option value={2018}>2018</Option>
                                <Option value={2019}>2019</Option>
                                <Option value={2020}>2020</Option>
                            </Select>,
                        )}
                    </FormItem>

                    <FormItem label="季度" {...formItemLayout} >
                        {getFieldDecorator("quarters", { rules: [{ required: true, message: "此字段必填" }] })(
                            <Checkbox>
                                {["一季度", "二季度", "三季度", "四季度"].map((item) => <CheckboxItem key={item} value={item}>{item}</CheckboxItem>)}
                            </Checkbox>,
                        )}
                    </FormItem>
                    <FormItem label="阿米巴组" {...formItemLayout} >
                        {getFieldDecorator("allGroup", { rules: [{ required: true, message: "此字段必填" }] })(
                            <Radio.Group buttonStyle="solid">
                                <Radio.Button value={true}>全部</Radio.Button>
                                <Radio.Button value={false}>指定阿米巴组</Radio.Button>
                            </Radio.Group>,
                        )}
                    </FormItem>
                    {getFieldValue("allGroup") === false && <FormItem label="阿米巴组" {...formItemLayout} >
                        {getFieldDecorator("groups", { rules: [{ required: true, message: "此字段必填" }] })(
                            <Select mode="multiple" filterOption={(input, option) => option.props.children!.toString().includes(input)} placeholder="请选择阿米巴组">
                                {store.groups.map((item) => <Option key={item._id} value={item._id}>{item.name}</Option>)}
                            </Select>,
                        )}
                    </FormItem>}
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

const QuarterBox = styled.div`
    display: inline-block;
    margin-left: 10px;
`;

const QuarterItem = styled.div`
    display: inline-block;
    padding: 0px 5px;
    margin: 0 2px;
    line-height: 1.6;
    border-radius: 4px;
    cursor: pointer;
    &.active{
        background: #1890ff;
        color: #ffffff;
    }
`;

class Quarter extends Component<{ onChange?: (value: string[]) => void, value?: string[] }> {
    public handleChange = (value: string) => {

        if (this.props.onChange) {
            this.props.value!.includes(value) ?
                this.props.onChange(this.props.value!.filter((item) => item !== value)) :
                this.props.onChange(this.props.value!.concat(value));
        }
    }
    public render() {
        const value = this.props.value || [];
        return (
            <QuarterBox>
                {["一季度", "二季度", "三季度", "四季度"].map((item) => <QuarterItem key={item} onClick={() => this.handleChange(item)} className={value.includes(item) ? "active" : ""}>{item}</QuarterItem>)}
            </QuarterBox>
        );
    }
}
