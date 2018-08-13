import { SearchDataType, SearchRange } from 'config/config';
import { action, observable } from 'mobx';
import { ApprovalState } from './../../../config/config';
import { BudgetList } from './BudgetList';

/**
 * 预算的显示搜索条件
 */
export default class Condition {
    @observable public year = new Date().getFullYear();
    @observable public range = [SearchRange.二季度, SearchRange.三季度];
    @observable public dataTypes = Object.keys(SearchDataType);
    @observable public groupId: string = '0';
    @observable public approvalState: ApprovalState[] = Object.values(ApprovalState).filter((i) => +i && +i < 100);
    @observable public budgetRatioVisible: boolean = true; // 预算占比
    // 恢复默认搜索条件
    @action.bound public restoreDefault() {
        this.year = new Date().getFullYear();
        this.range = [SearchRange.二季度, SearchRange.三季度];
        this.dataTypes = Object.keys(SearchDataType);
    }
}
