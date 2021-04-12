import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const Login = () => {
    const history = useHistory();

    return (
        <Container fluid>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card body>
                        <Card.Title>Login to Game Review Forum</Card.Title>
                        <Form>
                            <Form.Group controlId="loginUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter your username" />
                            </Form.Group>
                            <Form.Group controlId="loginPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter your password" />
                            </Form.Group>
                            <Button variant="primary" onClick={() => history.push('/')}>
                                Let me in
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
