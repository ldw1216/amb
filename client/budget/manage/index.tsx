import { Affix, Button, Table } from "antd";
import { SearchBar } from "components/SearchBar";
import Section from "components/Section";
import { action, observable } from "mobx";
import { observer } from "mobx-react";
import React, { Component } from "react";
import styled from "styled-components";
import AdvancedSearch from "./AdvancedSearch";
import Store from "./store";

const store = new Store();

const dataSource = [{
    key: "1",
    name: <span>"胡彦斌"</span>,
    age: 32,
    address: "西湖区湖底公园1号",
}, {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
}];

const columns = [{
    title: "姓名",
    dataIndex: "name",
    key: "name",
}, {
    title: "年龄",
    dataIndex: "age",
    key: "age",
}, {
    title: "住址",
    dataIndex: "address",
    key: "address",
}];

@observer
export default class extends Component {
    @observable private advancedSearchDisplay = false;
    @action.bound private showAdvancedSearch() {
        this.advancedSearchDisplay = true;
        document.addEventListener("click", this.hideAdvancedSearch);
    }
    @action.bound private hideAdvancedSearch() {
        this.advancedSearchDisplay = false;
        document.removeEventListener("click", this.hideAdvancedSearch);
    }
    public render() {
        return (
            <div>
                <Section>
                    <SearchBar style={{ marginBottom: 0 }}>
                        <Button onClick={this.showAdvancedSearch} type="primary">自定义指标</Button>
                        <Button type="primary">全部导出</Button>
                    </SearchBar>
                    {this.advancedSearchDisplay && <AdvancedSearch store={store} />}
                </Section>
                <Section>
                    <Table dataSource={dataSource} columns={columns} />
                </Section>
                <Section>
                    <SearchBar>
                        <span style={{ marginRight: 28 }}>待审核</span><Button type="primary">修改预算</Button>
                    </SearchBar>
                </Section>
            </div>
        );
    }
}
