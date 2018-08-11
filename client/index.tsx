(window as any).React = require('react');
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { Provider } from 'mobx-react';
// import DevTools from 'mobx-react-devtools';
import 'moment/locale/zh-cn';
import { render } from 'react-dom';
import universal from 'react-imported-component';
import { Route, Router, Switch } from 'react-router';
import history from 'store/history';
import './axios-init';

render(
    <div>
        <LocaleProvider locale={zh_CN}>
            <Provider>
                <Router history={history}>
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
