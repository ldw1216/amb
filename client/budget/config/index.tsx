import { Tabs } from "antd";
import Section from "components/Section";
import { PureComponent } from "react";
import Cost from "./cost";
import Period from "./period";

const TabPane = Tabs.TabPane;

export default class extends PureComponent {
    public render() {
        return (
            <Section>
                <Tabs defaultActiveKey="2">
                    <TabPane tab="提报时间控制" key="1">
                        <Period />
                    </TabPane>
                    <TabPane tab="费用项目设置" key="2">
                        <Cost />
                    </TabPane>
                </Tabs>
            </Section>
        );
    }
}
