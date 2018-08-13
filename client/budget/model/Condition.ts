import { SearchDataType, SearchRange } from 'config/config';
import { action, observable } from 'mobx';

/**
 * 预算的显示搜索条件
 */
export default class Condition {
    @observable public year = new Date().getFullYear();
    @observable public range = [SearchRange.二季度, SearchRange.三季度];
    @observable public dataTypes = Object.keys(SearchDataType);

    // 恢复默认搜索条件
    @action.bound public restoreDefault() {
        this.year = new Date().getFullYear();
        this.range = [SearchRange.二季度, SearchRange.三季度];
        this.dataTypes = Object.keys(SearchDataType);
    }
}
