
declare module '*.less' {
    interface style {
        searchBox: string
        [className: string]: string
    }
    const s : style
    export default s
}

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
}

