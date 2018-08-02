import { Affix, Button, Table } from "antd";
import { SearchBar } from "components/SearchBar";
import Section from "components/Section";
import Table1 from "components/Table";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React, { Component } from "react";
import styled from "styled-components";
import AdvancedSearch from "./AdvancedSearch";

const TableBox = styled.div`
    table{
        width: auto;
        min-width: 100%;
        td {
            white-space: nowrap;
        }
    }
`;

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
    public render() {
        return (
            <div>
                <Section>
                    <SearchBar style={{ marginBottom: 0 }}>
                        <Button type="primary">自定义指标</Button>
                        <Button type="primary">全部导出</Button>
                    </SearchBar>
                    <AdvancedSearch></AdvancedSearch>
                </Section>
                <Section>
                    <Table dataSource={dataSource} columns={columns} />
                </Section>
                <Section>
                    <SearchBar>
                        <span style={{ marginRight: 28 }}>待审核</span><Button type="primary">修改预算</Button>
                    </SearchBar>
                    <TableBox>
                        <Table1>
                            <thead>
                                <tr>
                                    <td>2018年</td>
                                    <td>1月</td>
                                    <td>2月</td>
                                    <td>3月</td>
                                    <td>一季度</td>
                                    <td>4月</td>
                                    <td>5月</td>
                                    <td>6月</td>
                                    <td>二季度</td>
                                    <td>上半年</td>
                                    <td>7月</td>
                                    <td>8月</td>
                                    <td>9月</td>
                                    <td>三季度</td>
                                    <td>10月</td>
                                    <td>11月</td>
                                    <td>12月</td>
                                    <td>全年</td>
                                </tr>
                                <tr>
                                    <td>研发-人工智能</td>
                                    <td>预算</td>
                                    <td>研发-人工智能</td>
                                    <td>研发-人工智能</td>
                                    <td>研发-人工智能</td>
                                    <td>研发-人工智能</td>
                                    <td>研发-人工智能</td>
                                    <td>研发-人工智能</td>
                                    <td>研发-人工智能</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>asdf</td>
                                    <td>ds</td>
                                </tr>
                            </tbody>
                        </Table1>
                    </TableBox>
                </Section>
            </div>
        );
    }
}
