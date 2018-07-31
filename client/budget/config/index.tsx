import { Tabs } from "antd";
import { PureComponent } from "react";
import Period from "./period";

const TabPane = Tabs.TabPane;

export default class extends PureComponent {
    public render() {
        return (
            <div>
                <Tabs defaultActiveKey="group">
                    <TabPane tab="提报时间控制" key="1">
                        <Period />
                    </TabPane>
                    <TabPane tab="费用项目设置" key="sector">
                        aasdfasdfs
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
