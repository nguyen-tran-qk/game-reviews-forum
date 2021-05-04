import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, RouteProps } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import HomeFeed from "./HomePage/HomeFeed";
import "bootstrap/dist/css/bootstrap.min.css";
import "./font_awesome/css/all.css";
import { isLoggedIn } from "./utils/helpers";
import ReviewEditorDialog from "./HomePage/ReviewEditorDialog";
import { Navbar, Form, Button } from "react-bootstrap";
import { useHistory } from "react-router";

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
    const history = useHistory();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Navbar bg="light" variant="light" className="justify-content-between">
                <Navbar.Brand href="/">Game reviews forum</Navbar.Brand>
                <Form inline>
                    {isLoggedIn() ? (
                        <Button variant="primary" onClick={handleShow}>
                            Add review
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={() => history.push("/login")}>
                            Login
                        </Button>
                    )}
                </Form>
            </Navbar>
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
                        <ReviewEditorDialog show={show} onHide={handleClose} />
                    </Route>
                </Switch>
            </Router>
        </>
    );
}

export default App;
