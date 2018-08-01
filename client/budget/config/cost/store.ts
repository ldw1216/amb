import axios from "axios";
import { action, observable, observe, toJS } from "mobx";

class Store {
    @observable public data = [] as amb.ICost[];

    @action.bound
    public async save(values: any, id?: string) {
        if (id) {
            await axios.post("/cost/" + id, values);
        } else {
            await axios.post("/cost", values);
        }
        await this.fetch();
    }

    @action.bound
    public async fetch() {
        this.data = await axios.get("/cost").then((res) => res.data);
    }
}

export default new Store();
