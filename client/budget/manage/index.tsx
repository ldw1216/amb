import { Affix, Button, Table } from "antd";
import { SearchBar } from "components/SearchBar";
import Section from "components/Section";
import { action, observable } from "mobx";
import { observer } from "mobx-react";
import React, { Component } from "react";
import styled from "styled-components";
import AdvancedSearch from "./AdvancedSearch";
import Store from "./store";

const Root = styled.div`
    &&&&&&&& table {
        thead th{
            background: #f8f8f8;
        }
        th{
            white-space: nowrap;
            padding: 10px 20px
        }
        td{
            text-align: center;
        }
    }
`;
const store = new Store();

const row = { type: "收入", key: 1 } as any;
const dataSource = [row];
const columns = [
    {
        title: "2018",
        dataIndex: "type",
        key: "type",
        fixed: "left",
    } as any,
];
for (let i = 1; i < 13; i++) {
    columns.push({
        title: `${i}月`,
        dataIndex: `month${i}`,
        key: `month${i}`,
        children: [
            {
                title: `预算`,
                dataIndex: `budget_m${i}`,
                key: `budget_m${i}`,
            },
            {
                title: `占收入比`,
                dataIndex: `budget/income_m${i}`,
                key: `budget/income_m${i}`,
            },
            {
                title: `实际`,
                dataIndex: `real_m${i}`,
                key: `real_m${i}`,
            },
            {
                title: `占收入比`,
                dataIndex: `real/income_m${i}`,
                key: `real/income_m${i}`,
            },
            {
                title: `预算完成率`,
                dataIndex: `real/budget_m${i}`,
                key: `real/budget_m${i}`,
            },
        ],
    });
    row[`budget_m${i}`] = 33;
    row[`budget/income_m${i}`] = 33;
    row[`real_m${i}`] = 33;
    row[`real/income_m${i}`] = 33;
    row[`real/budget_m${i}`] = 33;
}

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
            <Root>
                <Section>
                    <SearchBar style={{ marginBottom: 0 }}>
                        <Button onClick={this.showAdvancedSearch} type="primary">自定义指标</Button>
                        <Button type="primary">全部导出</Button>
                    </SearchBar>
                    {this.advancedSearchDisplay && <AdvancedSearch store={store} />}
                </Section>
                <Section>
                    <Table pagination={false} scroll={{ x: "auto" }} bordered size="small" dataSource={dataSource} columns={columns} />
                </Section>
                <Section>
                    <SearchBar>
                        <span style={{ marginRight: 28 }}>待审核</span><Button type="primary">修改预算</Button>
                    </SearchBar>
                </Section>
            </Root>
        );
    }
}
