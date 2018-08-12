import { Button, Table } from 'antd';
import LinkGroup from 'components/LinkGroup';
import SearchBar from 'components/SearchBar';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import Edit from './Edit';

const Column = Table.Column;
const periodStore = rootStore.periodStore;

@observer
export default class extends Component {
    public componentDidMount() {
        periodStore.fetch();
        rootStore.groupStore.fetch();
    }
    public render() {
        const groups = rootStore.groupStore.list;
        return (
            <div>
                <SearchBar>
                    <Button onClick={() => periodStore.showEditModel(-1)} type="primary">设置预算提报</Button>
                </SearchBar>
                <Edit />
                <Table pagination={false} rowKey="_id" dataSource={periodStore.list}>
                    <Column title="时间" dataIndex="durationFormat" />
                    <Column title="状态" dataIndex="state" />
                    <Column title="年度" dataIndex="year" />
                    <Column title="季度" dataIndex="quarters" render={(value) => value.join(' ')} />
                    <Column title="阿米巴组" dataIndex="allGroup" render={(text, record: any) => {
                        if (text) return '全部';
                        if (record.groups) return groups.filter((item) => record.groups.includes(item._id)).map((item) => item.name).join(' ');
                    }} />
                    <Column title="操作" render={(_, __, index) => (
                        <LinkGroup>
                            <a onClick={() => periodStore.showEditModel(index)}>修改</a>
                            <span className="ant-divider" />
                        </LinkGroup>
                    )} />
                </Table>
            </div>
        );
    }
}
