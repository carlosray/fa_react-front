import * as React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {Paths} from "./model/paths";
import SignIn from "./views/sign/SignIn";
import SignUp from "./views/sign/SignUp";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import MainLayout from "./layout/MainLayout";
import {Alert, AlertTitle} from "@mui/material";
import {Severities} from "./model/severities";

function IndexComponent() {
    const [alert, setAlert] = React.useState({
        title: "initial title",
        message: "initial message",
        severity: "info"
    })

    const [showAlert, setShowAlert] = React.useState(false)

    const handleAlert = (
        title: string,
        message: string,
        severity: string = Severities.ERROR,
        timeout: number = 3000,
        doAfterAlert = () => {
        }
    ) => {
        if (title && message && severity) {
            setAlert({
                title: title,
                message: message,
                severity: severity
            })
            setShowAlert(true)
            setTimeout(() => {
                doAfterAlert()
                setShowAlert(false)
            }, timeout)
        }
    };

    return (
        <div>
            {showAlert &&
                <div style={{position: "absolute", top: 0, left: 0, right: 0, zIndex: 999}}>
                    <Alert severity={alert.severity}>
                        <AlertTitle>{alert.title}</AlertTitle>
                        {alert.message}
                    </Alert>
                </div>}
            <BrowserRouter>
                <Switch>
                    <Route path={Paths.SIGN_IN.path} exact>
                        <SignIn alert={handleAlert}/>
                    </Route>

                    <Route path={Paths.SIGN_UP.path} exact>
                        <SignUp alert={handleAlert}/>
                    </Route>

                    <AuthenticatedRoute path="*" exact>
                        <MainLayout alert={handleAlert}/>
                    </AuthenticatedRoute>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default IndexComponent;