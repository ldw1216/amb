import { Tabs } from "antd";
import { PureComponent } from "react";
import Group from "./Group";
import Sector from "./Sector";

const TabPane = Tabs.TabPane;

export default class extends PureComponent {
    public render() {
        return (
            <div>
                <Tabs defaultActiveKey="group">
                    <TabPane tab="阿米巴组设置" key="group">
                        <Group />
                    </TabPane>
                    <TabPane tab="大部门设置" key="sector">
                        <Sector />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
