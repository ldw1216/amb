import { Button, Select, Table, Tag } from "antd";
import LinkGroup from "components/LinkGroup";
import SearchBox, { SearchItem } from "components/SearchBar";
import { Role } from "config/config";
import { observer } from "mobx-react";
import { Component } from "react";
import Edit from "./Edit";
import store from "./store";
const { Column } = Table;
const Option = Select.Option;
import Section from "components/Section";
import { observable, toJS } from "mobx";
import { uniq } from "ramda";

@observer
export default class extends Component {
    public componentDidMount() {
        store.fetch();
    }
    public render() {
        return (
            <Section>
                <SearchBar1 />
                <SearchBox>
                    <Button onClick={() => store.showEditModel(-1)} type="primary">添加用户</Button>
                </SearchBox>
                <Edit />
                <Table pagination={false} rowKey="_id" dataSource={store.data}>
                    <Column title="ID" dataIndex="key" render={(_, __, index) => index + 1} />
                    <Column title="姓名" dataIndex="name" />
                    <Column title="账号" dataIndex="account" />
                    <Column title="账号角色" dataIndex="role" render={(text) => Role[text]} />
                    <Column title="关联阿米巴组" dataIndex="groups" render={(text) => text.map((item: any) => item.name).join("，")} />
                    <Column title="账号状态" dataIndex="available" render={(text) => text ? <Tag color="green">有效</Tag> : <Tag>无效</Tag>} />
                    <Column title="操作" dataIndex="_id" render={(id, __, selectedIndex) => (
                        <LinkGroup>
                            <a onClick={() => store.showEditModel(selectedIndex)}>编辑</a>
                            <a onClick={() => store.resetPassword(id)}>密码重置</a>
                        </LinkGroup>
                    )} />
                </Table>
            </Section>
        );
    }
}

const SearchBar1 = observer(() => {
    return (
        <SearchBox>
            <SearchItem>
                阿米巴组：
                <Select allowClear placeholder="全部" onChange={(value) => store.condition.groups = value}>
                    {store.groups.map((item) => <Option key={item._id} value={item._id}>{item.name}</Option>)}
                </Select>
            </SearchItem>
            <SearchItem>
                负责人：
                <Select allowClear placeholder="全部" onChange={(value) => store.condition.admin = value}>
                    {uniq(store.groups.map((item) => item.admin)).map((item) => <Option key={item} value={item}>{item}</Option>)}
                </Select>
            </SearchItem>
            <SearchItem>
                账号状态：
                <Select allowClear placeholder="全部" onChange={(value) => store.condition.available = value}>
                    <Option value="true">有效</Option>
                    <Option value="false">无效</Option>
                </Select>
            </SearchItem>
        </SearchBox>
    );
});
