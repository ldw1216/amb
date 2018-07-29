
declare namespace amb {
    interface IUser {
        _id: string;
        createdAt: string;
        name: string;
        phone: string;
        role: string;
        department: string;
        extranet: boolean;
        password: string;
        remark: string;
    }
    interface IGroup {
        _id: string
        sector: string | {name: string} // 大部门
        name: string // 阿米巴组
        rewardRate: number // 奖金比例
        admin: string // 负责人
        available: boolean // 状态
    }
}

