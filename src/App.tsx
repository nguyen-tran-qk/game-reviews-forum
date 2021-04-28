import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, RouteProps } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import HomeFeed from "./HomePage/HomeFeed";
import "bootstrap/dist/css/bootstrap.min.css";
import "./font_awesome/css/all.css";
import { isLoggedIn } from "./utils/helpers";

// A wrapper for <Route> that redirects to home page if not authenticated
const UnAuthRoute = ({ children, ...rest }: RouteProps) => (
    <Route
        {...rest}
        render={({ location }) =>
            isLoggedIn() ? (
                <Redirect
                    to={{
                        pathname: "/",
                        state: { from: location },
                    }}
                />
            ) : (
                children
            )
        }
    />
);

function App() {
    return (
        <Router>
            <Switch>
                <UnAuthRoute path="/login">
                    <Login />
                </UnAuthRoute>
                <UnAuthRoute path="/signup">
                    <Signup />
                </UnAuthRoute>
                <Route path="/">
                    <HomeFeed />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
