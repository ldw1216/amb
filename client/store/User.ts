import axios from 'axios';
import { action, observable } from 'mobx';

export default class User implements amb.IUser {
    // tslint:disable-next-line:variable-name
    @observable public _id: string = '';
    @observable public name: string = '';
    @observable public account: string = '';
    @observable public role: 'general' | 'admin' = 'general';
    @observable public groups: Array<string | { _id: string, name: string }> = [];
    @observable public available: boolean = true;

    @action.bound
    public login(account: string, password: string) {
        return axios.post('/sign/login', { account, password }).then((res) => res.data);
    }

    @action.bound
    public async getMe() {
        const data = await axios.get('/user/me').then((res) => res.data);
        Object.assign(this, data);
    }
}
