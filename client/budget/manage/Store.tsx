import { Input } from "antd";
import createValidator from "components/createValidator";
import { SearchDataType, SearchRange } from "config/config";
import { observable } from "mobx";
import React from "react";

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
    row[`budget_m${i}`] = <Input />;
    row[`budget/income_m${i}`] = 44;
    row[`real_m${i}`] = 33;
    row[`real/income_m${i}`] = 33;
    row[`real/budget_m${i}`] = 33;
}

export default class Store {
    public validator = createValidator();
    @observable public dataSource = dataSource;
    @observable public columns = columns;
    @observable public condition = {
        year: new Date().getFullYear(),
        range: [SearchRange.二季度, SearchRange.三季度],
        dataTypes: Object.keys(SearchDataType),
    };
}
