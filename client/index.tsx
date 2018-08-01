import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import { Provider } from "mobx-react";
import "moment/locale/zh-cn";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./axios-init";
import Layout from "./Layout";
import Login from "./login";
import store from "./store";

(window as any).React = React;
render(
    <LocaleProvider locale={zh_CN}>
        <Provider store={store}>
            <Router>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/" component={Layout} />
                </Switch>
            </Router>
        </Provider>
    </LocaleProvider>
    ,
    document.getElementById("root"),
);
