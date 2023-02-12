import React from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import App from './App';
import Login from './components/pages/Login';
import NotFound from './components/pages/NotFound';

export default () => (
    <Router>
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/app/building/list" push />} />
            <Route path="/app" component={App} />
            <Route path="/404" component={NotFound} />
            <Route path="/login" component={Login} />
            <Route component={NotFound} />
        </Switch>
    </Router>
);
