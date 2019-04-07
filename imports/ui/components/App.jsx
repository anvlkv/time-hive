import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import { Route, Router, Switch } from 'react-router-dom';
import Landing from '../pages/Landing/Landing';
import MainLayout from '../layouts/MainLayout/MainLayout';
import ManageSpace from '../pages/ManageSpace/ManageSpace';
import ManageSpaceContainer from '../pages/ManageSpace/ManageSpace.container';
import 'moment-timezone';
import ManageTime from '../pages/ManageTime/ManageTime';
import ManageTimeContainer from '../pages/ManageTime/ManageTime.container';

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
                        <Route path={`${ManageSpace.routePrefix}/:spaceId?`} component={ManageSpaceContainer}/>
                        <Route path={`${ManageTime.routePrefix}/:timeId?`} component={ManageTimeContainer}/>
                        {/*<PrivateRoute exact path="/my/time"/>*/}
                    </Switch>
                </MainLayout>
            </Router>
        );
    }
}
