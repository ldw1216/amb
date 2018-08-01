import styled from "styled-components";

export const SearchBar = styled.div`
    margin-bottom: 15px;
    display: flex;
    [type="button"], input, select{
        margin-right: 10px;
    }
`;

export const SearchItem = styled.div`
    margin-right: 20px;
    flex: none;
    .ant-select {
        min-width: 160px;
    }
`;

export default SearchBar;
