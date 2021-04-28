import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useLazyQuery, gql } from "@apollo/client";
import { useQueryString } from "../utils/helpers";

const Login = () => {
    const history = useHistory();
    const queryString = useQueryString();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const QUERY_LOGIN = () => gql`
        query Login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
                id
                username
                role
                token
            }
        }
    `;
    const [login, { data, error }] = useLazyQuery(QUERY_LOGIN());

    useEffect(() => {
        if (data && data.login) {
            sessionStorage.setItem("grf_user", JSON.stringify(data.login));
            sessionStorage.setItem("grf_token", data.login.token);
            setTimeout(() => {
                history.push("/");
            }, 500);
        }
    }, [data, history]);

    useEffect(() => {
        if (error && (!loginError.length || loginError !== error.message)) {
            console.log(error.message);
            setLoginError(error.message);
        }
    }, [error, loginError]);

    const onLogin = () => {
        login({ variables: { username, password } });
    };

    return (
        <Container fluid>
            <Row className="justify-content-md-center">
                <Col md={6} className="p-3">
                    {!!loginError.length && <Alert variant="danger">{loginError}</Alert>}
                    {!!queryString.get("signupSuccess") && (
                        <Alert variant="success">Thank you for joining us. You can now login using the credentials you just created.</Alert>
                    )}
                    <Card body>
                        <Card.Title>Login to Game Review Forum</Card.Title>
                        <Form>
                            <Form.Group controlId="loginUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="loginPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={onLogin}>
                                Let me in
                            </Button>
                            <Button variant="link" onClick={() => history.push("/signup")}>
                                Don't have an account?
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
