import { SearchDataType, SearchRange } from "config/config";
import { observable } from "mobx";

export default class Store {
    @observable public condition = {
        year: new Date().getFullYear(),
        range: [SearchRange.二季度, SearchRange.三季度],
        dataTypes: Object.keys(SearchDataType),
    };

}
