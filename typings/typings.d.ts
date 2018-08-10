import { BudgetSubjectType, BudgetType, ApprovalState } from 'config/config'


declare global {
    namespace amb {
        // 用户
        interface IUser {
            _id?: string
            createdAt?: string
            name: string // 姓名
            account: string // 账号
            password?: string // 密码
            role: "admin" | "general" // 账号角色
            groups: Array<string | { _id: string, name: string }> // 阿米巴组
            available: boolean // 状态
            extranet?: boolean
            removed?: boolean
            remark?: string
        }

        // 阿米巴组
        interface IGroup {
            _id: string
            sector: string | { name: string } // 大部门
            name: string // 阿米巴组
            rewardRate: number // 奖金比例
            admin: string // 负责人
            available: boolean // 状态
        }

        // 预算提报周期
        interface IPeriod {
            _id: string
            durationFormat?: string // 时间 格式化后的 duration get
            duration: [Date, Date] // 状态 提报中、结束、未开始 
            state?: string // 状态 提报中、结束、未开始 get
            year: number // 年度
            quarters: Array<"一季度" | "二季度" | "三季度" | "四季度"> // 季度
            groups: Array<string> // 阿米巴组
            allGroup: boolean // 全部阿米巴组
        }

        // 年度费用项目
        interface IExpenseType {
            id: number | string
            _id?: string
            year?: number
            options: IExpenseTypeOption[]
        }

        // 费用详细
        interface IExpenseTypeOption {
            _id?: string, id?: string, name?: string, budgetType?: BudgetType
        }

        // 预算子项目， 比如大数据收入，推荐收入，金立商务收入，服务器成本等
        interface IBudgetSubject {
            _id?: string
            id?: string;
            year?: number;
            group?: string; // 阿米巴组
            subjectType?: BudgetSubjectType;  // 收入主类型
            budgetType?: BudgetType;  // 预算类型
            name?: string; // 类型名称
            sort?: number; // 排序
        }

        // 预算
        interface IBudget {
            _id?: string
            approvalState?: ApprovalState; // 审批状态
            user: string;    // 用户id
            group: string;  // 阿米巴组id
            period?: string; // 预算周期
            year: number; // 年份
            monthBudgets: IMonthBudget[] // 各月的预算
            remark?: string // 备注
        }

        // 每个月的预算
        interface IMonthBudget {
            _id?: string
            month: number;
            subjectBudgets: ISubjectBudget[]
        }

        interface ISubjectBudget {
            _id?: string
            subjectType: BudgetSubjectType // 类型  收入 成本
            subjectId: string  // 如  大数据收入 技术支持成本 的id
            subjectName: string
            budget?: number
            reality?: number
        }

    }
}
