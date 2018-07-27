import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import './axios-init'
import "moment/locale/zh-cn";
import React from "react";
import { render } from "react-dom";
import Layout from "./Layout";
import Login from "./login";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


(window as any).React = React;
render(
    <LocaleProvider locale={zh_CN}>
        <Router>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/" component={Layout} />
            </Switch>
        </Router>
    </LocaleProvider>
    ,
    document.getElementById("root"),
);
