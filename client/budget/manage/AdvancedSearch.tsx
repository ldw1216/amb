import { Affix, Select } from "antd";
import Checkbox from "components/Checkbox";
import { observer } from "mobx-react";
import { Component } from "react";
import styled from "styled-components";

const Option = Select.Option;

const Root = styled.div`
    position: absolute;
    z-index: 100;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 3px 3px 5px #888888;
    border-radius: 5px;
    padding: 10px 20px;
`;
const Row = styled.div`
    margin: 15px 0;
`;

const CheckboxItem = Checkbox.CheckboxItem;
const range = ["一季度", "二季度", "三季度", "四季度", "半年报", "全年报", "上一年"];
const dataTypes = ["类型", "预算占比", "实际完成", "实际占比", "预算完成率"];

@observer
export default class AdvancedSearch extends Component {
    public render() {
        return (
            <Affix>
                <Root>
                    <Row>
                        时间选择：
                        <Select style={{ width: 100 }}>
                            <Option value="32332">asdf</Option>
                        </Select>
                        <Checkbox>
                            {range.map((item) => <CheckboxItem key={item} value={item}>{item}</CheckboxItem>)}
                        </Checkbox>
                    </Row>
                    <Row>
                        显示数据：
                        <Checkbox>
                            {dataTypes.map((item) => <CheckboxItem key={item} value={item}>{item}</CheckboxItem>)}
                        </Checkbox>
                    </Row>
                </Root>
            </Affix>
        );
    }
}
