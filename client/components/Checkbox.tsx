import { Component } from "react";
import styled from "styled-components";

const Root = styled.div`
    display: inline-block;
    margin-left: 10px;
`;
const Item = styled.div`
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

class Checkbox extends Component<{ onChange?: (value: string[]) => void, value?: string[] }> {
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
            <Root>
                {["一季度", "二季度", "三季度", "四季度"].map((item) => <Item key={item} onClick={() => this.handleChange(item)} className={value.includes(item) ? "active" : ""}>{item}</Item>)}
            </Root>
        );
    }
}

export default Checkbox;
