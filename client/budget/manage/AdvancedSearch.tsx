import { Affix, Select } from "antd";
import Checkbox from "components/Checkbox";
import { SearchDataType, SearchRange } from "config/config";
import { observer } from "mobx-react";
import { Component } from "react";
import styled from "styled-components";
import Store from "./store";

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
const searchRange = Object.keys(SearchRange);
const dataTypes = Object.keys(SearchDataType);

@observer
export default class AdvancedSearch extends Component<{ store: Store }> {
    private handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.nativeEvent.stopImmediatePropagation();
    }
    public render() {
        const condition = this.props.store.condition;
        return (
            <Affix>
                <Root onClick={this.handleClick}>
                    <Row>
                        时间选择：
                        <Select value={condition.year} onChange={(e) => condition.year = parseInt(e.toString(), 10)} style={{ width: 100 }}>
                            {[2018, 2019, 2020, 2021, 2022].map((item) => <Option key={item} value={item}>{item}</Option>)}
                        </Select>
                        <Checkbox value={condition.range} onChange={(val: any) => condition.range = val}>
                            {searchRange.map((item) => <CheckboxItem key={item} value={item}>{item}</CheckboxItem>)}
                        </Checkbox>
                    </Row>
                    <Row>
                        显示数据：
                        <Checkbox value={condition.dataTypes} onChange={(val: any) => condition.dataTypes = val}>
                            {dataTypes.map((item) => <CheckboxItem key={item} value={item}>{item}</CheckboxItem>)}
                        </Checkbox>
                    </Row>
                </Root>
            </Affix>
        );
    }
}
