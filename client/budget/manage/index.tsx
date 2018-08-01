import { Button } from "antd";
import { SearchBar } from "components/SearchBar";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Component } from "react";
import styled from "styled-components";

const Section = styled.section`
    margin: 20px 0;
    border-top: 1px solid #EFEFEF;
`;

@observer
export default class extends Component {
    public render() {
        return (
            <div>
                <SearchBar>
                    <Button type="primary">自定义指标</Button>
                    <Button type="primary">全部导出</Button>
                </SearchBar>
                <Section>
                    ASFD
                </Section>
            </div>
        );
    }
}
