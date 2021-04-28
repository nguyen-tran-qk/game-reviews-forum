import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const Signup = () => {
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [signupError, setSignupError] = useState("");
    const MUTATION_SIGNUP = () => gql`
        mutation Register($username: String!, $password: String!) {
            register(username: $username, password: $password) {
                id
                username
                role
            }
        }
    `;
    const [signup, { data, error }] = useMutation(MUTATION_SIGNUP());

    useEffect(() => {
        if (data && data.register) {
            history.push("/login?signupSuccess=true");
        }
    }, [data, history]);

    useEffect(() => {
        if (error && (!signupError.length || signupError !== error.message)) {
            console.log(error.message);
            setSignupError(error.message);
        }
    }, [error, signupError]);

    const onSignup = () => {
        signup({ variables: { username, password } });
    };

    return (
        <Container fluid>
            <Row className="justify-content-md-center">
                <Col md={6} className="p-3">
                    <Card body>
                        <Card.Title>Join our community with millions of game reviews</Card.Title>
                        <Form>
                            <Form.Group controlId="signupUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="signupPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={onSignup}>
                                Sign me up
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Signup;
