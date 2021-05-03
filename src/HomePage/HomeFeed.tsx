import React, { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useHistory } from "react-router";
import { isLoggedIn } from "../utils/helpers";
import AddReviewDialog from "./AddReviewDialog";

const HomeFeed = () => {
    const history = useHistory();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Container fluid>
                <Row className="justify-content-md-center">
                    <Col xl={6} xs={10}>
                        <Row>
                            <Col md={8} className="align-middle">
                                <h1>Game reviews forum</h1>
                            </Col>
                            <Col md={4} className="align-middle">
                                {isLoggedIn() ? (
                                    <Button variant="primary" onClick={handleShow}>
                                        Add review
                                    </Button>
                                ) : (
                                    <Button variant="primary" onClick={() => history.push("/login")}>
                                        Login
                                    </Button>
                                )}
                            </Col>
                        </Row>
                        <Card body className="mb-3">
                            <Card.Title>Spider man: Miles Morales - Amazing but short fuse</Card.Title>
                            <span>by Mr.Anon</span>
                            <Card.Text>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque laoreet nulla ut neque vehicula, vel
                                luctus eros sollicitudin. Pellentesque non velit venenatis, lacinia nisl in, feugiat massa.
                            </Card.Text>
                            <Button variant="primary">View more</Button>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <AddReviewDialog show={show} onHide={handleClose} />
        </>
    );
};

export default HomeFeed;
