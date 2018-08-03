import { Tabs } from 'antd';
import Section from 'components/Section';
import { PureComponent } from 'react';
import ExpenseType from './expenseType';
import Period from './period';

const TabPane = Tabs.TabPane;

export default class extends PureComponent {
    public render() {
        return (
            <Section>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="提报时间控制" key="1">
                        <Period />
                    </TabPane>
                    <TabPane tab="费用项目设置" key="2">
                        <ExpenseType />
                    </TabPane>
                </Tabs>
            </Section>
        );
    }
}
