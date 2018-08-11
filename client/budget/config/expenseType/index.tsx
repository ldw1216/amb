import { Button, Form } from 'antd';
import SearchBar from 'components/SearchBar';
import Table from 'components/Table';
import { observer } from 'mobx-react';
import { Component } from 'react';
import rootStore from 'store/index';
import Tr from './Tr';

const store = rootStore.expenseTypeStore;
@observer
export default class extends Component {
    public componentDidMount() {
        store.fetch();
    }
    public render() {
        return (
            <div>
                <SearchBar>
                    <Button onClick={() => store.addNew()} type="primary">增加年度</Button>
                </SearchBar>
                <Table>
                    <tbody>
                        <tr>
                            <td style={{ width: 140 }}>年度</td>
                            <td>费用项目</td>
                            <td>操作</td>
                        </tr>
                        {store.list.map((item) => <Tr data={item} key={item.id} />)}
                    </tbody>
                </Table>
            </div>
        );
    }
}
