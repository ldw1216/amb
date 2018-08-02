import createValidator, { IValidationRule } from "components/createValidator";
import * as React from "react";
import { render } from "react-dom";
(window as any).React = React;
import { Button, Input } from "antd";
import { observable, toJS } from "mobx";
import { observer, propTypes } from "mobx-react";

const { createValidateForm, Validation } = createValidator();

const a = observable({ aa: "" });

const App = createValidateForm(observer((prop) => {
    console.log("aaa");
    return (
        <div>
            <ValidateFormItem value={a.aa} onChange={(e) => a.aa = e.target.value} rules={[{pattern: /aa/, msg: "必须包含aa"}]} />
            <div>
                <Button onClick={() => console.log("验证结果是：", toJS(prop.validate()))}>验证</Button>
            </div>
        </div>
    );
}));

const ValidateFormItem = observer((props: { value: any, rules: IValidationRule[], onChange: (e: any) => any }) => {
    return (
        <Validation value={props.value} rules={props.rules}>
            {(res) => (
                <div>
                    <Input value={props.value} onChange={props.onChange} type="text" />
                    {res.needValidate && res.errMsg} {a.aa}
                </div>
            )}
        </Validation>
    );
});

setTimeout(() => {
    a.aa = "33";
}, 1000);

render(<App />, document.getElementById("root"));
