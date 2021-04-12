import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import "bootstrap/dist/css/bootstrap.min.css";
import HomeFeed from "./HomeFeed";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/signup">
                    <Signup />
                </Route>
                <Route path="/">
                    <HomeFeed />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
