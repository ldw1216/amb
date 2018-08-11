import { Input } from 'antd';
import Section from 'components/Section';
import { observer } from 'mobx-react';
import Budget from '../model/Budget';

const Remark: React.SFC<{ budget?: Budget }> = observer((props) => (
    <Section>
        <div style={{ fontSize: 15, marginBottom: 10 }}>预算说明:</div>
        <Input.TextArea
            value={props.budget && props.budget.remark}
            autosize={{ minRows: 3, maxRows: 9 }}
            onChange={(e) => { if (props.budget) props.budget.remark = e.target.value; }}
        />
    </Section>
));
export default Remark;
