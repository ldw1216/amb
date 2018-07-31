
declare namespace amb {
    interface IUser {
        _id: string
        createdAt: string
        name: string // 姓名
        account: string // 账号
        password: string // 密码
        role: "admin" | "general" // 账号角色
        groups: Array<string | { _id: string, name: string }> // 阿米巴组
        available: boolean // 状态
        extranet: boolean
        removed: boolean
        remark: string
    }
    interface IGroup {
        _id: string
        sector: string | { name: string } // 大部门
        name: string // 阿米巴组
        rewardRate: number // 奖金比例
        admin: string // 负责人
        available: boolean // 状态
    }
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
}

