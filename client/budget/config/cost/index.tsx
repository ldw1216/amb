import { Button, Form } from "antd";
import axios from "axios";
import SearchBar from "components/SearchBar";
import Table from "components/Table";
import { observable, toJS } from "mobx";
import { observer } from "mobx-react";
import { Component } from "react";
import styled from "styled-components";
import store from "./store";
import Tr from "./Tr";

@observer
export default class extends Component {
    public componentDidMount() {
        store.fetch();
    }
    public render() {
        return (
            <div>
                <SearchBar>
                    <Button onClick={() => store.data.push({ id: Math.random(), options: [] })} type="primary">增加年度</Button>
                </SearchBar>
                <Table>
                    <tbody>
                        <tr>
                            <td style={{ width: 140 }}>年度</td>
                            <td>费用项目</td>
                            <td>操作</td>
                        </tr>
                        {store.data.map((item) => <Tr data={item} key={item.id} />)}
                    </tbody>
                </Table>
            </div>
        );
    }
}
