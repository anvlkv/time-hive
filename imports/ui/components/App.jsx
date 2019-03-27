import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import { Route, Router, Switch } from 'react-router-dom';
import Landing from '../pages/Landing/Landing';
import MainLayout from '../layouts/MainLayout/MainLayout';
import ManageSpace from '../pages/ManageSpace/ManageSpace';


export default class App extends Component {
    constructor(props) {
        super(props);
        this.history = createBrowserHistory();
    }


    render() {
        return (
            <Router history={this.history}>
                <MainLayout>
                    <Switch>
                        <Route exact path="/" component={Landing}/>
                        <Route exact path="/my/space" component={ManageSpace}/>
                        {/*<PrivateRoute exact path="/my/time"/>*/}
                    </Switch>
                </MainLayout>
            </Router>
        );
    }
}
