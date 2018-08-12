import { action, observable } from 'mobx';

/**
 * 预算列表页状态
 */

export class ListState {
    @observable public advancedSearchDisplay = false; // 是否显示高级搜索
    @action.bound public showAdvancedSearch() {
        this.advancedSearchDisplay = true;
        document.addEventListener('click', this.hideAdvancedSearch);
    }
    @action.bound public hideAdvancedSearch() {
        this.advancedSearchDisplay = false;
        document.removeEventListener('click', this.hideAdvancedSearch);
    }
}
