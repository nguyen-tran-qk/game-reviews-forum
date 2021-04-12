import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const Signup = () => {
    return (
        <Container fluid>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card body>
                        <Card.Title>Join our community with millions of game reviews</Card.Title>
                        <Form>
                            <Form.Group controlId="signupUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter your username" />
                            </Form.Group>
                            <Form.Group controlId="signupPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter your password" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
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
