export enum Role {
    'admin' = '管理员',
    'general' = '普通用户',
}
export enum SearchRange {
    '一季度' = '一季度', '二季度' = '二季度', '三季度' = '三季度', '四季度' = '四季度', '半年报' = '半年报', '全年报' = '全年报', '上一年' = '上一年',
}
export enum SearchDataType {
    '预算占比' = '预算占比', '实际完成' = '实际完成', '实际占比' = '实际占比', '预算完成率' = '预算完成率',
}

export enum BudgetSubjectType {
    收入 = 'income',
    成本 = 'cost',
    费用 = 'expense',
}

export enum BudgetType {
    阿米巴 = '阿米巴',
    财务 = '财务',
}
