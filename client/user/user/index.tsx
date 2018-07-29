import { Component } from "react";
import { observable, observe, computed, when, reaction, autorun, spy, trace } from 'mobx'
import { observer } from 'mobx-react'
import { Button } from 'antd'
import SearchBox from 'components/SearchBox'

class Store {
    @observable array = [];
    @observable string = 'liwei'
    @computed get string1() {
        return this.string + 'hao'
    }
}

const store = new Store()
let val = 'liwei3'
const computedVal = computed(() => {
    return store.string
})


reaction(() => store.string1 + 'aa', (str) => {
    console.log('reaction', str)
}, { delay: 1000 })
@observer
export default class User extends Component {
    public render() {
        return (
            <div>
               sadf
            </div>
        );
    }
}
