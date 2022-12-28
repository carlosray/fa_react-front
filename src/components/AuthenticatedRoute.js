import React, {Component} from 'react'
import {Redirect, Route} from 'react-router-dom'
import RestService from "../service/RestService";

class AuthenticatedRoute extends Component {
    render() {
        if (RestService.isUserLoggedIn()) {
            return <Route {...this.props} />
        } else {
            return <Redirect to="/login" />
        }

    }
}

export default AuthenticatedRoute