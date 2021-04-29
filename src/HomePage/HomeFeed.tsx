import React, { useState } from "react";
import { Button, Card, Col, Container, Row, Modal, Form } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import { gql, useMutation } from "@apollo/client";

const MUTATION_ADD_GAME = () => gql`
    mutation AddGame(
        $title: String!
        $description: String
        $images: [String] = []
        $genres: [Genre]
        $price: Float
        $studio: String
        $publishedDate: String
    ) {
        addGame(
            title: $title
            description: $description
            images: $images
            genres: $genres
            price: $price
            studio: $studio
            publishedDate: $publishedDate
        ) {
            id
            title
        }
    }
`;

const HomeFeed = () => {
    const [show, setShow] = useState(false);
    const [gameTitle, setGameTitle] = useState("");
    const [addGame, { data, error }] = useMutation(MUTATION_ADD_GAME());

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onAddGame = () => {
        addGame({ variables: { title: gameTitle } });
    };

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
                                <Button variant="primary" onClick={handleShow}>
                                    Add review
                                </Button>
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
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add your review about a game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="addGameTitle">
                            <Form.Label>Title of the game</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Let everyone know what game you're reviewing"
                                value={gameTitle}
                                onChange={(e) => setGameTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="addGameDesc">
                            <Form.Label>Your review</Form.Label>
                            <Form.Control as="textarea" placeholder="What do you think about the game?" />
                        </Form.Group>
                        <Form.Group controlId="addGameRating">
                            <Form.Label>Rate the game</Form.Label>
                            <ReactStars
                                count={5}
                                isHalf
                                size={24}
                                emptyIcon={<i className="far fa-star"></i>}
                                halfIcon={<i className="fa fa-star-half-alt"></i>}
                                filledIcon={<i className="fa fa-star"></i>}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onAddGame}>
                        Share your review
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default HomeFeed;
