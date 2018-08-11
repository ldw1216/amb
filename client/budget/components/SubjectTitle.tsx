
import styled from 'styled-components';

const ProjectTitle = styled.div`
    font-size: 15px;
    text-align: left;
    font-weight: bold;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 5px;
    i{
        padding: 5px;
        cursor: pointer;
        &:hover{
            color: #000;
        }
    }
`;

export default ProjectTitle;
