import axios from "axios";
import { action, observable, toJS } from "mobx";

export class User implements amb.IUser {
    // tslint:disable-next-line:variable-name
    public _id: string = "";
    @observable public name: string = "";
    @observable public account: string = "";
    @observable public role: "general" | "admin" = "general";
    @observable public groups = [];
    @observable public available: boolean = true;

    @action.bound
    public login(account: string, password: string) {
        return axios.post("/sign/login", { account, password }).then((res) => res.data);
    }

    @action.bound
    public async getMe() {
        const data = await axios.get("/user/me").then((res) => res.data);
        Object.assign(this, data);
    }
}

export class Store {
    public user = new User();
}

export default new Store();
