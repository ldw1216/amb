/**
 * 表单验证组件 使用方式见 ./createValidatorTest.tsx
 */

import { observable, toJS } from "mobx";
import { observer } from "mobx-react";
import { cloneElement, Component } from "react";

export interface IValidateFormProps {
    validate(): void;
}

export interface IValidationRule {
    required?: boolean;
    pattern?: RegExp;
    msg: string;
}

interface IValidateInfo {
    rules: IValidationRule[];
    errMsg?: string;
    value?: any;
    needValidate?: boolean;
}

interface IValidateProps {
    value?: any; // 跟据此值进行验证
    rules: IValidationRule[]; // 验证规则
    children: (res: IValidateInfo) => JSX.Element;
}

function createValidator() {
    let needValidate = false;  // 需要验证
    const validateInfoMap = observable.map<string, IValidateInfo>({});
    function validate() {
        needValidate = true;
        for (const validateInfo of validateInfoMap.values()) {
            validateInfo.needValidate = true;
            validateInfo.errMsg = validateWithRules(validateInfo.rules, validateInfo.value);
        }
        return [...validateInfoMap.values()].filter((item) => item.errMsg).length;
    }
    return {
        // 主验证组件，提供验证函数 验证函数返回验证结果
        createValidateForm(FormComponent: React.ComponentClass<IValidateFormProps> | React.SFC<IValidateFormProps>) {
            return class extends Component {
                public render() {
                    return (
                        <FormComponent {...this.props} validate={validate} />
                    );
                }
            };
        },
        // 验证组件  包装表单输入项，定义验证方式，捕获表单项的值，将验证结果存入
        Validation: observer(class extends Component<IValidateProps, any> {
            public id = Math.random().toString();
            private validateInfoMap = validateInfoMap.set(this.id, { rules: this.props.rules || [], value: this.props.value });
            public componentWillReceiveProps(nextProps: any) {
                if (nextProps.value !== this.props.value) {
                    const validateInfo = this.validateInfoMap.get(this.id)!;
                    // validateInfo.needValidate = true;
                    validateInfo.value = nextProps.value;
                    validateInfo.errMsg = validateWithRules(validateInfo.rules, nextProps.value);
                }
            }
            public componentWillUnmount() {
                this.validateInfoMap.delete(this.id);
            }
            public render() {
                const validateInfo = this.validateInfoMap.get(this.id)!;
                const ele = this.props.children(validateInfo);
                return cloneElement(ele, {
                    onChange: (e: any) => {
                        const value = e.target ? e.target.value : e;
                        validateInfo.value = value;
                        ele.props.onChange && ele.props.onChange(e);
                        if (needValidate && this.props.value === undefined) {
                            validateInfo.errMsg = validateWithRules(validateInfo.rules, value);
                        }
                    },
                });
            }
        }),
    };
}

export default createValidator;

function validateWithRules(rules: IValidationRule[], value: any) {
    for (const rule of rules) {
        if (rule.required && (value === undefined || value === "")) {
            return rule.msg;
        }
        if (rule.pattern && !rule.pattern.test(value)) {
            return rule.msg;
        }
    }
}
