import { Affix, Select } from "antd";
import { observer } from "mobx-react";
import { Component } from "react";
import styled from "styled-components";

const Option = Select.Option;
const Root = styled.div`
    position: absolute;
    z-index: 100;
    background: #fff;
    border: 2px solid #eaeaea;
    box-shadow: 3px 3px 5px #888888;
    padding: 10px;
`;

@observer
export default class AdvancedSearch extends Component {
    public render() {
        return (
            <Root>
                <Affix>
                    <div>
                        时间选择：
                        <Select style={{ width: 100 }}>
                            <Option value="32332">asdf</Option>
                        </Select>

                    </div>
                </Affix>
            </Root>
        );
    }
}
