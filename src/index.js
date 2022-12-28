import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import RestService from "./service/RestService";
import MainLayout from "./layout/MainLayout";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Paths} from "./model/paths";
import SignIn from "./views/sign/SignIn";
import SignUp from "./views/sign/SignUp";

RestService.setupAxiosInterceptors();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Switch>
            <Route path={Paths.SIGN_IN.path} exact component={SignIn}/>
            <Route path={Paths.SIGN_UP.path} exact component={SignUp}/>
            <AuthenticatedRoute path="*" exact component={MainLayout}/>
        </Switch>
    </BrowserRouter>
);
