import { BudgetSubjectType, BudgetType } from 'config/config'


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
        interface IExpense {
            id: number | string
            _id?: string
            year?: number
            options?: Array<{ _id?: string, id: string, name?: string, type?: '财务' | '阿米巴' }>
        }

        interface IBudgetSubject {
            _id?: string
            id?: string;
            year?: number;
            ambGroup?: string; // 阿米巴组
            subjectType?: BudgetSubjectType;  // 收入主类型
            name?: string; // 类型名称
            sort?: string; // 排序
        }

        interface IBudget {
            user: string;    // 用户id
            ambGroup: string;  // 阿米巴组id
            period: string; // 预算周期
            year: number; // 年份
            budgets: Array<{
                month: number; // 月份
                projectType: BudgetSubjectType; // 类型
                project: string; // 子类型
                type: BudgetType
                money: number; // 预算金额
            }>;
        }
    }
}
