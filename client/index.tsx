(window as any).React = require('react');
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { Provider } from 'mobx-react';
// import DevTools from 'mobx-react-devtools';
import 'moment/locale/zh-cn';
import { render } from 'react-dom';
import universal from 'react-imported-component';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './axios-init';
import store from './store';
render(
    <div>
        <LocaleProvider locale={zh_CN}>
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route path="/login" component={universal(() => import('./login'))} />
                        <Route path="/" component={universal(() => import('./Layout'))} />
                    </Switch>
                </Router>
            </Provider>
        </LocaleProvider>
        {/* <DevTools /> */}
    </div>
    ,
    document.getElementById('root'),
);
