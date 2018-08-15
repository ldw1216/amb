export enum Role {
    'admin' = '管理员',
    'general' = '普通用户',
}
export enum SearchRange {
    '一季度' = '一季度', '二季度' = '二季度', '三季度' = '三季度', '四季度' = '四季度', '半年报' = '半年报', '全年报' = '全年报',
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

export enum ApprovalState {
    未提报 = 0,
    草稿 = 4,
    已提报未审核 = 8,
    审核拒绝 = 12,
    已通过审核 = 16,
    没有提报周期 = 100,
    阿米巴组已失效 = 120,
}
