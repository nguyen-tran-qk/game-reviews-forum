import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import HomeFeed from "./HomeFeed";
import "bootstrap/dist/css/bootstrap.min.css";
import "./font_awesome/css/all.css";

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
