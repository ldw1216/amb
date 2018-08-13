import React, { Children, cloneElement, Component, ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
    display: inline-block;
    margin-left: 10px;
`;
const Item = styled.div`
    display: inline-block;
    padding: 0px 10px;
    margin: 0 8px;
    line-height: 1.6;
    border-radius: 4px;
    cursor: pointer;
    &.active{
        background: #1890ff;
        color: #ffffff;
    }
`;

class Checkbox extends Component<{ onChange?: (value: any[]) => void, value?: any[] }> {
    public static CheckboxItem = (props: { children?: ReactNode, value: string }) => {
        return props.children as JSX.Element;
    }
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
                {Children.map(this.props.children, (child, i) => {
                    if (React.isValidElement(child)) {
                        const props = child.props as any;
                        return <Item onClick={() => this.handleChange(props.value)} className={value.includes(props.value) ? 'active' : ''}>{child}</Item>;
                    }
                    return this.props.children;
                })}
            </Root>
        );
    }
}

export default Checkbox;
