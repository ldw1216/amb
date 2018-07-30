import { LocaleProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./axios-init";
import Layout from "./Layout";
import Login from "./login";

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
