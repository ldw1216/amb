import axios from "axios";
import { action, observable, observe, toJS } from "mobx";
import moment from "moment";

class Store {
    @observable public data = [] as amb.IPeriod[];
    @observable public selectedIndex = -1;
    @observable public editModelVisible = false;
    @observable public groups = [] as Array<{ _id: string, name: string, admin: string }>;

    @action.bound
    public showEditModel(index: number) {
        this.selectedIndex = index;
        this.editModelVisible = true;
    }

    @action.bound
    public async save(values: any) {
        values.duration = [moment(values.duration[0]).startOf("day"), moment(values.duration[1]).endOf("day")];
        const edit = this.data[this.selectedIndex];
        if (edit) {
            await axios.post("/period/" + edit._id, values);
        } else {
            await axios.post("/period", values);
        }
        this.hideEditModel();
        await this.fetch();
    }

    @action.bound
    public hideEditModel() {
        this.editModelVisible = false;
    }

    @action.bound
    public async fetch() {
        this.data = await axios.get("/period").then((res) => res.data).then((list) => list.map((item: amb.IPeriod) => ({

            ...item,
            get durationFormat() {
                return moment(item.duration[0]).format("YYYY-MM-DD") + " —— " + moment(item.duration[1]).format("YYYY-MM-DD");
            },
            get state() {
                const start = moment(item.duration[0]).startOf("day");
                const end = moment(item.duration[1]).endOf("day");
                if (moment().isBefore(start)) return "未开始";
                if (moment().isAfter(end)) return "已结束";
                return "提报中";
            },
        })));
        this.groups = await axios.get("/group").then((res) => res.data);
    }
}

export default new Store();
