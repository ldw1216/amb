import styled from "styled-components";

export const ToolBar = styled.div`
margin-bottom: 15px;
display: flex;
align-items: center;
[type="button"], input, select{
    margin-right: 10px;
}
`;

export const SearchBar = ToolBar.extend``;

export const SearchItem = styled.div`
    margin-right: 20px;
    flex: none;
    .ant-select {
        min-width: 160px;
    }
`;

export default SearchBar;
