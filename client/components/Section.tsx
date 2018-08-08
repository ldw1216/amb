import styled from 'styled-components';
const Section = styled.section`
    padding: 15px;
    background: #fff;
    border-radius: 8px;
    margin-bottom: 8px;
`;

const TableSection = Section.extend`
    &&&&&&&& table {
        thead th{
            background: #f8f8f8;
        }
        th{
            white-space: nowrap;
            padding: 10px 20px
        }
        td{
            text-align: center;
        }
    }
`;

export default Section;
export {
    TableSection,
};
