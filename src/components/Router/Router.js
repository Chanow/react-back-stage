import React, { Component } from 'react';
import "./Router.css";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Home from '../../pages/Home/Home';
import Login from '../../pages/Login/Login';

export class router extends Component {
    render() {
        return (
            <Router basename="/fencunconfig" >
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path='/login' component={Login} />
                    <Redirect exact to='/' />
                </Switch>
            </Router>
        );
    }
}

export default router;
