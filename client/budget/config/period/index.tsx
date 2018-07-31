import { Button, Table } from "antd";
import LinkGroup from "components/LinkGroup";
import SearchBar from "components/SearchBar";
import { observer } from "mobx-react";
import moment from "moment";
import { Component } from "react";
import Edit from "./Edit";
import store from "./store";

const Column = Table.Column;

@observer
export default class extends Component {
    public componentDidMount() {
        store.fetch();
    }
    public render() {
        return (
            <div>
                <SearchBar>
                    <Button onClick={() => store.showEditModel(-1)} type="primary">设置预算提报</Button>
                </SearchBar>
                <Edit />
                <Table pagination={false} rowKey="_id" dataSource={store.data}>
                    <Column title="时间" dataIndex="durationFormat" />
                    <Column title="状态" dataIndex="state" />
                    <Column title="年度" dataIndex="year" />
                    <Column title="季度" dataIndex="quarters" render={(value) => value.join(" ")} />
                    <Column title="阿米巴组" dataIndex="allGroup" render={(text, record: any) => text ? "全部" : record.groups.map((item: any) => item.name).join(" ")} />
                    <Column title="操作" render={(_, __, index) => (
                        <LinkGroup>
                            <a onClick={() => store.showEditModel(index)}>修改</a>
                            <span className="ant-divider" />
                        </LinkGroup>
                    )} />
                </Table>
            </div>
        );
    }
}
