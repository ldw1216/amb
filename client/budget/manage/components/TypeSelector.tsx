import { Input, Select } from 'antd';
import { SelectProps } from 'antd/lib/select';

const Option = Select.Option;
const TypeSelector: React.SFC<SelectProps> = (props) => {
    return (
        <Select style={{ width: 100 }} {...props}>
            <Option value="阿米巴">阿米巴</Option>
            <Option value="费用">费用</Option>
        </Select>
    );
};

export default TypeSelector;
